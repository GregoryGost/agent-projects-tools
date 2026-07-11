# Vitest Vue testing rules

Apply this rule whenever `CODEX_PROJECT.md` declares the `vue3-typescript-vite` active stack profile, unless the target project explicitly documents another testing stack or an approved no-tests policy.

This rule covers unit tests and component-level integration tests for Vue 3 + TypeScript + Vite. It does not replace browser UI validation or full end-to-end testing.

## Required skills

Use together with:

- `vitest-vue-testing`;
- `typescript-core`;
- `vue-expert`.

## Source of truth

Before adding or changing tests:

1. Read `CODEX_PROJECT.md`.
2. Check package manager, dependency policy, test commands, coverage policy, and test environment.
3. Inspect `package.json`, lockfile, `vitest.config.*`, `vite.config.*`, `tsconfig*`, test setup files, and existing test patterns.
4. If a Vue project has no unit/component test runner, treat it as a project quality gap.
5. Do not add test dependencies unless the user approves it or dependency policy allows it.

## Expected tooling

For Vue 3 + TypeScript + Vite, the portable test baseline is:

- `vitest` as the Vite-aligned test runner;
- `@vue/test-utils` for Vue component mounting and interaction;
- `jsdom` or `happy-dom` for component tests that need browser APIs;
- `@vitest/coverage-v8` when coverage reporting is enabled.

## Test design constraints

- Prefer behavior-focused assertions over implementation details.
- Do not rely exclusively on snapshots.
- Keep mocks local and explicit.
- Keep async assertions explicit with `await`, `nextTick`, `flushPromises`, or project-approved helpers.