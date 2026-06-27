---
name: vue-router-expert
description: "Use for Vue Router changes and review: route records, lazy route components, route meta, guards, redirects, params, query handling, and navigation validation."
---

# Vue Router Expert

Use this skill only when Vue Router is active in `CODEX_PROJECT.md` or the task directly touches routing behavior.

Apply `.codex/rules/vue_router.md`, `.codex/rules/vue_frontend.md`, `vue-expert`, and `typescript-core` together with this skill.

For review checks, load `references/review-checklist.md`. For official docs, load `references/official-sources.md`.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm Vue Router is active or route behavior is directly in scope.
3. Inspect the existing router setup, route records, route names, meta fields, guards, redirects, and scroll behavior.
4. Identify the route contract affected by the task: path, name, params, query, meta, title, auth, layout, lazy component.
5. Update affected navigation call sites, links, redirects, route guards, and UI validation paths.
6. Run or report project-declared validation commands.

## Route Design

- Preserve route names and params unless the task explicitly changes them.
- Prefer lazy route component imports for route-level views when consistent with the project.
- Keep route meta shape consistent and typed when possible.
- Use local component logic for local UI decisions; do not add global guards unnecessarily.
- Keep authorization, data fetching, and side effects in the project-approved layers.
- Update page title/meta behavior when adding new user-facing routes if the project uses it.

## Review Checklist

- [ ] Route records remain internally consistent.
- [ ] Names, params, query keys, and meta fields were checked at call sites.
- [ ] Lazy imports follow project convention.
- [ ] Guards are minimal and scoped correctly.
- [ ] Redirects do not create loops.
- [ ] Affected UI validation routes were updated or documented.
