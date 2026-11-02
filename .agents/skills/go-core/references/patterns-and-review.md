# Go patterns and review

## Prefer clear ownership

Good: create a database/client at the composition root, pass a scoped dependency to services, and close it during application shutdown.

Bad: open a new database client per request without explicit pooling policy; start an unowned goroutine in a handler.

## Errors

Good: wrap an error with context and `%w`, then use `errors.Is` at the correct boundary to map it.

Bad: compare error strings, silently ignore `Close` or transaction errors, or return raw driver errors to HTTP clients.

## Interfaces

Good: define a small interface at a call site because there is a real production abstraction or test seam.

Bad: create a one-method interface for every type as mechanical ceremony.

## Context and goroutines

Good: propagate caller context into I/O and provide cancellation plus join/drain behavior for owned goroutines.

Bad: retain a request context beyond its lifetime, silently detach work, or assume context cancellation automatically joins child goroutines.

## Review

- Effective language version, toolchain and build constraints verified.
- No unintended dependency or public API change.
- Ownership of resources, cancellation and concurrent state explicit.
- Error contracts are testable and preserve causal information.
- No premature refactor or unnecessary abstraction.
- Project-declared commands run or precise limitations reported.

