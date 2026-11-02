---
name: go-core
description: "Use for Go language implementation, code review, package design, modules, interfaces, errors, context, concurrency, and toolchain compatibility."
---

# Go Core

Use for portable Go code. This skill owns Go language and standard-library practices only. HTTP framework, persistence and test-specific policies belong in separately active overlays.

## Coordination

Apply `.codex/rules/go_core.md` when that rule is independently active. Rule activation and required skill validation are controlled by the project profile and `material_dependencies.md`; this skill does not activate a rule by itself.

## Discovery and compatibility

- Read `CODEX_PROJECT.md`, module/workspace metadata, build constraints, platform and CI matrices, package APIs, neighboring tests and formatter/linter commands.
- Distinguish the `go` directive, optional `toolchain` directive, installed `go version`, and selected third-party module requirements. Confirm the effective feature boundary.
- Prefer the module's declared dependency versions and build tags to latest upstream examples. Never run `go get -u`, `go mod tidy` or install tools as an incidental read-only step.
- Work inside existing packages/layout. `cmd/`, `internal/` and `pkg/` are choices, not mandatory directory templates.

## Package and API design

- Prefer small focused packages and explicit constructors when dependencies need ownership or lifecycle.
- Use concrete types by default; define narrow consumer-owned interfaces for real substitution and test seams.
- Return zero values plus errors on failure where appropriate. Preserve exported compatibility unless change is authorized.
- Prefer type-safe explicit transformations; avoid `interface{}`/`any`, reflection and generics when they add no value.
- Be careful with nil interfaces, typed nil values, pointer/value semantics and shared slice/map backing arrays.
- Make JSON tags, time representations, optional/nullable values and external contracts intentional.
- Respect the project's API compatibility expectations before changing public identifiers or serialized fields.

## Errors and resource lifetime

- Use `fmt.Errorf("operation: %w", err)` for useful causal context; use `errors.Is` or `errors.As` for classification.
- Keep sentinel/typed errors stable at well-defined domain boundaries; convert database/transport errors there rather than leaking vendor types to consumers.
- Do not log and return the same error at every layer; log once at the boundary that has operational context.
- Close owned resources, check write/flush/close errors where correctness requires it, and preserve cleanup during partial initialization.
- Keep shutdown idempotent and bounded; do not close borrowed channels or resources.

## Context, concurrency, performance

- Accept `context.Context` as the first parameter when operations are cancelable; propagate it into network/database I/O.
- A canceled context is not a substitute for joining goroutines or draining owned work.
- Avoid unbounded goroutine fan-out, uncontrolled retries, leaked tickers, silent error channels and blocking operations inside critical sections.
- Use `sync.Mutex`, channels, `errgroup` or actor ownership according to project policy and the smallest correct concurrency model; `errgroup` is an external dependency and cannot be added without permission.
- Measure before optimizing; use benchmarks/profiles and realistic workload evidence rather than imagined bottlenecks.
- Handle map iteration nondeterminism and error-prone shared fixtures explicitly.

## Formatting and verification

- `gofmt` is the baseline formatter. Resolve extra formatter, linter and generated-code commands from project configuration.
- For code changes, run or report declared format checks, `go vet`, build and relevant tests; respect CGO, race-detector and cross-platform limitations.
- Do not invent commands or run migrations/infrastructure mutations as a consequence of language-level review.

## Optional coordination

- `go-testing` for independently activated test tasks.
- `go-huma-v2` for active Huma v2 APIs.
- `go-gorm` for active GORM persistence, plus `go-gorm-sqlite-goose` only for the declared SQLite + Goose stack.

Load `references/patterns-and-review.md` for implementation/review patterns and `references/official-sources.md` for language specifications and tool documentation.

