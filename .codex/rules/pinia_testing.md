# Pinia testing rules

Apply this rule only when `CODEX_PROJECT.md` declares Pinia active and the task tests store behavior.

This rule is an overlay over Vue testing.

## Required skills

Use together with:

- `vitest-vue-testing`;
- `pinia-expert`;
- `pinia-testing`.

## Source of truth

Before adding or changing Pinia tests:

1. Read `CODEX_PROJECT.md`.
2. Inspect store definitions, plugins, persistence policy, test setup, and existing store helpers.
3. Use project-declared test commands.

## Boundaries

- Use a fresh Pinia per test for store unit tests.
- Use `createTestingPinia()` for component tests that need a testing store.
- Choose action stubbing intentionally based on the tested behavior.
- Include Pinia plugins in test setup when production behavior depends on them.
