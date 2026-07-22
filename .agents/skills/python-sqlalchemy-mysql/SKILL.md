---
name: python-sqlalchemy-mysql
description: "Use for SQLAlchemy 2.x with MySQL through aiomysql, including AsyncEngine pooling, InnoDB transactions, isolation, locks, deadlock retries, MySQL DML, migrations, and integration tests."
---

# Python SQLAlchemy MySQL

## 1. Scope And Activation

Use this skill for MySQL-specific SQLAlchemy 2.x behavior when the active driver is `aiomysql`: async engine configuration, SQLAlchemy pooling, InnoDB transactions and locking, deadlocks, lock wait timeouts, isolation levels, MySQL data types, character sets and collations, MySQL-specific DML, DDL and migrations, and real-MySQL integration tests.

Apply `python-sqlalchemy-core` together with this skill for backend-neutral models, repositories, sessions, transaction ownership, query construction, persistence error mapping, and generic database tests.

Do not use this skill for SQLite, PostgreSQL, another MySQL driver, direct `aiomysql` pools, `aiomysql.sa`, or MariaDB-specific behavior. A server that identifies itself as MariaDB requires separately verified materials or an explicit project-specific policy; do not silently treat it as MySQL.

Do not use this skill for generic FastAPI routing unless database lifecycle, dependency wiring, transaction boundaries, repository calls, or SQL behavior are involved.

Read the database profile in `CODEX_PROJECT.md` before changing persistence behavior. Confirm the active server family and version, SQLAlchemy and `aiomysql` version sources, connection-settings source, pool policy, isolation level, SQL mode, character set and collation policy, migration tool, runtime write policy, deployment worker count, and integration-test boundary.

For concrete bad/good examples and the final review checklist, read `references/patterns-and-review.md` when implementing or reviewing MySQL engines, pools, repositories, locking, retries, migrations, or tests.

For version and feature evidence, read `references/official-sources.md` and prefer the exact MySQL server-version documentation declared by the project.

## 2. Required Dependencies

- `python-sqlalchemy-core`

## 3. Optional Coordination

Apply additional active skills only when the task touches their area:

- `python-testing` for pytest, pytest-asyncio, fixtures, pytest-xdist, coverage, and integration-test review.
- `python-fastapi-expert` for lifespan ownership, request dependencies, service orchestration, response behavior, and startup/shutdown handling.
- `python-backend-security` for credentials, TLS, tenant predicates, authorization filters, sensitive SQL parameters, logs, and secret handling.
- The active cache skill for post-commit cache invalidation. Do not duplicate cache-key, TTL, tag, or invalidation rules here.

## 4. Server Family And Version Gate

- Treat MySQL and MariaDB as different server families even though SQLAlchemy uses a shared dialect module for many features.
- Determine the runtime server family and exact version from a real connection or an approved deployment source before relying on version-specific DDL, DML, isolation, locking, or type behavior.
- A version string containing MariaDB is not a valid activation signal for this skill's MySQL-specific guarantees.
- Do not claim support for an untested Python, SQLAlchemy, `aiomysql`, or MySQL version only because dependency metadata permits installation.
- When the active Python version is absent from upstream `aiomysql` classifiers or CI, require a real compatibility test covering installation, connection, execute, commit, rollback, pool checkout, recycle or reconnect, representative type round-trips, and repository integration tests.
- Keep dependency versions in the project manifest or lockfile. Do not hardcode dependency pins in this skill.

## 5. Driver And Engine Configuration

- Use the SQLAlchemy asyncio dialect URL `mysql+aiomysql://...` with `create_async_engine()`.
- Use `aiomysql` as SQLAlchemy's async DBAPI driver. Do not create a parallel `aiomysql.create_pool()` for repositories that already use a SQLAlchemy engine.
- Do not use `aiomysql.sa`; it is a separate legacy integration and is not the SQLAlchemy 2.x asyncio dialect.
- Build URLs with `sqlalchemy.URL.create()` when credentials are assembled from separate settings. Do not concatenate usernames, passwords, hosts, and database names into a URL manually.
- Declare `charset=utf8mb4` or another project-approved encoding explicitly instead of relying on an environment default.
- Configure one `AsyncEngine` per database role and process lifecycle, not per request, service call, repository, or task.
- Configure `async_sessionmaker` once next to the engine.
- Let `create_async_engine()` select its asyncio-compatible SQLAlchemy pool unless the project has a documented reason to override the pool class.
- Do not pass `AsyncAdaptedQueuePool` explicitly merely to restate SQLAlchemy's default async pooling behavior.
- Keep engine disposal in the owning application or database-component lifecycle.
- Create engines after worker process creation or separately inside each worker. Never share live pooled DBAPI connections across process boundaries.

## 6. Pool Sizing, Timeouts, And Disconnects

- Calculate the maximum connection budget across all engines, worker processes, replicas, jobs, migrations, and administrative reserve. Do not size a pool as if only one process existed.
- Use this upper-bound calculation when overflow is enabled:

  `(pool_size + max_overflow) * worker_processes * replicas * equivalent_engines`

- Keep `pool_size`, `max_overflow`, and `pool_timeout` project-configurable.
- Distinguish at least these timeout categories: pool checkout timeout, TCP/connect timeout, InnoDB row-lock wait timeout, metadata-lock timeout, and application statement/deadline timeout.
- Do not reuse one setting such as `mysql_timeout` for unrelated timeout categories.
- Use `pool_pre_ping=True` when the project needs stale-connection detection at checkout.
- Set `pool_recycle` according to the infrastructure and MySQL idle-connection policy, including `wait_timeout`; do not copy a universal constant without evidence.
- Understand the boundary of `pre_ping`: it can detect a stale connection before work starts, but it cannot transparently recover a transaction that disconnects in progress.
- A disconnect during a transaction fails that unit of work. Retry the complete unit of work only when replay safety and the project retry policy permit it.
- Do not log passwords or unsanitized connection URLs. Use `URL.render_as_string(hide_password=True)` or an equivalent guaranteed sanitizer.

## 7. Session And Transaction Lifecycle

- Use one `AsyncSession` per request, task, unit of work, or explicit batch.
- Never share one `AsyncSession` across concurrent tasks, including calls grouped through `asyncio.gather()`.
- Use `async with session_factory()` and `async with session.begin()` for visible resource and transaction boundaries.
- Prefer `expire_on_commit=False` for ordinary async ORM use when objects must be read after commit without implicit IO.
- Avoid implicit lazy loading. Eagerly load required relationships or map DTO/read models while the session is open.
- Do not treat SQLAlchemy's removed ORM autocommit pattern as a MySQL transaction strategy.
- Do not commit inside low-level repositories unless a repository explicitly owns the complete unit of work.
- Repository write methods must flush when generated identifiers, database defaults, constraint outcomes, or typed error mapping depend on database execution.
- Keep write transactions short. Perform validation, HTTP calls, NATS operations, cache reads, filesystem work, sleeps, and slow computation outside the transaction.
- Perform cache invalidation and external side effects only after successful commit.
- When a database mutation and external event must be coordinated, use the project-approved transactional outbox or another explicit consistency mechanism instead of publishing inside the database transaction.

## 8. InnoDB, Isolation, And Locking

- Require InnoDB for tables that depend on transactions, row locks, or foreign keys. Verify existing table engines instead of assuming them.
- Declare the transaction isolation policy in `CODEX_PROJECT.md`, engine settings, or approved runtime configuration. Do not rely on an unknown server default.
- Use SQLAlchemy-supported isolation names and verify the effective runtime value through a real connection.
- Put correctness-critical read-modify-write behavior inside one transaction and protect it with an atomic DML statement, a database constraint, optimistic locking, or an explicit locking read.
- Prefer atomic `UPDATE ... WHERE ...` when the operation can be expressed without a separate read.
- Use `.with_for_update()` for locking reads instead of hand-built SQL when SQLAlchemy can express the required behavior.
- Acquire locks in a deterministic order across rows and tables.
- Ensure predicates used by `UPDATE`, `DELETE`, and locking reads are supported by appropriate indexes. Missing or poorly ordered indexes can widen scans, ranges, and locks.
- Use `NOWAIT` only when immediate lock failure is part of the public operation contract.
- Use `SKIP LOCKED` only for queue-like work claiming. It returns an intentionally incomplete view and is not suitable for general business reads.
- Do not use `LOCK TABLES` as a substitute for normal InnoDB transaction design.
- Treat user-level locks such as `GET_LOCK()` as connection-scoped resources. They require explicit release and are unsafe to leave on pooled connections.

## 9. Deadlocks, Lock Timeouts, And Retry

- Treat occasional InnoDB deadlocks as an expected concurrent outcome that applications must classify and handle.
- Reduce deadlocks with short transactions, deterministic lock order, narrow indexed predicates, and small write batches.
- Distinguish a deadlock from an InnoDB row-lock wait timeout and from a metadata-lock timeout.
- Translate known MySQL/SQLAlchemy retryable persistence failures to stable repository or unit-of-work errors. Services must not inspect raw driver exceptions or numeric codes.
- After a deadlock or lock timeout, roll back and discard the failed transaction before any retry.
- Retry the complete unit of work in a fresh session; never retry only the last SQL statement inside the failed transaction.
- Retry only replay-safe or idempotency-protected operations.
- Use bounded attempts and project-approved backoff with jitter. Never retry indefinitely.
- Keep post-commit side effects outside the retried transaction so they execute only once after a successful commit.
- Unknown operational errors are not retryable by default.
- Record safe observability fields for retries: operation name, attempt, stable error category, elapsed time, and sanitized entity identifiers.

## 10. Character Sets, Collations, SQL Mode, And Types

- Declare the connection character set and the schema/table/column collation policy. Use `utf8mb4` for full Unicode unless the project documents another requirement.
- Treat collation as part of the data model because it affects equality, uniqueness, ordering, case behavior, accent behavior, and trailing-space semantics.
- Use lowercase `snake_case` names for portable table, index, and constraint naming unless an existing schema requires another convention.
- Verify the effective `sql_mode`; do not assume strict validation is active.
- Avoid correctness-critical use of `INSERT IGNORE`, which can demote data problems to warnings.
- Specify lengths for `String`/`VARCHAR` where MySQL requires or benefits from them.
- Use `Numeric`/`DECIMAL` for money and exact decimal quantities, not binary floating point.
- Define a consistent UTC and timezone policy for `DATETIME` and `TIMESTAMP`, including fractional-second precision when required.
- Test round-trip behavior for JSON, binary values, booleans, unsigned integers, enums, generated values, and datetime fields on the exact active server family and version.
- Do not assume that a `UNIQUE` index containing nullable columns enforces one logical `NULL` value. MySQL permits multiple `NULL` values in a unique index.
- Keep ORM models separate from public API schemas and domain DTOs as required by `python-sqlalchemy-core`.

## 11. MySQL-Specific DML

- Use `sqlalchemy.dialects.mysql.insert()` for `ON DUPLICATE KEY UPDATE`.
- Treat `ON DUPLICATE KEY UPDATE` as matching any primary or unique key conflict. It does not provide PostgreSQL-style selection of one conflict target or a universal do-nothing branch.
- Review every primary and unique constraint before using an upsert. Multiple uniqueness paths can update an unintended existing row unless the identity contract is explicit.
- Specify update values explicitly. Python-side `Column.onupdate` values are not automatically applied by `ON DUPLICATE KEY UPDATE`.
- Do not use `REPLACE` as a general upsert; its delete/insert semantics are materially different from an update.
- Do not assume MySQL and MariaDB have identical `RETURNING` support.
- Define the contract for `rowcount` before using it for not-found or optimistic-lock decisions. SQLAlchemy's MySQL dialect configures matched-row semantics for updates.
- Use version columns or atomic predicates for optimistic concurrency when lost updates matter.
- Bound bulk insert and update sizes by transaction latency, packet limits, lock footprint, memory, and failure recovery requirements.
- Do not hold one transaction open for an unbounded import or backfill.

## 12. Migrations And DDL

- Use the migration tool and policy declared in `CODEX_PROJECT.md`. Do not introduce Alembic, raw SQL migrations, or replacement tooling without explicit approval.
- Treat MySQL DDL as capable of implicit commit. Do not describe schema changes as ordinary rollback-able application transactions.
- Separate schema changes from long data backfills.
- Prefer expand, migrate/backfill, and contract phases for production compatibility.
- Evaluate metadata-lock behavior before production DDL. Long-running application transactions can block schema changes.
- Use a bounded session-level metadata-lock timeout or an approved deployment timeout policy rather than waiting indefinitely.
- Use `ALGORITHM`, `LOCK`, instant/inplace claims, functional indexes, generated columns, and online-DDL features only after checking the exact MySQL version.
- Do not edit already-applied migrations without an explicit history/checksum decision.
- Test both fresh-schema creation and upgrade from the previously supported schema state.
- Verify indexes, constraints, collations, generated expressions, defaults, data preservation, and application compatibility after migration.

## 13. Security And Observability

- Keep credentials in the project-approved settings provider, environment, or secret manager.
- Require TLS according to the project security profile; do not disable certificate verification silently.
- Keep full DSNs, passwords, access tokens, and private key material out of logs and exceptions.
- Use `hide_parameters=True` or another approved policy when SQL parameters may contain secrets or personal data.
- Enable SQL echo only through an explicit debug setting and never assume it is safe in production.
- Startup diagnostics may record sanitized SQLAlchemy, `aiomysql`, MySQL family/version, effective isolation, SQL mode, charset, collation, and pool configuration.
- Define startup behavior as fail-fast or explicitly degraded. A database failure must not be disguised as an ordinary not-found result.
- Distinguish health checks from readiness checks and from business queries.
- Observe at least pool checkout pressure, overflow, pool timeout, transaction latency, deadlocks, lock wait timeouts, disconnects, retries, and migration lock failures when the platform supports those metrics.

## 14. Testing Requirements

- Apply `python-testing` for general pytest, pytest-asyncio, fixtures, coverage, and assertion rules when tests are in scope.
- Run repository integration tests against a real MySQL server. SQLite is not a valid substitute for MySQL dialect, locking, collation, DDL, or transaction behavior.
- Match the production MySQL major/minor version, SQL mode, charset/collation, and isolation policy as closely as the project requires.
- Isolate test databases or schemas by test run and pytest-xdist worker. Do not let parallel workers share mutable schema or data.
- Do not mock SQLAlchemy for repository integration tests.
- Test commit and rollback, constraints, expected typed errors, optimistic concurrency, deadlock retry, lock timeout handling, pool checkout timeout, stale connections, disconnect-in-transaction behavior, and migration upgrades.
- Test `ON DUPLICATE KEY UPDATE` against every relevant unique constraint.
- Test case, accent, Unicode, trailing-space, nullable-unique, JSON, binary, decimal, and datetime behavior when these affect the schema contract.
- Verify that SQLAlchemy, DBAPI, `aiomysql`, and raw MySQL exceptions do not escape repository or unit-of-work public boundaries.
- Keep concurrency tests deterministic through explicit coordination primitives and server locks; do not depend on arbitrary sleeps.

## 15. Review Workflow

When reviewing SQLAlchemy + MySQL through `aiomysql`:

- Load `references/patterns-and-review.md` for concrete anti-patterns and the final checklist.
- Apply `python-sqlalchemy-core`; apply `python-testing`, `python-fastapi-expert`, `python-backend-security`, and the active cache skill only when their scopes are touched.
- Inspect the project profile, manifest and lockfile, engine/session wiring, repositories, transaction owners, migrations, settings, deployment worker count, and integration tests.
- Verify runtime MySQL family/version evidence and reject silent MariaDB substitution.
- Verify that `mysql+aiomysql` is used through `create_async_engine()` and that direct `aiomysql` pooling or `aiomysql.sa` does not split connection ownership.
- Verify pool budget across workers and replicas, distinct timeout categories, stale-connection handling, and safe engine lifecycle.
- Verify one session per concurrent task, explicit transactions, no hidden lazy loading, and no external side effects inside write transactions.
- Verify InnoDB, isolation, indexed locking predicates, deterministic lock order, and correct `NOWAIT`/`SKIP LOCKED` use.
- Verify retry classification, complete unit-of-work retry in a fresh session, bounded attempts, replay safety, and post-commit side-effect placement.
- Verify MySQL-specific DML semantics, SQL mode, charset/collation, exact types, nullable uniqueness, rowcount assumptions, and migration lock behavior.
- Verify real-MySQL integration coverage, xdist isolation, migration upgrade tests, and the compatibility gate for any Python version not covered by upstream `aiomysql` evidence.
