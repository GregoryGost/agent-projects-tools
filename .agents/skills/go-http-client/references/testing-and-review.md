# Go outbound HTTP test and review matrix

Use `net/http/httptest` when wire semantics matter and a narrowly scoped RoundTripper stub when only request construction/error contracts are needed. Never silently call a live remote service as a unit test.

| Test | Assertion |
| --- | --- |
| Success and API errors | Correct method/path/headers/body; expected 2xx decoding; explicit 4xx/5xx status mapping |
| Network failure | Distinct from HTTP status and response decoding; contextual errors preserved |
| Cancellation/deadlines | Caller cancellation interrupts in-flight work and no orphaned retry timer continues |
| Body size | Exactly at bound accepted; exceeding bound rejected without unbounded allocation |
| Cleanup | Response Body closed on success, error-status and each retry path |
| Redirect | Method/body/header behavior matches the target policy; unapproved origins rejected if configured |
| Retry | Attempts/budget/Retry-After handling and no duplicate business operation under the verified idempotency contract |
| Connection reuse | One client/transport owner; reuse verified where representative |
| Logging | Full/masked/selective **as selected**; no cross-destination export without separate permission |

Do not assert an implementation detail such as exact number of internal HTTP Transport connection retries unless the selected Go version and conditions support that contract. Prefer semantic observable behavior.

Review: verify project policy, Go/module versions, real target API, transport ownership, bounded response handling, request replay, error taxonomy, log destination and actual tests. Every claimed defect needs a source/line, failure condition and smallest safe remedy.

