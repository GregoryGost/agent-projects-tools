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
6. Before applying an activated rule or skill, validate its complete hard-dependency closure:
   - read the activated artifact entrypoint;
   - treat exact artifacts named under `Required skills`, `Required Dependencies`, `Use together with`, or an explicit `requires` / `Apply ... together` statement as hard dependencies;
   - require every hard dependency to exist and be active through the same project-profile signals;
   - validate dependencies transitively until every required rule and skill is satisfied;
   - track already visited artifacts so a valid mutual `rule ↔ skill` dependency does not recurse indefinitely;
   - accept a dependency cycle only when every member exists, is active, and has no missing or disabled dependency outside the cycle;
   - do not treat optional coordination such as `combine with ... when active` as a hard dependency.
7. If a hard dependency is missing, inactive, explicitly set to `none`, or disabled, report the exact dependency chain and treat the dependent artifact as invalid. Do not apply it and do not silently activate the missing dependency. Update `CODEX_PROJECT.md` only when the current request and routing mode authorize that profile change, then re-run dependency validation.
8. Read and apply only the additional rules and skills that match the task, are active through at least one activation signal, and have a valid dependency closure. A task may explicitly require reviewing an inactive area without making it generally active for unrelated work.
9. If activation signals conflict, report the conflict instead of guessing. An explicit `none`, `enabled: no`, or incompatible active-rule/active-skill field conflicts with a positive activation for the same material. These optional activation signals cannot disable `request_routing.md`.

## Template Repository Mode

Use this mode when working in the `agent-projects-tools` source repository itself.

1. Apply the mandatory request-routing gate above.
2. Do not create `CODEX_PROJECT.md`; its absence is intentional in this template repository.
3. Read `README.md`, `.codex/project.template.md`, and the rules, skills, metadata, and references directly relevant to the requested repository change.
4. Treat `.codex/project.template.md`, `.codex/rules/`, and `.agents/skills/` as source artifacts being maintained, not as an active application stack.
5. Check affected cross-references, profile identifiers, rule names, skill names, required dependencies, metadata, and README coverage before completing a change.

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
- Activation of a dependent rule or skill is valid only when every explicitly declared hard dependency is also active and valid. Validate the dependency graph transitively.
- A mutual dependency cycle is valid only when all members of the cycle are present and active. Use cycle detection; do not treat the cycle itself as a missing dependency.
- An active skill does not automatically activate every related rule, and an active rule does not automatically activate every related skill. Only explicitly declared hard dependencies are required; unrelated overlays remain inactive.
- Do not silently activate missing dependencies. Report the dependent artifact, the missing rule or skill, and the full dependency chain.
- Do not silently resolve contradictory activation entries. Report the mismatch and avoid changing behavior governed by the conflicting material until the source of truth is clarified.
- In the template repository, the previous activation restrictions do not prevent reviewing or editing a rule, skill, or reference that is directly in the requested maintenance scope.
- If Obsidian is enabled in a target project's `CODEX_PROJECT.md`, use only the configured Obsidian MCP server for vault content.
- If Obsidian MCP is unavailable, use only the fallback outbox paths declared in the target project's `CODEX_PROJECT.md`, then synchronize through MCP after successful verification.
- You need to remember what rules and what skills are available and use them when necessary.
- It is impossible to draw any conclusions based only on superficial data; it is necessary to conduct an analysis as deeply and in detail as possible.

## Review Expectations

- Review code and tests together when the task touches implementation.
- In target projects, apply the relevant review rules and specialist skills activated by `CODEX_PROJECT.md` only after their required dependencies have been validated.
- In the template repository, review the requested source artifacts together with directly dependent rules, skills, references, metadata, and README entries.
- Run or report the relevant validation commands declared by the target project's `CODEX_PROJECT.md` when possible.
