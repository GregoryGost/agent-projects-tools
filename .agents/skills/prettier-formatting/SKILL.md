---
name: prettier-formatting
description: "Use for Prettier formatting workflows: config, ignore files, check/write commands, ESLint conflict handling, and formatter scope control."
---

# Prettier Formatting

Use this skill when Prettier is active in `CODEX_PROJECT.md` or when the task directly changes formatting config, formatting scripts, formatter dependencies, or formatter output.

Apply `.codex/rules/prettier_formatting.md` together with this skill.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm Prettier is active and identify config path, ignore file, format command, and format-check command.
3. Inspect `package.json`, lockfile, Prettier config, `.prettierignore`, and ESLint config when relevant.
4. Check whether ESLint is active and conflict-resolution config is present.
5. Use project-declared commands; do not guess command names.
6. Avoid broad write formatting unless explicitly requested or project policy allows it.

## Expected Patterns

- `prettier` formats code.
- `prettier --check` validates formatting without writing when such a script exists.
- `prettier --write` rewrites files and should be scoped intentionally.
- `eslint-config-prettier` resolves formatter-related ESLint conflicts when ESLint and Prettier are both active.

## Review Checklist

- [ ] Prettier config and ignore file were checked.
- [ ] Formatter commands came from the project profile or package scripts.
- [ ] ESLint conflict handling is present when ESLint is active.
- [ ] Formatter scope is intentional.
- [ ] No unrelated files were reformatted without permission.
