---
name: vue-router-expert
description: "Use for Vue Router changes and review: route records, named routes, lazy route components, route props, route meta, guards, redirects, params, query handling, navigation failures, and call-site validation."
---

# Vue Router Expert

Use this skill only when Vue Router is active in `CODEX_PROJECT.md` or the task directly touches routing behavior.

Apply `.codex/rules/vue_router.md`, `vue3-typescript-vite-expert`, and `typescript-core` together with this skill.

Load references when needed:

- `references/patterns-and-review.md` for Vue Router good/bad patterns and review prompts.
- `references/official-sources.md` for official Vue Router references.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm Vue Router is active or route behavior is directly in scope.
3. Inspect the existing router setup, route records, route names, meta fields, guards, redirects, scroll behavior, and route-view lazy imports.
4. Identify the route contract affected by the task: path, name, params, query, meta, title, auth, layout, redirect, guard, or lazy component.
5. Compare the intended change against `references/patterns-and-review.md`.
6. Update affected navigation call sites, `RouterLink` usage, redirects, route guards, tests, E2E flows, and UI validation paths.

## Route Design

- Treat route records as public navigation contracts.
- Prefer named routes for stable programmatic navigation.
- Prefer route props when params are component inputs.
- Watch specific `route` properties instead of the whole route object.
- Keep guards minimal and scoped to the smallest route boundary that needs them.
- Keep route meta fields consistent with project policy and type them when the project does so.
- Prefer lazy route component imports for route-level views when the project uses that convention.

## Review Checklist

- [ ] Route records remain internally consistent.
- [ ] Names, params, query keys, and meta fields were checked at call sites.
- [ ] Route props were considered for param-driven view components.
- [ ] Lazy imports follow project convention.
- [ ] Guards are minimal, scoped correctly, and avoid redirect loops.
- [ ] Navigation failures are handled where the result matters.
- [ ] Affected tests, E2E flows, and UI validation paths were updated.
