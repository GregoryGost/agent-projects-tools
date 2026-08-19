# Obsidian Activity Context Workflow Reference

Use this reference only with the `obsidian-activity-context` profile. Generic vault access and mutation safety remain governed by `obsidian-mcp-core`; all side effects remain gated by `request_routing.md`.

## Activity Identity

An activity is one user goal that may span multiple messages, sessions, clarifications, corrections, implementation steps, external-system operations, and related tasks.

Continue the same canonical context when:

- the user clarifies or corrects the goal;
- the requested scope expands or contracts without becoming an independent goal;
- implementation resumes after a pause;
- related task notes are created or completed;
- the user asks for status, explanation, commit text, or another follow-up tied to the same work;
- a completed activity is reopened for further work.

Create a new activity context only when:

- the user starts an independent goal;
- the new work has a separate outcome and lifecycle;
- the user explicitly asks to split the work;
- no existing context can be identified confidently.

If multiple existing contexts remain plausible, ask the user to select one.

## Stable Identity And Path

Use the identity, naming, and creation-mode policies declared by `CODEX_PROJECT.md`. Do not duplicate those project-configured values in this reference.

The `activity_id` remains stable when the title, slug, status, or current scope changes.

A direct user request for activity-context tracking authorizes the activity-context surface after routing. For automatic creation and continuation behavior, use the exact mode lists declared by the active project profile.

## New Context Workflow

1. Read `CODEX_PROJECT.md` and resolve the project root, context folder, template path, language, schema version, naming policy, creation-mode policy, task backlink field, and fallback outbox.
2. Resolve the request mode and activity-context surface.
3. Search active and recently completed activity contexts by `activity_id`, title, task links, current scope, and project key.
4. If no canonical context exists and creation is authorized, check the configured Templater template through MCP.
5. Follow `activity-context-template.md` for missing-template creation and existing-template drift handling.
6. Create one context note and populate identity, original request, current scope, timestamps, and status.
7. Re-read the created note and verify required semantic roles.

Do not create the context before reading `CODEX_PROJECT.md` and resolving routing, because the project profile is the source of truth for paths and configurable policy.

## Clarification Workflow

For each material user clarification:

1. Read the current canonical context.
2. Append a timestamped entry describing the new requirement or correction.
3. State when it replaces or narrows a previous assumption.
4. Update the current-scope section to the latest consolidated requirement.
5. Preserve the original request and earlier clarification history.
6. Re-read and verify the bounded edit.

Do not store a full conversation transcript. Capture durable requirements and decisions.

## Work And Result Workflow

During work:

- record durable decisions and meaningful activity-level progress;
- keep detailed checks, Definition Of Done, and implementation logs in task notes;
- store related task links only in the canonical task-link field defined by `activity-context-template.md`;
- avoid hidden reasoning, raw tool transcripts, transient debugging, secrets, or credentials.

At completion:

1. Read the context and linked tasks when taskbook coordination is active.
2. Update the result section with the aggregate outcome, deliverables, partial failures, limitations, and unresolved items.
3. Update `updated_at`, `completed_at`, and status.
4. Do not create a separate result or final context note.
5. Re-read and verify the same canonical note.

When the same activity resumes, change the status according to project policy and continue updating the same note.

## Taskbook Coordination

When `obsidian-taskbook` is active and both surfaces are authorized:

- one activity context may link multiple task notes through the canonical task-link field defined by `activity-context-template.md`;
- each related task note links back using the task backlink field declared by `CODEX_PROJECT.md`;
- creating a task does not create another context automatically;
- completing one task does not necessarily complete the activity;
- task notes remain the source of truth for task status, Definition Of Done, checks, and detailed work notes;
- the activity context remains the source of truth for the user goal, clarification history, consolidated scope, and aggregate result.

## Wiki Coordination

Activity contexts are mutable working records, not immutable raw sources or canonical wiki pages.

- Wiki Query does not read activity contexts automatically.
- Wiki Ingest does not ingest an activity context automatically.
- Explicitly authorized wiki ingest may use a context as a source while preserving the context note in place.
- Wiki work does not modify context lifecycle fields unless activity-context work is separately authorized.

## Temporary Fallback Outbox

A fallback record is a temporary synchronization journal, not a second context note.

A recommended record contains:

```yaml
activity_id:
target_context_path:
created_at:
updated_at:
pending_template_check:
pending_template_creation:
pending_context_creation:
pending_updates: []
```

When MCP recovers:

1. Read the pending record.
2. Search for an existing canonical context before creation.
3. Check or create the configured template according to `activity-context-template.md`.
4. Apply ordered pending updates to one canonical context.
5. Re-read and verify the template and context.
6. Delete the pending record only after successful verification.
7. Keep and report the record when synchronization is incomplete.

## Review Checklist

- [ ] The user goal was resolved to one stable activity identity.
- [ ] Existing contexts were searched before creation.
- [ ] Automatic creation and continuation followed the project-declared mode lists.
- [ ] Template handling followed `activity-context-template.md`.
- [ ] Clarifications preserved history and updated the consolidated scope.
- [ ] Related task links used the canonical template field and the configured task backlink when applicable.
- [ ] Completion updated the same context note.
- [ ] Fallback synchronized into one canonical note and was deleted only after verification.
