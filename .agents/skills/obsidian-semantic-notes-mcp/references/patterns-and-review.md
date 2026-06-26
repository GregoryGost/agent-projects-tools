# Obsidian Semantic Notes MCP Patterns And Review

Load this file when creating, changing, or reviewing Obsidian MCP workflows, note edits, task updates, wiki updates, fallback synchronization, or suspected data-loss risks.

## Intent Routing

- Read/search/query existing knowledge: use MCP search, fragments, vault read, graph traversal, and wiki/task rules.
- Create a new note: search/list first when duplication is possible, then use MCP create.
- Add content to an existing note: read first, then append or patch through MCP edit operations.
- Change an existing section: read first, then use section/window/patch edit operations.
- Replace a whole note: use full-file replacement only when explicitly intended.
- Move/archive/rename: inspect source and destination through MCP first, then verify through MCP after the operation.

## Negative And Positive Examples


### Reading Vault Content Through Shell Commands

Bad:

```text
Goal: inspect an existing wiki page or find task context.
Action: run `rg`, `grep`, `cat`, `find`, `ls`, `tree`, Python scripts, editor search, or Git commands against the Obsidian vault path.
Result: the workflow bypasses MCP-only access, may read stale or unintended files, and can encourage unsafe direct edits.
```

Good:

```text
Goal: inspect an existing wiki page or find task context.
Action:
1. Use MCP list/search/read/fragments/graph/query tools against the Obsidian logical root.
2. Read the relevant note through MCP.
3. If an update is needed, use a bounded MCP edit operation.
4. Re-read through MCP and verify the result.
```

### Partial Update Done With Full-File Replacement

Bad:

```text
Goal: add a short work note to an existing page.
Action: use a full-file replacement operation with only the new paragraph as content.
Result: the old page content is overwritten and lost.
```

Good:

```text
Goal: add a short work note to an existing page.
Action:
1. Read the existing page through MCP.
2. Locate the target heading or append position.
3. Use an append/patch/window edit operation through MCP.
4. Re-read the page through MCP.
5. Verify that old content and the new note are both present.
```

### Updating From Memory Instead Of Current Content

Bad:

```text
Goal: update task status.
Action: assume the task file structure from memory and write a replacement body.
```

Good:

```text
Goal: update task status.
Action:
1. Read the task note through MCP.
2. Locate the status/frontmatter/check section.
3. Apply a minimal status/check update.
4. Re-read and verify the task title, history, checks, links, and new status.
```

### Blind Create Without Checking Existing Notes

Bad:

```text
Goal: create a note for a topic.
Action: create a new note without searching existing notes.
Result: duplicate or competing wiki pages.
```

Good:

```text
Goal: create a note for a topic.
Action:
1. Search/list through MCP for existing related notes.
2. Reuse/update an existing note when appropriate.
3. Create a new note only when no suitable note exists.
```

### Fallback Treated As Vault Storage

Bad:

```text
Goal: save recent work while MCP is unavailable.
Action: write a local fallback file and continue treating it as the source of truth indefinitely.
```

Good:

```text
Goal: save recent work while MCP is unavailable.
Action:
1. Write a local fallback outbox file with intended Obsidian logical path and pending action.
2. When MCP becomes available, create/update the Obsidian note through MCP.
3. Re-read through MCP and verify the transfer.
4. Delete the fallback file only after successful verification.
```

### Editing A Note With Templater Or PlantUML

Bad:

```text
Goal: update prose near a PlantUML diagram.
Action: replace a large note window that also contains the diagram fence.
Result: diagram syntax or template delimiters are damaged.
```

Good:

```text
Goal: update prose near a PlantUML diagram.
Action:
1. Read the note through MCP.
2. Identify the smallest prose-only range.
3. Patch only that section.
4. Re-read and verify PlantUML fences and Templater syntax remain unchanged.
```


### Assuming MCP Create Executes Templater

Bad:

```text
Goal: create a daily note through MCP.
Action: create the note with `<% tp.date.now("YYYY-MM-DD") %>` and assume MCP will execute it.
Result: the final note may contain unresolved Templater syntax instead of the intended date.
```

Good:

```text
Goal: create a daily note through MCP.
Action:
1. If the MCP tool explicitly supports applying an Obsidian template, use that tool and verify the rendered note.
2. Otherwise, write final resolved Markdown through MCP, for example `date: 2026-06-26`.
3. Leave `<% ... %>` syntax only when creating or editing an actual template note.
4. Re-read through MCP and verify the expected date/frontmatter/headings.
```

### Reading Template Files Through Filesystem

Bad:

```text
Goal: inspect the task template.
Action: use `cat`, `rg`, editor search, or a script against the vault template folder.
Result: MCP-only vault access is bypassed.
```

Good:

```text
Goal: inspect the task template.
Action:
1. Use MCP search/list/read tools to locate the template note.
2. Read the template through MCP.
3. Use the template only as formatting guidance unless an MCP tool explicitly applies it.
```

### Damaging Templater Syntax

Bad:

```text
Goal: update a template heading.
Action: replace a wide window around the heading and accidentally remove `<%* ... %>` or `tp.file.*` commands.
Result: the template no longer runs correctly in Obsidian.
```

Good:

```text
Goal: update a template heading.
Action:
1. Read the template through MCP.
2. Patch only the heading line.
3. Preserve `<% ... %>`, `<%* ... %>`, `tp.*`, frontmatter expressions, and whitespace-control delimiters.
4. Re-read through MCP and verify the template commands are intact.
```

### Adding Executable Templater Logic Without Approval

Bad:

```text
Goal: make a note easier to create.
Action: add a Templater JavaScript block or system-command user function without asking.
Result: executable template logic is introduced without explicit approval.
```

Good:

```text
Goal: make a note easier to create.
Action:
1. Prefer a static Markdown template or resolved MCP-created content.
2. Add or change executable Templater logic only when the user explicitly approves it.
3. Re-read and verify the template through MCP after editing.
```


## MCP-Only Access Review

Before using any local command or script, verify whether it can touch Obsidian vault content. If it targets the Obsidian project logical root, `raw/`, `wiki/`, `tasks/`, `archive/`, or the physical vault location, do not run it.

Allowed local access is limited to the project-approved fallback outbox while MCP is unavailable. The fallback outbox is not a vault mirror and must be synchronized into Obsidian through MCP when MCP becomes available.

## Full-File Replacement Review

Before any full-file replacement, verify all of the following:

- The user explicitly requested replacement of the whole note, or the workflow explicitly regenerates the whole note.
- The current note was read through MCP immediately before replacement.
- Required frontmatter, wikilinks, task history, checks, raw-source links, and unchanged sections are preserved or intentionally removed.
- The replacement content is complete, not a fragment.
- The note was re-read after replacement and checked against the intended result.

If any item is missing, do not use full-file replacement.


## Templater Review

- [ ] Templater is enabled in `CODEX_PROJECT.md`, explicitly requested by the user, or already present in the target note/template.
- [ ] Template files were discovered and read through MCP only.
- [ ] MCP writes did not assume template execution unless the chosen MCP tool explicitly applies an Obsidian template.
- [ ] Ordinary notes contain resolved Markdown unless the note is intentionally a template or deferred template execution is requested.
- [ ] Existing Templater syntax such as `<% ... %>`, `<%* ... %>`, `tp.*`, and whitespace-control delimiters was preserved.
- [ ] No new executable Templater JavaScript, user script, or system command was introduced without explicit user approval.

## Fallback Synchronization Review

- [ ] Fallback was used only because MCP was unavailable.
- [ ] Fallback file includes intended Obsidian logical path and pending action.
- [ ] Synchronization uses MCP, not filesystem access to the vault.
- [ ] Obsidian result is verified through MCP.
- [ ] Local fallback file is deleted only after successful verification.
- [ ] Failed synchronization leaves the fallback file in place and reports the remaining work.

## Review Checklist

- [ ] The workflow used the general Obsidian Semantic Notes MCP skill, not a narrow edit-only rule.
- [ ] MCP-only vault access was preserved.
- [ ] No shell command, Python/Node script, editor search, or Git operation read, listed, searched, diffed, or inspected Obsidian vault files.
- [ ] All vault discovery/search/read operations used MCP list/search/read/fragments/graph/query tools.
- [ ] Project logical root came from `CODEX_PROJECT.md`.
- [ ] Existing notes were read before editing.
- [ ] Partial updates used append/patch/window edit operations, not full-file replacement.
- [ ] Full-file replacement was used only for explicit whole-note replacement.
- [ ] Every write was followed by MCP read-back verification.
- [ ] Existing unrelated content was preserved.
- [ ] Task updates followed `.codex/rules/obsidian_tasks.md`.
- [ ] Wiki updates followed `.codex/rules/obsidian_wiki.md`.
- [ ] Fallback outbox synchronization was completed or explicitly reported as pending.
- [ ] Templater and PlantUML syntax was preserved when present.
- [ ] Template-aware formatting followed the active Obsidian/Templater profile without assuming automatic template execution.
- [ ] No executable Templater logic was created or modified without explicit user approval.
