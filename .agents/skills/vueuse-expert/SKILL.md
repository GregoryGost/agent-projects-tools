---
name: vueuse-expert
description: "Use for VueUse work and review: composable utility selection, version-aware API checks, lifecycle cleanup, browser guards, and project-specific exclusions."
---

# VueUse Expert

Use this skill only when VueUse is active in `CODEX_PROJECT.md` or the task directly touches existing VueUse usage.

Apply `.codex/rules/vueuse.md`, `vue-expert`, and `typescript-core` together with this skill.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm VueUse is active or existing VueUse usage is directly in scope.
3. Check the installed VueUse version and import conventions.
4. Verify the specific utility in official docs when behavior matters.
5. Check browser-only APIs, cleanup behavior, and reactive return values.
6. Preserve project-specific exclusions such as custom color mode handling.

## Selection Rules

Use VueUse when it improves lifecycle cleanup, reactive integration, browser API ergonomics, or readability of a repeated pattern.

## Review Checklist

- [ ] VueUse is active or already present in touched code.
- [ ] The utility matches the installed version.
- [ ] Cleanup and lifecycle behavior are correct.
- [ ] Browser assumptions are explicit.
- [ ] Project-specific exclusions were preserved.
