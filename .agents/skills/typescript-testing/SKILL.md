---
name: typescript-testing
description: "Use for framework-neutral TypeScript unit and integration testing: functions, modules, classes, object model invariants, typed mocks, deterministic tests, coverage policy, and review."
---

# TypeScript Testing

Use this skill when TypeScript unit or integration testing is active, or when the task directly adds, changes, or reviews TypeScript tests.

Apply `.codex/rules/typescript_testing.md` and `typescript-core` together with this skill.

Load references when needed:

- `references/class-testing-patterns.md` for class/object model testing examples.
- `references/official-sources.md` for official testing and TypeScript references.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm test runner, commands, coverage policy, dependency policy, and test file patterns.
3. Inspect `package.json`, lockfile, test config, setup files, and existing tests.
4. Review the TypeScript core model used by the code under test: function/module or class/object.
5. Classify the requested test as unit or integration.
6. Add or update tests using existing project conventions.
7. Run or report the project-declared test command.

## Baseline

- Use unit tests for isolated TypeScript logic.
- Use integration tests for multiple modules or classes working together.
- Keep DOM, component, framework, and E2E tests in overlays.
- Prefer typed test helpers and explicit mocks.
- Preserve class-based design when TypeScript core selected a class for identity, state, invariants, lifecycle, collaborators, or polymorphism.

## Class Testing

- Test public behavior, not private implementation details.
- Test constructor invariants and invalid inputs when constructors validate state.
- Test state transitions through public methods.
- Test collaborator interaction with typed fakes, stubs, or mocks.
- Do not weaken visibility or export local implementation details only for tests.

## Review Checklist

- [ ] Project testing profile was checked.
- [ ] Test type matches the behavior scope.
- [ ] Function/module vs class/object model was preserved.
- [ ] Constructor invariants, state transitions, lifecycle, and collaborators are covered when classes are involved.
- [ ] Dependencies are present or recommended without unauthorized changes.
- [ ] Tests are deterministic.
- [ ] Project-declared test command was run or reported as unavailable.
