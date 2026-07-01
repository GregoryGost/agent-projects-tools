# Codex Project Profile

## Project Identity

- Project key: `PMC`
- Workspace: `ppm-control-workspace`
- Project type: backend
- Primary programming languages: Python
- Secondary programming languages: none

## Natural Language Profile

- User-facing answers language: Russian.
- Git commit text language: Russian.
- Obsidian task/note language: Russian.
- Test/comment natural language policy: Russian comments/docstrings for Python project files unless repository metadata says otherwise.
- Documentation natural language policy: Russian unless repository metadata or user instructions say otherwise.
- Keep code identifiers, library names, protocol names, command names, paths, package names, and other proper names in English.

## Code Style Profile

- Indentation: 2 spaces.
- Formatter: Ruff format from `pyproject.toml`.
- Linter: Ruff from `pyproject.toml`.
- Type checker / static analyzer: Pyright from `pyproject.toml`.
- Line length: from `pyproject.toml`.
- Python target version for tools: from `pyproject.toml`.
- String quote style: from Ruff format configuration in `pyproject.toml`.
- IDE/editor assumptions: VSCode.
- Python comments and docstrings: Russian, except identifiers, class names, library names, protocol names, and other proper names.
- README policy: keep the main README short and focused on project purpose, developer start, licensing, and used modules. Move detailed instructions to separate files.
- Do not mention dev/production states in project code or comments. Code is written for the target product; development is only the state before version `1.0.0` is released.
- Do not introduce temporary workarounds unless the user explicitly approves them. User-approved fallback outboxes for Obsidian MCP downtime are allowed under the Obsidian profile.
- Python comments, docstrings, and test comments must be Russian prose.
- English is allowed only for exact code identifiers, API field names, class/function/module names, package/library names, protocol names, commands, paths, externally defined product names, and domain values that are actually part of the product contract.
- Do not copy mixed-language wording from tasks, wiki, DoD, or backlog into code comments/docstrings. Translate explanatory prose into Russian.
- Internal planning/taskbook identifiers, backlog item ids, task ids, workflow labels, DoD references, and implementation-history markers are forbidden in source code, comments, docstrings, test names, constants, and runtime strings unless they are real product-domain data.
- If a planning concept must be represented in code, use product-level names, not taskbook/backlog ids.

## Active Stack Profiles

List only profile sections that apply to this repository.

- Python Profile
- Python Testing Profile
- Backend / API Profile
- Database Profile
- Persistence / Runtime Write Policy
- HTTP Client Profile
- Cache Profile
- Security Profile
- External Systems Profile / Obsidian

## Active Rules

List only rule files that should normally be applied for this project.

- Core rules: `.codex/rules/request_routing.md`, `.codex/rules/git.md`, `.codex/rules/mark.md`
- Python/FastAPI rules: `.codex/rules/python_fastapi.md`
- Python cache rules: `.codex/rules/python_cache.md`
- External-system rules: `.codex/rules/obsidian_wiki.md`, `.codex/rules/obsidian_tasks.md`
- Other rules: none

## Active Skills

List only reusable skills that should be available for this project. Do not activate database/framework/external-system overlays that do not match this repository.

- Core skills: none
- Language skills: `python-core`, `python-testing`
- Framework skills: `python-fastapi-expert`
- Cache skills: `python-cache`
- Database skills: `python-sqlalchemy-core`, `python-sqlalchemy-sqlite`
- HTTP/client skills: `python-httpx-client`
- Security skills: `python-backend-security`
- External-system skills: `obsidian-semantic-notes-mcp`

## Build And Test Commands

Use the repository `.venv` explicitly. Poetry and project tools are installed inside the virtual environment, so commands must not depend on a globally installed `poetry` executable or on an already activated shell.

POSIX/macOS command prefix:

- Python: `.venv/bin/python`
- Poetry module: `.venv/bin/python -m poetry`

Windows command prefix:

- Python: `.venv\Scripts\python.exe`
- Poetry module: `.venv\Scripts\python.exe -m poetry`

Canonical commands:

- Install dependencies:
  - POSIX/macOS: `.venv/bin/python -m poetry install`
  - Windows: `.venv\Scripts\python.exe -m poetry install`
- Format:
  - POSIX/macOS: `.venv/bin/python -m ruff format .`
  - Windows: `.venv\Scripts\python.exe -m ruff format .`
- Lint:
  - POSIX/macOS: `.venv/bin/python -m ruff check .`
  - Windows: `.venv\Scripts\python.exe -m ruff check .`
- Type check / static analysis:
  - POSIX/macOS: `.venv/bin/python -m pyright`
  - Windows: `.venv\Scripts\python.exe -m pyright`
- Unit tests:
  - POSIX/macOS: `.venv/bin/python -m pytest -m unit`
  - Windows: `.venv\Scripts\python.exe -m pytest -m unit`
- Integration tests:
  - POSIX/macOS: `.venv/bin/python -m pytest -m integration`
  - Windows: `.venv\Scripts\python.exe -m pytest -m integration`
- Full test suite:
  - POSIX/macOS: `.venv/bin/python -m pytest`
  - Windows: `.venv\Scripts\python.exe -m pytest`
- Parallel tests / pytest-xdist:
  - POSIX/macOS: `.venv/bin/python -m pytest -n auto`
  - Windows: `.venv\Scripts\python.exe -m pytest -n auto`
- Serial rerun after parallel failure:
  - POSIX/macOS: `.venv/bin/python -m pytest -n 0`
  - Windows: `.venv\Scripts\python.exe -m pytest -n 0`
- Coverage:
  - POSIX/macOS: `.venv/bin/python -m pytest --cov`
  - Windows: `.venv\Scripts\python.exe -m pytest --cov`
- Build: not applicable for a package artifact while `[tool.poetry].package-mode = false`.
- Python syntax validation:
  - POSIX/macOS: `.venv/bin/python -m compileall -q -x '(^|/)(\.venv|\.git|__pycache__|build|dist|htmlcov)/' .`
  - Windows: `.venv\Scripts\python.exe -m compileall -q -x '(^|/)(\.venv|\.git|__pycache__|build|dist|htmlcov)/' .`

Do not use bare `poetry run ...`, bare `pytest`, bare `ruff`, or bare `pyright` unless the user explicitly confirms that the shell has already activated `.venv`.
Do not put `-n auto` into default pytest `addopts` unless the suite is proven parallel-safe and the project explicitly wants every pytest run to use xdist.

## Runtime / Programming Language Profiles

Use only the blocks that match this repository. Delete or set unused blocks to `none` in other projects.

### Python Profile

- Python enabled: yes.
- Python version: from `requires-python` in `pyproject.toml`.
- Python dependency manager: Poetry installed inside project `.venv`.
- Python package mode: disabled through `[tool.poetry].package-mode = false`.
- Python virtual environment policy: use project `.venv`; invoke tools through `.venv` Python, not through globally installed executables.
- Active Python base rule: none.
- Active Python skills: `python-core`, `python-testing`, `python-fastapi-expert`, `python-cache`, `python-backend-security`, `python-sqlalchemy-core`, `python-sqlalchemy-sqlite`, `python-httpx-client`.

### Python Testing Profile

Use only when the project has Python tests.

- Test runner: pytest.
- Async test support: pytest-asyncio.
- Parallel test support: pytest-xdist.
- Pytest test paths: from `tool.pytest.ini_options.testpaths` in `pyproject.toml`.
- Pytest file pattern: from `tool.pytest.ini_options.python_files` in `pyproject.toml`.
- Pytest class pattern: from `tool.pytest.ini_options.python_classes` in `pyproject.toml`.
- Pytest function pattern: from `tool.pytest.ini_options.python_functions` in `pyproject.toml`.
- Pytest import mode: from `tool.pytest.ini_options.addopts` in `pyproject.toml`.
- Pytest asyncio mode: from `tool.pytest.ini_options.asyncio_mode` in `pyproject.toml`.
- Pytest loop scope: from pytest-asyncio settings in `pyproject.toml`.
- Coverage tool: pytest-cov / coverage.py.
- Coverage branch tracking: from `tool.coverage.run` in `pyproject.toml`.
- Coverage fail-under: from `tool.coverage.report.fail_under` in `pyproject.toml`.
- Parallel test execution enabled: yes, because `pytest-xdist` is declared in dev dependencies.
- Parallel test command: use the `Parallel tests / pytest-xdist` command from `Build And Test Commands`.
- Serial rerun command for parallel failures: use the `Serial rerun after parallel failure` command from `Build And Test Commands`.
- xdist distribution mode: default xdist scheduling unless fixtures or shared setup require `loadscope` or `loadfile`.
- Worker resource isolation policy: isolate SQLite files, cache namespaces, temporary paths, ports, and other mutable resources per worker; tests that cannot be isolated must run serially.
- Active testing skill: `python-testing`.

## Backend / API Profile

Use only when the project has a backend/API component.

- Backend/API enabled: yes.
- Web/API framework: FastAPI.
- HTTP schema layer: Pydantic.
- Settings layer: pydantic-settings.
- ASGI server: Uvicorn.
- API documentation: OpenAPI.
- Active backend/API rule: `.codex/rules/python_fastapi.md`.
- Active backend/API skill: `python-fastapi-expert`.
- Dependency versions: from `pyproject.toml`.

## Database Profile

Use only when the project has a database.

- Database enabled: yes.
- Database toolkit/ORM: SQLAlchemy.
- Active database: SQLite.
- Async SQLite driver: aiosqlite.
- SQLite pool library: aiosqlitepool.
- Common database skill: `python-sqlalchemy-core`.
- Active database-specific skill: `python-sqlalchemy-sqlite`.
- Migration tool: raw SQL.
- Migration policy: do not introduce, remove, or replace migration tooling without explicit user approval.
- Dependency versions: from `pyproject.toml`.

## Persistence / Runtime Write Policy

Use only when the project has a persistence-specific runtime policy.

- Runtime write policy: single writer queue for normal runtime SQLite writes.
- Single process/worker assumption: yes; FastAPI runtime mode is single worker/process.
- Read path policy: use read sessions; read path is separate from write queue.
- Write path policy: write path is owned by the single writer loop; direct runtime write sessions are not part of normal application code.
- Durability/backpressure policy: use bounded queue/backpressure and the writer-loop policy from `python-sqlalchemy-sqlite`.

## HTTP Client Profile

Use only when the project makes outgoing HTTP calls.

- HTTP client enabled: yes.
- HTTP client library: HTTPX.
- HTTP retry layer: httpx-retries.
- Active HTTP client skill: `python-httpx-client`.
- Dependency versions: from `pyproject.toml`.

## Cache Profile

Use only when the project uses application caching.

- Cache enabled: yes.
- Cache library: cashews.
- Cache backend: project-specific; must be declared in settings/config before cache usage.
- Cache lifecycle owner: FastAPI lifespan or project application resource manager.
- Active cache rule: `.codex/rules/python_cache.md`.
- Active cache skill: `python-cache`.
- If cache code touches FastAPI app wiring, lifespan, middleware, dependencies, or API behavior, use `python-fastapi-expert` only for that FastAPI-specific part.
- Dependency versions: from `pyproject.toml`.

## Security Profile

Use only when the project has security-sensitive code.

- Security enabled: yes.
- Password hashing / key derivation library: argon2-cffi.
- Active security skill: `python-backend-security`.
- Dependency versions: from `pyproject.toml`.

## External Systems Profile

Use only when the project uses external systems or connectors.

### Obsidian

- Obsidian enabled: yes.
- Obsidian access: connected Obsidian MCP only.
- Active Obsidian skill: `obsidian-semantic-notes-mcp`.
- Obsidian project logical root: MCP-configured vault/project root; no repository filesystem path is used.
- Obsidian Templater enabled: yes.
- Obsidian Templater role: canonical note/task/wiki formatting source when templates are available through MCP; MCP writes must not assume automatic Templater execution unless the selected MCP tool explicitly applies a template.
- Templater executable logic policy: do not add or modify Templater JavaScript/user/system-command logic without explicit user approval.
- Local context fallback outbox: `.agent_context/context/`.
- Local task fallback outbox: `.agent_context/tasks/`.
- The Obsidian project logical root is resolved by the configured Obsidian MCP; it is not a repository filesystem path or filesystem access permission.
- The physical vault location, if known, must not be accessed by shell commands, scripts, editor search, or Git operations. All vault discovery, search, read, and write operations must use MCP.

## Dependency Policy

- New dependencies require explicit user approval: yes.
- Runtime dependencies policy: do not introduce new runtime dependencies without explicit user approval.
- Development dependencies policy: do not introduce new development dependencies without explicit user approval.
- Security-sensitive dependencies policy: do not introduce new security-sensitive dependencies without explicit user approval.
- Existing dependency names and versions are governed by `pyproject.toml`.

## Project Description

- Primary project documentation: `README.md`.
