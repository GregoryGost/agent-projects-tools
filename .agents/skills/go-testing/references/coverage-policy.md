# Go statement-coverage policy and minimum threshold

## Project policy is selected once

When `go-testing` is integrated into a **new target Go project**, configure statement-coverage collection and a default minimum of **85%** in that project's `CODEX_PROJECT.md`. This default is a project-profile recommendation, **not** an unconditional rule that retroactively rewrites existing project settings or automatically authorizes test execution. A higher owner-selected threshold is valid. A lower threshold or disabled gate requires an explicit, documented owner-approved exception and rationale.

The project profile is the source of truth for:
- the intended production-package set, build tags, CGO/GOOS/GOARCH and unit/integration execution boundary;
- explicit exclusions (especially generated code or inaccessible platform branches), with owner-approved reasons;
- the full authorized test command, any `-coverpkg` instrumented package set, output path and retention;
- the exact numeric threshold, how it is evaluated and whether the same gate is used in local validation or CI;
- optional historical baseline/report artifacts, with compatible scope and build configuration.

Apply this profile on each relevant test/validation task **without redesigning its coverage policy**. If a requested task cannot safely execute that suite, report the blocker; do not silently switch to a smaller package list or relax the threshold.

## Coverage run and human-readable report

Replace placeholders with actual project-approved packages and output paths; these are **command templates**, not permission to run unbounded or production-connected integration tests.

```sh
go test -count=1 -coverprofile=<approved-coverage-profile> ./...
go tool cover -func=<approved-coverage-profile>
```

- `-coverprofile` enables coverage instrumentation and writes a statement-coverage profile. `-count=1` avoids reusing cached test results for the current measurement.
- `go test -coverprofile=...` counts covered **Go statements**, not branches, all possible inputs, functional correctness or performance.
- The final `total: (statements) XX.X%` from `go tool cover -func=...` is an **aggregate statement-weighted** number for the instrumented profile, not an arithmetic mean of per-package percentages.
- The `total` display may be rounded (often to one decimal), so **do not compare the rounded displayed percentage to an exact 85% gate** when results are near the boundary.
- A test failure makes the test validation **FAIL**, even if a partial profile exists. A stale/empty/invalid profile, zero instrumented statements or an unavailable gate produces **BLOCKED / NOT VERIFIED**, not a fabricated 100% or PASS.
- Use an approved artifact location outside the repository source tree when possible; create temporary directories and clean only artifacts owned by the current task, consistent with the target's authorization.

`go test ./...` is an example package scope, **not** an instruction to ignore explicit integration/build-tag packages. When cross-package tests need them instrumented, select `-coverpkg=<approved package patterns>` using actual Go version semantics. Preserve the project's declared package/exclusion policy; uncovered packages with code must not be silently omitted merely to raise the percentage. Platform-specific and integration-only code should be measured in the declared supported matrix or reported as excluded/unmeasured.

## Exact threshold calculation

For a normalized Go text coverage profile, each block record contains a `numStmt` (statements in the block) and an execution count, following the `mode:` header. Aggregate across **all selected instrumented blocks**:

```text
totalStatements   = sum(numStmt)
coveredStatements = sum(numStmt for blocks with executionCount > 0)
actualPercent     = 100 * coveredStatements / totalStatements
PASS when totalStatements > 0
     AND 100 * coveredStatements >= minimumPercent * totalStatements
```

For the 85% baseline this comparison is exact with integer arithmetic: `100 * coveredStatements >= 85 * totalStatements`. A project-specific checker should parse/validate Go's generated profile correctly (including aggregation rules) rather than scraping the rounded human-readable `total:` line. Verify that its parser and weighting agree with `go tool cover` on representative profiles. If the project lacks an approved automated checker, **report coverage percentage but explicitly mark the threshold as not automatically enforced**. Do not invent a passing CI gate.

**Boundary example:** 169 of 200 statements covered = 84.5%, below 85% (FAIL); 170 of 200 = 85% (PASS). Another case: 8496 of 10000 statements = 84.96%, which a one-decimal display may show as 85.0%; the exact gate must still FAIL.

## Scope and evidence safeguards

- For code without tests, Go may include instrumented packages with 0% coverage; their statements count toward the declared scope. Packages with no executable statements do **not** give a meaningful 100% coverage target. Explicitly list missing/instrumented packages and uncovered paths when helpful.
- Never delete test cases, exclude production files, narrow `-run` patterns, alter tags or use artificial no-op tests to meet a numeric goal. Functional and negative oracles still govern test quality.
- Compare historical coverage only when the package scope, Go toolchain, tags, build matrix and instrumentation policy are sufficiently comparable. A difference is diagnostic; any separate non-regression gate must be declared by the target project.
- `go tool cover -html=<profile>` is an optional **local** diagnostic view; generating a report file or launching a browser requires an approved environment and output policy. No automatic PR comments or external coverage-service uploads.
- A newly configured 85% goal does not prove existing target code already reaches it. Report the measured shortfall and seek authorized test improvements; do not silently rewrite tests or lower the project target.

## Report contract

On an authorized enabled run, report the actual command, Go/toolchain version, package scope, test status, profile location, exact or appropriately qualified aggregate statement coverage, threshold and verdict, any excluded/unmeasured packages, and whether an **automated** threshold gate actually ran. Include a comparable previous baseline when verified, otherwise state that baseline was unavailable.

Use separate statuses for:
- **PASS** — all declared tests passed, complete valid profile, exact percentage at/above the configured threshold and the required declared checker was actually executed.
- **FAIL** — tests failed or an executed valid check proves the percentage below threshold.
- **NOT VERIFIED / BLOCKED** — tests/checks could not run, profile is stale/invalid, required packages were not exercised, or threshold enforcement was not executed; include the actual available percentage without claiming a passing gate.

The Go standard tools expose coverage results but do **not** automatically enforce a configurable 85% threshold or install a repository CI pipeline. Enforcement belongs to the target project's explicitly selected script, build command or CI policy. Coverage is supporting evidence, not a guarantee of behavior.

## Official sources

- Coverage by `go test` and `go tool cover`: https://go.dev/blog/cover
- Coverage build/integration and package instrumentation: https://go.dev/doc/build-cover
- Go cover tool and coverage file format: https://pkg.go.dev/cmd/cover
- Test flags and package selection: https://pkg.go.dev/cmd/go#hdr-Test_packages
