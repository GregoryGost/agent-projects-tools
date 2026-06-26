# Obsidian project MCP rules for wiki

A schema file for the LLM agent supporting this Obsidian repository, as `LLM Wiki`. This is the source of rules for the wiki: how to behave in any chat and what to do during typical events.

To understand how to work with Obsidian, please use the MCP `Context7`.

When a user requests a storage update or an obsidian storage update, it means that an ingest needs to be performed through the connected obsidian MCP. Use `Workflow: Ingest` and `Workflow: Query`

Ingest is never performed without explicit command from the user.

The Obsidian project logical root is declared in `CODEX_PROJECT.md` under `Obsidian Project Profile`.

Use the `obsidian-semantic-notes-mcp` skill for all Obsidian MCP operations. That skill is the general workflow for reading, searching, creating, updating, moving, archiving, verifying, and synchronizing Obsidian notes through Semantic Notes Vault MCP.

## Hard rule: Obsidian MCP-only vault access

All Obsidian vault operations must go through the connected Obsidian MCP. The paths `raw/`, `wiki/`, `tasks/`, `archive/`, and the Obsidian project logical root declared in `CODEX_PROJECT.md` are logical Obsidian vault paths for MCP operations, not permission to access the vault through the repository filesystem.

Do not read, create, update, move, rename, archive, delete, or inspect Obsidian vault files through shell commands, Python scripts, direct editor edits, Git operations, or local fallback folders.

This includes local discovery and read-only inspection commands such as `cat`, `less`, `head`, `tail`, `grep`, `rg`, `find`, `ls`, `tree`, `sed`, `awk`, Python/Node scripts, editor search, and Git commands when they target Obsidian logical paths or the physical vault location. Use Obsidian MCP list/search/read/fragments/graph/query tools instead.

When updating existing notes, read the current note through MCP first, use the smallest safe edit operation, and re-read the note through MCP after writing. Do not use full-file replacement operations for append, patch, task status, check, link, or section updates.

If the Obsidian MCP is unavailable, local fallback storage is allowed only as a temporary offline outbox so that work is not lost:

This fallback is a user-approved exception to the general rule against temporary workarounds. It exists only to preserve work until Obsidian MCP becomes available again.

- Use the local context fallback outbox declared in `CODEX_PROJECT.md` for context, analysis, and recent-work notes that must later be saved to Obsidian `raw/` through MCP.
- Use the local task fallback outbox declared in `CODEX_PROJECT.md` for task notes or task updates that must later be saved to Obsidian `tasks/` through MCP.

Fallback files are not Obsidian notes and must not be treated as a second source of truth. When the Obsidian MCP becomes available, synchronize every pending fallback file into Obsidian through MCP, verify that the Obsidian note or task was created/updated successfully, and only then delete the local fallback file.

## Workflow: Fallback Synchronization

Use this workflow only for local fallback files created while the Obsidian MCP was unavailable.

1. Before starting new Obsidian-related work, check whether the local fallback outboxes declared in `CODEX_PROJECT.md` contain pending fallback files.
1. For each pending context or analysis file, create the corresponding Obsidian `raw/` note through the connected Obsidian MCP.
1. For each pending task file or task update, create or update the corresponding Obsidian `tasks/` note through the connected Obsidian MCP.
1. Verify through MCP that the Obsidian note or task exists and contains the transferred content.
1. Delete the local fallback file only after successful MCP synchronization and verification.
1. If synchronization fails, keep the fallback file and report what remains unsynchronized.

Do not ingest fallback files by reading or writing the Obsidian vault through the repository filesystem.

## Repository Purpose

This repository may be paired with an Obsidian-backed project knowledge base, taskbook, and work-context store when `CODEX_PROJECT.md` enables Obsidian. The purpose of the Obsidian workflow is to store project records as raw data, manage tasks, and retrieve key project information. It is not limited to answering questions; it accumulates project information so that each new analysis or correction can build on verified context.

## Structure

- `raw/` - immutable sources of truth: articles, web-clippings, pdf, transcripts, links.
- `wiki/` - processed pages: summary, concepts, entities, comparisons, syntheses, source notes.
- `wiki/index.md` - knowledge base map and entry point.
- `wiki/log.md` - chronological log of wiki changes. Don't write anything here when working with tasks.
- `wiki/Source Notes.md` - a register of all ingested sources from `raw/` with short summaries.
- `archive/` - obsolete data moved to the archive. Data in this folder is not subject to analysis for current work.
- `tasks/` - a task book (plugin for Obsidian) that must be maintained as part of the project (see also `Workflow: Tasks`)
- `tasks/log.md` - chronological log of tasks changes.


## Templater-Aware Wiki Formatting

Use this section only when `CODEX_PROJECT.md` declares Obsidian Templater as enabled, the user explicitly asks for template-aware formatting, or an existing note/template contains Templater syntax.

- Templater templates may define the canonical structure for repeatable wiki pages, source notes, logs, and task-linked context pages.
- Use templates only through MCP discovery/read operations. Do not inspect template folders through filesystem, shell commands, scripts, editor search, or Git.
- Do not assume MCP create/update operations execute Templater commands. If no MCP tool explicitly applies a template, create final resolved Markdown content that follows the template structure.
- Leave unresolved `<% ... %>` or `tp.*` expressions only in actual template notes or when the user explicitly requests deferred Templater execution.
- When editing existing template-backed notes, preserve frontmatter shape, required headings, wikilinks, and any Templater expressions that are intentionally present.
- Do not add executable Templater JavaScript/user/system-command logic while maintaining wiki pages unless the user explicitly approves it.

## Hard rule: `raw/` is immutable

Never edit, rename, normalize, or delete files in `raw/` unless explicitly requested by the user. Only new entries may be created.

## Response Style and Format

- Write concisely and structured, with subheadings where they make navigation easier.
- Use Obsidian's `[[wikilinks]]` between linked wiki pages.
- Reference raw sources using Markdown links to the `raw/` path and, if available, to the original URL from Frontmatter.
- Cite sources for non-trivial claims.
- If confidence is low or the source is contradictory, clearly state this; don't hide it.

## Workflow: Query

When a user asks a question or needs to find historical data on a project:

1. First, check `wiki/` through the connected Obsidian MCP, starting with `wiki/index.md` and the relevant pages.
1. Only consult `raw/` through the connected Obsidian MCP if `wiki/` doesn't have an answer or verification is needed.
1. If the answer relies on specific sources, provide references.
1. If you need to examine or study the relationship with a neighboring project, provided that this is a workspace for several projects, then you need to study the wiki for these projects and look for their adjacent points in the area of ​​interest.

## Workflow: Ingest

Use the connected Obsidian MCP for this work.
When a user explicitly requests ingest:

1. Read the file from `raw/` and `tasks/` through the connected Obsidian MCP.
1. Write a brief summary in your own words.
1. Highlight key ideas, terms, entities, and possible relationships.
1. Create or update relevant pages in `wiki/` through the connected Obsidian MCP. Atomicity is more important than space: a separate page for a separate concept is better than a "dumping ground."
1. Place [[wikilinks]] between related pages.
1. Specify the path to the raw file and the source URL, if available.
1. Update `wiki/Source Notes.md` through the connected Obsidian MCP (summary + key terms).
1. Update `wiki/index.md` through the connected Obsidian MCP if new or significantly changed pages have appeared and should be easily discoverable.
1. Add an ingest entry to `wiki/log.md` through the connected Obsidian MCP.

See also [LLM Wiki Workflow](./obsidian_wiki/LLM%20Wiki%20Workflow.md).
