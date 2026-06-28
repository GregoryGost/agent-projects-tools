# VueUse testing rules

Apply this rule only when `CODEX_PROJECT.md` declares VueUse active and the task tests VueUse-based composables or integrations.

This rule is an overlay over Vue testing.

## Required skills

Use together with:

- `vitest-vue-testing`;
- `vueuse-expert`;
- `vueuse-testing`.

## Source of truth

Before adding or changing VueUse tests:

1. Read `CODEX_PROJECT.md`.
2. Inspect VueUse version, composable usage, browser API assumptions, test environment, and existing helpers.
3. Use project-declared test commands.

## Boundaries

- Test lifecycle cleanup when the utility manages listeners, timers, or subscriptions.
- Guard browser-only utilities with a DOM-capable environment or explicit mocks.
- Test reactive return values through public behavior.
- Preserve project-specific exclusions such as custom color mode handling.
