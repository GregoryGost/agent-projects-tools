---
name: vueuse-testing
description: "Use for testing VueUse-based composables and integrations: lifecycle cleanup, browser/storage mocks, fake timers, event filters, reactive return values, reactive arguments, and project-specific exclusions."
---

# VueUse Testing

Use this skill when testing VueUse-based composables or integrations.

Apply `.codex/rules/vueuse_testing.md`, `vitest-vue-testing`, and `vueuse-expert` together with this skill.

Load references when needed:

- `references/patterns-and-review.md` for VueUse testing good/bad patterns and review prompts.
- `references/official-sources.md` for official VueUse, Vue Test Utils, and Vitest sources.
- `vueuse-expert/references/patterns-and-review.md` when tests touch utility selection, lifecycle cleanup, reactive arguments, event filters, storage helpers, browser APIs, or project exclusions.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm VueUse and Vue testing are active.
3. Inspect VueUse utility usage, utility version support, browser assumptions, test environment, and existing helpers.
4. Compare tested behavior with `vueuse-expert/references/patterns-and-review.md`.
5. Choose a test boundary focused on public composable behavior, component integration, or browser API integration.
6. Choose DOM-capable environment, explicit browser mocks, fake timers, and storage isolation according to the behavior under test.
7. Run or report the project-declared test command.

## Test Design

- Test public composable behavior, not VueUse internals.
- Assert reactive return values without copying them into stale plain snapshots.
- Test reactive arguments when they are part of the composable contract.
- Mock browser-only APIs explicitly when the test environment does not provide them.
- Use a DOM-capable test environment only when DOM/browser behavior is part of the contract.
- Use fake timers for debounce/throttle/timer-based utilities and event filters.
- Isolate storage state before tests that use storage helpers.
- Test lifecycle cleanup when utilities manage listeners, timers, subscriptions, observers, or stop handlers.
- Preserve project-specific exclusions such as custom color mode handling.

## Review Checklist

- [ ] VueUse utility behavior matches installed version.
- [ ] Browser-only APIs are guarded or mocked.
- [ ] DOM-capable environment is used only when needed.
- [ ] Fake timers are used for timer/event-filter behavior.
- [ ] Storage state is isolated when storage helpers are tested.
- [ ] Lifecycle cleanup is tested when relevant.
- [ ] Reactive return values and reactive arguments are asserted through public behavior.
- [ ] Project-specific exclusions were preserved.
