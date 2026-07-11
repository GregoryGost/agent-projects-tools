---
name: vitest-vue-testing
description: "Use for Vue 3 unit and component integration tests with Vitest: composables, components, DOM test environments, coverage, and test review."
---

# Vitest Vue Testing

Use this skill for Vue 3 frontend projects by default. Do not treat unit and component testing as optional for `vue3-typescript-vite` unless `CODEX_PROJECT.md` explicitly documents another testing stack or an approved no-tests policy.

Apply `.codex/rules/vitest_vue_testing.md`, `typescript-core`, and `vue-expert` together with this skill.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm Vue frontend is active and identify test commands, test environment, coverage policy, and dependency policy.
3. Inspect `package.json`, lockfile, `vitest.config.*`, `vite.config.*`, `tsconfig*`, setup files, and existing test patterns.
4. If no unit/component test runner is configured, report this as a Vue project quality gap and recommend the baseline dependencies and commands.
5. Classify the requested test as unit, component integration, or E2E/UI validation.
6. Select the smallest test type that gives confidence for the behavior.
7. Add or update tests using existing project conventions.
8. Run or report the project-declared test command.

## Vue Component Integration

- Prefer testing public behavior: rendered output, props, slots, events, and user-visible interaction.
- For new or substantially changed user-facing components, add or update a spec file unless the project explicitly opts out.
- Avoid snapshot-only tests.
- Use targeted mocks when the dependency behavior is not under test.
- Keep async behavior explicit with `await`, `nextTick`, `flushPromises`, or project-approved helpers.

## Review Checklist

- [ ] Vue frontend profile was checked.
- [ ] Unit/component test tooling exists, or the missing baseline was reported as a quality gap.
- [ ] Test type matches the behavior scope.
- [ ] Dependencies are present or explicitly recommended without unauthorized changes.
- [ ] Tests assert behavior rather than implementation details.
- [ ] Project-declared test command was run or reported as unavailable.