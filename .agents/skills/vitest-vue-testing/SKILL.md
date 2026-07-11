---
name: vitest-vue-testing
description: "Use for Vue 3 unit and component integration tests with Vitest: composables, components, DOM test environments, coverage, and test review."
---

# Vitest Vue Testing

Use this skill only when `CODEX_PROJECT.md` declares the `vitest-vue-testing` active stack profile, or when the task directly adds, changes, or reviews existing Vitest-based Vue unit or component tests.

Do not activate this skill solely because `vue3-typescript-vite` is active. Vue unit/component testing remains a separate opt-in testing profile.

Apply `.codex/rules/vitest_vue_testing.md`, `typescript-core`, and `vue3-typescript-vite-expert` together with this skill.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm that `vitest-vue-testing` is active or that existing Vitest-based Vue tests are directly in scope.
3. Identify test commands, test environment, coverage policy, and dependency policy.
4. Inspect `package.json`, lockfile, `vitest.config.*`, `vite.config.*`, `tsconfig*`, setup files, and existing test patterns.
5. If the profile is active but no unit/component test runner is configured, report the profile mismatch.
6. Do not treat missing Vitest tests as a project quality gap when the `vitest-vue-testing` profile is inactive.
7. Classify the requested test as unit, component integration, or E2E/UI validation.
8. Select the smallest test type that gives confidence for the behavior.
9. Add or update tests using existing project conventions.
10. Run or report the project-declared test command.

## Vue Component Integration

- Prefer testing public behavior: rendered output, props, slots, events, and user-visible interaction.
- For new or substantially changed user-facing components, add or update a spec file only when the `vitest-vue-testing` profile or existing project testing policy requires it.
- Avoid snapshot-only tests.
- Use targeted mocks when the dependency behavior is not under test.
- Keep async behavior explicit with `await`, `nextTick`, `flushPromises`, or project-approved helpers.

## Review Checklist

- [ ] `vitest-vue-testing` is active or existing Vitest-based Vue tests are directly in scope.
- [ ] Unit/component test tooling matches the declared profile.
- [ ] Test type matches the behavior scope.
- [ ] Dependencies are present or explicitly recommended without unauthorized changes.
- [ ] Tests assert behavior rather than implementation details.
- [ ] Project-declared test command was run or reported as unavailable.
