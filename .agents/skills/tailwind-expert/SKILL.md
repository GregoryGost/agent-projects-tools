---
name: tailwind-expert
description: "Use for standalone Tailwind CSS work: utility classes, responsive variants, state variants, theme variables, source detection, Vue class binding, class sorting, integration/version awareness, and Tailwind review."
---

# Tailwind Expert

Use this skill when Tailwind CSS is active in `CODEX_PROJECT.md` or when the task directly touches Tailwind utilities, configuration, theme variables, source detection, or class sorting.

This skill is standalone and does not require another styling overlay to be present.

Apply `.codex/rules/tailwind_css.md` together with this skill.

Load references when needed:

- `references/patterns-and-review.md` for Tailwind CSS good/bad patterns and review prompts.
- `references/official-sources.md` for official Tailwind CSS and class sorting references.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm Tailwind version, stylesheet/config path, build integration, source detection policy, and class sorting policy.
3. Inspect existing class usage, theme variables, CSS variables, responsive variants, state variants, and utility patterns.
4. If Vue is active, inspect affected `.vue` templates, `class` attributes, and `:class` bindings.
5. Compare the intended change against `references/patterns-and-review.md`.
6. Use existing project conventions before adding new patterns.
7. Run or report declared format/build/UI validation commands when applicable.

## Guardrails

- Prefer direct utility classes for simple local styling.
- Use complete, statically detectable class names.
- Do not build utility class names with string concatenation or interpolation.
- Reuse theme variables, theme values, and existing utility patterns before adding new tokens.
- Keep responsive behavior mobile-first unless the project says otherwise.
- Preserve focus, hover, active, disabled, reduced-motion, contrast, and dark-mode states where relevant.
- Use arbitrary values only for justified one-off values.
- Follow the project-declared class sorting policy when active.

## Review Checklist

- [ ] Tailwind version and integration were checked.
- [ ] Utility classes are complete and statically detectable.
- [ ] Utility classes follow existing project patterns.
- [ ] Responsive behavior remains coherent.
- [ ] Theme variables and accessibility states were considered.
- [ ] Vue class bindings are static-map based when Vue is active.
- [ ] Tailwind class sorting policy was followed when active.
