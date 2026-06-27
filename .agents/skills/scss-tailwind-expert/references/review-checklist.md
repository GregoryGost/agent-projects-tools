# SCSS Tailwind Review Checklist

Load this checklist for styling changes in projects using Tailwind CSS, Sass/SCSS, or both.

## Activation

- [ ] `CODEX_PROJECT.md` declares Tailwind CSS, Sass/SCSS, or a combined styling profile active.
- [ ] Active framework skill, such as `vue-expert`, is also applied.

## Source Of Truth

- [ ] Tailwind version and config location were checked when relevant.
- [ ] Sass/SCSS entry points, partials, and tokens were checked when relevant.
- [ ] Existing CSS variables, design tokens, and theme conventions were checked.

## Styling Layer

- [ ] Utility classes are used for simple local styling when project style supports it.
- [ ] SCSS is used only where shared abstraction or non-trivial styling needs it.
- [ ] No empty component style block was added.
- [ ] No duplicate Tailwind + SCSS rule was introduced.
- [ ] No ad-hoc color/spacing value bypasses existing tokens without reason.

## Responsiveness And Themes

- [ ] Responsive behavior is mobile-first unless project policy says otherwise.
- [ ] Dark/light/custom theme behavior remains intact.
- [ ] Focus, hover, active, disabled, reduced-motion, and contrast states were considered when relevant.

## Validation

- [ ] Formatting/lint/build checks were run when declared.
- [ ] Playwright MCP UI validation was used when active and visible behavior changed.
