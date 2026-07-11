# Pinia rules

Apply this rule only when `CODEX_PROJECT.md` declares Pinia active for a Vue frontend project or when the task directly changes Pinia stores.

## Required skills

Use together with:

- `vue3-typescript-vite-expert`;
- `pinia-expert`.

## Source of truth

Before changing stores:

1. Read `CODEX_PROJECT.md`.
2. Inspect existing store directories, naming, state shape, getters, actions, plugins, and persistence conventions.
3. Check call sites in components, composables, router guards, API clients, E2E flows, and tests.
4. Load `pinia-expert/references/patterns-and-review.md` when changing store boundaries, state shape, getters, actions, setup-store behavior, persistence, or outside-component usage.
5. Follow project-declared validation commands.

## Constraints

- Keep store boundaries domain-oriented unless project conventions require a different split.
- Declare store state shape up front; do not add undeclared state properties at call sites.
- Keep async and side-effecting operations in actions or declared service layers.
- Add persistence, cross-tab sync, or storage plugins only when project policy enables them.
- Prefer getters or computed values for derived state instead of duplicated mutable state.
- Do not call `useStore()` before Pinia is installed; defer store access outside components until runtime.
- In setup stores, return all state Pinia must track.
- Check all consumers before changing public store state shape, getters, or actions.
