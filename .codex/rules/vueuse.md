# VueUse rules

Apply this rule only when `CODEX_PROJECT.md` declares VueUse active for a Vue frontend project or when the task directly touches an existing VueUse integration.

This rule is a VueUse overlay. General Vue component, Composition API, Vite, and TypeScript rules remain in `vue3-typescript-vite-expert` and `typescript-core`.

## Required skills

Use together with:

- `vue3-typescript-vite-expert`;
- `vueuse-expert`.

## Source of truth

Before changing VueUse usage:

1. Read `CODEX_PROJECT.md`.
2. Check the installed VueUse version and existing import patterns.
3. Confirm browser-only APIs, SSR/test behavior, cleanup behavior, reactive return values, and reactive arguments.
4. Load `vueuse-expert/references/patterns-and-review.md` when adding/changing utilities, storage helpers, event listeners, event filters, browser APIs, or lifecycle-sensitive composables.
5. Respect project-specific exclusions such as custom color mode, storage, breakpoint, feature-flag, or browser-feature handling.

## Constraints

- Prefer VueUse for approved browser/reactivity utilities when it improves cleanup, reactivity, browser API ergonomics, or readability.
- Use native APIs when they are clearer and lifecycle/reactivity concerns are irrelevant.
- Guard browser-only utilities when non-browser execution is possible.
- Keep imports explicit, local, and limited to the utilities used.
- Preserve reactivity when destructuring refs returned by VueUse utilities.
- Use reactive arguments when a utility supports them instead of adding unnecessary watch glue.
- Use event filters such as throttle/debounce/pause when high-frequency updates need rate control.
- Add persistence through VueUse storage helpers only when project policy enables persistence.
- Do not store secrets or sensitive data through browser storage helpers.