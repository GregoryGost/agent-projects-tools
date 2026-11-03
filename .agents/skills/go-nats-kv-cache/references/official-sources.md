# Official NATS Go JetStream KV references

- NATS Go client (versioned module source): https://github.com/nats-io/nats.go
- JetStream Go package: https://pkg.go.dev/github.com/nats-io/nats.go/jetstream
- KeyValue interface and configuration: https://github.com/nats-io/nats.go/blob/main/jetstream/kv.go
- JetStream package README KV guide: https://github.com/nats-io/nats.go/blob/main/jetstream/README.md
- NATS KV conceptual docs: https://docs.nats.io/nats-concepts/jetstream/key-value-store
- NATS JetStream fundamentals: https://docs.nats.io/nats-concepts/jetstream
- NATS Server releases: https://github.com/nats-io/nats-server/releases
- Go NATS releases: https://github.com/nats-io/nats.go/releases

Verify API availability, `jetstream.KeyTTL`, marker TTL requirements and watcher behavior against the **selected version** of both client and server. Upstream `main` currently declares Go 1.26+, which is not a fixed minimum for every previously released `nats.go` version.

