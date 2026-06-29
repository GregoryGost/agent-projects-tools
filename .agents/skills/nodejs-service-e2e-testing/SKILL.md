---
name: nodejs-service-e2e-testing
description: "Use for E2E testing of non-browser TypeScript Node.js services: HTTP APIs, CLIs, workers, queues, real dependencies, Testcontainers/Docker services, Supertest/fetch, process boundaries, setup/teardown, and E2E review."
---

# Node.js Service E2E Testing

Use this skill for TypeScript Node.js projects that do not expose a browser UI: APIs, CLIs, workers, queue consumers, scheduled jobs, or mixed services.

Apply `CODEX_PROJECT.md`, `.codex/rules/nodejs_service_e2e_testing.md`, `typescript-core`, and `typescript-testing` together with this skill.

Load references when needed:

- `references/patterns-and-review.md` for E2E design patterns, code examples, anti-patterns, and review prompts.
- `references/official-sources.md` for official Jest, Supertest, Testcontainers, Node.js, and TypeScript references.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm that the target is a non-browser TypeScript Node.js project.
3. Identify the public E2E boundary: HTTP API, CLI command, worker, queue, scheduled job, filesystem flow, or database-backed service flow.
4. Inspect `package.json`, lockfile, `tsconfig*`, Jest config, service entrypoint, composition root, migrations, seeds, env loading, and existing E2E tests.
5. Confirm project-declared E2E command, setup, teardown, dependency policy, environment policy, port policy, and artifact policy.
6. Decide which dependencies should be real, containerized, project-declared, or stubbed.
7. Add the smallest E2E scenario that validates a critical user/system flow.
8. Run or report the project-declared E2E command.

## Baseline

- Use Jest as the runner/orchestrator.
- Use Supertest for in-process HTTP API tests when the service exposes a server/app object.
- Use Node `fetch`/Undici for black-box HTTP tests against a running service.
- Use process boundaries for CLI tests.
- Use Testcontainers or project-declared Docker Compose for real disposable dependencies when allowed.
- Keep E2E tests separate from unit/integration tests when setup cost or runtime is meaningful.
- Do not use Playwright or browser tools for Node.js-only projects.

## Guardrails

- Do not mock the application under test.
- Do not weaken TypeScript visibility or export internals for E2E.
- Do not run destructive tests against production or shared uncontrolled environments.
- Keep scenario data isolated and cleaned up.
- Prefer readiness checks, health probes, observable events, or bounded polling over fixed sleeps.
- Clean up app instances, containers, connections, temp files, queues, child processes, and ports.
- Preserve Jest mock cleanup and timer cleanup policy from `typescript-testing`.

## Review Checklist

- [ ] The target is non-browser Node.js, not Vue/browser E2E.
- [ ] Public boundary under test is explicit.
- [ ] Real/containerized/stubbed dependencies are justified.
- [ ] Migrations/seeds/test data are deterministic and isolated.
- [ ] Setup and teardown clean up app instances, containers, connections, env, ports, queues, child processes, and temp files.
- [ ] Assertions target externally visible behavior.
- [ ] E2E command comes from project configuration.
- [ ] Unit/integration coverage was not duplicated unnecessarily.
