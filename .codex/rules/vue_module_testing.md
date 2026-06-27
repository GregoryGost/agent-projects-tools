# Vue module testing rules

Apply this rule only when `CODEX_PROJECT.md` declares Vue module testing active or when the task directly tests Vue Router, Pinia, or VueUse integrations.

This rule is an overlay over Vue component testing. It does not define the modules themselves.

## Required skills

Use together with:

- `vitest-vue-testing`;
- `vue-module-testing`.

Use module skills only when relevant:

- `vue-router-expert` for router behavior.
- `pinia-expert` for store behavior.
- `vueuse-expert` for VueUse behavior.

## Source of truth

Before adding or changing module tests:

1. Read `CODEX_PROJECT.md`.
2. Confirm which Vue modules are active.
3. Inspect existing test setup, plugin setup, router/store helpers, and test command.
4. Use project-declared commands and dependency policy.

## Boundaries

- Router tests cover navigation contracts, route rendering, params, query, guards, redirects, and meta behavior.
- Pinia tests cover store state, getters, actions, plugins, and component-store integration.
- VueUse tests cover lifecycle cleanup, browser guards, and reactive return values.
