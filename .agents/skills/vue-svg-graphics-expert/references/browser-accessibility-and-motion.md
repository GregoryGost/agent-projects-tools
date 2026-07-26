# SVG Browser, Accessibility, And Motion Guidance

Use this reference when a Vue SVG depends on browser-sensitive rendering, accessible metadata, internal interaction, animation, or optimization.

## Compatibility Boundaries

Treat these as separate sources of behavior:

1. Vite transforms JavaScript according to the configured build target.
2. Vite and the configured CSS pipeline process CSS according to their declared target and plugins.
3. Tailwind generates CSS utilities and theme variables within its own browser baseline.
4. Browsers implement SVG elements, attributes, CSS-in-SVG behavior, accessibility mappings, and animation APIs natively.

Do not assume one boundary polyfills another.

Before relying on a feature, inspect the exact project browser matrix and verify:

- the SVG element or attribute;
- CSS properties applied to SVG elements;
- accessibility behavior in the target browser and assistive-technology environment;
- animation start, interpolation, and fallback behavior;
- rendering of gradients, masks, clip paths, filters, text, and strokes.

## Stable Baseline Patterns

Prefer an explicit `viewBox`, deliberate `preserveAspectRatio`, modern `href`, local definitions, CSS custom properties, `currentColor`, and ordinary CSS transitions or keyframes when these satisfy the requirement.

Use `vector-effect="non-scaling-stroke"` only when stroke width must remain visually constant during scaling.

Use normalized `pathLength` when line-drawing progress should be independent of the path's measured length:

```vue
<path
  pathLength="1"
  class="route"
  :style="{ '--route-progress': progress }"
/>
```

```css
.route {
  stroke-dasharray: 1;
  stroke-dashoffset: calc(1 - var(--route-progress));
}
```

Validate the result in every required engine because stroke rendering and antialiasing can differ.

## Internal Transforms

Set the transform reference explicitly for internal SVG elements:

```css
.rotor {
  transform-box: fill-box;
  transform-origin: center;
  transform: rotate(var(--rotor-angle));
}
```

Do not assume the percentage origin resolves against the element bounding box. Verify transformed groups, nested coordinate systems, and clipped elements in target browsers.

## Decorative SVG

Use decorative mode when the SVG adds no information beyond adjacent content:

```vue
<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
  <!-- Decorative geometry. -->
</svg>
```

Do not add a redundant accessible name to an SVG that merely repeats visible text.

## Informative SVG

Use stable local IDs:

```vue
<script setup lang="ts">
import { useId } from 'vue'

const id = useId()
const titleId = `${id}-title`
const descriptionId = `${id}-description`
</script>

<template>
  <svg
    role="img"
    :aria-labelledby="`${titleId} ${descriptionId}`"
    viewBox="0 0 100 100"
  >
    <title :id="titleId">Storage utilization</title>
    <desc :id="descriptionId">Seventy-five percent used</desc>
    <!-- Graphic. -->
  </svg>
</template>
```

Keep the title concise. Use visible text or structured data when the explanation is too long or important to remain hidden metadata.

## Functional SVG

Put interaction on semantic HTML:

```vue
<button type="button" aria-label="Close dialog" @click="close">
  <CloseIcon aria-hidden="true" />
</button>
```

Avoid:

```vue
<path tabindex="0" @click="close" />
```

A raw path does not automatically provide button semantics, keyboard behavior, focus styling, disabled behavior, or a reliable target size.

If an interactive SVG surface is genuinely required, define keyboard navigation, focus order, target size, accessible names, state exposure, pointer behavior, and equivalent non-pointer operation explicitly.

## Complex Graphics

Charts, diagrams, maps, and process visualizations may require:

- visible labels;
- a text summary;
- a legend with non-color distinctions;
- an equivalent HTML table or list;
- keyboard-accessible data navigation;
- explicit selected and focused states.

Do not assume that every SVG group and path will form a useful accessibility tree automatically.

## Color And Contrast

Do not distinguish required states only by hue. Combine color with text, shape, pattern, stroke style, marker form, position, or another durable cue.

Check final composited colors against their actual backgrounds. Transparency, gradients, blend modes, and overlays can change effective contrast.

For functional icons, controls, chart marks, focus indicators, and other meaningful graphical objects, apply the project's non-text contrast policy. For text inside SVG, apply the same text contrast policy as equivalent HTML text.

Validate forced-colors mode. Prefer `currentColor` for simple functional graphics. Use `forced-color-adjust: none` only when preserving author colors is necessary for meaning and an accessible alternative remains available.

## Security Boundary

Never render untrusted SVG through `v-html`:

```vue
<!-- Unsafe for untrusted content. -->
<div v-html="remoteSvg" />
```

SVG can contain active content, external references, styles, event handlers, and URL-bearing attributes. Use one of these approaches instead:

- source-controlled inline markup;
- a Vite-managed static asset;
- a server-generated raster preview;
- a separately approved sanitizer with explicit tests and a narrow supported SVG subset.

Do not allow untrusted strings to become `style`, `href`, paint-server URLs, filter references, or event-handler attributes.

## Motion Mechanism

Choose the smallest mechanism:

- transition for one state change;
- keyframes for a named sequence or loop;
- `pathLength` and dash properties for line drawing;
- Web Animations API for a controlled timeline when CSS is insufficient;
- SMIL for a justified autonomous SVG-specific animation;
- script-driven geometry only when declarative mechanisms cannot satisfy the requirement.

Do not use animation events as the only trigger for business state or critical UI progression.

## Reduced Motion

Provide a meaningful static or simplified state:

```css
.backdrop__far {
  animation: backdrop-drift 36s ease-in-out infinite alternate;
}

@media (prefers-reduced-motion: reduce) {
  .backdrop__far {
    animation: none;
    transform: none;
  }
}
```

Do not merely slow a large spatial animation when the safe behavior is to remove it.

For full-screen or full-bleed graphics:

- keep automatic movement subtle;
- avoid large zoom, rotation, or parallax by default;
- do not make background motion compete with reading;
- provide pause or stop controls when prolonged movement is not purely incidental and the active UI policy requires control.

## High-Frequency Pointer Updates

Avoid driving every pointer event through Vue rendering:

```ts
let frame = 0
let nextX = 0
let nextY = 0

function onPointerMove(event: PointerEvent): void {
  nextX = event.clientX
  nextY = event.clientY

  if (frame !== 0) {
    return
  }

  frame = requestAnimationFrame(() => {
    frame = 0
    root.value?.style.setProperty('--pointer-x', String(nextX))
    root.value?.style.setProperty('--pointer-y', String(nextY))
  })
}
```

Keep cleanup in the owning lifecycle. Disable pointer-following motion for reduced-motion users and non-pointer environments.

## Path Morphing

Treat path morphing as a browser and data-contract feature:

- start and end paths need compatible command structure;
- invalid intermediate geometry must not be rendered;
- fallback state must remain understandable;
- target browsers must be checked visually;
- reduced-motion behavior must not depend on completing the morph.

Do not accept arbitrary unrelated path strings as a generic morphing API.

## Filters, Masks, And Blend Modes

Use heavyweight effects sparingly. Check:

- filter region bounds and clipping;
- blur cost on large surfaces;
- mask luminance versus alpha behavior;
- stacking and blend differences;
- forced-colors behavior;
- low-power mobile performance;
- visual fallback when an effect is unavailable or disabled.

Avoid decorative filters when a gradient, opacity change, or simpler geometry provides the same hierarchy.

## Optimization Safety

Review the SVG optimization configuration. Protect:

- `viewBox`;
- local IDs and references;
- `<title>` and `<desc>`;
- semantic groups used by CSS or Vue;
- `data-*`, `aria-*`, `role`, and focus attributes;
- runtime-bound attributes;
- intentionally separate paths used for state or animation.

Do not run an optimizer blindly on Vue templates or generated components.

## Browser Review Questions

- Which exact browser targets govern this component?
- Is the feature native SVG, CSS-in-SVG, an animation API, or build output?
- Is an unsupported feature optional or required?
- Does the SVG have one explicit accessibility mode?
- Is required meaning available without color and motion?
- Are untrusted SVG and URL-bearing attributes excluded?
- Does reduced motion produce a complete static state?
- Are filters, masks, text, and transformed elements visually checked in target engines?
