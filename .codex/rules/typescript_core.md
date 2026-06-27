# TypeScript core rules

Apply this rule when `CODEX_PROJECT.md` declares TypeScript active or when the task directly touches TypeScript code, contracts, declarations, or type-level behavior.

## Required skills

Use together with:

- `typescript-core`.

## Source of truth

Before changing TypeScript code:

1. Read `CODEX_PROJECT.md`.
2. Check the TypeScript profile, runtime, package manager, and validation commands.
3. Inspect `tsconfig*`, package scripts, and existing type conventions when relevant.
4. Follow project-declared formatter, linter, type-checker, and validation commands.
5. Do not invent script names such as `lint`, `typecheck`, or `build`.

## Type safety constraints

- Prefer explicit boundary types for public functions, API contracts, component props, emitted events, exported helpers, and data mappers.
- Use `unknown` for untrusted values until they are narrowed.
- Do not introduce `any` unless the reason is explicit and local.
- Prefer discriminated unions for variant state instead of loosely coupled flags.
- Prefer narrow literal unions or constant maps over broad string types.
- Do not change exported types or public contracts without checking call sites.
- Keep type helpers local unless they are reused or part of a stable shared contract.

## Implementation constraints

- Keep runtime code simple.
- Avoid type-level abstractions that make ordinary code harder to read.
- Avoid duplicate interfaces or parallel models for the same data shape.
- Keep naming descriptive: `isLoading`, `hasError`, `canSubmit`, `selectedUserId`.
- Preserve project natural-language policy for comments and documentation.
- Do not add dependencies for type convenience unless the user approves them or `CODEX_PROJECT.md` allows them.
