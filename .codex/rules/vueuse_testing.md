# VueUse testing rules

Apply this rule only when `CODEX_PROJECT.md` declares VueUse active and the task tests VueUse-based composables or integrations.

This rule is an overlay over Vue testing. VueUse design rules come from `vueuse-expert`; this rule defines how to test those VueUse contracts.

## Required skills

Use together with:

- `vitest-vue-testing`;
- `vueuse-expert`;
- `vueuse-testing`.

## Source of truth

Before adding or changing VueUse tests:

1. Read `CODEX_PROJECT.md`.
2. Inspect VueUse version, composable usage, runtime assumptions, test environment, and existing helpers.
3. Load `vueuse-testing/references/patterns-and-review.md` for VueUse testing examples.
4. Load `vueuse-expert/references/patterns-and-review.md` when tests touch utility selection, lifecycle cleanup, reactive arguments, event filters, storage helpers, browser APIs, or project exclusions.
5. Use project-declared test commands.

## Boundaries

- Test public composable behavior rather than VueUse internals.
- Test lifecycle cleanup when the utility manages listeners, timers, subscriptions, observers, or stop handlers.
- Use a DOM-capable environment or explicit mocks when the tested behavior depends on browser-provided objects.
- Use fake timers for debounce, throttle, timer-based utilities, and event filters.
- Isolate storage before tests that use storage helpers.
- Test reactive return values and reactive arguments through public behavior.
- Preserve reactivity when asserting returned refs.
- Preserve project-specific exclusions such as custom color mode, storage, breakpoint, or feature handling.
