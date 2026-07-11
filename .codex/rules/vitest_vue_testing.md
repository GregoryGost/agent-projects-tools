# Vitest Vue testing rules

Apply this rule only when `CODEX_PROJECT.md` declares the `vitest-vue-testing` active stack profile, or when the task directly changes existing Vitest-based Vue unit or component tests.

Do not activate this rule solely because the `vue3-typescript-vite` profile is active. The base Vue profile does not imply a unit/component test runner or testing policy.

This rule covers unit tests and component-level integration tests for Vue 3 + TypeScript + Vite through Vitest. It does not replace browser UI validation or full end-to-end testing.

## Required skills

Use together with:

- `vitest-vue-testing`;
- `typescript-core`;
- `vue3-typescript-vite-expert`.

## Source of truth

Before adding or changing tests:

1. Read `CODEX_PROJECT.md`.
2. Confirm that `vitest-vue-testing` is active or that existing Vitest-based Vue tests are directly in scope.
3. Check package manager, dependency policy, test commands, coverage policy, and test environment.
4. Inspect `package.json`, lockfile, `vitest.config.*`, `vite.config.*`, `tsconfig*`, test setup files, and existing test patterns.
5. If the `vitest-vue-testing` profile is active but no unit/component test runner is configured, report the profile mismatch.
6. Do not infer or recommend Vitest solely from the presence of `vue3-typescript-vite`.
7. Do not add test dependencies unless the user approves it or dependency policy allows it.

## Expected tooling

For the `vitest-vue-testing` profile, the portable test baseline is:

- `vitest` as the Vite-aligned test runner;
- `@vue/test-utils` for Vue component mounting and interaction;
- `jsdom` or `happy-dom` for component tests that need browser APIs;
- `@vitest/coverage-v8` when coverage reporting is enabled.

## Test design constraints

- Prefer behavior-focused assertions over implementation details.
- Do not rely exclusively on snapshots.
- Keep mocks local and explicit.
- Keep async assertions explicit with `await`, `nextTick`, `flushPromises`, or project-approved helpers.
