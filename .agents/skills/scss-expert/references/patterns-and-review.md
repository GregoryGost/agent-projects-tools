# SCSS Patterns And Review

Use this reference when designing or reviewing Sass/SCSS styling.

This reference complements Vue, Prettier, and TypeScript skills. It focuses only on Sass/SCSS module structure, design-token wiring, custom properties, mixins, maps, nesting, component-local styles, Vue SFC style blocks, and style review.

## Core Principles

- Treat SCSS as an optional standalone styling overlay activated by `CODEX_PROJECT.md`.
- Use the Sass module system with `@use` and `@forward` for new shared SCSS.
- Do not add new Sass `@import` unless the project is intentionally pinned to a legacy Sass implementation that cannot use modules.
- Prefer existing variables, maps, mixins, functions, and CSS custom properties before adding new design tokens.
- Use CSS custom properties for runtime theme values and Sass variables/maps for compile-time structure.
- Keep nesting shallow and intentional.
- Keep mixins focused on reusable declarations or patterns; do not use mixins to hide one-off CSS.
- In Vue projects, keep local component styles in SFC style blocks and reusable SCSS in shared SCSS modules.

## Good: Module System With Namespaced Tokens

```scss
// styles/tokens/_spacing.scss
$space-2: 0.5rem;
$space-4: 1rem;

// styles/tokens/_index.scss
@forward "spacing";

// components/card.scss
@use "../styles/tokens" as tokens;

.card {
  padding: tokens.$space-4;
}
```

Why this is good:

- Shared members are namespaced.
- The source of each token is explicit.
- A single index module can forward a public styling API.

## Bad: New Shared SCSS With `@import`

```scss
@import "../styles/tokens/spacing";

.card {
  padding: $space-4;
}
```

Problems:

- Members are loaded into a shared global namespace.
- It is harder to determine where variables, mixins, or functions come from.
- Sass `@import` is deprecated in modern Dart Sass.

## Good: CSS Custom Properties For Runtime Theme Values

```scss
:root {
  --color-surface: #ffffff;
  --color-text: #1f2937;
}

[data-theme="dark"] {
  --color-surface: #111827;
  --color-text: #f9fafb;
}

.card {
  background: var(--color-surface);
  color: var(--color-text);
}
```

Why this is good:

- Theme values can change at runtime.
- JavaScript and CSS can both read the same custom properties.
- The component style does not need duplicated theme branches.

## Good: Inject Sass Values Into CSS Custom Properties With Interpolation

```scss
@use "sass:meta";

$surface: #ffffff;
$font-family-sans: "Inter", "Segoe UI", sans-serif;

:root {
  --color-surface: #{$surface};
  --font-family-sans: #{meta.inspect($font-family-sans)};
}
```

Why this is good:

- Sass values are explicitly injected into custom properties.
- Quoted string values are preserved with `meta.inspect()` when needed.

## Bad: Assuming Sass Variables Are Evaluated Inside Custom Properties

```scss
$surface: #ffffff;

:root {
  --color-surface: $surface;
}
```

Problems:

- Sass custom property values are passed through differently from normal declarations.
- The output can contain the literal `$surface` instead of the intended color.

## Good: Focused Mixin

```scss
@mixin focus-ring($color) {
  outline: 2px solid $color;
  outline-offset: 2px;
}

.button:focus-visible {
  @include focus-ring(var(--color-focus));
}
```

Why this is good:

- The mixin represents a reusable styling pattern.
- The call site still makes the applied behavior clear.

## Bad: Mixin For One-Off Styling

```scss
@mixin card-panel {
  padding: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: #ffffff;
}

.card {
  @include card-panel;
}
```

Problems:

- The mixin hides ordinary CSS without clear reuse.
- The component becomes harder to review because the style is elsewhere.
- A class or local declarations would usually be clearer.

## Good: Map For Declared Token Scale

```scss
@use "sass:map";

$breakpoints: (
  sm: 40rem,
  md: 48rem,
  lg: 64rem,
);

@mixin media-up($name) {
  $width: map.get($breakpoints, $name);

  @if $width == null {
    @error "Unknown breakpoint `#{$name}`.";
  }

  @media (min-width: $width) {
    @content;
  }
}
```

Why this is good:

- The token scale is centralized.
- Invalid keys fail fast.
- The mixin encodes a reusable responsive pattern.

## Bad: Repeated Magic Breakpoints

```scss
.card {
  @media (min-width: 768px) {
    display: grid;
  }
}

.panel {
  @media (min-width: 770px) {
    display: flex;
  }
}
```

Problems:

- Breakpoints drift.
- Responsive behavior becomes inconsistent.
- Changes require broad search-and-edit.

## Good: Shallow Nesting

```scss
.card {
  padding: 1rem;

  &__title {
    margin: 0;
  }

  &:focus-within {
    outline: 2px solid var(--color-focus);
  }
}
```

## Bad: Deep Selector Nesting

```scss
.page {
  .section {
    .card {
      .header {
        .title {
          color: var(--color-text);
        }
      }
    }
  }
}
```

Problems:

- The compiled selector is overly specific.
- Reuse and overrides become harder.
- Markup changes can break unrelated styles.

## Vue SFC Usage When Vue Is Active

Use SCSS in Vue only when the project declares both Vue and SCSS active, or when an existing `.vue` file already uses SCSS.

Good local SFC style:

```vue
<style scoped lang="scss">
.card {
  padding: var(--space-4);
}
</style>
```

Good dynamic CSS value from component state:

```vue
<script setup lang="ts">
const accentColor = '#2563eb'
</script>

<style scoped lang="scss">
.button {
  color: v-bind(accentColor);
}
</style>
```

Good shared SCSS usage in a Vue style block:

```vue
<style scoped lang="scss">
@use "@/styles/tokens" as tokens;

.card {
  padding: tokens.$space-4;
}
</style>
```

Bad: defining reusable shared SCSS inside a local SFC block:

```vue
<style scoped lang="scss">
@mixin visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
</style>
```

Problem: reusable mixins, maps, functions, and token declarations should live in the project-declared shared SCSS layer, not inside one component.

## Component-Scoped SCSS

Use component-scoped SCSS only for local component styling. Shared tokens, mixins, functions, and global resets belong in the project-declared shared style layer.

Use `scoped` only when component-local style scoping is intended. Keep global styles in project-declared global entry points.

Use CSS Modules only when the project convention already uses them or the task explicitly asks for module-scoped class names.

## Review Questions

- Is SCSS active for this project or directly touched by the task?
- Is this shared SCSS, component-local SCSS, token wiring, or plain CSS?
- Does this change use `@use`/`@forward` instead of adding new Sass `@import`?
- Are Sass variables/maps and CSS custom properties used for the correct compile-time/runtime purpose?
- Are Sass values interpolated correctly inside CSS custom properties?
- Are mixins reusable and narrow?
- Is nesting shallow and intentional?
- Were responsive and theme behaviors checked?
- If Vue is active, is the styling placed in the correct SFC or shared SCSS layer?
