# Vitest Vue testing rules

Apply this rule whenever `CODEX_PROJECT.md` declares the `vue-frontend` active stack profile, unless the target project explicitly documents a different testing stack or an approved no-tests policy.

This rule covers unit tests and component-level integration tests for Vue 3 + TypeScript + Vite. It does not replace browser UI validation through Playwright MCP or full end-to-end testing.

## Required skills

Use together with:

- `vitest-vue-testing`;
- `typescript-core`;
- `vue-expert`.

Use related skills when active:

- `pinia-expert` when stores are tested.
- `vue-router-expert` when route behavior is tested.

## Source of truth

Before adding or changing tests:

1. Read `CODEX_PROJECT.md`.
2. Check package manager, dependency policy, test commands, coverage policy, and test environment.
3. Inspect `package.json`, lockfile, `vitest.config.*`, `vite.config.*`, `tsconfig*`, test setup files, and existing test patterns.
4. If a Vue project has no unit/component test runner, treat it as a project quality gap: report the missing baseline and recommend the required dependencies and commands.
5. Do not add test dependencies unless the user approves it or dependency policy allows it.
6. Do not invent test commands; use commands declared in `CODEX_PROJECT.md` or `package.json`.

## Testing boundaries

- Unit tests cover isolated functions, composables, stores, modules, and pure business logic.
- Component integration tests mount components and validate rendered behavior through props, events, slots, user interaction, plugins, and child components.
- Component tests should cover significant user-facing Vue components; each new or substantially changed component should normally have a corresponding spec unless an explicit project policy says otherwise.
- Do not use Playwright MCP as a replacement for unit or component tests.
- Do not write full browser end-to-end tests under this rule; use the Playwright UI validation rule or a dedicated E2E profile.

## Expected tooling

For Vue 3 + TypeScript + Vite, the portable test baseline is:

- `vitest` as the Vite-aligned test runner;
- `@vue/test-utils` for Vue component mounting and interaction;
- `jsdom` or `happy-dom` for component tests that need browser APIs;
- `@pinia/testing` when Pinia component tests need a testing store;
- `@vitest/coverage-v8` when coverage reporting is enabled.

## Test design constraints

- Prefer behavior-focused assertions over implementation details.
- Do not assert private component instance state unless the task explicitly needs white-box unit coverage.
- Do not rely exclusively on snapshots.
- Keep mocks local and explicit.
- Use real Pinia/router plugins only when integration behavior matters; otherwise use targeted mocks or testing helpers.
- Use separate router instances per test when testing with real Vue Router.
- Keep async assertions explicit with `await`, `nextTick`, `flushPromises`, or project-approved helpers.

## Review expectations

Review test scope, dependency policy, test environment, Vue plugin setup, mocked vs real integration boundary, async behavior, coverage policy, declared commands, and any missing baseline test tooling together.
