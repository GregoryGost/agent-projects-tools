---
name: python-nats-kv-cache
description: "Use for Python distributed cache design with nats-py and NATS JetStream Key/Value, including revisions, CAS, batch boundaries, lifecycle, and tests."
---

# Python NATS JetStream KV Cache

## Activation

Use this skill only when at least one allowed project-profile signal selects it:

- `python-nats-kv-cache` is listed exactly in `Active Skills`;
- `python-nats-kv-cache` is listed in `Active Stack Profiles`;
- the enabled Python NATS KV cache profile names the exact `python_nats_kv_cache.md + python-nats-kv-cache` rule/skill pair.

A target-project task that merely mentions NATS, JetStream, caching, or Key/Value does not activate this skill by itself. When the specialized profile is missing, incomplete, disabled, set to `none`, or inconsistent with repository evidence, report a profile error instead of applying this skill. Template-repository maintenance may review or edit this package directly under Template Repository Mode.

This skill is specific to direct `nats-py` use of NATS JetStream Key/Value as a distributed cache. It does not cover Core NATS messaging, JetStream consumers, Object Store, Redis, `cashews`, or another cache library.

## Required Dependencies

- `python-core`
- `.codex/rules/python_nats_kv_cache.md`

## Optional Coordination

Apply additional active skills only when the task touches their area:

- `python-testing` for pytest, pytest-asyncio, fakes, integration fixtures, and coverage;
- `python-service-e2e-testing` for process-boundary tests with a real NATS server or cluster;
- `python-fastapi-expert` for lifespan, dependency injection, application resources, shutdown, and API behavior;
- `python-backend-security` for credentials, NATS permissions, tenant isolation, cache poisoning, logging, and secret handling;
- `python-sqlalchemy-core` and the active database-specific skill for post-commit invalidation and source-of-truth transaction boundaries.

Do not apply the `python-cashews-cache` skill to NATS KV behavior. `python-cashews-cache` is the separate `cashews` profile.

## References

Load references when needed:

- `references/patterns-and-review.md` for adapter contracts, codecs, revisions, CAS, batch operations, generation pointers, lifecycle, and tests;
- `references/official-sources.md` for official NATS and `nats.py` source precedence, version checks, KV semantics, and stream-level feature boundaries.

## Profile discovery

Before changing NATS KV cache behavior:

1. Read `CODEX_PROJECT.md` and confirm the exact active rule/skill pair.
2. Read dependency metadata and resolve the installed `nats-py` version.
3. Resolve the deployed `nats-server` version, JetStream availability, account/domain, and environment from declared sources.
4. Locate connection, authentication, TLS, bucket, timeout, and lifecycle settings without printing secrets.
5. Confirm bucket ownership and whether application code may only bind, create if missing, or reconcile approved fields.
6. Confirm history, TTL, storage, replicas, placement policy, direct reads, size limits, key namespace, codec, invalidation, outage, and batch policies.
7. Inspect all cache callers, authoritative read/write paths, transaction boundaries, tests, and deployment assumptions.
8. Check the installed `nats-py` source or matching official documentation for configuration propagation and public exception behavior.
9. Use project-declared validation commands.

The current public `nats.py` documentation marks KeyValue functionality as experimental. Do not infer production infrastructure configuration or stable API behavior from a sample class, current defaults, or a different client version.

## Design workflow

1. Decide whether the data is suitable for a reconstructible cache and identify the authoritative fallback.
2. Identify every input that affects visibility or the returned value.
3. Define the stable key namespace and schema version.
4. Select a typed deterministic codec and define corrupt-value behavior.
5. Define TTL, size limits, bucket ownership, provisioning, and lifecycle.
6. Select `put`, `create`, or revision-based `update` deliberately.
7. Define invalidation after the authoritative transaction succeeds.
8. Define degraded-mode behavior for NATS unavailability and unverified writes.
9. Define whether bulk operations are allowed, their limits, and their partial-completion contract.
10. Add unit and real-NATS integration tests for the selected behavior.

## Adapter contract

Prefer one adapter boundary that owns NATS-specific details and exposes stable project-level types.

A typical Python 3.14 interface separates values, entries, revisions, and codecs:

```python
from dataclasses import dataclass
from datetime import datetime
from typing import Protocol


@dataclass(frozen=True, slots=True)
class CacheEntry[T]:
    value: T
    revision: int
    created_at: datetime | None


class CacheCodec[T](Protocol):
    def encode(self, value: T) -> bytes: ...
    def decode(self, value: bytes) -> T: ...


class NatsKvCache[T]:
    async def get_entry(self, key: str) -> CacheEntry[T] | None: ...
    async def get(self, key: str) -> T | None: ...
    async def put(self, key: str, value: T) -> int: ...
    async def create(self, key: str, value: T) -> int: ...
    async def compare_and_set(
        self,
        key: str,
        value: T,
        expected_revision: int,
    ) -> int: ...
    async def delete(self, key: str) -> None: ...
```

Adapt names and generic syntax to the project's declared Python version, but preserve these semantics:

- encoded values are bytes;
- reads may expose the revision;
- `put` is unconditional;
- `create` is only-if-absent;
- compare-and-set requires an expected revision;
- delete, purge, and bucket operations remain distinct;
- low-level NATS exceptions do not leak outside the adapter unless project policy explicitly selects them as the public contract.

## Codec requirements

Use dedicated codecs such as:

- `JsonCodec[T]` for validated JSON-compatible DTOs;
- `TextCodec` for UTF-8 text;
- `BytesCodec` for opaque bytes;
- a project-specific codec with an explicit content type and schema version.

Do not implement one implicit `Any -> bytes -> Any` conversion function that guesses types. Ensure that `None`, `b""`, `""`, `0`, `False`, `[]`, and `{}` cannot collapse into the same representation when they are valid values.

For JSON:

- serialize models or DTOs, not live ORM entities;
- use a stable envelope when schema version, content type, or creation metadata is required;
- validate decoded structure before returning it to callers;
- translate malformed or incompatible values to a typed serialization error or explicitly declared miss-and-rebuild policy.

## Bucket lifecycle

Prefer binding and validation in production:

```python
kv = await jetstream.key_value(bucket_name)
status = await kv.status()
validate_bucket_status(status, expected_config)
```

Create-if-missing is acceptable only when the specialized profile assigns bucket ownership to the application and all required limits supported by the installed `create_key_value` implementation are supplied through `KeyValueConfig`.

Do not assume every field exposed by `KeyValueConfig` is propagated by every `nats-py` version. Verify the installed implementation. If placement or another required setting is not applied by the public KV creation path, provision the backing stream through the infrastructure-owned process rather than patching private KV protocol behavior.

Current `nats-py` source derives the backing stream's duplicate window from bucket TTL during `create_key_value`. Treat this as a client implementation detail: do not add a second startup routine that independently rewrites `duplicate_window` from TTL.

Do not update the backing stream automatically to force undeclared settings. If approved reconciliation is required, compare the actual and declared configuration, change only supported editable fields, log safe before/after summaries, and verify the resulting status.

## Revisions and mutable values

Preserve revisions returned by `put`, `create`, and `update`.

Use CAS for mutable values:

1. read the entry and its revision;
2. decode and compute the replacement;
3. call `update(key, encoded_value, last=revision)`;
4. on `KeyWrongLastSequenceError`, either return a typed conflict or repeat the whole read/compute/CAS cycle within the declared bounded retry budget.

Do not retry only the final `update` with the same stale revision. Do not implement a field update by calling `exists`, `get`, mutating a decoded dictionary, and then using unconditional `put`.

## Batch operations

Treat batch as bounded concurrent execution of independent per-key operations, not as a KV transaction.

A bulk API should expose per-key outcomes:

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

Required behavior:

- reject or deterministically normalize duplicate keys before scheduling;
- enforce maximum item count and total encoded bytes;
- use bounded concurrency rather than unbounded `asyncio.gather`;
- preserve each successful revision;
- report conflicts and uncertain acknowledgement outcomes separately;
- retry only eligible individual operations within declared limits;
- never claim rollback or all-or-nothing semantics.

For related values that must change atomically, prefer one aggregate value under one key. For a large coherent dataset, write versioned generation keys and switch one manifest pointer with CAS only after the generation is complete. Use a transactional source of truth when cross-key atomicity is a correctness requirement.

Do not publish directly to `$KV.*` subjects. Stream-level atomic batch publishing is outside this base skill and requires a separate version-matched advanced profile and official client abstraction.

## Error and deleted-state contract

Define stable project errors for at least:

- configuration mismatch or missing bucket;
- backend unavailable, timeout, authorization, or JetStream failure;
- invalid key;
- serialization or schema failure;
- revision conflict;
- unverified write outcome.

A missing or deleted key may become a cache miss according to the adapter contract. Other failures must not silently become misses.

Current public `nats-py` `KeyValue.get()` maps delete markers to `KeyNotFoundError`; ordinary `get()` therefore does not distinguish never-created and deleted keys. When the distinction is required, use a documented watcher or history operation and verify its entry operation field against the installed version. Do not call private `_get` methods.

Use `raise` to preserve the current traceback. Use `raise ProjectCacheError(...) from exc` when translating a lower-level failure.

## Invalidation and consistency

- Invalidate only after the authoritative transaction commits.
- Prefer exact-key deletion, aggregate replacement, namespace versioning, or generation switching.
- Do not scan and delete a broad wildcard keyspace in a request path.
- Do not purge or delete the bucket for ordinary cache invalidation.
- Treat direct reads, mirrors, replicas, and read-your-writes requirements as explicit profile choices.
- Use watchers for local L1 invalidation only with an owner, restart strategy, slow-consumer handling, and full resynchronization path.

## Testing workflow

Unit tests should use a project adapter protocol or focused fake rather than mocking arbitrary internal methods of `nats-py`.

Integration tests should use a real JetStream-enabled NATS process and cover:

- bind and approved create-if-missing behavior;
- bucket configuration validation and installed-client propagation of required fields;
- misses, codecs, TTL, and exact-key invalidation;
- deleted-state behavior through documented watcher/history APIs when required;
- revisions, `create`, CAS success, CAS conflict, and two-client lost-update prevention;
- bounded batch concurrency, duplicate rejection, partial completion, and unverified outcomes where reproducible;
- reconnect and shutdown behavior;
- watcher recovery when watchers are active;
- unique bucket isolation and cleanup per test and `pytest-xdist` worker.

Use Testcontainers, Docker Compose, a project-owned test process, or another declared real dependency boundary. Never run integration tests against production NATS accounts.

## Review checklist

- [ ] An allowed profile signal activated the exact NATS KV rule/skill pair.
- [ ] Installed `nats-py` and deployed `nats-server` versions were verified from declared sources.
- [ ] Experimental and version-sensitive `nats.py` behavior was checked against official documentation and source.
- [ ] JetStream, environment, account/domain, authentication, TLS, and lifecycle ownership are explicit.
- [ ] The bucket is a reconstructible cache rather than the system of record.
- [ ] Bucket ownership, provisioning, history, TTL, limits, storage, replicas, placement policy, and direct reads are declared.
- [ ] Application code does not manually resynchronize `duplicate_window` from TTL.
- [ ] Keys contain all visibility-affecting scope and no secrets.
- [ ] A deterministic typed codec preserves distinct values and schema versions.
- [ ] Revisions are returned and mutable updates use CAS.
- [ ] Availability failures are not hidden as cache misses.
- [ ] Deleted-state claims use documented watcher/history behavior rather than ordinary `get()` or private APIs.
- [ ] Invalidation follows successful authoritative commits.
- [ ] Batch operations are bounded and report per-key outcomes without transactional claims.
- [ ] Related values use an aggregate key, generation pointer, or transactional source of truth when required.
- [ ] Direct `$KV.*` publishing and implicit stream-level atomic batch shortcuts are absent.
- [ ] Unit and real-NATS integration tests cover concurrency, lifecycle, errors, and cleanup.
