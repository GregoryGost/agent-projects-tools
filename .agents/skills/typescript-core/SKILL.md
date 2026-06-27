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
4. Identify public boundaries affected by the task: exports, DTOs, API clients, component props, events, store state, route params, composable returns, and test helpers.
5. Make the smallest change that preserves existing contracts.
6. Narrow untrusted data before use.
7. Check call sites when a type changes.
8. Run or report the TypeScript validation command declared in `CODEX_PROJECT.md` when possible.

## Type Boundaries

Prefer explicit types at public or integration boundaries and keep local variables inferred when inference is clear.

## Guardrails

- Avoid `any` unless the reason is documented and local.
- Do not replace runtime validation with TypeScript types.
- Keep generic helpers simple and justified by reuse.
- Do not change exported type names or shapes without checking consumers.

## Review Checklist

- [ ] Project profile and TypeScript profile were checked.
- [ ] Public contracts changed only intentionally.
- [ ] Untrusted input is narrowed before use.
- [ ] Tests and call sites were reviewed when a type boundary changed.
- [ ] Project-declared type check command was run or explicitly reported as unavailable.
