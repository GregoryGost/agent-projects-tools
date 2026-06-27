# Frontend Code Quality Review Checklist

Load this checklist when changing frontend quality tooling, package scripts, ESLint, Prettier, Vue SFC type checking, or related dev dependencies.

## Project Context

- [ ] `CODEX_PROJECT.md` was read.
- [ ] Package manager and package manager version were checked.
- [ ] Dependency policy was checked before any dependency change.
- [ ] `package.json` scripts were checked.
- [ ] Lockfile presence was checked when dependency changes are proposed.

## Active Profiles

- [ ] TypeScript/JavaScript profile is known.
- [ ] Vue frontend profile is known when Vue files are in scope.
- [ ] Frontend styling profile is known when Tailwind/SCSS is in scope.
- [ ] Frontend code quality profile is known.
- [ ] UI validation profile is known when visible UI behavior is in scope.

## Dependency Matrix

- [ ] ESLint dependencies match the active lint profile.
- [ ] Prettier dependencies match the active formatting profile.
- [ ] `vue-tsc` is present or explicitly unavailable for Vue + TypeScript SFC checks.
- [ ] Tailwind Prettier plugin is active only when Tailwind is active.
- [ ] Stylelint is not assumed unless the project enables it.
- [ ] Runtime dependencies were not mixed into the lint/format dependency list.

## Configs And Commands

- [ ] ESLint config path was checked.
- [ ] Prettier config and ignore files were checked.
- [ ] `tsconfig*` and Vue SFC includes were checked when type checking is involved.
- [ ] Vite and Tailwind config were checked when formatting/linting depends on them.
- [ ] Commands came from `CODEX_PROJECT.md` or `package.json`, not from guesses.

## Artifacts

- [ ] Generated lint reports or temporary formatter artifacts are not left behind unless explicitly required.
- [ ] Broad `--write` formatting was not run unless permitted.
- [ ] Any skipped check is explained by missing command, missing service, or task scope.
