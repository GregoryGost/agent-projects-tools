---
name: frontend-code-quality
description: "Use for frontend and TypeScript code-quality tooling: package scripts, ESLint, Prettier, Vue SFC type-checking, Tailwind formatting integration, dependency matrix review, and validation command routing."
---

# Frontend Code Quality

Use this skill when a task changes or reviews frontend or TypeScript linting, formatting, type-checking, quality scripts, or dev dependencies related to code quality.

Apply `CODEX_PROJECT.md` and `.codex/rules/frontend_code_quality.md` together with this skill.

Use overlay skills when active:

- `eslint-typescript` for TypeScript ESLint setup, including TypeScript-only projects.
- `eslint-vue` for Vue SFC and template linting in Vue projects.
- `prettier-formatting` for Prettier configuration and formatting workflows.

Load references when needed:

- `references/dependency-matrix.md` for dependency groups.
- `references/official-sources.md` for official documentation links.
- `references/review-checklist.md` for review checks.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm active language, framework, styling, and frontend code quality profiles.
3. Inspect `package.json`, package manager metadata, scripts, lockfile, and dependency policy.
4. Inspect relevant config files: `eslint.config.*`, Prettier config, `tsconfig*`, `vite.config.*`, Tailwind files, and ignore files.
5. Compare installed dev dependencies with the active profile dependency matrix.
6. Do not add or upgrade dependencies unless the user approves it or the project dependency policy allows it.
7. Route work to the active specialized skill: TypeScript ESLint, Vue ESLint, Prettier, Vue type-checking, or styling checks.
8. Run or report project-declared validation commands.

## Baselines

For TypeScript projects, expect separate responsibilities:

- ESLint checks TypeScript code quality.
- Prettier formats code when active.
- `eslint-config-prettier` disables conflicting formatter-related ESLint rules when ESLint and Prettier are both active.

For Vue 3 + TypeScript + Vite projects, add Vue-specific quality tooling:

- `eslint-plugin-vue` and Vue TypeScript config wrappers lint Vue SFC/template behavior.
- `vue-tsc` performs command-line type checking for Vue SFCs.
- `prettier-plugin-tailwindcss` sorts Tailwind classes only when Tailwind is active.

## Package Script Policy

- Do not assume `lint`, `format`, `typecheck`, or `build` script names.
- Use commands declared in `CODEX_PROJECT.md` or `package.json`.
- Treat project-specific commands such as `lint-dry-run` as valid when declared.
- Do not leave generated lint reports in the repository unless explicitly required.

## Review Checklist

- [ ] `CODEX_PROJECT.md` was read.
- [ ] `package.json` and actual scripts were checked.
- [ ] Active dev dependencies match the enabled quality profile.
- [ ] TypeScript ESLint and Vue ESLint boundaries are separated.
- [ ] ESLint and Prettier responsibilities are not conflated.
- [ ] Vue SFC type-checking is covered through `vue-tsc` when Vue + TypeScript is active.
- [ ] Tailwind Prettier plugin is active only when Tailwind is active.
- [ ] Stylelint is not assumed unless project profile enables it.
