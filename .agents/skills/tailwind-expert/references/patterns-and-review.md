# Tailwind CSS Patterns And Review

Use this reference when designing or reviewing Tailwind CSS usage.

This reference focuses only on Tailwind CSS: utility class usage, theme variables, responsive variants, state variants, source detection, stylesheet entry point integration, Vue class binding, and project policy.

## Core Principles

- Treat Tailwind CSS as an optional standalone styling overlay activated by `CODEX_PROJECT.md`.
- Resolve stylesheet integration from the declared Tailwind version and the project's actual build pipeline. Do not assume that Tailwind belongs in an SCSS entry point.
- Prefer existing utility patterns and theme variables before adding new design tokens.
- Use complete, statically detectable class names.
- Do not build class names with string concatenation or interpolation.
- Use responsive and state variants intentionally: breakpoint, hover, focus, active, disabled, dark mode, motion, and accessibility states.
- Use arbitrary values only for justified one-off values; prefer theme variables when a value is reusable.
- Keep class lists readable; leave class ordering automation to the project formatting rules.
- Do not add plugins, custom variants, or broad theme changes without project policy support.

## Tailwind Stylesheet Entry Point

Tailwind CSS v4 plain CSS entry point:

```css
@import "tailwindcss";

@theme {
  --color-brand-500: oklch(0.72 0.11 221.19);
}
```

When Tailwind CSS v4 and SCSS coexist, keep separate source entry points:

```css
/* tailwind.css */
@import "tailwindcss";

@theme {
  --color-brand-500: oklch(0.72 0.11 221.19);
}
```

```scss
// app.scss
@use "tokens";
@use "components";
```

Load both generated styles through the project-declared application imports or bundler configuration. Do not place Tailwind v4 imports or directives in `.scss`, and do not route the Tailwind v4 source through Sass, Less, or Stylus.

For Tailwind CSS v3 or a project-specific legacy pipeline, inspect the existing PostCSS, Tailwind, and Sass processing order before changing entry points. Preserve the repository's working integration unless the task explicitly requests a migration.

## Good: Direct Utility Classes For Local Styling

```html
<button class="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:opacity-50">
  Save
</button>
```

Why this is good:

- Styling is local to the element.
- State variants are explicit.
- Values come from Tailwind's utility system.

## Bad: Utility Classes Hidden Behind A One-Off Class

```html
<button class="save-button">Save</button>
```

```css
.save-button {
  border-radius: 0.375rem;
  background: #0284c7;
  padding: 0.5rem 1rem;
  color: white;
}
```

Problems:

- The one-off class hides ordinary utility styling.
- The style can drift from the project utility/token system.
- Local changes become harder to review in the markup.

## Good: Static Variant Map For Vue Class Binding

```vue
<script setup lang="ts">
const props = defineProps<{
  tone: 'primary' | 'danger'
}>()

const toneClasses = {
  primary: 'bg-sky-600 text-white hover:bg-sky-700',
  danger: 'bg-red-600 text-white hover:bg-red-700',
} satisfies Record<typeof props.tone, string>
</script>

<template>
  <button :class="['rounded-md px-4 py-2 text-sm font-medium', toneClasses[props.tone]]">
    Save
  </button>
</template>
```

Why this is good:

- All possible utility class names are complete strings.
- The mapping is typed.
- Tailwind can detect the generated classes.

## Bad: Dynamic Class Name Construction

```vue
<script setup lang="ts">
const props = defineProps<{
  color: string
}>()
</script>

<template>
  <button :class="`bg-${props.color}-600 hover:bg-${props.color}-700 text-white`">
    Save
  </button>
</template>
```

Problems:

- Tailwind scans source files as plain text and cannot infer dynamically constructed class names.
- The required classes might not be generated.
- The public component API can accept values that do not map to valid utilities.

## Good: Theme Variables For Reusable Design Tokens

```css
@import "tailwindcss";

@theme {
  --color-brand-500: oklch(0.72 0.11 221.19);
}
```

```html
<div class="bg-brand-500 text-white">...</div>
```

Why this is good:

- The design token maps to a utility class.
- Reusable values live in the Tailwind theme layer.
- The utility API stays consistent.

## Bad: Repeated Arbitrary Values For A Reusable Token

```html
<div class="bg-[#3ab7bf]">...</div>
<button class="border-[#3ab7bf] text-[#3ab7bf]">...</button>
```

Problems:

- The same design value is repeated in multiple places.
- The value is harder to rename or theme.
- It should usually be promoted to a theme variable if reusable.

## Good: One-Off Arbitrary Value When It Is Truly Local

```html
<div class="grid grid-cols-[minmax(12rem,1fr)_2fr] gap-4">...</div>
```

Why this can be good:

- The layout value is specific to one component.
- Promoting it to a theme token would add unnecessary API surface.

## Good: Mobile-First Responsive Utilities

```html
<div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">...</div>
```

Why this is good:

- The base class defines the small-screen layout.
- Breakpoint variants progressively enhance larger viewports.
- The responsive behavior is visible in the markup.

## Bad: Inconsistent Responsive Strategy

```html
<div class="grid grid-cols-4 max-md:grid-cols-2 max-sm:grid-cols-1">...</div>
```

Problems:

- The default style is optimized for the largest layout.
- The breakpoint logic can be harder to review.
- Use this only when the project explicitly prefers max-width variants.

## Good: State Variants Preserve Interaction And Accessibility

```html
<a class="text-sky-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700">
  Read more
</a>
```

Why this is good:

- Hover and keyboard focus states are both represented.
- The visual behavior remains accessible.

## Vue Usage When Vue Is Active

Use Tailwind in Vue only when the `vue3-typescript-vite` profile and the Tailwind profile are active, or when an existing `.vue` file already uses Tailwind utilities.

Good static classes:

```vue
<template>
  <section class="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900">
    <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
      Dashboard
    </h2>
  </section>
</template>
```

Good conditional classes:

```vue
<template>
  <button
    class="rounded-md px-4 py-2 text-sm font-medium"
    :class="isActive ? 'bg-sky-600 text-white' : 'bg-white text-slate-900 ring-1 ring-slate-300'"
  >
    Filter
  </button>
</template>
```

Bad dynamic construction:

```vue
<template>
  <button :class="`text-${tone}-600`">Filter</button>
</template>
```

Problem: the full utility class names are not present as static source text.

## Review Questions

- Is Tailwind CSS active for this project or directly touched by the task?
- Is the Tailwind version and integration path known?
- For Tailwind CSS v4, is the Tailwind source a plain CSS entry point that bypasses Sass, Less, and Stylus?
- If SCSS is also active with Tailwind CSS v4, are their source entry points and preprocessing responsibilities separate?
- For Tailwind CSS v3 or a legacy pipeline, was the existing processing order inspected and preserved?
- Are utility class names complete and statically detectable?
- Are theme variables used for reusable design tokens?
- Are arbitrary values justified as local one-offs?
- Are responsive variants mobile-first unless project policy says otherwise?
- Are hover, focus, active, disabled, motion, contrast, and dark-mode states preserved when relevant?
- Is Vue class binding using complete utility strings when Vue is active?
- Was class ordering left to project formatting rules?
