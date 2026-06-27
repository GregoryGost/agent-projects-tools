# ESLint Vue Review Checklist

Load this checklist for Vue SFC ESLint configuration and Vue lint workflow changes.

## Activation

- [ ] `CODEX_PROJECT.md` declares Vue frontend and ESLint active, or the task directly touches Vue linting.
- [ ] `eslint-typescript`, `vue-expert`, and `typescript-core` are applied.
- [ ] This overlay is not applied to TypeScript-only projects.

## Dependencies

- [ ] TypeScript ESLint baseline is present.
- [ ] `eslint-plugin-vue` is present for Vue SFC linting.
- [ ] `@vue/eslint-config-typescript` is present when Vue TypeScript config wrappers are used.
- [ ] `eslint-config-prettier` is present when Prettier is active.

## Config

- [ ] Config path is known: `eslint.config.*` or project-specific.
- [ ] `.vue` files are included in lint patterns.
- [ ] Vue template linting remains enabled.
- [ ] Ignored paths include generated/build output such as `dist`, `coverage`, or project-specific equivalents.
- [ ] Prettier conflict-disabling config is ordered last when used.
- [ ] Typed linting is not enabled by accident.

## Commands And Artifacts

- [ ] Lint command came from `CODEX_PROJECT.md` or `package.json`.
- [ ] `--fix-dry-run` output is treated as a report, not as an applied fix.
- [ ] Generated lint reports are removed unless the project explicitly keeps them.
