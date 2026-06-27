---
name: eslint-vue-typescript
description: "Use for ESLint setup and review in Vue + TypeScript projects: flat config, eslint-plugin-vue, @vue/eslint-config-typescript, globals, Prettier conflict handling, and lint scripts."
---

# ESLint Vue TypeScript

Use this skill when ESLint is active for a Vue + TypeScript project or when the task directly changes ESLint configuration, lint dependencies, or lint scripts.

Apply `CODEX_PROJECT.md`, `.codex/rules/frontend_code_quality.md`, `.codex/rules/eslint_vue_typescript.md`, `frontend-code-quality`, `vue-expert`, and `typescript-core` together with this skill.

For review checks, load `references/review-checklist.md`.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm ESLint is active and identify the config path and lint command.
3. Inspect `package.json`, lockfile, `eslint.config.*`, `tsconfig*`, and Vue/Vite config when relevant.
4. Check whether Prettier is active and whether conflict-disabling config is present.
5. Check lint target patterns for `.vue`, `.ts`, `.mts`, and `.tsx` according to project needs.
6. Preserve project-specific lint commands such as `lint-dry-run` when declared.
7. Do not add dependencies or change package scripts without approval or dependency policy support.

## Expected Patterns

For Vue + TypeScript projects, expect some combination of:

- `eslint`;
- `@eslint/js` for JavaScript recommended config;
- `globals` for browser globals;
- `typescript` and TypeScript ESLint tooling;
- `eslint-plugin-vue`;
- `@vue/eslint-config-typescript`;
- `eslint-config-prettier` when Prettier is active.

Project examples may use Vue-provided wrappers such as `defineConfigWithVueTs` and `vueTsConfigs` instead of direct `typescript-eslint` config usage.

## Guardrails

- Do not assume `eslint.config.js`; projects may use `eslint.config.ts` or another declared path.
- Do not assume the lint command is `pnpm lint`.
- Do not enable typed linting unless the project explicitly uses or requests it.
- Do not remove Prettier conflict-disabling config when Prettier is active.
- Do not leave generated lint reports unless the project explicitly treats them as artifacts.

## Review Checklist

- [ ] ESLint config path and package scripts were checked.
- [ ] Vue file patterns are included when SFC linting is active.
- [ ] Browser/node globals match project runtime.
- [ ] Vue TypeScript config is compatible with project `tsconfig*`.
- [ ] Prettier conflict handling is present when Prettier is active.
- [ ] Temporary lint output policy is followed.
