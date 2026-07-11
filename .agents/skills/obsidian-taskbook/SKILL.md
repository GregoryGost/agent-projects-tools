---
name: obsidian-taskbook
description: "Use for the Obsidian project taskbook workflow: request-mode gating, task creation and planning, task status, Jira-style keys, overview pages, checks, work notes, raw-context links, completion, and archive."
---

# Obsidian Taskbook

Use this skill only when `CODEX_PROJECT.md` declares the `obsidian-taskbook` profile active, or when the user directly requests taskbook creation, updates, status changes, planning, checks, or archive work.

Apply `.codex/rules/request_routing.md`, `.codex/rules/obsidian_tasks.md`, and `obsidian-mcp-core` together with this skill.

The `obsidian-mcp-core` profile and skill are required. This overlay does not authorize wiki ingest or wiki edits.

## Scope

This skill owns:

- taskbook side-effect gating;
- implementation task planning and creation;
- task keys, titles, required sections, status, checks, and work notes;
- project and workspace task overview pages;
- links from task notes to related raw/context notes;
- task completion and archive;
- temporary task/context fallback outboxes while MCP is unavailable.

It does not own:

- wiki Query/Ingest, wiki index, source register, or wiki log;
- generic MCP access and mutation safety, which remain in `obsidian-mcp-core`.

## Side-Effect Gate

- Apply `request_routing.md` before any taskbook write, status change, fallback write, or synchronization.
- Do not mutate the taskbook in review-only, analysis-only, question-only, status-only, commit-text-only, wiki-only, documentation-only, or any other mode that does not authorize taskbook writes.
- Analysis, research, review, or explanation requests do not automatically authorize task creation.
- Use taskbook side effects only when the user explicitly requests them or implementation tracking is enabled by the project profile and request mode.

## Workflow

1. Read `CODEX_PROJECT.md` and confirm the profile, project key, task language, logical root, and fallback paths.
2. Resolve the allowed request mode and surfaces.
3. Apply `obsidian-mcp-core` for all vault access and safe edits.
4. Apply `.codex/rules/obsidian_tasks.md` for task structure, lifecycle, overview pages, checks, and archive.
5. Do not edit wiki pages during taskbook-only work.
6. Re-read and verify every taskbook mutation through MCP.

## Review Checklist

- [ ] `obsidian-taskbook` was active or taskbook work was directly requested.
- [ ] Request mode explicitly allowed taskbook side effects.
- [ ] `obsidian-mcp-core` governed all access and edits.
- [ ] Task structure, key, language, status, checks, and archive policy followed the task rule.
- [ ] Overview pages were updated only when required.
- [ ] No wiki Query/Ingest or wiki edits were introduced.
