---
name: typescript-testing
description: "Use for framework-neutral TypeScript unit and integration testing: test runner routing, typed mocks, deterministic tests, coverage policy, and review."
---

# TypeScript Testing

Use this skill when TypeScript unit or integration testing is active, or when the task directly adds, changes, or reviews TypeScript tests.

Apply `.codex/rules/typescript_testing.md` and `typescript-core` together with this skill.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm test runner, commands, coverage policy, dependency policy, and test file patterns.
3. Inspect `package.json`, lockfile, test config, setup files, and existing tests.
4. Classify the requested test as unit or integration.
5. Add or update tests using existing project conventions.
6. Run or report the project-declared test command.

## Baseline

- Use unit tests for isolated TypeScript logic.
- Use integration tests for multiple modules working together.
- Keep DOM, component, framework, and E2E tests in overlays.
- Prefer typed test helpers and explicit mocks.

## Review Checklist

- [ ] Project testing profile was checked.
- [ ] Test type matches the behavior scope.
- [ ] Dependencies are present or recommended without unauthorized changes.
- [ ] Tests are deterministic.
- [ ] Project-declared test command was run or reported as unavailable.
