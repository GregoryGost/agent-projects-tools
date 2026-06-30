# Agent Bootstrap

Before doing repository work:

1. Read `CODEX_PROJECT.md` first. It is the source of truth for project-specific stack choices, paths, natural-language/style profile, dependency policy, migration policy, validation commands, and enabled external systems.
2. If `CODEX_PROJECT.md` is missing or incomplete, create or update it from `.codex/project.template.md` before applying stack-specific rules. If the project type or active profiles cannot be determined from repository files, ask the user before creating the profile.
3. Read only the `.codex/rules/` files that match the task and the active stack profiles declared in `CODEX_PROJECT.md`.
4. Apply only the `.agents/skills/` packages that match the task and the active skills declared in `CODEX_PROJECT.md`.
5. Keep `AGENTS.md` small. Detailed workflows belong in `.codex/rules/`, `.agents/skills/`, or skill `references/`.

## Hard constraints

- `.codex/project.template.md` is a template, not an active rule. Do not load it as a rule after `CODEX_PROJECT.md` is complete.
- Do not add new dependencies unless the user explicitly approves it or `CODEX_PROJECT.md` explicitly allows it for this project.
- Do not infer project-specific stack choices when `CODEX_PROJECT.md` is missing or incomplete; ask the user or create/update it from `.codex/project.template.md`.
- Do not apply programming-language, framework, database, cache, HTTP client, styling, testing, UI validation, E2E, or external-system rules unless `CODEX_PROJECT.md` declares the corresponding active stack profile or the task explicitly requires reviewing that inactive area.
- If Obsidian is enabled in `CODEX_PROJECT.md`, use only the configured Obsidian MCP server for vault content.
- If Obsidian MCP is unavailable, use only the fallback outbox paths declared in `CODEX_PROJECT.md`, then synchronize through MCP after successful verification.
- You need to remember what rules and what skills are available and use them when necessary.
- It is impossible to draw any conclusions based only on superficial data; it is necessary to conduct an analysis as deeply and in detail as possible.

## Review expectations

- Review code and tests together when the task touches implementation.
- Apply the relevant review rules and specialist skills declared by `CODEX_PROJECT.md` for the touched stack area.
- Run or report the relevant validation commands declared by `CODEX_PROJECT.md` when possible.
