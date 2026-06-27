# Prettier formatting rules

Apply this rule when `CODEX_PROJECT.md` declares Prettier active or when the task changes formatting configuration, formatting scripts, or formatter output.

## Required skills

Use together with:

- `prettier-formatting`.

## Source of truth

Before changing Prettier setup:

1. Read `CODEX_PROJECT.md`.
2. Check Prettier config path, format commands, dependency policy, and active stack profile.
3. Inspect `package.json`, lockfile, `.prettierrc*`, `prettier.config.*`, `.prettierignore`, and ESLint config when relevant.
4. Use project-declared commands and file scopes.

## Expected tooling

A TypeScript formatting setup usually needs:

- `prettier`;
- `eslint-config-prettier` when ESLint is active.

## Constraints

- Keep Prettier responsible for formatting, not semantic linting.
- Prefer separate Prettier commands over running Prettier inside ESLint unless the project explicitly uses that workflow.
- Use check-only validation when the project declares it.
- Use write formatting only when requested or declared as the correct workflow.
- Avoid broad formatting changes unless the project profile or user request permits them.
- Do not add Prettier plugins without approval or project policy.
