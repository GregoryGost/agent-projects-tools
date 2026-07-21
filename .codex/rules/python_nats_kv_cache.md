# Python NATS JetStream KV cache rules

Apply this rule only when at least one allowed project-profile signal selects it:

- `python_nats_kv_cache.md` is listed exactly in `Active Rules`;
- `python-nats-kv-cache` is listed in `Active Stack Profiles`;
- the enabled Python NATS KV cache profile names the exact `python_nats_kv_cache.md + python-nats-kv-cache` rule/skill pair.

The source rule file remains `.codex/rules/python_nats_kv_cache.md`; activation through `Active Rules` uses the bare rule filename defined by `.codex/project.template.md`.

A target-project task that merely mentions NATS, JetStream, caching, or Key/Value does not activate this rule by itself. When the specialized profile is missing, incomplete, disabled, set to `none`, or incompatible with repository evidence, report a profile error instead of applying this rule. Template-repository maintenance may review or edit this source rule directly under Template Repository Mode.

## Scope

This rule governs Python distributed caching implemented directly through `nats-py` and NATS JetStream Key/Value.

It covers:

- NATS client and JetStream KV lifecycle;
- bucket binding, provisioning, validation, and approved configuration reconciliation;
- cache keys, codecs, schema versions, TTL, limits, invalidation, and watchers;
- per-key revisions, `create`, compare-and-set updates, and conflict handling;
- bounded bulk operations and multi-key consistency boundaries;
- degraded-mode behavior, observability, tests, and production review.

It does not govern:

- Core NATS publish/subscribe or request/reply;
- JetStream consumers, work queues, stream processing, or Object Store;
- NATS KV as the authoritative system of record;
- Redis, Memcached, `cashews`, `functools`, `cachetools`, or another cache library;
- distributed locks, leader election, counters, or coordination as independent application features.

Use separate profiles for those areas.

## Required skills

Use together with:

- `python-core`;
- `python-nats-kv-cache`.

Apply `python-testing`, `python-service-e2e-testing`, `python-fastapi-expert`, `python-backend-security`, database skills, and other active overlays only when the task touches their areas.

## Profile validity

The specialized Python NATS KV cache profile is valid only when all required values are declared and consistent with repository evidence:

- Python NATS KV cache is enabled;
- cache technology is NATS JetStream Key/Value;
- the `nats-py` dependency and version source are declared;
- the NATS server version source and JetStream availability are declared;
- instance, account/domain, connection, authentication, and TLS sources are declared;
- bucket name source, ownership, provisioning policy, lifecycle owner, and outage policy are declared;
- history, TTL, storage, replicas, size limits, key scope, codec, invalidation, concurrency, and batch policies are declared;
- the exact `python_nats_kv_cache.md + python-nats-kv-cache` pair is named.

Do not infer missing values from reachable infrastructure, prior conversations, environment variables, or a sample implementation. Repository evidence may support a proposed profile update, but it does not activate an incomplete profile.

## Request mode boundary

- Use `implementation` when creating or changing NATS KV adapter code, settings, tests, application wiring, or repository documentation.
- Use `documentation-only` when only rules, skills, profiles, references, or documentation are changed.
- Use `external-system-only` for direct operations against live NATS infrastructure, including bucket creation, configuration changes, purge, deletion, account inspection, or other remote mutations.
- A repository change does not authorize a live NATS operation.
- A live NATS read or mutation does not authorize repository changes.
- Before a live operation, resolve the exact environment, server/account/domain, bucket, requested action, bounded scope, approved client or administrative boundary, and credential source.

## Version and source boundary

Before version-sensitive implementation:

1. Read `CODEX_PROJECT.md` and repository dependency metadata.
2. Resolve the installed `nats-py` version and the deployed `nats-server` version from declared sources.
3. Verify JetStream is enabled for the selected account/domain.
4. Check the matching official NATS and `nats.py` documentation before relying on an API or server feature.
5. Do not transfer behavior from another language client or a newer server/client version without matching evidence.

The base profile uses the public `nats.js.kv.KeyValue` and `KeyValueConfig` abstractions. Stream-level features do not become KV features merely because KV buckets are backed by streams.

## Cache role and source of truth

- Treat the bucket as a reconstructible cache, not the sole copy of business-critical data.
- Define the authoritative fallback source before enabling the cache.
- Do not use NATS KV as a transaction boundary for database or domain invariants.
- Cache only data for which bounded staleness and rebuild or fallback behavior are acceptable.
- Do not make correctness depend on immediate read-after-write unless the selected read path and deployment prove that guarantee.

NATS KV provides monotonic reads and writes, but direct reads served by followers or mirrors do not guarantee read-your-writes. The profile must declare the direct-read policy and any stronger consistency requirement.

## Bucket ownership and configuration

Choose exactly one bucket ownership mode:

- `infrastructure-managed`: infrastructure creates and configures production buckets; application code binds and validates;
- `application-managed`: application code may create a missing bucket and reconcile only explicitly approved editable fields;
- `test-managed`: tests create uniquely named buckets and clean them up.

Rules:

- Prefer `infrastructure-managed` for production unless project policy explicitly assigns ownership to the application.
- Do not silently create, purge, delete, or reconfigure a production bucket.
- Do not mutate the backing `KV_<bucket>` stream directly unless a separately reviewed advanced profile explicitly authorizes the exact stream-level operation.
- Do not derive `duplicate_window` from cache TTL; message de-duplication and value expiration are separate concerns.
- Validate declared `history`, `ttl`, `max_bytes`, `max_value_size`, `storage`, `replicas`, placement, and direct-read settings.
- Use `history=1` for ordinary cache semantics unless the project explicitly needs and tests history.
- Enforce bounded bucket and value sizes. Unlimited defaults are not a production sizing policy.
- Treat bucket TTL as bucket-wide. Do not promise independent per-key TTL through the standard `KeyValueConfig` API.
- Use separate buckets for materially different TTL classes or select another backend when per-key expiration is required.

## Client and lifecycle ownership

- Use one project-owned NATS connection and JetStream context per application lifecycle unless repository evidence requires another design.
- Do not create a NATS connection for each cache call.
- Initialize and validate the bucket before serving cache-dependent work.
- Drain or close the client through the declared application lifecycle owner.
- Keep connection URLs, credentials, JWTs, seeds, NKeys, TLS material, and account details in approved settings or secret providers.
- Do not log credentials or expose topology and account details through public errors.

## Keys, values, and codecs

- NATS KV values are bytes. Use an explicit typed codec boundary.
- Do not infer Python value types from byte content.
- Do not use `bytes(int)` as integer serialization or `bytes(list)` as generic list serialization.
- Keep `None`, empty bytes, empty string, zero, false, empty list, and empty object distinguishable when they are valid values.
- Use deterministic serialization for compare-and-set and reproducible tests.
- Include a schema version in keys or encoded envelopes when value shape can change.
- Include every visibility- or result-affecting input in the key: tenant, user, role, permissions, locale, filters, pagination, feature flags, and domain identifiers as applicable.
- Do not put raw tokens, passwords, secrets, emails, or unbounded personal data in keys.
- Validate keys against NATS key/subject constraints before remote calls.
- Cache detached DTOs, schemas, dataclasses, mappings, sequences, text, bytes, or scalar values; never cache live ORM entities, sessions, requests, responses, connections, or process-local runtime objects.

## Single-key writes and revisions

- `put` is an unconditional last-write-wins operation for one key.
- `create` is an atomic only-if-absent operation for one key.
- `update` must use the expected latest revision for per-key compare-and-set.
- Return or preserve the resulting revision rather than discarding it.
- Any read-modify-write operation must use the revision read with the value and perform a bounded CAS retry or return a typed conflict.
- Do not implement mutable JSON-field updates as `get -> modify -> put`; concurrent writers can lose updates.
- Do not use `exists -> put` as an atomic create check.
- Keep conflict handling separate from availability and serialization failures.

## Batch and multi-key operations

NATS KV operations are atomic only for one key and one revision in the base profile.

Allowed:

- bounded concurrent bulk `put`, `create`, CAS update, or exact-key delete for logically independent keys;
- partial completion when the project explicitly allows it;
- a per-key result containing success revision, conflict, failure, or unverified outcome;
- bounded per-item retries when the operation is safe and the retry policy is declared.

Forbidden by default:

- presenting a multi-key bulk operation as a transaction;
- returning one aggregate success flag that hides partial completion;
- assuming all-or-nothing rollback across keys;
- concurrent operations for duplicate keys in the same batch;
- unbounded `asyncio.gather` over an arbitrary key set;
- read-modify-write batches without per-key revisions;
- direct publishing to `$KV.*` subjects to bypass the `KeyValue` API;
- enabling stream-level atomic batch publishing as an implicit KV capability.

Every bulk operation must define:

- maximum item count;
- maximum total encoded bytes;
- concurrency limit and backpressure;
- per-item timeout and overall deadline;
- duplicate-key policy;
- retry budget;
- partial-completion policy;
- per-key result and observability contract.

When multiple fields must change atomically, store one logical aggregate under one key and replace it through CAS.

When a large dataset requires an atomic visibility switch, write a new generation under versioned keys, verify all entries, then switch one manifest or active-generation key through CAS. Keep the old generation for a grace period and clean orphaned generations separately.

When cross-key atomicity is a business correctness requirement, perform the transaction in the authoritative transactional store and treat NATS KV as a post-commit cache or invalidation target.

JetStream `AllowAtomicPublish`, introduced at the stream layer, is outside the base KV profile. It may be considered only through a separately verified advanced profile that declares matching server/client support, preserves KV and CAS semantics, uses an official client abstraction, and has real-cluster integration tests. Hand-built protocol publishing is not allowed.

## Reads, misses, deletions, and errors

- Distinguish a missing key from a deleted key when the application contract needs that difference.
- A missing or deleted cache entry may map to a cache miss according to the adapter contract.
- Do not convert connection, timeout, authorization, JetStream, configuration, or decoding failures into cache misses.
- Translate low-level failures into stable typed errors such as configuration, unavailable, serialization, conflict, invalid-key, and unverified-write errors.
- Use ordinary `raise` when re-raising the current exception; preserve causes with `raise ... from exc` when translating.
- Do not suppress unexpected errors in `exists` or similar convenience methods.
- Treat a lost acknowledgement or timeout after a write as potentially unverified rather than definitely failed when the server may have committed it.

The service layer owns degraded-mode policy:

- fallback to the authoritative source;
- fail the operation;
- bypass cache for a bounded period;
- or apply another explicitly declared feature-specific policy.

## Invalidation and watchers

- Invalidate or refresh only after the authoritative write commits successfully.
- Prefer exact-key deletion, namespace/schema-version changes, aggregate replacement, or generation switching over broad key scans.
- Do not purge a bucket as ordinary request-path invalidation.
- Distinguish key delete, key purge, delete-marker cleanup, bucket purge, and bucket deletion.
- Use watchers only when the project declares their owner, restart behavior, slow-consumer handling, and recovery/resynchronization path.
- A watcher may assist local L1 invalidation but must not become the only correctness mechanism.

## Security and observability

- Include tenant and permission scope in cache keys and tests whenever cached visibility depends on them.
- Restrict NATS account permissions to the required KV subjects and management operations.
- Separate application read/write permissions from administrative bucket-management permissions when possible.
- Record safe metrics for hits, misses, bypasses, latency, conflicts, partial batches, unverified writes, serialization errors, and availability failures.
- Use bounded key identifiers or hashes in metrics when cardinality or sensitivity is a concern.
- Do not log complete cached payloads by default.

## Testing

Unit tests must cover:

- codec round trips and distinct empty/`None` values;
- key validation and scope construction;
- miss, deleted entry, hit, decode failure, and unavailable backend;
- `put`, `create`, revision return, CAS success, CAS conflict, and bounded retry;
- post-commit invalidation;
- batch limits, duplicate keys, concurrency bounds, partial success, conflict, and unverified outcome;
- typed error translation without secret leakage.

Integration tests must:

- use a real JetStream-enabled NATS server or an approved equivalent process boundary;
- use unique buckets per run and per `pytest-xdist` worker when parallelized;
- verify declared bucket configuration and ownership behavior;
- exercise two independent clients for CAS and lost-update scenarios;
- verify TTL, delete markers, watchers when used, reconnect behavior, and cleanup;
- avoid production NATS accounts and production buckets.

Stream-level atomic batch behavior, mirrors, direct reads, clustered replicas, and failure during acknowledgement require dedicated version-matched integration tests before they are claimed.

## Review checklist

- [ ] The exact NATS KV rule/skill pair is active through an allowed profile signal.
- [ ] `nats-py`, `nats-server`, JetStream, account/domain, credentials, and TLS sources were verified.
- [ ] The cache is reconstructible and not the authoritative source of business data.
- [ ] Bucket ownership and provisioning/reconciliation policy are explicit.
- [ ] History, TTL, limits, storage, replicas, placement, and direct reads are declared.
- [ ] One shared lifecycle-owned NATS client is used.
- [ ] Keys include all visibility and result-shaping scope without secrets.
- [ ] A deterministic typed codec preserves distinct values and schema versions.
- [ ] Revisions are preserved and mutable updates use CAS rather than get-modify-put.
- [ ] Availability, serialization, conflict, miss, deleted, and unverified outcomes are distinct.
- [ ] Invalidation occurs after successful authoritative writes.
- [ ] Bulk operations are bounded, per-key, and never presented as multi-key transactions.
- [ ] Atomic aggregates or generation pointers are used when consistent multi-key visibility is required.
- [ ] Direct `$KV.*` publishing and unverified stream-level atomic batch shortcuts are absent.
- [ ] Unit and real-NATS integration tests cover concurrency, TTL, lifecycle, errors, and cleanup.
