---
name: obsidian-semantic-notes-mcp
description: "Use for all Obsidian work through the Semantic Notes Vault MCP plugin: reading, searching, creating, updating, moving, and reviewing notes/tasks/wiki pages, safe partial edits, Templater-aware note formatting, fallback synchronization, graph-aware navigation, and MCP-only vault access."
---

# Obsidian Semantic Notes MCP

Use this skill for every task that touches Obsidian notes, tasks, wiki pages, raw sources, archive pages, graph navigation, Dataview/Bases queries, or project memory through the Semantic Notes Vault MCP plugin.

Apply `CODEX_PROJECT.md`, `.codex/rules/obsidian_wiki.md`, and `.codex/rules/obsidian_tasks.md` together with this skill. Use the Obsidian project logical root declared in `CODEX_PROJECT.md`.

For concrete examples, anti-patterns, and review checks, load `references/patterns-and-review.md`.

## Hard Rule: MCP-Only Vault Access

- All Obsidian vault operations must go through the connected Semantic Notes Vault MCP plugin.
- Obsidian logical paths such as `raw/`, `wiki/`, `tasks/`, `archive/`, and the project logical root are MCP paths, not repository filesystem paths.
- Do not read, create, update, move, rename, archive, delete, inspect, or diff vault files through the repository filesystem, shell commands, Python scripts, direct editor edits, or Git operations.
- Do not use local fallback folders as a second vault or as an alternative source of truth.
- If MCP is unavailable, use the project-approved local fallback outbox only to preserve work until MCP becomes available again. Synchronize fallback files into Obsidian through MCP, verify the MCP result, and only then delete the local fallback files.

## Prohibited Local Access Patterns

Obsidian MCP-only access includes reads, searches, discovery, inspection, diffs, and metadata checks.

Do not use local filesystem, shell, script, editor, or Git operations to inspect the Obsidian vault or infer its content. This prohibition includes commands and tools such as:

- `cat`, `less`, `more`, `head`, `tail`, `sed`, `awk`;
- `grep`, `rg`, `find`, `fd`, `ls`, `tree`;
- Python, Node, shell, or other scripts that open, scan, glob, parse, or diff vault files;
- direct editor search/open operations against the vault path;
- Git commands such as `git diff`, `git show`, `git grep`, `git log -- <vault-path>`, `git status <vault-path>` when they target Obsidian vault files.

If a command would touch the Obsidian project logical root, `raw/`, `wiki/`, `tasks/`, `archive/`, or the physical vault path behind those logical paths, do not run it. Use Semantic Notes Vault MCP list/search/read/fragments/graph/dataview/bases tools instead.

Local fallback outbox directories are the only allowed local files for Obsidian-related work while MCP is unavailable. Fallback files may be read or updated locally only to continue or synchronize the unsynced fallback record itself; they must never be used to inspect or modify the Obsidian vault.


## Tool Routing

Choose MCP tool groups by intent:

- Use `vault` operations for file-level actions: list, read, create, search, fragments, move, rename, copy, split, combine, and explicitly approved full-file replacement.
- Use `edit` operations for modifying existing note content: append, section patching, window editing, and other partial-edit actions provided by the plugin.
- Use `view` operations for display-oriented context such as active note, note windows, and Obsidian UI inspection when available.
- Use `graph` operations for link traversal, backlinks, forward links, path finding, and connection analysis.
- Use `workflow` operations for plugin-provided next-action hints when they help navigation or editing.
- Use `dataview` or `bases` operations only when those plugins/features are installed and the task needs structured note queries.
- Use `system` operations for server/vault status and capability checks when connectivity or tool behavior is uncertain.


## Templater-Aware Formatting

Use this section only when `CODEX_PROJECT.md` declares Obsidian Templater as enabled, the user explicitly asks for Templater-aware formatting, or an existing note/template contains Templater syntax.

- Treat Templater as an Obsidian-side template system for repeatable note structure, frontmatter, timestamps, task/wiki sections, and other formatting conventions.
- Do not assume that MCP `vault` create/update operations automatically execute Templater commands. Unless an MCP tool explicitly applies an Obsidian template, write the final resolved Markdown content.
- Use Templater templates as canonical formatting sources only when they are discoverable through MCP. Read/search template notes through MCP; never inspect template folders through filesystem, shell, scripts, editor search, or Git.
- Preserve Templater command syntax such as `<% ... %>`, `tp.*`, execution commands, whitespace-control delimiters, and template frontmatter when editing template files or existing notes that intentionally contain templates.
- Do not add, modify, or execute Templater JavaScript/user/system-command functions unless the user explicitly requests it and the repository profile allows it. Templater can execute JavaScript and system commands, so template code must be treated as executable content.
- Prefer simple static Markdown templates over executable Templater code when the agent only needs consistent formatting.
- For new ordinary notes created by the agent, avoid leaving unresolved Templater commands in the note unless the note is itself a template or the user explicitly wants deferred template execution.
- For task/wiki notes, use the project-approved template structure when available, but still follow `.codex/rules/obsidian_tasks.md` and `.codex/rules/obsidian_wiki.md`.
- After creating or editing a template-based note, re-read through MCP and verify that required headings, frontmatter fields, wikilinks, and unresolved/resolved template expressions match the intended result.

## Read Before Write

For every update to an existing Obsidian note:

1. Read the current note through MCP.
2. Identify the exact target section, heading, block, or append location.
3. Choose the smallest safe MCP edit operation.
4. Apply the edit through MCP.
5. Re-read the note through MCP.
6. Verify that the intended change is present and unrelated existing content remains intact.

Do not update existing notes from memory or from stale snippets. If the target heading or anchor is ambiguous, search/read enough context through MCP before editing.

## Full-File Replacement Guard

- Treat `vault.update` or any equivalent full-file replacement operation as destructive by default.
- Do not use full-file replacement to add a note, append a section, update task status, add a check, insert links, edit frontmatter, or patch a heading.
- Full-file replacement is allowed only when the user explicitly asks to replace the entire note or when the workflow is intentionally regenerating the whole file.
- Before any full-file replacement, read the existing note through MCP, confirm that replacing the entire file is intended, and preserve required frontmatter, links, task history, checks, and unchanged sections.
- After full-file replacement, re-read the note through MCP and verify that required old content was intentionally preserved or intentionally removed.

## Create, Append, Patch, And Move Semantics

- Use create operations only for new notes that do not already exist at the target logical path.
- If a note may already exist, search/list/read through MCP first; do not blindly create a duplicate note.
- Use append operations for adding chronological notes, task checks, work logs, or new sections at the end of a known note.
- Use section patch/window edit operations when updating a specific heading, block, task status, frontmatter field, or bounded content window.
- Use move/rename/archive operations only through MCP and only after reading or listing enough context to avoid moving the wrong note.
- After move/rename/archive operations, verify through MCP that the source and destination states are correct.

## Concurrency And Verification

- Treat Obsidian notes as shared mutable documents. Another agent or user may change a note between read and edit.
- Minimize the read-to-edit window.
- Prefer section-level or append operations over whole-file replacement.
- After every write, re-read through MCP and verify the specific invariant that matters: section exists, old content remains, task status changed, archive destination is correct, or frontmatter was updated.
- If verification fails, stop and report the mismatch instead of attempting additional blind writes.

## Wiki And Task Coordination

- For wiki/content workflows, follow `.codex/rules/obsidian_wiki.md`.
- For task workflows, follow `.codex/rules/obsidian_tasks.md`.
- Do not mix task-writing rules into wiki pages unless the task rules explicitly require a link or update.
- Do not edit wiki pages during task-only work unless the user explicitly asks for wiki changes.
- Preserve the Obsidian note/task language policy declared in `CODEX_PROJECT.md`. Keep code, identifiers, proper names, protocol names, and library/tool names in their original form.

## Local Fallback Outbox

Use local fallback only when the connected Obsidian MCP is unavailable.

- Store context/analysis/recent-work notes in the fallback context outbox declared by `CODEX_PROJECT.md`.
- Store task drafts or task status updates in the fallback task outbox declared by `CODEX_PROJECT.md`.
- Mark fallback files with enough metadata to synchronize them later: intended Obsidian logical path, note type, source request, timestamp, and pending action.
- Before new Obsidian work, check for pending fallback files.
- When MCP becomes available, synchronize every fallback file into Obsidian through MCP, verify the result through MCP, and delete the local fallback only after successful verification.
- If synchronization fails, keep the fallback file and report what remains unsynchronized.

## Templater And PUML Notes

- Treat Templater syntax and PlantUML blocks as protected note content unless the task explicitly asks to change them.
- Do not execute templates, mutate generated sections, or rewrite PlantUML diagrams unless the user requested it and the MCP tool supports the required operation.
- When editing notes containing Templater or PlantUML, preserve code fences, template delimiters, indentation, plugin-specific syntax, and execution blocks.
- Prefer bounded patch/window edits around the intended section so generated, template, or diagram content is not accidentally damaged.
- For template files, never use full-file replacement unless the user explicitly asks to replace the entire template and the replacement preserves or intentionally removes every Templater command.

## Review Checklist

- [ ] Obsidian vault access is MCP-only; no filesystem, shell, Python, direct editor, or Git operation touched the vault.
- [ ] The active project logical root from `CODEX_PROJECT.md` was used.
- [ ] Existing notes were read through MCP before editing.
- [ ] Existing notes were changed with the smallest safe edit operation.
- [ ] Full-file replacement was not used for partial updates.
- [ ] Any full-file replacement was explicit, intentional, and verified after writing.
- [ ] After every write, the note was re-read through MCP and checked for data preservation.
- [ ] Fallback outbox files were used only when MCP was unavailable and were later synchronized through MCP.
- [ ] Task and wiki updates followed their dedicated rule files.
- [ ] Templater templates were used only when enabled/requested or when existing note syntax required preservation.
- [ ] MCP writes did not assume Templater execution unless the selected MCP tool explicitly applied a template.
- [ ] Templater commands, template frontmatter, and executable blocks were preserved or intentionally changed.
- [ ] New executable Templater JavaScript/user/system-command logic was not introduced without explicit user approval.
