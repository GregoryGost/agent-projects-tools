---
name: scss-tailwind-expert
description: "Use for frontend styling work with Tailwind CSS and Sass/SCSS: design tokens, utility classes, scoped styles, responsive behavior, theme compatibility, and style review."
---

# SCSS Tailwind Expert

Use this skill when `CODEX_PROJECT.md` declares Tailwind CSS, Sass/SCSS, or a combined Tailwind + SCSS styling profile as active, or when the task directly touches styling in a project that uses them.

Apply `.codex/rules/frontend_styling.md` and the active framework skill, such as `vue-expert`, together with this skill.

For review checks, load `references/review-checklist.md`. For official docs, load `references/official-sources.md`.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm active styling tools, versions, config files, and style entry points.
3. Inspect existing Tailwind classes, Sass partials, CSS variables, tokens, and component-local style conventions.
4. Choose the smallest styling layer that solves the task: utility classes, component scoped styles, shared SCSS, tokens, or theme config.
5. Preserve responsive and theme behavior.
6. Run or report project-declared formatting, linting, build, or UI validation commands.

## Tailwind Usage

- Prefer direct utility classes for local layout, spacing, typography, state, and responsive behavior when that matches project style.
- Reuse existing tokens, theme variables, and utility patterns.
- Keep class lists readable; extract components or shared styles only when repetition becomes meaningful.
- Do not add Tailwind plugins or major config changes without approval or project policy.
- Check the active Tailwind version before using version-specific syntax.

## Sass/SCSS Usage

- Use SCSS for shared abstractions, design-token wiring, reusable mixins, and cases where utilities are insufficient.
- Do not duplicate the same rule in Tailwind classes and SCSS.
- Keep component-scoped SCSS local and minimal.
- Prefer existing partials, variables, maps, mixins, and CSS custom properties.
- Do not add an empty Vue style block.

## Responsive And Theme Behavior

- Use mobile-first responsive behavior unless the project declares another policy.
- Preserve dark/light theme behavior when present.
- Preserve accessibility-sensitive states: focus, hover, active, disabled, reduced motion, and contrast.
- Check generated UI through Playwright MCP when active and the task affects visible behavior.

## Review Checklist

- [ ] Active styling tools and versions were checked.
- [ ] Styling layer is appropriate: utility class, scoped style, shared SCSS, token, or config.
- [ ] Responsive behavior remains coherent.
- [ ] Theme and accessibility states were preserved.
- [ ] No duplicate or conflicting styles were introduced.
- [ ] Validation commands or UI checks were run or reported as unavailable.
