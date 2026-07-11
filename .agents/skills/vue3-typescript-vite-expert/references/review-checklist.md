# Vue 3 + TypeScript + Vite Expert Review Checklist

Load this file when implementing or reviewing Vue frontend changes.

## Project Context

- [ ] `CODEX_PROJECT.md` was read.
- [ ] `vue3-typescript-vite` is active or the task explicitly touches Vue code.
- [ ] Active overlays are known and not assumed.
- [ ] Package versions and project scripts were checked when relevant.

## Vue SFC Structure

- [ ] New SFCs use the project-preferred SFC pattern; default is `<script setup lang="ts">`.
- [ ] Component has one clear responsibility.
- [ ] No empty `<style>` block was added.
- [ ] Component naming follows project policy.

## Reactivity And TypeScript

- [ ] Derived state uses `computed` where appropriate.
- [ ] `watch` is used only for side effects or integration.
- [ ] Props, emits, composables, and external data are typed.
- [ ] No unjustified `any`, broad casts, or non-null assertions were introduced.

## Template And UX

- [ ] Template uses semantic HTML where possible.
- [ ] Lists use stable keys.
- [ ] Loading, empty, and error states are handled when the task affects async UI.

## Vite

- [ ] `vite.config.*` was checked when aliases, plugins, env, build, or asset behavior changed.
- [ ] Script names came from `CODEX_PROJECT.md` or `package.json`.