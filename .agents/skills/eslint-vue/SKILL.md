---
name: eslint-vue
description: "Use for Vue SFC ESLint overlay work: eslint-plugin-vue, @vue/eslint-config-typescript, .vue file patterns, template linting, and Vue + TypeScript lint integration."
---

# ESLint Vue

Use this skill only when ESLint is active for a Vue frontend project or when the task directly changes Vue SFC linting configuration.

Apply `CODEX_PROJECT.md`, `.codex/rules/eslint_typescript.md`, `.codex/rules/eslint_vue.md`, `eslint-typescript`, `vue-expert`, and `typescript-core` together with this skill.

For review checks, load `references/review-checklist.md`. For official docs, load `references/official-sources.md`.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm Vue frontend and ESLint are active.
3. Inspect `package.json`, lockfile, `eslint.config.*`, `tsconfig*`, `vite.config.*`, and existing lint patterns.
4. Check whether Prettier is active and whether conflict-disabling config is present.
5. Include `.vue` lint target patterns only for Vue packages/projects.
6. Preserve project-specific lint commands such as `lint-dry-run` when declared.
7. Do not add dependencies or change package scripts without approval or dependency policy support.

## Expected Patterns

For Vue SFC linting, expect some combination of:

- TypeScript ESLint baseline from `eslint-typescript`;
- `eslint-plugin-vue`;
- `@vue/eslint-config-typescript` when Vue 3 + TypeScript config wrappers are used;
- `eslint-config-prettier` when Prettier is active.

Project examples may use Vue-provided wrappers such as `defineConfigWithVueTs` and `vueTsConfigs` instead of direct `typescript-eslint` config usage.

## Guardrails

- Do not apply this skill to TypeScript-only projects.
- Do not require Vue lint dependencies for packages that do not contain Vue files.
- Do not disable Vue template parsing by replacing Vue parser behavior incorrectly.
- Do not enable typed linting unless the project explicitly uses or requests it.
- Do not remove Prettier conflict-disabling config when Prettier is active.
- Do not leave generated lint reports unless the project explicitly treats them as artifacts.

## Review Checklist

- [ ] Vue frontend and ESLint are active.
- [ ] TypeScript ESLint baseline was applied first.
- [ ] `.vue` file patterns are included when SFC linting is active.
- [ ] Vue template linting remains enabled.
- [ ] Vue TypeScript config is compatible with project `tsconfig*`.
- [ ] Prettier conflict handling is present when Prettier is active.
- [ ] Temporary lint output policy is followed.
