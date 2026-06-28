---
name: vueuse-expert
description: "Use for VueUse work and review: composable utility selection, version-aware API checks, lifecycle cleanup, reactive arguments, event filters, storage helpers, browser/SSR guards, and project-specific exclusions."
---

# VueUse Expert

Use this skill only when VueUse is active in `CODEX_PROJECT.md` or the task directly touches existing VueUse usage.

Apply `.codex/rules/vueuse.md`, `vue-expert`, and `typescript-core` together with this skill.

Load references when needed:

- `references/patterns-and-review.md` for VueUse good/bad patterns and review prompts.
- `references/official-sources.md` for official VueUse references.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm VueUse is active or existing VueUse usage is directly in scope.
3. Check the installed VueUse version and import conventions.
4. Verify the specific utility in official docs when behavior, options, SSR behavior, or version support matters.
5. Compare the intended change against `references/patterns-and-review.md`.
6. Check browser-only APIs, SSR/test behavior, cleanup behavior, reactive return values, and reactive arguments.
7. Preserve project-specific exclusions such as custom color mode, storage, breakpoint, or feature-flag handling.

## Selection Rules

Use VueUse when it improves lifecycle cleanup, reactive integration, browser API ergonomics, or readability of a repeated pattern.

Prefer native APIs when the native implementation is simpler, clearer, and does not need Vue lifecycle cleanup or reactive integration.

## Review Checklist

- [ ] VueUse is active or already present in touched code.
- [ ] The utility matches the installed version and package/import policy.
- [ ] VueUse adds cleanup, reactivity, browser API ergonomics, or repeated-pattern readability.
- [ ] Native APIs were preferred where VueUse adds no value.
- [ ] Cleanup and lifecycle behavior are correct.
- [ ] Reactive return values and reactive arguments preserve reactivity.
- [ ] Browser/SSR/test assumptions are explicit.
- [ ] Storage, permissions, and browser-feature fallbacks follow project policy.
- [ ] Project-specific exclusions were preserved.
