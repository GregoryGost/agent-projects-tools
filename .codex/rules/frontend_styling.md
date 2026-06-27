# Frontend styling rules

Apply this rule only when `CODEX_PROJECT.md` declares frontend styling overlays such as Tailwind CSS, Sass/SCSS, or a project design-token system.

## Required skills

Use together with:

- `scss-tailwind-expert` when Tailwind CSS or Sass/SCSS is active.

Do not assume Tailwind, Sass, CSS Modules, CSS-in-JS, or a design system from a Vue project alone. Confirm active styling tools in `CODEX_PROJECT.md` and package files.

## Source of truth

Before changing styles:

1. Read `CODEX_PROJECT.md`.
2. Check active styling tools, versions, config files, global style entry points, and component style conventions.
3. Inspect existing Tailwind usage, Sass partials, CSS variables, tokens, and theme boundaries.
4. Follow project-declared format/lint/build commands.

## Constraints

- Prefer existing design tokens, CSS variables, Tailwind theme values, and shared utilities over ad-hoc colors or spacing.
- Do not add empty Vue `<style>` blocks.
- Use component-scoped styles only when local CSS is actually needed.
- Avoid duplicating the same visual rule across Tailwind classes and SCSS unless the project explicitly uses that pattern.
- Keep responsive behavior mobile-first unless the project declares another breakpoint policy.
- Do not introduce new Tailwind plugins, Sass dependencies, or design-system packages without approval.
- Preserve accessibility-sensitive states such as focus, hover, active, disabled, reduced-motion, and contrast where relevant.

## Review expectations

Review visual consistency, responsive behavior, theme compatibility, style duplication, accessibility states, and build-tool integration together.
