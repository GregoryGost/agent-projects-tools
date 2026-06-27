---
name: vueuse-expert
description: "Use for VueUse work and review: composable utility selection, version-aware API checks, lifecycle cleanup, SSR/browser guards, and project-specific exclusions."
---

# VueUse Expert

Use this skill only when VueUse is active in `CODEX_PROJECT.md` or the task directly touches existing VueUse usage.

Apply `.codex/rules/vueuse.md`, `.codex/rules/vue_frontend.md`, `vue-expert`, and `typescript-core` together with this skill.

For review checks, load `references/review-checklist.md`. For official docs, load `references/official-sources.md`.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm VueUse is active or existing VueUse usage is directly in scope.
3. Check the installed VueUse version and existing import conventions.
4. Verify the specific VueUse utility in official docs for that version when behavior matters.
5. Check browser-only APIs, SSR behavior, cleanup behavior, and reactive return values.
6. Preserve project-specific exclusions such as custom color mode handling.
7. Run or report project-declared validation commands.

## Selection Rules

Use VueUse when it improves:

- lifecycle cleanup;
- reactive integration;
- browser API ergonomics;
- SSR safety;
- readability of a repeated pattern.

Do not use VueUse when a small native API call is clearer and has no lifecycle or reactivity concerns.

## Guardrails

- Do not add VueUse as a new dependency without approval or project policy.
- Do not use browser-only utilities without guards when SSR or non-browser execution is possible.
- Do not change color mode, storage, media query, event listener, or async-state behavior without checking project conventions.
- Do not import whole namespaces when named imports keep the dependency tree-shakeable.

## Review Checklist

- [ ] VueUse is active or already present in touched code.
- [ ] The utility matches the installed version.
- [ ] Cleanup and lifecycle behavior are correct.
- [ ] Browser/SSR assumptions are explicit.
- [ ] Project-specific exclusions were preserved.
- [ ] Validation commands were run or reported as unavailable.
