---
name: vue-router-testing
description: "Use for testing Vue Router behavior with Vitest and Vue Test Utils: route records, navigation, params, query, guards, redirects, and route rendering."
---

# Vue Router Testing

Use this skill when testing Vue Router behavior in a Vue project.

Apply `.codex/rules/vue_router_testing.md`, `vitest-vue-testing`, and `vue-router-expert` together with this skill.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm Vue Router and Vue testing are active.
3. Inspect route records, router setup, test setup, and existing router test helpers.
4. Choose mocked router for unit-level component logic or real router for integration behavior.
5. Run or report the project-declared test command.

## Review Checklist

- [ ] Router setup is isolated per test when using a real router.
- [ ] Navigation readiness is awaited before assertions.
- [ ] Params, query, guards, redirects, and meta behavior are covered when affected.
- [ ] Route tests do not rely on global router state leaking across tests.
