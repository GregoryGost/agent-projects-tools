# Agent Bootstrap

Determine the repository mode before doing work.

## Target Project Mode

Use this mode in a project that consumes rules, skills, and the project profile from this repository.

1. Read `CODEX_PROJECT.md` when it exists. It is the source of truth for project-specific stack choices, paths, natural-language/style profile, dependency policy, migration policy, validation commands, and enabled external systems.
2. If `CODEX_PROJECT.md` is missing or incomplete, inspect repository evidence first: manifests, package manager files, lockfiles, framework configs, source tree, test configs, build configs, and documentation.
3. If the project type and active profiles can be determined with confidence, create or update `CODEX_PROJECT.md` from `.codex/project.template.md`. If material choices remain ambiguous, ask the user before creating or changing the profile.
4. Read only the `.codex/rules/` files that match the task and the active stack profiles declared in `CODEX_PROJECT.md`.
5. Apply only the `.agents/skills/` packages that match the task and the active skills declared in `CODEX_PROJECT.md`.

## Template Repository Mode

Use this mode when working in the `agent-projects-tools` source repository itself.

1. Do not create `CODEX_PROJECT.md`; its absence is intentional in this template repository.
2. Read `README.md`, `.codex/project.template.md`, and the rules, skills, metadata, and references directly relevant to the requested repository change.
3. Treat `.codex/project.template.md`, `.codex/rules/`, and `.agents/skills/` as source artifacts being maintained, not as an active application stack.
4. Check affected cross-references, profile identifiers, rule names, skill names, metadata, and README coverage before completing a change.

Keep `AGENTS.md` small. Detailed workflows belong in `.codex/rules/`, `.agents/skills/`, or skill `references/`.

## Hard Constraints

- `.codex/project.template.md` is a template, not an active rule. Do not load it as a rule after a target project's `CODEX_PROJECT.md` is complete.
- Never create `CODEX_PROJECT.md` inside the `agent-projects-tools` template repository.
- In a target project, use repository metadata for profile discovery, but do not invent project-specific stack choices when material evidence is missing or ambiguous.
- Do not add new dependencies unless the user explicitly approves it or the target project's `CODEX_PROJECT.md` explicitly allows it.
- In a target project, do not apply programming-language, framework, database, cache, HTTP client, styling, testing, UI validation, E2E, or external-system rules unless `CODEX_PROJECT.md` declares the corresponding active stack profile or the task explicitly requires reviewing that inactive area.
- In the template repository, the previous activation restriction does not prevent reviewing or editing a rule, skill, or reference that is directly in the requested maintenance scope.
- If Obsidian is enabled in a target project's `CODEX_PROJECT.md`, use only the configured Obsidian MCP server for vault content.
- If Obsidian MCP is unavailable, use only the fallback outbox paths declared in the target project's `CODEX_PROJECT.md`, then synchronize through MCP after successful verification.
- You need to remember what rules and what skills are available and use them when necessary.
- It is impossible to draw any conclusions based only on superficial data; it is necessary to conduct an analysis as deeply and in detail as possible.

## Review Expectations

- Review code and tests together when the task touches implementation.
- In target projects, apply the relevant review rules and specialist skills declared by `CODEX_PROJECT.md` for the touched stack area.
- In the template repository, review the requested source artifacts together with directly dependent rules, skills, references, metadata, and README entries.
- Run or report the relevant validation commands declared by the target project's `CODEX_PROJECT.md` when possible.