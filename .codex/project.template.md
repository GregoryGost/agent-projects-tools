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

- `python-core`
- `python-testing`
- `python-service-e2e-testing`
- `python-fastapi`
- `python-cache`
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

- Core rules: `<.codex/rules/request_routing.md / source_code_hygiene.md / none>`
- Python/backend rules: `<python_fastapi.md / python_cache.md / none>`
- Formatting/linting rules: `<prettier_formatting.md / eslint_typescript.md / none>`
- Language rules: `<typescript_core.md / typescript_testing.md / none / other>`
- Framework rules: `<vue_frontend.md / vue_router.md / pinia.md / vueuse.md / none / other>`
- Styling rules: `<css.md / css_animation.md / tailwind_css.md / scss_styling.md / none>`
- UI/browser validation rules: `<ui_ux_validation.md / playwright_ui_validation.md / none>`
- E2E rules: `<python_service_e2e_testing.md / vue_playwright_e2e_testing.md / nodejs_service_e2e_testing.md / none>`
- External-system rules: `<active list or none>`

## Active Skills

List only reusable skills active in this project.

- Code prose / language-policy skills: `<comment-language-audit / none>`
- Python skills: `<python-core / python-testing / python-fastapi-expert / python-cache / none / other>`
- Language skills: `<typescript-core / typescript-testing / none / other>`
- Formatting/linting skills: `<prettier-formatting / eslint-typescript / none>`
- Framework skills: `<vue-expert / vue-router-expert / pinia-expert / vueuse-expert / none>`
- Styling skills: `<css-expert / css-animation-expert / tailwind-expert / scss-expert / none>`
- UI/browser validation skills: `<ui-ux-review / playwright-ui-checks-mcp / none>`
- E2E skills: `<python-service-e2e-testing / vue-playwright-e2e-testing / nodejs-service-e2e-testing / none>`
- Database skills: `<python-sqlalchemy-core / python-sqlalchemy-sqlite / none / other>`
- HTTP/client skills: `<python-httpx-client / none / other>`
- Security skills: `<python-backend-security / none / other>`
- External-system skills: `<obsidian-semantic-notes-mcp / jira-data-center / none / other>`

## Build And Validation Commands

Use only project-declared commands.

- Command source of truth: `<CODEX_PROJECT.md / package scripts / pyproject.toml / Makefile / task runner / none>`
- Tool executable policy: `<project venv / package-manager scripts / global tools allowed / project-specific / none>`
- Install dependencies: `<command or none>`
- Format: `<command or none>`
- Format check: `<command or none>`
- Lint: `<command or none>`
- Type check / static analysis: `<command or none>`
- Unit tests: `<command or none>`
- Integration tests: `<command or none>`
- Parallel tests / pytest-xdist: `<command or none>`
- E2E tests: `<command or none>`
- UI validation / Playwright MCP workflow: `<workflow or none>`
- Build: `<command or none>`
- Preview/start app for browser tests: `<command or none>`
- Other validation: `<command or none>`

## Python Profile

Keep only when Python is active.

- Python enabled: `<yes/no>`
- Python version: `<version constraint / none>`
- Dependency manager: `<poetry / uv / pip / none / other>`
- Python package mode: `<package / non-package / project-specific / none>`
- Virtual environment policy: `<.venv / project-specific / none>`
- Source layout: `<src / flat / mixed / project-specific / none>`
- Active Python base skill: `<python-core / none>`

## Python Testing Profile

Keep only when Python tests are active.

- Python testing enabled: `<yes/no>`
- Test runner: `<pytest / project-specific / none>`
- Pytest configuration source: `<pyproject.toml / pytest.ini / setup.cfg / tox.ini / none>`
- Pytest test paths/patterns source: `<tool.pytest.ini_options / project-specific / none>`
- Pytest import mode: `<importlib / prepend / append / project-specific / none>`
- Async test plugin: `<pytest-asyncio / project-specific / none>`
- Asyncio mode / loop scope source: `<pyproject.toml / project-specific / none>`
- Coverage tool: `<pytest-cov / coverage.py / project-specific / none>`
- Coverage configuration source: `<pyproject.toml / .coveragerc / setup.cfg / none>`
- Coverage branch tracking: `<yes/no/project-specific/none>`
- Coverage fail-under: `<number / project-specific / none>`
- Parallel test execution enabled: `<yes/no>`
- Parallel test plugin: `<pytest-xdist / none>`
- Parallel test command: `<python -m pytest -n auto / project-specific / none>`
- Serial rerun command for parallel failures: `<python -m pytest -n 0 / project-specific / none>`
- xdist distribution mode: `<load / loadscope / loadfile / loadgroup / worksteal / project-specific / none>`
- Worker resource isolation policy: `<isolated tmp_path/db/cache/ports per worker / project-specific / none>`
- Active Python testing skill: `<python-testing / none>`

## Python FastAPI Profile

Keep only when FastAPI is active.

- FastAPI enabled: `<yes/no>`
- App entry point: `<path / none>`
- Router layout: `<path or convention / none>`
- Dependency injection policy: `<Depends / factory functions / container / project-specific / none>`
- Schema/model policy: `<Pydantic / project-specific / none>`
- Background task policy: `<BackgroundTasks / worker queue / project-specific / none>`
- Active FastAPI rule/skill: `<python_fastapi.md + python-fastapi-expert / none>`

## Python Cache Profile

Keep only when Python caching is active.

- Python cache enabled: `<yes/no>`
- Cache library: `<cashews / functools / cachetools / Redis client / project-specific / none>`
- Cache backend: `<Redis / memory / process-local / project-specific / none>`
- Cache lifecycle owner: `<FastAPI lifespan / app resource manager / CLI / worker / project-specific / none>`
- Cache key scope policy: `<tenant/user/role/filter/pagination/schema-version / project-specific / none>`
- Cache invalidation policy: `<post-commit tags / exact key delete / TTL-only immutable data / project-specific / none>`
- Active Python cache rule/skill: `<python_cache.md + python-cache / none>`
- If FastAPI is active, use FastAPI rule/skill for app wiring and API behavior: `<yes/no/not applicable>`

## Database Profile

Keep only when the project has a database.

- Database enabled: `<yes/no>`
- Database toolkit/ORM: `<SQLAlchemy / Prisma / Django ORM / raw SQL / none / other>`
- Active database: `<SQLite / PostgreSQL / MySQL / none / other>`
- Database driver: `<aiosqlite / asyncpg / psycopg / mysqlclient / none / other>`
- Database pool library: `<aiosqlitepool / SQLAlchemy pool / none / other>`
- Migration tool: `<Alembic / raw SQL / Prisma migrations / project-specific / none>`
- Migration policy: `<policy / none>`
- Active database rule/skill: `<rule + skill / none>`
- Dependency versions source: `<pyproject.toml / package.json / go.mod / project-specific / none>`

## Persistence / Runtime Write Policy

Keep only when the project has persistence-specific runtime write constraints.

- Runtime write policy: `<single writer queue / direct sessions / unit of work / project-specific / none>`
- Read path policy: `<read sessions / read replicas / direct reads / project-specific / none>`
- Write path owner: `<writer loop / service unit-of-work / repository / project-specific / none>`
- Durability/backpressure policy: `<bounded queue / durable queue / reject on overload / project-specific / none>`
- Deployment process/worker assumption: `<single worker / multi-worker / project-specific / none>`

## HTTP Client Profile

Keep only when the project makes outgoing HTTP calls.

- HTTP client enabled: `<yes/no>`
- HTTP client library: `<HTTPX / requests / fetch / Axios / none / other>`
- Retry layer: `<httpx-retries / urllib3 retries / custom / none / other>`
- Timeout policy source: `<settings / CODEX_PROJECT.md / project-specific / none>`
- External dependency stub policy: `<MockTransport / RESPX / pytest-httpserver / provider sandbox / contract fake / none / project-specific>`
- Active HTTP client skill: `<python-httpx-client / none / other>`
- Dependency versions source: `<pyproject.toml / package.json / project-specific / none>`

## Security Profile

Keep only when the project has security-sensitive code.

- Security enabled: `<yes/no>`
- Authentication/authorization policy source: `<project code / docs / none / other>`
- Password hashing / key derivation library: `<argon2-cffi / bcrypt / passlib / none / other>`
- Secrets/configuration policy: `<environment / secret manager / settings provider / project-specific / none>`
- Active security skill: `<python-backend-security / none / other>`
- Dependency versions source: `<pyproject.toml / package.json / project-specific / none>`

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
- Tailwind and SCSS coexistence policy: `<v4 separate plain CSS entry point / existing v3 build pipeline / project-specific / not applicable>`
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

### Python Service E2E Testing

- Python service E2E enabled: `<yes/no>`
- E2E boundary: `<HTTP API / CLI / worker / queue consumer / scheduled job / filesystem flow / database-backed flow / mixed>`
- E2E command: `<command / none>`
- App/process start policy: `<subprocess / project entrypoint / Docker Compose / Testcontainers / in-process app boundary / project-specific / none>`
- Dependency setup: `<Testcontainers / Docker Compose / project-specific / none>`
- External dependency stub policy: `<pytest-httpserver / RESPX / provider sandbox / contract fake / none / project-specific>`
- Data isolation policy: `<unique DB/schema/queue/bucket/temp-dir/test IDs / project-specific>`
- Parallel E2E policy: `<serial / xdist-safe / project-specific>`
- Active Python service E2E rule/skill: `<python_service_e2e_testing.md + python-service-e2e-testing / none>`

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
- Obsidian project logical root: `<MCP-configured logical root / none>`
- Obsidian Templater enabled: `<yes/no>`
- Obsidian Templater policy: `<templates through MCP / no executable template changes without approval / project-specific / none>`
- Local fallback context outbox: `<path / none>`
- Local fallback task outbox: `<path / none>`
- Physical vault filesystem access policy: `<MCP-only; no shell/editor/Git access / project-specific / none>`

## Dependency Policy

- Existing dependency source of truth: `<pyproject.toml / package.json / go.mod / pom.xml / project-specific / none>`
- New dependencies require explicit user approval: `<yes/no>`
- Runtime dependencies policy: `<policy>`
- Development dependencies policy: `<policy>`
- Security-sensitive dependencies policy: `<policy>`

## Project Description

- Primary project documentation: `<README.md / docs path / none>`
- Architecture documentation: `<docs path / Obsidian logical path / none>`
- Important project notes: `<freeform / none>`