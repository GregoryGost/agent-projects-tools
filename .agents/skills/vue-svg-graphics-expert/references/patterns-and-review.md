# Vue SVG Graphics Patterns And Review

Use this reference for concrete implementation comparisons and final review.

## Good: Semantic Component API

```ts
interface Props {
  progress: number
  variant?: 'compact' | 'detailed'
  tone?: 'neutral' | 'positive' | 'negative'
  animated?: boolean
}
```

Why this is good:

- Props describe supported meaning and variants.
- Internal geometry can change without breaking callers.
- Validation rules are easy to state and test.

## Bad: Path-Oriented API

```ts
interface Props {
  pathOneFill: string
  pathTwoOpacity: number
  markerX: number
  markerY: number
  gradientStopThree: string
}
```

Problems:

- The implementation leaks into the public contract.
- Every redesign becomes an API migration.
- Callers can create unsupported visual combinations.

## Good: Stable Coordinate System

```vue
<svg
  viewBox="0 0 1600 900"
  preserveAspectRatio="xMidYMid slice"
  class="size-full"
  aria-hidden="true"
>
```

Why this is good:

- Geometry remains independent from CSS pixels.
- Full-bleed cropping is explicit.
- The component can be validated at multiple container ratios.

## Bad: Accidental Stretching

```vue
<svg viewBox="0 0 1600 900" preserveAspectRatio="none">
```

Problems:

- Shapes distort when the container ratio changes.
- Strokes and focal forms may lose intended proportions.
- The choice is unexplained and hard to review.

Use `none` only for an intentional non-uniform scaling contract.

## Good: Local Deterministic Definitions

```vue
<script setup lang="ts">
import { useId } from 'vue'

const id = useId()
const gradientId = `${id}-gradient`
const clipId = `${id}-clip`
</script>

<template>
  <svg viewBox="0 0 100 100">
    <defs>
      <linearGradient :id="gradientId">...</linearGradient>
      <clipPath :id="clipId">...</clipPath>
    </defs>

    <g :clip-path="`url(#${clipId})`">
      <rect width="100" height="100" :fill="`url(#${gradientId})`" />
    </g>
  </svg>
</template>
```

Why this is good:

- Multiple component instances do not collide.
- SSR and tests remain deterministic when the active Vue version supports `useId()`.
- Definitions stay owned by the component.

## Bad: Fixed Or Random Definitions

```vue
<linearGradient id="gradient">...</linearGradient>
<path fill="url(#gradient)" />
```

```ts
const id = `${Date.now()}-${Math.random()}`
```

Problems:

- Fixed IDs collide document-wide.
- Random IDs can break hydration.
- References may resolve to another component instance.

## Good: Finite Geometry Boundary

```ts
function normalizeProgress(value: number): number {
  if (!Number.isFinite(value)) {
    return 0
  }

  return Math.min(1, Math.max(0, value))
}
```

Why this is good:

- Invalid external values do not enter SVG attributes.
- Boundary behavior is testable.
- The template remains simple.

## Bad: Raw Numeric Interpolation

```vue
<circle :r="value / total * radius" />
```

Problems:

- Zero totals can emit `NaN` or `Infinity`.
- Negative or invalid values can create malformed geometry.
- Boundary behavior is hidden in the template.

## Good: Decorative Mode

```vue
<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
  ...
</svg>
```

Use this when the SVG adds no information beyond adjacent content.

## Good: Informative Mode

```vue
<svg role="img" :aria-labelledby="titleId" viewBox="0 0 100 100">
  <title :id="titleId">Storage utilization: 75%</title>
  ...
</svg>
```

Use stable local IDs and keep the accessible name concise.

## Bad: Ambiguous Accessibility

```vue
<svg viewBox="0 0 100 100">
  <title>Chart</title>
  ...
</svg>
```

Problems:

- The title is not useful.
- The component's decorative or informative contract is unclear.
- Multiple complex data relationships may have no equivalent representation.

## Good: Semantic Control Owns Interaction

```vue
<button type="button" aria-label="Delete item" @click="remove">
  <TrashIcon aria-hidden="true" />
</button>
```

## Bad: Path As Button

```vue
<path tabindex="0" @click="remove" />
```

Problems:

- Keyboard behavior, target size, state, focus, and disabled semantics are incomplete.
- The interaction contract becomes browser- and assistive-technology-sensitive.

## Good: Semantic Color Channels

```css
.desert-backdrop {
  --backdrop-sky-top: var(--color-scene-sky-top);
  --backdrop-sky-bottom: var(--color-scene-sky-bottom);
  --backdrop-far: var(--color-scene-far);
  --backdrop-middle: var(--color-scene-middle);
  --backdrop-near: var(--color-scene-near);
  --backdrop-accent: var(--color-scene-accent);
}
```

Why this is good:

- Geometry and palette remain separate.
- Themes and variants can override supported roles.
- Color review happens at a controlled boundary.

## Bad: Literal Colors On Every Path

```vue
<path fill="#7a311f" />
<path fill="#ad5834" />
<path fill="#3c1917" />
<path fill="#da7a42" />
```

Problems:

- Palette ownership is scattered.
- Dark mode and contrast changes require template edits.
- Path order becomes part of the theme API.

## Good: Tailwind At The Boundary

```vue
<DesertBackdrop
  class="size-full [--backdrop-accent:var(--color-violet-400)] motion-reduce:[--backdrop-motion:0]"
/>
```

Use Tailwind theme values and complete static utilities when Tailwind is active.

## Bad: Dynamic Tailwind Construction

```ts
const fillClass = `fill-${props.tone}-500`
```

Problems:

- The class may not be detected during Tailwind source scanning.
- Unsupported values enter the visual contract.
- Review cannot enumerate generated classes reliably.

Use an explicit typed map of complete class strings.

## Good: Subtle Layer Motion

```css
.backdrop__far {
  animation: far-drift 36s ease-in-out infinite alternate;
}

@media (prefers-reduced-motion: reduce) {
  .backdrop__far {
    animation: none;
    transform: none;
  }
}
```

Why this is good:

- Motion belongs to a meaningful layer.
- The static composition remains complete.
- Reduced-motion behavior is explicit.

## Bad: Large Automatic Motion

```css
.backdrop {
  animation: spin-and-zoom 8s linear infinite;
}
```

Problems:

- Full-screen motion competes with content.
- The effect can create vestibular risk.
- The scene has no reduced-motion contract.

## Good: Explicit Internal Transform Reference

```css
.pointer-layer {
  transform-box: fill-box;
  transform-origin: center;
  transform: translate(var(--pointer-offset-x), var(--pointer-offset-y));
}
```

## Bad: Implicit SVG Transform Origin

```css
.pointer-layer {
  transform-origin: 50% 50%;
  transform: rotate(10deg);
}
```

Problems:

- The reference box can differ from the intended element bounds.
- Results may change with grouping and viewBox geometry.

## Good: Static Asset Security Boundary

```vue
<script setup lang="ts">
import illustrationUrl from './illustration.svg'
</script>

<template>
  <img :src="illustrationUrl" alt="" />
</template>
```

Use source-controlled assets or a separately approved sanitization path.

## Bad: Untrusted `v-html`

```vue
<div v-html="remoteSvg" />
```

Problems:

- SVG can contain active content and URL-bearing attributes.
- The component bypasses Vue template safety.
- A filename or MIME type is not sanitization.

## Good: Focused Tests

```ts
it('creates unique definition ids for multiple instances', () => {
  const wrapper = mount({
    components: { Graphic },
    template: '<div><Graphic /><Graphic /></div>',
  })

  const ids = wrapper.findAll('linearGradient').map((node) => node.attributes('id'))

  expect(new Set(ids).size).toBe(ids.length)
})
```

Test contracts and references rather than the complete exported markup.

## Bad: Full SVG Snapshot As Primary Test

```ts
expect(wrapper.html()).toMatchSnapshot()
```

Problems:

- Harmless path formatting creates noise.
- A large snapshot hides missing semantics and broken references.
- Reviewers cannot see which contract matters.

## Final Review Checklist

### Activation And Dependencies

- [ ] The `vue-svg-graphics` profile is active through an allowed signal.
- [ ] `.codex/rules/vue3_typescript_vite.md`, `.codex/rules/vue_svg_graphics.md`, `vue3-typescript-vite-expert`, and `vue-svg-graphics-expert` are present and active.
- [ ] Optional CSS, animation, Tailwind, UI, and testing overlays are applied only when active.

### Rendering And Architecture

- [ ] Inline SVG is justified over a Vite-managed asset.
- [ ] The public API is semantic and typed.
- [ ] Geometry, paint, motion, and semantics have clear ownership.
- [ ] The `viewBox` and `preserveAspectRatio` policy are explicit.
- [ ] Numeric geometry is finite, normalized, deterministic, and tested.
- [ ] The SVG DOM is proportionate to the requirement.

### IDs And SSR

- [ ] Definition and ARIA IDs are unique across component instances.
- [ ] The ID strategy is supported by the active Vue version.
- [ ] Random, timestamp, and render-order IDs are absent.
- [ ] Every local reference resolves to the intended definition.
- [ ] SSR/hydration is checked when applicable.

### Accessibility And Security

- [ ] The graphic is classified as decorative, informative, functional, or complex.
- [ ] Accessible names and descriptions are stable and useful when required.
- [ ] Semantic HTML owns standard interactions.
- [ ] Required meaning does not depend only on color, motion, hover, or position.
- [ ] Untrusted SVG is not rendered through `v-html`.
- [ ] URL-bearing attributes and styles accept only trusted values.

### Design And Color

- [ ] Visual references were translated into reusable art-direction decisions rather than copied.
- [ ] Negative space, focal point, layer count, and crop safety are explicit.
- [ ] Semantic color channels replace path-specific literals.
- [ ] Light/dark, contrast, forced-colors, and non-color distinctions are considered.
- [ ] Accent, gradients, texture, and filters have a specific visual role.

### Motion And Browser Behavior

- [ ] The smallest correct animation mechanism is used.
- [ ] Internal SVG transforms declare their reference box and origin.
- [ ] Reduced-motion behavior produces a complete static state.
- [ ] High-frequency pointer or scroll updates avoid unnecessary Vue rerenders.
- [ ] Browser-sensitive SVG, CSS, filters, masks, and animation features were checked against exact project targets.
- [ ] Vite and Tailwind are not treated as SVG polyfills.

### Validation

- [ ] Geometry unit tests cover boundaries and invalid values.
- [ ] Component tests cover IDs, references, accessibility modes, and semantic variants.
- [ ] Representative landscape and portrait containers are checked when applicable.
- [ ] Required browser engines and UI states were validated or the gaps were reported.
- [ ] Complete-SVG snapshots are not the only evidence.
