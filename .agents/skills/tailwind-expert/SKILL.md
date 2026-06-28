---
name: tailwind-expert
description: "Use for Tailwind CSS work: utility classes, responsive design, theme tokens, class sorting, config/version awareness, and Tailwind review."
---

# Tailwind Expert

Use this skill when Tailwind CSS is active in `CODEX_PROJECT.md` or when the task directly touches Tailwind utilities, configuration, or class sorting.

Apply `.codex/rules/tailwind_css.md` together with this skill.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm Tailwind version, stylesheet/config path, build integration, and Prettier plugin policy.
3. Inspect existing class usage, theme tokens, CSS variables, and responsive patterns.
4. Use existing project conventions before adding new patterns.
5. Run or report declared format/build/UI validation commands when applicable.

## Guardrails

- Prefer direct utility classes for simple local styling.
- Reuse theme values and tokens instead of ad-hoc values.
- Keep responsive behavior mobile-first unless the project says otherwise.
- Preserve focus, hover, active, disabled, reduced-motion, and contrast states where relevant.
- Do not infer SCSS usage from Tailwind.

## Review Checklist

- [ ] Tailwind version and integration were checked.
- [ ] Utility classes follow existing project patterns.
- [ ] Responsive behavior remains coherent.
- [ ] Theme and accessibility states were considered.
- [ ] Tailwind class sorting policy was followed when active.
