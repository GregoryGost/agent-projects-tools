# Obsidian Taskbook rules

Apply this rule only when `CODEX_PROJECT.md` declares the `obsidian-taskbook` active stack profile, or when the user directly requests taskbook creation, planning, updates, status changes, checks, overview maintenance, or archive work.

Do not activate this rule solely because `obsidian-mcp-core` or `obsidian-activity-context` is active. Core MCP access and activity-context tracking do not imply task tracking.

## Required skills

Use together with:

- `obsidian-mcp-core`;
- `obsidian-taskbook`.

Apply `.codex/rules/request_routing.md` before every taskbook read, write, status change, fallback write, or synchronization.

## Side-Effect Gate

- This rule cannot expand the side effects allowed by `request_routing.md`.
- Use `taskbook-only` for every taskbook read or write. When another authorized surface is also requested, use a combined gate that explicitly includes each surface.
- Generic `external-system-only` does not authorize taskbook reads or writes and must not substitute for `taskbook-only`.
- Do not mutate the taskbook in a mode that does not authorize taskbook writes.
- Analysis, research, review, explanation, or activity-context tracking does not automatically authorize task creation.
- Use taskbook writes only when explicitly requested or when implementation tracking is enabled by the project profile and request mode.

## Scope

This rule governs:

- implementation task planning and task creation;
- Jira-style task keys based on the project key;
- task title, frontmatter, required sections, language, status, checks, and work notes;
- project/workspace task overview pages;
- optional links to the canonical activity context when that overlay is separately active and authorized;
- task completion and archive;
- temporary task fallback outboxes while MCP is unavailable.

It does not govern activity-context lifecycle/template/fallback behavior or LLM Wiki Query/Ingest.

## Task Structure

Task notes must contain exactly six required structure elements: one frontmatter block followed by five top-level Markdown sections.

1. `frontmatter` block;
2. `Problem`;
3. `Description`;
4. `Additional information`;
5. `Definition Of Done`;
6. `Notes on working on the task`.

The frontmatter block is a structural element, not a Markdown section. Do not add unrelated top-level sections.

`Checks` is not an additional top-level section. Store checks inside `Notes on working on the task` under a nested `Checks` heading one level below the section heading. When top-level task sections use `##`, use `### Checks`.

Use the task language declared in `CODEX_PROJECT.md`; preserve identifiers, paths, library names, protocols, and proper names in their original form.

## Activity Context Coordination

When `obsidian-activity-context` is separately active and both surfaces are authorized, coordinate task/context links according to `.agents/skills/obsidian-taskbook/references/taskbook-workflow.md` and the project-declared task backlink field. Taskbook does not own activity-context creation, completion, template handling, or fallback synchronization.

## Workflow

1. Read `CODEX_PROJECT.md` and confirm the project key, task language, logical root, task paths, overview paths, archive path, and task fallback outbox.
2. Resolve `taskbook-only` or a combined request gate that explicitly includes the taskbook surface.
3. Apply `obsidian-mcp-core` for every taskbook read and mutation.
4. Read existing task and overview notes before editing.
5. Create or update tasks with bounded MCP operations and verify them after writing.
6. Apply `references/taskbook-workflow.md` for activity-context links when that overlay is separately active.
7. Record implementation checks only in the nested `Checks` subsection inside `Notes on working on the task`; do not create a top-level `Checks` section.
8. Move completed tasks to the declared task archive and update overview pages when required.
9. Do not edit wiki pages during taskbook-only work.

Use `.agents/skills/obsidian-taskbook/references/taskbook-workflow.md` for detailed task identity, structure, lifecycle, overview, checks, activity-context linking, template, and archive conventions.

## Review Checklist

- [ ] `obsidian-taskbook` was active or taskbook work was directly requested.
- [ ] Request mode explicitly allowed taskbook side effects.
- [ ] `obsidian-mcp-core` governed all vault access and edits.
- [ ] Task key, language, structure, status, checks, overview, and archive policy were followed.
- [ ] Checks are nested inside `Notes on working on the task`, not stored as a top-level section.
- [ ] Activity-context coordination used the taskbook workflow only when separately active and authorized.
- [ ] Every write was verified through MCP.
- [ ] No wiki Query/Ingest or wiki edits were introduced.
