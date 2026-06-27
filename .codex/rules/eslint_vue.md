# ESLint Vue rules

Apply this rule only when `CODEX_PROJECT.md` declares ESLint active for a Vue frontend project or when the task directly changes Vue SFC linting configuration.

This is an overlay over TypeScript ESLint. Do not apply it to TypeScript-only projects without Vue.

## Required skills

Use together with:

- `eslint-typescript` for the TypeScript linting baseline;
- `eslint-vue` for Vue SFC and template linting.

Use with `vue-expert` when linting Vue application code.

## Source of truth

Before changing Vue ESLint setup:

1. Read `CODEX_PROJECT.md`.
2. Check package manager, dependency policy, ESLint config path, lint command, Vue profile, and TypeScript profile.
3. Inspect `package.json`, lockfile, `eslint.config.*`, `tsconfig*`, and Vue/Vite config files when relevant.
4. Check current versions of `eslint-plugin-vue`, `@vue/eslint-config-typescript`, Vue, TypeScript, and Prettier integration when active.

## Expected tooling

A Vue SFC ESLint overlay usually needs:

- `eslint-plugin-vue` for Vue SFC and template linting;
- `@vue/eslint-config-typescript` when the project follows Vue 3 + TypeScript ESLint config patterns;
- the TypeScript ESLint baseline from `.codex/rules/eslint_typescript.md`;
- `eslint-config-prettier` when Prettier is active.

## Constraints

- Include `.vue` files in lint target patterns when Vue SFC linting is active.
- Do not disable Vue template parsing by replacing Vue parser behavior incorrectly.
- Keep Vue SFC linting separate from TypeScript-only linting.
- Do not require Vue lint dependencies for packages that do not contain Vue files.
- Put Prettier conflict-disabling config last when used.
- Do not enable typed linting unless the project explicitly uses or requests it.
- Do not leave generated lint reports unless the project explicitly treats them as artifacts.

## Review expectations

Review Vue file patterns, template linting, TypeScript integration for `.vue` files, Prettier conflict handling, declared lint scripts, and temporary output artifact policy.
