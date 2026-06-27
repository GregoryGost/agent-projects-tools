# ESLint TypeScript rules

Apply this rule when `CODEX_PROJECT.md` declares ESLint active for a TypeScript project, including projects that are not Vue-based.

This rule covers TypeScript linting only. Vue Single-File Component linting is a separate overlay handled by `.codex/rules/eslint_vue.md`.

## Required skills

Use together with:

- `frontend-code-quality` when the project is frontend-oriented;
- `eslint-typescript`.

Use framework overlays only when active:

- `eslint-vue` for Vue SFC linting.

## Source of truth

Before changing TypeScript ESLint setup:

1. Read `CODEX_PROJECT.md`.
2. Check package manager, dependency policy, ESLint config path, lint command, TypeScript profile, and runtime profile.
3. Inspect `package.json`, lockfile, `eslint.config.*`, `tsconfig*`, and existing lint target patterns.
4. Check current versions of ESLint, `@eslint/js`, `typescript`, `typescript-eslint`, `globals`, and Prettier integration when active.

## Expected tooling

A TypeScript ESLint setup usually needs:

- `eslint`;
- `@eslint/js` when the project uses ESLint recommended JavaScript config;
- `globals` when browser or node globals are declared in flat config;
- `typescript`;
- `typescript-eslint`;
- `eslint-config-prettier` when Prettier is active.

Do not require `eslint-plugin-vue` or `@vue/eslint-config-typescript` for TypeScript-only projects.

## Constraints

- Prefer ESLint flat config for new setups unless the target project is intentionally legacy.
- Keep TypeScript linting independent from Vue SFC parsing.
- Include only the file patterns that match the project: `.ts`, `.mts`, `.cts`, `.tsx`, or project-specific patterns.
- Do not enable typed linting unless the project profile explicitly asks for it or the existing config already uses it.
- Put Prettier conflict-disabling config last when used.
- Do not add broad rule suppressions without explaining the reason.
- Do not assume `pnpm lint`; use the project-declared lint command.

## Review expectations

Review lint target patterns, flat config order, globals, TypeScript config compatibility, typed-linting policy, Prettier conflict handling, declared lint scripts, and temporary output artifacts.
