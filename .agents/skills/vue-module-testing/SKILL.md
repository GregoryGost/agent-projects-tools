---
name: vue-module-testing
description: "Use for testing Vue Router, Pinia, and VueUse integrations with Vitest and Vue Test Utils."
---

# Vue Module Testing

Use this skill when testing active Vue modules such as Vue Router, Pinia, or VueUse.

Apply `.codex/rules/vue_module_testing.md` and `vitest-vue-testing` together with this skill.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm active Vue modules and their test policies.
3. Inspect existing test setup and helpers.
4. Choose the smallest module integration boundary that validates the behavior.
5. Use real plugins only when integration behavior is under test.
6. Use mocks or testing helpers when module behavior itself is not under test.
7. Run or report the project-declared test command.

## Router Testing

- Use mocked route/router for unit-level component logic.
- Use a fresh real router for integration behavior.
- Await router readiness and pending navigation before assertions.

## Pinia Testing

- Use a fresh Pinia per test for store unit tests.
- Use `createTestingPinia()` for component tests that need a testing store.
- Choose action stubbing intentionally based on the tested behavior.

## VueUse Testing

- Check lifecycle cleanup, event listeners, browser guards, and reactive return values.
- Avoid relying on browser APIs without a DOM-capable test environment.
