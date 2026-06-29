# Python cache rules

Apply this rule when `CODEX_PROJECT.md` declares Python caching active, or when the task changes Python cache setup, cached read paths, TTL, invalidation, or cache backend configuration.

This rule is standalone. Combine it with FastAPI, database, HTTP client, or testing skills only when those profiles are active.

## Required skills

Use together with:

- `python-core`;
- `python-cache`.

## Source of truth

Before changing cache behavior:

1. Read `CODEX_PROJECT.md`.
2. Check cache library, backend, settings, dependency policy, validation commands, and active Python profiles.
3. Inspect cached functions, callers, write paths, settings, tests, and deployment assumptions.
4. Use project-declared commands.

## Constraints

- Do not add caching mechanically.
- Cache only deterministic read behavior when bounded staleness is acceptable.
- Use explicit TTL and stable cache naming.
- Keep visibility scope in cache naming when the result depends on user, tenant, role, filters, pagination, locale, or feature flags.
- Cache serializable values, not live ORM entities or runtime resources.
- Invalidate after successful writes.
- Isolate cache state in tests.
