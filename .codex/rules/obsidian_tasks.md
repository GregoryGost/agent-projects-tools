# Obsidian project MCP rules for tasks

Use the `obsidian-semantic-notes-mcp` skill for all Obsidian MCP task operations. Task notes must be read through MCP before updates, changed with bounded append/patch/edit operations, and re-read through MCP after writing. Do not use full-file replacement for task status, checks, notes, links, or archive updates unless the whole task note is explicitly being regenerated.


A schema file for the LLM agent supporting this Obsidian repository, as `LLM Wiki`. This is a source of task rules: how to behave in any chat and what to do during typical events.

To understand how to work with Obsidian, please use the MCP `Context7`.

The Obsidian project logical root is declared in `CODEX_PROJECT.md` under `Obsidian Project Profile`.

## Hard rule: Obsidian MCP-only vault access

All Obsidian vault operations must go through the connected Obsidian MCP. The paths `raw/`, `wiki/`, `tasks/`, `archive/`, and the Obsidian project logical root declared in `CODEX_PROJECT.md` are logical Obsidian vault paths for MCP operations, not permission to access the vault through the repository filesystem.

Do not read, create, update, move, rename, archive, delete, or inspect Obsidian vault files through shell commands, Python scripts, direct editor edits, Git operations, or local fallback folders.

This includes local discovery and read-only inspection commands such as `cat`, `less`, `head`, `tail`, `grep`, `rg`, `find`, `ls`, `tree`, `sed`, `awk`, Python/Node scripts, editor search, and Git commands when they target Obsidian logical paths or the physical vault location. Use Obsidian MCP list/search/read/fragments/graph/query tools instead.

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

This repository may be paired with an Obsidian-backed project knowledge base, taskbook, and work-context store when `CODEX_PROJECT.md` enables Obsidian. The task workflow stores project work as structured Obsidian task notes and links them to related raw/context notes. It is independent of the repository programming language.

## Rules of work

1. Create tasks only when you need to start changing the code.
1. Record context (work history) only in the `raw/` folder through the connected Obsidian MCP. If MCP is unavailable, save it temporarily to the local context fallback outbox declared in `CODEX_PROJECT.md` and synchronize it to Obsidian `raw/` through MCP as soon as MCP becomes available.
1. DO NOT read context (work history) directly from the `raw/` folder. Use Obsidian MCP mechanisms to retrieve this information based on the current hierarchy (see also `Workflow: Query`). Unsynchronized fallback files may be consulted only to continue or recover work created while MCP was unavailable.

- The general file naming format for saving to the `raw/` folder is `area-YearMonthDayHourMinuteSecond-your_action`. Context example: `context-20260214212215-check_obsidian_mcp`, Analysis example: `analysis-20260214211548-project`
- The name of the file area (for files in `raw/` folder) at the beginning of the title is selected based on the purpose of the request. Example: `context-*` for context, `analysis-*` for Analysis.
- Do not create a final context; final results should be reflected in the task in a special section `Notes on working on the task`. This rule is more important than the general rule of "keeping recent work"

## Structure

- `raw/` - immutable sources of truth: articles, web-clippings, pdf, transcripts, links.
- `wiki/` - processed pages: summary, concepts, entities, comparisons, syntheses, source notes.
- `wiki/index.md` - knowledge base map and entry point.
- `wiki/log.md` - chronological log of wiki changes. Don't write anything here when working with tasks.
- `wiki/Source Notes.md` - a register of all ingested sources from `raw/` with short summaries.
- `archive/` - obsolete data moved to the archive. Data in this folder is not subject to analysis for current work.
- `tasks/` - a task book (plugin for Obsidian) that must be maintained as part of the project (see also `Workflow: Tasks`)
- `tasks/log.md` - chronological log of tasks changes.


## Templater-Aware Task Formatting

Use this section only when `CODEX_PROJECT.md` declares Obsidian Templater as enabled, the user explicitly asks for template-aware formatting, or an existing task template/note contains Templater syntax.

- Task templates may define canonical frontmatter, title, status, Problem, Description, Additional information, Definition Of Done, Checks, and Notes on working on the task sections.
- Use task templates only through MCP discovery/read operations. Do not inspect template folders through filesystem, shell commands, scripts, editor search, or Git.
- Do not assume MCP task creation executes Templater commands. If no MCP tool explicitly applies a template, create final resolved Markdown content that follows the task template structure.
- Leave unresolved `<% ... %>` or `tp.*` expressions only in template notes or when the user explicitly requests deferred Templater execution.
- When editing existing task templates or template-backed task notes, preserve frontmatter shape, status fields, wikilinks, task history, checks, and any intentional Templater expressions.
- Do not add executable Templater JavaScript/user/system-command logic while creating or updating tasks unless the user explicitly approves it.

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

## Workflow: Tasks

The Obsidian plugin is used to work with tasks. Please refer to its documentation - <https://publish.obsidian.md/tasks/Introduction>.
Formatting and content according to the plugin's requirements, recomendations and best practice.

If requests are received for analysis, research, or code correction, it is necessary:

1. The task performer will be the `codex` AI agent; tasks must be created taking into account the specifics of its work, so that the agent correctly completes the task and does not invent unnecessary things.
1. Be sure to plan and divide the work into tasks before you start.
1. Get them into Obsidian through the connected Obsidian MCP right away and only then start the main work on these tasks. If MCP is unavailable, save the task draft temporarily to the local task fallback outbox declared in `CODEX_PROJECT.md`, continue only when the task intent is clear, and synchronize the task into Obsidian through MCP as soon as MCP becomes available.
1. Manage existing task statuses through the connected Obsidian MCP. For tasks you've already started working on, set the status to `in progress`. If MCP is unavailable, save the intended status change to the local task fallback outbox declared in `CODEX_PROJECT.md` and synchronize it through MCP as soon as MCP becomes available.
1. Close tasks through the connected Obsidian MCP as you complete them. If MCP is unavailable, save the intended close/update entry to the local task fallback outbox declared in `CODEX_PROJECT.md` and synchronize it through MCP as soon as MCP becomes available.
1. If the project is part of a workspace, there should be a root file called `all-tasks-workflow` with an overview of the main project task files, `all-tasks-{project_key}`. The overview page should not have separate sections for `Open Tasks`, `Closed Tasks`, etc. Tasks should be arranged hierarchically (newest on top).
1. Keep a complete overview of your tasks on the main page, `tasks/all-tasks-{project_key}`. This includes existing notes, not internal checklists. One task in `all-tasks-{project_key}`(example: `all-tasks-nrs`) is one entry in the `tasks/` folder. The overview page should not have separate sections for `Open Tasks`, `Closed Tasks`, etc.
1. Let's name the tasks based on Jira principles - key-number. Example: `NRS-25`. See project key in `CODEX_PROJECT.md`
1. The task notes themselves should be located in the `tasks/{project_key}` folder. Example: `tasks/nrs/NRS-25`
1. The task title must contain its key number and a brief summary in the task language declared in `CODEX_PROJECT.md` (and Problem, Description, Additional information).
1. Tasks after transitioning to the `done` state should be placed in the `tasks/archive/{project_key}` folder
1. The task must contain links to notes in the `raw/` folder related to the work on this task, including the most recent context(or analysis or another). This means we first save and write the context and then link it to the task or tasks. If MCP is unavailable, preserve the context in the local context fallback outbox declared in `CODEX_PROJECT.md`, preserve the pending task link/update in the local task fallback outbox declared in `CODEX_PROJECT.md`, and complete the links during fallback synchronization.
1. The list of sources should not be at the beginning of the article.
1. Checks performed following corrections should be recorded in the task in a separate "Checks" section. Each check should reflect the date and time of the check in its title and contain a brief summary. If this is a final successful result that moves the task to the "done" category, then the result of this check is marked with an emoji icon and is also recorded as a check.
1. If something changes other than what was necessary for the task, then only what is related to the task needs to be checked and evaluated.
1. Task statuses should be color-coded (preferably in the background): green for `done`, red for `canceled`, and blue for `in progress`.
1. DO NOT make edits to the wiki.
1. Tasks must be described in the task language declared in `CODEX_PROJECT.md`. Keep variables, identifiers, library names, protocol names, paths, and proper names in their original form. Check the task for this rule immediately after creating it.

The task description should contain five sections:

1. `frontmatter` - the task information section is formatted according to the obsidian rules.
1. `Problem` - the specific problem this task is intended to solve.
1. `Description` - a more detailed description, explaining why this is a problem and what causes it.
1. `Additional information` - code blocks, logs, suggested sources/solution methods, links to other related tasks or sources in Obsidian.
1. `Definition Of Done` - the criteria by which the task is considered complete.
1. `Notes on working on the task` - Notes on what was done on the task, what changes were made in the process, and the result of closing the task (must be used instead of creating a separate resulting context file)

There should be no other sections.

## Workflow: Ingest

NOT USE FOR TASKS