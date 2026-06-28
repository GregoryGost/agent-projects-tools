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
3. Inspect existing SCSS partials, variables, maps, mixins, CSS custom properties, and build setup.
4. Follow project-declared commands.

## Constraints

- Use SCSS for shared abstractions, design-token wiring, reusable mixins, and non-trivial styling needs.
- Prefer existing variables, maps, mixins, and CSS custom properties.
- Keep component-scoped SCSS local and minimal.
- Do not add empty style blocks.
- Keep responsive behavior and theme behavior consistent with the project.
- Add Stylelint only when explicitly enabled by the project profile.
