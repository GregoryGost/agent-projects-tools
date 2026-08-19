---
name: obsidian-activity-context
description: "Use for one canonical Obsidian context note per user activity, including clarifications, task links, results, Templater setup, and fallback synchronization."
---

# Obsidian Activity Context

Use this skill only when `CODEX_PROJECT.md` declares the `obsidian-activity-context` profile active, or when the user directly requests activity-context creation, continuation, updates, completion, reopening, template management, or fallback synchronization.

## Required Dependencies

- skill `obsidian-mcp-core`;
- rule `.codex/rules/obsidian_activity_context.md`;
- rule `.codex/rules/request_routing.md`.

The dependency cycle between this skill and `.codex/rules/obsidian_activity_context.md` is intentional: the rule defines authorization and invariants, while this skill provides the reusable workflow entrypoint.

Load references when needed:

- `references/activity-context-workflow.md` for identity, lifecycle, task linking, and fallback synchronization;
- `references/activity-context-template.md` for the canonical Templater schema and template drift policy;
- `references/official-sources.md` for Semantic Notes Vault MCP and Templater sources.

## Scope

This skill owns:

- one canonical context note per user activity;
- stable activity identity across follow-ups, completion, reopening, and multiple tasks;
- lifecycle updates for the initial request, material clarifications, current scope, decisions, aggregate result, and open questions;
- coordination of the context frontmatter `tasks` field with taskbook backlinks when separately active;
- activity-context template and fallback workflows defined by the references.

It does not own generic MCP safety, task-specific state/checks, or LLM Wiki Query/Ingest.

## Workflow

1. Read `CODEX_PROJECT.md` and resolve the activity-context paths and configurable policies, including creation modes, template application mode, task backlink field, and fallback outbox.
2. Apply `.codex/rules/request_routing.md` and `.codex/rules/obsidian_activity_context.md`.
3. Apply `obsidian-mcp-core` for every vault operation.
4. Use `references/activity-context-workflow.md` to resolve the canonical activity before creating or updating a note.
5. Use `references/activity-context-template.md` before creating a new context note.
6. Keep all material clarifications and the aggregate result in the same canonical context.
7. Coordinate task links only when `obsidian-taskbook` and the taskbook surface are separately active.
8. Re-read and verify every MCP mutation.

## Boundaries

- Do not create start, result, final, follow-up, or per-task context notes for one activity.
- Do not place mutable activity contexts in immutable `raw/` storage.
- Do not duplicate the canonical context task-link set in a second required body section.
- Do not treat fallback records as canonical notes.
- Do not access the vault through shell, direct filesystem operations, editor automation, or Git.

## Review Checklist

- [ ] Required dependencies and the activity-context surface were active.
- [ ] One stable activity identity resolved to one canonical note.
- [ ] Project-configured policies came from `CODEX_PROJECT.md` rather than duplicated defaults.
- [ ] Template handling and fallback followed their canonical references.
- [ ] Task links used one canonical context field and a task-side backlink when applicable.
- [ ] Clarifications and the result remained in the original context note.
