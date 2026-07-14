# Agent Bootstrap

Determine the repository mode before doing work.

## Mandatory Request Routing

`.codex/rules/request_routing.md` is mandatory in both target projects and the `agent-projects-tools` template repository.

Before any task-specific tool call, file edit, MCP operation, external-system call, or final answer:

1. Read and apply `.codex/rules/request_routing.md`.
2. Classify the current user message independently from previous turns.
3. Resolve the allowed and forbidden surfaces and side effects.
4. Continue only within the selected mode and surface gate.

The initial read of `.codex/rules/request_routing.md` is the only bootstrap file operation allowed before its gate is resolved. This rule does not depend on `CODEX_PROJECT.md` activation and must not be omitted, set to `none`, disabled, or replaced by another routing rule.

## Target Project Mode

Use this mode in a project that consumes rules, skills, and the project profile from this repository.

1. Apply the mandatory request-routing gate above.
2. Read `CODEX_PROJECT.md` when it exists. It is the source of truth for project-specific stack choices, paths, natural-language/style profile, dependency policy, migration policy, validation commands, and enabled external systems.
3. If `CODEX_PROJECT.md` is missing or incomplete, inspect repository evidence first: manifests, package manager files, lockfiles, framework configs, source tree, test configs, build configs, and documentation.
4. If the project type and active profiles can be determined with confidence, create or update `CODEX_PROJECT.md` from `.codex/project.template.md`. If material choices remain ambiguous, ask the user before creating or changing the profile.
5. Resolve activation for additional rules and skills from all explicit project-profile signals:
   - an exact rule entry in `Active Rules` activates that rule;
   - an exact skill entry in `Active Skills` activates that skill;
   - an entry in `Active Stack Profiles` activates the matching rule/skill set defined by the project profile;
   - a retained specialized profile section activates the exact rule or skill named by its active-rule/active-skill field when the section is explicitly enabled.
6. Read and apply only the additional rules and skills that match the task and are active through at least one of those signals. A task may explicitly require reviewing an inactive area without making it generally active for unrelated work.
7. If activation signals conflict, report the conflict instead of guessing. An explicit `none`, `enabled: no`, or incompatible active-rule/active-skill field conflicts with a positive activation for the same material. These optional activation signals cannot disable `request_routing.md`.

## Template Repository Mode

Use this mode when working in the `agent-projects-tools` source repository itself.

1. Apply the mandatory request-routing gate above.
2. Do not create `CODEX_PROJECT.md`; its absence is intentional in this template repository.
3. Read `README.md`, `.codex/project.template.md`, and the rules, skills, metadata, and references directly relevant to the requested repository change.
4. Treat `.codex/project.template.md`, `.codex/rules/`, and `.agents/skills/` as source artifacts being maintained, not as an active application stack.
5. Check affected cross-references, profile identifiers, rule names, skill names, metadata, and README coverage before completing a change.

Keep `AGENTS.md` small. Detailed workflows belong in `.codex/rules/`, `.agents/skills/`, or skill `references/`.

## Hard Constraints

- `.codex/rules/request_routing.md` must exist and be applied for every new user message in both repository modes.
- Never omit, disable, replace, or set the mandatory request-routing rule to `none` in a target project's `CODEX_PROJECT.md`.
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
