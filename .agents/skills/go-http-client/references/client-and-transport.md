# Go HTTP client and Transport ownership

## Client lifecycle

- `http.Client` and `http.Transport` are safe for concurrent use and should generally be reused. The composition root configures them; handlers and domain services do not create a new connection pool per call.
- Set `Client.Timeout` and/or `context.WithTimeout` deliberately. A global client timeout covers the whole exchange including reading the body; a per-request deadline can vary with caller budget. Avoid stacking unverified timeouts and mistaking canceled context for a remote HTTP status.
- If custom `Transport` is needed, clone `http.DefaultTransport` (when supported by selected Go toolchain) before changing pool, proxy, TLS and dial options. Do not mutate a shared Transport after it is being used.
- Use `http.NewRequestWithContext` for outgoing requests. No HTTP call is read-only merely because the method is GET: the target and its side effects still require permission.

## Good / Bad: status and body handling

**BAD** (fragment): returning solely on `err == nil` without checking `resp.StatusCode`, or forgetting to close `resp.Body` after a successful request.

**GOOD** (Go 1.13+ for `NewRequestWithContext`; standalone function):

```go
package client

import (
    "context"
    "fmt"
    "io"
    "net/http"
)

func Fetch(ctx context.Context, client *http.Client, url string) ([]byte, error) {
    req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
    if err != nil {
        return nil, err
    }
    resp, err := client.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()
    if resp.StatusCode != http.StatusOK {
        return nil, fmt.Errorf("unexpected HTTP status %d", resp.StatusCode)
    }
    const maxBody = 1 << 20
    data, err := io.ReadAll(io.LimitReader(resp.Body, maxBody+1))
    if err != nil {
        return nil, err
    }
    if len(data) > maxBody {
        return nil, fmt.Errorf("response too large")
    }
    return data, nil
}
```

Here a complete bounded read allows connection reuse when the body is short. Early-return error responses may not be drained; explicit closing is still necessary. Choose a response content-type and status contract for the actual API, do not impose 200 on all valid endpoints.

## Error semantics

- A non-2xx HTTP response is normally returned as `resp` with no transport error. Handle expected 3xx/4xx/5xx as application/protocol outcomes, not evidence that `Client.Do` failed to connect.
- A nonnil `err` normally indicates request setup, connection, redirect policy, cancellation or protocol failure; use `errors.Is` and `net.Error` appropriately. Do not parse error strings as contractual status.
- If `Client.Do` returns both a response and an error due to a redirect policy, its response body is already closed; consult the selected Go docs before generalizing. Do not double-consume an absent body.
- Response read/decode may fail **after** a successful HTTP status; classify separately from the status code and consider context cancellation.

