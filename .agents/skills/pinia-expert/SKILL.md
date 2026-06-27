---
name: pinia-expert
description: "Use for Pinia store work and review: store boundaries, state shape, getters, actions, persistence assumptions, call-site impact, and Vue integration."
---

# Pinia Expert

Use this skill only when Pinia is active in `CODEX_PROJECT.md` or the task directly touches Pinia stores.

Apply `.codex/rules/pinia.md`, `.codex/rules/vue_frontend.md`, `vue-expert`, and `typescript-core` together with this skill.

For review checks, load `references/review-checklist.md`. For official docs, load `references/official-sources.md`.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm Pinia is active or store behavior is directly in scope.
3. Inspect existing store definitions, plugins, persistence, naming, call sites, and tests.
4. Identify affected state contracts, getters, actions, and side effects.
5. Change the smallest store boundary that solves the task.
6. Update all affected components, composables, router guards, and tests.
7. Run or report project-declared validation commands.

## Store Design

- Keep stores domain-oriented unless project conventions require a different split.
- Use getters for derived state.
- Use actions for async operations and side effects when the project keeps store-driven workflows.
- Keep component-local state inside components or composables unless multiple parts of the app need it.
- Avoid implicit persistence; storage, hydration, cross-tab sync, and SSR behavior must be project-declared.
- Keep public store state stable unless the task explicitly changes it.

## TypeScript

- Type state, action inputs, and action results at public boundaries.
- Narrow API data before assigning it to store state.
- Avoid broad store types that hide missing fields.
- Check all consumers before changing store state shape.

## Review Checklist

- [ ] Store boundary is domain-appropriate.
- [ ] Derived state is not duplicated unnecessarily.
- [ ] Async behavior and side effects live in the project-approved layer.
- [ ] Persistence is not introduced implicitly.
- [ ] Store state changes were checked at call sites.
- [ ] Validation commands were run or reported as unavailable.
