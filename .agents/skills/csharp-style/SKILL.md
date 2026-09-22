---
name: csharp-style
description: "Use for C# .editorconfig policy, naming, formatting, IDE code-style rules, scoped cleanup, and Unity-safe style changes."
---

# C# Style

Use this skill when C# formatting, naming, `.editorconfig`, IDE style diagnostics, style review, or a style-sensitive C# change is in scope.

Apply `csharp-core`, `.codex/rules/csharp_core.md`, `.codex/rules/csharp_style.md`, and `CODEX_PROJECT.md` together.

## Required Dependencies

Required skills:

- `csharp-core`.

Required rules:

- `.codex/rules/csharp_core.md`;
- `.codex/rules/csharp_style.md`.

The mutual `csharp_style.md ↔ csharp-style` pair is intentional; both artifacts must be active independently through the project profile.

Load references when needed:

- `references/editorconfig-baseline.md` for the portable default configuration.
- `references/patterns-and-review.md` for good/bad examples and Unity-safe renames.
- `references/review-checklist.md` for final review.
- `references/official-sources.md` for Microsoft code-style documentation.

## Workflow

1. Inspect all applicable `.editorconfig` files from repository root to the changed file.
2. Read style policy in `CODEX_PROJECT.md`.
3. Inspect established source conventions where configuration is silent.
4. If Unity is active, identify serialized/reflected/framework-discovered members before renaming anything.
5. Apply the smallest formatting/naming change required.
6. Do not increase diagnostic severity or run repository-wide formatting without explicit policy/request.
7. Run the project-declared formatter/analyzer/build validation where available.

## Portable baseline

Use only for a new/unconfigured project:

- 4 spaces, no tabs for C# indentation;
- braces on new lines for type/member/control blocks;
- PascalCase types and public/protected members;
- `I`-prefixed interfaces;
- camelCase parameters and locals;
- `_camelCase` private/internal instance fields;
- descriptive boolean names;
- explicit project policy for private static field prefixes;
- formatting diagnostics separated from semantic/code-quality diagnostics.

## Unity coordination

When Unity is active:

- preserve serialized data across field renames;
- preserve Unity message/callback method names;
- do not make Unity-generated project files the durable formatting source;
- do not assume IDE style diagnostics are identical to Unity compiler/analyzer enforcement;
- avoid mass style churn in generated assets or packages.

## Guardrails

- No style-only public API break.
- No style-only serialized-field data loss.
- No unrelated repository-wide formatting.
- No automatic severity escalation.
- No blind `dotnet format` assumption in Unity; use only project-declared tooling.

## Review checklist

- [ ] Applicable `.editorconfig` hierarchy was inspected.
- [ ] Project conventions win over portable defaults.
- [ ] Unity serialization/framework contracts were preserved when active.
- [ ] Severity and format scope are intentional.
- [ ] Generated/vendored files were excluded unless explicitly owned.
