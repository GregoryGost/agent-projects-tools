# ESLint Vue TypeScript rules

Apply this rule only when `CODEX_PROJECT.md` declares ESLint active for a Vue + TypeScript project or when the task directly changes ESLint configuration for such a project.

## Required skills

Use together with:

- `frontend-code-quality`;
- `eslint-vue-typescript`.

Use with `vue-expert` and `typescript-core` when linting Vue application code.

## Source of truth

Before changing ESLint setup:

1. Read `CODEX_PROJECT.md`.
2. Check package manager, dependency policy, ESLint config path, lint command, and active framework/language profiles.
3. Inspect `package.json`, lockfile, `eslint.config.*`, `tsconfig*`, and Vue/Vite config files when relevant.
4. Check current versions of ESLint, Vue ESLint tooling, TypeScript tooling, and Prettier integration.

## Expected Vue + TypeScript tooling

A Vue + TypeScript ESLint setup usually needs:

- `eslint`;
- `@eslint/js` when the project uses ESLint recommended JavaScript config;
- `globals` when browser or node globals are declared in flat config;
- `typescript`;
- `typescript-eslint` or Vue-provided TypeScript ESLint config wrappers;
- `eslint-plugin-vue` for Vue SFC and template linting;
- `@vue/eslint-config-typescript` when the project follows Vue 3 + TypeScript ESLint config patterns;
- `eslint-config-prettier` or a Vue Prettier config wrapper when Prettier is active.

## Constraints

- Prefer ESLint flat config for new setups unless the target project is intentionally legacy.
- Include `.vue` files in the ESLint target patterns when Vue SFCs are linted.
- Do not disable Vue template parsing by replacing `vue-eslint-parser` incorrectly.
- Put Prettier conflict-disabling config last when used.
- Do not enable typed linting unless the project profile explicitly asks for it or the existing config already uses it.
- Do not add broad rule suppressions or generated ignore patterns without explaining the reason.
- Do not assume `pnpm lint`; use the project-declared lint command.

## Review expectations

Review lint target patterns, flat config order, globals, parser behavior for Vue files, TypeScript config compatibility, Prettier conflict handling, declared lint scripts, and temporary output artifacts.
