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
- Obsidian task/note language: `<language / none>`
- Documentation natural language policy: `<language rule>`
- Test/comment natural language policy: `<language rule>`
- Code comments and docstrings language policy: `<language rule / none>`
- Keep code identifiers, library names, protocol names, command names, paths, package names, and other proper names in English or original language: `<yes/no>`
- Mixed-language source text policy: `<translate explanatory prose / preserve original / project-specific / none>`

## Code Style Profile

Keep only when code style is relevant for this project.

- Indentation: `<spaces/tabs and width / formatter default / project-specific>`
- Formatter: `<tool and config source / none>`
- Linter: `<tool and config source / none>`
- Type checker / static analyzer: `<tool and config source / none>`
- Line length: `<value / from config / none>`
- Target language version for tools: `<version / from config / none>`
- String quote style: `<style / from formatter config / none>`
- IDE/editor assumptions: `<VSCode / JetBrains / none / project-specific>`
- README policy: `<short main README + separate detailed docs / project-specific / none>`
- Runtime/development wording policy: `<do not mention dev/production states in code / project-specific / none>`
- Temporary workaround policy: `<explicit approval required / project-specific / none>`
- Planning/taskbook identifier policy: `<forbidden in source unless product-domain data / project-specific / none>`

## Active Stack Profiles

List only profile sections that apply to this repository. Use profile names, not package names, when the profile has a dedicated section below.

Selection examples:

- `Python Profile`
- `Python Testing Profile`
- `Backend / API Profile`
- `Database Profile`
- `Persistence / Runtime Write Policy`
- `HTTP Client Profile`
- `Cache Profile`
- `Security Profile`
- `Formatting And Linting Profile`
- `TypeScript / JavaScript Profile`
- `Node.js Service Profile`
- `Vue Frontend Profile`
- `Styling Profile`
- `UI / Browser Validation Profile`
- `Testing Profiles`
- `External Systems Profile / Obsidian`
- `External Systems Profile / Jira Data Center`

Active profiles for this project:

- `<active profile list>`

## Active Rules

List only rule files active in this project.

- Core rules: `<.codex/rules/request_routing.md / .codex/rules/git.md / .codex/rules/mark.md / none>`
- Python/backend rules: `<.codex/rules/python_fastapi.md / .codex/rules/python_cache.md / none>`
- Formatting/linting rules: `<.codex/rules/prettier_formatting.md / .codex/rules/eslint_typescript.md / none>`
- Language rules: `<.codex/rules/typescript_core.md / .codex/rules/typescript_testing.md / none / other>`
- Framework rules: `<.codex/rules/vue_frontend.md / .codex/rules/vue_router.md / .codex/rules/pinia.md / .codex/rules/vueuse.md / none / other>`
- Styling rules: `<.codex/rules/css.md / .codex/rules/css_animation.md / .codex/rules/tailwind_css.md / .codex/rules/scss_styling.md / none>`
- UI/browser validation rules: `<.codex/rules/ui_ux_validation.md / .codex/rules/playwright_ui_validation.md / none>`
- E2E rules: `<.codex/rules/vue_playwright_e2e_testing.md / .codex/rules/nodejs_service_e2e_testing.md / none>`
- External-system rules: `<active list or none>`
- Other rules: `<active list or none>`

## Active Skills

List only reusable skills active in this project. Do not activate language, framework, database, cache, HTTP-client, security, or external-system overlays that do not match this repository.

- Core skills: `<none / active list>`
- Language skills: `<python-core / python-testing / typescript-core / typescript-testing / none / other>`
- Framework skills: `<python-fastapi-expert / vue-expert / vue-router-expert / pinia-expert / vueuse-expert / none>`
- Cache skills: `<python-cache / none>`
- Database skills: `<python-sqlalchemy-core / python-sqlalchemy-sqlite / none / other>`
- HTTP/client skills: `<python-httpx-client / none / other>`
- Security skills: `<python-backend-security / none / other>`
- Formatting/linting skills: `<prettier-formatting / eslint-typescript / none>`
- Styling skills: `<css-expert / css-animation-expert / tailwind-expert / scss-expert / none>`
- UI/browser validation skills: `<ui-ux-review / playwright-ui-checks-mcp / none>`
- E2E skills: `<vue-playwright-e2e-testing / nodejs-service-e2e-testing / none>`
- External-system skills: `<obsidian-semantic-notes-mcp / jira-data-center / none / other>`

## Build And Test Commands

Use only project-declared commands. Set commands that do not apply to `none`.

When tools are installed inside a repository virtual environment, declare the command prefixes explicitly so commands do not depend on a globally installed executable or an already activated shell.

POSIX/macOS command prefix:

- Python: `<.venv/bin/python / python / none / project-specific>`
- Package manager module: `<.venv/bin/python -m poetry / python -m uv / none / project-specific>`

Windows command prefix:

- Python: `<.venv\Scripts\python.exe / python / none / project-specific>`
- Package manager module: `<.venv\Scripts\python.exe -m poetry / python -m uv / none / project-specific>`

Canonical commands:

- Install dependencies:
  - POSIX/macOS: `<command or none>`
  - Windows: `<command or none>`
- Format:
  - POSIX/macOS: `<command or none>`
  - Windows: `<command or none>`
- Format check:
  - POSIX/macOS: `<command or none>`
  - Windows: `<command or none>`
- Lint:
  - POSIX/macOS: `<command or none>`
  - Windows: `<command or none>`
- Type check / static analysis:
  - POSIX/macOS: `<command or none>`
  - Windows: `<command or none>`
- Unit tests:
  - POSIX/macOS: `<command or none>`
  - Windows: `<command or none>`
- Integration tests:
  - POSIX/macOS: `<command or none>`
  - Windows: `<command or none>`
- Full test suite:
  - POSIX/macOS: `<command or none>`
  - Windows: `<command or none>`
- Parallel tests / pytest-xdist:
  - POSIX/macOS: `<command or none>`
  - Windows: `<command or none>`
- Serial rerun after parallel failure:
  - POSIX/macOS: `<command or none>`
  - Windows: `<command or none>`
- Coverage:
  - POSIX/macOS: `<command or none>`
  - Windows: `<command or none>`
- E2E tests:
  - POSIX/macOS: `<command or none>`
  - Windows: `<command or none>`
- UI validation / Playwright MCP workflow: `<workflow or none>`
- Build: `<command or none>`
- Preview/start app for browser tests: `<command or none>`
- Syntax validation:
  - POSIX/macOS: `<command or none>`
  - Windows: `<command or none>`
- Other validation: `<command or none>`

Do not use bare project tools unless `CODEX_PROJECT.md` explicitly allows them or the user explicitly confirms that the shell has the required environment activated.

Do not put parallel-test flags such as `-n auto` into default test runner options unless the suite is proven parallel-safe and the project explicitly wants every test run to use parallel execution.

## Runtime / Programming Language Profiles

Use only the blocks that match this repository. Delete or set unused blocks to `none` in other projects.

### Python Profile

Keep only when Python is active.

- Python enabled: `<yes/no>`
- Python version: `<version constraint / from pyproject.toml / none>`
- Python dependency manager: `<Poetry / uv / pip / none / other>`
- Python package mode: `<enabled / disabled / from project config / none>`
- Python virtual environment policy: `<use project .venv / project-specific / none>`
- Source layout: `<src / flat / mixed / project-specific / none>`
- Active Python base rule: `<rule path / none>`
- Active Python skills: `<python-core / python-testing / python-fastapi-expert / python-cache / python-backend-security / python-sqlalchemy-core / python-sqlalchemy-sqlite / python-httpx-client / none / other>`

### Python Testing Profile

Keep only when the project has Python tests.

- Python testing enabled: `<yes/no>`
- Test runner: `<pytest / project-specific / none>`
- Async test support: `<pytest-asyncio / project-specific / none>`
- Parallel test support: `<pytest-xdist / none>`
- Pytest test paths: `<from tool.pytest.ini_options.testpaths / project-specific / none>`
- Pytest file pattern: `<from tool.pytest.ini_options.python_files / project-specific / none>`
- Pytest class pattern: `<from tool.pytest.ini_options.python_classes / project-specific / none>`
- Pytest function pattern: `<from tool.pytest.ini_options.python_functions / project-specific / none>`
- Pytest import mode: `<from tool.pytest.ini_options.addopts / project-specific / none>`
- Pytest asyncio mode: `<from tool.pytest.ini_options.asyncio_mode / project-specific / none>`
- Pytest loop scope: `<from pytest-asyncio settings / project-specific / none>`
- Coverage tool: `<pytest-cov / coverage.py / project-specific / none>`
- Coverage branch tracking: `<from tool.coverage.run / project-specific / none>`
- Coverage fail-under: `<from tool.coverage.report.fail_under / project-specific / none>`
- Parallel test execution enabled: `<yes/no>`
- Parallel test command: `<use Build And Test Commands / command / none>`
- Serial rerun command for parallel failures: `<use Build And Test Commands / command / none>`
- xdist distribution mode: `<default / load / loadscope / loadfile / loadgroup / worksteal / project-specific / none>`
- Worker resource isolation policy: `<isolate SQLite files, cache namespaces, temporary paths, ports, and other mutable resources per worker / project-specific / none>`
- Active testing skill: `<python-testing / none>`

## Backend / API Profile

Keep only when the project has a backend/API component.

- Backend/API enabled: `<yes/no>`
- Web/API framework: `<FastAPI / Flask / Django / Express / NestJS / none / other>`
- App entry point: `<path / none>`
- Router layout: `<path or convention / none>`
- Dependency injection policy: `<Depends / factory functions / container / project-specific / none>`
- HTTP schema layer: `<Pydantic / project-specific / none>`
- Settings layer: `<pydantic-settings / project-specific / none>`
- ASGI/WSGI/server layer: `<Uvicorn / Gunicorn / project-specific / none>`
- API documentation: `<OpenAPI / project-specific / none>`
- Background task policy: `<BackgroundTasks / worker queue / project-specific / none>`
- Active backend/API rule: `<rule path / none>`
- Active backend/API skill: `<python-fastapi-expert / none / other>`
- Dependency versions: `<from project manifest / none>`

## Database Profile

Keep only when the project has a database.

- Database enabled: `<yes/no>`
- Database toolkit/ORM: `<SQLAlchemy / Prisma / Django ORM / none / other>`
- Active database: `<SQLite / PostgreSQL / MySQL / none / other>`
- Async database driver: `<aiosqlite / asyncpg / aiomysql / none / other>`
- Pool library: `<aiosqlitepool / SQLAlchemy pool / project-specific / none>`
- Common database skill: `<python-sqlalchemy-core / none / other>`
- Active database-specific skill: `<python-sqlalchemy-sqlite / none / other>`
- Migration tool: `<raw SQL / Alembic / Prisma migrations / none / other>`
- Migration policy: `<do not introduce, remove, or replace migration tooling without explicit user approval / project-specific / none>`
- Dependency versions: `<from project manifest / none>`

## Persistence / Runtime Write Policy

Keep only when the project has a persistence-specific runtime policy.

- Runtime write policy: `<single writer queue / ORM direct sessions / project-specific / none>`
- Single process/worker assumption: `<yes/no/project-specific>`
- Read path policy: `<read sessions / query bus / project-specific / none>`
- Write path policy: `<writer loop / direct write sessions / project-specific / none>`
- Durability/backpressure policy: `<bounded queue/backpressure / project-specific / none>`

## HTTP Client Profile

Keep only when the project makes outgoing HTTP calls.

- HTTP client enabled: `<yes/no>`
- HTTP client library: `<HTTPX / requests / fetch / axios / none / other>`
- HTTP retry layer: `<httpx-retries / project-specific / none>`
- Active HTTP client skill: `<python-httpx-client / none / other>`
- Dependency versions: `<from project manifest / none>`

## Cache Profile

Keep only when the project uses application caching.

- Cache enabled: `<yes/no>`
- Cache library: `<cashews / functools / cachetools / Redis client / project-specific / none>`
- Cache backend: `<Redis / memory / process-local / project-specific / none>`
- Cache lifecycle owner: `<FastAPI lifespan / app resource manager / CLI / worker / project-specific / none>`
- Cache key scope policy: `<tenant/user/role/filter/pagination/schema-version / project-specific / none>`
- Cache invalidation policy: `<post-commit tags / exact key delete / TTL-only immutable data / project-specific / none>`
- Active cache rule: `<rule path / none>`
- Active cache skill: `<python-cache / none / other>`
- If cache code touches app wiring, lifecycle, middleware, dependencies, or API behavior, use the active framework rule/skill only for that framework-specific part: `<yes/no/not applicable>`
- Dependency versions: `<from project manifest / none>`

## Security Profile

Keep only when the project has security-sensitive code.

- Security enabled: `<yes/no>`
- Password hashing / key derivation library: `<argon2-cffi / bcrypt / none / other>`
- Secret/config source policy: `<environment / .env / secret manager / project-specific / none>`
- Active security skill: `<python-backend-security / none / other>`
- Dependency versions: `<from project manifest / none>`

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

Keep only when `Vue Frontend Profile` is active.

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
- Obsidian access: `<connected Obsidian MCP only / none / other>`
- Active Obsidian skill: `<obsidian-semantic-notes-mcp / none>`
- Obsidian project logical root: `<MCP-configured vault/project root / none>`
- Obsidian Templater enabled: `<yes/no>`
- Obsidian Templater role: `<canonical formatting source when available through MCP / none / project-specific>`
- Templater executable logic policy: `<do not add or modify without explicit user approval / project-specific / none>`
- Local context fallback outbox: `<path / none>`
- Local task fallback outbox: `<path / none>`
- Physical vault access policy: `<MCP only; no shell/editor/Git access / project-specific / none>`

### Jira Data Center

- Jira Data Center enabled: `<yes/no>`
- Jira version: `<version / project-specific / none>`
- Jira access: `<REST API / MCP / none / other>`
- Credential source: `<.env / environment / secret manager / project-specific / none>`
- Active Jira skill: `<jira-data-center / none>`

## Dependency Policy

- New dependencies require explicit user approval: `<yes/no>`
- Runtime dependencies policy: `<policy>`
- Development dependencies policy: `<policy>`
- Security-sensitive dependencies policy: `<policy>`
- Existing dependency names and versions are governed by: `<project manifest / lockfile / project-specific / none>`

## Project Description

- Primary project documentation: `<README.md / docs path / none>`
- Architecture documentation: `<docs path / Obsidian logical path / none>`
- Important project notes: `<freeform / none>`
