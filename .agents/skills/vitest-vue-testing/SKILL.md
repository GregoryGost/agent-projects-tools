---
name: vitest-vue-testing
description: "Use for Vue 3 unit and component integration tests with Vitest: composables, components, Pinia, Vue Router, DOM test environments, coverage, and test review."
---

# Vitest Vue Testing

Use this skill for Vue 3 frontend projects by default. Do not treat unit and component testing as optional for `vue-frontend` unless `CODEX_PROJECT.md` explicitly documents another testing stack or an approved no-tests policy.

Apply `.codex/rules/vitest_vue_testing.md`, `typescript-core`, and `vue-expert` together with this skill. Apply `pinia-expert` or `vue-router-expert` when the tested behavior touches stores or routes.

Load references when needed:

- `references/dependency-matrix.md` for test dependency groups.
- `references/review-checklist.md` for test review checks.
- `references/official-sources.md` for official documentation links.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm Vue frontend is active and identify test commands, test environment, coverage policy, and dependency policy.
3. Inspect `package.json`, lockfile, `vitest.config.*`, `vite.config.*`, `tsconfig*`, setup files, and existing test patterns.
4. If no unit/component test runner is configured, report this as a Vue project quality gap and recommend the baseline dependencies and commands.
5. Classify the requested test as unit, component integration, or E2E/UI validation.
6. Select the smallest test type that gives confidence for the behavior.
7. Add or update tests using existing project conventions.
8. Run or report the project-declared unit/component/integration test command.
9. If tests need new dependencies, recommend them explicitly and do not add them unless allowed by the project policy or user approval.

## Test Type Routing

- Use unit tests for pure functions, modules, small composables, store actions/getters, data mappers, and validation logic.
- Use component integration tests for mounted Vue components, props, slots, emitted events, child interaction, Pinia plugin behavior, and Vue Router behavior.
- Use Playwright UI validation for browser-level route checks, screenshots, accessibility snapshots, console/network summaries, and visual validation.
- Use full E2E tests only when a dedicated E2E profile exists.

## Vue Component Integration

- Prefer testing public behavior: rendered output, props, slots, events, and user-visible interaction.
- For new or substantially changed user-facing components, add or update a spec file unless the project explicitly opts out.
- Do not assert private component instance state unless the task explicitly requires white-box coverage.
- Avoid snapshot-only tests.
- Mount with the real plugin only when the plugin integration is part of the behavior under test.
- Use targeted mocks when the dependency behavior is not under test.
- Keep async behavior explicit with `await`, `nextTick`, `flushPromises`, or project-approved helpers.

## Pinia

- Use `setActivePinia(createPinia())` for isolated store unit tests.
- Use `createTestingPinia()` for component tests that need a testing store.
- Remember that `createTestingPinia()` stubs actions by default; set `stubActions: false` when the action implementation is part of the behavior under test.
- Include Pinia plugins in the testing Pinia setup when production store behavior depends on them.

## Vue Router

- Use mocked router/route for unit tests focused on component logic.
- Use a real router instance for integration tests that validate route rendering or navigation.
- Create a fresh router instance per test when using the real router.
- Await router readiness and pending navigation before assertions.

## Test Environment

- Use `node` for pure unit tests that do not need DOM APIs.
- Use `jsdom` or `happy-dom` for Vue component tests that need browser APIs.
- Do not assume a DOM environment without checking `vitest.config.*` or test file annotations.
- Keep setup files explicit and small.

## Review Checklist

- [ ] `CODEX_PROJECT.md` and Vue frontend profile were checked.
- [ ] Unit/component test tooling exists, or the missing baseline was reported as a quality gap.
- [ ] Test type matches the behavior scope.
- [ ] Dependencies are present or explicitly recommended without unauthorized changes.
- [ ] Tests assert behavior rather than implementation details.
- [ ] New or changed user-facing Vue components have a spec or a documented project-level exception.
- [ ] Pinia/router/plugin setup matches the intended integration boundary.
- [ ] Async behavior is awaited explicitly.
- [ ] Project-declared test command was run or reported as unavailable.
