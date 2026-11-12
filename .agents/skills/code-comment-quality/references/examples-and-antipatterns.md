# Worked Contrasts: What a Maintainer Actually Needs to Know

**Illustrative examples, not executable project code or universally correct contracts.** Assume the stated behavior exists in each hypothetical component; before using a similar comment, verify it against the target's complete source, tests, callers and dependency contracts. The snippets use several languages only to expose different engineering situations. Fragments without complete declarations teach a local explanation only; the containing function and all authored declarations must still be documented in real code. Translate natural-language prose to the project's selected language and use its doc-comment syntax. Each lesson concerns **semantic information**, not length. The comments should sound like something a developer would explain to a teammate, not like an agent's summary or scoring rubric. Technical terms are welcome where useful, but unexplained abstractions are not.

## 1. A small method still needs a useful block (TypeScript)

**Insufficient:**

~~~ts
class Task {
    private id: string
    idValue(): string { return this.id }
}
~~~

**Correct for a task whose ID is stored at construction:**

~~~ts
/** Holds the identifier assigned to a task when it is created. */
class Task {
    /** Identifier received from the code that creates this task. */
    private id: string

    /** Returns the task's stored identifier without modifying the task. */
    idValue(): string { return this.id }
}
~~~

**Why:** every authored declaration has documentation, even though the method is one line. The comments explain the role of the field and the method rather than leaving them undocumented. Do not invent immutability or uniqueness unless the real implementation guarantees it.

## 2. Module role and shared invariants (Python)

**Insufficient:**

~~~python
"""Event delivery helpers."""
~~~

**Stronger when this describes the actual module:**

~~~python
"""Coordinate ordered delivery of stored events to subscribers.

The store owns event identity and persistence; this module owns per-subscriber
delivery cursors. A cursor advances only after the subscriber acknowledges an
event, so a disconnected subscriber may receive the last unacknowledged event
again. Consumers must therefore tolerate duplicate delivery.

This module never deletes events and cannot ensure that the receiver processes each event only once.
"""
~~~

**Why:** this establishes ownership, important observable behavior, and a constraint across multiple functions. It is not merely a longer title.

## 3. Public API: exceptional and boundary contract (Python)

**Insufficient:**

~~~python
def read_page(limit: int, cursor: str | None) -> Page:
    """Read events."""
    ...
~~~

**Stronger for a hypothetical API that enforces these rules:**

~~~python
def read_page(limit: int, cursor: str | None) -> Page:
    """Return up to `limit` events after `cursor` in ascending ID order.

    A missing cursor starts at the oldest retained event. A valid cursor is
    exclusive: the event identified by it is not repeated in this page.

    Args:
        limit: Number of events to request, in the inclusive range 1..500.
        cursor: Previously returned cursor, or None for the first page.

    Returns:
        Page with events and a next cursor; a missing next cursor means
        no additional retained events were available at read time.

    Raises:
        ValueError: If limit or cursor format is invalid.
    """
    ...
~~~

**Why:** inputs, pagination semantics, boundary values, and errors are actionable to callers. Do not promise stable snapshots or atomic reads unless the implementation provides them.

## 4. State machine: description versus lifecycle (Go)

**Insufficient:** `// Task state: pending, running, done, cancelled.`

**Better, but still incomplete:** `// Tasks start pending and end done or cancelled.`

**Stronger for a fictional task scheduler:**

~~~go
// Task lifecycle:
//
//     pending --> running --> done
//        |           |
//        +-----------+-----> cancelled
//
// Only the scheduler starts a pending task. A worker can finish just as
// another goroutine requests cancellation. Both updates use the same lock,
// so the task ends as either done or cancelled, never both.
//
// After completion or cancellation, callbacks can read the result, but
// cannot restart the task or change its final state.
~~~

**Why:** the diagram describes reachable transitions, and the prose names the actor, race, winner, and terminal invariant. Verify that the implementation really enforces a single terminal transition.

## 5. Concurrency: why a guard matters (Go)

**Insufficient:**

~~~go
// Lock to avoid races.
mu.Lock()
defer mu.Unlock()
~~~

**Stronger when these facts are proven:**

~~~go
// A lease can be renewed while an expiry callback from its previous
// version is still running. We check the version under the lock so the
// old callback cannot cancel the renewed lease.
mu.Lock()
defer mu.Unlock()
if expiringVersion != lease.version {
    return
}
lease.expired = true
~~~

**Why:** “avoid races” describes an abstract goal, while the improved version exposes the actual race and the protected invariant. It must agree with the code's lock coverage.

## 6. Qt/C++ asynchronous lifetime and cancellation

**Insufficient:**

~~~cpp
// Clean up the network response.
reply->deleteLater();
~~~

**Stronger for a finished handler with a `QPointer<Controller> controller`:**

~~~cpp
// The controller may have been destroyed before the reply finishes.
// QPointer becomes null when that happens, so check it before passing
// the data on. Read the reply before scheduling its deletion; do not
// keep the reply after this handler returns.
if (controller) {
    controller->accept(reply->readAll());
}
reply->deleteLater();
~~~

**Why:** the comment says what can go wrong during shutdown and why the pointer check and cleanup order matter. This is illustrative: the full handler must still be checked for correct reply and receiver lifetimes.

## 7. HTTP retry and ambiguous completion (TypeScript)

**Insufficient:** `// Retry the request when the connection fails.`

**Stronger for an implementation that retries only declared-safe operations:**

~~~ts
// The connection can fail after the server has already saved the change.
// Sending the same request again might apply it twice. Retry only operations
// that the endpoint explicitly allows us to repeat; otherwise the caller
// must check what happened before trying again.
~~~

**Why:** this covers the causality, scope, and consequence of retries. “All POSTs are unsafe” or “GET is always harmless” would be an unjustified universal claim.

## 8. Cancellation and partial side effects (C# XML documentation)

**Insufficient:**

~~~csharp
/// <summary>Sends the batch.</summary>
Task SendAsync(Batch batch, CancellationToken cancellationToken);
~~~

**Stronger for a client that can stop locally after server acceptance:**

~~~csharp
/// <summary>Submits a batch and waits for the server acknowledgement.</summary>
/// <param name="batch">The batch to submit; its contents are not modified.</param>
/// <param name="cancellationToken">
/// Requests cancellation of local waiting and transport activity.
/// </param>
/// <remarks>
/// Cancellation does not roll back a batch already accepted by the server.
/// If the acknowledgement is lost, the caller must check whether the
/// server accepted the batch before sending it again.
/// </remarks>
Task SendAsync(Batch batch, CancellationToken cancellationToken);
~~~

**Why:** this distinguishes local cancellation from remote rollback. Do not invent exception types or idempotency rules missing from the real contract.

## 9. Owned versus borrowed data (C++)

**Insufficient:** `// Store bytes for later.`

**Stronger for a hypothetical non-owning input API:**

~~~cpp
// The parser borrows [data, data + size) only for this call and never saves
// the pointer. The caller retains ownership and may release or reuse the
// buffer immediately after parse() returns. Any deferred parsing must first
// copy the bytes into parser-owned storage.
~~~

**Why:** ownership and lifetime are otherwise hard to infer from a raw-pointer signature. Do not make this guarantee if the implementation queues work that refers to the original memory.

## 10. Justifying a technical decision without fictional history (Go)

**Insufficient:** `// Use two queues because it is faster.`

**Stronger if the actual synchronization contract confirms it:**

~~~go
// Timer callbacks have their own limited queue. Ordinary work waiting
// in another queue cannot prevent an expired timer from being queued.
// This does not guarantee that its callback runs immediately or exactly
// in the order timers expired.
~~~

**Why:** it describes the precise purpose and the limit of the guarantee. Avoid claims about benchmarks, speedups, or decisions by previous authors without evidence.

## 11. Ordering and persistence boundary (SQL)

**Insufficient:** `-- Insert a row before sending the notification.`

**Stronger for an actual transactional outbox:**

~~~sql
-- Store the event in the same transaction as the business change.
-- Publishing it before commit could tell other services about a change
-- that is later rolled back. The sender may retry and deliver the event
-- twice, so receivers must detect events they have already handled.
~~~

**Why:** this ties the ordering to a real failure mode and explains the delivery consequence. Only use when the schema/dispatcher behavior supports the outbox contract.

## 12. Test intent and regression protection (Python)

**Insufficient:** `# Call cancel and assert that state is cancelled.`

**Stronger where the test actually exercises the race:**

~~~python
# A timeout from an old lease may arrive after that lease is renewed.
# The old timeout must not cancel the renewed lease or send a second
# cancellation notification.
~~~

**Why:** it explains which defect the test detects. Ensure synchronization in the test actually controls this interleaving; a comment cannot make a nondeterministic test reliable.

## 13. Stale or speculative explanation: correct or remove

**Misleading after implementation changes:**

~~~ts
// Exactly once: successful sends are never retried.
await transport.send(payload)
~~~

**Better:** confirm what `send` and the surrounding caller actually guarantee. If retries or ambiguous outcomes are possible, replace the false promise with a verified account of commit/replay semantics. Replace a false declaration comment with a truthful description of its actual purpose and behavior, even when that explanation is short. Only remove extra narration that does **not** serve as the mandatory documentation for a declaration.

**Why:** invented guarantees are harmful, but deleting a function or variable's required documentation is not a valid fix.

## 14. Excess narration versus one high-value constraint

**Overdocumented:**

~~~go
// Read the flag.
enabled := config.Enabled
// Check the flag.
if enabled {
    // Start the worker.
    startWorker()
}
~~~

**Better where a real startup invariant applies:**

~~~go
// routing holds the complete table built from the current configuration.
routing := buildRoutingTable(config)
publishRoutingTable(routing)
// Workers must start after publication of the complete routing table;
// starting earlier would allow a worker to read partially updated routes.
if config.Enabled {
    startWorker()
}
~~~

**Why:** one fact explaining an ordering dependency can replace a series of obvious comments. If startup ordering is not enforced here, that improved comment would also be misleading.

---

## 15. Human explanation instead of an agent-style abstraction (TypeScript)

**Formally technical, but difficult to read:**

~~~ts
// Enforce request exclusivity invariant to prevent stale asynchronous
// response propagation across overlapping execution boundaries.
if (requestInFlight) return
~~~

**Clearer, when this guard really prevents overlapping requests:**

~~~ts
// Don't start a second request while the previous one is still running.
// Otherwise the older response could arrive last and overwrite newer data.
if (requestInFlight) return
~~~

**Why:** both comments point toward the same risk, but the second names the real situation and consequence. The goal is not to avoid the terms "async", "invariant" or "race" everywhere. Use them when they genuinely help the intended developers, and explain an unfamiliar mechanism rather than decorating it with jargon. Do not paste an instruction such as "Review the contract" or a generated What/Why/Risk template into source comments.

---

## 16. Short method, field and constant (Go)

**Missing documentation (not acceptable):**

~~~go
type Task struct { id string }
func (t Task) ID() string { return t.id }
~~~

**Documented (for the hypothetical task model below):**

~~~go
// Task keeps the identifier assigned when a task is created.
type Task struct {
    // id is the stored identifier used to refer to this task.
    id string
}

// ID returns the identifier kept in the task without modifying it.
func (t Task) ID() string { return t.id }
~~~

**Why:** brief implementation is no exception. The method and field each have a different role to describe.

## 17. Function contract and local variables (Python)

**Insufficient:** `def page_bounds(start, count): return max(start, 0), max(start, 0) + count` (no docstring and no named explanation).

**Documented for a function whose caller supplies a non-negative count:**

~~~python
def page_bounds(start: int, count: int) -> tuple[int, int]:
    """Return the start and exclusive end of a page within a sequence.

    Negative start values are treated as zero. The caller provides a
    non-negative count; this function does not validate it.
    """
    # first is the starting index after adjusting a negative input.
    first = max(start, 0)
    # end is the index immediately after the selected page.
    end = first + count
    return first, end
~~~

**Why:** the function block describes both inputs, output and a restriction; each local value has a documented role.

## 18. Grouped and destructured variables (TypeScript)

**Insufficient:**

~~~ts
const { endpoint, retryDelayMs } = loadConfig()
~~~

**Documented:**

~~~ts
// Values taken from the current client configuration:
// - endpoint is the address used for outgoing API requests.
// - retryDelayMs is the pause in milliseconds before a permitted retry.
const { endpoint, retryDelayMs } = loadConfig()
~~~

**Why:** a single nearby block is sufficient for related variables **only because it names each one and explains what it means**. A generic label such as "Client settings" would not cover either binding.

## 19. Properties and constructor (C#)

**Documented for a class that normalizes a lower attempt bound:**

~~~csharp
/// <summary>Holds the retry limit used by the request sender.</summary>
public sealed class RetrySettings
{
    /// <summary>The maximum number of attempts; always at least one.</summary>
    public int MaxAttempts { get; }

    /// <summary>Creates settings with at least one allowed attempt.</summary>
    /// <param name="attempts">Requested attempt limit; values below one become one.</param>
    public RetrySettings(int attempts)
    {
        MaxAttempts = Math.Max(1, attempts);
    }
}
~~~

**Why:** the constructor and property are independently documented. The parameter's meaning is covered by the constructor block; no duplicate inline comment is required.

## 20. Loop bindings and a temporary value (Go)

**Documented:**

~~~go
// collectNames returns the names in the input records, preserving their order.
func collectNames(records []Record) []string {
    // names collects the values returned to the caller in input order.
    names := make([]string, 0, len(records))
    // index is the position of the record currently being read.
    for index := range records {
        // record is the item from that position in the input slice.
        record := records[index]
        names = append(names, record.Name)
    }
    return names
}
~~~

**Why:** the loop index and temporary are variables too. Their roles are described without inserting a comment after every operation.

## 21. Test function and test-local values (Python)

**Documented:**

~~~python
def test_empty_page_returns_no_items():
    """Check that an empty input produces an empty page without a cursor."""
    # records represents a source with no available events.
    records = []
    # result is the page returned for that empty source.
    result = make_page(records)
    assert result.items == []
    assert result.next_cursor is None
~~~

**Why:** the test function has its own docstring and both local values are explained. A descriptive test name does not replace required documentation.

---

## Calibrate by consequence, not size

Each authored declaration in the affected scope requires a documentation block or an explicit grouped-variable explanation, even when its implementation is short. Some examples above focus on a fragment of a larger function; they do **not** waive documentation for the enclosing function or other variables in real source. A complex public boundary can need several paragraphs and a transition table. Keep every necessary fact, without filler or invented guarantees.
