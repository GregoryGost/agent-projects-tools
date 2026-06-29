# Codex Project Profile Template

This file is a detailed template. Copy it to the repository root as `CODEX_PROJECT.md` and replace placeholders.

This template is not a rule. Keep it outside `.codex/rules/`.

## Activation Semantics

The template may list many possible profiles, rules, skills, commands, and policy blocks.

The final `CODEX_PROJECT.md` must contain only what applies to the concrete project:

- active stack profiles;
- active rule files;
- active skills;
- active commands;
- active integrations;
- project-specific policies.

Omitted entries and entries set to `none` are inactive. Remove unused optional sections from the final `CODEX_PROJECT.md`.

## Project Discovery Rule

When `CODEX_PROJECT.md` is missing, infer the project profile from repository files first: manifests, package manager files, lockfiles, framework configs, source tree, test configs, build configs, and documentation.

If the project type, stack, or intended active profiles cannot be determined with confidence from repository files, ask the user before creating `CODEX_PROJECT.md`.

## Project Identity

- Project key: `<PROJECT_KEY>`
- Workspace: `<WORKSPACE_NAME>`
- Project type: `<backend / frontend / fullstack / library / cli / embedded / firmware / infrastructure / documentation / mixed / other>`
- Primary programming languages: `<Python / TypeScript / JavaScript / C / C++ / Go / Rust / Java / none / other>`
- Secondary programming languages: `<list or none>`

## Natural Language Profile

- User-facing answers language: `<language>`
- Git commit text language: `<language>`
- Documentation language policy: `<language rule>`
- Test/comment natural language policy: `<language rule>`
- Keep identifiers, library names, protocol names, command names, paths, package names, and other proper names in English or original language: `<yes/no>`

## Active Stack Profiles

List only profiles active in this repository.

Selection examples:

- `typescript-core`
- `typescript-testing`
- `eslint-typescript`
- `prettier-formatting`
- `nodejs-service-e2e-testing`
- `vue-frontend`
- `vue-router`
- `pinia`
- `vueuse`
- `vitest-vue-testing`
- `vue-router-testing`
- `pinia-testing`
- `vueuse-testing`
- `vue-playwright-e2e-testing`
- `css`
- `css-animation`
- `tailwind-css`
- `scss`
- `ui-ux-validation`
- `playwright-ui-validation-mcp`
- `obsidian-mcp`
- `jira-data-center`

Active profiles for this project:

- `<active profile list>`

## Active Rules

List only rule files active in this project.

- Formatting/linting rules: `<prettier_formatting.md / eslint_typescript.md / none>`
- Language rules: `<typescript_core.md / typescript_testing.md / none / other>`
- Framework rules: `<vue_frontend.md / vue_router.md / pinia.md / vueuse.md / none / other>`
- Styling rules: `<css.md / css_animation.md / tailwind_css.md / scss_styling.md / none>`
- UI/browser validation rules: `<ui_ux_validation.md / playwright_ui_validation.md / none>`
- E2E rules: `<vue_playwright_e2e_testing.md / nodejs_service_e2e_testing.md / none>`
- External-system rules: `<active list or none>`

## Active Skills

List only reusable skills active in this project.

- Language skills: `<typescript-core / typescript-testing / none / other>`
- Formatting/linting skills: `<prettier-formatting / eslint-typescript / none>`
- Framework skills: `<vue-expert / vue-router-expert / pinia-expert / vueuse-expert / none>`
- Styling skills: `<css-expert / css-animation-expert / tailwind-expert / scss-expert / none>`
- UI/browser validation skills: `<ui-ux-review / playwright-ui-checks-mcp / none>`
- E2E skills: `<vue-playwright-e2e-testing / nodejs-service-e2e-testing / none>`
- External-system skills: `<obsidian-semantic-notes-mcp / jira-data-center / none / other>`

## Build And Validation Commands

Use only project-declared commands.

- Install dependencies: `<command or none>`
- Format: `<command or none>`
- Format check: `<command or none>`
- Lint: `<command or none>`
- Type check / static analysis: `<command or none>`
- Unit tests: `<command or none>`
- Integration tests: `<command or none>`
- E2E tests: `<command or none>`
- UI validation / Playwright MCP workflow: `<workflow or none>`
- Build: `<command or none>`
- Preview/start app for browser tests: `<command or none>`
- Other validation: `<command or none>`

## Formatting And Linting Profile

Keep only when formatting or linting is active.

- Prettier enabled: `<yes/no>`
- Prettier config path: `<path / none>`
- Prettier ignore path: `<path / none>`
- Prettier check command: `<command / none>`
- Prettier write command: `<command / none>`
- Prettier plugin policy: `<no plugins / project-approved only / list>`
- Tailwind class sorting enabled through Prettier: `<yes/no/not applicable>`
- ESLint enabled: `<yes/no>`
- ESLint config path: `<path / none>`
- ESLint conflict handling with Prettier: `<eslint-config-prettier / project-specific / none>`
- Formatter scope policy: `<changed files only / targeted globs / full repository / project-specific>`

## TypeScript / JavaScript Profile

Keep only when TypeScript or JavaScript is active.

- TypeScript/JavaScript enabled: `<yes/no>`
- Runtime: `<Node.js / browser / Deno / Bun / none / other>`
- Package manager: `<npm / pnpm / yarn / none / other>`
- Framework: `<Vue / Express / NestJS / none / other>`
- Build tool: `<Vite / Webpack / Rollup / tsc / none / other>`
- TypeScript config paths: `<tsconfig paths / none>`

## Node.js Service Profile

Keep only for non-browser Node.js services.

- Node.js service enabled: `<yes/no>`
- Service boundary: `<HTTP API / CLI / worker / queue consumer / scheduled job / mixed / none>`
- Runtime entrypoint: `<path / none>`
- Composition root: `<path / none>`
- Environment loading policy: `<.env / process env / project-specific / none>`
- Real dependency policy for tests: `<Testcontainers / Docker Compose / local services / none / project-specific>`
- Active Node.js service E2E rule: `<nodejs_service_e2e_testing.md / none>`
- Active Node.js service E2E skill: `<nodejs-service-e2e-testing / none>`

## Vue Frontend Profile

Keep only when `vue-frontend` is active.

- Vue frontend enabled: `<yes/no>`
- Vue version: `<3.x / project-specific / none>`
- TypeScript in Vue SFCs: `<yes/no>`
- Build tool: `<Vite / project-specific / none>`
- SFC style policy: `<plain CSS / SCSS / CSS Modules / Tailwind utilities / mixed / project-specific>`
- Vue Router enabled: `<yes/no>`
- Pinia enabled: `<yes/no>`
- VueUse enabled: `<yes/no>`

## Styling Profile

Keep only styling subsections used by the project.

### Plain CSS

- CSS enabled: `<yes/no>`
- CSS entry points: `<paths / none>`
- CSS Modules enabled: `<yes/no>`
- Browser support policy: `<policy / browserslist / project-specific>`
- Active CSS rule/skill: `<css.md + css-expert / none>`

### CSS Animation / Motion

- CSS animation/motion enabled: `<yes/no>`
- Motion token source: `<CSS custom properties / design system / none / project-specific>`
- Reduced-motion policy: `<required / project-specific / none>`
- Active CSS animation rule/skill: `<css_animation.md + css-animation-expert / none>`

### Tailwind CSS

- Tailwind enabled: `<yes/no>`
- Tailwind version/integration: `<v4 / v3 / project-specific / none>`
- Tailwind stylesheet entry point: `<path / none>`
- If SCSS is active, Tailwind import/directives live in SCSS entry point: `<yes/no/not applicable>`
- Tailwind class sorting enabled through Prettier: `<yes/no>`
- Active Tailwind rule/skill: `<tailwind_css.md + tailwind-expert / none>`

### SCSS

- SCSS enabled: `<yes/no>`
- Sass implementation: `<Dart Sass / project-specific / none>`
- SCSS entry points: `<paths / none>`
- Shared SCSS module policy: `<@use/@forward / legacy @import allowed / project-specific>`
- Active SCSS rule/skill: `<scss_styling.md + scss-expert / none>`

## UI / Browser Validation Profile

Keep only when UI/UX validation or Playwright MCP validation is active.

- UI/UX validation enabled: `<yes/no>`
- Active UI/UX rule/skill: `<ui_ux_validation.md + ui-ux-review / none>`
- Playwright MCP validation enabled: `<yes/no>`
- Playwright MCP server name: `<name / none>`
- Dev server URL source: `<CODEX_PROJECT.md / env / project-specific / none>`
- Target routes for UI validation: `<routes / project-specific / none>`
- Screenshot/artifact path: `<path / none>`

## Testing Profiles

Keep only testing subsections used by the project.

### TypeScript Unit / Integration Testing

- TypeScript testing enabled: `<yes/no>`
- Test runner: `<Jest / Vitest / project-specific / none>`
- Unit test command: `<command / none>`
- Integration test command: `<command / none>`
- Active test rules/skills: `<typescript_testing.md + typescript-testing / none>`

### Vue Unit / Component Testing

- Vue component testing enabled: `<yes/no>`
- Test runner: `<Vitest / project-specific / none>`
- Vue Test Utils enabled: `<yes/no>`
- Active Vue testing rule/skill: `<vitest_vue_testing.md + vitest-vue-testing / none>`
- Router testing overlay: `<vue_router_testing.md + vue-router-testing / none>`
- Pinia testing overlay: `<pinia_testing.md + pinia-testing / none>`
- VueUse testing overlay: `<vueuse_testing.md + vueuse-testing / none>`

### Vue Playwright E2E Testing

- Vue Playwright E2E enabled: `<yes/no>`
- Playwright config path: `<path / none>`
- E2E command: `<command / none>`
- App start/preview command: `<command / none>`
- Base URL source: `<config/env/project-specific / none>`
- Browser matrix: `<chromium/firefox/webkit/project-specific>`
- Active Vue Playwright E2E rule/skill: `<vue_playwright_e2e_testing.md + vue-playwright-e2e-testing / none>`

### Node.js Service E2E Testing

- Node.js service E2E enabled: `<yes/no>`
- E2E boundary: `<HTTP API / CLI / worker / queue / database-backed flow / filesystem flow / mixed>`
- E2E command: `<command / none>`
- Dependency setup: `<Testcontainers / Docker Compose / project-specific / none>`
- Active Node.js service E2E rule/skill: `<nodejs_service_e2e_testing.md + nodejs-service-e2e-testing / none>`

## External Systems Profile

Keep only external-system subsections used by the project.

### Obsidian

- Obsidian enabled: `<yes/no>`
- Obsidian access: `<MCP only / none / other>`
- Active Obsidian skill: `<obsidian-semantic-notes-mcp / none>`

## Dependency Policy

- New dependencies require explicit user approval: `<yes/no>`
- Runtime dependencies policy: `<policy>`
- Development dependencies policy: `<policy>`
- Security-sensitive dependencies policy: `<policy>`

## Project Description

- Primary project documentation: `<README.md / docs path / none>`
- Architecture documentation: `<docs path / Obsidian logical path / none>`
- Important project notes: `<freeform / none>`
