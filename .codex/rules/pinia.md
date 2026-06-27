# Pinia rules

Apply this rule only when `CODEX_PROJECT.md` declares Pinia as active for a Vue frontend project or when the task directly changes Pinia stores.

## Required skills

Use together with:

- `vue-expert`;
- `pinia-expert`.

Do not apply Pinia rules to projects that use local component state only, Vuex, another store library, or a custom state layer unless the task explicitly requests Pinia migration or review.

## Source of truth

Before changing stores:

1. Read `CODEX_PROJECT.md`.
2. Inspect existing store directories, naming, state shape, getters, actions, plugins, and persistence conventions.
3. Check call sites in components, composables, router guards, API clients, and tests.
4. Follow project-declared validation commands.

## Constraints

- Keep store boundaries domain-oriented, not component-oriented, unless the project convention says otherwise.
- Keep async and side-effecting operations in actions or declared service layers.
- Do not add persistence, cross-tab sync, or storage plugins unless `CODEX_PROJECT.md` enables them or the user approves them.
- Avoid storing derived state that can be expressed as a getter or computed value.
- Do not mutate public store state shape without checking all consumers.
- Keep API types and store types aligned.

## Review expectations

Review state contracts, getters, actions, side effects, persistence assumptions, SSR assumptions when relevant, component coupling, and affected tests together.
