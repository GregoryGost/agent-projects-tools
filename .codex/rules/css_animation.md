# CSS animation rules

Apply this rule only when `CODEX_PROJECT.md` declares CSS animation/motion active, or when the task directly changes CSS transitions, keyframes, animation timing, motion accessibility, scroll-driven animations, view transitions, entry/exit transitions, or Vue transition CSS.

This rule is an overlay over plain CSS. General CSS architecture and browser-compatibility rules come from `css.md`; this rule defines how to design and review motion.

## Required skills

Use together with:

- `css-expert`;
- `css-animation-expert`.

## Source of truth

Before changing CSS animation or motion:

1. Read `CODEX_PROJECT.md`.
2. Check CSS browser support policy, CSS build pipeline, animation/motion policy, reduced-motion policy, formatter/linter policy, and validation commands.
3. Inspect existing transitions, keyframes, animation tokens, timing/easing conventions, custom properties, Vue transition classes, scroll-driven animation rules, and view transition rules.
4. Load `css-animation-expert/references/patterns-and-review.md` when adding or changing transitions, keyframes, `@starting-style`, registered animatable custom properties, scroll-driven animations, view transitions, reduced-motion handling, or Vue transition CSS.
5. Use project-declared commands.

## Constraints

- Use transitions for simple state changes.
- Use keyframes for named multi-step sequences, loops, or timeline-specific behavior.
- Prefer transform and opacity for visual motion when possible.
- Avoid animating layout-heavy properties unless the cost is justified and measured.
- Keep motion durations, delays, easing, and distances tokenized when the project has motion tokens.
- Provide a reduced-motion path for non-trivial motion.
- Do not encode critical state only through animation.
- Do not add scroll-driven animations or view transitions as required behavior unless project browser policy explicitly allows it.
- Use `@starting-style` only when browser policy supports it or the transition has an acceptable fallback.
- Use registered custom properties for typed animatable tokens when custom-property animation is required.
- In Vue SFCs, keep transition class names and CSS timing aligned with component enter/leave behavior.

## Vue usage when active

- Use CSS animation in Vue only when the `vue3-typescript-vite` profile and CSS animation profile are active, or when existing Vue transition CSS is directly touched.
- Prefer Vue transition classes for component enter/leave motion.
- Keep reusable motion tokens in shared CSS files.
- Keep component-specific transition rules in local SFC style blocks when they belong only to that component.
- Preserve reduced-motion behavior for Vue transitions.
