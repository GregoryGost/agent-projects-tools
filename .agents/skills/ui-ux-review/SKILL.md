---
name: ui-ux-review
description: "Use for framework-agnostic UI/UX validation: responsive behavior, interaction states, accessibility-sensitive markup, layout stability, and conditional Tailwind/SCSS checks."
---

# UI/UX Review

Use this skill when a task changes visible UI, user flows, responsive behavior, accessibility-sensitive markup, or interaction states.

Apply `.codex/rules/ui_ux_validation.md` together with this skill.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm active framework, styling tools, validation commands, browser targets, and artifact policy.
3. Inspect changed UI code and related styles/configuration.
4. Check layout, hierarchy, interaction states, accessibility-sensitive behavior, and responsive behavior.
5. Apply Tailwind or SCSS checks only when those profiles are active.
6. Use `playwright-ui-checks-mcp` when browser validation is active.

## Review Checklist

- [ ] Visible UI change is covered by a UI/UX review.
- [ ] Responsive behavior is checked for declared breakpoints.
- [ ] Focus, hover, active, disabled, loading, empty, and error states are considered when relevant.
- [ ] Semantic markup and accessible names are considered.
- [ ] Tailwind checks are applied only when Tailwind is active.
- [ ] SCSS checks are applied only when SCSS is active.
