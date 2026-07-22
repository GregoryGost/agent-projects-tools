# SQLAlchemy MySQL Patterns And Review

Load this file when implementing or reviewing SQLAlchemy 2.x with MySQL through `aiomysql`: engines, pools, repositories, transactions, locking, retries, MySQL-specific DML, migrations, or integration tests.

This file contains concrete negative and positive examples plus the final review checklist. Backend-neutral rules remain in `../SKILL.md` and `python-sqlalchemy-core`.

## 1. Engine And Pool

### Direct `aiomysql` Pool Beside SQLAlchemy

Bad:

```python
import aiomysql
from sqlalchemy.ext.asyncio import create_async_engine

sqlalchemy_engine = create_async_engine(settings.db_url)
aiomysql_pool = await aiomysql.create_pool(
    host=settings.mysql_host,
    user=settings.mysql_user,
    password=settings.mysql_password,
)
```

Two unrelated pools now own connections, limits, health checks, shutdown, and transaction behavior.

Good:

```python
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

engine = create_async_engine(
    settings.db_url,
    pool_pre_ping=True,
    pool_size=settings.mysql_pool_size,
    max_overflow=settings.mysql_max_overflow,
    pool_timeout=settings.mysql_pool_checkout_timeout_seconds,
    pool_recycle=settings.mysql_pool_recycle_seconds,
)

session_factory = async_sessionmaker(
    engine,
    expire_on_commit=False,
)
```

Use `aiomysql` through the SQLAlchemy `mysql+aiomysql` dialect. Create a direct driver pool only for a separately approved component that does not use the SQLAlchemy engine.

### Legacy `aiomysql.sa`

Bad:

```python
from aiomysql.sa import create_engine

engine = await create_engine(...)
```

Good:

```python
from sqlalchemy.ext.asyncio import create_async_engine

engine = create_async_engine(
    "mysql+aiomysql://user:password@mysql/app?charset=utf8mb4"
)
```

`aiomysql.sa` is not the SQLAlchemy 2.x asyncio dialect.

### Explicit Default Pool Class

Bad:

```python
from sqlalchemy.pool import AsyncAdaptedQueuePool

engine = create_async_engine(
    settings.db_url,
    poolclass=AsyncAdaptedQueuePool,
)
```

This adds a backend-specific implementation detail without changing the normal behavior of `create_async_engine()`.

Good:

```python
engine = create_async_engine(
    settings.db_url,
    pool_size=settings.mysql_pool_size,
    max_overflow=settings.mysql_max_overflow,
)
```

Override the pool class only when the project has a documented lifecycle or topology reason and tests the result.

### URL Concatenation

Bad:

```python
url = (
    f"mysql+aiomysql://{settings.mysql_user}:"
    f"{settings.mysql_password}@{settings.mysql_host}:"
    f"{settings.mysql_port}/{settings.mysql_database}"
)
```

Reserved characters in credentials can produce an invalid or misparsed URL.

Good:

```python
from sqlalchemy import URL

url = URL.create(
    drivername="mysql+aiomysql",
    username=settings.mysql_user,
    password=settings.mysql_password,
    host=settings.mysql_host,
    port=settings.mysql_port,
    database=settings.mysql_database,
    query={"charset": "utf8mb4"},
)
```

For logs:

```python
logger.info(
    "Initialize MySQL engine url=%s",
    url.render_as_string(hide_password=True),
)
```

### Engine Created Before Worker Fork

Bad:

```python
engine = create_async_engine(settings.db_url)
start_worker_processes()
```

A live pool must not be inherited across processes.

Good:

```python
async def create_worker_resources() -> DatabaseResources:
    engine = create_async_engine(settings.db_url)
    return DatabaseResources(
        engine=engine,
        session_factory=async_sessionmaker(
            engine,
            expire_on_commit=False,
        ),
    )
```

Create and dispose engine resources independently in every worker process.

### Pool Size Calculated For One Process Only

Bad:

```text
pool_size = 20
max_overflow = 20
workers = 4
replicas = 3
```

Potential upper bound:

```text
(20 + 20) * 4 * 3 = 480 connections
```

Good:

```text
connection upper bound =
(pool_size + max_overflow)
* worker processes
* replicas
* equivalent engines
```

Reserve capacity for migrations, administration, monitoring, and other applications.

### One Timeout Setting For Unrelated Operations

Bad:

```python
engine = create_async_engine(
    settings.db_url,
    pool_timeout=settings.mysql_timeout,
    connect_args={"connect_timeout": settings.mysql_timeout},
)
```

Good:

```python
engine = create_async_engine(
    settings.db_url,
    pool_timeout=settings.mysql_pool_checkout_timeout_seconds,
    connect_args={
        "connect_timeout": settings.mysql_connect_timeout_seconds,
    },
)
```

Keep separate settings for:

- pool checkout timeout;
- TCP/connect timeout;
- row-lock wait timeout;
- metadata-lock timeout;
- application statement/deadline timeout.

### `pre_ping` Treated As Transaction Recovery

Bad:

```python
engine = create_async_engine(
    settings.db_url,
    pool_pre_ping=True,
)

# Assumption: every disconnect is now recovered transparently.
```

Good contract:

```text
stale pooled connection before transaction
-> pre_ping or recycle may replace it

disconnect during transaction
-> current unit of work fails
-> retry the complete unit of work only when replay-safe
```

## 2. AsyncSession And Result Handling

### Shared `AsyncSession` In Concurrent Tasks

Bad:

```python
async with session_factory() as session:
    users, orders = await asyncio.gather(
        user_repository.list_users(session),
        order_repository.list_orders(session),
    )
```

Good:

```python
async def load_users() -> list[UserRead]:
    async with session_factory() as session:
        return await user_repository.list_users(session)


async def load_orders() -> list[OrderRead]:
    async with session_factory() as session:
        return await order_repository.list_orders(session)


users, orders = await asyncio.gather(
    load_users(),
    load_orders(),
)
```

One concurrent task owns one session and transaction state.

### Hidden Lazy Load After Session Closure

Bad:

```python
async with session_factory() as session:
    user = await session.get(UserDbo, user_id)

return UserRead(
    id=user.id,
    roles=[role.name for role in user.roles],
)
```

Good:

```python
stmt = (
    select(UserDbo)
    .options(selectinload(UserDbo.roles))
    .where(UserDbo.id == user_id)
)

async with session_factory() as session:
    result = await session.execute(stmt)
    user = result.scalar_one()
    return map_user_read(user)
```

### Infrastructure Failure Returned As Not Found

Bad:

```python
async def get_user(user_id: int) -> UserRead | None:
    try:
        async with session_factory() as session:
            return await repository.get_user(session, user_id)
    except Exception:
        logger.exception("MySQL read failed")
        return None
```

`None` now means both a valid not-found result and an unavailable database.

Good:

```python
async def get_user(user_id: int) -> UserRead | None:
    async with session_factory() as session:
        return await repository.get_user(session, user_id)
```

The repository translates expected persistence failures. Unknown infrastructure failures propagate to the unit-of-work or application boundary and are reported as failures, not absence.

### Unbounded Materialization

Bad:

```python
result = await session.execute(select(AuditLogDbo))
rows = result.scalars().all()
```

Good for an ordinary API list:

```python
stmt = (
    select(AuditLogDbo)
    .where(AuditLogDbo.id > after_id)
    .order_by(AuditLogDbo.id)
    .limit(page_size)
)
result = await session.execute(stmt)
rows = result.scalars().all()
```

Good for an approved large export:

```python
stmt = (
    select(AuditLogDbo)
    .order_by(AuditLogDbo.id)
    .execution_options(yield_per=500)
)

result = await session.stream(stmt)
try:
    async for row in result.scalars():
        await write_export_row(row)
finally:
    await result.close()
```

Streaming keeps a connection and cursor occupied. Do not enable it by default or call `.all()` afterward.

## 3. Transactions And Locking

### Read-Modify-Write Race

Bad:

```python
result = await session.execute(
    select(AccountDbo.balance).where(AccountDbo.id == account_id)
)
balance = result.scalar_one()

if balance < amount:
    raise InsufficientFundsError

await session.execute(
    update(AccountDbo)
    .where(AccountDbo.id == account_id)
    .values(balance=balance - amount)
)
```

Good atomic DML:

```python
result = await session.execute(
    update(AccountDbo)
    .where(
        AccountDbo.id == account_id,
        AccountDbo.balance >= amount,
    )
    .values(balance=AccountDbo.balance - amount)
)

if result.rowcount != 1:
    raise InsufficientFundsError
```

Use `FOR UPDATE` instead when the operation requires a protected read across several values or rows.

### Locking Rows In Input Order

Bad:

```python
for account_id in command.account_ids:
    await repository.lock_account(session, account_id)
```

Good:

```python
for account_id in sorted(set(command.account_ids)):
    await repository.lock_account(session, account_id)
```

Use a consistent table order as well, for example `users -> accounts -> ledger_entries`.

### Unindexed Locking Read

Bad:

```python
stmt = (
    select(JobDbo)
    .where(JobDbo.status == JobStatus.PENDING)
    .with_for_update()
)
```

Good:

```python
stmt = (
    select(JobDbo)
    .where(
        JobDbo.queue_name == queue_name,
        JobDbo.status == JobStatus.PENDING,
    )
    .order_by(JobDbo.id)
    .limit(batch_size)
    .with_for_update(skip_locked=True)
)
```

Required supporting index for this access path:

```text
(queue_name, status, id)
```

Validate the real plan with `EXPLAIN`; do not infer index use from model declarations alone.

### `SKIP LOCKED` In A User-Facing List

Bad:

```python
stmt = (
    select(OrderDbo)
    .where(OrderDbo.status == OrderStatus.PENDING)
    .with_for_update(skip_locked=True)
)
```

This can silently omit locked orders.

Good queue-like use:

```python
stmt = (
    select(OutboxEventDbo)
    .where(OutboxEventDbo.processed_at.is_(None))
    .order_by(OutboxEventDbo.id)
    .limit(batch_size)
    .with_for_update(skip_locked=True)
)
```

The method contract describes a claimable work batch, not a complete consistent list.

### External Side Effect Inside A Retried Transaction

Bad:

```python
async with session.begin():
    await repository.reserve_balance(session, command)
    await nats_client.publish(command.event)
```

The event may be published even if the transaction later rolls back, and a retry may publish it again.

Good transactional outbox:

```python
async with session.begin():
    await repository.reserve_balance(session, command)
    await outbox_repository.add_event(session, command.event)

await outbox_dispatcher.notify()
```

The database mutation and outbox record commit together. Delivery is handled after commit with idempotency appropriate to the project.

## 4. Deadlocks And Retry

### Retrying Only The Failed Statement

Bad:

```python
async with session.begin():
    try:
        await repository.transfer(session, command)
    except OperationalError:
        await repository.transfer(session, command)
```

Good unit-of-work retry:

```python
async def run_transfer(command: TransferCommand) -> None:
    for attempt in range(settings.mysql_transaction_retry_attempts):
        try:
            async with session_factory() as session:
                async with session.begin():
                    await repository.transfer(session, command)
            return
        except RetryableTransactionError:
            if attempt + 1 >= settings.mysql_transaction_retry_attempts:
                raise
            await retry_backoff(attempt)
```

Requirements:

- the persistence boundary classifies known retryable MySQL failures;
- every attempt creates a fresh session and transaction;
- the whole unit of work is repeated;
- attempts are bounded;
- the operation is replay-safe or idempotency-protected;
- post-commit side effects are outside the retry loop's transaction.

### Raw Numeric Error Handling In A Service

Bad:

```python
try:
    await repository.update_user(command)
except OperationalError as exc:
    if exc.args[0] in {1205, 1213}:
        ...
```

Good persistence translation:

```python
try:
    await session.flush()
except DBAPIError as exc:
    raise translate_mysql_persistence_error(exc) from exc
```

The service handles `RetryableTransactionError`, `ConflictError`, or another stable application error without importing SQLAlchemy or `aiomysql` exceptions.

### Unlimited Retry

Bad:

```python
while True:
    try:
        await run_unit_of_work()
        return
    except RetryableTransactionError:
        continue
```

Good:

```python
for attempt in range(max_attempts):
    try:
        await run_unit_of_work()
        return
    except RetryableTransactionError:
        if attempt + 1 >= max_attempts:
            raise
        await bounded_backoff_with_jitter(attempt)
```

## 5. MySQL DML Semantics

### `INSERT IGNORE` Hides Data Problems

Bad:

```python
await session.execute(
    text(
        """
        INSERT IGNORE INTO users (id, email, quota)
        VALUES (:id, :email, :quota)
        """
    ),
    payload,
)
```

Good:

```python
user = UserDbo(**payload)
session.add(user)

try:
    await session.flush()
except IntegrityError as exc:
    raise UserAlreadyExistsError from exc
```

If ignoring one expected duplicate is intentional, make it explicit in the repository method name and verify the exact result and constraint behavior in a real MySQL test.

### `REPLACE` Used As Upsert

Bad:

```sql
REPLACE INTO users (id, email, created_at)
VALUES (:id, :email, :created_at)
```

Good:

```python
from sqlalchemy.dialects.mysql import insert as mysql_insert

stmt = mysql_insert(UserDbo).values(**payload)
stmt = stmt.on_duplicate_key_update(
    email=stmt.inserted.email,
    updated_at=func.current_timestamp(),
)
await session.execute(stmt)
```

`REPLACE` has delete/insert semantics and is not an ordinary update.

### Upsert With Ambiguous Identity

Bad:

```python
stmt = mysql_insert(UserDbo).values(
    id=user_id,
    email=email,
    external_id=external_id,
).on_duplicate_key_update(
    email=email,
    external_id=external_id,
)
```

The table has separate unique constraints on `email` and `external_id`, but the operation does not define which conflict identifies the same entity.

Good:

```python
stmt = mysql_insert(ExternalAccountDbo).values(
    provider=provider,
    external_id=external_id,
    payload=payload,
)
stmt = stmt.on_duplicate_key_update(
    payload=stmt.inserted.payload,
    updated_at=func.current_timestamp(),
)
```

Use one canonical identity contract. Translate other uniqueness violations as conflicts instead of silently updating an unintended row.

### Python `onupdate` Assumed During Upsert

Bad:

```python
updated_at = mapped_column(
    DateTime,
    onupdate=func.current_timestamp(),
)

stmt = mysql_insert(EntityDbo).values(**payload)
stmt = stmt.on_duplicate_key_update(value=stmt.inserted.value)
```

Good:

```python
stmt = mysql_insert(EntityDbo).values(**payload)
stmt = stmt.on_duplicate_key_update(
    value=stmt.inserted.value,
    updated_at=func.current_timestamp(),
)
```

`ON DUPLICATE KEY UPDATE` does not automatically apply Python-side `Column.onupdate` values.

### Undefined `rowcount` Contract

Bad:

```python
result = await session.execute(stmt)
if result.rowcount == 0:
    raise EntityNotFoundError
```

Good optimistic concurrency contract:

```python
result = await session.execute(
    update(UserDbo)
    .where(
        UserDbo.id == user_id,
        UserDbo.version == expected_version,
    )
    .values(
        display_name=display_name,
        version=UserDbo.version + 1,
    )
)

if result.rowcount != 1:
    raise ConcurrentModificationError
```

Document whether the operation relies on matched-row or changed-row semantics and test it on the active dialect.

## 6. Connection-Local State

### Session Variables Left On A Pooled Connection

Bad:

```python
await session.execute(text("SET SESSION time_zone = '+03:00'"))
await session.execute(text("SET SESSION foreign_key_checks = 0"))
```

A physical connection can return to the pool with connection-local state still changed.

Good:

- configure permanent connection invariants centrally when a connection is created;
- set temporary state only through an explicit helper that restores it in `finally`;
- never disable foreign-key checks in normal runtime code;
- avoid temporary tables and other connection-owned resources on ordinary pooled connections unless cleanup is guaranteed.

### `GET_LOCK()` Assumed To Follow Transaction Lifetime

Bad:

```python
await session.execute(
    text("SELECT GET_LOCK(:name, :timeout)"),
    {"name": lock_name, "timeout": 10},
)
await session.commit()
```

`COMMIT` does not release a MySQL user-level lock.

Good:

```python
try:
    acquired = await lock_repository.acquire_named_lock(
        session,
        lock_name,
        timeout_seconds,
    )
    if not acquired:
        raise LockNotAcquiredError

    await perform_operation(session)
finally:
    await lock_repository.release_named_lock(session, lock_name)
```

Prefer InnoDB row locks for normal transactional coordination. Use named locks only with explicit connection ownership and release semantics.

## 7. Schema, Charset, Collation, And Types

### Connection Encoding Left To Defaults

Bad:

```text
mysql+aiomysql://user:password@mysql/app
```

Good:

```text
mysql+aiomysql://user:password@mysql/app?charset=utf8mb4
```

Also declare schema/table/column collation policy where equality and uniqueness matter.

### Collation Ignored For Identity

Bad:

```python
email = mapped_column(String(320), unique=True)
```

The model assumes a case-sensitive or case-insensitive identity rule without checking the active collation.

Good:

- declare the intended identity normalization and comparison policy;
- select a compatible collation or store a normalized identity key;
- test case, accent, Unicode, and trailing-space behavior against the real server.

### Binary Floating Point For Money

Bad:

```python
amount = mapped_column(Float, nullable=False)
```

Good:

```python
amount = mapped_column(Numeric(18, 4), nullable=False)
```

Test exact decimal round trips and application serialization.

### Nullable Columns In A Unique Key

Bad assumption:

```sql
UNIQUE KEY uq_user_email_active (email, deleted_at)
```

The design assumes only one row with `deleted_at IS NULL`, but MySQL permits multiple `NULL` values in a unique index.

Good:

- use a separately designed normalized active key, generated expression, or active-identity table;
- version-gate generated/functional-index solutions;
- cover the invariant with an integration test.

### Mixed-Case Table Names

Bad:

```python
class UserTokenDbo(Base):
    __tablename__ = "UserTokens"
```

Good:

```python
class UserTokenDbo(Base):
    __tablename__ = "user_tokens"
```

Lowercase `snake_case` avoids unnecessary portability problems across MySQL hosts and filesystems.

### Startup Contract Checks Only Version

Bad:

```python
result = await session.execute(text("SELECT VERSION()"))
logger.info("MySQL version=%s", result.scalar_one())
```

Good diagnostic query:

```python
result = await session.execute(
    text(
        """
        SELECT
            @@version AS version,
            @@version_comment AS version_comment,
            @@sql_mode AS sql_mode,
            @@transaction_isolation AS transaction_isolation,
            @@character_set_connection AS character_set_connection,
            @@collation_connection AS collation_connection,
            @@time_zone AS time_zone
        """
    )
)
```

Compare the safe result with the declared project contract. Detect MariaDB instead of accepting it as MySQL.

## 8. Migrations And Metadata Locks

### DDL Treated As Rollback-Able Application Work

Bad:

```python
async with connection.begin():
    await connection.execute(
        text("ALTER TABLE users ADD COLUMN external_id VARCHAR(64)")
    )
    raise RuntimeError("rollback expected")
```

Good:

- treat MySQL DDL as capable of implicit commit;
- run it through the approved migration tool;
- separate DDL from data backfill;
- validate the resulting schema and application compatibility;
- design a forward recovery or compensating migration instead of promising ordinary transaction rollback.

### Unbounded Metadata-Lock Wait

Bad:

```python
await connection.execute(
    text("ALTER TABLE users ADD COLUMN external_id VARCHAR(64)")
)
```

Good:

```python
await connection.execute(
    text("SET SESSION lock_wait_timeout = :seconds"),
    {"seconds": migration_lock_timeout_seconds},
)
await connection.execute(
    text("ALTER TABLE users ADD COLUMN external_id VARCHAR(64)")
)
```

Also perform deployment preflight for long-running transactions and blocked metadata locks. Do not confuse `lock_wait_timeout` with `innodb_lock_wait_timeout`.

### Slow Processing Inside A Read Transaction

Bad:

```python
async with session_factory() as session:
    result = await session.execute(select(LargeTableDbo))
    await slow_processing(result.scalars())
```

Good:

```python
async with session_factory() as session:
    batch = await repository.load_batch(session, after_id, batch_size)

await slow_processing(batch)
```

Use bounded keyset batches and short transactions so schema migrations and purge history are not blocked by accidental long-lived units of work.

### Online DDL Claimed Without A Version Gate

Bad:

```sql
ALTER TABLE events ADD INDEX ix_events_created_at (created_at),
ALGORITHM=INSTANT;
```

Good:

- check the exact MySQL server version and operation support;
- specify `ALGORITHM` and `LOCK` only when verified;
- test production-like table size and concurrent load;
- fail deployment rather than silently falling back to a more blocking algorithm when the project policy requires online behavior.

## 9. Integration Tests

### SQLite Used For MySQL Repository Tests

Bad:

```python
@pytest.fixture
async def engine() -> AsyncIterator[AsyncEngine]:
    engine = create_async_engine("sqlite+aiosqlite:///:memory:")
    yield engine
    await engine.dispose()
```

Good:

- run a real MySQL service through Testcontainers, Docker Compose, or the project test environment;
- match the declared MySQL major/minor version;
- apply the same SQL mode, charset/collation, and isolation policy;
- run the same migrations as production;
- dispose the engine and remove isolated test data after the test boundary.

### Shared Database Across pytest-xdist Workers

Bad:

```text
all workers -> database app_test
```

Good:

```text
gw0 -> app_test_gw0
gw1 -> app_test_gw1
gw2 -> app_test_gw2
```

Alternatively use isolated schemas or containers when supported by the project. Include the test run identifier to avoid collisions between simultaneous CI jobs.

### Sleep-Based Deadlock Test

Bad:

```python
await asyncio.sleep(0.2)
```

Good test design:

```text
transaction A locks row 1
transaction B locks row 2
barrier releases both transactions
transaction A requests row 2
transaction B requests row 1
```

Assert that:

- one transaction receives a translated retryable error;
- the failed session is not reused;
- the complete unit of work is retried;
- retry attempts are bounded;
- the final invariant is correct;
- each post-commit side effect occurs once.

### Only Happy-Path Connection Test

Good disconnect matrix:

1. stale pooled connection before transaction: checkout replaces or invalidates it;
2. disconnect during transaction: the current unit of work fails;
3. replay-safe transaction: the complete unit of work may retry in a fresh session;
4. non-replay-safe transaction: failure propagates without automatic retry;
5. invalidated connections do not return as usable pool entries.

### Python Runtime Outside Upstream Evidence

When the active Python version is not present in current `aiomysql` classifiers or CI, add a compatibility job that verifies:

- package installation;
- async connection and authentication;
- parameterized execute;
- commit and rollback;
- pool checkout, timeout, recycle, and disposal;
- stale connection handling;
- representative JSON, binary, decimal, Unicode, and datetime round trips;
- repository and migration integration tests.

## 10. Review Checklist

### Activation And Dependencies

- [ ] `python-sqlalchemy-mysql` is activated by the project profile.
- [ ] Required skill `python-sqlalchemy-core` exists and is active.
- [ ] Active database is MySQL and active driver is `aiomysql`.
- [ ] Runtime server family is verified and is not silently MariaDB.
- [ ] Exact MySQL, SQLAlchemy, `aiomysql`, and Python version sources are declared.
- [ ] Python versions outside upstream `aiomysql` evidence have real compatibility coverage.

### Engine And Pool

- [ ] `mysql+aiomysql` is used through `create_async_engine()`.
- [ ] No parallel `aiomysql.create_pool()` or `aiomysql.sa` path splits connection ownership.
- [ ] Engine and session factory are created once per process lifecycle.
- [ ] Default async pool class is not restated without a documented reason.
- [ ] Engines and live connections are not shared across process boundaries.
- [ ] Pool budget accounts for workers, replicas, engines, migrations, and reserve.
- [ ] Pool checkout, connect, row-lock, metadata-lock, and statement timeouts are separate.
- [ ] `pool_pre_ping` and `pool_recycle` are used with an explicit disconnect policy.
- [ ] Disconnect during a transaction is not described as transparently recoverable.
- [ ] DSNs and passwords are sanitized in logs.

### Sessions And Transactions

- [ ] One `AsyncSession` is owned by one request, task, unit of work, or batch.
- [ ] One session is not shared through `asyncio.gather()` or concurrent tasks.
- [ ] Transactions are explicit and short.
- [ ] Repositories do not commit unexpectedly.
- [ ] Repository writes flush when constraints, defaults, ids, or error mapping require execution.
- [ ] Required relationships are eagerly loaded; hidden lazy IO does not cross session lifetime.
- [ ] HTTP, cache, NATS, filesystem, sleep, and slow computation are outside write transactions.
- [ ] Post-commit effects happen only after successful commit.
- [ ] Database failures are not converted to ordinary not-found results.

### InnoDB And Concurrency

- [ ] Transactional and foreign-key tables use InnoDB.
- [ ] Effective isolation level is declared and verified.
- [ ] Read-modify-write uses atomic DML, constraints, optimistic locking, or locking reads.
- [ ] Lock order is deterministic across rows and tables.
- [ ] Locking and write predicates have verified supporting indexes.
- [ ] `NOWAIT` and `SKIP LOCKED` match an explicit operation contract.
- [ ] `SKIP LOCKED` is limited to queue-like work.
- [ ] Named locks have explicit connection ownership and release.

### Retry And Errors

- [ ] Deadlock, row-lock timeout, metadata-lock timeout, disconnect, and pool timeout are distinct categories.
- [ ] Raw SQLAlchemy, DBAPI, `aiomysql`, and numeric MySQL codes do not escape persistence boundaries.
- [ ] Retry recreates session and transaction and repeats the complete unit of work.
- [ ] Retry applies only to replay-safe or idempotency-protected operations.
- [ ] Attempts and backoff are bounded.
- [ ] Unknown operational errors are not retried by default.
- [ ] Post-commit side effects are not repeated with transaction retries.

### DML And Schema

- [ ] User-controlled values use SQLAlchemy expressions or bound parameters.
- [ ] `INSERT IGNORE` is absent from correctness-critical operations.
- [ ] `REPLACE` is not used as a generic upsert.
- [ ] Every `ON DUPLICATE KEY UPDATE` path accounts for all primary and unique constraints.
- [ ] Upserts set required update timestamps/defaults explicitly.
- [ ] `rowcount` assumptions are documented and tested.
- [ ] Charset and collation policies match identity, sorting, and uniqueness requirements.
- [ ] Strict SQL mode assumptions are verified at runtime or deployment.
- [ ] Exact decimal values use `Numeric`/`DECIMAL`.
- [ ] Datetime and timezone policy is explicit.
- [ ] Nullable unique-key behavior is tested.
- [ ] Table, index, and constraint naming is portable or intentionally schema-bound.

### Migrations And Tests

- [ ] The declared migration tool and policy are followed.
- [ ] MySQL DDL implicit-commit behavior is accounted for.
- [ ] Schema changes and long backfills are separated.
- [ ] Metadata-lock wait is bounded and deployment preflight checks blockers.
- [ ] Version-specific online DDL claims are verified for the exact server.
- [ ] Fresh creation and upgrade from the previous schema state are tested.
- [ ] Repository integration tests run against real MySQL, not SQLite.
- [ ] Test MySQL version, SQL mode, charset/collation, and isolation match the profile.
- [ ] pytest-xdist workers and parallel CI runs use isolated databases or schemas.
- [ ] Deadlock and disconnect tests use deterministic coordination rather than arbitrary sleeps.
- [ ] Raw persistence exceptions do not escape public repository or unit-of-work APIs.
