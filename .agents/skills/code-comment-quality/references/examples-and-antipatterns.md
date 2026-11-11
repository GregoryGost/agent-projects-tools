# Worked Contrasts: What a Maintainer Actually Needs to Know

**Illustrative examples, not executable project code or universally correct contracts.** Assume the stated behavior exists in each hypothetical component; before using a similar comment, verify it against the target's complete source, tests, callers and dependency contracts. The snippets use several languages only to expose different engineering situations. Translate natural-language prose to the project's selected language and use its doc-comment syntax. Each lesson concerns **semantic information**, not length.

## 1. Obvious behavior: no comment is better (TypeScript)

**Unhelpful:**

~~~ts
// Increase the retry counter by one.
retryCount += 1
~~~

**Better:**

~~~ts
retryCount += 1
~~~

**Why:** the comment contributes no additional fact. An invented rationale would be worse. A short function can be sufficiently self-documenting.

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

The module does not delete events or guarantee end-to-end exactly-once effects.
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
// Only the scheduler moves pending to running. The worker may complete a
// running task while another goroutine requests cancellation; both paths
// resolve through the same state guard, and only one terminal transition wins.
//
// done and cancelled are terminal. Once either is published, callbacks may
// observe the result but must not restart or complete the task again.
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
// The token identifies one lease generation, not just the resource. An expiry
// callback for an older lease can race with renewal of the same resource.
// Compare the generation and change the lease state under the same lock;
// otherwise a late callback could cancel the newly renewed lease.
mu.Lock()
defer mu.Unlock()
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
// Completion can race with the controller's teardown. Use the guarded
// QPointer before passing on the reply data; do not retain the reply itself.
// Schedule deletion after the last read rather than deleting it while its
// finished signal is being delivered.
if (controller) {
    controller->accept(reply->readAll());
}
reply->deleteLater();
~~~

**Why:** the comment states ownership and callback-lifetime constraints rather than narrating a cleanup call. The final sentence requires actual cancellation/receiver handling in the target code; it must not be added as a speculative promise.

## 7. HTTP retry and ambiguous completion (TypeScript)

**Insufficient:** `// Retry the request when the connection fails.`

**Stronger for an implementation that retries only declared-safe operations:**

~~~ts
// A lost response does not prove that the server skipped the operation.
// Automatic retry is limited to calls whose server contract permits replay;
// an unsafe mutation can otherwise be applied twice after a successful
// commit followed by a connection failure. Leave ambiguous mutations to the
// caller unless the endpoint provides a verified idempotency mechanism.
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
/// If the acknowledgement is lost, the caller must reconcile the outcome
/// before replaying a non-idempotent batch.
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
// Timer callbacks use a separate bounded queue so a backlog of ordinary work
// cannot prevent expiry processing from being scheduled. This separates the
// two latency-sensitive consumers; it does not guarantee that callbacks run
// immediately or in wall-clock order.
~~~

**Why:** it describes the precise purpose and the limit of the guarantee. Avoid claims about benchmarks, speedups, or decisions by previous authors without evidence.

## 11. Ordering and persistence boundary (SQL)

**Insufficient:** `-- Insert a row before sending the notification.`

**Stronger for an actual transactional outbox:**

~~~sql
-- Store the outgoing event in the same transaction as the business change.
-- The dispatcher must not publish it before commit: otherwise consumers could
-- observe an event for a change that later rolls back. A dispatcher retry may
-- deliver the same committed event again, so consumer deduplication remains
-- necessary.
~~~

**Why:** this ties the ordering to a real failure mode and explains the delivery consequence. Only use when the schema/dispatcher behavior supports the outbox contract.

## 12. Test intent and regression protection (Python)

**Insufficient:** `# Call cancel and assert that state is cancelled.`

**Stronger where the test actually exercises the race:**

~~~python
# Reproduce expiry arriving after renewal of the same lease. Cancellation
# must be generation-scoped: the stale expiry may finish, but the new lease
# remains active and its notification is not emitted a second time.
~~~

**Why:** it explains which defect the test detects. Ensure synchronization in the test actually controls this interleaving; a comment cannot make a nondeterministic test reliable.

## 13. Stale or speculative explanation: correct or remove

**Misleading after implementation changes:**

~~~ts
// Exactly once: successful sends are never retried.
await transport.send(payload)
~~~

**Better:** confirm what `send` and the surrounding caller actually guarantee. If retries or ambiguous outcomes are possible, replace the false promise with a verified account of commit/replay semantics. If no non-obvious invariant remains, **remove the comment** rather than replacing it with another guess.

**Why:** elaborate but false documentation is worse than a missing comment.

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

## Calibrate by consequence, not size

A single sentence may completely explain a local invariant. A public boundary with cancellation, replay, persistence, and concurrent state can need several paragraphs plus a transition table. A long comment is not evidence of quality: ask which supported fact would be lost if each sentence were removed, and which important fact is still missing. Do not retrofit every example into one component.
