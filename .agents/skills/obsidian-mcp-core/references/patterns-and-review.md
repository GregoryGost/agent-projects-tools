# Obsidian MCP Core Patterns And Review

Use this reference for MCP-only access, safe note mutation, fallback synchronization, and data-loss review. Wiki ingest and taskbook lifecycle rules belong to their dedicated overlays.

## Safe Partial Update

Bad:

```text
Replace an existing note with only the new paragraph.
```

Good:

```text
1. Read the note through MCP.
2. Locate the target heading or append position.
3. Use an append, section patch, or bounded window edit.
4. Re-read and verify both old and new content.
```

## No Filesystem Inspection

Bad:

```text
Use rg, grep, cat, find, ls, Python, an editor, or Git against the vault path.
```

Good:

```text
Use MCP list, search, read, fragments, graph, dataview, or bases operations against the logical vault root.
```

## Duplicate Prevention

Before creating a note:

1. Search or list through MCP when a matching note may exist.
2. Update an existing suitable note when appropriate.
3. Create a new note only when a distinct note is intended.

## Whole-Note Replacement Review

Before replacement, verify that:

- complete replacement is explicitly intended;
- the current note was read immediately before writing;
- preserved frontmatter, links, generated sections, task history, diagrams, and templates were considered;
- the replacement body is complete;
- the result was re-read through MCP.

## Templater And PlantUML

- Do not assume an MCP write executes Templater.
- Use resolved Markdown for ordinary notes.
- Preserve template expressions and PlantUML fences when present.
- Patch the smallest range that avoids touching executable or generated content.
- Do not add executable template logic without explicit approval.

## Fallback Synchronization

1. Use the declared fallback outbox only while MCP is unavailable.
2. Store intended logical path and pending action.
3. Synchronize through MCP.
4. Verify through MCP.
5. Delete the fallback only after successful verification.

## Review Checklist

- [ ] No filesystem, shell, script, editor, or Git operation touched vault content.
- [ ] Read-before-write was followed.
- [ ] The smallest safe edit operation was used.
- [ ] Every mutation was verified through MCP.
- [ ] Fallback remained a temporary outbox.
- [ ] Wiki/taskbook behavior came from its dedicated active overlay.
