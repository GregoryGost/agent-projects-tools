# Vitest Vue testing rules

Apply this rule only when `CODEX_PROJECT.md` declares Vue unit/component testing as active or when the task directly changes unit, component, or integration tests for a Vue frontend project.

This rule covers unit tests and component-level integration tests for Vue 3 + TypeScript + Vite. It does not replace browser UI validation through Playwright MCP or full end-to-end testing.

## Required skills

Use together with:

- `vitest-vue-testing`.

Use related skills when active:

- `typescript-core` for TypeScript test code and typed mocks.
- `vue-expert` for Vue components and composables.
- `pinia-expert` when stores are tested.
- `vue-router-expert` when route behavior is tested.

## Source of truth

Before adding or changing tests:

1. Read `CODEX_PROJECT.md`.
2. Check active testing profile, package manager, dependency policy, test commands, coverage policy, and test environment.
3. Inspect `package.json`, lockfile, `vitest.config.*`, `vite.config.*`, `tsconfig*`, test setup files, and existing test patterns.
4. Do not add test dependencies unless the user approves it or dependency policy allows it.
5. Do not invent test commands; use commands declared in `CODEX_PROJECT.md` or `package.json`.

## Testing boundaries

- Unit tests cover isolated functions, composables, stores, modules, and pure business logic.
- Component integration tests mount components and validate rendered behavior through props, events, slots, user interaction, plugins, and child components.
- Do not use Playwright MCP as a replacement for unit or component tests when the project declares test commands.
- Do not write full browser end-to-end tests under this rule; use the Playwright UI validation rule or a dedicated E2E profile.

## Expected tooling

For Vue 3 + TypeScript + Vite, the portable test baseline is:

- `vitest` as the Vite-aligned test runner;
- `@vue/test-utils` for Vue component mounting and interaction;
- `jsdom` or `happy-dom` when tests need browser APIs;
- `@pinia/testing` only when Pinia component tests need a testing store;
- `@vitest/coverage-v8` only when coverage reporting is enabled.

## Test design constraints

- Prefer behavior-focused assertions over implementation details.
- Do not assert private component instance state unless the task explicitly needs white-box unit coverage.
- Do not rely exclusively on snapshots.
- Keep mocks local and explicit.
- Use real Pinia/router plugins only when integration behavior matters; otherwise use targeted mocks or testing helpers.
- Use separate router instances per test when testing with real Vue Router.
- Keep async assertions explicit with `await`, `nextTick`, `flushPromises`, or project-approved helpers.

## Review expectations

Review test scope, dependency policy, test environment, Vue plugin setup, mocked vs real integration boundary, async behavior, coverage policy, and declared commands together.
