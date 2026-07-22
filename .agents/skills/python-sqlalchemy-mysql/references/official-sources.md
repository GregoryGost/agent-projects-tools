# SQLAlchemy MySQL Official Sources

Use these primary sources when implementing or reviewing SQLAlchemy 2.x with MySQL through `aiomysql`.

Source review date: 2026-07-22.

## Source Precedence

1. The exact MySQL server major/minor manual declared by the project.
2. The installed SQLAlchemy release documentation and changelog.
3. The installed `aiomysql` release metadata, changelog, and upstream CI evidence.
4. The project manifest, lockfile, runtime diagnostics, deployment configuration, and integration tests.

Do not use MySQL 8.4 behavior to claim compatibility with another server version without checking that version's manual. Do not use shared SQLAlchemy MySQL/MariaDB documentation to erase server-family differences.

## SQLAlchemy

- MySQL and MariaDB dialect, supported DBAPIs, `mysql+aiomysql`, server-family detection, isolation, charset, rowcount behavior, MySQL data types, and MySQL-specific DML:
  - <https://docs.sqlalchemy.org/en/20/dialects/mysql.html>
- SQLAlchemy asyncio, `AsyncEngine`, `AsyncSession`, concurrent-task safety, implicit IO prevention, and async result streaming:
  - <https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html>
- Connection pooling, `AsyncAdaptedQueuePool`, reset-on-return, disconnect handling, `pool_pre_ping`, `pool_recycle`, and multiprocessing boundaries:
  - <https://docs.sqlalchemy.org/en/20/core/pooling.html>
- Engine and URL configuration, `URL.create()`, password hiding, logging, and `hide_parameters`:
  - <https://docs.sqlalchemy.org/en/20/core/engines.html>
- Connections, execution options, isolation, server-side cursor behavior, and transaction lifecycle:
  - <https://docs.sqlalchemy.org/en/20/core/connections.html>
- SQLAlchemy 2.0 changelog for version-specific fixes and dialect changes:
  - <https://docs.sqlalchemy.org/en/20/changelog/>

## aiomysql

- Official repository:
  - <https://github.com/aio-libs/aiomysql>
- Official documentation:
  - <https://aiomysql.readthedocs.io/>
- Package metadata, Python requirement, classifiers, PyMySQL dependency, and legacy `sa` optional dependency:
  - <https://github.com/aio-libs/aiomysql/blob/main/pyproject.toml>
- Upstream CI matrix for Python and MySQL/MariaDB runtime evidence:
  - <https://github.com/aio-libs/aiomysql/blob/main/.github/workflows/ci-cd.yml>
- Upstream changelog:
  - <https://github.com/aio-libs/aiomysql/blob/main/CHANGES.txt>

At the review date, `aiomysql` package metadata declared Python `>=3.9`, classifiers through Python 3.13, and upstream CI covered Python 3.9 through 3.13. Therefore Python 3.14 projects require project-level compatibility tests rather than an unsupported statement that upstream has already verified that runtime.

The `aiomysql` `sa` optional dependency remains tied to SQLAlchemy versions below 1.4. For SQLAlchemy 2.x, use `aiomysql` only through SQLAlchemy's `mysql+aiomysql` asyncio dialect unless a separately approved legacy component explicitly requires another path.

## MySQL 8.4 Transaction And Locking Sources

- InnoDB transaction model:
  - <https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-model.html>
- Transaction isolation levels:
  - <https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html>
- Consistent nonlocking reads:
  - <https://dev.mysql.com/doc/refman/8.4/en/innodb-consistent-read.html>
- Locking reads, `FOR SHARE`, `FOR UPDATE`, `NOWAIT`, and `SKIP LOCKED`:
  - <https://dev.mysql.com/doc/refman/8.4/en/innodb-locking-reads.html>
- InnoDB locking model, record locks, gap locks, and next-key locks:
  - <https://dev.mysql.com/doc/refman/8.4/en/innodb-locking.html>
- Deadlocks in InnoDB:
  - <https://dev.mysql.com/doc/refman/8.4/en/innodb-deadlocks.html>
- Deadlock minimization and transaction retry guidance:
  - <https://dev.mysql.com/doc/refman/8.4/en/innodb-deadlocks-handling.html>
- InnoDB error handling and transaction rollback behavior:
  - <https://dev.mysql.com/doc/refman/8.4/en/innodb-error-handling.html>
- InnoDB system variables, including row-lock wait timeout and rollback-on-timeout behavior:
  - <https://dev.mysql.com/doc/refman/8.4/en/innodb-parameters.html>
- User-level locking functions such as `GET_LOCK()` and `RELEASE_LOCK()`:
  - <https://dev.mysql.com/doc/refman/8.4/en/locking-functions.html>

## MySQL 8.4 DML And Query Sources

- `INSERT`, including `IGNORE` behavior:
  - <https://dev.mysql.com/doc/refman/8.4/en/insert.html>
- `INSERT ... ON DUPLICATE KEY UPDATE`:
  - <https://dev.mysql.com/doc/refman/8.4/en/insert-on-duplicate.html>
- `REPLACE` semantics:
  - <https://dev.mysql.com/doc/refman/8.4/en/replace.html>
- `UPDATE` behavior:
  - <https://dev.mysql.com/doc/refman/8.4/en/update.html>
- How MySQL uses indexes and leftmost prefixes:
  - <https://dev.mysql.com/doc/refman/8.4/en/mysql-indexes.html>
- `EXPLAIN` output and plan inspection:
  - <https://dev.mysql.com/doc/refman/8.4/en/explain-output.html>

## MySQL 8.4 Schema, Types, Charset, And SQL Mode

- InnoDB storage engine:
  - <https://dev.mysql.com/doc/refman/8.4/en/innodb-storage-engine.html>
- Character sets and collations:
  - <https://dev.mysql.com/doc/refman/8.4/en/charset.html>
- `utf8mb4` character set:
  - <https://dev.mysql.com/doc/refman/8.4/en/charset-unicode-utf8mb4.html>
- Connection character set and collation:
  - <https://dev.mysql.com/doc/refman/8.4/en/charset-connection.html>
- SQL modes and strict mode behavior:
  - <https://dev.mysql.com/doc/refman/8.4/en/sql-mode.html>
- Numeric types and exact-value `DECIMAL`:
  - <https://dev.mysql.com/doc/refman/8.4/en/numeric-types.html>
- Date and time types:
  - <https://dev.mysql.com/doc/refman/8.4/en/date-and-time-types.html>
- JSON type:
  - <https://dev.mysql.com/doc/refman/8.4/en/json.html>
- `CREATE INDEX`, unique indexes, nullable values, and functional indexes:
  - <https://dev.mysql.com/doc/refman/8.4/en/create-index.html>
- Identifier case sensitivity and `lower_case_table_names`:
  - <https://dev.mysql.com/doc/refman/8.4/en/identifier-case-sensitivity.html>

## MySQL 8.4 DDL And Metadata Locks

- Statements that cause implicit commit:
  - <https://dev.mysql.com/doc/refman/8.4/en/implicit-commit.html>
- Atomic DDL boundaries:
  - <https://dev.mysql.com/doc/refman/8.4/en/atomic-ddl.html>
- Online DDL operations and exact algorithm/lock behavior:
  - <https://dev.mysql.com/doc/refman/8.4/en/innodb-online-ddl-operations.html>
- Metadata locking:
  - <https://dev.mysql.com/doc/refman/8.4/en/metadata-locking.html>
- Server system variables, including `lock_wait_timeout`, `wait_timeout`, SQL mode, charset, collation, and timezone variables:
  - <https://dev.mysql.com/doc/refman/8.4/en/server-system-variables.html>

## Review Rules For Sources

- Prefer a versioned MySQL manual path matching the project's server version.
- Check SQLAlchemy release notes when behavior depends on a recent dialect fix.
- Check `aiomysql` metadata and CI rather than inferring runtime support from `Requires-Python` alone.
- Verify runtime server family through `@@version` and `@@version_comment`; a successful connection does not prove that the server is MySQL rather than MariaDB.
- Verify behavior with integration tests whenever documentation permits several modes or the result depends on SQL mode, collation, isolation, schema, or deployment topology.
