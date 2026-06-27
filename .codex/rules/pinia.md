# Pinia rules

Apply this rule only when `CODEX_PROJECT.md` declares Pinia active for a Vue frontend project or when the task directly changes Pinia stores.

## Required skills

Use together with:

- `vue-expert`;
- `pinia-expert`.

## Source of truth

Before changing stores:

1. Read `CODEX_PROJECT.md`.
2. Inspect existing store directories, naming, state shape, getters, actions, plugins, and persistence conventions.
3. Check call sites in components, composables, router guards, API clients, and tests.
4. Follow project-declared validation commands.

## Constraints

- Keep store boundaries domain-oriented unless project conventions require a different split.
- Keep async and side-effecting operations in actions or declared service layers.
- Add persistence, cross-tab sync, or storage plugins only when project policy enables them.
- Prefer getters or computed values for derived state.
- Check all consumers before changing public store state shape.
