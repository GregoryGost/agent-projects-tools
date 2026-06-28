---
name: vue-router-testing
description: "Use for testing Vue Router behavior with Vitest and Vue Test Utils: mocked route/router, real router integration, route records, navigation readiness, params, query, guards, redirects, meta, route props, navigation failures, and route rendering."
---

# Vue Router Testing

Use this skill when testing Vue Router behavior in a Vue project.

Apply `.codex/rules/vue_router_testing.md`, `vitest-vue-testing`, and `vue-router-expert` together with this skill.

Load references when needed:

- `references/patterns-and-review.md` for Vue Router testing good/bad patterns and review prompts.
- `references/official-sources.md` for official Vue Router, Vue Test Utils, and Vitest sources.
- `vue-router-expert/references/patterns-and-review.md` when tests touch route contracts, route props, route meta, guards, redirects, lazy route views, `RouterLink`, or navigation failures.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm Vue Router and Vue testing are active.
3. Inspect route records, router setup, route contracts, test setup, and existing router test helpers.
4. Compare the tested behavior with `vue-router-expert/references/patterns-and-review.md`.
5. Choose mocked route/router for unit-level component logic or real router for route integration behavior.
6. Choose direct route-prop component testing when route params are only component inputs.
7. Run or report the project-declared test command.

## Test Design

- Use mocked route/router for component logic that only needs route state or verifies a navigation request.
- Use a fresh real router for route rendering, guards, redirects, link navigation, active link state, and integration behavior.
- Use `createMemoryHistory()` for real-router tests unless the project declares a different test history.
- Await `router.isReady()` before initial route assertions.
- Await pending navigation with `flushPromises()` or project-approved helpers after router-link clicks or route changes.
- Test route props directly as props unless the route param-to-prop wiring itself is under test.
- Cover route names, params, query, meta, guards, redirects, route props, and navigation failures when affected.
- Do not rely on global router state leaking across tests.

## Review Checklist

- [ ] Test type is clear: mocked component logic or real-router integration.
- [ ] Router setup is isolated per test when using a real router.
- [ ] Navigation readiness is awaited before assertions.
- [ ] Pending navigation is awaited after interactions.
- [ ] Params, query, guards, redirects, meta, route props, and navigation failures are covered when affected.
- [ ] Route tests preserve route contracts defined by `vue-router-expert`.
- [ ] Route tests do not rely on global router state leaking across tests.
