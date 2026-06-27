---
name: vue-expert
description: "Use for Vue 3 frontend work with TypeScript and Vite: SFCs, Composition API, script setup, props/emits/slots, composables, Vite-aware changes, and Vue review."
---

# Vue Expert

Use this skill for Vue 3 frontend implementation, review, refactoring, and diagnosis in projects that declare the `vue-frontend` profile.

Apply `CODEX_PROJECT.md`, `.codex/rules/typescript_core.md`, `.codex/rules/vue_frontend.md`, and `typescript-core` together with this skill.

Load references when needed:

- `references/review-checklist.md` for Vue review checks.
- `references/vite-guidelines.md` for Vite-specific changes.
- `references/official-sources.md` for official documentation links.

## Baseline

The portable Vue frontend baseline is:

- Vue 3;
- TypeScript;
- Vite;
- Single-File Components;
- Composition API;
- `<script setup lang="ts">` for new SFC work unless the project convention requires another pattern.

Router, Pinia, VueUse, Tailwind, SCSS, Playwright, and other overlays must be activated separately in `CODEX_PROJECT.md`.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm the active Vue profile, package manager, validation commands, active overlays, and natural-language policy.
3. Inspect relevant files before editing: component, composable, route, store, style entry, `vite.config.*`, `tsconfig*`, and `package.json` as needed.
4. Identify the intended behavior and the smallest component/composable boundary for the change.
5. Preserve existing public contracts unless the task explicitly changes them.
6. Use TypeScript boundaries for props, emits, composables, and external data.
7. Keep template markup semantic and readable.
8. Run or report project-declared validation commands when possible.

## Component Guidelines

- Prefer small components with one clear responsibility.
- Keep reusable logic in composables.
- Keep presentational constants and helpers near the component unless reused.
- Prefer `computed` for derived state.
- Use `watch` only for side effects or integration with external APIs.
- Avoid broad reactive objects when separate refs or typed state objects are clearer.
- Do not add an empty `<style>` block.
- Do not force a local style block when Tailwind/shared styles already solve the problem.
- Preserve project naming conventions for components, composables, stores, and routes.

## TypeScript In Vue

- Type props and emits explicitly.
- Type composable inputs and returns at public boundaries.
- Avoid `any`, unsafe casts, and unchecked route/query values.
- Keep template-facing state simple enough for Vue template type checking.
- Do not use `defineComponent` or `PropType` in new SFCs unless the project convention or a compatibility need requires it.

## Vite Awareness

Vite is part of this skill. Use `references/vite-guidelines.md` before changing build, dev server, env, aliases, static assets, or plugin behavior.

Do not create a separate Vite workflow unless the project profile explicitly overrides the portable Vue baseline.

## Overlay Routing

- Use `vue-router-expert` only when Vue Router is active or route behavior is touched.
- Use `pinia-expert` only when Pinia is active or store behavior is touched.
- Use `vueuse-expert` only when VueUse is active or VueUse code is touched.
- Use `scss-tailwind-expert` only when Tailwind or Sass/SCSS is active or styling is touched.
- Use `playwright-ui-checks-mcp` only when UI validation through Playwright MCP is active or requested.

## Review Checklist

- [ ] `CODEX_PROJECT.md` and Vue profile were checked.
- [ ] Vite assumptions were checked when build/dev/assets/env behavior changed.
- [ ] Props, emits, slots, composables, and external data are typed.
- [ ] Component responsibilities remain small.
- [ ] Template markup remains semantic and accessible enough for the task scope.
- [ ] Active overlays were applied only when declared or directly touched.
- [ ] Project-declared validation was run or explicitly reported as unavailable.
