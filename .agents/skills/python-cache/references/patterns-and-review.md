# Python Cache Patterns And Review

Use this reference when designing or reviewing Python cache behavior.

## Decision Checklist

Add caching only when the repository shows:

- the operation is deterministic and read-oriented;
- bounded staleness is acceptable;
- the latency, cost, or frequency problem is clear;
- all inputs that affect the result are known;
- write paths that must refresh cached values are known;
- tests can cover repeated reads, refresh, and separate scopes.

If any answer is unknown, do not add caching yet.

## Placement

Preferred placement:

- service read methods returning DTOs or schemas;
- repository read projections returning scalar values, dictionaries, dataclasses, or DTOs.

Avoid caching routers by default. Avoid caching live ORM entities, sessions, connections, request objects, response objects, lazy loaders, or process-local runtime state.

## Good: Service-Level Read Cache

```python
from cashews import NOT_NONE, cache


class ProfileService:
    def __init__(self, repository: ProfileRepository) -> None:
        self.repository = repository

    @cache(
        ttl="5m",
        key="v1:tenant:{tenant_id}:profile:{profile_id}",
        tags=["tenant:{tenant_id}:profiles", "profile:{profile_id}"],
        condition=NOT_NONE,
        lock=True,
    )
    async def get_profile(self, tenant_id: str, profile_id: int) -> ProfileRead | None:
        profile = await self.repository.get_profile(tenant_id, profile_id)
        return ProfileRead.model_validate(profile) if profile else None
```

Why this is good:

- The cache is placed on a read-oriented service method.
- The key includes tenant and entity scope.
- The cached value is a detached read model.

## Bad: Route-Level Cache By Default

```python
from cashews import cache
from fastapi import APIRouter, Depends

router = APIRouter()


@router.get("/profiles/{profile_id}")
@cache(ttl="10m")
async def get_profile_route(
    profile_id: int,
    service: ProfileService = Depends(),
) -> ProfileRead:
    return await service.get_profile(profile_id)
```

Problems:

- The cache is attached to the HTTP boundary, not to a stable read model.
- Scope inputs such as tenant, role, locale, filters, or headers are easy to omit.
- The route hides cache behavior from service-level invalidation tests.

## Bad: Caching A Live Persistence Object

```python
from cashews import cache


class ProfileRepository:
    @cache(ttl="10m", key="v1:profile:{profile_id}")
    async def get_profile(self, profile_id: int) -> Profile:
        return await self.session.get(Profile, profile_id)
```

Problems:

- The value can be tied to a session lifecycle.
- Lazy relationships can behave incorrectly.
- Persistence models should not become cached API values.

## Naming, TTL, And Refresh

- Use explicit TTL.
- Use stable names based on business identifiers.
- Include result-shaping inputs such as tenant, user, filters, pagination, locale, feature flags, and schema version when relevant.
- Change schema version when the cached DTO shape changes.
- Refresh or remove cached values only after a successful write.
- Treat TTL as a fallback, not as the main consistency strategy for mutable data.

## Good: Scoped Key For User-Visible Data

```python
from cashews import cache


class ProfileSearchService:
    @cache(
        ttl="2m",
        key="v1:tenant:{tenant_id}:role:{role}:profiles:q:{query}:page:{page}:size:{size}",
        tags=["tenant:{tenant_id}:profiles"],
    )
    async def search_profiles(
        self,
        tenant_id: str,
        role: str,
        query: str,
        page: int,
        size: int,
    ) -> ProfilePage:
        return await self.repository.search_profiles(
            tenant_id=tenant_id,
            role=role,
            query=query,
            page=page,
            size=size,
        )
```

Why this is good:

- Tenant and role are part of the key.
- Pagination and query inputs are part of the key.
- The tag represents the aggregate invalidation scope.

## Bad: Key Missing Scope

```python
from cashews import cache


class ProfileSearchService:
    @cache(ttl="2m", key="v1:profiles:q:{query}")
    async def search_profiles(
        self,
        tenant_id: str,
        role: str,
        query: str,
    ) -> list[ProfileRead]:
        return await self.repository.search_profiles(tenant_id, role, query)
```

Problems:

- Different tenants can collide.
- Different roles can collide.
- Pagination, locale, or feature flags can be forgotten as the method grows.

## Good: Explicit Key For Class Method

```python
from cashews import cache


class PricingService:
    @cache(ttl="1m", key="v1:tenant:{tenant_id}:product:{product_id}:price")
    async def get_price(self, tenant_id: str, product_id: int) -> PriceRead:
        price = await self.repository.get_price(tenant_id, product_id)
        return PriceRead.model_validate(price)
```

Why this is good:

- The key uses business inputs only.
- Object identity is not part of the cache key.

## Bad: Implicit Method Key

```python
from cashews import cache


class PricingService:
    @cache(ttl="1m")
    async def get_price(self, product_id: int) -> PriceRead:
        price = await self.repository.get_price(product_id)
        return PriceRead.model_validate(price)
```

Problem: implicit method-key generation can include instance details or omit business scope that should be explicit.

## Good: Refresh After Write

```python
from cashews import cache


class ProfileService:
    async def update_profile(self, tenant_id: str, profile_id: int, data: ProfileUpdate) -> ProfileRead:
        async with self.unit_of_work.transaction():
            profile = await self.repository.update_profile(tenant_id, profile_id, data)
            result = ProfileRead.model_validate(profile)

        await cache.delete_tags(f"profile:{profile_id}")
        await cache.delete_tags(f"tenant:{tenant_id}:profiles")
        return result
```

Why this is good:

- Cache refresh happens after the write transaction has completed.
- Entity and aggregate scopes are both covered.

## Bad: Refresh Before The Transaction Outcome Is Known

```python
from cashews import cache


async def update_profile_bad(profile_id: int, data: ProfileUpdate) -> None:
    async with session.begin():
        await repository.update_profile(profile_id, data)
        await cache.delete_tags(f"profile:{profile_id}")
```

Problem: if the transaction rolls back later, the cache no longer reflects committed state.

## Bad: Broad Wildcard Deletion In Request Path

```python
from cashews import cache


async def update_profile_bad(profile_id: int, data: ProfileUpdate) -> None:
    await repository.update_profile(profile_id, data)
    await cache.delete_match("v1:profiles:*")
```

Problems:

- Wildcard deletion can scan a large keyspace.
- It can affect unrelated cached values.
- It hides the actual invalidation domain.

## Negative Caching

Use negative caching only when repeated missing reads are an observed problem.

```python
from cashews import cache


class ProfileService:
    @cache(ttl="20s", key="v1:profile-missing:{profile_id}")
    async def profile_exists(self, profile_id: int) -> bool:
        return await self.repository.profile_exists(profile_id)
```

Why this can be acceptable:

- The TTL is short.
- The value is a boolean, not a missing object payload.
- The behavior is explicit and easy to test.

## FastAPI Integration

When FastAPI is active:

- configure shared cache resources in application lifespan or the project resource manager;
- close cache resources during shutdown when required by the library;
- keep HTTP handlers thin;
- prefer service-level data caching for business endpoints;
- use HTTP cache middleware only when HTTP cache semantics are part of the task.

```python
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from cashews import cache
from fastapi import FastAPI


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    cache.setup(settings.CACHE_DSN, suppress=False)
    try:
        yield
    finally:
        await cache.close()


app = FastAPI(lifespan=lifespan)
```

## Testing

- Use an isolated backend for tests.
- Clear cache state between test cases when needed.
- Test repeated reads.
- Test refresh after create, update, or delete.
- Test separate scopes for different users, tenants, filters, or pagination.

## Good: Hit/Miss Test

```python
async def test_profile_read_uses_cache(
    profile_service: ProfileService,
    repository: ProfileRepository,
) -> None:
    await profile_service.get_profile("tenant-a", 10)
    await profile_service.get_profile("tenant-a", 10)

    assert repository.get_profile_calls == 1
```

## Good: Scope Separation Test

```python
async def test_profile_cache_is_scoped_by_tenant(
    profile_service: ProfileService,
    repository: ProfileRepository,
) -> None:
    await profile_service.get_profile("tenant-a", 10)
    await profile_service.get_profile("tenant-b", 10)

    assert repository.get_profile_calls == 2
```

## Good: Invalidation Test

```python
async def test_profile_update_refreshes_cache(
    profile_service: ProfileService,
    repository: ProfileRepository,
) -> None:
    await profile_service.get_profile("tenant-a", 10)
    await profile_service.update_profile("tenant-a", 10, ProfileUpdate(name="new"))
    await profile_service.get_profile("tenant-a", 10)

    assert repository.get_profile_calls == 2
```

## Review Questions

- What problem does caching solve?
- Is stale data acceptable?
- Which inputs affect result shape or visibility?
- Which writes refresh cached values?
- Are cached values detached from live resources?
- Is test isolation explicit?
