---
name: vue-svg-graphics-expert
description: "Use for reusable parameterized SVG graphics in Vue 3, including typed geometry, gradients and masks, accessibility, design tokens, responsive composition, animation, and browser review."
---

# Vue SVG Graphics Expert

## 1. Scope And Activation

Use this skill for reusable SVG graphics rendered by Vue 3: parameterized icons, illustrations, backgrounds, charts, diagrams, indicators, and interactive graphics whose internal geometry, paint, semantics, or motion depend on typed Vue state.

Do not use this skill for generic Vue components that merely display an unchanged image, for standalone SVG files that have no Vue-rendered behavior, or for Canvas/WebGL rendering that does not use SVG as its primary output.

Read `CODEX_PROJECT.md` before implementation. Confirm the active `vue-svg-graphics` profile, Vue version, Vite build and asset policy, browser targets, SSR policy, SVG usage, rendering mode, ID strategy, geometry source, color-token source, accessibility policy, animation mechanisms, reduced-motion policy, optimization policy, validation matrix, and project commands.

Load references as needed:

- `references/component-architecture.md` for rendering boundaries, typed APIs, geometry ownership, definitions, and SSR-safe IDs.
- `references/browser-accessibility-and-motion.md` for browser-sensitive SVG behavior, accessibility modes, security, motion, and performance.
- `references/art-direction-and-color.md` for composition, visual hierarchy, semantic palette design, inspiration boundaries, and responsive backgrounds.
- `references/patterns-and-review.md` for concrete good/bad patterns and the final checklist.
- `references/official-sources.md` for official Vue, Vite, SVG, accessibility, Tailwind, and optimization sources.

## 2. Required Dependencies

- `.codex/rules/vue3_typescript_vite.md`
- `.codex/rules/vue_svg_graphics.md`
- `vue3-typescript-vite-expert`

The mutual `vue_svg_graphics.md` and `vue-svg-graphics-expert` dependency is intentional: the rule defines mandatory constraints and this skill defines the implementation and review workflow.

## 3. Optional Coordination

Apply additional active materials only when the task touches their area:

- `.codex/rules/css.md` and `css-expert` for shared CSS tokens, SFC styles, cascade, selectors, and runtime custom properties.
- `.codex/rules/css_animation.md` and `css-animation-expert` for transitions, keyframes, reduced motion, timing tokens, and modern motion features.
- `.codex/rules/tailwind_css.md` and `tailwind-expert` for Tailwind v4 theme variables, utilities, variants, source detection, and Vue class bindings.
- `.codex/rules/ui_ux_validation.md` and `ui-ux-review` for visible hierarchy, contrast, responsive behavior, interaction states, and browser evidence.
- `vitest-vue-testing` for Vue component tests when that testing profile is active.
- `vue-playwright-e2e-testing` or `playwright-ui-checks-mcp` for browser and visual validation when those profiles are active.

Do not silently activate an optional styling, motion, testing, or browser-validation overlay.

## 4. Workflow

1. Read the project profile and inspect the active Vue, Vite, styling, motion, testing, and browser policies.
2. Classify the graphic as decorative, informative, functional, or complex.
3. Classify the rendering problem as static asset, reusable inline SVG, sprite symbol, data-driven graphic, or a case that should use Canvas/WebGL instead.
4. Convert the visual request into an explicit contract: purpose, composition, layers, geometry source, semantic variants, color roles, responsive crop behavior, motion, and accessibility.
5. Define the smallest semantic prop and event API before writing path data.
6. Separate geometry, paint, motion, and semantics in the implementation.
7. Establish a stable `viewBox`, aspect-ratio policy, and deterministic ID strategy.
8. Implement pure geometry helpers before wiring Vue reactivity when calculations are non-trivial.
9. Apply only active optional overlays.
10. Compare the implementation with `references/patterns-and-review.md`.
11. Run or report project-declared type, test, build, and browser validation commands.

## 5. Rendering Decision

Prefer a Vite-managed SVG asset when all of these are true:

- the internal SVG tree is static;
- runtime themes do not need to style individual elements;
- internal animation or interaction is not required;
- the image can be treated as one external graphic.

Prefer an inline Vue SVG component when one or more of these are true:

- typed props change geometry or semantic variants;
- individual layers use project design tokens or runtime CSS variables;
- internal elements require animation or accessible metadata;
- multiple instances need local gradients, masks, clip paths, markers, or filters;
- the SVG participates in component state or interaction.

Evaluate a symbol sprite when many repeated icons share stable geometry and the project accepts sprite ownership and styling constraints.

Evaluate Canvas or WebGL when thousands of primitives update frequently, pixel-level effects dominate, or the SVG DOM would become the primary performance cost.

## 6. Component Architecture

Organize reusable graphics around four boundaries:

1. **Geometry** — coordinates, paths, scales, arcs, points, bounds, and clipping shapes.
2. **Paint** — fills, strokes, gradients, opacity, patterns, filters, and semantic color tokens.
3. **Motion** — transition state, keyframes, timelines, pointer offsets, and reduced-motion behavior.
4. **Semantics** — decorative/informative mode, accessible name, description, interaction contract, and equivalent data.

Use props that describe the graphic's meaning or supported variants. Prefer `progress`, `value`, `variant`, `tone`, `state`, `accent`, `density`, or `focalPoint` over path-specific styling props.

Use typed geometry helpers for calculations. Keep them pure and independently testable. Use `computed` for derived geometry and Vue state; use `watch` only for side effects or external integration.

Allow ordinary SVG attributes on the root element through the project-approved attribute fallthrough pattern. Do not recreate `class`, `style`, `width`, `height`, `role`, and data attributes as bespoke props unless the component contract requires validation or transformation.

## 7. Coordinate System And Responsive Composition

- Use one stable coordinate system per component through an explicit `viewBox`.
- Treat CSS dimensions and SVG coordinates as separate concerns.
- Choose `meet`, `slice`, alignment, or `none` based on the actual product requirement.
- For full-bleed backgrounds, define a safe composition area and identify which edges may be cropped.
- Prefer a small number of named geometry presets for materially different landscape and portrait compositions instead of exposing every coordinate as a prop.
- Use `vector-effect="non-scaling-stroke"` only when the visual contract requires constant stroke width during scaling.
- Validate text, strokes, clipping, and focal elements at representative container sizes.

## 8. Definitions, IDs, And Hydration

Use local deterministic IDs for every reusable definition and ARIA reference.

When Vue `useId()` is available in the active version, call it once during setup and derive related IDs from that stable value. When it is unavailable or unsuitable, use an explicit `idPrefix` prop or a project-owned deterministic allocator.

Never create IDs from random values, timestamps, array indexes, geometry coordinates, or client-only state. Verify multiple component instances and SSR hydration when SSR is active.

Keep definitions close to the owning SVG unless a project-approved sprite or shared-definition architecture is active. Ensure every paint-server URL and accessibility reference resolves within the rendered document.

## 9. Accessibility And Security

Choose one accessibility mode explicitly:

- **Decorative** — hide the SVG from assistive technologies when it adds no information beyond adjacent content.
- **Informative** — provide a stable accessible name and optional description.
- **Functional** — put interaction on a semantic HTML control and treat the SVG as its visual content.
- **Complex** — provide equivalent structured text, data, or explanation outside the SVG when needed.

Do not rely on `<title>` alone for complex information. Do not use color, animation, hover, or spatial placement as the only carrier of required meaning.

Do not render untrusted SVG or HTML through `v-html`. Static filenames and MIME types do not make SVG content safe. Use source-controlled markup, Vite-managed assets, or an explicitly approved sanitization pipeline.

## 10. Color And Art Direction

Translate references into reusable visual decisions instead of reproducing a specific asset. Extract hierarchy, negative space, silhouette language, layer count, focal point, lighting direction, value contrast, color roles, density, and motion character.

Use semantic paint channels. Examples include `primary`, `secondary`, `surface`, `muted`, `highlight`, `grid`, `danger`, and domain-specific roles such as `sky`, `duneFar`, or `accent`.

Prefer `currentColor` for single-color icons. Prefer CSS custom properties for multi-layer illustrations, charts, and backgrounds. Keep palette ownership in project design tokens or the component theme boundary rather than individual paths.

When Tailwind v4 is active, use its theme variables and complete statically detectable utility classes. Keep Tailwind at the component boundary unless utilities on individual elements materially improve clarity.

Validate contrast, non-color distinctions, light/dark themes, forced-colors behavior, and overlays against the active UI policy.

## 11. Motion

Choose the smallest mechanism that fits the behavior:

- CSS transition for a simple state change;
- CSS keyframes for a named sequence or loop;
- normalized `pathLength` with dash properties for line drawing;
- Web Animations API or controlled Vue state for an interactive timeline;
- SMIL only for a justified autonomous SVG behavior that does not carry application state;
- script-driven geometry only when CSS or declarative SVG cannot express the requirement safely.

Set `transform-box` and `transform-origin` explicitly for internal SVG transformations. Prefer transform and opacity where possible. Keep motion subtle for full-bleed backgrounds and avoid large automatic spatial movement.

Use `requestAnimationFrame` and CSS custom properties for high-frequency pointer updates when that avoids Vue component rerenders. Always provide a reduced-motion path for non-trivial motion.

## 12. Browser Compatibility And Performance

Treat these as separate checks:

- Vite JavaScript transform target;
- Vite CSS target and CSS processing;
- Tailwind version compatibility;
- native SVG element and attribute support;
- SVG accessibility behavior;
- CSS animation and transform behavior inside SVG.

Verify browser-sensitive features against the project's exact target matrix. Do not infer support from the presence of Vite or Tailwind.

Keep the DOM small enough for the visual requirement. Avoid unnecessary groups, duplicated geometry, component-per-primitive abstractions, unbounded point lists, and heavyweight filters. Measure or simplify when masks, blurs, blend modes, shadows, or large translucent layers are used.

Review SVG optimization configuration before applying it. Preserve `viewBox`, runtime IDs, definitions, accessibility metadata, semantic grouping, and attributes controlled by Vue or CSS.

## 13. Testing And Review

Test geometry functions for boundaries, invalid inputs, path structure, finite output, and deterministic results.

Test Vue components for:

- decorative and informative modes;
- stable accessible names and descriptions;
- unique IDs across multiple instances;
- correct `url(#...)`, `href`, and ARIA references;
- semantic prop mapping;
- invalid value normalization;
- light/dark and reduced-motion behavior when active;
- SSR/hydration when applicable.

Use focused assertions rather than snapshots of complete SVG strings. Use browser and visual checks for crop behavior, gradients, clipping, masks, filters, strokes, text, forced colors, reduced motion, and start/end animation states.

End review with `references/patterns-and-review.md` and report any unavailable target browser, route, server, data fixture, or validation tool explicitly.
