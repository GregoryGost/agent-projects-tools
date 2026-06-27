---
name: eslint-typescript
description: "Use for ESLint setup and review in TypeScript projects independent of Vue: flat config, typescript-eslint, globals, typed-linting policy, Prettier conflict handling, and lint scripts."
---

# ESLint TypeScript

Use this skill when ESLint is active for a TypeScript project, including projects that do not use Vue.

Apply `CODEX_PROJECT.md`, `.codex/rules/frontend_code_quality.md`, `.codex/rules/eslint_typescript.md`, `frontend-code-quality`, and `typescript-core` together with this skill.

For review checks, load `references/review-checklist.md`. For official docs, load `references/official-sources.md`.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm ESLint is active and identify TypeScript profile, runtime, config path, lint command, and dependency policy.
3. Inspect `package.json`, lockfile, `eslint.config.*`, `tsconfig*`, and existing lint target patterns.
4. Check whether Prettier is active and whether conflict-disabling config is present.
5. Check TypeScript file patterns such as `.ts`, `.mts`, `.cts`, `.tsx`, and project-specific paths.
6. Preserve project-specific lint commands such as `lint-dry-run` when declared.
7. Do not add dependencies or change package scripts without approval or dependency policy support.

## Expected Patterns

For TypeScript projects, expect some combination of:

- `eslint`;
- `@eslint/js` for JavaScript recommended config;
- `globals` for browser or node globals;
- `typescript`;
- `typescript-eslint`;
- `eslint-config-prettier` when Prettier is active.

Vue-specific dependencies such as `eslint-plugin-vue` and `@vue/eslint-config-typescript` belong to `eslint-vue`, not this core TypeScript skill.

## Guardrails

- Do not assume `eslint.config.js`; projects may use `eslint.config.ts`, `eslint.config.mjs`, or another declared path.
- Do not assume the lint command is `pnpm lint`.
- Do not include `.vue` patterns unless the Vue ESLint overlay is active.
- Do not enable typed linting unless the project explicitly uses or requests it.
- Do not remove Prettier conflict-disabling config when Prettier is active.
- Do not leave generated lint reports unless the project explicitly treats them as artifacts.

## Review Checklist

- [ ] ESLint config path and package scripts were checked.
- [ ] TypeScript file patterns match the project.
- [ ] Browser/node globals match project runtime.
- [ ] TypeScript config compatibility was checked.
- [ ] Typed-linting policy is explicit.
- [ ] Prettier conflict handling is present when Prettier is active.
- [ ] Temporary lint output policy is followed.
