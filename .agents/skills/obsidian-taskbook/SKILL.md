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
- optional links to the single canonical activity context when that overlay is active and authorized;
- task completion and archive;
- temporary task fallback outboxes while MCP is unavailable.

It does not own:

- activity-context identity, lifecycle, Templater template policy, aggregate results, or context fallback outboxes;
- wiki Query/Ingest, wiki index, source register, or wiki log;
- generic MCP access and mutation safety, which remain in `obsidian-mcp-core`.

## Side-Effect Gate

- Apply `request_routing.md` before any taskbook write, status change, fallback write, or synchronization.
- Do not mutate the taskbook in review-only, analysis-only, question-only, status-only, commit-text-only, wiki-only, documentation-only, or any other mode that does not authorize taskbook writes.
- Analysis, research, review, explanation, or activity-context tracking does not automatically authorize task creation.
- Use taskbook side effects only when the user explicitly requests them or implementation tracking is enabled by the project profile and request mode.

## Optional Activity Context Coordination

When `obsidian-activity-context` is active and both request surfaces are authorized:

- link each task note to the canonical activity context;
- add the task link to that same context note;
- do not create one context note per task;
- keep task-specific checks and work details in the task note;
- keep the user goal, clarifications, consolidated scope, and aggregate result in the activity context;
- do not treat task completion as automatic activity completion.

This coordination is optional and does not create a hard dependency on `obsidian-activity-context`.

## Workflow

1. Read `CODEX_PROJECT.md` and confirm the profile, project key, task language, logical root, and task fallback path.
2. Resolve the allowed request mode and surfaces.
3. Apply `obsidian-mcp-core` for all vault access and safe edits.
4. Apply `.codex/rules/obsidian_taskbook.md` and `references/taskbook-workflow.md` for task structure, lifecycle, overview pages, checks, and archive.
5. Add bidirectional activity-context links only when that overlay and surface are active.
6. Store checks only under the nested `Checks` subsection inside `Notes on working on the task`; do not add a top-level `Checks` section.
7. Do not edit wiki pages during taskbook-only work.
8. Re-read and verify every taskbook mutation through MCP.

## Review Checklist

- [ ] `obsidian-taskbook` was active or taskbook work was directly requested.
- [ ] Request mode explicitly allowed taskbook side effects.
- [ ] `obsidian-mcp-core` governed all access and edits.
- [ ] Task structure, key, language, status, checks, and archive policy followed the task rule.
- [ ] Checks are nested inside `Notes on working on the task`.
- [ ] Overview pages were updated only when required.
- [ ] Activity-context links were added only when separately active and authorized.
- [ ] No duplicate or per-task context note was created.
- [ ] No wiki Query/Ingest or wiki edits were introduced.
