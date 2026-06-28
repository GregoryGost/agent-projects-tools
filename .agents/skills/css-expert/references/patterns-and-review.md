# CSS Patterns And Review

Use this reference when designing or reviewing standalone CSS.

This file contains good and bad CSS patterns with code examples for architecture, selectors, tokens, responsive behavior, progressive enhancement, browser-sensitive UI, and Vue SFC style usage.

## Core Principles

- Treat CSS as a standalone styling layer activated by `CODEX_PROJECT.md`.
- Keep stylesheet ownership explicit: tokens, base, layout, components, utilities, and overrides.
- Use CSS custom properties for runtime theme values and shared design tokens.
- Keep selectors low-specificity and predictable.
- Check browser support before relying on modern CSS.
- Use progressive enhancement when a feature needs a fallback.

## Good: Layered File Ownership

```css
@layer tokens, base, layout, components, utilities, overrides;

@import "./tokens.css" layer(tokens);
@import "./base.css" layer(base);
@import "./layout.css" layer(layout);
@import "./components/button.css" layer(components);
@import "./utilities.css" layer(utilities);
@import "./overrides.css" layer(overrides);
```

Why this is good:

- The owner of each rule is clear.
- Cascade order is explicit.
- Overrides are isolated and easier to remove later.

## Bad: One Unstructured Global Stylesheet

```css
:root {
  --color-brand: #2563eb;
}

body {
  margin: 0;
}

.page .content .card .title {
  color: #2563eb;
}

.mt-16 {
  margin-top: 16px;
}

.vendor-widget button {
  border-radius: 0;
}
```

Problems:

- Tokens, base rules, component rules, utilities, and overrides are mixed together.
- Rule ownership becomes unclear.
- Specificity grows over time.

## Good: Semantic Custom Properties

```css
:root {
  --color-surface: #ffffff;
  --color-text: #111827;
  --space-4: 1rem;
  --radius-md: 0.5rem;
  --duration-fast: 160ms;
}

[data-theme="dark"] {
  --color-surface: #111827;
  --color-text: #f9fafb;
}

.card {
  color: var(--color-text);
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  transition-duration: var(--duration-fast);
}
```

Why this is good:

- Repeated values are centralized.
- Theme changes can happen without rewriting component CSS.
- Components depend on stable semantic names.

## Bad: Repeated Literal Values

```css
.card {
  color: #111827;
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
}

.panel {
  color: #111827;
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
}
```

Problems:

- Values drift.
- Theme and density changes become harder.
- Intent is hidden behind raw values.

## Good: Low-Specificity Component Selectors

```css
.card {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-4);
}

.card__title {
  margin: 0;
  font-size: 1rem;
}

:where(.stack) > * + * {
  margin-block-start: var(--stack-space, 1rem);
}
```

Why this is good:

- Component contracts are easy to identify.
- `:where()` keeps the utility cheap to override.
- Markup changes are less likely to break unrelated styling.

## Bad: Deep Descendant Chains

```css
.page .content .sidebar .card .header .title {
  font-size: 1rem;
}
```

Problems:

- Styling becomes coupled to exact DOM structure.
- Specificity becomes expensive to override.
- Small markup changes can break the rule.

## Good: Baseline First, Enhancement Second

```css
.card-grid {
  display: grid;
  gap: 1rem;
}

@supports (container-type: inline-size) {
  .card-grid {
    container-type: inline-size;
  }

  @container (min-width: 40rem) {
    .card-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}
```

Why this is good:

- The base layout works without the modern feature.
- Supporting browsers receive the enhanced behavior.
- The fallback is explicit in review.

## Bad: Modern Feature Without Baseline

```css
.card-grid {
  container-type: inline-size;
}

@container (min-width: 40rem) {
  .card-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
```

Problems:

- Unsupported browsers may lose important layout behavior.
- Failures can be silent.
- Reviewers cannot see the intended fallback.

## Good: Responsive Layout Primitive

```css
.content-layout {
  display: grid;
  gap: var(--space-4);
}

.content-layout__main,
.content-layout__aside {
  min-width: 0;
}

@media (min-width: 48rem) {
  .content-layout {
    grid-template-columns: minmax(0, 1fr) 20rem;
  }
}
```

Why this is good:

- The small-screen layout works first.
- The breakpoint is consistent.
- Long content is less likely to break grid layout.

## Bad: Repeated Magic Breakpoints

```css
.card-list {
  display: grid;
}

@media (min-width: 767px) {
  .card-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

.panel-list {
  display: grid;
}

@media (min-width: 781px) {
  .panel-list {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

Problems:

- Responsive behavior drifts.
- Debugging layout issues becomes harder.
- Components stop feeling like one system.

## Good: Accessible Form State

```css
.input {
  color: inherit;
  font: inherit;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.625rem 0.75rem;
}

.input:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.input:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
```

Why this is good:

- Native control differences are expected.
- Focus state remains visible.
- Disabled state remains explicit.

## Bad: Removing Interaction States

```css
.input {
  border: 0;
  outline: 0;
}

.input:disabled {
  opacity: 1;
}
```

Problems:

- Keyboard users can lose visible focus.
- Disabled controls may look interactive.
- Browser defaults are removed without replacement.

## Good: Reduced-Motion Fallback

```css
.toast {
  transition: transform 180ms ease, opacity 180ms ease;
}

@media (prefers-reduced-motion: reduce) {
  .toast {
    transition: none;
  }
}
```

Why this is good:

- Motion-sensitive users are respected.
- Default animation stays simple.
- The fallback is scoped to the affected component.

## Bad: Unconditional Motion

```css
.toast {
  transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

Problems:

- Reduced-motion preference is ignored.
- The interaction can feel slow or distracting.
- Reviewers cannot see the accessibility fallback.

## Good: Vue SFC Local CSS When Vue Is Active

```vue
<template>
  <section class="card">
    <slot />
  </section>
</template>

<style scoped>
.card {
  padding: var(--space-4);
  border-radius: var(--radius-md);
}
</style>
```

Why this is good:

- The style belongs to the component.
- `scoped` is used for local styling.
- Shared tokens stay outside the component.

## Good: Vue CSS Value From Component State

```vue
<script setup lang="ts">
const accentColor = '#2563eb'
</script>

<template>
  <button class="button">Save</button>
</template>

<style scoped>
.button {
  color: v-bind(accentColor);
}
</style>
```

Use this only when component state must drive a CSS value.

## Bad: Shared System Rules Inside One Component

```vue
<style scoped>
:root {
  --color-brand: #2563eb;
  --space-4: 1rem;
}

.button-reset {
  border: 0;
  background: transparent;
}
</style>
```

Problems:

- Shared tokens are hidden inside one component.
- Other components may duplicate the same idea.
- Reusable base styles become harder to evolve.

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
