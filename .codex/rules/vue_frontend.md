# Vue frontend rules

Apply this rule only when `CODEX_PROJECT.md` declares the `vue-frontend` active stack profile.

The portable Vue frontend profile assumes:

- Vue 3;
- TypeScript;
- Vite as the build tool;
- Single-File Components;
- Composition API;
- `<script setup lang="ts">` for new Vue SFC work unless the existing project pattern requires otherwise.

## Required skills

Use together with:

- `typescript-core`;
- `vue-expert`.

Do not apply Router, Pinia, VueUse, Tailwind, SCSS, Playwright, or other overlay workflows unless the corresponding rule or skill is active in `CODEX_PROJECT.md` or the task explicitly touches that area.

## Source of truth

Before changing Vue code:

1. Read `CODEX_PROJECT.md`.
2. Check the TypeScript/JavaScript profile, Vue profile, package manager, validation commands, and active overlays.
3. Inspect `package.json`, `vite.config.*`, `tsconfig*`, router/store/style entry points when relevant.
4. Follow existing project conventions unless they conflict with an active rule or explicit user instruction.

## Vue constraints

- Prefer Composition API and `<script setup lang="ts">` for new components.
- Keep SFC sections ordered as project conventions require; if no convention exists, use `script`, `template`, then `style` when a style block is needed.
- Do not add an empty `style` block only to satisfy a template.
- Use semantic HTML in templates when possible.
- Keep component responsibilities small and explicit.
- Use composables for reusable stateful logic.
- Type props, emits, slots, route params, store interactions, and async boundaries.
- Do not introduce project-specific directories such as `server/api`, `src/ui`, or `components/images` unless the project profile declares them.
- Do not hardcode package scripts, dev server URLs, or artifact paths.

## Vite constraints

Vite is part of this Vue profile, not a separate skill.

- Read `vite.config.*` before changing aliases, plugins, static assets, environment variables, or build behavior.
- Do not change Vite plugins, aliases, env prefixes, or build targets without checking affected imports and call sites.
- Use project-declared scripts for dev/build/preview/typecheck instead of assuming names.
- Treat `import.meta.env` and Vite modes as project-level configuration boundaries.

## Review expectations

Review template behavior, reactivity, TypeScript boundaries, accessibility-sensitive markup, active overlays, Vite assumptions, and declared validation commands together.
