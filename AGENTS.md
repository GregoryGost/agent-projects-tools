# Agent Bootstrap

Determine the repository mode before doing work.

## Target Project Mode

Use this mode in a project that consumes rules, skills, and the project profile from this repository.

1. Read `CODEX_PROJECT.md` when it exists. It is the source of truth for project-specific stack choices, paths, natural-language/style profile, dependency policy, migration policy, validation commands, and enabled external systems.
2. If `CODEX_PROJECT.md` is missing or incomplete, inspect repository evidence first: manifests, package manager files, lockfiles, framework configs, source tree, test configs, build configs, and documentation.
3. If the project type and active profiles can be determined with confidence, create or update `CODEX_PROJECT.md` from `.codex/project.template.md`. If material choices remain ambiguous, ask the user before creating or changing the profile.
4. Resolve rule and skill activation from all explicit project-profile signals:
   - an exact rule entry in `Active Rules` activates that rule;
   - an exact skill entry in `Active Skills` activates that skill;
   - an entry in `Active Stack Profiles` activates the matching rule/skill set defined by the project profile;
   - a retained specialized profile section activates the exact rule or skill named by its active-rule/active-skill field when the section is explicitly enabled.
5. Read and apply only the rules and skills that match the task and are active through at least one of those signals. A task may explicitly require reviewing an inactive area without making it generally active for unrelated work.
6. If activation signals conflict, report the conflict instead of guessing. An explicit `none`, `enabled: no`, or incompatible active-rule/active-skill field conflicts with a positive activation for the same material.

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
- In a target project, a programming-language, framework, database, cache, HTTP client, styling, testing, UI validation, E2E, security, or external-system material is active when `CODEX_PROJECT.md` declares its exact rule in `Active Rules`, its exact skill in `Active Skills`, its matching active stack profile, or an enabled specialized profile section that names it. The task may also explicitly require reviewing an otherwise inactive area.
- Omission from `Active Stack Profiles` does not deactivate an exact entry in `Active Skills` or `Active Rules`.
- An active skill does not automatically activate every related rule, and an active rule does not automatically activate every related skill. Apply only exact artifacts or rule/skill pairs explicitly selected by the project profile.
- Do not silently resolve contradictory activation entries. Report the mismatch and avoid changing behavior governed by the conflicting material until the source of truth is clarified.
- In the template repository, the previous activation restrictions do not prevent reviewing or editing a rule, skill, or reference that is directly in the requested maintenance scope.
- If Obsidian is enabled in a target project's `CODEX_PROJECT.md`, use only the configured Obsidian MCP server for vault content.
- If Obsidian MCP is unavailable, use only the fallback outbox paths declared in the target project's `CODEX_PROJECT.md`, then synchronize through MCP after successful verification.
- You need to remember what rules and what skills are available and use them when necessary.
- It is impossible to draw any conclusions based only on superficial data; it is necessary to conduct an analysis as deeply and in detail as possible.

## Review Expectations

- Review code and tests together when the task touches implementation.
- In target projects, apply the relevant review rules and specialist skills activated by `CODEX_PROJECT.md` for the touched stack area.
- In the template repository, review the requested source artifacts together with directly dependent rules, skills, references, metadata, and README entries.
- Run or report the relevant validation commands declared by the target project's `CODEX_PROJECT.md` when possible.
