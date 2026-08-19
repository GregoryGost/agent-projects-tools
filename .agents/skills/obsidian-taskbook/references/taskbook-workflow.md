# Obsidian Taskbook Workflow Reference

Use this reference only with the `obsidian-taskbook` profile. All vault access and mutation safety remain governed by `obsidian-mcp-core`; all side effects remain gated by `request_routing.md`.

## Activation

Use the taskbook workflow only when taskbook changes are explicitly requested or implementation tracking is enabled by `CODEX_PROJECT.md` and allowed by the selected request mode.

Do not create or update tasks for modes that do not authorize taskbook writes.

## Project Paths

Resolve all paths from `CODEX_PROJECT.md`:

- task notes: `tasks/{project_key}/` or the project-specific equivalent;
- project overview: `tasks/all-tasks-{project_key}`;
- optional workspace overview: `all-tasks-workflow`;
- completed task archive: `tasks/archive/{project_key}/`;
- task fallback outbox.

These are logical MCP paths, not filesystem paths. Activity-context paths and fallback outboxes belong to `obsidian-activity-context`, not this workflow.

## Task Identity

- Use Jira-style keys based on the project key, for example `NRS-25`.
- Place the key and concise summary in the task title.
- Store the task note under the configured project task folder.
- Use the task language declared in `CODEX_PROJECT.md`.
- Keep identifiers, variables, paths, package names, protocols, libraries, and proper names in their original form.

## Required Task Structure

Task notes contain exactly six required structure elements: one frontmatter block followed by five top-level Markdown sections.

1. `frontmatter` block;
2. `Problem`;
3. `Description`;
4. `Additional information`;
5. `Definition Of Done`;
6. `Notes on working on the task`.

The frontmatter block is a structural element, not a Markdown section. Use project-approved frontmatter and status values. Do not add unrelated top-level sections.

`Checks` is not a separate required structure element or top-level section. Store it as a nested subsection inside `Notes on working on the task`. When task sections use `##`, use this shape:

```markdown
## Notes on working on the task

Implementation progress and final work notes.

### Checks

- 2026-07-12 18:30 — `pytest` passed.
- 2026-07-12 18:35 — `ruff check` passed.
```

Do not use this shape:

```markdown
## Notes on working on the task

Implementation progress and final work notes.

## Checks

- Validation result.
```

## Planning And Creation

When authorized implementation work requires task tracking:

1. Plan and divide the implementation into task-sized units before starting work.
2. Search existing task notes and overview pages through MCP to prevent duplicates.
3. Create the required task notes through MCP.
4. Add or update overview entries only after task notes exist.
5. Apply Activity Context Links when `obsidian-activity-context` is separately active and authorized.
6. Re-read and verify task notes and overview pages.

If MCP is unavailable, use only the configured task fallback outbox and synchronize later through MCP.

## Activity Context Links

Activity-context coordination is optional and does not activate taskbook or activity-context side effects by itself.

When both overlays and surfaces are active:

- add each related task note link to the activity context frontmatter `tasks` field; this field is the canonical task-link set in the context note;
- link each task note back through the task backlink field declared by `CODEX_PROJECT.md`;
- task creation does not create another context note;
- task notes remain the source of truth for status, Definition Of Done, checks, and detailed work notes;
- the activity context remains the source of truth for the user goal, clarification history, consolidated current scope, and aggregate result;
- closing one task does not necessarily complete the activity;
- update the activity-level result only when the activity-context surface is also authorized.

## Status And Work Notes

- Set a started task to the project-approved in-progress status.
- Record implementation progress and final task-specific results in `Notes on working on the task`.
- Keep the nested `Checks` subsection inside `Notes on working on the task`.
- Close tasks only after Definition Of Done and required checks are satisfied.
- Move completed tasks to the configured archive through MCP.
- Keep overview pages consistent with task state and location.
- Do not create a separate final context note. When activity-context tracking is active, update the original canonical context through that overlay.

## Checks Convention

- Record checks only under the nested `Checks` subsection inside `Notes on working on the task`.
- Do not create a top-level `Checks` section.
- Each check should include date/time and a concise result.
- Record only checks relevant to the task scope.
- Mark the final successful check according to the project convention when it supports closing the task.

## Overview Pages

- Keep one overview entry per task note.
- Arrange overview entries according to the project convention, typically newest first and hierarchically.
- Do not create separate Open/Closed sections unless the project explicitly requires them.
- Update workspace overview pages only when the project participates in a multi-project workspace and the profile declares that page.

## Templater-Aware Task Formatting

- Use task templates only when enabled, explicitly requested, or already used by the project.
- Discover and read templates through MCP only.
- Do not assume MCP creation executes Templater expressions.
- Write resolved Markdown unless a tool explicitly applies a template.
- Preserve frontmatter, status, the nested checks subsection, history, links, and intentional template expressions.
- Do not add executable template logic without explicit approval.

## Boundaries

- Do not create, update, complete, or synchronize activity contexts unless `obsidian-activity-context` is separately active and the request gate includes that surface.
- Do not edit wiki pages, wiki indexes, source registers, or wiki logs during taskbook-only work.
- Do not run wiki ingest from taskbook activity.
- Use `obsidian-llm-wiki` separately when wiki changes are explicitly requested and authorized.

## Review Checklist

- [ ] Request mode authorized taskbook side effects.
- [ ] Existing tasks and overview pages were checked before creation.
- [ ] Task key, path, language, title, and structure follow the profile.
- [ ] Status, work notes, checks, overview, and archive remain consistent.
- [ ] Checks are nested inside `Notes on working on the task`, not stored as a top-level section.
- [ ] Activity-context links use the context `tasks` field and the configured task backlink when applicable.
- [ ] Every write was re-read and verified through MCP.
- [ ] No wiki side effects were introduced.
