---
name: go-http-client
description: "Use for reliable outgoing Go net/http clients: transport reuse, context deadlines, response handling, redirects, bounded retries and isolated tests."
---

# Go HTTP Client — outgoing calls and response contracts

Own external HTTP **client** behavior, not inbound Huma API routing or generic domain logic. Start with `net/http` without mandating Resty, retries middleware or an external SDK.

## Required Dependencies

- `go-core`

Apply `.codex/rules/go_http_client.md` only when independently active.

## Source of truth and implementation

1. Read the target `CODEX_PROJECT.md` Go HTTP Client Profile, Go Application Context And Data Disclosure Policy for log fields, `go.mod`, selected client/transport setup, remote API contract and existing tests.
2. Establish call contract: method, URL origin, payload encoding/streaming, authentication source, expected statuses and response shape, timeout and idempotency requirements. Check an actual server/API spec where version-sensitive.
3. Prefer a shared application-owned `http.Client` and `Transport`. Use per-request `context.Context`, explicit bounded response reads and error classifications. Do not mutate the shared Transport per request.
4. Implement response body close/drain decisions consciously; do not assume `Client.Do` returns an error on HTTP 400/500. Check returned status and decode with size limits and content-type semantics as needed.
5. Add retries only if the project explicitly selects them and request replay is demonstrably safe; define total budget, backoff, jitter, Retry-After handling and circuit/rate behavior where relevant. Distinguish ambiguous network failure from confirmed rejection.
6. Respect selected TLS/proxy/redirect policy and the project's chosen logging modes. Do not change trust stores, disable verification or export full request contents to new sinks by default.
7. Verify with isolated `httptest` and relevant real integration tests only when authorized. No package install or live external request is implied.

## Reference routing

- `references/client-and-transport.md` — lifecycle, contexts, response ownership and Good/Bad.
- `references/retries-and-boundaries.md` — replay, idempotency, redirects, TLS, request body limits.
- `references/testing-and-review.md` — focused status/timeout/redirect/retry/cleanup matrix.
- `references/official-sources.md` — authoritative Go docs.

## Optional coordination

`go-security` owns configured security policy when active, `go-observability` owns telemetry, `go-huma-v2` owns inbound API and `go-testing` owns tests. They do not become hard dependencies.

