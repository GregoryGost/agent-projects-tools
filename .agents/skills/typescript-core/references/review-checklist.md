# TypeScript Core Review Checklist

Load this file when changing or reviewing TypeScript code.

## Project Context

- [ ] `CODEX_PROJECT.md` was read.
- [ ] Active TypeScript profile is known.
- [ ] Runtime, module format, and `tsconfig*` assumptions were checked when relevant.
- [ ] Validation commands came from the project profile, not from guesswork.

## Code Style And Structure

- [ ] Module responsibility is focused.
- [ ] Exports are intentional and not created only for local convenience.
- [ ] Function names, variable names, and boolean names are descriptive.
- [ ] Constants are local unless they define shared stable contracts.
- [ ] Early returns reduce nesting where appropriate.
- [ ] Side effects remain at explicit boundaries.
- [ ] Import ordering, path aliases, formatter, and linter conventions are preserved.

## Contracts

- [ ] Public exports remain compatible or were intentionally changed.
- [ ] API DTOs, route params, store state, emitted events, and composable returns were checked where affected.
- [ ] Renamed or changed types have all call sites updated.

## Type Safety

- [ ] Untrusted data is `unknown` or validated before use.
- [ ] `any` is absent or justified.
- [ ] Type assertions are narrow and local.
- [ ] Variant state uses discriminated unions where useful.
- [ ] Runtime validation was not replaced by static types.

## Async And Errors

- [ ] Expected failure modes are handled explicitly.
- [ ] Errors are not swallowed silently.
- [ ] Existing error/result conventions are preserved.
- [ ] Retry, timeout, cancellation, and fallback behavior are explicit when relevant.

## Validation

- [ ] Type checking was run when available.
- [ ] Tests were reviewed or updated when public behavior changed.
- [ ] Skipped validation is explained.
