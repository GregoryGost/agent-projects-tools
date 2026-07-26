# Vue SVG graphics rules

Apply this rule only when `CODEX_PROJECT.md` declares the `vue-svg-graphics` profile active, or when an already active Vue SVG component is directly changed and the project profile permits task-local activation.

This rule is an overlay for reusable, parameterized SVG graphics rendered by Vue 3. It does not replace general Vue, TypeScript, CSS, motion, Tailwind, UI/UX, or testing materials.

Apply `.codex/rules/vue3_typescript_vite.md` together with this rule.

## Required skills

Use together with:

- `vue3-typescript-vite-expert`;
- `vue-svg-graphics-expert`.

## Source of truth

Before creating or changing Vue-rendered SVG:

1. Read `CODEX_PROJECT.md`.
2. Confirm the active Vue version, Vite configuration, browser targets, SSR policy, SVG usage, rendering mode, ID strategy, geometry source, color-token source, accessibility policy, motion policy, optimization policy, and validation commands.
3. Inspect the affected Vue components, geometry helpers or composables, shared design tokens, styling entry points, Vite asset handling, and tests.
4. Load `vue-svg-graphics-expert/references/patterns-and-review.md` for implementation and review examples.
5. Use only project-declared commands and active optional overlays.

## Rendering boundary

- Use a normal Vite-managed SVG asset when the graphic is static and does not require internal styling, reactive geometry, internal animation, or element-level interaction.
- Use inline SVG in a Vue component when the internal SVG tree must react to typed props, semantic variants, theme variables, animation state, or accessible metadata.
- Do not convert every static illustration or icon into an inline Vue component. Account for DOM size, hydration cost, and update frequency.
- Evaluate Canvas or WebGL instead of SVG when the design requires very large numbers of frequently changing primitives or effects that are unsuitable for DOM rendering.

## Geometry and component contract

- Give every reusable SVG component an explicit, stable `viewBox`.
- Choose `preserveAspectRatio` deliberately. Use cropping, fitting, or non-uniform scaling only when the component contract requires it.
- Keep geometry in viewBox coordinates. Let CSS, attributes, or a small semantic size API control rendered dimensions.
- Prefer semantic props such as `value`, `progress`, `variant`, `tone`, `state`, or `focalPoint` over exposing one prop per path attribute.
- Keep geometry calculations in typed pure functions, computed values, or focused composables.
- Validate external numeric values before rendering. Do not emit `NaN`, `Infinity`, negative radii, invalid arc flags, or malformed path data.
- Prefer native SVG primitives such as `circle`, `rect`, `line`, and `polyline` when they express the geometry clearly.
- Preserve root SVG attribute fallthrough when it is part of the component contract; do not duplicate ordinary SVG attributes as props without a reason.

## IDs, definitions, and SSR

- Never use fixed document-global IDs for reusable gradients, masks, clip paths, filters, markers, symbols, titles, or descriptions.
- Use Vue `useId()` only when the active Vue version supports it and SSR/hydration behavior has been verified.
- Otherwise require an explicit stable `idPrefix` or a project-approved deterministic ID allocator.
- Derive all related IDs once during component setup. Do not generate them inside computed values, loops, watchers, or render-time random functions.
- Never use `Math.random()`, timestamps, array positions, or unstable data as SSR-sensitive SVG IDs.
- Keep every `url(#...)`, `href`, `aria-labelledby`, and `aria-describedby` reference aligned with the generated local ID.

## Accessibility and interaction

- Classify each graphic as decorative, informative, functional, or complex before implementation.
- Decorative SVG must be hidden from assistive technologies when adjacent content already communicates the same meaning.
- Informative SVG must have an accessible name and, when needed, a description using stable local IDs.
- Put button, link, form, focus, and keyboard semantics on appropriate HTML elements. Do not use clickable `path` or `g` elements as substitutes for standard controls.
- Complex charts or diagrams must provide equivalent structured text or data outside the SVG when the SVG tree alone cannot communicate the information reliably.
- Do not encode required meaning only through color, position, animation, or hover state.

## Color and art direction

- Separate geometry, paint, motion, and semantics.
- Use semantic color channels and project design tokens instead of scattering literal colors across individual paths.
- Prefer `currentColor` for single-color icons and simple functional graphics.
- Use CSS custom properties for multi-layer illustrations and runtime theme values.
- Treat Tailwind as an optional boundary and token source. Do not require Tailwind classes on every SVG element.
- Preserve required contrast, forced-colors behavior, light/dark themes, disabled states, and non-color distinctions according to the active UI policy.
- Translate visual references into reusable composition, hierarchy, spacing, shape, light, and palette decisions. Do not trace or reproduce protected artwork, logos, or distinctive assets unless the project has the required rights and the task explicitly requires it.

## Security

- Do not render untrusted SVG or HTML through `v-html`.
- Do not treat an `.svg` filename as proof that the content is safe.
- Use source-controlled SVG markup, Vite-managed static assets, or a separately approved and tested sanitization pipeline.
- Do not pass untrusted strings into `style`, paint-server URLs, external references, or event-handler attributes.

## Motion

- Apply `.codex/rules/css_animation.md` and `css-animation-expert` only when SVG motion is active.
- Prefer CSS transitions for simple state changes and CSS keyframes for named multi-step or looping sequences.
- Prefer `transform` and `opacity` for visual motion when possible.
- Set `transform-box` and `transform-origin` explicitly when transforming internal SVG elements.
- Provide a reduced-motion path for non-trivial motion.
- Do not make critical state depend on animation completion or animation events.
- Keep pointer or scroll-driven updates outside Vue render churn when CSS custom properties and `requestAnimationFrame` can update the visual state directly.
- Treat path morphing, SMIL, complex masks, filters, and browser-sensitive animation features as explicit review points, not default mechanisms.

## Browser and build compatibility

- Treat Vite JavaScript targets, Vite CSS targets, Tailwind compatibility, and native SVG support as separate compatibility boundaries.
- Do not assume Vite or Tailwind polyfills SVG elements, attributes, rendering behavior, accessibility behavior, or animation APIs.
- Check browser-sensitive SVG and CSS features against the exact browser targets declared by the project.
- Use progressive enhancement or a tested fallback when the baseline matrix does not support a required feature consistently.
- Do not add compatibility code for browsers outside the declared project policy.

## Performance and optimization

- Keep the SVG DOM proportional to the visual requirement.
- Avoid unnecessary nested groups, duplicated paths, invisible elements, and component-per-primitive abstractions.
- Use filters, blurs, masks, blend modes, and large translucent layers only when their visual value justifies their rendering cost.
- Do not optimize source SVG with an unreviewed tool configuration that can remove IDs, titles, viewBox data, accessibility metadata, or runtime-controlled attributes.
- Preserve deterministic markup for SSR, hydration, tests, and visual review.

## Validation

- Test pure geometry separately from Vue rendering.
- Test accessibility modes, unique IDs across multiple instances, local `url(#...)` references, semantic variants, invalid input normalization, and SSR/hydration when applicable.
- Validate representative landscape and portrait containers when the graphic can be cropped or resized.
- Validate active light, dark, reduced-motion, forced-colors, and interaction states when relevant.
- Use the project browser matrix for visual checks of gradients, masks, filters, clipping, strokes, text, and animation.
- Prefer contract assertions and focused visual evidence over large brittle snapshots of complete SVG markup.
