# Vue Router rules

Apply this rule only when `CODEX_PROJECT.md` declares Vue Router active for a Vue frontend project or when the task directly changes routing behavior.

This rule is a Vue Router overlay. General Vue component, Vite, and TypeScript rules remain in `vue-expert` and `typescript-core`.

## Required skills

Use together with:

- `vue-expert`;
- `vue-router-expert`.

## Source of truth

Before changing routes:

1. Read `CODEX_PROJECT.md`.
2. Inspect the existing router setup and route registration pattern.
3. Check route names, params, query handling, guards, redirects, lazy imports, meta fields, title behavior, scroll behavior, and navigation failure handling.
4. Load `vue-router-expert/references/patterns-and-review.md` when changing route contracts, route params/query, guards, redirects, meta fields, lazy route views, or navigation call sites.
5. Follow project-declared validation commands.

## Constraints

- Preserve existing route names and params unless the task explicitly changes navigation contracts.
- Prefer named routes for stable programmatic navigation.
- Prefer route props when route params are component inputs.
- Watch specific `route` properties instead of the whole route object when route changes trigger side effects.
- Prefer lazy route component imports when adding route-level views unless the project pattern says otherwise.
- Keep route meta fields consistent with the existing project convention.
- Do not add global guards for local page behavior.
- Avoid redirect loops in guards and redirects.
- Handle navigation failures only where the navigation result affects behavior.
- Update affected links, redirects, tests, E2E flows, and UI validation paths when route contracts change.
