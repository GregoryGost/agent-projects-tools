# TypeScript Patterns And Style

Use this reference when a TypeScript task needs framework-neutral code structure, naming, and implementation guidance.

## Module Structure

- Keep each module focused on one responsibility.
- Prefer a small number of intentional exports over exporting every helper.
- Keep private helpers local to the module that uses them.
- Split parsing, validation, mapping, and business logic when doing so matches the existing project structure.
- Keep side effects at explicit boundaries: IO, storage, network, timers, logging, framework adapters.

## Naming

- Use descriptive names that express domain meaning or state.
- Prefer boolean names with state/capability prefixes, for example `isLoading`, `hasError`, `canSubmit`, `shouldRetry`.
- Use `Id` suffixes consistently for identifiers when the project follows that style.
- Avoid vague names such as `data`, `item`, `value`, or `result` when the domain shape is known.
- Keep constant names consistent with project convention. Do not force uppercase constants unless the project already uses that style for the same category.

## Functions

- Prefer small functions with explicit inputs and outputs.
- Prefer early returns for invalid or completed states when they reduce nesting.
- Avoid boolean flag parameters when named options or discriminated unions make intent clearer.
- Keep pure transformations separate from side effects when practical.
- Keep generic helpers simple and justified by reuse.

## Types

- Use explicit types at public and integration boundaries.
- Let local values be inferred when inference is obvious.
- Use `unknown` for untrusted external input until narrowed.
- Prefer discriminated unions for variant state.
- Prefer literal unions or constant maps over broad string types.
- Avoid duplicate models for the same data shape unless they represent real boundaries.

## Imports And Exports

- Preserve project import ordering and path alias conventions.
- Prefer type-only imports when the project/compiler setup expects them.
- Avoid barrel exports unless the project already uses them for stable public APIs.
- Do not change exported names or public type shapes without checking call sites.

## Async And Error Handling

- Await asynchronous work where the result is needed.
- Handle expected failures explicitly.
- Preserve project conventions for exceptions, result objects, nullable returns, or error objects.
- Do not swallow errors silently.
- Keep timeout, retry, cancellation, and fallback behavior explicit when relevant.

## Comments And Documentation

- Preserve project natural-language policy.
- Use comments to explain non-obvious decisions, invariants, and integration constraints.
- Do not add comments that repeat obvious code.
- Keep JSDoc/TSDoc style consistent with the existing project.

## Formatting

- Formatting is owned by the project formatter and linter.
- Do not hardcode indentation, semicolons, quote style, or trailing comma policy in this skill.
- Use project-declared formatting and linting commands.
