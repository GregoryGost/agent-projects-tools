# TypeScript testing rules

Apply this rule when `CODEX_PROJECT.md` declares TypeScript unit or integration testing active, or when the task directly changes tests for TypeScript code.

This rule is framework-neutral and test-runner-neutral. Framework-specific, DOM, component, E2E, and concrete runner workflows belong in separate overlays or in the target project's `CODEX_PROJECT.md`.

## Required skills

Use together with:

- `typescript-testing`;
- `typescript-core`.

## Source of truth

Before adding or changing tests:

1. Read `CODEX_PROJECT.md`.
2. Check the declared test runner, test commands, coverage policy, dependency policy, and test file patterns.
3. Inspect `package.json`, lockfile, test config files, `tsconfig*`, setup files, and existing tests.
4. Review the TypeScript core modeling decision: function/module vs class.
5. Use project-declared commands.
6. Do not add test dependencies or choose a new runner without user approval or dependency policy support.

## Testing boundaries

- Unit tests cover pure functions, modules, mappers, validation logic, class invariants, public methods, and isolated services.
- Integration tests cover interaction between multiple project modules, classes, services, adapters, and collaborators without requiring browser UI automation.
- Framework, DOM, component, E2E, and runner-specific workflows belong in stack-specific overlays.

## Class and object model testing

When `typescript-core` prefers a class, tests must respect that model instead of rewriting the design into loose functions for test convenience.

- Test class behavior through the public API.
- Test constructor validation and initial invariants when the constructor establishes valid object state.
- Test state transitions through public methods.
- Test lifecycle methods such as start/stop, open/close, connect/disconnect, or subscribe/unsubscribe when present.
- Test collaborator interaction through typed fakes, stubs, or mocks that implement the declared interface.
- Do not test private implementation details directly.
- Do not weaken visibility or export private helpers only to make tests easier.
- Prefer deterministic clocks, IDs, randomness, storage, network, and filesystem boundaries.

## Runner policy

- Use the test runner already declared by the project.
- Do not assume a runner from the language alone.
- Do not introduce runner-specific assertion APIs, mocking APIs, globals, setup files, snapshots, coverage providers, or mocking patterns unless they already exist or are explicitly approved.
- If the project has no declared TypeScript test runner, report it as a project testing gap and recommend adding a project-specific testing profile rather than hardcoding a runner in this baseline.

## Test design constraints

- Prefer behavior-focused assertions.
- Keep mocks local, typed, and explicit.
- Avoid snapshot-only tests.
- Use deterministic inputs and isolate time, randomness, network, and filesystem effects.
- Keep test helpers small and typed.
- Preserve project conventions for exceptions, result objects, nullable returns, and error objects.
