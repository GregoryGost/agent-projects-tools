---
name: obsidian-mcp-core
description: "Use for MCP-only Obsidian vault access, safe partial edits, verification, fallback sync, and protected note syntax."
---

# Obsidian MCP Core

Use this skill whenever a task reads, searches, creates, updates, moves, or reviews Obsidian content through the Semantic Notes Vault MCP plugin.

This skill defines access and mutation safety only. It does not activate the activity-context, LLM Wiki, or taskbook workflows. Apply `obsidian-activity-context`, `obsidian-llm-wiki`, or `obsidian-taskbook` separately when their profiles are active or their content is directly in scope.

Load `references/patterns-and-review.md` for safe-edit examples and review checks.

## MCP-Only Vault Access

- All Obsidian vault operations must use the connected Semantic Notes Vault MCP plugin.
- Treat project logical roots and paths such as `contexts/`, `raw/`, `wiki/`, `tasks/`, and `archive/` as MCP paths, not repository filesystem paths.
- Do not inspect or modify vault content through shell commands, scripts, direct editor operations, Git, or repository filesystem tools.
- Do not treat local fallback outboxes as a second vault or source of truth.

## Tool Routing

- Use `vault` operations for list, search, read, create, move, rename, copy, split, combine, and explicitly approved whole-note replacement.
- Use `edit` operations for append, section patching, bounded window edits, and other partial updates.
- Use `graph`, `dataview`, or `bases` only when the task needs those capabilities and the connected MCP exposes them.
- Use `system` operations when server, vault, or capability status is uncertain.

## Read Before Write

For every update to an existing note:

1. Read the current note through MCP.
2. Locate the exact section, heading, block, field, or append position.
3. Use the smallest safe MCP edit operation.
4. Re-read the note through MCP.
5. Verify the intended change and preservation of unrelated content.

Do not update existing notes from memory or stale snippets.

## Full-File Replacement Guard

- Treat whole-note replacement as destructive by default.
- Do not use it for appends, status changes, checks, links, frontmatter fields, or section updates.
- Use it only when the user explicitly requests complete replacement or the workflow intentionally regenerates the whole note.
- Read immediately before replacement and verify immediately after it.

## Create, Move, And Archive Semantics

- Search or list first when a target note may already exist.
- Create only when the target does not already exist or a separate note is intentional.
- Inspect source and destination before move, rename, or archive operations.
- Verify source and destination states after the operation.

## Templater And PlantUML Preservation

- Use Templater-aware behavior only when enabled in `CODEX_PROJECT.md`, explicitly requested, or already present in the target note/template.
- Do not assume MCP create/update operations execute Templater expressions.
- Write resolved Markdown for ordinary notes unless an MCP tool explicitly applies a template or the project declares a verified Templater trigger workflow.
- When an active overlay declares a required template, check the configured logical template path through MCP before creating the target note.
- If the template is absent and the overlay defines a canonical reference, create the template through MCP from that reference and verify it before use.
- Do not overwrite, silently repair, bypass, or duplicate an existing template merely because it differs from the canonical reference. Follow the overlay's drift policy.
- Even when a Templater folder or regex trigger is declared, re-read the newly created note and verify that required fields and sections were rendered.
- Never reapply a creation template to an existing note unless the user explicitly requests complete regeneration and the overlay permits it.
- Preserve `<% ... %>`, `<%* ... %>`, `tp.*`, frontmatter expressions, PlantUML fences, and plugin-specific syntax when they are intentional.
- Do not add executable Templater JavaScript, user scripts, or system commands without explicit approval.

## Local Fallback Outboxes

Use fallback files only when the Obsidian MCP is unavailable and the active project profile declares the relevant outbox.

- Record the intended logical path, note type, stable identity when available, source request, timestamp, and pending action.
- Treat fallback as a temporary synchronization journal, never as a second canonical note.
- Synchronize through MCP when it becomes available.
- Search the vault before creation so synchronization does not produce duplicates.
- Re-read and verify the Obsidian result.
- Delete the fallback file only after successful verification.
- Keep and report fallback files that could not be synchronized.

## Overlay Boundaries

- `obsidian-activity-context` owns mutable activity-context notes, their lifecycle, Templater template policy, and context fallback outboxes.
- `obsidian-llm-wiki` owns wiki Query/Ingest, immutable `raw/` source policy, wiki structure, index, source register, and wiki log.
- `obsidian-taskbook` owns task creation, task status, task notes, overview pages, checks, archive, and task fallback outboxes.
- Activity-context notes are not immutable `raw/` sources, task notes, or wiki pages.
- Core access does not activate any overlay automatically.
- When an overlay is active, apply this core skill together with the corresponding overlay skill and rule.

## Review Checklist

- [ ] Obsidian access used MCP only.
- [ ] The project logical root came from `CODEX_PROJECT.md`.
- [ ] Existing notes were read before editing.
- [ ] Partial updates used bounded edit operations.
- [ ] Whole-note replacement was explicit and verified.
- [ ] Every write was followed by MCP read-back verification.
- [ ] Required templates were checked through MCP before use.
- [ ] Missing templates were created only from an overlay-defined canonical reference.
- [ ] Existing template drift followed the owning overlay's policy.
- [ ] Fallback was used only during MCP unavailability and remained temporary.
- [ ] Templater and PlantUML syntax was preserved when present.
- [ ] Activity-context, wiki, or taskbook behavior was applied only through its active overlay.
