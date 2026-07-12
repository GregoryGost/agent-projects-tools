# Obsidian Taskbook Workflow Reference

Use this reference only with the `obsidian-taskbook` profile. All vault access and mutation safety remain governed by `obsidian-mcp-core`; all side effects remain gated by `request_routing.md`.

## Activation

Use the taskbook workflow only when taskbook changes are explicitly requested or implementation tracking is enabled by `CODEX_PROJECT.md` and allowed by the selected request mode.

Do not create or update tasks for analysis, research, review, explanation, status-only, commit-text-only, wiki-only, documentation-only, or other modes that do not authorize taskbook writes.

## Project Paths

Resolve all paths from `CODEX_PROJECT.md`:

- task notes: `tasks/{project_key}/` or the project-specific equivalent;
- project overview: `tasks/all-tasks-{project_key}`;
- optional workspace overview: `all-tasks-workflow`;
- completed task archive: `tasks/archive/{project_key}/`;
- task and context fallback outboxes.

These are logical MCP paths, not filesystem paths.

## Task Identity

- Use Jira-style keys based on the project key, for example `NRS-25`.
- Place the key and concise summary in the task title.
- Store the task note under the configured project task folder.
- Use the task language declared in `CODEX_PROJECT.md`.
- Keep identifiers, variables, paths, package names, protocols, libraries, and proper names in their original form.

## Required Task Structure

Task notes contain only:

1. `frontmatter`;
2. `Problem`;
3. `Description`;
4. `Additional information`;
5. `Definition Of Done`;
6. `Notes on working on the task`.

Use project-approved frontmatter and status values. Do not add unrelated top-level sections.

## Planning And Creation

When authorized implementation work requires task tracking:

1. Plan and divide the implementation into task-sized units before starting work.
2. Search existing task notes and overview pages through MCP to prevent duplicates.
3. Create the required task notes through MCP.
4. Add or update overview entries only after task notes exist.
5. Link relevant raw/context notes from the task.
6. Re-read and verify task notes and overview pages.

If MCP is unavailable, use only the configured fallback outbox and synchronize later through MCP.

## Status And Work Notes

- Set a started task to the project-approved in-progress status.
- Record implementation progress and final results in `Notes on working on the task` rather than creating a separate final context note.
- Close tasks only after Definition Of Done and required checks are satisfied.
- Move completed tasks to the configured archive through MCP.
- Keep overview pages consistent with task state and location.

## Checks

- Record checks related to the task in the project-approved checks convention.
- Each check should include date/time and a concise result.
- Record only checks relevant to the task scope.
- Mark the final successful check according to the project convention when it supports closing the task.

## Overview Pages

- Keep one overview entry per task note.
- Arrange overview entries according to the project convention, typically newest first and hierarchically.
- Do not create separate Open/Closed sections unless the project explicitly requires them.
- Update workspace overview pages only when the project participates in a multi-project workspace and the profile declares that page.

## Raw Context Links

- Context and analysis notes belong to `raw/` and are created through MCP when authorized.
- Link task notes to the relevant raw/context notes.
- Do not treat fallback files as permanent notes.
- Complete pending links during fallback synchronization.

## Templater-Aware Task Formatting

- Use task templates only when enabled, explicitly requested, or already used by the project.
- Discover and read templates through MCP only.
- Do not assume MCP creation executes Templater expressions.
- Write resolved Markdown unless a tool explicitly applies a template.
- Preserve frontmatter, status, checks, history, links, and intentional template expressions.
- Do not add executable template logic without explicit approval.

## Boundaries

- Do not edit wiki pages, wiki indexes, source registers, or wiki logs during taskbook-only work.
- Do not run wiki ingest from taskbook activity.
- Use `obsidian-llm-wiki` separately when wiki changes are explicitly requested and authorized.

## Review Checklist

- [ ] Request mode authorized taskbook side effects.
- [ ] Existing tasks and overview pages were checked before creation.
- [ ] Task key, path, language, title, and structure follow the profile.
- [ ] Status, work notes, checks, overview, and archive remain consistent.
- [ ] Raw/context links point to MCP-managed notes.
- [ ] Every write was re-read and verified through MCP.
- [ ] No wiki side effects were introduced.
