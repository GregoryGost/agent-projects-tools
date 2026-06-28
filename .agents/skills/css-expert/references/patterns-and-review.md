# CSS Patterns And Review

Use this reference when designing or reviewing standalone CSS.

This file contains good and bad CSS patterns for architecture, selectors, tokens, responsive behavior, progressive enhancement, browser-sensitive UI, and Vue SFC style usage.

## Core Principles

- Treat CSS as a standalone styling layer activated by `CODEX_PROJECT.md`.
- Keep stylesheet ownership explicit: tokens, base, layout, components, utilities, and overrides.
- Use CSS custom properties for runtime theme values and shared design tokens.
- Keep selectors low-specificity and predictable.
- Check browser support before relying on modern CSS.
- Use progressive enhancement when a feature needs a fallback.

## Good: Layered File Ownership

Use a small set of files with clear responsibility:

- entry point for imports and cascade order;
- tokens for custom properties and shared values;
- base for reset and element defaults;
- layout for containers, grids, stacks, and page shells;
- components for reusable component classes;
- utilities for narrow reusable helpers;
- overrides for documented integration fixes.

Why this is good:

- The owner of each rule is clear.
- Shared styles do not drift into component files.
- Override rules are isolated and easier to remove later.

## Bad: One Unstructured Global Stylesheet

Avoid putting tokens, base rules, layout rules, component rules, utilities, and third-party fixes in one growing file.

Problems:

- Rule ownership becomes unclear.
- Specificity increases over time.
- Refactoring requires broad search-and-edit work.

## Good: Semantic Custom Properties

Use project-level custom properties for reusable runtime values such as color, spacing, radius, shadow, and timing.

Good examples of token names:

- `--color-surface`;
- `--color-text`;
- `--space-4`;
- `--radius-md`;
- `--duration-fast`.

Why this is good:

- Repeated values are centralized.
- Theme changes can happen without rewriting component CSS.
- Components depend on stable semantic names.

## Bad: Repeated Literal Values

Avoid repeating the same colors, spacing, radii, and animation durations across unrelated components.

Problems:

- Values drift.
- Theme and density changes become harder.
- Intent is hidden behind raw numbers.

## Good: Low-Specificity Selectors

Prefer simple class selectors for component contracts and low-specificity helpers for generic patterns.

Good pattern:

- component class owns the component block;
- element class owns a component subpart;
- utility class does one narrow job;
- `:where()` is used only when zero-specificity grouping is intentional.

Why this is good:

- Overrides stay deliberate.
- Rules are easier to trace.
- Markup changes are less likely to break unrelated styling.

## Bad: Deep Descendant Chains

Avoid selectors that depend on a long chain of ancestors or exact DOM nesting.

Problems:

- Styling becomes coupled to markup structure.
- Specificity becomes expensive to override.
- Small DOM changes can break the rule.

## Good: Baseline First, Enhancement Second

Start with CSS that works across the project browser policy, then add modern enhancements behind support checks when needed.

Good candidates for support checks:

- container queries;
- native CSS nesting;
- parent-aware selectors;
- subgrid;
- new viewport units;
- modern color functions.

Why this is good:

- Older supported browsers keep a usable baseline.
- Modern browsers get better behavior.
- The fallback is explicit in review.

## Bad: Modern Feature Without Fallback

Avoid making layout or interaction depend only on a modern feature unless the browser policy clearly allows it.

Problems:

- Unsupported browsers may lose important layout behavior.
- Failures can be silent.
- Reviewers cannot see the intended fallback.

## Good: Responsive Layout Primitives

Prefer reusable layout classes or component-local layout contracts over repeated one-off breakpoints.

Good patterns:

- mobile-first base rules;
- project breakpoint tokens when available;
- consistent grid and flex primitives;
- `min-width: 0` where long content can overflow grid or flex children.

Why this is good:

- Responsive behavior is consistent.
- Long content is less likely to break layout.
- Reusable primitives reduce duplicated CSS.

## Bad: Repeated Magic Breakpoints

Avoid slightly different breakpoints and layout widths across components unless the variation is intentional and documented.

Problems:

- Responsive behavior drifts.
- Debugging layout issues becomes harder.
- Components stop feeling like one system.

## Good: Browser-Sensitive UI Is Reviewed Explicitly

Treat these areas as cross-browser review points when touched:

- form controls;
- scrollbars;
- overflow behavior;
- mobile viewport height;
- font rendering and line-height;
- hover and pointer media behavior;
- reduced-motion behavior;
- forced-colors behavior;
- color-scheme behavior.

Why this is good:

- Native browser differences are expected.
- Accessibility states are preserved.
- Visual regressions are easier to catch.

## Bad: Assuming Browser UI Is Identical

Avoid assuming that controls, scrollbars, viewport height, fonts, and pointer behavior render identically across browsers.

Problems:

- Styling may work only in one browser family.
- Mobile browser UI can change viewport behavior.
- Accessibility modes can expose missing states.

## Good: Vue SFC Local CSS When Vue Is Active

Use local CSS in Vue only when the project declares both Vue and CSS active, or when an existing SFC already uses local CSS.

Good patterns:

- local component-only styles live in the SFC style block;
- `scoped` is used only when component-local scoping is intended;
- CSS Modules are used only when the project convention already uses them;
- CSS `v-bind()` is used only when component state must drive a CSS value;
- shared tokens, base rules, layout primitives, and shared utilities stay in shared CSS files.

## Bad: Shared System Rules Inside One Component

Avoid defining shared tokens, base rules, layout primitives, or reusable utilities inside a single SFC style block.

Problems:

- Shared styling becomes hidden inside one component.
- Other components duplicate the same idea.
- The style contract is harder to evolve.

## Review Questions

- Is plain CSS active for this project or directly touched by the task?
- Which style layer owns this change: tokens, base, layout, component, utility, override, CSS Module, or SFC-local style?
- Are CSS entry points and browser support policy known?
- Does the build pipeline actually provide the needed transforms or prefixes?
- Are selectors low-specificity and stable?
- Are custom properties used for runtime values and repeated design tokens?
- Does a modern feature need a support check or fallback?
- Were form controls, scrollbars, viewport units, and mobile browser behavior checked when affected?
- Are focus, disabled, reduced-motion, forced-colors, and color-scheme states preserved?
- If Vue is active, is the style placed in the correct SFC or shared CSS layer?
