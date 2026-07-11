# Vue 3 + TypeScript + Vite rules

Apply this rule only when `CODEX_PROJECT.md` declares the `vue3-typescript-vite` active stack profile.

The portable Vue frontend baseline assumes:

- Vue 3;
- TypeScript;
- Vite as the build tool;
- Single-File Components;
- Composition API;
- `<script setup lang="ts">` for new Vue SFC work unless the existing project pattern requires otherwise.

## Required skills

Use together with:

- `typescript-core`;
- `vue3-typescript-vite-expert`.

Router, Pinia, VueUse, Tailwind, SCSS, UI validation, and testing are separate stages and must be activated by their own rules and skills.

## Source of truth

Before changing Vue code:

1. Read `CODEX_PROJECT.md`.
2. Check the TypeScript/JavaScript profile, Vue profile, package manager, validation commands, and active overlays.
3. Inspect `package.json`, `vite.config.*`, `tsconfig*`, and relevant source files.
4. Follow existing project conventions unless they conflict with an active rule or explicit user instruction.

## Vue constraints

- Prefer Composition API and `<script setup lang="ts">` for new components.
- Keep component responsibilities small and explicit.
- Use composables for reusable stateful logic.
- Type props, emits, slots, and external data boundaries.
- Use semantic HTML in templates when possible.
- Do not add empty style blocks.
- Do not hardcode package scripts, dev server URLs, artifact paths, or project-specific directories.

## Vite constraints

Vite is part of this Vue profile, not a separate skill.

- Read `vite.config.*` before changing aliases, plugins, assets, environment variables, or build behavior.
- Use project-declared scripts for dev/build/preview/typecheck instead of assuming names.
- Treat `import.meta.env` and Vite modes as project-level configuration boundaries.