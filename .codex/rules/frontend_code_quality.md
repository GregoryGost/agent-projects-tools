# Frontend code quality rules

Apply this rule only when `CODEX_PROJECT.md` declares frontend code quality checks as active or when the task directly changes formatting, linting, type-checking, or package scripts for a frontend or TypeScript project.

This rule coordinates ESLint, Prettier, Vue SFC type-checking, and optional style linting. It does not replace framework-specific rules such as `vue_frontend.md`.

## Required skills

Use together with:

- `frontend-code-quality`.

Use overlay skills only when active:

- `eslint-typescript` when ESLint is active for TypeScript code, including TypeScript-only projects.
- `eslint-vue` when ESLint is active for Vue SFCs.
- `prettier-formatting` when Prettier is active.

Do not assume Vue linting is active from TypeScript alone. Do not assume Stylelint is active from Tailwind or SCSS alone. Stylelint requires explicit project profile activation.

## Source of truth

Before changing quality tooling:

1. Read `CODEX_PROJECT.md`.
2. Check package manager, package scripts, dependency policy, TypeScript/JavaScript profile, Vue profile, styling profile, and frontend code quality profile.
3. Inspect `package.json`, lockfile, `eslint.config.*`, Prettier config, `tsconfig*`, `vite.config.*`, and Tailwind/Vue config files when relevant.
4. Compare required tools against installed dependencies.
5. Do not add, remove, or upgrade dependencies unless the user approves it or dependency policy allows it.
6. Do not invent scripts such as `lint`, `format:check`, or `typecheck`; use project-declared scripts.

## Baselines

For TypeScript projects, the portable quality baseline normally includes:

- ESLint flat config for TypeScript files;
- `typescript-eslint` tooling;
- Prettier as a separate formatter when formatting is active;
- `eslint-config-prettier` to avoid formatter/linter conflicts when ESLint and Prettier are both active.

For Vue 3 + TypeScript + Vite projects, add the Vue overlay:

- Vue SFC and template linting through `eslint-plugin-vue`;
- Vue TypeScript ESLint integration through `@vue/eslint-config-typescript` or the project-approved equivalent;
- `vue-tsc` for Vue SFC type-checking;
- Tailwind class sorting only when Tailwind CSS is active.

## Guardrails

- Keep TypeScript ESLint independent from Vue SFC linting so TypeScript-only projects can reuse the core layer.
- Keep formatting and linting responsibilities separate unless the project explicitly uses another workflow.
- Do not run formatter commands that rewrite broad paths unless the project profile or user request permits it.
- Do not commit generated lint reports or temporary formatter artifacts.
- Do not treat `--fix-dry-run` as a real fix; it is a report/check mode.
- Do not make Stylelint required for a Vue project unless the project declares CSS/SCSS style linting.
- Preserve project-specific commands such as `lint-dry-run` when they are the declared lint entry point.

## Review expectations

Review dependency list, package scripts, configs, TypeScript vs Vue linting boundaries, formatter/linter boundaries, Vue SFC type-checking, Tailwind plugin use, and project profile consistency together.
