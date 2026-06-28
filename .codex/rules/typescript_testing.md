# TypeScript testing rules

Apply this rule when `CODEX_PROJECT.md` declares TypeScript unit or integration testing active, or when the task directly changes tests for TypeScript code.

This rule is framework-neutral. Framework-specific testing belongs in overlay rules.

## Required skills

Use together with:

- `typescript-testing`;
- `typescript-core`.

## Source of truth

Before adding or changing tests:

1. Read `CODEX_PROJECT.md`.
2. Check test runner, test commands, coverage policy, dependency policy, and test file patterns.
3. Inspect `package.json`, lockfile, test config files, `tsconfig*`, setup files, and existing tests.
4. Review the TypeScript core modeling decision: function/module vs class.
5. Use project-declared commands.
6. Do not add test dependencies without user approval or dependency policy support.

## Testing boundaries

- Unit tests cover pure functions, modules, mappers, validation logic, class invariants, public methods, and isolated services.
- Integration tests cover interaction between multiple project modules, classes, services, adapters, and collaborators without requiring browser UI automation.
- Framework, DOM, component, and E2E tests belong in stack-specific overlays.

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

## Expected tooling

For TypeScript projects, common test runners include:

- `vitest` for Vite-compatible or modern TypeScript workflows;
- `jest` only when the project already uses it or explicitly declares it.

Coverage is optional and must be declared by the project profile.

## Test design constraints

- Prefer behavior-focused assertions.
- Keep mocks local, typed, and explicit.
- Avoid snapshot-only tests.
- Use deterministic inputs and isolate time, randomness, network, and filesystem effects.
- Keep test helpers small and typed.
- Preserve project conventions for exceptions, result objects, nullable returns, and error objects.
