# SCSS styling rules

Apply this rule only when `CODEX_PROJECT.md` declares Sass/SCSS active or when the task directly changes SCSS styling.

This rule is standalone and does not require another styling overlay to be present.

## Required skills

Use together with:

- `scss-expert`.

## Source of truth

Before changing SCSS:

1. Read `CODEX_PROJECT.md`.
2. Check Sass implementation, global style entry points, component style policy, design token source, formatter, linter, and validation commands.
3. Inspect existing SCSS partials, module entry points, variables, maps, mixins, functions, CSS custom properties, and build setup.
4. If Vue is active, inspect affected `.vue` style blocks, SFC style scope, and the project policy for local vs shared styles.
5. Load `scss-expert/references/patterns-and-review.md` when adding or changing shared SCSS modules, token wiring, CSS custom properties, maps, mixins, functions, nesting, component-scoped styles, responsive behavior, theme behavior, or Vue SFC style blocks.
6. Follow project-declared commands.

## Constraints

- Use SCSS for shared abstractions, design-token wiring, reusable mixins, maps, and non-trivial styling needs.
- Prefer existing variables, maps, mixins, functions, and CSS custom properties.
- Prefer `@use` and `@forward` for new shared SCSS modules.
- Do not add new Sass `@import` unless the project is intentionally pinned to a legacy Sass implementation that cannot use modules.
- Use CSS custom properties for runtime theme values and Sass variables/maps for compile-time structure.
- Interpolate Sass values when writing them into CSS custom properties.
- Keep component-scoped SCSS local and minimal.
- Keep nesting shallow and intentional.
- Do not add empty style blocks.
- Keep responsive behavior and theme behavior consistent with the project.
- In Vue SFCs, use `lang="scss"` on style blocks according to project policy.
- Add Stylelint only when explicitly enabled by the project profile.

## Vue usage when active

- Use SCSS in Vue only when the `vue3-typescript-vite` profile and the SCSS profile are both active, or when an existing Vue SFC already uses SCSS.
- Put local component-only styles in `.vue` style blocks.
- Use `scoped` only when component-local scoping is intended.
- Keep reusable tokens, mixins, functions, maps, and reset/base styles in project-declared shared SCSS modules.
- Use Vue SFC `v-bind()` in CSS only for dynamic component state that must drive CSS values.
- Use CSS Modules only when the project convention already uses them or the task explicitly asks for module-scoped class names.
