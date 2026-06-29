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

```python
async def test_profile_read_uses_cache(profile_service: ProfileService, repository: ProfileRepository) -> None:
    await profile_service.get_profile("tenant-a", 10)
    await profile_service.get_profile("tenant-a", 10)

    assert repository.get_profile_calls == 1
```

## Review Questions

- What problem does caching solve?
- Is stale data acceptable?
- Which inputs affect result shape or visibility?
- Which writes refresh cached values?
- Are cached values detached from live resources?
- Is test isolation explicit?
