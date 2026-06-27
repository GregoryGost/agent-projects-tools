# TypeScript core rules

Apply this rule only when `CODEX_PROJECT.md` declares a TypeScript/JavaScript active stack profile or when the task directly touches TypeScript contracts, declarations, or type-level behavior.

## Activation

Use with:

- active stack profile: `typescript` or `vue-frontend`;
- active language skill: `typescript-core`.

Do not apply this rule to JavaScript-only projects unless `CODEX_PROJECT.md` explicitly asks for TypeScript migration, type checking, or TypeScript-oriented review.

## Source of truth

Before changing TypeScript code:

1. Read `CODEX_PROJECT.md`.
2. Check the declared TypeScript/JavaScript profile.
3. Inspect the project `tsconfig*` and package scripts when available.
4. Follow project-declared formatter, linter, type-checker, and validation commands.
5. Do not invent script names such as `lint`, `typecheck`, or `build`; use only commands declared by the project.

## Type safety constraints

- Prefer explicit boundary types for public functions, composables, API contracts, component props, emitted events, and data mappers.
- Use `unknown` for untrusted values until they are narrowed.
- Do not introduce `any` unless the project already uses it for a known boundary and the reason is documented.
- Prefer discriminated unions for variant state instead of loosely coupled flags.
- Prefer narrow literal unions or constant maps over broad string types.
- Do not change exported types, DTOs, route params, store state, or public contracts without checking call sites.
- Keep type helpers local unless they are reused or part of a stable shared contract.

## Implementation constraints

- Keep runtime code simple; do not add type-level abstractions that make ordinary code harder to read.
- Avoid duplicate interfaces or parallel models for the same data shape.
- Keep naming descriptive: `isLoading`, `hasError`, `canSubmit`, `selectedUserId`.
- Preserve project natural-language policy for comments and documentation.
- Do not add dependencies for type convenience unless the user approves them or `CODEX_PROJECT.md` allows them.

## Review expectations

When reviewing TypeScript changes, check code and tests together when tests exist. Focus on boundary types, narrowing, public contract changes, dead branches, implicit `any`, unsafe assertions, and compatibility with the active framework rules.
