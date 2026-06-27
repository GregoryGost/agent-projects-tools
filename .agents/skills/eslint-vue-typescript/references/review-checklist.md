# ESLint Vue TypeScript Review Checklist

Load this checklist for ESLint configuration and lint workflow changes in Vue + TypeScript projects.

## Activation

- [ ] `CODEX_PROJECT.md` declares ESLint active.
- [ ] `vue-frontend` and TypeScript profiles are active, or the task directly touches Vue + TypeScript linting.
- [ ] `frontend-code-quality`, `vue-expert`, and `typescript-core` are applied.

## Dependencies

- [ ] `eslint` is present or explicitly planned.
- [ ] `eslint-plugin-vue` is present for Vue SFC linting.
- [ ] TypeScript ESLint tooling or `@vue/eslint-config-typescript` is present for TypeScript linting.
- [ ] `globals` is present when flat config declares browser/node globals.
- [ ] `eslint-config-prettier` is present when Prettier is active.
- [ ] Optional plugins such as `eslint-plugin-unused-imports` are project-declared, not assumed.

## Config

- [ ] Config path is known (`eslint.config.*` or project-specific).
- [ ] `.vue` files are included in lint patterns when SFC linting is active.
- [ ] Ignored paths include generated/build output such as `dist`, `coverage`, or project-specific equivalents.
- [ ] Prettier conflict-disabling config is ordered last when used.
- [ ] Typed linting is not enabled by accident.

## Commands And Artifacts

- [ ] Lint command came from `CODEX_PROJECT.md` or `package.json`.
- [ ] `--fix-dry-run` output is treated as a report, not as an applied fix.
- [ ] Generated lint reports are removed unless the project explicitly keeps them.
