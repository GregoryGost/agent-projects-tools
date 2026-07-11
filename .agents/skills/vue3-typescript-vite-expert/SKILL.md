---
name: vue3-typescript-vite-expert
description: "Use for Vue 3 frontend work with TypeScript and Vite: SFCs, Composition API, script setup, props/emits/slots, composables, Vite-aware changes, and Vue review."
---

# Vue 3 + TypeScript + Vite Expert

Use this skill for Vue 3 frontend implementation, review, refactoring, and diagnosis in projects that declare the `vue3-typescript-vite` profile.

Apply `.codex/rules/vue3_typescript_vite.md`, `typescript-core`, and `CODEX_PROJECT.md` together with this skill.

Load references when needed:

- `references/review-checklist.md` for Vue review checks.
- `references/vite-guidelines.md` for Vite-specific changes.
- `references/official-sources.md` for official documentation links.

## Baseline

The portable Vue frontend baseline is Vue 3, TypeScript, Vite, SFC, Composition API, and `<script setup lang="ts">`.

Router, Pinia, VueUse, Tailwind, SCSS, testing, and UI validation are separate overlays.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm the active Vue profile, package manager, validation commands, active overlays, and natural-language policy.
3. Inspect relevant files before editing: component, composable, `vite.config.*`, `tsconfig*`, and `package.json` as needed.
4. Identify the intended behavior and the smallest component/composable boundary for the change.
5. Preserve existing public contracts unless the task explicitly changes them.
6. Use TypeScript boundaries for props, emits, composables, and external data.
7. Keep template markup semantic and readable.
8. Run or report project-declared validation commands when possible.

## Component Guidelines

- Prefer small components with one clear responsibility.
- Keep reusable logic in composables.
- Prefer `computed` for derived state.
- Use `watch` only for side effects or external integration.
- Avoid broad reactive objects when separate refs or typed state objects are clearer.
- Do not add empty `<style>` blocks.
- Preserve project naming conventions for components and composables.

## Vite Awareness

Vite is part of this skill. Use `references/vite-guidelines.md` before changing build, dev server, env, aliases, static assets, or plugin behavior.
