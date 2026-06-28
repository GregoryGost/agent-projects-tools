---
name: scss-expert
description: "Use for Sass/SCSS styling work: module system, variables, maps, mixins, design tokens, CSS custom properties, component-scoped styles, responsive behavior, theme behavior, Tailwind separation, and style review."
---

# SCSS Expert

Use this skill when Sass/SCSS is active in `CODEX_PROJECT.md` or when the task directly touches SCSS.

Apply `.codex/rules/scss_styling.md` together with this skill.

Load references when needed:

- `references/patterns-and-review.md` for SCSS good/bad patterns and review prompts.
- `references/official-sources.md` for official Sass and CSS sources.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm Sass implementation, style entry points, component policy, design token source, formatter, linter, and validation commands.
3. Inspect existing SCSS structure before editing.
4. Identify the smallest styling layer that solves the task: token, variable, map, mixin, function, shared partial, component scoped style, or local CSS.
5. Compare the intended change against `references/patterns-and-review.md`.
6. Preserve responsive and theme behavior.
7. Keep SCSS independent from Tailwind unless the project explicitly combines them.

## Guardrails

- Use existing tokens, variables, maps, mixins, functions, and CSS custom properties before adding new ones.
- Prefer the Sass module system with `@use` and `@forward` for new shared SCSS.
- Do not add new Sass `@import` unless the project is intentionally pinned to a legacy Sass implementation that cannot use modules.
- Use CSS custom properties for runtime theme values and Sass variables/maps for compile-time structure.
- Keep mixins focused and reusable.
- Keep nesting shallow and intentional.
- Avoid duplicate declarations across shared and component styles.
- Keep component styles scoped only when local styling is actually needed.
- Do not infer Tailwind usage from SCSS.

## Review Checklist

- [ ] SCSS profile and style entry points were checked.
- [ ] Sass implementation and module-system support were checked when adding shared SCSS.
- [ ] Design token source was respected.
- [ ] CSS custom properties and Sass variables/maps are used for the correct runtime/compile-time purpose.
- [ ] Mixins, maps, and nesting remain narrow and justified.
- [ ] Responsive and theme behavior remain coherent.
- [ ] Tailwind ownership was not inferred from SCSS.
- [ ] No unrelated styling layer was changed.
