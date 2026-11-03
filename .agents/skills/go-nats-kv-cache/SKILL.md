---
name: go-nats-kv-cache
description: "Use for Go distributed cache with official nats.go/jetstream KV: bucket ownership, TTL, revisions, watchers, errors, consistency and integration tests."
---

# Go NATS JetStream KV Cache

This skill applies to cache behavior implemented **directly** with `github.com/nats-io/nats.go/jetstream`. It does not require Otter, GoCache, Redis, or a generic cache interface, and it does not automatically create an L1/L2 cache. Treat a NATS bucket as a reconstructible cache, not a business system of record.

## Required Dependencies

- `go-core`

Apply `.codex/rules/go_nats_kv_cache.md` only when independently active. Hard dependency validation is controlled by `material_dependencies.md`. `go-local-cache` is an independent optional skill, not a prerequisite.

## Source-of-truth and permission workflow

1. Read `CODEX_PROJECT.md`, `go.mod`/`go.sum`, versions of `nats.go` and nats-server, actual connected JetStream/account/domain, app initialization and existing data-store/cache behavior.
2. Verify cache bucket name, ownership (`infrastructure-managed`/`application-managed`/`test-managed`), deployed configuration, identity/TLS/permissions, codec, key scope, history, TTL, max bytes, max value bytes, replica/storage policy and outage/fallback policy.
3. Distinguish read-only binding to an existing `js.KeyValue(ctx, bucket)` from **mutating** `CreateKeyValue` / `CreateOrUpdateKeyValue`, delete/purge and backing stream operations. A request to edit repository files never approves live bucket mutation.
4. Trace read and write paths: cache-aside, source-of-truth operations and post-commit invalidation. Identify expected not-found behavior separately from transient network failures.
5. Check key naming, payload versioning, serialization, visibility scope and consistency guarantees; choose `Put`, `Create` or revision-guarded `Update` only for the semantics actually needed.
6. Add bounded watchers only for an explicit workflow; track initial snapshot, event operations, revision transitions, stop/close and backpressure.
7. Run or report declared tests against disposable local NATS JetStream if authorized. No production mutation, bucket provisioning or test infrastructure setup occurs by implication.

## KV semantics and guardrails

- `jetstream.KeyValue` supports `Get`/`Put`/`Create`/`Update`/`Delete` and optional `Watch`, `WatchAll`, `History` etc. Check availability and signatures in the pinned client version.
- `Create` is conditional on absence; `Update` compares a revision; `Put` overwrites unconditionally. Use `errors.Is` for documented sentinel errors. Stale reads from followers/mirrors may violate read-your-writes; application invariants must rely on source-of-truth/constraints or proven leader/revision protocol, not generic KV `Get`.
- `KeyValueConfig.TTL` applies at bucket level. `jetstream.KeyTTL` is only for compatible `Create` operations, server 2.11+ with marker support configured; check client and server versions before relying on it.
- A watcher can deliver an initial snapshot with a `nil` boundary marker and delete/purge events; it must be stopped, bounded and error-managed. Do not silently assume a watcher provides exact-once global invalidation, transactional ordering or no missed updates across a disconnect.
- Default to no direct bucket creation or modification by application startup. Production infrastructure-owned bucket configuration remains a separate responsibility and permission surface.
- Distinguish `Delete` markers from destructive `Purge`/bucket deletion. Do not invoke broad clearing to test cache invalidation against real infrastructure.
- Avoid caching identities, credentials, raw ORM entities, open connections or unbounded payloads. Key naming and logs must not leak confidential data. NATS KV keys accept restricted characters; encode arbitrary IDs into a safe stable representation when necessary.
- No hidden local Otter L1: a combined L1/L2 cache requires a distinct approved consistency design and corresponding tests.
- NATS connection ownership and `Drain`/`Close` are set at the composition root; the KV handle itself does not grant ownership to close a shared `nats.Conn` per request.

## Reference routing

- `references/jetstream-kv-patterns.md` for API examples, conditional writes, cache miss errors and key design.
- `references/bucket-consistency-and-watchers.md` for ownership, TTL, read consistency, watcher semantics and runtime failures.
- `references/testing-and-review.md` for test scenarios, version compatibility and review.
- `references/official-sources.md` for official nats.go / nats-server references.
- `../go-core/references/cache-design.md` for shared cache correctness when keys, invalidation or staleness are involved.

## Optional coordination

`go-testing` is used only for independently active tests. `go-gorm` or `go-gorm-sqlite-goose` are needed only when cache invalidation affects persistence. `go-huma-v2` is needed only when HTTP handlers or API contracts are touched.

