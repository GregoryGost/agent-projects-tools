---
name: pinia-testing
description: "Use for testing Pinia stores and component-store integration with Vitest, Vue Test Utils, and @pinia/testing: fresh Pinia state, createTestingPinia, action stubbing, plugins, persistence, getters, actions, and store contract review."
---

# Pinia Testing

Use this skill when testing Pinia store behavior or component-store integration.

Apply `.codex/rules/pinia_testing.md`, `vitest-vue-testing`, and `pinia-expert` together with this skill.

Load references when needed:

- `references/patterns-and-review.md` for Pinia testing good/bad patterns and review prompts.
- `references/official-sources.md` for official Pinia testing, Vue Test Utils, and Vitest sources.
- `pinia-expert/references/patterns-and-review.md` when the test touches store boundaries, state shape, getters, actions, setup-store behavior, persistence, or outside-component usage.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm Pinia and Vue testing are active.
3. Inspect store definitions, store contracts, setup-store behavior, plugins, persistence, test setup, and existing test helpers.
4. Compare the tested behavior with `pinia-expert/references/patterns-and-review.md`.
5. Choose store unit test or component-store integration test.
6. Choose real actions, stubbed actions, typed fakes, or mocked collaborators based on the behavior under test.
7. Run or report the project-declared test command.

## Test Design

- Use a fresh Pinia per test for store unit tests.
- Use `createTestingPinia()` intentionally for component-store integration tests.
- Use `initialState` for explicit component test state.
- Use `stubActions: false` or real Pinia when testing action behavior.
- Keep default stubbed actions when the component test only verifies that an action was requested.
- Include Pinia plugins in test setup when production behavior depends on them.
- Test persistence only when persistence is part of the project-approved store contract.
- Test getters through state changes and actions through public store effects.

## Review Checklist

- [ ] The test preserves the store contract defined by `pinia-expert`.
- [ ] A fresh Pinia is used per test when needed.
- [ ] `createTestingPinia()` is used intentionally for component tests.
- [ ] Action stubbing policy matches the tested behavior.
- [ ] Store state, getters, actions, setup stores, and plugins are covered where affected.
- [ ] Persistence assumptions are explicit and project-approved when tested.
- [ ] Component-store tests assert rendered behavior rather than store internals.
