---
name: scss-expert
description: "Use for Sass/SCSS styling work: variables, maps, mixins, design tokens, component-scoped styles, responsive behavior, and style review."
---

# SCSS Expert

Use this skill when Sass/SCSS is active in `CODEX_PROJECT.md` or when the task directly touches SCSS.

Apply `.codex/rules/scss_styling.md` together with this skill.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm Sass implementation, style entry points, component policy, design token source, and validation commands.
3. Inspect existing SCSS structure before editing.
4. Select the smallest styling layer that solves the task: token, variable, mixin, shared partial, component scoped style, or local CSS.
5. Preserve responsive and theme behavior.

## Guardrails

- Use existing tokens and variables before adding new ones.
- Keep mixins focused and reusable.
- Avoid duplicate declarations across shared and component styles.
- Keep component styles scoped only when local styling is actually needed.
- Do not infer Tailwind usage from SCSS.

## Review Checklist

- [ ] SCSS profile and style entry points were checked.
- [ ] Design token source was respected.
- [ ] Responsive and theme behavior remain coherent.
- [ ] No unrelated styling layer was changed.
