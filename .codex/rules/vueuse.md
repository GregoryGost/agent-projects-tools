# VueUse rules

Apply this rule only when `CODEX_PROJECT.md` declares VueUse as active for a Vue frontend project or when the task directly touches an existing VueUse integration.

## Required skills

Use together with:

- `vue-expert`;
- `vueuse-expert`.

Do not introduce VueUse just because a helper exists. New VueUse usage must match project dependency policy and active package versions.

## Source of truth

Before changing VueUse usage:

1. Read `CODEX_PROJECT.md`.
2. Check the installed VueUse version and existing import patterns.
3. Confirm browser-only APIs, SSR behavior, cleanup behavior, and reactive return values.
4. Respect project-specific exclusions such as custom color mode management.

## Constraints

- Prefer VueUse for well-known browser/reactivity utilities already approved by the project.
- Do not wrap a simple one-line native API in VueUse unless it improves cleanup, SSR safety, reactivity, or readability.
- Do not use VueUse utilities that require unavailable browser APIs without guards.
- Do not change color mode, storage, event listener, media query, or async-state behavior without checking existing project conventions.
- Keep imports tree-shakeable and local to the modules that use them.

## Review expectations

Review lifecycle cleanup, SSR/browser guards, dependency policy, existing project exclusions, and affected reactive consumers together.
