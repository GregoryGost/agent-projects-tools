# Go NATS JetStream KV cache rules

Activate only via exact `go_nats_kv_cache.md` Active Rules entry, `go-nats-kv-cache` Active Stack Profiles entry or complete enabled Go NATS KV Cache profile naming `go_nats_kv_cache.md + go-nats-kv-cache`. A mere task mention or presence of NATS packages does not activate this rule in a target project.

## Required skills

- `go-core`
- `go-nats-kv-cache`

## Scope and version gate

- Governs a **reconstructible shared cache** using the official Go module `github.com/nats-io/nats.go/jetstream` and its `jetstream.KeyValue` API; not NATS Core Pub/Sub, JetStream consumers, streams, Object Store, Redis, GoCache adapters or distributed locks.
- Read `CODEX_PROJECT.md`, `go.mod`/`go.sum`, actual nats.go version, deployed nats-server/JetStream version, instance/account/domain/bucket, connection/auth/TLS settings, source-of-truth/TTL/consistency and integration tests.
- Current upstream main `nats.go` uses Go 1.26+, but the selected tag's requirements control a target. Verify server-side feature compatibility before using `jetstream.KeyTTL`, marker TTL or other version-sensitive APIs.

## Strict operational and authorization boundaries

- A cache bucket is never the sole authoritative business store. Declare cache miss/outage fallback and tolerated staleness. Do not treat NATS KV as a distributed lock service or multi-key transaction by default.
- Default to `infrastructure-managed` existing bucket: attach with `js.KeyValue(ctx, bucket)` and validate `Status`. Creation/reconfiguration/deletion of a live bucket is a **separate external-system operation** requiring its own current-message authorization, target and ownership policy. A code/docs change does not authorize these effects.
- Use `Put`, `Create` and revision-guarded `Update` deliberately. `Get` must distinguish `ErrKeyNotFound` / deleted keys from network/permission failures. Respect multi-process races and possible follower/mirror stale reads.
- Bucket `TTL` is the normal expiration policy. Per-key `KeyTTL` applies to supported `Create` operations and requires matching server/client features and `LimitMarkerTTL`; do not claim that `Put` supports arbitrary per-key TTL. Check timestamp/revision semantics when correctness depends on them.
- Cache keys must be valid for NATS KV and include namespace, schema version, tenant/user/role/filter dimensions where applicable. Use versioned serialized DTOs, not live Go objects or ORM entities.
- Watchers and key listers have lifecycle ownership: observe initialization markers and delete/purge events, stop/cleanup and bound processing/reconnect loops. Never assume watches atomically synchronize another process's local cache.
- Do not mutate backing `KV_<bucket>` streams, purge keys, clear entire buckets, create watchers indefinitely or expose secrets without explicit authorization.
- Require relevant active `go-testing` / disposable JetStream integration tests for KV semantics, TTL, CAS, outages and cleanup when test changes are authorized.

