# Prettier Formatting Review Checklist

Load this checklist for Prettier configuration, formatter scripts, Tailwind class sorting, and formatting output reviews.

## Activation

- [ ] `CODEX_PROJECT.md` declares Prettier active, or the task directly touches formatting.
- [ ] `frontend-code-quality` is applied.

## Dependencies

- [ ] `prettier` is present or explicitly planned.
- [ ] `eslint-config-prettier` is present when ESLint is active.
- [ ] `prettier-plugin-tailwindcss` is present only when Tailwind CSS is active.
- [ ] Additional Prettier plugins are project-declared, not assumed.

## Config

- [ ] Prettier config path is known.
- [ ] `.prettierignore` or equivalent ignore policy was checked.
- [ ] Tailwind stylesheet/config path is checked when Tailwind class sorting is active.
- [ ] Formatting options match project conventions.

## Commands

- [ ] Format check command came from `CODEX_PROJECT.md` or `package.json`.
- [ ] Format write command came from `CODEX_PROJECT.md` or `package.json`.
- [ ] Broad write formatting is authorized by task or project policy.
- [ ] Generated or temporary formatter artifacts are not left behind.

## ESLint Boundary

- [ ] Prettier handles formatting.
- [ ] ESLint handles semantic/code-quality linting.
- [ ] Prettier conflict-disabling config is present when both tools are active.
