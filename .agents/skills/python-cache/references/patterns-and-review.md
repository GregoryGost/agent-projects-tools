# Python Cache Patterns And Review

Use this reference when designing or reviewing Python cache behavior.

## Decision Checklist

Add caching only when the repository shows:

- the operation is deterministic and read-oriented;
- bounded staleness is acceptable;
- the latency, cost, or frequency problem is clear;
- all inputs that affect the result are known;
- write paths that must refresh cached values are known;
- tests can cover repeated reads, refresh, and separate scopes.

If any answer is unknown, do not add caching yet.

## Placement

Preferred placement:

- service read methods returning DTOs or schemas;
- repository read projections returning scalar values, dictionaries, dataclasses, or DTOs.

Avoid caching routers by default. Avoid caching live ORM entities, sessions, connections, request objects, response objects, lazy loaders, or process-local runtime state.

## Naming, TTL, And Refresh

- Use explicit TTL.
- Use stable names based on business identifiers.
- Include result-shaping inputs such as tenant, user, filters, pagination, locale, feature flags, and schema version when relevant.
- Change schema version when the cached DTO shape changes.
- Refresh or delete cached values only after a successful write.
- Treat TTL as a fallback, not as the main consistency strategy for mutable data.

## FastAPI Integration

When FastAPI is active:

- configure shared cache resources in application lifespan or the project resource manager;
- close cache resources during shutdown when required by the library;
- keep HTTP handlers thin;
- prefer service-level data caching for business endpoints;
- use HTTP cache middleware only when HTTP cache semantics are part of the task.

## Testing

- Use an isolated backend for tests.
- Clear cache state between test cases when needed.
- Test repeated reads.
- Test refresh after create, update, or delete.
- Test separate scopes for different users, tenants, filters, or pagination.

## Review Questions

- What problem does caching solve?
- Is stale data acceptable?
- Which inputs affect result shape or visibility?
- Which writes refresh cached values?
- Are cached values detached from live resources?
- Is test isolation explicit?
