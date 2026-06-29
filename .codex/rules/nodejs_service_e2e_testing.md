# Node.js service E2E testing rules

Apply this rule when `CODEX_PROJECT.md` declares Node.js service E2E testing active, or when the task directly changes E2E tests for a TypeScript Node.js API, service, CLI, worker, queue consumer, or scheduled job.

This rule is for non-browser TypeScript projects. Do not use Playwright, browser automation, DOM assertions, or Vue-specific tools here.

## Required skills

Use together with:

- `typescript-core`;
- `typescript-testing`;
- `nodejs-service-e2e-testing`.

## Source of truth

Before adding or changing Node.js service E2E tests:

1. Read `CODEX_PROJECT.md`.
2. Check service type: HTTP API, CLI, worker, queue consumer, scheduled job, or mixed service.
3. Check declared E2E command, Jest command, environment policy, dependency policy, coverage policy, and artifact policy.
4. Inspect `package.json`, lockfile, `tsconfig*`, Jest config, service entrypoint, composition root, config loader, migrations, seeds, env loading, and existing E2E tests.
5. Identify the public boundary under test and keep assertions at that boundary.
6. Load `nodejs-service-e2e-testing/references/patterns-and-review.md` when adding or changing service E2E tests.
7. Use project-declared commands and do not invent script names.

## Relationship to existing rules

- `typescript-core` defines TypeScript structure, type boundaries, and class/object modeling.
- `typescript-testing` defines Jest-based unit and integration testing.
- This rule adds service-level E2E behavior across real process/application boundaries.
- Do not duplicate unit or integration tests here when a narrower Jest test gives the same confidence.

## E2E boundaries

Use the real public boundary of the service:

- HTTP API: in-process server with Supertest, or black-box HTTP with Node `fetch`/Undici against a running service.
- CLI: run the built or project-declared command through a process boundary.
- Worker or queue consumer: publish a message/job and observe public side effects.
- Database-backed flow: run migrations/seeds and verify externally visible behavior.
- Filesystem flow: use isolated temp directories and clean them up.

## Dependencies and data

- Prefer disposable real dependencies for E2E: test database, Redis, broker, object storage, or other service dependencies.
- Use Testcontainers or project-declared Docker Compose services when the project policy allows containers.
- Run migrations and seed only the data required for the scenario.
- Isolate E2E data by unique IDs, schemas, databases, queues, buckets, temp directories, or cleanup hooks.
- Never run destructive E2E tests against production or shared uncontrolled environments.

## Mocking policy

- Do not mock the application module under test.
- Do not replace the main service composition root with isolated unit-test wiring.
- Stub only dependencies outside the E2E scope, such as paid third-party APIs, unstable external systems, or provider sandboxes that are unavailable in CI.
- Prefer contract-faithful fakes for external systems when real dependencies are impractical.
- Keep mocks explicit and local to the E2E scenario.

## Jest E2E policy

- Use Jest as the runner because TypeScript testing is Jest-based.
- Keep E2E Jest config, file pattern, timeout, setup, teardown, and environment explicit.
- Use `node` environment by default.
- Keep type checking as a separate validation step unless the project explicitly performs it through the Jest toolchain.
- Separate E2E commands from unit/integration commands when the project has meaningful setup cost.

## Determinism and cleanup

- Avoid real time waits. Prefer readiness checks, health endpoints, wait strategies, explicit event completion, or bounded polling for observable effects.
- Control clocks, random IDs, ports, environment variables, files, queues, and external calls.
- Ensure app instances, containers, connections, temp files, queues, child processes, and ports are cleaned up after tests.
- Keep E2E scenarios small, critical, and behavior-oriented.
- Report known setup gaps, unavailable dependencies, or non-reproducible environment assumptions.
