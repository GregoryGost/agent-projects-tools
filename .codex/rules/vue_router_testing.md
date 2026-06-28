# Vue Router testing rules

Apply this rule only when `CODEX_PROJECT.md` declares Vue Router active and the task tests route behavior.

This rule is an overlay over Vue testing.

## Required skills

Use together with:

- `vitest-vue-testing`;
- `vue-router-expert`;
- `vue-router-testing`.

## Source of truth

Before adding or changing router tests:

1. Read `CODEX_PROJECT.md`.
2. Inspect router setup, route records, guards, redirects, route meta, and existing test helpers.
3. Use project-declared test commands.

## Boundaries

- Use mocked route/router for unit-level component logic.
- Use a fresh real router for integration behavior.
- Await router readiness and pending navigation before assertions.
- Check affected links, route params, query, guards, and redirects.
