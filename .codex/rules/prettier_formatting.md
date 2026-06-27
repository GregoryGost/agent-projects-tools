# Prettier formatting rules

Apply this rule only when `CODEX_PROJECT.md` declares Prettier active or when the task directly changes formatting configuration, formatting scripts, or formatter output.

## Required skills

Use together with:

- `frontend-code-quality`;
- `prettier-formatting`.

Use with `scss-tailwind-expert` when Tailwind CSS or Sass/SCSS formatting is in scope.

## Source of truth

Before changing Prettier setup:

1. Read `CODEX_PROJECT.md`.
2. Check Prettier config path, format command, format check command, Tailwind plugin setting, and dependency policy.
3. Inspect `package.json`, lockfile, `.prettierrc*`, `prettier.config.*`, `.prettierignore`, Tailwind config or stylesheet path, and ESLint config when relevant.
4. Do not change formatting across broad paths unless the project profile or user request permits it.

## Expected tooling

A frontend Prettier setup usually needs:

- `prettier`;
- `eslint-config-prettier` when ESLint is active;
- `prettier-plugin-tailwindcss` when Tailwind CSS class sorting is active.

Use a Vue-specific Prettier config wrapper only when the project already uses it or explicitly declares a create-vue-style setup.

## Constraints

- Keep Prettier responsible for formatting, not semantic linting.
- Prefer separate Prettier commands over running Prettier inside ESLint unless the project explicitly uses that workflow.
- Use `prettier --check` for check-only validation when the project declares it.
- Use `prettier --write` only when write formatting is requested or declared as the correct workflow.
- When Tailwind CSS is active, check Tailwind version and whether the Prettier plugin needs a stylesheet/config path.
- Do not commit temporary formatter outputs.
- Do not add Prettier plugins without approval or project policy.

## Review expectations

Review formatter scope, config files, ignore files, ESLint conflict handling, Tailwind class sorting, declared scripts, and changed file volume together.
