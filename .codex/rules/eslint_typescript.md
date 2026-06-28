# ESLint TypeScript rules

Apply this rule when `CODEX_PROJECT.md` declares ESLint active for a TypeScript project.

This rule covers framework-neutral TypeScript linting. Framework-specific file formats and plugins belong in separate overlay rules.

## Required skills

Use together with:

- `typescript-core`;
- `eslint-typescript`.

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

## Constraints

- Prefer ESLint flat config for new setups unless the target project is intentionally legacy.
- Keep TypeScript linting independent from framework-specific lint overlays.
- Include only file patterns that match the project: `.ts`, `.mts`, `.cts`, `.tsx`, or project-specific patterns.
- Enable typed linting only when the project profile asks for it or the existing config already uses it.
- Put Prettier conflict-resolution config last when used.
- Keep rule exceptions narrow and documented.
- Use the project-declared lint command.
