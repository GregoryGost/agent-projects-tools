# Obsidian Activity Context rules

Apply this rule only when `CODEX_PROJECT.md` declares the `obsidian-activity-context` active stack profile, or when the user directly requests activity-context creation, continuation, updates, completion, reopening, template management, or fallback synchronization.

Do not activate this rule solely because `obsidian-mcp-core`, `obsidian-taskbook`, or `obsidian-llm-wiki` is active. Core access, task tracking, and wiki work do not automatically imply activity-context tracking.

## Required skills

Use together with:

- `obsidian-mcp-core`;
- `obsidian-activity-context`.

The dependency cycle between this rule and the `obsidian-activity-context` skill is intentional: this rule defines authorization and invariants, while the skill provides the reusable workflow entrypoint.

Apply `.codex/rules/request_routing.md` before every activity-context read or write.

## Authorization

- Use `activity-context-only` for activity-context side effects, alone or in an explicitly composed gate.
- Generic `external-system-only` does not authorize activity-context reads or writes.
- Read automatic-creation and continuation-only mode lists from the active Activity Context profile in `CODEX_PROJECT.md`; do not duplicate or infer those lists here.
- A direct user request to create or maintain activity context authorizes the activity-context surface regardless of the ordinary request mode.

## Canonical Identity

- One user activity has exactly one canonical activity-context note.
- Treat clarifications, corrections, follow-up requirements, related tasks, resumed work, and final results for the same user goal as updates to that note.
- Do not create separate start, intermediate, result, final, follow-up, or per-task context notes for one activity.
- Search existing activity contexts before creating a note. If multiple candidates remain plausible, ask the user which activity to continue.
- Keep a stable `activity_id` across title changes, clarification, completion, and reopening.

## Template And Lifecycle Invariants

- Before creating a new context, use the configured template path and application mode from `CODEX_PROJECT.md`.
- `references/activity-context-template.md` is the canonical source for template structure, missing-template creation, drift handling, and task-link storage.
- Never reapply the creation template to an existing activity-context note.
- Preserve the initial request, clarification history, current scope, durable decisions, aggregate result, and open questions in the same note.
- Completion and reopening update that same canonical note.

Use `.agents/skills/obsidian-activity-context/references/activity-context-workflow.md` for detailed identity, lifecycle, task linking, and fallback synchronization.

## Boundaries

- Activity contexts are mutable working records and do not belong to immutable `raw/` source storage.
- Activity contexts are not task notes and do not replace task-specific status, Definition Of Done, checks, or work logs.
- Activity contexts are not wiki pages and are not queried or ingested automatically by `obsidian-llm-wiki`.
- Temporary fallback records are synchronization journals, not canonical context notes.
- Do not store secrets, credentials, hidden reasoning, full tool transcripts, or unrelated debug logs in activity contexts.
- Do not access the vault through shell commands, scripts, direct editor operations, Git, or repository filesystem tools.

## Review Checklist

- [ ] The activity-context surface was active and project-configured mode policy was used.
- [ ] Exactly one canonical note represents the activity.
- [ ] Existing contexts were searched before creation.
- [ ] Template behavior and task-link storage followed the canonical template reference.
- [ ] Clarifications and the result stayed in the same note.
- [ ] Every MCP write was re-read and verified.
- [ ] No taskbook, wiki, raw-source, shell, or Git side effects were introduced implicitly.
