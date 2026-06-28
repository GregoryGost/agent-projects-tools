# Node.js Service E2E Patterns And Review

Use this reference when designing or reviewing E2E tests for TypeScript Node.js services without browser UI.

## What Counts As E2E Here

A Node.js service E2E test should exercise the service through a public boundary and include the real composition root or a production-like test composition.

Examples:

- send an HTTP request to the service and verify response plus persisted state;
- run a CLI command and verify exit code, stdout/stderr, and filesystem/database effects;
- publish a queue message and verify the externally visible side effect;
- run a scheduled-job handler with real test dependencies and verify output state.

## Good: HTTP API Through Public Boundary

```ts
import request from 'supertest';
import { createApp } from '../src/app';
import { resetTestDatabase } from './support/database';

describe('POST /users', () => {
  beforeEach(async () => {
    await resetTestDatabase();
  });

  it('creates a user and exposes it through the API', async () => {
    const app = await createApp({ env: 'test' });

    const createResponse = await request(app.server)
      .post('/users')
      .send({ email: 'user-e2e@example.test' })
      .expect(201);

    await request(app.server)
      .get(`/users/${createResponse.body.id}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.email).toBe('user-e2e@example.test');
      });
  });
});
```

Why this is good:

- The test uses the HTTP boundary.
- It verifies externally visible behavior.
- Test data is isolated.

## Bad: E2E That Calls Internals Directly

```ts
import { createUser } from '../src/users/createUser';

it('creates a user', async () => {
  const user = await createUser({ email: 'user@example.test' });

  expect(user.email).toBe('user@example.test');
});
```

Problems:

- This is closer to an integration/unit test.
- It bypasses routing, serialization, validation, auth, and composition.
- It does not prove the public service boundary works.

## Good: Real Disposable Dependency

```ts
import { PostgreSqlContainer } from '@testcontainers/postgresql';

let postgres: StartedPostgreSqlContainer;

beforeAll(async () => {
  postgres = await new PostgreSqlContainer('postgres:16-alpine').start();
  process.env.DATABASE_URL = postgres.getConnectionUri();
  await runMigrations(process.env.DATABASE_URL);
});

afterAll(async () => {
  await postgres.stop();
});
```

Why this is good:

- The database behavior is real.
- The dependency is disposable.
- Setup and teardown are explicit.

## Bad: Shared Uncontrolled Database

```ts
process.env.DATABASE_URL = 'postgres://shared-dev-db/app';
```

Problems:

- Tests can destroy or depend on shared state.
- Failures may depend on another developer or CI job.
- Cleanup is hard to guarantee.

## Good: CLI Through Process Boundary

```ts
import { execa } from 'execa';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

it('exports a report file', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'report-e2e-'));

  try {
    const result = await execa('node', ['dist/cli.js', 'export', '--out', dir], {
      env: { NODE_ENV: 'test' },
    });

    expect(result.exitCode).toBe(0);
    await expect(readFile(join(dir, 'report.json'), 'utf8')).resolves.toContain('summary');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
```

Why this is good:

- The CLI is tested as a user runs it.
- Filesystem effects are verified.
- Temporary files are cleaned up.

## Bad: Fixed Sleep For Async Completion

```ts
await queue.publish({ type: 'send-email', id: '123' });
await new Promise((resolve) => setTimeout(resolve, 5000));
expect(await sentEmails.count()).toBe(1);
```

Problems:

- The test can be slow and flaky.
- It may pass or fail based on machine timing.
- It hides the real readiness condition.

## Good: Bounded Wait For Observable Result

```ts
await queue.publish({ type: 'send-email', id: '123' });

await eventually(async () => {
  await expect(sentEmails.countByMessageId('123')).resolves.toBe(1);
});
```

Why this is good:

- The wait condition is explicit.
- The test can finish quickly when the system is ready.
- Timeout failures point to the missing observable result.

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
