# Vue Expert Review Checklist

Load this file when implementing or reviewing Vue frontend changes.

## Project Context

- [ ] `CODEX_PROJECT.md` was read.
- [ ] `vue-frontend` is active or the task explicitly touches Vue code.
- [ ] Active overlays are known: Vue Router, Pinia, VueUse, Tailwind/SCSS, Playwright.
- [ ] Package versions and project scripts were checked when relevant.

## Vue SFC Structure

- [ ] New SFCs use the project-preferred SFC pattern; default is `<script setup lang="ts">`.
- [ ] No empty `<style>` block was added.
- [ ] SFC order follows project convention.
- [ ] Component name and file path follow project naming policy.
- [ ] Component has one clear responsibility.

## Reactivity

- [ ] Derived state uses `computed` where appropriate.
- [ ] `watch` is used only for side effects, external integration, or intentional synchronization.
- [ ] Reactive state is not duplicated unnecessarily.
- [ ] Cleanup is handled for listeners, timers, subscriptions, and external APIs.

## TypeScript

- [ ] Props and emits are typed.
- [ ] Slots or exposed APIs are typed when public behavior depends on them.
- [ ] Composable inputs and returns are typed at boundaries.
- [ ] Route/query/store/external data is narrowed before use.
- [ ] No unjustified `any`, broad casts, or non-null assertions were introduced.

## Template And UX

- [ ] Template uses semantic HTML where possible.
- [ ] Conditional rendering is clear and avoids impossible states.
- [ ] Lists use stable keys.
- [ ] Form controls have labels or accessible names.
- [ ] Loading, empty, and error states are handled when the task affects async UI.

## Vite

- [ ] `vite.config.*` was checked when aliases, plugins, env, build, or asset behavior changed.
- [ ] Script names came from `CODEX_PROJECT.md` or `package.json`.
- [ ] `import.meta.env` usage follows project conventions.

## Validation

- [ ] Project-declared type check, lint, format, build, test, or UI validation commands were run when applicable.
- [ ] Skipped validation is explained by missing commands, unavailable services, or task scope.
