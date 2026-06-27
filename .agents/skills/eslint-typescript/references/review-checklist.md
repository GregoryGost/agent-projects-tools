# ESLint TypeScript Review Checklist

Load this checklist for ESLint configuration and lint workflow changes in TypeScript projects.

## Activation

- [ ] `CODEX_PROJECT.md` declares ESLint active for TypeScript, or the task directly touches TypeScript linting.
- [ ] `eslint-typescript`, `frontend-code-quality`, and `typescript-core` are applied.
- [ ] Vue SFC linting is not assumed unless `eslint-vue` is active.

## Dependencies

- [ ] `eslint` is present or explicitly planned.
- [ ] `@eslint/js` is present when recommended JS config is used.
- [ ] `typescript` and `typescript-eslint` are present for TypeScript linting.
- [ ] `globals` is present when flat config declares browser/node globals.
- [ ] `eslint-config-prettier` is present when Prettier is active.
- [ ] Vue-specific lint dependencies are absent unless Vue overlay is active.

## Config

- [ ] Config path is known: `eslint.config.*` or project-specific.
- [ ] TypeScript file patterns match the project.
- [ ] Ignored paths include generated/build output such as `dist`, `coverage`, or project-specific equivalents.
- [ ] Prettier conflict-disabling config is ordered last when used.
- [ ] Typed linting is not enabled by accident.

## Commands And Artifacts

- [ ] Lint command came from `CODEX_PROJECT.md` or `package.json`.
- [ ] `--fix-dry-run` output is treated as a report, not as an applied fix.
- [ ] Generated lint reports are removed unless the project explicitly keeps them.
