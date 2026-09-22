---
name: csharp-core
description: "Use for framework-neutral C# implementation, language/version compatibility, contracts, async/resource ownership, refactoring, and code review."
---

# C# Core

Use this skill for C# implementation, refactoring, API/contract changes, async and concurrency review, collection choices, resource ownership, exception handling, and framework-specific work that depends on C# correctness.

Apply `CODEX_PROJECT.md` and `.codex/rules/csharp_core.md` together with this skill.

## Required Dependencies

Required rules:

- `.codex/rules/csharp_core.md`.

The mutual `csharp_core.md ↔ csharp-core` pair is intentional; both artifacts must be active independently through the project profile.

Load references when needed:

- `references/patterns-and-review.md` for concrete good/bad patterns.
- `references/review-checklist.md` for a detailed review pass.
- `references/official-sources.md` for Microsoft language/runtime sources and Unity source boundaries.

## Workflow

1. Read `CODEX_PROJECT.md` when present.
2. Establish the effective C# language version and runtime/API surface from project evidence.
3. Inspect build/project metadata, nullable configuration, analyzer settings, source layout, public contracts, and project validation commands.
4. When a framework or engine is active, load its overlay before selecting syntax or runtime behavior.
5. Identify ownership and lifetime boundaries for state, resources, callbacks, tasks, and events.
6. Make the smallest change that preserves existing behavior and contracts.
7. Review call sites for changed public types/signatures.
8. Run or report project-declared compile/static-analysis/test validation.

## Design baseline

- Prefer clear domain-oriented types and APIs.
- Keep visibility narrow and exports/public surface intentional.
- Prefer composition for reuse; use inheritance for actual subtype/framework relationships.
- Use interfaces where they model a real boundary or substitutability.
- Keep mutable global state exceptional and lifecycle-owned.
- Keep validation, parsing, domain behavior, and infrastructure separate when the existing architecture benefits from those boundaries.

## Async and resources

- Avoid sync-over-async.
- Observe failures from all started async work.
- Propagate cancellation when useful.
- Dispose owned resources and do not dispose borrowed resources.
- Treat thread affinity and callback lifecycle as framework-specific when an overlay defines them.

## Compatibility guardrails

- Do not use language features newer than the project supports.
- Do not infer runtime API availability from language syntax alone.
- Do not infer framework compatibility from a generated IDE project file.
- Do not change reflection/serialization/framework callback contracts as a cleanup side effect.

## Review checklist

- [ ] Language/runtime constraints were established.
- [ ] Public and framework contracts were checked.
- [ ] Ownership and cleanup are explicit.
- [ ] Async failures/cancellation are handled intentionally.
- [ ] No broad exception swallowing or unsupported syntax was added.
- [ ] Framework-specific overlay requirements were applied.
