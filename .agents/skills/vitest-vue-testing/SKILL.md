---
name: vitest-vue-testing
description: "Use for Vue 3 unit and component integration tests with Vitest: composables, components, Pinia, Vue Router, DOM test environments, coverage, and test review."
---

# Vitest Vue Testing

Use this skill when `CODEX_PROJECT.md` declares Vue unit/component testing as active or when the task directly adds, changes, or reviews Vue unit, component, or integration tests.

Apply `.codex/rules/vitest_vue_testing.md`, `typescript-core`, and `vue-expert` together with this skill. Apply `pinia-expert` or `vue-router-expert` only when the tested behavior touches stores or routes.

Load references when needed:

- `references/dependency-matrix.md` for test dependency groups.
- `references/review-checklist.md` for test review checks.
- `references/official-sources.md` for official documentation links.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm the active frontend testing profile, test commands, test environment, coverage policy, and dependency policy.
3. Inspect `package.json`, lockfile, `vitest.config.*`, `vite.config.*`, `tsconfig*`, setup files, and existing test patterns.
4. Classify the requested test as unit, component integration, or E2E/UI validation.
5. Select the smallest test type that gives confidence for the behavior.
6. Add or update tests using existing project conventions.
7. Run or report the project-declared unit/component/integration test command.
8. If tests need new dependencies, recommend them explicitly and do not add them unless allowed by the project policy or user approval.

## Test Type Routing

- Use unit tests for pure functions, modules, small composables, store actions/getters, data mappers, and validation logic.
- Use component integration tests for mounted Vue components, props, slots, emitted events, child interaction, Pinia plugin behavior, and Vue Router behavior.
- Use Playwright UI validation for browser-level route checks, screenshots, accessibility snapshots, console/network summaries, and visual validation.
- Use full E2E tests only when a dedicated E2E profile exists.

## Vue Component Integration

- Prefer testing public behavior: rendered output, props, slots, events, and user-visible interaction.
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

- [ ] `CODEX_PROJECT.md` and testing profile were checked.
- [ ] Test type matches the behavior scope.
- [ ] Dependencies are present or explicitly recommended without unauthorized changes.
- [ ] Tests assert behavior rather than implementation details.
- [ ] Pinia/router/plugin setup matches the intended integration boundary.
- [ ] Async behavior is awaited explicitly.
- [ ] Project-declared test command was run or reported as unavailable.
