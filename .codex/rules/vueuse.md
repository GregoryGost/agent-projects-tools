# VueUse rules

Apply this rule only when `CODEX_PROJECT.md` declares VueUse active for a Vue frontend project or when the task directly touches an existing VueUse integration.

## Required skills

Use together with:

- `vue-expert`;
- `vueuse-expert`.

## Source of truth

Before changing VueUse usage:

1. Read `CODEX_PROJECT.md`.
2. Check the installed VueUse version and existing import patterns.
3. Confirm browser-only APIs, cleanup behavior, and reactive return values.
4. Respect project-specific exclusions such as custom color mode management.

## Constraints

- Prefer VueUse for approved browser/reactivity utilities when it improves cleanup, reactivity, or readability.
- Use native APIs when they are clearer and lifecycle concerns are irrelevant.
- Guard browser-only utilities when non-browser execution is possible.
- Keep imports local and tree-shakeable.
