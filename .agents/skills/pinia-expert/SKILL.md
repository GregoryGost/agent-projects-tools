---
name: pinia-expert
description: "Use for Pinia store work and review: store boundaries, state shape, getters, actions, persistence assumptions, call-site impact, and Vue integration."
---

# Pinia Expert

Use this skill only when Pinia is active in `CODEX_PROJECT.md` or the task directly touches Pinia stores.

Apply `.codex/rules/pinia.md`, `vue-expert`, and `typescript-core` together with this skill.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm Pinia is active or store behavior is directly in scope.
3. Inspect existing store definitions, plugins, persistence, naming, call sites, and tests.
4. Identify affected state contracts, getters, actions, and side effects.
5. Change the smallest store boundary that solves the task.
6. Update affected components, composables, router guards, and tests.

## Store Design

- Keep stores domain-oriented unless project conventions require a different split.
- Use getters for derived state.
- Use actions for async operations and side effects when the project keeps store-driven workflows.
- Keep component-local state inside components or composables unless multiple parts of the app need it.

## Review Checklist

- [ ] Store boundary is clear.
- [ ] Derived state is not duplicated unnecessarily.
- [ ] Persistence assumptions are explicit.
- [ ] Store state changes were checked at call sites.
