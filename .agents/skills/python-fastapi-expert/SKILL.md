---
name: python-fastapi-expert
description: "Use for FastAPI backend work: routers, dependencies, request and response models, OpenAPI contracts, async boundaries, background tasks, service/repository coordination, and FastAPI review."
---

# Python FastAPI Expert

Use this skill when `CODEX_PROJECT.md` declares FastAPI active, or when a task changes FastAPI routers, dependencies, request/response models, OpenAPI metadata, lifespan, middleware, or FastAPI tests.

Apply `CODEX_PROJECT.md`, `python-core`, `.codex/rules/python_fastapi.md`, and this skill together.

Cache behavior is handled by `python-cache`. If a task touches Python cache behavior, add `.codex/rules/python_cache.md` and `python-cache`.

Load references when needed:

- `references/openapi-pydantic-models.md` for Pydantic request/response models, OpenAPI schema details, endpoint metadata, and API contract tests.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm FastAPI is active and identify app entry point, routers, dependency policy, validation commands, and active overlays.
3. Inspect routers, dependencies, schemas, services, repositories, settings, tests, and documentation before editing.
4. Keep route functions thin: HTTP input handling, dependency resolution, and service/domain call.
5. Keep database query details in repositories or data-access modules.
6. Keep request/response models separate from database models and internal DTOs.
7. Run or report project-declared validation commands.

## FastAPI Guidelines

- Use `async def` when the handler or dependency awaits async I/O.
- Use synchronous functions only for synchronous work that is safe for the selected execution boundary.
- Use `Depends()` or the project dependency pattern instead of constructing services inside routes.
- Keep public errors, status codes, response models, and OpenAPI metadata intentional.
- Use `BackgroundTasks` only for lightweight post-response work.
- Use project worker or queue mechanisms for durable or retryable jobs.
- Keep lifespan/startup/shutdown ownership explicit for app-wide resources.

## Review Checklist

- [ ] FastAPI is active or directly touched by the task.
- [ ] Routers stay thin and delegate business behavior.
- [ ] Dependencies follow project conventions.
- [ ] Request/response models are separated from persistence models and internal DTOs.
- [ ] Response models, status codes, documented errors, and OpenAPI metadata match the API contract.
- [ ] Background work uses the correct FastAPI or worker mechanism.
- [ ] Tests cover API contracts, service behavior, repository integration, and schema changes where relevant.
- [ ] Cache-related work uses `python-cache`.
