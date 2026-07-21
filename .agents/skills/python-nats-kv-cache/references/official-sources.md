# Python NATS JetStream KV Cache Official Sources

Use this reference when validating or changing claims about NATS JetStream Key/Value, `nats-py`, bucket configuration, revisions, consistency, lifecycle, security, or stream-level features that could affect the cache profile.

This file is a source index. It does not replace runtime version discovery or broaden the skill from NATS KV caching into generic JetStream stream programming.

Last source review: `2026-07-22`.

## Source precedence

Use sources in this order:

1. Repository dependency metadata establishes the installed `nats-py` version and selected Python API surface.
2. Deployment configuration or approved runtime diagnostics establishes the deployed `nats-server` version, JetStream availability, account/domain, and enabled stream features.
3. Official `nats.py` API documentation and matching source establish Python method signatures, return values, exceptions, and configuration fields.
4. Official version-matched NATS documentation establishes server and KV semantics, consistency, limits, administration, and security.
5. NATS release notes establish when server-level features were introduced or changed.
6. Another language client may illustrate a concept but is not authoritative for Python API availability or behavior.

Do not use third-party tutorials or a sample application as the sole evidence for concurrency, failure, consistency, security, or production configuration claims.

## NATS Key/Value concepts

- [Key/Value Store concepts](https://docs.nats.io/nats-concepts/jetstream/key-value-store)
- [Key/Value Store walkthrough](https://docs.nats.io/nats-concepts/jetstream/key-value-store/kv_walkthrough)
- [Using the Key/Value Store](https://docs.nats.io/using-nats/developer/develop_jetstream/kv)
- [JetStream concepts](https://docs.nats.io/nats-concepts/jetstream)

Use these sources for:

- buckets, keys, byte-array values, history, TTL, watches, revisions, and deletion;
- atomic single-key `create` and revision-based `update` operations;
- the relationship between a KV bucket and its backing `KV_<bucket>` stream;
- the distinction between KV and lower-level stream functionality;
- monotonic read/write guarantees and the absence of a general read-your-writes guarantee for direct reads served by followers or mirrors;
- the administrative nature of ordinary bucket creation, purge, and deletion workflows.

The official KV API describes per-key operations. Do not infer a portable atomic multi-key transaction from the backing stream implementation.

## nats.py API and source

- [`nats.py` documentation](https://nats-io.github.io/nats.py/)
- [`nats.py` modules](https://nats-io.github.io/nats.py/modules.html)
- [`nats.js.kv` source documentation](https://nats-io.github.io/nats.py/_modules/nats/js/kv.html)
- [`nats.js.api` source documentation](https://nats-io.github.io/nats.py/_modules/nats/js/api.html)
- [`nats-io/nats.py` repository](https://github.com/nats-io/nats.py)
- [`nats.py` KV example](https://github.com/nats-io/nats.py/blob/main/examples/kv.py)

Use these sources to verify the installed-version equivalents of:

- `JetStreamContext.key_value` and `create_key_value`;
- `KeyValue.get`, `put`, `create`, `update`, `delete`, `purge`, `status`, `keys`, `history`, and watchers;
- returned revisions and entry metadata;
- `KeyValueConfig` fields such as bucket, description, history, TTL, maximum bytes, maximum value size, storage, replicas, placement, republish, and direct reads;
- exceptions including bucket-not-found, key-not-found, key-deleted, wrong-last-sequence, and other JetStream failures.

Check the installed client version before copying current documentation signatures. Do not use another language client's convenience API as proof that `nats-py` supports the same operation.

## Stream configuration and advanced features

- [JetStream stream configuration](https://docs.nats.io/nats-concepts/jetstream/streams)
- [NATS 2.12 release notes](https://docs.nats.io/release-notes/whats_new/whats_new_212)

Use these sources for stream-level fields and their introduction versions, including:

- storage, replicas, maximum age, maximum bytes, maximum message size, placement, direct reads, and compression;
- per-message TTL enablement at the stream level;
- `AllowAtomicPublish`, introduced in NATS Server `2.12.0` for atomic stream batch publishing.

`AllowAtomicPublish` is a stream feature. The base `python-nats-kv-cache` profile does not treat it as a standard `KeyValue` multi-key transaction. Before an advanced profile can use it, verify all of the following:

- matching `nats-server` support;
- an official `nats-py` abstraction for the required protocol;
- compatibility with KV subject, revision, create/update, delete, and watcher semantics;
- failure and acknowledgement behavior;
- real-cluster integration tests.

Do not hand-build direct `$KV.*` publishing to obtain stream features that the public Python KV API does not expose.

## Connection lifecycle and security

- [NATS application anatomy](https://docs.nats.io/using-nats/developer/anatomy)
- [Securing NATS](https://docs.nats.io/running-a-nats-service/configuration/securing_nats)
- [TLS configuration](https://docs.nats.io/running-a-nats-service/configuration/securing_nats/tls)
- [Authentication](https://docs.nats.io/running-a-nats-service/configuration/securing_nats/auth_intro)
- [Authorization](https://docs.nats.io/running-a-nats-service/configuration/securing_nats/authorization)
- [NKeys](https://docs.nats.io/running-a-nats-service/configuration/securing_nats/auth_intro/nkey_auth)
- [Decentralized JWT security](https://docs.nats.io/running-a-nats-service/configuration/securing_nats/jwt)

Use these sources for connection lifecycle, TLS, authentication, accounts, credentials, and subject permissions.

Project settings determine the selected connection and credential mechanisms. Do not hardcode URLs, credentials, NKeys seeds, JWTs, TLS verification exceptions, account names, or domains in reusable cache code.

Administrative permissions for bucket management should be separated from ordinary application KV read/write permissions when deployment policy supports that separation.

## Testing and runtime verification

Use a real JetStream-enabled `nats-server` process or cluster for integration behavior that depends on:

- revisions and CAS between independent clients;
- TTL and delete markers;
- watchers and reconnect behavior;
- storage and replicas;
- direct reads, mirrors, or clusters;
- acknowledgement uncertainty;
- stream-level atomic batch publishing.

A mocked `KeyValue` object can validate adapter logic, but it cannot prove server consistency, timing, replication, protocol, or reconnect behavior.

Record only safe diagnostics:

- configured/not configured status;
- server and client versions when non-sensitive;
- environment identifier approved for logs;
- bucket name only when it is not sensitive;
- operation type, latency, revision, and stable error category.

Never print credentials, JWTs, NKeys seeds, authorization tokens, TLS private keys, or complete sensitive payloads.

## Update checklist

When changing this skill package:

- identify the exact Python API or NATS semantic claim being changed;
- resolve the installed `nats-py` and deployed `nats-server` versions;
- use official `nats.py` documentation/source for Python signatures and exceptions;
- use official NATS documentation for KV and server semantics;
- check release notes for version-introduced stream features;
- keep standard KV operations separate from advanced stream programming;
- preserve per-key revision/CAS and batch boundaries;
- update the rule, skill, references, project template, and README together when the profile contract changes;
- record the source-review date when this index is materially revised.
