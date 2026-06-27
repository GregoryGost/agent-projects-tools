---
name: typescript-core
description: "Use for TypeScript code changes and review: type boundaries, narrowing, public contracts, tsconfig awareness, safe refactoring, and framework-neutral TypeScript best practices."
---

# TypeScript Core

Use this skill for TypeScript code changes, TypeScript review, type-level refactoring, contract updates, DTO/model changes, and framework-specific work that depends on TypeScript correctness.

Apply `CODEX_PROJECT.md` and `.codex/rules/typescript_core.md` together with this skill.

For review prompts and anti-patterns, load `references/review-checklist.md`. For official docs, load `references/official-sources.md`.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm that TypeScript is active or that the task explicitly touches TypeScript.
3. Inspect `tsconfig*`, package scripts, and existing type conventions when available.
4. Identify public boundaries affected by the task: exports, props, emits, DTOs, API clients, store state, route params, composable returns, and test helpers.
5. Make the smallest change that preserves existing contracts.
6. Narrow untrusted data before use.
7. Check call sites when a type changes.
8. Run or report the TypeScript validation command declared in `CODEX_PROJECT.md` when possible.

## Type Boundaries

Prefer explicit types at boundaries:

- public functions and exported helpers;
- API request/response models;
- component props and emitted events;
- composable parameters and return values;
- store state and actions;
- route params and query values;
- parser/normalizer outputs.

Keep internal local variables inferred when inference is clear and stable.

## Safe Patterns

- Use `unknown` for untrusted input until narrowed.
- Use discriminated unions for variant state.
- Use type guards for runtime checks.
- Use `as const` for stable literal maps when it improves type narrowing.
- Keep generic helpers simple and justified by reuse.
- Prefer explicit conversion at IO boundaries over spreading unchecked objects through the app.

## Guardrails

- Do not introduce `any` without a documented reason.
- Do not add type-only dependencies without user approval or project policy.
- Do not replace runtime validation with TypeScript types; TypeScript does not validate runtime data.
- Do not change exported type names or shapes without checking all consumers.
- Do not add broad helper types that hide real data shape problems.

## Review Checklist

- [ ] `CODEX_PROJECT.md` and TypeScript profile were checked.
- [ ] Public contracts changed only intentionally.
- [ ] Untrusted input is narrowed before use.
- [ ] `any`, unsafe assertions, and non-null assertions are justified or avoided.
- [ ] Tests and call sites were reviewed when a type boundary changed.
- [ ] Project-declared type check command was run or explicitly reported as unavailable.
