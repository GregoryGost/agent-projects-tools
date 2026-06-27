---
name: prettier-formatting
description: "Use for Prettier formatting workflows: config, ignore files, check/write commands, ESLint conflict handling, Tailwind class sorting, and formatter scope control."
---

# Prettier Formatting

Use this skill when Prettier is active in `CODEX_PROJECT.md` or when the task directly changes formatting config, formatting scripts, formatter dependencies, or formatter output.

Apply `CODEX_PROJECT.md`, `.codex/rules/frontend_code_quality.md`, `.codex/rules/prettier_formatting.md`, and `frontend-code-quality` together with this skill.

For review checks, load `references/review-checklist.md`.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm Prettier is active and identify config path, ignore file, format command, and format-check command.
3. Inspect `package.json`, lockfile, Prettier config, `.prettierignore`, ESLint config, and Tailwind config/stylesheet when relevant.
4. Check whether Tailwind class sorting is active through `prettier-plugin-tailwindcss`.
5. Check whether ESLint is active and conflict handling is configured through `eslint-config-prettier` or a project-approved wrapper.
6. Use project-declared commands; do not guess command names.
7. Avoid broad write formatting unless explicitly requested or project policy allows it.

## Expected Patterns

- `prettier` formats code.
- `prettier --check` validates formatting without writing when such a script exists.
- `prettier --write` rewrites files and should be scoped intentionally.
- `eslint-config-prettier` disables formatter-conflicting ESLint rules when ESLint and Prettier are both active.
- `prettier-plugin-tailwindcss` sorts Tailwind classes when Tailwind is active.

## Tailwind

When Tailwind CSS is active:

- confirm the installed Tailwind version;
- confirm plugin version;
- check whether the Prettier config declares Tailwind stylesheet/config path;
- do not add Tailwind plugin configuration without checking project setup.

## Guardrails

- Do not run broad write formatting to unrelated files unless requested.
- Do not use Prettier as a linter.
- Do not run Prettier inside ESLint unless the project explicitly uses that workflow.
- Do not remove local Prettier config in favor of editor defaults.
- Do not add Prettier plugins without approval or project policy.

## Review Checklist

- [ ] Prettier config and ignore file were checked.
- [ ] Formatter commands came from the project profile or package scripts.
- [ ] ESLint conflict handling is present when ESLint is active.
- [ ] Tailwind plugin is present only when Tailwind is active.
- [ ] Formatter scope is intentional.
- [ ] No unrelated files were reformatted without permission.
