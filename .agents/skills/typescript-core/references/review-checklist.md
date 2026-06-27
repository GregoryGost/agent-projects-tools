# TypeScript Core Review Checklist

Load this file when changing or reviewing TypeScript code.

## Project Context

- [ ] `CODEX_PROJECT.md` was read.
- [ ] Active TypeScript profile is known.
- [ ] `tsconfig*` assumptions were checked when relevant.
- [ ] Validation commands came from the project profile, not from guesswork.

## Contracts

- [ ] Public exports remain compatible or were intentionally changed.
- [ ] API DTOs, route params, store state, emitted events, and composable returns were checked where affected.
- [ ] Renamed or changed types have all call sites updated.

## Type Safety

- [ ] Untrusted data is `unknown` or validated before use.
- [ ] `any` is absent or justified.
- [ ] Type assertions are narrow and local.
- [ ] Variant state uses discriminated unions where useful.

## Validation

- [ ] Type checking was run when available.
- [ ] Tests were reviewed or updated when public behavior changed.
- [ ] Skipped validation is explained.
