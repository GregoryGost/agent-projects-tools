# SCSS styling rules

Apply this rule only when `CODEX_PROJECT.md` declares Sass/SCSS active or when the task directly changes SCSS styling.

This rule is independent from Tailwind CSS. Tailwind belongs in a separate overlay.

## Required skills

Use together with:

- `scss-expert`.

## Source of truth

Before changing SCSS:

1. Read `CODEX_PROJECT.md`.
2. Check Sass implementation, global style entry points, component style policy, design token source, formatter, linter, and validation commands.
3. Inspect existing SCSS partials, module entry points, variables, maps, mixins, functions, CSS custom properties, and build setup.
4. Load `scss-expert/references/patterns-and-review.md` when adding or changing shared SCSS modules, token wiring, CSS custom properties, maps, mixins, functions, nesting, component-scoped styles, responsive behavior, or theme behavior.
5. Follow project-declared commands.

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
- Keep SCSS independent from Tailwind unless the project explicitly combines them.
- Add Stylelint only when explicitly enabled by the project profile.
