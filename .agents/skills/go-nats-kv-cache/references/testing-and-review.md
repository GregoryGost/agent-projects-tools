# NATS JetStream KV cache — testing and review

## Test boundary

- Unit tests: use a narrow fake `jetstream.KeyValue` only for request logic, key construction, serialization and error classification. Do not call a fake proof of server TTL, CAS, watch or consistency behavior.
- Integration tests: use the project-approved disposable local/isolated nats-server with JetStream enabled and a **test-managed unique bucket**, not a production account, shared bucket or arbitrary development server.
- Use the exact server/client version matrix from `CODEX_PROJECT.md`; feature-gate `KeyTTL` and watcher options rather than assuming newest behavior.
- Do not install/start NATS, run migrations or mutate existing remote buckets from a documentation-only task or a read-only review.

## Essential tests (only for affected features)

1. Bind and verify existing bucket with `Status`; missing bucket or config drift fails explicitly under infrastructure-managed mode.
2. Get hit, genuine miss/deleted key, malformed serialized payload and transient connection/permission failure are distinct outcomes.
3. TTL expiry under configured bucket TTL (and per-key `Create` `KeyTTL` if selected and supported).
4. `Create` duplicate and `Update` stale revision conflicts are handled as expected, including competing writers.
5. Source-of-truth commit followed by cache delete succeeds or fails under the declared fallback/reconciliation policy; no false assurance from TTL alone.
6. Watch initial snapshot, `nil` boundary event where applicable, update/delete markers, stop/cleanup and reconnection. Do not assert global linearizability without topology and proof.
7. Key namespace prevents tenant/user/role leakage; arbitrary IDs are normalized into valid KV keys, including long/unicode inputs where applicable.
8. Outage policy: service behavior when JetStream is unavailable, slow, partitioned or under retry load is explicit, bounded and observable.
9. No owned connections, watchers, key listers or background worker leaks after repeated start/stop.
10. `Delete`/`Purge` and cleanup are restricted to the disposable test bucket; never clear unowned data.

## Review checklist

- [ ] Exact `nats.go` and NATS server versions, account/domain and JetStream availability checked.
- [ ] Bucket ownership/creation policy and remote authorization boundary explicit.
- [ ] TTL, history, max bytes/value, replicas, storage and markers verified against server status.
- [ ] Valid scoped keys and versioned codec; no direct ORM/resource values in KV.
- [ ] Not-found distinguished from outages and permission errors.
- [ ] `Put` vs `Create` vs CAS `Update` reviewed and tested where relevant.
- [ ] Read-your-writes, follower/mirror staleness and invalidation contract not overstated.
- [ ] Watchers/listers explicitly stopped and bounded.
- [ ] Test servers/buckets isolated and cleaned only when permitted.
- [ ] No unnecessary dependency on Otter, GoCache, Redis or multi-layer caching.

