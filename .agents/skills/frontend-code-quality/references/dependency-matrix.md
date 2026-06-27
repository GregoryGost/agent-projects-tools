# Frontend Code Quality Dependency Matrix

This matrix describes dev dependencies for active frontend quality profiles. It is not a command to install everything at once.

Always read `CODEX_PROJECT.md`, `package.json`, lockfiles, and dependency policy before recommending or adding dependencies.

## Vue 3 + TypeScript + Vite Baseline

Use when the project activates `vue-frontend`, `typescript-core`, `frontend-code-quality`, ESLint, Prettier, and Vue SFC type checking.

| Purpose | Dev dependencies | Notes |
| --- | --- | --- |
| ESLint core | `eslint`, `@eslint/js`, `globals` | `@eslint/js` is needed when using ESLint recommended JS config. `globals` is used for browser/node globals in flat config. |
| TypeScript linting | `typescript`, `typescript-eslint` | Use directly or through Vue-provided wrappers, depending on project setup. |
| Vue SFC linting | `eslint-plugin-vue`, `@vue/eslint-config-typescript` | Use for Vue SFC and Vue + TypeScript linting. |
| Formatting | `prettier`, `eslint-config-prettier` | Keep Prettier separate from ESLint; use config-prettier to disable conflicting ESLint rules. |
| Vue SFC type checking | `vue-tsc`, `@vue/tsconfig` | `vue-tsc` is the command-line type checker for Vue SFCs. |
| Tailwind class sorting | `prettier-plugin-tailwindcss` | Use only when Tailwind CSS is active. |

## Observed In `gost-rdpr-ui`

The `gost-rdpr-ui` reference project uses these relevant quality dependencies:

- `eslint`
- `@vue/eslint-config-typescript`
- `eslint-config-prettier`
- `eslint-plugin-unused-imports`
- `eslint-plugin-vue`
- `globals`
- `prettier`
- `prettier-plugin-tailwindcss`
- `typescript`
- `vue-tsc`
- `@vue/tsconfig`

It also uses Tailwind/Vite-related build dependencies that affect formatting/config integration but are not lint/format tools by themselves:

- `@tailwindcss/vite`
- `tailwindcss`
- `sass`
- `vite`
- `@vitejs/plugin-vue`

Unit and component test dependencies such as `vitest`, `@vue/test-utils`, `jsdom`, `happy-dom`, and `@pinia/testing` belong to the frontend testing profile, not to this code quality profile.

## Optional Or Project-Specific

| Purpose | Dev dependencies | When to use |
| --- | --- | --- |
| Unused import cleanup | `eslint-plugin-unused-imports` | Only when the project already uses it or explicitly wants this rule set. |
| Tailwind v4 PostCSS integration | `@tailwindcss/postcss`, `postcss`, `autoprefixer` | Build/styling integration, not a lint/format baseline. |
| Stylelint | `stylelint`, stylelint shareable configs | Only when `CODEX_PROJECT.md` explicitly enables CSS/SCSS style linting. Do not infer it from SCSS alone. |
| Playwright test linting | `eslint-plugin-playwright` | Only when the project has Playwright test files. Not needed for Playwright MCP-only UI checks. |

## Excluded From Lint/Format Baseline

Do not list runtime/framework dependencies as lint/format dependencies:

- `vue`
- `vue-router`
- `pinia`
- `@vueuse/core`

Do not list build tools as lint/format dependencies unless the profile specifically concerns build integration:

- `vite`
- `@vitejs/plugin-vue`
- `tailwindcss`
- `sass`

They can still be relevant context for selecting ESLint, Prettier, Tailwind class sorting, and type-checking workflows.
