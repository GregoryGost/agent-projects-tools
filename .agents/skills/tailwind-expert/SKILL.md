---
name: tailwind-expert
description: "Use for Tailwind CSS work: utility classes, responsive variants, state variants, theme variables, source detection, Vue class binding, stylesheet integration, version awareness, and Tailwind review."
---

# Tailwind Expert

Use this skill when Tailwind CSS is active in `CODEX_PROJECT.md` or when the task directly touches Tailwind utilities, configuration, theme variables, source detection, or class usage.

This skill is standalone by default. Tailwind and SCSS may coexist, but their stylesheet integration must follow the declared Tailwind version and the project's actual build pipeline.

Apply `.codex/rules/tailwind_css.md` together with this skill.

Load references when needed:

- `references/patterns-and-review.md` for Tailwind CSS good/bad patterns and review prompts.
- `references/official-sources.md` for official Tailwind CSS and Vue class binding references.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm Tailwind version, stylesheet/config path, build integration, source detection policy, and validation commands.
3. If SCSS is active, inspect both Tailwind and SCSS entry points and the build steps that process them. Do not assume that Tailwind is imported through SCSS.
4. Inspect existing class usage, theme variables, CSS variables, responsive variants, state variants, and utility patterns.
5. If Vue is active, inspect affected `.vue` templates, `class` attributes, and `:class` bindings.
6. Compare the intended change against `references/patterns-and-review.md`.
7. Use existing project conventions before adding new patterns.
8. Run or report declared build/UI validation commands when applicable.

## Guardrails

- Prefer direct utility classes for simple local styling.
- Use complete, statically detectable class names.
- Do not build utility class names with string concatenation or interpolation.
- Reuse theme variables, theme values, and existing utility patterns before adding new tokens.
- Keep responsive behavior mobile-first unless the project says otherwise.
- Preserve focus, hover, active, disabled, reduced-motion, contrast, and dark-mode states where relevant.
- Use arbitrary values only for justified one-off values.
- Leave class ordering and formatter plugin policy to the project formatting rules.
- For Tailwind CSS v4, use a plain CSS entry point processed directly by the project-declared Tailwind integration. Do not place `@import "tailwindcss"`, `@theme`, or other Tailwind v4 directives in an SCSS file, and do not route Tailwind v4 through Sass, Less, or Stylus.
- When Tailwind CSS v4 and SCSS are both active, keep their source entry points and preprocessing responsibilities separate. Combine their generated styles only through the project-declared application imports or bundler configuration.
- For Tailwind CSS v3 or a project-specific legacy pipeline, preserve the existing PostCSS, Tailwind, and Sass processing order unless the task explicitly changes it.

## Review Checklist

- [ ] Tailwind version and integration were checked.
- [ ] Tailwind stylesheet integration matches the declared version and actual build pipeline.
- [ ] Tailwind CSS v4 is not routed through Sass, Less, or Stylus.
- [ ] Tailwind and SCSS entry points remain separate for v4 when both are active.
- [ ] Utility classes are complete and statically detectable.
- [ ] Utility classes follow existing project patterns.
- [ ] Responsive behavior remains coherent.
- [ ] Theme variables and accessibility states were considered.
- [ ] Vue class bindings are static-map based when Vue is active.
- [ ] Formatting changes were left to the project formatting rules.
