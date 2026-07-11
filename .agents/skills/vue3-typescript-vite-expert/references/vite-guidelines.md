# Vite Guidelines For Vue 3 + TypeScript + Vite Expert

Use this reference when Vue frontend work touches Vite-specific behavior.

## When To Load

Load this file before changing:

- `vite.config.*`;
- aliases and path resolution;
- Vite plugins;
- dev server settings;
- static asset handling;
- env variables and modes;
- build output, base path, or preview behavior;
- custom SFC block handling.

## Source Of Truth

1. Read `CODEX_PROJECT.md`.
2. Check package manager and project scripts.
3. Inspect `vite.config.*` and related config files.
4. Inspect `tsconfig*` path aliases if Vite aliases are involved.
5. Inspect `package.json` for Vite, `@vitejs/plugin-vue`, plugins, and scripts.

## Guardrails

- Do not assume script names.
- Do not change aliases without checking imports and tests.
- Do not introduce or remove Vite plugins without explicit need and approval when it changes dependencies.
- Do not change env variable names or prefixes without checking all `import.meta.env` consumers.
- Do not hardcode dev server URLs in reusable rules or skills.
- Do not treat Vite as a separate skill in this repository; it is part of the portable Vue frontend baseline.
