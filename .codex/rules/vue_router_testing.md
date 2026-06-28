# Vue Router testing rules

Apply this rule only when `CODEX_PROJECT.md` declares Vue Router active and the task tests route behavior.

This rule is an overlay over Vue testing. Route design rules come from `vue-router-expert`; this rule defines how to test those route contracts.

## Required skills

Use together with:

- `vitest-vue-testing`;
- `vue-router-expert`;
- `vue-router-testing`.

## Source of truth

Before adding or changing router tests:

1. Read `CODEX_PROJECT.md`.
2. Inspect router setup, route records, guards, redirects, route meta, route props, navigation failures, and existing test helpers.
3. Load `vue-router-testing/references/patterns-and-review.md` for router testing examples.
4. Load `vue-router-expert/references/patterns-and-review.md` when tests touch route contracts, route props, route meta, guards, redirects, lazy route views, `RouterLink`, or navigation failures.
5. Use project-declared test commands.

## Boundaries

- Use mocked route/router for unit-level component logic.
- Use a fresh real router for integration behavior.
- Use `createMemoryHistory()` for real-router tests unless the project declares another test history.
- Await router readiness before initial assertions.
- Await pending navigation after interactions.
- Test route-prop components by passing props directly unless route param-to-prop wiring is under test.
- Check affected links, route params, query, guards, redirects, meta fields, route props, and navigation failures.
- Do not rely on global router state leaking across tests.
