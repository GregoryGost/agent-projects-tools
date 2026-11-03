# Official Go HTTP client sources

- HTTP client, request, response, redirect and transport: https://pkg.go.dev/net/http
- HTTP tests: https://pkg.go.dev/net/http/httptest
- HTTP transport tracing (when needed): https://pkg.go.dev/net/http/httptrace
- HTTP errors: https://pkg.go.dev/net
- Context cancellation and deadlines: https://pkg.go.dev/context
- Network/TLS configuration: https://pkg.go.dev/crypto/tls
- Go API and toolchain versions: https://go.dev/doc/devel/release

Use the selected module's Go version and actual target API contract. `Client.Do` does not turn HTTP 4xx/5xx into Go errors; successful calls return response bodies which callers must close. Never infer remote idempotency from the presence of a request header alone.

