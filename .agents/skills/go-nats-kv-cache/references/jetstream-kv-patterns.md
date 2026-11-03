# NATS JetStream KV — direct Go API patterns

Check `github.com/nats-io/nats.go` version and the nats-server runtime before using the following examples. The current upstream development tree declares Go 1.26+; older tagged releases may have a different minimum. The examples below use APIs provided by the recent `jetstream` client, but do **not** open a real connection or mutate a live bucket.

## GOOD — typed cache-miss versus backend failure

Standalone helper (requires selected `nats.go/jetstream` module):

```go
package cachekv

import (
    "context"
    "errors"

    "github.com/nats-io/nats.go/jetstream"
)

func Get(ctx context.Context, kv jetstream.KeyValue, key string) ([]byte, bool, error) {
    entry, err := kv.Get(ctx, key)
    if errors.Is(err, jetstream.ErrKeyNotFound) {
        return nil, false, nil
    }
    if err != nil {
        return nil, false, err
    }
    return entry.Value(), true, nil
}
```

The helper expects a validated key and a valid existing bucket. The caller is responsible for decoding and validating the value schema. A service may need to distinguish deleted/recreated key states in addition to `ErrKeyNotFound` based on the exact selected client behavior.

## BAD — swallowing unavailable-backend errors as cache misses

```text
value, err := kv.Get(ctx, key)
if err != nil { return missing, nil }  // treats auth/TLS/outage as a genuine miss
```

A failed backend and an absent key can require different fallback, alerting and retry policies. Only a documented not-found condition is a cache miss; transient errors must be surfaced or deliberately downgraded according to project policy.

## GOOD — compare-and-set when updating based on observed state

Standalone helper demonstrating optimistic concurrency (not a business transaction):

```go
package cachekv

import (
    "context"

    "github.com/nats-io/nats.go/jetstream"
)

func ReplaceIfCurrent(
    ctx context.Context, kv jetstream.KeyValue, key string, value []byte,
    expectedRevision uint64,
) (uint64, error) {
    return kv.Update(ctx, key, value, expectedRevision)
}
```

Use `Create` to reject duplicate keys and `Put` when unconditional replacement is explicitly intended. An `Update` revision mismatch is an expected concurrency outcome; it is not permission to retry blindly with `Put`. Do not use KV revisions as a substitute for cross-key/DB transactions.

## BAD — assuming per-key TTL on all writes

```text
kv.Put(ctx, key, bytes)  // assumed: custom 15-second TTL for this particular key
```

`Put` has no per-key TTL argument. The configured bucket TTL applies. For supported `Create` operations, `jetstream.KeyTTL(duration)` requires the matching client/server behavior, server 2.11+ and `LimitMarkerTTL`; an initial `KeyTTL` is not equivalent to freely changing TTL with `Put`.

## Key format, codec and data ownership

- NATS KV key names are strings with a restricted character set: alphanumerics, `-`, `_`, `=` and `.`. Colon/separators from Redis examples and arbitrary user text must not be copied directly into KV keys.
- Use deterministic namespaced keys including cache schema version, visibility scope (tenant/user/role as applicable) and all filter inputs. Hash/encode untrusted or variable-length identifiers into valid keys; never include passwords or tokens.
- Serialize stable DTOs with a declared codec (for example JSON, MessagePack) and schema version. Avoid caching native pointers, ORM sessions or serialized secrets.
- Define read-your-writes requirements separately; a leader/follower/mirror topology can return stale direct reads. If the read contract requires transactional truth, bypass cache or implement an explicitly reviewed version/revision check.
- The application owns a shared `nats.Conn` lifecycle; do not create a connection per cache operation.

