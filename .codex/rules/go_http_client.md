# Go HTTP client rules

Activate only via exact `go_http_client.md` Active Rules, `go-http-client` Active Stack Profiles or the enabled Go HTTP Client Profile naming `go_http_client.md + go-http-client`.

## Required skills

- `go-core`
- `go-http-client`

## HTTP boundary

- Read `CODEX_PROJECT.md`, `go.mod`, effective Go/toolchain, target API contracts, current `http.Client` / `Transport` construction and tests. Use standard-library `net/http` by default and respect an already selected client library; do not introduce a third-party wrapper without authorization.
- Reuse `http.Client` and `http.Transport`; set connection timeouts, request deadlines, TLS, proxy and redirect behavior only according to actual target contract and configured exposure. Carry caller `context.Context` through `http.NewRequestWithContext`.
- `Client.Do` does **not** treat non-2xx HTTP status as an error. Close every successful response body; use bounded reads and classify timeout/cancellation, HTTP status and decode failures distinctly.
- Retries are **opt-in** based on declared idempotency contract, replayable body, status/error classes, total deadline, backoff and jitter policy. A client-generated idempotency key is not proof the remote server honors it. Never retry a charged/write operation merely because the transport failed.
- Follow the shared Go Application Context And Data Disclosure Policy when the HTTP client logs data. Header/body capture `full` / `masked` / `selective` is chosen once by the project owner; logs and external transmission are distinct destinations.
- Unit tests use approved `httptest.Server` or a controlled RoundTripper and verify real wire semantics, redirects, canceled contexts, body closure, retry budget and no duplicate side effects.
- Reference `.agents/skills/go-http-client/references/` for examples and official docs. `go-huma-v2` is a separate **server-side** skill, not a dependency.

