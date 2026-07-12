---
name: css-animation-expert
description: "Use for CSS transitions, keyframes, modern motion features, reduced-motion support, performance, and Vue transitions."
---

# CSS Animation Expert

Use this skill when `CODEX_PROJECT.md` declares CSS animation/motion active, or when the task directly touches CSS transitions, keyframes, animation timing, motion accessibility, scroll-driven animations, view transitions, entry/exit transitions, or Vue transition CSS.

This skill is an overlay for `css-expert`. Apply `.codex/rules/css.md`, `.codex/rules/css_animation.md`, `css-expert`, and this skill together.

Load references when needed:

- `references/patterns-and-review.md` for CSS animation good/bad patterns and review prompts.
- `references/official-sources.md` for official animation, transition, view transition, scroll-driven animation, reduced-motion, and Vue transition references.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm CSS browser support policy, CSS build pipeline, animation/motion policy, reduced-motion policy, and validation commands.
3. Inspect existing animation architecture: transitions, keyframes, custom properties, Vue transition classes, scroll-driven animations, and view transition rules.
4. Choose the smallest motion mechanism that fits the behavior:
   - transition for a simple state change;
   - keyframes for multi-step or looping motion;
   - `@starting-style` for entry transitions where supported;
   - registered custom properties for typed animatable tokens;
   - scroll-driven animation only for optional scroll-linked enhancement;
   - view transition only for project-approved page/view transitions.
5. Compare the intended change against `references/patterns-and-review.md`.
6. Check browser support and fallback requirements before relying on modern motion features.
7. Preserve reduced-motion behavior and do not encode critical state only in motion.
8. Run or report project-declared validation commands when applicable.

## Guardrails

- Prefer transform and opacity for visual motion when possible.
- Avoid animating layout-heavy properties such as width, height, top, left, margin, padding, or box-shadow unless the cost is justified and measured.
- Use transitions for local state changes and keyframes for named multi-step sequences.
- Keep keyframes close to the component or motion system that owns them.
- Use CSS custom properties to centralize durations, delays, easing, and distance tokens.
- Always provide a reduced-motion path for non-trivial motion.
- Do not rely on animation as the only way to communicate loading, error, success, focus, or navigation state.
- Treat scroll-driven animations and view transitions as progressive enhancements unless project browser policy says otherwise.
- In Vue projects, keep Vue transition class names and CSS timing aligned with the component behavior.

## Review Checklist

- [ ] Base CSS rules from `css-expert` were applied first.
- [ ] The motion mechanism matches the behavior.
- [ ] Reduced-motion behavior was preserved or added.
- [ ] Browser support and fallback strategy were checked for modern animation features.
- [ ] Motion does not carry critical state by itself.
- [ ] Animated properties are performance-safe or the cost is justified.
- [ ] Durations, delays, easing, and distances use project tokens when available.
- [ ] Vue transition classes match Vue component behavior when `.vue` files are affected.
