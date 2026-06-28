# Tailwind CSS rules

Apply this rule only when `CODEX_PROJECT.md` declares Tailwind CSS active or when the task directly changes Tailwind configuration, utilities, theme variables, source detection, or class usage.

This rule is standalone by default. If SCSS is also active, Tailwind stylesheet integration belongs in the existing project SCSS entry point.

## Required skills

Use together with:

- `tailwind-expert`.

## Source of truth

Before changing Tailwind usage:

1. Read `CODEX_PROJECT.md`.
2. Check Tailwind version, stylesheet/config path, build integration, source detection policy, and validation commands.
3. If SCSS is active, inspect the SCSS stylesheet entry point that imports Tailwind.
4. Inspect existing utility patterns, theme variables, CSS variables, responsive variants, state variants, and class binding conventions.
5. If Vue is active, inspect affected `.vue` templates, static `class` attributes, `:class` bindings, and component prop-to-class mapping.
6. Load `tailwind-expert/references/patterns-and-review.md` when adding or changing utility patterns, theme variables, source detection, class maps, responsive behavior, state variants, arbitrary values, or Vue class bindings.
7. Follow project-declared commands.

## Constraints

- Prefer existing tokens, theme values, theme variables, and utility patterns.
- Use complete, statically detectable class names.
- Do not build utility class names with string concatenation or interpolation.
- Use mobile-first responsive utilities unless the project declares another policy.
- Keep class lists readable and avoid arbitrary values when project tokens exist.
- Use arbitrary values only for justified one-off values.
- Use class maps for prop-driven variants in component frameworks.
- Do not manage class ordering or formatter setup in this rule.
- Do not add Tailwind plugins, custom variants, or major theme changes without approval or project policy.
- If SCSS is active, keep Tailwind import/directives in the project SCSS entry point.

## Vue usage when active

- Use Tailwind in Vue only when the `vue-frontend` profile and the Tailwind profile are both active, or when an existing Vue SFC already uses Tailwind utilities.
- Prefer static `class` attributes for fixed utility sets.
- Use `:class` arrays or objects for conditional full utility class strings.
- Map prop values to complete utility class strings; do not construct partial class names from props.
- Keep route/state-driven styling readable at the component boundary.
