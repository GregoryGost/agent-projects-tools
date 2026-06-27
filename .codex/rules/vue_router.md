# Vue Router rules

Apply this rule only when `CODEX_PROJECT.md` declares Vue Router as active for a Vue frontend project or when the task directly changes routing behavior.

## Required skills

Use together with:

- `vue-expert`;
- `vue-router-expert`.

Do not infer Vue Router usage from a Vue dependency alone. Confirm active routing files, route records, or project profile settings.

## Source of truth

Before changing routes:

1. Read `CODEX_PROJECT.md`.
2. Inspect the existing router setup and route registration pattern.
3. Check route names, params, query handling, guards, lazy imports, meta fields, and title behavior.
4. Follow project-declared validation commands and UI validation workflows.

## Constraints

- Preserve existing route names and params unless the task explicitly changes navigation contracts.
- Prefer lazy route component imports when adding route-level views unless the project pattern says otherwise.
- Keep route meta fields consistent with the existing project convention.
- Do not add global guards for local page behavior.
- Do not put data fetching, store mutation, or authorization logic in routing files unless the project architecture explicitly requires it.
- Update affected links, redirects, tests, and Playwright validation paths when route contracts change.

## Review expectations

Review navigation contracts, route meta, guards, lazy loading, title behavior, redirects, auth-sensitive paths, and UI validation paths together.
