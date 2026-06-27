# Codex Project Profile Template

This file is a template. Copy it to the repository root as `CODEX_PROJECT.md` and replace all placeholders.

Do not keep project-specific values in portable `.codex/rules/` or reusable `.agents/skills/` files. This profile is the project-specific source of truth.

Natural language policy is independent from programming languages. A project may use any programming-language stack while still requiring a separate natural-language policy for user-facing answers, commit messages, documentation, task notes, comments, or docstrings.

## Project Identity

- Project key: `<PROJECT_KEY>`
- Workspace: `<WORKSPACE_NAME>`
- Project type: `<backend / frontend / fullstack / library / cli / embedded / firmware / infrastructure / documentation / mixed / other>`
- Primary programming languages: `<Python / TypeScript / JavaScript / C / C++ / Go / Rust / Java / none / other>`
- Secondary programming languages: `<list or none>`

## Natural Language Profile

- User-facing answers language: `<language>`
- Git commit text language: `<language>`
- Obsidian task/note language: `<language / not applicable>`
- Test/comment natural language policy: `<language rule>`
- Documentation natural language policy: `<language rule>`
- Keep code identifiers, library names, protocol names, command names, paths, package names, and other proper names in English or their original language: `<yes/no>`

## Code Style Profile

- Indentation: `<2 spaces / 4 spaces / tabs / project formatter>`
- Formatter: `<tool / project-specific / none>`
- Linter: `<tool / project-specific / none>`
- Type checker / static analyzer: `<tool / project-specific / none>`
- IDE/editor assumptions: `<VSCode / JetBrains / none / other>`
- Code comments/docstrings: `<language/style rule>`
- README policy: `<short / detailed / project-specific>`
- Temporary workaround policy: `<policy>`

## Active Stack Profiles

List only profiles that apply to this repository.

- `<python-backend / fastapi-api / typescript / vue-frontend / frontend-code-quality / frontend-testing / node-backend / cpp-native / embedded-firmware / obsidian-mcp / playwright-ui-validation / none / other>`

## Active Rules

List only rule files that should normally be applied for this project.

- Core rules: `<.codex/rules/*.md list>`
- Language rules: `<.codex/rules/*.md list or none>`
- Framework rules: `<.codex/rules/*.md list or none>`
- Styling rules: `<.codex/rules/*.md list or none>`
- Code quality rules: `<.codex/rules/*.md list or none>`
- Testing rules: `<.codex/rules/*.md list or none>`
- Review rules: `<.codex/rules/*.md list or none>`
- UI validation rules: `<.codex/rules/*.md list or none>`
- External-system rules: `<.codex/rules/*.md list or none>`

## Active Skills

List only reusable skills that should be available for this project. Do not activate database/framework/external-system overlays that do not match this repository.

- Core skills: `<skill list or none>`
- Language skills: `<skill list or none>`
- Framework skills: `<skill list or none>`
- Frontend styling skills: `<skill list or none>`
- Frontend code quality skills: `<skill list or none>`
- Frontend testing skills: `<skill list or none>`
- UI validation skills: `<skill list or none>`
- Persistence/database skills: `<skill list or none>`
- HTTP/client skills: `<skill list or none>`
- Security skills: `<skill list or none>`
- External-system skills: `<skill list or none>`

## Build And Test Commands

- Install dependencies: `<command or none>`
- Format check: `<command or none>`
- Format write: `<command or none>`
- Format: `<command or none>`
- Lint: `<command or none>`
- Type check / static analysis: `<command or none>`
- Unit tests: `<command or none>`
- Component/integration tests: `<command or none>`
- Test coverage: `<command or none>`
- Integration tests: `<command or none>`
- Build: `<command or none>`
- UI validation: `<command or MCP workflow or none>`
- Other validation: `<command or none>`

## Runtime / Programming Language Profiles

Use only the blocks that match this repository. Delete or set unused blocks to `none` in the actual `CODEX_PROJECT.md`.

### Python Profile

- Python enabled: `<yes/no>`
- Python version: `<version constraint / none>`
- Python dependency manager: `<poetry / uv / pip / none / other>`
- Python virtual environment policy: `<.venv / project-specific / none>`
- Active Python rule: `<none>`
- Active Python skills: `<skill list / none>`

### TypeScript / JavaScript Profile

- TypeScript/JavaScript enabled: `<yes/no>`
- Runtime: `<Node.js / browser / Deno / Bun / none / other>`
- Package manager: `<npm / pnpm / yarn / none / other>`
- Framework: `<Vue / React / Svelte / Express / NestJS / none / other>`
- Build tool: `<Vite / Webpack / Rollup / tsc / none / other>`
- TypeScript config path: `<tsconfig path / project-specific / none>`
- Active TypeScript/JavaScript rules: `<rule list / none>`
- Active TypeScript/JavaScript skills: `<skill list / none>`

### Vue Frontend Profile

Use only when the project declares `vue-frontend`.

- Vue frontend enabled: `<yes/no>`
- Vue version: `<version constraint / project-specific>`
- Vue API style: `<Composition API / Options API / project-specific>`
- Vue SFC policy: `<script setup lang="ts" / project-specific>`
- Vue build tool policy: `<Vite required / project-specific>`
- Vite config path: `<vite.config.ts / vite.config.js / project-specific / none>`
- Vue Router enabled: `<yes/no>`
- Pinia enabled: `<yes/no>`
- VueUse enabled: `<yes/no>`
- Active Vue rules: `<.codex/rules/vue_frontend.md, overlays, or none>`
- Active Vue skills: `<vue-expert, overlays, or none>`

### Frontend Styling Profile

Use only when the project declares frontend styling rules or skills.

- Tailwind CSS enabled: `<yes/no>`
- Tailwind CSS version: `<version constraint / project-specific / none>`
- Tailwind config path: `<path / none / project-specific>`
- Tailwind stylesheet path: `<path / none / project-specific>`
- Sass/SCSS enabled: `<yes/no>`
- Sass implementation: `<sass / project-specific / none>`
- Global style entry points: `<path list / none>`
- Design tokens source: `<CSS variables / Tailwind theme / SCSS variables / design system / none / other>`
- Component style policy: `<Tailwind-first / scoped SCSS / shared SCSS / project-specific>`
- Active styling rules: `<.codex/rules/frontend_styling.md / none>`
- Active styling skills: `<scss-tailwind-expert / none>`

### Frontend Code Quality Profile

Use only when the project declares frontend linting, formatting, or type-checking workflows.

- Frontend code quality enabled: `<yes/no>`
- Package manager: `<pnpm / npm / yarn / bun / project-specific>`
- Package manager version: `<version / project-specific / none>`
- ESLint enabled: `<yes/no>`
- ESLint config path: `<eslint.config.ts / eslint.config.js / eslint.config.mjs / project-specific / none>`
- ESLint profile: `<base-js / typescript / vue-typescript / project-specific / none>`
- ESLint command: `<command / none>`
- ESLint report artifact policy: `<delete after review / keep as artifact / none / project-specific>`
- Prettier enabled: `<yes/no>`
- Prettier config path: `<.prettierrc / .prettierrc.json / prettier.config.js / project-specific / none>`
- Prettier ignore path: `<.prettierignore / project-specific / none>`
- Prettier policy: `<separate command / through ESLint / project-specific>`
- Format check command: `<command / none>`
- Format write command: `<command / none>`
- Tailwind Prettier plugin enabled: `<yes/no>`
- Vue SFC type check enabled: `<yes/no>`
- Vue SFC type check command: `<command / none>`
- Stylelint enabled: `<yes/no>`
- Stylelint config path: `<stylelint.config.* / project-specific / none>`
- Active code quality rules: `<.codex/rules/frontend_code_quality.md, overlays, or none>`
- Active code quality skills: `<frontend-code-quality, overlays, or none>`

### Frontend Testing Profile

Use only when the project declares frontend unit, component, or integration testing workflows.

- Frontend testing enabled: `<yes/no>`
- Test runner: `<Vitest / Jest / project-specific / none>`
- Test config path: `<vitest.config.ts / vite.config.ts / project-specific / none>`
- Unit test command: `<command / none>`
- Component/integration test command: `<command / none>`
- Coverage command: `<command / none>`
- Coverage enabled: `<yes/no>`
- Coverage provider: `<v8 / istanbul / project-specific / none>`
- DOM test environment: `<node / jsdom / happy-dom / project-specific / none>`
- Test setup files: `<path list / none>`
- Vue Test Utils enabled: `<yes/no>`
- Pinia testing enabled: `<yes/no>`
- Router testing policy: `<mocked router / real router per test / project-specific / none>`
- Network mocking policy: `<mocked fetch / MSW / project-specific / none>`
- Test file pattern: `<*.spec.ts / *.test.ts / project-specific>`
- Active frontend testing rules: `<.codex/rules/vitest_vue_testing.md / none>`
- Active frontend testing skills: `<vitest-vue-testing / none>`

### UI Validation Profile

Use only when browser UI validation is enabled.

- Browser UI validation enabled: `<yes/no>`
- Playwright MCP enabled: `<yes/no>`
- Playwright MCP server name: `<name / project-specific / none>`
- Dev server URL: `<url / project-specific / none>`
- Target routes for smoke validation: `<route list / project-specific / none>`
- Wait target policy: `<selector/text/accessibility target / project-specific>`
- UI artifacts path: `<path / none / project-specific>`
- Active UI validation rules: `<.codex/rules/playwright_ui_validation.md / none>`
- Active UI validation skills: `<playwright-ui-checks-mcp / none>`

### C / C++ Profile

- C/C++ enabled: `<yes/no>`
- Language standard: `<C17 / C23 / C++20 / C++23 / project-specific / none>`
- Build system: `<CMake / Make / Meson / Bazel / project-specific / none>`
- Compiler/toolchain: `<GCC / Clang / MSVC / embedded toolchain / project-specific / none>`
- Static analysis: `<clang-tidy / cppcheck / project-specific / none>`
- Active C/C++ rules: `<rule list / none>`
- Active C/C++ skills: `<skill list / none>`

## Backend / API Profile

Use only when the project has a backend/API component.

- Backend/API enabled: `<yes/no>`
- Web/API framework: `<FastAPI / Express / NestJS / ASP.NET / none / other>`
- HTTP schema layer: `<Pydantic / Zod / OpenAPI generator / none / other>`
- API documentation: `<OpenAPI / none / other>`
- Active backend/API skills: `<skill list / none>`

## Database Profile

Use only when the project has a database.

- Database enabled: `<yes/no>`
- Database toolkit/ORM: `<SQLAlchemy / Prisma / TypeORM / raw SQL / none / other>`
- Active database: `<SQLite / PostgreSQL / MySQL / MSSQL / none / other>`
- Common database skill: `<skill name / none>`
- Active database-specific skill: `<skill name / none>`
- Migration tool: `<raw SQL / Alembic / Prisma migrations / Flyway / none / other>`
- Migration policy: `<project-specific policy>`

## Persistence / Runtime Write Policy

Use only when the project has a persistence-specific runtime policy.

- Runtime write policy: `<direct / queue / event-sourced / project-specific / none>`
- Single process/worker assumption: `<yes/no/not applicable>`
- Read path policy: `<project-specific / none>`
- Write path policy: `<project-specific / none>`
- Durability/backpressure policy: `<project-specific / none>`

## HTTP Client Profile

Use only when the project makes outgoing HTTP calls.

- HTTP client enabled: `<yes/no>`
- HTTP client library: `<HTTPX / fetch / axios / requests / curl / none / other>`
- HTTP retry layer: `<httpx-retries / none / project-specific / other>`
- Active HTTP client skill: `<skill name / none>`

## Cache Profile

Use only when the project uses application caching.

- Cache enabled: `<yes/no>`
- Cache library/backend: `<cashews / Redis / in-memory / none / other>`
- Active cache skill/rule: `<skill or rule / none>`

## External Systems Profile

Use only when the project uses external systems or connectors.

### Obsidian

- Obsidian enabled: `<yes/no>`
- Obsidian access: `<MCP only / none / other>`
- Active Obsidian skill: `<obsidian-semantic-notes-mcp / none>`
- Obsidian project logical root: `<MCP logical root / MCP-configured root / none>`
- Obsidian Templater enabled: `<yes/no>`
- Obsidian Templater role: `<canonical formatting source / disabled / project-specific>`
- Templater executable logic policy: `<explicit user approval required / project-specific / none>`
- Local context fallback outbox: `<path, default .agent_context/context/ / none>`
- Local task fallback outbox: `<path, default .agent_context/tasks/ / none>`

## Dependency Policy

- New dependencies require explicit user approval: `<yes/no>`
- Runtime dependencies policy: `<policy>`
- Development dependencies policy: `<policy>`
- Security-sensitive dependencies policy: `<policy>`

## Project Description

- Primary project documentation: `<README.md / docs path / none>`
