# Test boundary patterns and anti-patterns

## Table-driven unit tests

Prefer a table of named cases containing inputs, expected result, expected error and relevant side effects. Use `t.Run` and fail with the input and outcome. Do not assert only that a function returned no error when it has material outputs.

## HTTP API tests

Build the actual application router with disposable dependencies. Use `httptest.NewRecorder` for fast handler tests or `httptest.NewServer` when network behavior matters. Assert content type, status, response shape, documented errors and persisted state. Include invalid JSON, malformed params, missing auth and authorization where in scope.

## Database tests

Use file-backed `t.TempDir` SQLite to exercise PRAGMA settings, WAL, locking, multiple connections and Goose migrations. An in-memory database with multiple pooled connections can have different visibility and lifetime semantics. Seed only what's needed; assert schema and FK/integrity behavior through real SQL.

## Fuzz tests

Use `FuzzXxx` and `f.Add` seed inputs. Assert invariants or round-trip properties rather than crashes alone. Limit fuzz duration; review new corpus and fix root causes. Do not fuzz live external services or uncontrolled data sources.

## Concurrency

Avoid shared global mock handlers and process-wide environment variables in parallel tests. Synchronize controllable events rather than sleeping. For race findings, reproduce with instrumented tests and inspect the actual shared state.

## Checklist

- Correct test boundary and all material cases?
- Real application or DB under test rather than mocked implementation?
- Race/parallel execution safe?
- Temporary files and servers cleaned?
- Coverage and generated artifacts in declared output location?
- Failures report meaningful evidence?

