# Python NATS JetStream KV Cache Patterns And Review

Use this reference when designing, implementing, testing, or reviewing a distributed Python cache built directly on `nats-py` and NATS JetStream Key/Value.

## Decision checklist

Use NATS KV as a cache only when all of these are known:

- the authoritative source of the value;
- why multiple processes or application instances need shared cache state;
- acceptable staleness and outage behavior;
- every input that affects the returned value or its visibility;
- write paths that invalidate or refresh the value;
- bucket ownership and production provisioning policy;
- the installed `nats-py` and deployed `nats-server` versions;
- JetStream, account/domain, credentials, TLS, and lifecycle ownership;
- TTL, storage, replicas, limits, key namespace, codec, concurrency, and test strategy.

Do not add NATS KV merely because NATS already exists in the project. Core messaging and distributed cache are separate responsibilities.

The current public `nats.py` documentation marks KeyValue as experimental. Verify the installed version before copying signatures, exceptions, or configuration behavior from current documentation or source.

## Cache placement

Preferred placement:

- service or domain read methods returning detached DTOs;
- repository read projections returning scalars, mappings, dataclasses, or read models;
- a dedicated adapter injected into services.

Avoid:

- cache decisions in routers by default;
- caching live ORM entities, sessions, lazy loaders, requests, responses, NATS clients, or process-local objects;
- using the cache as the only copy of business state;
- making authorization depend on data that can be stale without an explicit policy.

## Bucket ownership modes

### Infrastructure-managed

Production infrastructure creates and configures the bucket. Application startup binds and validates only.

```python
async def bind_cache_bucket(
    jetstream: JetStreamContext,
    settings: NatsKvCacheSettings,
) -> KeyValue:
    kv = await jetstream.key_value(settings.bucket)
    status = await kv.status()
    validate_bucket_status(status, settings)
    return kv
```

Use this mode by default for shared production infrastructure.

### Application-managed

Application startup may create a missing bucket only when the project explicitly assigns ownership and supplies every required field supported by the installed `create_key_value` implementation.

```python
from nats.js.api import KeyValueConfig, StorageType
from nats.js.errors import BucketNotFoundError


async def bind_or_create_cache_bucket(
    jetstream: JetStreamContext,
    settings: NatsKvCacheSettings,
) -> KeyValue:
    try:
        kv = await jetstream.key_value(settings.bucket)
    except BucketNotFoundError:
        config = KeyValueConfig(
            bucket=settings.bucket,
            description=settings.description,
            history=settings.history,
            ttl=settings.ttl_seconds,
            max_bytes=settings.max_bytes,
            max_value_size=settings.max_value_size,
            storage=StorageType.FILE,
            replicas=settings.replicas,
            direct=settings.direct,
        )
        kv = await jetstream.create_key_value(config=config)

    validate_bucket_status(await kv.status(), settings)
    return kv
```

This example intentionally omits placement. Current `nats.py` source exposes `placement` on `KeyValueConfig`, but the current `create_key_value` implementation does not propagate it to the generated `StreamConfig`. Verify the installed version. When placement is mandatory and the public KV creation path does not apply it, use infrastructure-managed provisioning rather than direct `$KV.*` publishing or private client methods.

Do not pass only `bucket`, `history`, and `ttl` while silently accepting unlimited sizes, default replicas, or an unknown storage policy.

### Test-managed

Tests create unique bucket names and remove them after the test. Include worker and run identifiers:

```python
bucket = f"TEST_CACHE_{run_id}_{worker_id}_{test_id}"
```

Never point tests at a shared production bucket.

## Configuration validation

Compare the actual bucket status with declared expectations. Classify mismatches:

- fatal and non-editable;
- editable but infrastructure-owned;
- editable and explicitly application-owned;
- informational or client-version-dependent.

Do not mutate the backing `KV_<bucket>` stream merely because a value differs. Reconciliation requires explicit profile authorization and version-matched official evidence for each field.

Current `nats.py` source derives the backing stream's `duplicate_window` during `create_key_value`: it uses an internal default and reduces it when bucket TTL is shorter. This is client implementation behavior, not an independent cache policy. Do not add application startup code that recomputes and rewrites `duplicate_window` from TTL. Validate version compatibility instead.

The presence of a field on `KeyValueConfig` does not prove that the installed client propagates it. Integration tests must inspect the resulting `BucketStatus.stream_info.config` for every required setting.

## Typed settings

A settings model should expose project decisions rather than hide defaults:

```python
from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class NatsKvCacheSettings:
    bucket: str
    history: int
    ttl_seconds: float | None
    max_bytes: int
    max_value_size: int
    replicas: int
    direct: bool
    ownership: str
    provisioning_policy: str
    outage_policy: str
    max_batch_items: int
    max_batch_bytes: int
    batch_concurrency: int
```

Connection URLs, authentication, TLS, domain, and timeouts may live in shared NATS client settings rather than the cache-specific model, but their source must remain explicit in `CODEX_PROJECT.md`.

## Key construction

Good:

```python
def profile_key(
    *,
    schema_version: int,
    tenant_id: str,
    role: str,
    profile_id: int,
    locale: str,
) -> str:
    return (
        f"v{schema_version}.tenant.{tenant_id}.role.{role}."
        f"profile.{profile_id}.locale.{locale}"
    )
```

The key includes every stable input that affects visibility or shape.

Bad:

```python
def profile_key(profile_id: int) -> str:
    return f"profile.{profile_id}"
```

This can collide across tenants, roles, locales, feature flags, or schema versions.

Validate key length and NATS key syntax before making a network call. Current `nats.py` accepts a restricted character set and rejects empty keys and keys beginning or ending with a dot. Verify the installed implementation rather than duplicating a stale regular expression.

Do not place raw tokens, passwords, email addresses, or unbounded queries in a key. Normalize or hash bounded sensitive/high-cardinality inputs when the project contract requires them.

## Codec boundary

### Protocol

```python
from typing import Protocol


class CacheCodec[T](Protocol):
    def encode(self, value: T) -> bytes: ...
    def decode(self, value: bytes) -> T: ...
```

Adapt generic syntax to the project's declared Python version.

### JSON codec

```python
import json
from collections.abc import Callable
from typing import Any


class JsonCodec[T]:
    def __init__(
        self,
        *,
        to_json: Callable[[T], Any],
        from_json: Callable[[Any], T],
    ) -> None:
        self._to_json = to_json
        self._from_json = from_json

    def encode(self, value: T) -> bytes:
        return json.dumps(
            self._to_json(value),
            ensure_ascii=False,
            separators=(",", ":"),
            sort_keys=True,
        ).encode("utf-8")

    def decode(self, value: bytes) -> T:
        try:
            payload = json.loads(value.decode("utf-8"))
            return self._from_json(payload)
        except (UnicodeDecodeError, json.JSONDecodeError, TypeError, ValueError) as exc:
            raise CacheSerializationError("Invalid cached JSON value") from exc
```

The adapter must not use a generic conversion such as:

```python
bytes(integer)
bytes(list_value)
```

`bytes(integer)` allocates that number of zero bytes, and `bytes(list_value)` expects byte-range integers; neither is a general serialization contract.

Do not encode `None` as `b""` if empty bytes or an empty string can be valid. Use a typed envelope or a codec whose domain explicitly excludes `None`.

## Entry and revision

```python
from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True, slots=True)
class CacheEntry[T]:
    value: T
    revision: int
    created_at: datetime | None
```

Preserve the revision returned by NATS. It is part of the concurrency contract, not incidental metadata. The ordinary current `get()` path may not populate creation time; do not require metadata that the selected public API does not provide.

## Reads and misses

```python
from nats.js.errors import KeyNotFoundError


async def get_entry(self, key: str) -> CacheEntry[T] | None:
    self._validate_key(key)

    try:
        entry = await self._kv.get(key)
    except KeyNotFoundError:
        return None
    except Exception as exc:
        raise CacheUnavailableError("NATS KV read failed") from exc

    if entry.value is None or entry.revision is None:
        raise CacheSerializationError("Incomplete NATS KV entry")

    value = self._codec.decode(entry.value)
    return CacheEntry(
        value=value,
        revision=entry.revision,
        created_at=None,
    )
```

Adapt the low-level exception set to the installed `nats-py` version. Do not catch every exception and return `None`; an outage is not a cache miss.

Current public `nats.py` `KeyValue.get()` catches a delete marker and raises `KeyNotFoundError`. Ordinary reads therefore collapse never-created and deleted states. When the project needs delete operation metadata, use documented `watch` or `history` entries and verify their `operation` values. Do not call the private `_get` method.

## Unconditional put

```python
async def put(self, key: str, value: T) -> int:
    self._validate_key(key)
    encoded = self._codec.encode(value)
    self._validate_value_size(encoded)

    try:
        return await self._kv.put(key, encoded)
    except Exception as exc:
        raise CacheUnavailableError("NATS KV put failed") from exc
```

Use `put` only when last-write-wins is acceptable. Return the revision.

## Atomic create

```python
from nats.js.errors import KeyWrongLastSequenceError


async def create(self, key: str, value: T) -> int:
    self._validate_key(key)
    encoded = self._codec.encode(value)
    self._validate_value_size(encoded)

    try:
        return await self._kv.create(key, encoded)
    except KeyWrongLastSequenceError as exc:
        raise CacheConflictError(key=key) from exc
```

Do not implement create with `exists()` followed by `put()`; another writer can insert between those calls. Verify exact conflict exceptions against the installed client.

## Compare-and-set

```python
async def compare_and_set(
    self,
    key: str,
    value: T,
    *,
    expected_revision: int,
) -> int:
    self._validate_key(key)
    encoded = self._codec.encode(value)
    self._validate_value_size(encoded)

    try:
        return await self._kv.update(
            key,
            encoded,
            last=expected_revision,
        )
    except KeyWrongLastSequenceError as exc:
        raise CacheConflictError(
            key=key,
            expected_revision=expected_revision,
        ) from exc
```

## Good read-modify-write

```python
async def update_profile_name(
    cache: NatsKvCache[ProfileCacheValue],
    key: str,
    new_name: str,
    *,
    max_attempts: int,
) -> ProfileCacheValue:
    for attempt in range(max_attempts):
        entry = await cache.get_entry(key)
        if entry is None:
            raise CacheMissError(key)

        replacement = entry.value.with_name(new_name)

        try:
            await cache.compare_and_set(
                key,
                replacement,
                expected_revision=entry.revision,
            )
            return replacement
        except CacheConflictError:
            if attempt + 1 == max_attempts:
                raise

    raise AssertionError("unreachable")
```

The whole read/compute/CAS cycle is retried. The retry budget is bounded.

## Bad read-modify-write

```python
async def update_field_bad(key: str, field: str, value: object) -> None:
    data = await cache.get(key)
    data[field] = value
    await cache.put(key, data)
```

Two processes can read the same old value and overwrite each other's fields. An `exists()` check does not prevent this lost update.

## Batch terminology

Use these terms precisely:

- `bulk` or `put_many`: bounded execution of independent per-key operations;
- `batch result`: collection of per-key outcomes;
- `atomic aggregate`: one value stored under one key;
- `generation switch`: one CAS pointer that selects a fully written dataset;
- `transaction`: all-or-nothing multi-key behavior, which the base KV adapter does not provide.

Do not call a bulk helper `atomic_update_many`.

## Batch result contract

```python
from dataclasses import dataclass
from typing import Literal


@dataclass(frozen=True, slots=True)
class BatchItemSuccess:
    key: str
    revision: int


@dataclass(frozen=True, slots=True)
class BatchItemFailure:
    key: str
    kind: Literal[
        "conflict",
        "unavailable",
        "serialization",
        "invalid_key",
        "unverified",
        "unknown",
    ]
    retryable: bool


@dataclass(frozen=True, slots=True)
class BatchWriteResult:
    succeeded: tuple[BatchItemSuccess, ...]
    failed: tuple[BatchItemFailure, ...]
```

One item may succeed while another fails or conflicts. The result must preserve that fact.

## Bounded bulk put

A semaphore limits active calls, but creating one task per item can still consume excessive memory for very large collections. Use this shape only after enforcing a small declared maximum item count:

```python
import asyncio
from collections.abc import Mapping


async def put_many(
    cache: NatsKvCache[T],
    values: Mapping[str, T],
    *,
    concurrency: int,
) -> BatchWriteResult:
    validate_batch_limits(values)
    reject_duplicate_or_invalid_keys(values)
    semaphore = asyncio.Semaphore(concurrency)

    async def put_one(key: str, value: T) -> BatchItemSuccess | BatchItemFailure:
        async with semaphore:
            try:
                revision = await cache.put(key, value)
                return BatchItemSuccess(key=key, revision=revision)
            except CacheConflictError:
                return BatchItemFailure(key, "conflict", True)
            except CacheUnavailableError:
                return BatchItemFailure(key, "unavailable", True)
            except CacheSerializationError:
                return BatchItemFailure(key, "serialization", False)

    results = await asyncio.gather(
        *(put_one(key, value) for key, value in values.items())
    )

    return BatchWriteResult(
        succeeded=tuple(item for item in results if isinstance(item, BatchItemSuccess)),
        failed=tuple(item for item in results if isinstance(item, BatchItemFailure)),
    )
```

For larger inputs, use a bounded worker queue or async iterator so the number of scheduled tasks is bounded as well as the number of active network calls.

## Bad unbounded bulk write

```python
await asyncio.gather(
    *(cache.put(key, value) for key, value in arbitrary_mapping.items())
)
```

Problems:

- creates unbounded tasks;
- has no total payload limit;
- can overwhelm the connection or server;
- commonly exposes only one raised exception;
- hides successful writes completed before another item failed;
- encourages a false all-or-nothing interpretation.

## Duplicate keys

Reject duplicate keys for CAS batches. For unconditional put batches, reject duplicates by default. A deterministic collapse policy may be used only when declared before execution and tested.

Do not schedule concurrent operations against the same key and rely on task completion order.

## Per-key CAS batch

Each update requires its own expected revision:

```python
from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class CasWrite[T]:
    key: str
    value: T
    expected_revision: int
```

One item may succeed while another conflicts. Return both outcomes. Do not promise rollback of the successful item.

## Atomic aggregate pattern

Related values that require one consistency boundary should be stored together:

```text
v2.tenant.42.product.100.pricing
```

```json
{
  "schema_version": 2,
  "price": "100.00",
  "currency": "RUB",
  "discount": "0.05"
}
```

Replace the aggregate with one CAS operation. Keep the aggregate below the declared maximum value size and avoid unbounded documents.

## Generation and manifest pattern

For a large coherent dataset:

```text
catalog.generation.42.item.1
catalog.generation.42.item.2
catalog.generation.42.item.3
catalog.active_generation
```

Workflow:

1. allocate a unique generation identifier;
2. write all generation entries with bounded bulk operations;
3. verify that every required entry succeeded;
4. CAS-update the single `active_generation` pointer;
5. retain the previous generation for a grace period;
6. clean orphaned and expired generations in a separate bounded maintenance flow.

Readers first load the pointer, then read only that generation. They must tolerate the old generation during the grace period.

This pattern provides an atomic visibility switch, not a multi-key transaction. Failure before pointer update leaves an unused generation that must be cleaned later.

## Transactional source-of-truth pattern

When multiple values must commit or roll back together for correctness:

1. perform the transaction in the database or another transactional authority;
2. commit;
3. invalidate exact cache keys, replace an aggregate, or publish a new generation;
4. treat cache refresh failure according to the outage policy.

Do not move the business transaction into KV merely to avoid database coordination.

## Stream-level atomic batch publishing

NATS Server introduced `AllowAtomicPublish` for streams. The base `nats.py` `KeyValue` API exposes per-key operations, not a portable KV `update_many` transaction.

Do not:

- publish manually to `$KV.<bucket>.<key>`;
- reproduce KV headers and CAS protocol in application code;
- enable `AllowAtomicPublish` on the backing stream and claim the standard KV adapter is transactional;
- rely on another language client's implementation as evidence for Python support.

A future advanced profile may permit an official client abstraction only after matching server and client versions, KV compatibility, failure semantics, and real-cluster tests are documented.

## Unverified writes

A timeout or lost connection after publishing can leave the client unable to determine whether the server committed the write.

Do not automatically classify every such result as failed and retry unconditionally. Depending on the operation:

- re-read the key and compare an idempotency marker or expected value;
- expose an `unverified` outcome;
- retry only when the operation and project policy make the retry safe.

Per-key unverified outcomes are especially important in bulk APIs.

## Invalidation after commit

Good:

```python
async def update_profile(
    service: ProfileService,
    cache: NatsKvCache[ProfileRead],
    tenant_id: str,
    profile_id: int,
    update: ProfileUpdate,
) -> ProfileRead:
    async with service.unit_of_work.transaction():
        result = await service.repository.update_profile(
            tenant_id=tenant_id,
            profile_id=profile_id,
            update=update,
        )

    await cache.delete(
        profile_key(
            schema_version=2,
            tenant_id=tenant_id,
            role="shared",
            profile_id=profile_id,
            locale="all",
        )
    )
    return result
```

Bad:

```python
async with unit_of_work.transaction():
    await repository.update_profile(profile_id, update)
    await cache.delete(cache_key)
```

If the transaction later rolls back, invalidation no longer reflects committed state.

## Delete and purge distinctions

Keep separate adapter methods or administrative boundaries for:

- delete one key by adding a delete marker;
- purge one key and its revisions;
- clean old delete markers;
- purge all entries from a bucket;
- delete the bucket and backing stream.

Ordinary application invalidation should normally use exact-key delete. Bucket purge and deletion are administrative operations and require `external-system-only` authorization when performed live.

Current public `KeyValue.get()` maps delete markers to `KeyNotFoundError`. Use watcher or history entries when the application needs to observe `DEL` or `PURGE`; do not call private methods.

## Watch-assisted local L1 cache

A watcher can invalidate a process-local L1 cache, but it needs:

- one lifecycle owner;
- bounded local cache size and TTL;
- startup synchronization;
- reconnect and resubscribe behavior;
- slow-consumer/error handling;
- a full local-cache reset when event continuity is uncertain;
- tests with multiple clients.

Do not rely on the watcher as the only source of truth. On uncertainty, clear or rebuild the local L1 cache.

## FastAPI lifecycle

```python
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from nats.aio.client import Client as NatsClient


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    nc = NatsClient()
    await nc.connect(**build_nats_connect_options(settings))

    try:
        jetstream = nc.jetstream(domain=settings.nats_domain)
        cache = await create_nats_kv_cache(jetstream, settings.cache)
        app.state.nats_client = nc
        app.state.nats_kv_cache = cache
        yield
    finally:
        await nc.drain()
```

Use the project's established resource container or dependency pattern. Do not create connections in request dependencies.

## Unit tests

Cover:

- key normalization and rejection;
- codec round trips and malformed data;
- distinct `None`, empty bytes, empty text, false, zero, empty list, and empty mapping behavior as applicable;
- miss behavior and public `get()` treatment of delete markers;
- deleted operation metadata through watcher/history when required;
- unavailable backend and secret-safe errors;
- revision return;
- create conflict;
- CAS success, conflict, and bounded retry;
- value and batch size limits;
- duplicate-key rejection;
- bounded concurrency and per-key batch results;
- post-commit invalidation.

Test the adapter contract. Avoid tightly mocking undocumented internal attributes of `nats-py`.

## Integration tests

Use a real JetStream-enabled server and two independent clients.

Cover:

- infrastructure-managed bind and validation;
- application-managed create-if-missing when active;
- actual propagation of every required `KeyValueConfig` field;
- TTL expiration and resulting backing stream configuration;
- exact-key delete and documented deleted-state observation;
- revisions and CAS conflict between two clients;
- prevention of lost updates;
- reconnect and shutdown;
- watcher recovery when used;
- bulk partial completion and generation switching;
- unique bucket isolation and cleanup.

For `pytest-xdist`, derive bucket names from a run identifier and `PYTEST_XDIST_WORKER`. Do not share one mutable bucket between workers unless the test intentionally verifies concurrency.

Clustered replicas, placement, direct reads, mirrors, acknowledgement loss, and stream-level atomic publish require dedicated environment-specific tests.

## Review red flags

Stop and correct the implementation when you find:

- generic `Any` serialization that maps unrelated Python types to bytes;
- `bytes(int)` or `bytes(list)` used as a cache codec;
- `None` and empty bytes using the same representation without an explicit contract;
- revisions discarded from writes;
- `exists -> put` used for create;
- `get -> modify -> put` used for concurrent mutable values;
- unexpected errors converted to misses or `False`;
- ordinary `get()` claimed to distinguish delete markers;
- private `_get` used to bypass public API semantics;
- generic `Exception` as the public adapter contract;
- application startup silently rewriting production stream configuration;
- application code manually synchronizing `duplicate_window` from TTL;
- a `KeyValueConfig` field assumed to propagate without version-matched verification;
- unlimited bucket or value sizes accepted without review;
- unbounded `asyncio.gather` for bulk writes;
- one boolean returned for a partially completed bulk operation;
- duplicate keys scheduled concurrently;
- a bulk helper advertised as atomic across keys;
- direct `$KV.*` publishing;
- bucket purge used as ordinary invalidation;
- integration tests pointed at a production account.

## Final checklist

- [ ] Cache suitability and authoritative fallback are documented.
- [ ] Bucket ownership and configuration are explicit.
- [ ] Version-matched official sources and experimental API status were checked.
- [ ] Required `KeyValueConfig` propagation was verified for the installed client.
- [ ] Application code does not manually rewrite `duplicate_window` from TTL.
- [ ] Shared NATS lifecycle and secret handling follow project policy.
- [ ] Key scope and codec are deterministic and typed.
- [ ] Values remain detached from runtime and persistence resources.
- [ ] Revisions and CAS protect mutable updates.
- [ ] Miss, conflict, unavailable, serialization, and unverified outcomes are distinct.
- [ ] Deleted-state behavior uses documented watcher/history APIs when required.
- [ ] Bulk operations have limits, backpressure, per-key results, and no transaction claim.
- [ ] Aggregate or generation patterns protect related values when needed.
- [ ] Invalidation occurs after authoritative commit.
- [ ] Unit and real-NATS integration tests cover the selected behavior.
