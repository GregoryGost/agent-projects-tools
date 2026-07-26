# SVG Art Direction And Color

Use this reference when a request describes a visual style, layered background, illustration mood, palette, or composition rather than an already specified component contract.

## Translate Style Into A Contract

Do not start by writing path data. First translate the request into explicit decisions:

- purpose and placement;
- decorative, informative, functional, or complex role;
- focal point and safe content area;
- negative-space ratio;
- number and ownership of layers;
- silhouette and shape language;
- lighting direction and value hierarchy;
- semantic color roles;
- optional accent policy;
- responsive crop behavior;
- motion character;
- performance budget.

A useful brief is concrete enough to review but does not freeze every coordinate.

## Inspiration Boundary

Extract reusable qualities from visual references:

- monumental or intimate scale;
- sparse or dense composition;
- smooth, angular, organic, or technical silhouettes;
- high-key, low-key, or split lighting;
- warm, cool, neutral, or complementary palette;
- atmospheric depth;
- rhythm and repetition;
- restrained or energetic motion.

Do not trace or reproduce a specific poster, screenshot, illustration, logo, character, building, interface, or distinctive arrangement unless the project has the required rights and the task explicitly requires reproduction.

Use neutral component and variant names. Prefer `cinematic`, `survival`, `eclipse`, `warm`, or `night` over names tied to an external franchise.

## Composition Budget

For minimal graphics, define a budget before adding details. Example:

```text
Purpose: decorative full-bleed hero background
Major layers: 4 to 6
Primary focal elements: 1
Accent colors: 0 or 1
Fine-detail regions: 0 or 1
Motion groups: 0 to 2
Safe content area: central or declared edge region
```

The numbers are task-specific guidance, not universal limits. Their purpose is to prevent uncontrolled detail growth.

## Layered Background Pattern

A reusable layered background often needs these logical groups:

1. base field or sky;
2. celestial or focal object;
3. atmosphere or haze;
4. distant silhouette;
5. middle plane;
6. near plane;
7. optional accent.

Each layer should contribute depth, hierarchy, crop safety, motion, or semantics. Remove layers that exist only because an export tool generated them.

### Good: Meaningful Layer Names

```vue
<g class="backdrop__sky">...</g>
<g class="backdrop__atmosphere">...</g>
<g class="backdrop__far">...</g>
<g class="backdrop__middle">...</g>
<g class="backdrop__near">...</g>
<g class="backdrop__accent">...</g>
```

### Bad: Export-Oriented Names

```vue
<g id="Layer_17_copy_2">...</g>
<path id="Path_9321">...</path>
```

Export identifiers do not describe ownership and are poor CSS, motion, testing, and review boundaries.

## Negative Space

Minimal backgrounds require deliberate empty space. Reserve an area where page content remains readable without depending on accidental gaps between paths.

Define:

- primary content zone;
- permitted crop edges;
- focal-object exclusion zone;
- maximum local contrast behind text;
- overlay or scrim policy when content varies.

Do not solve every readability problem by adding a dark translucent rectangle. Prefer composition, value control, and localized gradients first.

## Responsive Composition

Choose one of these strategies:

### Safe Central Composition

Keep all important geometry inside a central safe region and allow edges to crop through `preserveAspectRatio="xMidYMid slice"`.

Use this for simple backgrounds whose focal point survives both landscape and portrait containers.

### Named Composition Presets

Use separate geometry presets when portrait and landscape need materially different placement:

```ts
type Composition = 'landscape' | 'portrait'
```

Move the focal object, adjust the dominant curve, and redistribute negative space through a named preset. Do not expose dozens of coordinate props.

### Edge-Aligned Focal Point

Use explicit `preserveAspectRatio` alignment or variant geometry when content must remain on one side and the visual focal point on the other.

Validate representative extreme ratios, not only the design canvas ratio.

## Semantic Color Roles

Use role names that survive palette changes:

```css
.graphic {
  --graphic-sky-top: var(--color-scene-sky-top);
  --graphic-sky-bottom: var(--color-scene-sky-bottom);
  --graphic-far: var(--color-scene-far);
  --graphic-middle: var(--color-scene-middle);
  --graphic-near: var(--color-scene-near);
  --graphic-highlight: var(--color-scene-highlight);
  --graphic-accent: var(--color-scene-accent);
}
```

Avoid implementation-only names:

```css
.graphic {
  --path-1-color: #cc7744;
  --path-2-color: #884422;
  --circle-7-color: #ffcc66;
}
```

Semantic channels let themes, variants, and contrast policies change without rewriting geometry.

## Single-Color Graphics

Use `currentColor` for simple icons and functional marks:

```vue
<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <!-- Icon paths. -->
</svg>
```

The surrounding control can then own hover, focus, disabled, high-contrast, and theme behavior.

## Multi-Layer Graphics

Use CSS custom properties for layer paint:

```vue
<path class="backdrop__far" fill="var(--backdrop-far)" />
<path class="backdrop__middle" fill="var(--backdrop-middle)" />
<path class="backdrop__near" fill="var(--backdrop-near)" />
```

Keep literal colors in a project-owned token layer or a small documented component theme boundary.

When Tailwind v4 is active, its `@theme` variables may provide the source tokens. Do not require a utility class on every path when semantic custom properties are clearer.

## Value Hierarchy

Establish depth primarily through lightness, contrast, overlap, scale, and edge sharpness. Do not depend on a large collection of unrelated hues.

For a minimal layered scene:

- the far plane usually has lower contrast;
- the middle plane carries the dominant silhouette;
- the near plane may provide the strongest dark or light anchor;
- the focal element receives the clearest local contrast;
- atmosphere softens separation without erasing forms.

Test the image in grayscale. If the intended hierarchy disappears, the palette may be carrying too much structural responsibility.

## Accent Color

Use an accent only when it has one clear role:

- focal highlight;
- interactive state;
- domain value;
- selected data series;
- rare atmospheric event.

Keep its area and repetition controlled. An accent that appears across every layer stops functioning as an accent.

Do not use color alone for required meaning. Pair data or state accents with labels, shape, pattern, stroke, or another durable cue.

## Gradients And Transparency

Use gradients to support lighting, atmosphere, or hierarchy. Avoid gradients that merely add complexity.

Check:

- final composited contrast;
- banding at large sizes;
- overlap with text areas;
- dark and light theme behavior;
- clipping and filter bounds;
- forced-colors fallback.

Do not use transparent fills over an unknown background without defining the compositing contract.

## Texture And Noise

SVG filters and procedural noise can be expensive and inconsistent. For minimal backgrounds:

- prefer clean geometry first;
- add texture only when it materially supports the art direction;
- keep the affected region bounded;
- test low-power mobile rendering;
- consider a small optimized raster texture when a vector filter provides no runtime benefit.

Do not add turbulence, blur, blend, and multiple masks merely to imitate a raster painting workflow.

## Motion Character

Describe motion with semantic qualities:

- ambient drift;
- restrained pulse;
- directional sweep;
- reveal;
- state transition;
- pointer parallax.

For a minimal full-bleed background, motion should normally be slow, low-amplitude, and non-essential. Limit independently moving groups so the scene preserves visual calm.

## Tailwind Boundary

Good uses of Tailwind around SVG include:

- container sizing and positioning;
- responsive visibility and placement;
- `fill-current` or `stroke-current` for simple graphics;
- theme-variable overrides;
- state and reduced-motion variants;
- layout around the SVG.

Avoid scattering raw palette utilities over many paths when the SVG has a semantic multi-layer palette.

Use complete statically detectable class names. Map semantic variants to complete class strings instead of constructing classes dynamically.

## Review Questions

- Was the style request translated into a concrete visual contract before path creation?
- Are inspiration and reproduction clearly separated?
- Is the number of layers and focal elements controlled?
- Is negative space protected for actual page content?
- Does the composition survive declared crop and aspect-ratio cases?
- Do semantic color roles replace path-specific literals?
- Does hierarchy remain understandable without hue or motion?
- Is the accent rare and purposeful?
- Are gradients, texture, and filters justified by visible value?
- Does optional motion preserve a complete static composition?
