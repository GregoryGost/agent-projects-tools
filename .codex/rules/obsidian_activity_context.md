# Obsidian Activity Context rules

Apply this rule only when `CODEX_PROJECT.md` declares the `obsidian-activity-context` active stack profile, or when the user directly requests activity-context creation, continuation, updates, completion, reopening, template management, or fallback synchronization.

Do not activate this rule solely because `obsidian-mcp-core`, `obsidian-taskbook`, or `obsidian-llm-wiki` is active. Core access, task tracking, and wiki work do not automatically imply activity-context tracking.

## Required skills

Use together with:

- `obsidian-mcp-core`;
- `obsidian-activity-context`.

The dependency cycle between this rule and the `obsidian-activity-context` skill is intentional: this rule defines authorization and invariants, while the skill defines the reusable workflow.

Apply `.codex/rules/request_routing.md` before every activity-context read, write, template check, template creation, fallback write, or synchronization.

## Authorization

- Use `activity-context-only` for activity-context reads and writes. When implementation, documentation, review, analysis, taskbook, wiki, or external-system work is also requested, use a combined gate that explicitly includes the activity-context surface.
- Generic `external-system-only` does not authorize activity-context reads or writes and must not substitute for `activity-context-only`.
- Automatic creation is allowed only for the modes declared by the project profile. The default profile policy is `implementation`, `documentation-only`, `analysis-only`, `review-only`, and mutating `external-system-only`.
- `taskbook-only`, `wiki-only`, `question-only`, `status-only`, and `commit-text-only` do not create a new activity context automatically. They may update an existing context when the message continues the same tracked activity and the combined gate authorizes the activity-context surface.
- A direct user request to create or maintain activity context authorizes the activity-context surface regardless of the ordinary request mode.

## Canonical Identity

- One user activity has exactly one canonical activity-context note.
- Treat clarifications, corrections, follow-up requirements, related tasks, resumed work, and final results for the same user goal as updates to that same note.
- Do not create separate start, intermediate, result, final, follow-up, or per-task context notes for one activity.
- Search existing activity contexts before creating a note. If multiple candidates remain plausible, ask the user which activity to continue rather than selecting one silently.
- Keep a stable `activity_id` across title changes, clarification, completion, and reopening.

## Template Policy

- Resolve the Templater template logical path from `CODEX_PROJECT.md` before creating a new activity context.
- Check the template through Semantic Notes Vault MCP.
- If the template is absent, create it through MCP from `.agents/skills/obsidian-activity-context/references/activity-context-template.md`, then re-read and verify it.
- If the template exists, validate its required semantic fields and sections against the canonical reference.
- Safe additional frontmatter fields, sections, Dataview fields, tags, aliases, and formatting do not make a template outdated.
- If an existing template is outdated, incomplete, incompatible, or contains unsafe executable behavior, do not modify, replace, bypass, or duplicate it automatically. Show the detected differences and ask the user whether to update it while preserving custom content, map the project-specific structure explicitly, or cancel context creation.
- Never reapply a creation template to an existing activity-context note.
- Do not assume an MCP create operation executes Templater expressions. Follow the application mode and verification policy declared by `CODEX_PROJECT.md`, then read back the created note.

## Lifecycle

1. Read `CODEX_PROJECT.md` and resolve the active profile, language, logical paths, naming policy, template path, schema version, automatic modes, and fallback outbox.
2. Resolve `activity-context-only` or an explicitly combined request gate.
3. Search through MCP for the canonical context of the current user activity.
4. Before new tracked work, create the canonical context if none exists and automatic creation or direct authorization applies.
5. Record the initial request, every material clarification, the consolidated current scope, decisions, linked tasks, result, and open questions in the same note.
6. Use bounded MCP edits and preserve unrelated or user-defined content.
7. Mark completion by updating the same note. Reopen that note when the same activity resumes.
8. Re-read and verify every mutation through MCP.

Use `.agents/skills/obsidian-activity-context/references/activity-context-workflow.md` for detailed identity, structure, template drift, task linking, lifecycle, and fallback conventions.

## Temporary Fallback Outbox

When Semantic Notes Vault MCP is unavailable and the project declares a context fallback outbox:

- write only a temporary pending-operation record, not a second canonical context note;
- include the stable `activity_id`, intended logical context path, source request, timestamps, pending template state, pending creation state, and ordered pending updates;
- continue to treat Obsidian as the future source of truth;
- synchronize into the single canonical context through MCP when it becomes available;
- re-read and verify the resulting template and context note;
- delete the fallback record only after successful verification;
- keep and report records that could not be synchronized.

## Boundaries

- Activity contexts are mutable working records and do not belong to immutable `raw/` source storage.
- Activity contexts are not task notes and do not replace task-specific status, Definition Of Done, checks, or work logs.
- Activity contexts are not wiki pages and are not queried or ingested automatically by `obsidian-llm-wiki`.
- Do not store secrets, credentials, hidden reasoning, full tool transcripts, or unrelated debug logs in activity contexts.
- Do not access the vault through shell commands, scripts, direct editor operations, Git, or repository filesystem tools.

## Review Checklist

- [ ] `obsidian-activity-context` was active or activity-context work was directly requested.
- [ ] `activity-context-only` or an explicitly combined gate governed every context side effect.
- [ ] The canonical activity was searched before note creation.
- [ ] Exactly one context note represents the user activity.
- [ ] Clarifications, related tasks, and the result were added to the same note.
- [ ] The configured template was checked through MCP.
- [ ] A missing template was created from the canonical reference and verified.
- [ ] An outdated existing template was not changed without the user's decision.
- [ ] Existing context notes did not receive the creation template again.
- [ ] Every write was re-read and verified through MCP.
- [ ] Fallback remained temporary and synchronized into one canonical note.
- [ ] No taskbook, wiki, raw-source, shell, or Git side effects were introduced implicitly.
