# CSS Browser And Architecture Review

Use this reference together with `patterns-and-review.md` for CSS architecture and browser compatibility review.

## File Ownership

Use existing project conventions first. For a new plain-CSS structure, keep files by responsibility:

- entry point: imports and layer order;
- tokens: custom properties and reusable design values;
- base: reset and element defaults;
- layout: containers, page shells, grids, stacks, and section spacing;
- components: reusable component classes;
- utilities: narrow reusable helpers;
- overrides: documented integration fixes.

## Selector Rules

- Prefer class selectors for component styling.
- Avoid ID selectors for styling.
- Keep descendant chains short.
- Use `:where()` for low-specificity wrappers.
- Use native nesting only when supported by the project browser policy or build pipeline.
- Review the resulting selector, not just the nested source.

## Browser Review Areas

Check these areas when touched:

- form controls and native UI elements;
- scrollbars and overflow;
- mobile viewport height;
- font rendering and line-height;
- flex and grid overflow;
- logical properties and writing modes;
- hover and pointer media queries;
- reduced-motion preferences;
- forced-colors preferences;
- color-scheme behavior.

## Modern CSS Features

Use a baseline-first approach for:

- container queries;
- native nesting;
- parent-aware selectors;
- subgrid;
- new viewport units;
- modern color functions;
- scroll-driven animations.

If the feature is not covered by project browser policy, add a fallback or use `@supports`.

## Vue SFC Review

When Vue is active:

- keep local component CSS in SFC style blocks;
- use `scoped` only when component-local scoping is intended;
- use CSS Modules only when the project convention already uses them;
- use CSS `v-bind()` only when component state must drive a CSS value;
- keep shared tokens, base rules, layout primitives, and shared utilities in shared CSS files;
- use deep/global selectors narrowly and document the reason.
