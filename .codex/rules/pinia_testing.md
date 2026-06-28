# Pinia testing rules

Apply this rule only when `CODEX_PROJECT.md` declares Pinia active and the task tests store behavior.

This rule is an overlay over Vue testing. Store design rules come from `pinia-expert`; this rule defines how to test those store contracts.

## Required skills

Use together with:

- `vitest-vue-testing`;
- `pinia-expert`;
- `pinia-testing`.

## Source of truth

Before adding or changing Pinia tests:

1. Read `CODEX_PROJECT.md`.
2. Inspect store definitions, plugins, persistence policy, test setup, and existing store helpers.
3. Load `pinia-testing/references/patterns-and-review.md` for Pinia testing examples.
4. Load `pinia-expert/references/patterns-and-review.md` when the test touches store boundaries, state shape, getters, actions, setup-store behavior, persistence, or outside-component usage.
5. Use project-declared test commands.

## Boundaries

- Use a fresh Pinia per test for store unit tests.
- Use `createTestingPinia()` for component tests that need a testing store.
- Use `initialState` to make component-store state explicit.
- Choose action stubbing intentionally based on the tested behavior.
- Use real actions when the action implementation is the behavior under test.
- Keep actions stubbed when the component test only verifies that the component requests the action.
- Include Pinia plugins in test setup when production behavior depends on them.
- Test persistence only when persistence is part of the approved store contract.
- Test getters as derived behavior and actions through public store effects.
