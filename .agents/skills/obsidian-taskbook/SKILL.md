---
name: obsidian-taskbook
description: "Use for Obsidian taskbook planning, task lifecycle, status, checks, overview pages, and archive."
---

# Obsidian Taskbook

Use this skill only when `CODEX_PROJECT.md` declares the `obsidian-taskbook` profile active, or when the user directly requests taskbook creation, updates, status changes, planning, checks, or archive work.

Apply `.codex/rules/request_routing.md`, `.codex/rules/obsidian_taskbook.md`, and `obsidian-mcp-core` together with this skill.

The `obsidian-mcp-core` profile and skill are required. This overlay does not authorize activity-context or wiki changes.

Load `references/taskbook-workflow.md` for detailed task identity, structure, lifecycle, overview, checks, activity-context linking, template, and archive conventions.

## Scope

This skill owns:

- taskbook side-effect gating;
- implementation task planning and creation;
- task keys, titles, required sections, status, checks nested inside work notes, and work notes;
- project and workspace task overview pages;
- optional activity-context link coordination when separately active;
- task completion and archive;
- temporary task fallback outboxes while MCP is unavailable.

It does not own activity-context lifecycle/template/fallback behavior, wiki Query/Ingest, or generic MCP safety.

## Side-Effect Gate

- Apply `request_routing.md` before any taskbook write, status change, fallback write, or synchronization.
- Do not mutate the taskbook in a mode that does not authorize taskbook writes.
- Analysis, research, review, explanation, or activity-context tracking does not automatically authorize task creation.
- Use taskbook side effects only when the user explicitly requests them or implementation tracking is enabled by the project profile and request mode.

## Workflow

1. Read `CODEX_PROJECT.md` and confirm the taskbook profile, project key, task language, logical paths, and task fallback path.
2. Resolve the allowed request mode and surfaces.
3. Apply `obsidian-mcp-core` for all vault access and safe edits.
4. Apply `.codex/rules/obsidian_taskbook.md` and `references/taskbook-workflow.md` for task structure, lifecycle, overview pages, checks, archive, and optional activity-context links.
5. Store checks only under the nested `Checks` subsection inside `Notes on working on the task`; do not add a top-level `Checks` section.
6. Do not edit wiki pages during taskbook-only work.
7. Re-read and verify every taskbook mutation through MCP.

## Review Checklist

- [ ] `obsidian-taskbook` was active or taskbook work was directly requested.
- [ ] Request mode explicitly allowed taskbook side effects.
- [ ] `obsidian-mcp-core` governed all access and edits.
- [ ] Task structure, key, language, status, checks, overview, and archive policy followed the task rule.
- [ ] Optional activity-context coordination followed `references/taskbook-workflow.md`.
- [ ] No wiki Query/Ingest or wiki edits were introduced.
