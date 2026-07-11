---
name: pinia-expert
description: "Use for Pinia store work and review: store boundaries, state shape, getters, actions, setup stores, outside-component usage, persistence assumptions, call-site impact, and Vue integration."
---

# Pinia Expert

Use this skill only when Pinia is active in `CODEX_PROJECT.md` or the task directly touches Pinia stores.

Apply `.codex/rules/pinia.md`, `vue3-typescript-vite-expert`, and `typescript-core` together with this skill.

Load references when needed:

- `references/patterns-and-review.md` for Pinia good/bad patterns and review prompts.
- `references/official-sources.md` for official Pinia references.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm Pinia is active or store behavior is directly in scope.
3. Inspect existing store definitions, plugins, persistence, naming, call sites, and tests.
4. Identify affected state contracts, getters, actions, setup-store returns, lifecycle assumptions, and side effects.
5. Compare the intended change against `references/patterns-and-review.md`.
6. Change the smallest store boundary that solves the task.
7. Update affected components, composables, router guards, API clients, E2E flows, and tests.

## Store Design

- Keep stores domain-oriented unless project conventions require a different split.
- Declare state shape up front and type empty arrays/nullables explicitly when inference needs help.
- Use getters for derived state instead of duplicated mutable state.
- Use actions for async operations and side effects when the project keeps store-driven workflows.
- Keep component-local state inside components or composables unless multiple parts of the app need it.
- Do not call stores before Pinia is installed; defer store access outside components until runtime.
- In setup stores, return all state Pinia must track.

## Review Checklist

- [ ] Store boundary is clear and domain-oriented.
- [ ] State shape is declared up front.
- [ ] Derived state is not duplicated unnecessarily.
- [ ] Actions contain business operations, async workflows, or state-changing side effects where appropriate.
- [ ] Setup stores return all trackable state.
- [ ] Store usage outside components happens after Pinia is installed.
- [ ] Persistence assumptions are explicit and project-approved.
- [ ] Store state changes were checked at call sites.
