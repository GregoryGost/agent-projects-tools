# TypeScript Core Review Checklist

Load this file when changing or reviewing TypeScript code.

## Project Context

- [ ] `CODEX_PROJECT.md` was read.
- [ ] Active TypeScript/JavaScript profile is known.
- [ ] `tsconfig*` assumptions were checked when relevant.
- [ ] Validation commands came from the project profile, not from guesswork.

## Contracts

- [ ] Public exports remain compatible or were intentionally changed.
- [ ] API DTOs, route params, store state, emitted events, and composable returns were checked where affected.
- [ ] Renamed or changed types have all call sites updated.
- [ ] No duplicate model exists for the same data shape unless there is a clear boundary reason.

## Type Safety

- [ ] Untrusted data is `unknown` or validated before use.
- [ ] `any` is absent or justified.
- [ ] Type assertions are narrow and local.
- [ ] Non-null assertions are absent or backed by an invariant.
- [ ] Variant state uses discriminated unions where useful.

## Implementation Quality

- [ ] Generics improve reuse or correctness; they are not ornamental.
- [ ] Helper types are local unless genuinely shared.
- [ ] Runtime validation was not replaced by static types.
- [ ] Naming remains descriptive and project-consistent.

## Validation

- [ ] Type checking was run when available.
- [ ] Tests were reviewed or updated when public behavior changed.
- [ ] Skipped validation is explained with the unavailable command or missing project setup.
