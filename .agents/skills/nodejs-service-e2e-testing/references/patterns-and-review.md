# Node.js Service E2E Patterns And Review

Use this reference when designing or reviewing E2E tests for TypeScript Node.js services without browser UI.

## What Counts As E2E Here

A Node.js service E2E test should exercise the service through a public boundary and include the real composition root or a production-like test composition.

Examples:

- send an HTTP request to the service and verify response plus persisted state;
- run a CLI command and verify exit code, stdout/stderr, and filesystem/database effects;
- publish a queue message and verify the externally visible side effect;
- run a scheduled-job handler with real test dependencies and verify output state.

## HTTP API Pattern

- Prefer Supertest when the app exposes an `http.Server` or request handler and the project supports in-process app creation.
- Prefer Node `fetch`/Undici when testing a real running service or a black-box deployment-like boundary.
- Assert public response shape, status, headers, and externally visible side effects.
- Do not assert controller/private function calls.

## Dependency Pattern

- Use real disposable dependencies for core behavior: database, Redis, queue, object storage, or broker.
- Use Testcontainers when containers are allowed and the dependency is important to the flow.
- Use project-declared Docker Compose when the repository already standardizes service dependencies that way.
- Stub third-party providers when the provider is outside the E2E scope, paid, unstable, or unavailable in CI.

## Data Pattern

- Run migrations before tests when the flow depends on schema.
- Seed only the minimum required records.
- Use unique test IDs or isolated databases/schemas/queues/buckets.
- Clean data after tests or use disposable environments.
- Keep fixtures readable and close to the scenario.

## CLI Pattern

- Execute the declared command through a process boundary.
- Assert exit code, stdout, stderr, files, database state, or emitted events.
- Use isolated temp directories and test-specific environment variables.
- Avoid importing CLI internals unless the test is intentionally unit/integration rather than E2E.

## Worker And Queue Pattern

- Publish a realistic message/job to the declared queue or handler boundary.
- Wait for explicit completion, persisted state, emitted event, or observable side effect.
- Avoid fixed sleeps; use bounded polling or project-approved wait helpers.
- Ensure queues are isolated and drained between tests.

## Anti-patterns

- Mocking the whole service composition root.
- Importing private modules and calling internal functions directly.
- Sharing one mutable database state across unrelated tests.
- Sleeping for arbitrary time instead of waiting for readiness or observable completion.
- Running against production-like shared environments without explicit safety controls.
- Duplicating unit tests as slow E2E tests.

## Review Questions

- What public boundary is under test?
- Which dependencies are real and why?
- Which dependencies are stubbed and why?
- How are migrations, seed data, and cleanup handled?
- Can the test run independently and in any order?
- Can it run in CI without hidden local state?
- Does it verify externally visible behavior instead of implementation details?
- Does a narrower unit or integration test already cover the same confidence?
