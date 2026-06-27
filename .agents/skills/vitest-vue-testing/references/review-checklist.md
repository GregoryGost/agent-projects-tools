# Vitest Vue Testing Review Checklist

Load this checklist for Vue unit tests, component integration tests, and test setup changes.

## Activation

- [ ] `vue-frontend` is active, or the task directly touches Vue tests.
- [ ] `vitest-vue-testing`, `vue-expert`, and `typescript-core` are applied.
- [ ] A different testing stack or no-tests policy is explicitly declared if Vitest-based testing is not used.
- [ ] `pinia-expert` or `vue-router-expert` is applied only when stores or routes are in scope.

## Dependency And Config

- [ ] `package.json` and lockfile were checked.
- [ ] `vitest` is present, or its absence is reported as a Vue testing baseline gap.
- [ ] `@vue/test-utils` is present for component tests, or its absence is reported as a baseline gap.
- [ ] `vitest.config.*` or project test config path was checked.
- [ ] Test environment is correct: `node`, `jsdom`, or `happy-dom`.
- [ ] Test setup files are explicit and small.
- [ ] Coverage dependency is present only if coverage is enabled.

## Test Type

- [ ] Unit tests are used for pure functions, modules, composables, and stores.
- [ ] Component integration tests are used for mounted components and public behavior.
- [ ] New or substantially changed user-facing components have a spec file unless the project explicitly opts out.
- [ ] Browser UI validation is routed to `playwright-ui-checks-mcp` when appropriate.
- [ ] Full E2E tests are not mixed into this layer.

## Vue Component Tests

- [ ] Assertions target rendered output, props, slots, events, or user-visible behavior.
- [ ] Private implementation details are not asserted unless intentionally white-box.
- [ ] Snapshot-only tests are avoided.
- [ ] Child component stubbing is intentional.
- [ ] Async updates are awaited with the project-approved helper.

## Pinia And Router

- [ ] Store tests create a fresh Pinia per test when needed.
- [ ] Component tests using Pinia use `createTestingPinia()` when appropriate.
- [ ] Pinia action stubbing is intentional.
- [ ] Router tests use mocks for unit tests or fresh real router instances for integration tests.
- [ ] Router readiness and navigation promises are awaited.

## Commands

- [ ] Unit test command came from `CODEX_PROJECT.md` or `package.json`.
- [ ] Component/integration test command came from `CODEX_PROJECT.md` or `package.json`.
- [ ] Skipped tests, unavailable commands, or missing baseline tooling are explained.
