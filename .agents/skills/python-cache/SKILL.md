---
name: python-cache
description: "Use for Python cache design and review: cache decision, TTL, key scope, invalidation, backend setup, test isolation, cashews usage, and FastAPI integration when FastAPI is active."
---

# Python Cache

Use this skill when `CODEX_PROJECT.md` declares Python caching active, or when a task changes cache setup, cached read paths, TTL, invalidation, cache backend configuration, or `cashews` usage.

This skill is standalone. It can be combined with FastAPI, database, HTTP client, or testing skills when those profiles are active.

Apply `.codex/rules/python_cache.md`, `python-core`, and this skill together.

When FastAPI is active, also apply `python-fastapi-expert` for app lifespan, middleware, dependency, and API contract concerns. Keep cache policy here and FastAPI routing/API policy in `python-fastapi-expert`.

Load references when needed:

- `references/patterns-and-review.md` for cache decision, key scope, invalidation, FastAPI wiring, and tests.
- `references/official-sources.md` for cache library and framework documentation links.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm cache library, backend, settings, dependency policy, validation commands, and active Python overlays.
3. Inspect cached functions, callers, write paths, settings, tests, and deployment assumptions.
4. Decide whether the read path is deterministic and whether bounded staleness is acceptable.
5. Define TTL, key scope, invalidation triggers, backend, and test coverage before adding cache behavior.
6. Run or report project-declared validation commands.

## Guardrails

- Do not add caching mechanically.
- Prefer service/domain read methods for business data caching.
- Keep routers and HTTP handlers free of cache decisions unless HTTP cache semantics are the explicit task.
- Use stable cache names that include all visibility-affecting inputs.
- Cache serializable DTOs, schemas, dataclasses, dictionaries, or scalar values.
- Do not cache live ORM entities, sessions, connections, requests, responses, or process-local runtime objects.
- Invalidate after successful writes.
- Treat TTL as a fallback, not the primary consistency mechanism for mutable data.
- Use isolated cache backends or cleanup in tests.
- Use production-safe shared backends for multi-worker deployments.

## Review Checklist

- [ ] Cache behavior is active in `CODEX_PROJECT.md` or directly touched by the task.
- [ ] Cached operation is deterministic and read-oriented.
- [ ] TTL and cache naming are explicit.
- [ ] Visibility scope is included in cache naming when needed.
- [ ] Cached value is serializable and detached from live resources.
- [ ] Write paths invalidate after success.
- [ ] Tests cover miss, hit, invalidation, and scoped values.
- [ ] If FastAPI is active, app wiring and API behavior were reviewed with `python-fastapi-expert`.
