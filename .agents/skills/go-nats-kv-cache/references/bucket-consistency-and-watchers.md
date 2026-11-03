# NATS KV cache — bucket policy, consistency, watches and failures

## Explicit bucket ownership

Choose one mode in the target profile:

- `infrastructure-managed` (default): deployed infrastructure provisions/changes bucket. Application binds via `js.KeyValue(ctx, bucket)` and checks `Status` against expected policy; missing/incompatible configuration is a reported error.
- `application-managed`: only if the current user/project policy explicitly authorizes exactly which bucket, environment and editable configuration fields the application may create/change. Do not infer permission from network access.
- `test-managed`: isolated, uniquely named disposable buckets on a controlled local/test JetStream; clean up only the created test resource.

`CreateOrUpdateKeyValue` changes remote state. Opening a PR or adding a skill cannot authorize this external mutation. Do not mutate underlying `KV_<bucket>` stream directly under a cache rule.

## Version and server contract

- Verify actual `nats.go` version, `jetstream` API, NATS Server version, account/domain, JetStream enabled and installed cluster configuration. Main branch documentation is rolling, not a pin.
- Bucket settings: `TTL`, `MaxBytes`, `MaxValueSize`, `History`, `Storage`, `Replicas`, `LimitMarkerTTL`, allowed subjects/credentials and connection security. Defaults vary; never invent production values.
- For normal `Put`, bucket TTL is the expiration policy. Per-key TTL through `jetstream.KeyTTL` is a version-sensitive `Create` option requiring appropriate marker TTL configuration and NATS Server 2.11+; test actual behavior.
- Not all direct reads are guaranteed to observe a prior write immediately when followers/mirrors serve reads. `Get` is not an unconditional strict read-your-writes or multi-key transaction guarantee. `Create` and `Update` protect their own key write conditions but do not make DB and KV one atomic transaction.

## Watcher lifecycle and consistency

- A `jetstream.KeyWatcher` from `Watch`/`WatchAll` provides `Updates()` and `Stop()`. Track initial snapshot, a possible `nil` marker indicating the snapshot boundary, new revisions, delete/purge markers, errors, disconnect/reconnect behavior and shutdown. Initialize an independent local cache only if the project has a separate approved design.
- Process watchers with bounded work and cancellation. Stop the watcher when the owner shuts down, and avoid leaked listers, subscriptions, goroutines, excessive buffering and unhandled channel closures.
- Watch events are not a universal exactly-once invalidation system. Consumers may reconnect or observe changes outside a fully atomic snapshot; always validate revision/order assumptions with actual integration tests.
- `ListKeys` streams keys; `Keys` may materialize the full key set and become memory-heavy. Neither should be used as a per-request query for large buckets.

## Failures and stale data

- Cache miss (`ErrKeyNotFound` or verified deleted marker) is different from a connectivity/authorization failure. Define fail-open/fail-closed, fallback reads, bounded retry/backoff and observability.
- Keep the source of truth outside KV. If a successful DB commit is followed by failed `Delete`, choose an explicit consistency policy: versioned keys, outbox/retry or bounded stale acceptance. Do not report that data was invalidated when deletion failed.
- Define whether updates from another process should be instantly visible, eventually visible or only bounded by TTL; the selected policy determines whether this cache is appropriate.
- Do not assume KV is a distributed lock service or that `Create` alone provides lease safety, automatic renewal and fencing. This skill does not prescribe a lock implementation.
- Broad `Purge`, key enumeration/deletion, bucket recreation and configuration reconciliation are excluded by default from application cache paths and require separate scope and authorization.

## Observability / safety

- Capture bounded metrics for hit/miss, KV latency, timeout, auth failures, stale fallback and watcher/reconnect outcomes without storing payload secrets in labels/logs.
- Use short-lived operation contexts with project-approved deadlines; don't initiate endless goroutines or disconnected retry tasks.
- Keep keys, bucket names and environment identifiers scoped; do not make a shared bucket accept cross-tenant key collisions.

