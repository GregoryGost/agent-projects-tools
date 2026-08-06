---
name: obsidian-activity-context
description: "Use for one canonical Obsidian context note per user activity, including clarifications, related tasks, results, Templater setup, and fallback synchronization."
---

# Obsidian Activity Context

Use this skill only when `CODEX_PROJECT.md` declares the `obsidian-activity-context` profile active, or when the user directly requests activity-context creation, continuation, updates, completion, reopening, template management, or fallback synchronization.

## Required Dependencies

- skill `obsidian-mcp-core`;
- rule `.codex/rules/obsidian_activity_context.md`;
- rule `.codex/rules/request_routing.md`.

The dependency cycle between this skill and `.codex/rules/obsidian_activity_context.md` is intentional: the rule defines authorization and invariants, while this skill defines the reusable workflow.

Load references when needed:

- `references/activity-context-workflow.md` for identity, lifecycle, template validation, task linking, and fallback synchronization;
- `references/activity-context-template.md` for the canonical Templater template schema;
- `references/official-sources.md` for Semantic Notes Vault MCP and Templater sources.

## Scope

This skill owns:

- one canonical context note per user activity;
- initial request, material clarifications, consolidated current scope, decisions, related tasks, result, and open questions;
- stable activity identity across follow-ups, completion, reopening, and multiple tasks;
- Templater template presence checks, canonical creation when absent, drift detection, and user-controlled updates when outdated;
- temporary activity-context fallback outboxes while MCP is unavailable;
- context completion and reopening without creating a second context note.

It does not own:

- generic MCP access and mutation safety, which remain in `obsidian-mcp-core`;
- task status, Definition Of Done, checks, task overviews, or task archive, which remain in `obsidian-taskbook`;
- wiki Query/Ingest, immutable raw sources, wiki indexes, source registers, or wiki logs, which remain in `obsidian-llm-wiki`.

## Automatic Creation Policy

Use the exact project policy from `CODEX_PROJECT.md`. The default profile policy is:

- create automatically for `implementation`, `documentation-only`, `analysis-only`, `review-only`, and mutating `external-system-only`;
- do not create automatically for `taskbook-only`, `wiki-only`, `question-only`, `status-only`, or `commit-text-only`;
- allow continuation-only modes to update an existing context when they remain part of the same activity and the combined request gate authorizes it;
- create when the user directly requests context tracking, regardless of the ordinary request mode.

## Workflow

1. Read `CODEX_PROJECT.md` and resolve the activity-context profile, logical root, context path, template path, language, schema version, naming policy, automatic modes, and fallback outbox.
2. Apply `.codex/rules/request_routing.md` and resolve `activity-context-only` or a combined gate that explicitly includes it.
3. Apply `obsidian-mcp-core` for every vault search, read, create, edit, move, and verification.
4. Search existing activity contexts using the stable identity fields and the current user goal before creating a note.
5. When a new note is authorized, validate or create the configured Templater template before creating the context.
6. Create exactly one canonical activity-context note and verify that required fields and sections were rendered.
7. Append material clarifications chronologically and update the consolidated current scope without deleting the original request history.
8. Link related tasks bidirectionally when `obsidian-taskbook` is also active and authorized.
9. Record the aggregate result in the same context note after the work and relevant task outcomes are known.
10. Mark the same note completed or reopened as the activity lifecycle changes.
11. Re-read and verify every write through MCP.

## Template Management

- Read the configured template path through MCP before creating a context.
- If the template is missing, create it through MCP from `references/activity-context-template.md` and verify the created file.
- Validate an existing template by semantic role rather than byte-for-byte equality.
- Preserve safe project-specific additions.
- Treat missing required roles, an outdated schema version, incompatible automation, additional context-note creation, file moves, shell/system commands, or destructive behavior as drift requiring the user's decision.
- When drift is detected, report the exact differences and ask the user to choose an update preserving custom content, an explicit project-specific mapping, or cancellation.
- Do not automatically repair, replace, bypass, or duplicate an existing outdated template.
- Never reapply the creation template to an existing activity context.

## Context Update Rules

- Keep the original request as historical input.
- Add each material clarification with a timestamp and concise statement of its effect.
- Update the current-scope section to represent the latest consolidated requirement.
- Store durable decisions and meaningful implementation progress, not hidden reasoning or full command transcripts.
- Keep task-specific checks and detailed work logs in task notes; summarize only activity-level outcomes in the context.
- Do not create a result note after completion. Update the original canonical note.

## Fallback Synchronization

When MCP is unavailable and the profile declares a fallback outbox:

1. Create or update one temporary pending-operation record for the stable `activity_id`.
2. Record the intended context path, template state, initial request, clarifications, links, result, and ordered pending actions.
3. Do not present the outbox as an Obsidian note or source of truth.
4. After MCP recovery, search for the canonical context before creating anything.
5. Validate or create the template, then create or update the single canonical context.
6. Re-read and verify the synchronized result.
7. Delete the outbox only after successful verification.

## Review Checklist

- [ ] Required dependencies were present and active.
- [ ] The project profile and request gate authorized activity-context work.
- [ ] Existing contexts were searched before creation.
- [ ] One stable `activity_id` and one canonical note represent the activity.
- [ ] The template path was checked through MCP.
- [ ] A missing template was created from the canonical reference and verified.
- [ ] An outdated template was left unchanged until the user selected an action.
- [ ] Material clarifications and the final result were written to the original note.
- [ ] Related task links were bidirectional when applicable.
- [ ] Every write was re-read and verified.
- [ ] Fallback remained temporary and was removed only after synchronization.
