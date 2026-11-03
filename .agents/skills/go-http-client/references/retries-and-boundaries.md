# HTTP retries, redirect and network boundaries

## Retry safety is a semantic contract

A transport error may occur *after* the remote service received and applied a request. Retrying an operation with side effects without an idempotency contract can duplicate the action.

- Default to **no application retry** unless the target project explicitly chooses retry policy for the operation. `net/http.Transport` already has narrowly defined internal retries under documented conditions; do not assume exactly-once delivery.
- Treat read-only/idempotent HTTP methods and business write operations separately. A POST may be retryable only with a verified remote idempotency-key protocol or another valid duplicate-suppression guarantee; simply adding an HTTP header is not sufficient.
- Determine which conditions justify retries: network errors, selected 429/5xx statuses, and operation-specific exceptions. Hard 400/401/403 validation/auth failures usually need correction rather than retries.
- Respect a **total** caller deadline over all attempts; cap maximum attempts and wait, honor cancellation promptly, and use an approved backoff/jitter policy. Evaluate `Retry-After` only if the target API requires it and it fits the remaining budget.
- Ensure request bodies are actually replayable (`Request.GetBody` or a verified equivalent) before resubmission. Streaming bodies may not be replayable; avoid silently buffering unbounded data.
- Distinguish logs of each *attempt* from final business outcome. Multiple attempts can be correct while duplicate committed operations are not.

## Redirect, TLS and proxy details

- `Client.CheckRedirect` defines policy. Redirects may change method/body (e.g. 301/302/303) or preserve them (307/308 when body replayable); verify relevant status and selected Go version.
- Sensitive headers may be forwarded to same-origin/subdomain destinations under standard-library policy. If origin boundaries matter, test the actual redirect graph rather than assuming cross-origin leakage always occurs or never occurs.
- Use approved TLS roots, hostname verification and proxy settings from the established target project. Do not disable certificate verification or force direct access merely to get a passing request.
- Outgoing HTTP clients must not log or export arbitrary request contents unless the **already selected** shared Go disclosure policy allows those categories for that sink.

## Good / Bad review examples

**BAD:** blindly retry a paid POST after an EOF, issuing the charge twice.

**GOOD:** verify the remote system's idempotency-key contract, persist/retain the operation key as needed, limit attempts under one deadline and test a lost-response scenario with a disposable server.

**BAD:** create a new `http.Transport` for every retry or recreate a consumed streaming body.

**GOOD:** retain one concurrency-safe transport; reconstruct a verified replayable request per attempt and close every received response body before retry.

