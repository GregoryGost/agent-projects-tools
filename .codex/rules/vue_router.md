# Vue Router rules

Apply this rule only when `CODEX_PROJECT.md` declares Vue Router active for a Vue frontend project or when the task directly changes routing behavior.

## Required skills

Use together with:

- `vue-expert`;
- `vue-router-expert`.

## Source of truth

Before changing routes:

1. Read `CODEX_PROJECT.md`.
2. Inspect the existing router setup and route registration pattern.
3. Check route names, params, query handling, guards, lazy imports, meta fields, and title behavior.
4. Follow project-declared validation commands.

## Constraints

- Preserve existing route names and params unless the task explicitly changes navigation contracts.
- Prefer lazy route component imports when adding route-level views unless the project pattern says otherwise.
- Keep route meta fields consistent with the existing project convention.
- Do not add global guards for local page behavior.
- Update affected links, redirects, tests, and UI validation paths when route contracts change.
