---
name: pinia-testing
description: "Use for testing Pinia stores and component-store integration with Vitest, Vue Test Utils, and @pinia/testing."
---

# Pinia Testing

Use this skill when testing Pinia store behavior or component-store integration.

Apply `.codex/rules/pinia_testing.md`, `vitest-vue-testing`, and `pinia-expert` together with this skill.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm Pinia and Vue testing are active.
3. Inspect store setup, plugins, persistence, and existing test helpers.
4. Choose store unit test or component integration test.
5. Run or report the project-declared test command.

## Review Checklist

- [ ] A fresh Pinia is used per test when needed.
- [ ] `createTestingPinia()` is used intentionally for component tests.
- [ ] Action stubbing policy matches the tested behavior.
- [ ] Store state, getters, actions, and plugins are covered where affected.
