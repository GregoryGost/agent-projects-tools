# CSS Animation Patterns And Review

Use this reference when designing or reviewing CSS animation, transitions, and motion behavior.

This reference extends `css-expert`. General CSS architecture stays in `css-expert`; this file covers motion-specific decisions, fallbacks, accessibility, and browser-sensitive animation features.

## Core Principles

- Use motion only when it improves orientation, feedback, continuity, or perceived responsiveness.
- Keep motion optional for understanding state.
- Prefer transitions for simple state changes.
- Prefer keyframes for multi-step, looping, or timeline-specific motion.
- Prefer transform and opacity when possible.
- Keep motion tokens centralized: duration, delay, easing, distance, and scale.
- Provide a reduced-motion path for non-trivial motion.
- Treat scroll-driven animations and view transitions as progressive enhancements unless browser policy explicitly allows relying on them.

## Good: Tokenized Transition

```css
:root {
  --motion-duration-fast: 160ms;
  --motion-ease-standard: cubic-bezier(0.2, 0, 0, 1);
}

.button {
  transform: translateY(0);
  transition:
    transform var(--motion-duration-fast) var(--motion-ease-standard),
    opacity var(--motion-duration-fast) var(--motion-ease-standard);
}

.button:hover {
  transform: translateY(-1px);
}

.button:disabled {
  opacity: 0.6;
}
```

Why this is good:

- Motion timing is centralized.
- Transitioned properties are limited and visible.
- Disabled state remains explicit.

## Bad: Ad Hoc Transition Everywhere

```css
.button {
  transition: all 0.7s ease-in-out;
}
```

Problems:

- `all` can animate unintended properties.
- Duration is arbitrary and not project-owned.
- Future property changes can accidentally become animated.

## Good: Keyframes For Named Multi-Step Motion

```css
@keyframes skeleton-shimmer {
  from {
    background-position: 100% 0;
  }

  to {
    background-position: -100% 0;
  }
}

.skeleton {
  background: linear-gradient(90deg, var(--color-muted), var(--color-muted-strong), var(--color-muted));
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.2s linear infinite;
}
```

Why this is good:

- The sequence has a descriptive name.
- The keyframes describe a reusable visual behavior.
- The loop is easy to locate and review.

## Bad: Anonymous Or Decorative Loop Without Ownership

```css
.card::after {
  animation: pulse 800ms infinite;
}

@keyframes pulse {
  50% {
    opacity: 0.2;
  }
}
```

Problems:

- Ownership and purpose are unclear.
- Infinite motion may distract users.
- There is no reduced-motion path.

## Good: Reduced-Motion Path

```css
.drawer {
  transform: translateX(0);
  transition: transform 220ms ease;
}

.drawer[hidden] {
  transform: translateX(100%);
}

@media (prefers-reduced-motion: reduce) {
  .drawer {
    transition: none;
  }
}
```

Why this is good:

- Motion-sensitive users are respected.
- Component state still changes without animation.
- The fallback is scoped to the affected component.

## Bad: Critical State Only In Motion

```css
.save-status {
  animation: flash-success 900ms ease;
}
```

Problems:

- Users who reduce or miss motion may not receive the status.
- The state has no durable visual or semantic representation.
- Review cannot verify accessible feedback.

## Good: Entry Transition With `@starting-style`

```css
.popover {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 160ms ease, transform 160ms ease;

  @starting-style {
    opacity: 0;
    transform: translateY(0.5rem);
  }
}
```

Why this is good:

- The starting state is visible in CSS.
- First-render transition does not need script-only setup.
- The entry motion stays close to the component rule.

## Bad: Entry State Hidden Outside CSS

```css
.popover {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 160ms ease, transform 160ms ease;
}
```

Problems:

- The initial transition state is not documented in CSS.
- Behavior depends on external timing.
- Reviewers cannot see the entry animation contract.

## Good: Registered Animatable Custom Property

```css
@property --meter-value {
  syntax: "<number>";
  inherits: false;
  initial-value: 0;
}

.meter {
  --meter-value: 0;
  transform: scaleX(calc(var(--meter-value) / 100));
  transition: --meter-value 180ms ease;
}

.meter[data-value="75"] {
  --meter-value: 75;
}
```

Why this is good:

- The custom property has a declared type and initial value.
- Animation behavior is explicit.
- The property does not accidentally inherit.

## Bad: Untyped Custom Property Animation

```css
.meter {
  --meter-value: 0;
  transition: --meter-value 180ms ease;
}

.meter[data-value="75"] {
  --meter-value: 75;
}
```

Problems:

- The browser may treat the custom property as an untyped token stream.
- Interpolation can fail or become discrete.
- Inheritance behavior is not documented.

## Good: Scroll-Driven Animation As Enhancement

```css
.progress {
  transform-origin: left center;
  transform: scaleX(0);
}

@supports (animation-timeline: scroll()) {
  .progress {
    animation: progress-grow linear both;
    animation-timeline: scroll(root block);
  }

  @keyframes progress-grow {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
  }
}
```

Why this is good:

- The baseline remains stable.
- Scroll-driven behavior is optional.
- The animation timeline is clearly scoped.

## Bad: Required UI State Only In Scroll Animation

```css
.progress {
  animation: progress-grow linear both;
  animation-timeline: scroll(root block);
}
```

Problems:

- Unsupported browsers can lose the progress indicator behavior.
- The component has no clear baseline.
- The animation becomes required instead of progressive.

## Good: Optional View Transition With Motion Policy

```css
@view-transition {
  navigation: auto;
}

::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 180ms;
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation-duration: 1ms;
  }
}
```

Why this is good:

- Navigation transition behavior is explicit.
- Reduced-motion preference is respected.
- The feature remains optional to page behavior.

## Bad: Long View Transition Without Motion Policy

```css
@view-transition {
  navigation: auto;
}

::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 900ms;
}
```

Problems:

- Motion-sensitive users are not considered.
- Navigation can feel slower than necessary.
- The transition becomes a UX risk instead of enhancement.

## Good: Vue Transition Classes

```vue
<template>
  <Transition name="fade-slide">
    <p v-if="isVisible" class="message">Saved</p>
  </Transition>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 160ms ease, transform 160ms ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(0.25rem);
}

@media (prefers-reduced-motion: reduce) {
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: none;
  }
}
</style>
```

Why this is good:

- Vue transition classes match component enter/leave behavior.
- Timing is visible in CSS.
- Reduced-motion behavior is scoped to the transition.

## Bad: Vue Transition Timing Split Across CSS And Script

```vue
<Transition name="fade" :duration="900">
  <p v-if="isVisible">Saved</p>
</Transition>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 160ms ease;
}
</style>
```

Problems:

- CSS and Vue duration disagree.
- Leave/enter behavior can become hard to reason about.
- Reviewers must inspect two places for one motion contract.

## Review Questions

- Is this behavior actually motion, or should it remain static CSS?
- Is the smallest correct mechanism used: transition, keyframes, starting style, custom property, scroll timeline, or view transition?
- Is reduced-motion behavior present for non-trivial motion?
- Does motion communicate critical state without a non-motion fallback?
- Are animated properties performance-safe or justified?
- Are duration, delay, easing, and distance values tokenized when the project has motion tokens?
- Are scroll-driven animations and view transitions progressive enhancements?
- Do Vue transition classes and component timing agree when Vue is active?
