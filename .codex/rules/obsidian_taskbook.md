# Obsidian Taskbook rules

Apply this rule only when `CODEX_PROJECT.md` declares the `obsidian-taskbook` active stack profile, or when the user directly requests taskbook creation, planning, updates, status changes, checks, overview maintenance, or archive work.

Do not activate this rule solely because `obsidian-mcp-core` is active. Core MCP access does not imply task tracking.

## Required skills

Use together with:

- `obsidian-mcp-core`;
- `obsidian-taskbook`.

Apply `.codex/rules/request_routing.md` before every taskbook write, status change, fallback write, or synchronization.

## Side-Effect Gate

- This rule cannot expand the side effects allowed by `request_routing.md`.
- Do not mutate the taskbook in review-only, analysis-only, question-only, status-only, commit-text-only, wiki-only, documentation-only, or another mode that does not authorize taskbook writes.
- Analysis, research, review, or explanation does not automatically authorize task creation.
- Use taskbook writes only when explicitly requested or when implementation tracking is enabled by the project profile and selected request mode.

## Scope

This rule governs:

- implementation task planning and task creation;
- Jira-style task keys based on the project key;
- task title, frontmatter, required sections, language, status, checks, and work notes;
- project/workspace task overview pages;
- links to related raw/context notes;
- task completion and archive;
- task/context fallback outboxes while MCP is unavailable.

It does not govern LLM Wiki Query/Ingest, wiki index, source register, or wiki log.

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

## Workflow

1. Read `CODEX_PROJECT.md` and confirm the project key, task language, logical root, task paths, overview paths, archive path, and fallback outboxes.
2. Resolve request mode and allowed surfaces through `request_routing.md`.
3. Apply `obsidian-mcp-core` for every taskbook read and mutation.
4. Read existing task and overview notes before editing.
5. Create or update tasks with bounded MCP operations and verify them after writing.
6. Record implementation checks only in the nested `Checks` subsection inside `Notes on working on the task`; do not create a top-level `Checks` section.
7. Move completed tasks to the declared task archive and update overview pages when required.
8. Do not edit wiki pages during taskbook-only work.

Use `.agents/skills/obsidian-taskbook/references/taskbook-workflow.md` for detailed task identity, structure, lifecycle, overview, checks, context-link, template, and archive conventions.

## Review Checklist

- [ ] `obsidian-taskbook` was active or taskbook work was directly requested.
- [ ] Request mode explicitly allowed every taskbook side effect.
- [ ] `obsidian-mcp-core` governed all vault access and edits.
- [ ] Task key, language, structure, status, checks, overview, and archive policy were followed.
- [ ] Checks are nested inside `Notes on working on the task`, not stored as a top-level section.
- [ ] Every write was verified through MCP.
- [ ] No wiki Query/Ingest or wiki edits were introduced.
