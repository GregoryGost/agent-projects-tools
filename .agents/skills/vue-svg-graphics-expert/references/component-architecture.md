# Vue SVG Component Architecture

Use this reference when choosing the rendering boundary, designing the public component API, calculating geometry, or managing reusable SVG definitions.

## Rendering Boundary

### Good: Static SVG Stays An Asset

```vue
<script setup lang="ts">
import brandMarkUrl from './brand-mark.svg'
</script>

<template>
  <img :src="brandMarkUrl" alt="Example product" />
</template>
```

Use this when the graphic is static and its internal elements do not need Vue state, runtime theme tokens, internal animation, or element-level semantics.

### Bad: Inline Component Without A Runtime Reason

```vue
<template>
  <svg viewBox="0 0 320 180">
    <!-- Hundreds of unchanged exported nodes. -->
  </svg>
</template>
```

Problems:

- The SVG tree increases DOM and hydration cost.
- Vue owns nodes that never change.
- Static asset caching and reuse are lost.

### Good: Inline SVG Has A Component Contract

```vue
<script setup lang="ts">
interface Props {
  progress: number
  tone?: 'neutral' | 'success' | 'danger'
}

const props = withDefaults(defineProps<Props>(), {
  tone: 'neutral',
})
</script>

<template>
  <svg viewBox="0 0 100 100" role="img">
    <circle cx="50" cy="50" r="44" class="meter__track" />
    <circle
      cx="50"
      cy="50"
      r="44"
      pathLength="1"
      class="meter__value"
      :style="{ '--meter-progress': props.progress }"
    />
  </svg>
</template>
```

Why this is good:

- The public API describes meaning.
- Stable geometry remains inside the component.
- Paint and motion can use project tokens.

## Public API Design

Prefer semantic inputs:

```ts
interface Props {
  value: number
  min?: number
  max?: number
  variant?: 'compact' | 'detailed'
  tone?: 'neutral' | 'positive' | 'negative'
  animated?: boolean
}
```

Avoid path-oriented inputs:

```ts
interface Props {
  path1Fill: string
  path1Opacity: number
  path2Stroke: string
  circle3Radius: number
  labelX: number
  labelY: number
}
```

Path-oriented APIs leak the implementation and make later geometry changes breaking changes.

Use named geometry presets when responsive compositions materially differ:

```ts
type Composition = 'landscape' | 'portrait'
```

Do not expose every coordinate merely to avoid defining a second composition preset.

## Root Attributes

Preserve normal root-SVG customization through attribute fallthrough when appropriate:

```vue
<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <svg
    v-bind="$attrs"
    class="desert-backdrop"
    viewBox="0 0 1600 900"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <!-- Component-owned layers. -->
  </svg>
</template>
```

Use an explicit merge policy when the component must own a root attribute. Do not silently allow callers to invalidate the component's coordinate system or accessibility mode.

## Coordinate System

### Good: Stable ViewBox, CSS-Controlled Size

```vue
<svg
  viewBox="0 0 1600 900"
  preserveAspectRatio="xMidYMid slice"
  class="size-full"
>
```

The geometry remains in one coordinate system while the container controls rendered size.

### Bad: Geometry Coupled To Pixel Props

```vue
<svg :viewBox="`0 0 ${width} ${height}`" :width="width" :height="height">
```

This is only justified when the viewBox itself is the data coordinate system. For reusable illustrations it often makes path geometry, crop behavior, and testing unstable.

Choose aspect-ratio behavior deliberately:

- `xMidYMid meet` for full fitting without crop;
- `xMidYMid slice` for full-bleed backgrounds with crop;
- explicit edge alignment when one side is the focal area;
- `none` only for intentional non-uniform scaling.

## Pure Geometry

Keep non-trivial geometry outside the template:

```ts
export interface Point {
  x: number
  y: number
}

export function toPolyline(points: readonly Point[]): string {
  return points
    .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y))
    .map((point) => `${point.x},${point.y}`)
    .join(' ')
}
```

Use a computed value for derived output:

```ts
const pointList = computed(() => toPolyline(props.points))
```

Do not mutate props, hide geometry side effects in watchers, or calculate long path strings repeatedly inside template expressions.

Normalize bounded numeric values explicitly:

```ts
export function clampProgress(value: number): number {
  if (!Number.isFinite(value)) {
    return 0
  }

  return Math.min(1, Math.max(0, value))
}
```

Test helpers independently for empty input, invalid numbers, boundaries, path structure, and deterministic output.

## Primitive Choice

Prefer readable native primitives:

```vue
<circle cx="50" cy="50" r="18" />
<line x1="12" y1="80" x2="88" y2="80" />
```

Do not replace them with opaque path data unless path-specific behavior, export compatibility, or geometry reuse justifies it.

## Definitions And Unique IDs

### Good: Stable IDs Derived Once

```vue
<script setup lang="ts">
import { useId } from 'vue'

const id = useId()
const gradientId = `${id}-gradient`
const titleId = `${id}-title`
</script>

<template>
  <svg :aria-labelledby="titleId" role="img" viewBox="0 0 100 100">
    <title :id="titleId">Current utilization</title>
    <defs>
      <linearGradient :id="gradientId">
        <stop offset="0" stop-color="var(--meter-start)" />
        <stop offset="1" stop-color="var(--meter-end)" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="40" :fill="`url(#${gradientId})`" />
  </svg>
</template>
```

Confirm that the project Vue version supports `useId()`. Otherwise use a required `idPrefix` prop or a deterministic project allocator.

### Bad: Fixed Or Random ID

```vue
<linearGradient id="gradient" />
<path fill="url(#gradient)" />
```

```ts
const gradientId = `gradient-${Math.random()}`
```

Problems:

- Fixed IDs collide between component instances.
- Random IDs can break SSR hydration and deterministic tests.
- Paint-server references can resolve to another component's definition.

Derive title, description, gradient, clip, mask, marker, and filter IDs from one stable component ID.

## Layer Ownership

Use explicit groups for meaningful layers:

```vue
<g class="backdrop__sky">...</g>
<g class="backdrop__far">...</g>
<g class="backdrop__middle">...</g>
<g class="backdrop__near">...</g>
```

Groups should support paint, motion, semantics, or review. Avoid nested groups that exist only because an export tool produced them.

## Large Data Sets

For data-driven SVG:

- avoid component-per-point abstraction for large lists;
- keep stable keys based on domain identity;
- use shallow reactivity for large immutable inputs when appropriate;
- precompute expensive scales or paths only when their dependencies change;
- virtualize, aggregate, or switch rendering technology when the DOM becomes the limiting factor.

## Architecture Review Questions

- Is inline SVG required, or should this remain a Vite-managed asset?
- Does the public API describe meaning rather than implementation details?
- Is the coordinate system stable and documented?
- Are geometry functions pure, finite, deterministic, and tested?
- Are IDs unique and hydration-safe?
- Are groups and definitions owned by an actual visual or semantic boundary?
- Is the SVG DOM proportionate to the requirement?
