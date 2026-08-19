# Obsidian LLM Wiki Workflow Reference

Use this reference only with the `obsidian-llm-wiki` profile. All vault access and mutation safety remain governed by `obsidian-mcp-core`.

## Repository Purpose

The LLM Wiki stores project knowledge as:

- `raw/` — immutable source material such as articles, clippings, PDFs, transcripts, and links;
- `wiki/` — processed summaries, concepts, entities, comparisons, syntheses, and source notes;
- `wiki/index.md` — knowledge map and entry point;
- `wiki/Source Notes.md` — register of ingested raw sources with short summaries and key terms;
- `wiki/log.md` — chronological log of wiki changes;
- `archive/` — obsolete material excluded from current analysis.

Activity-context notes, task notes, and task logs are not part of this workflow.

## Raw Source Policy

- Treat existing `raw/` entries as immutable.
- Do not edit, rename, normalize, move, or delete raw sources unless the user explicitly requests it.
- New raw entries may be created only through MCP and only when the request authorizes source storage.
- Reference raw sources from wiki pages using logical Markdown links and original URLs when available.
- Do not place mutable activity-context notes in `raw/`.

## Query Workflow

When the user asks a project knowledge question:

1. Read `CODEX_PROJECT.md` and resolve the project logical root.
2. Search `wiki/index.md` and relevant wiki pages through MCP first.
3. Consult `raw/` through MCP only when the wiki lacks the answer or a claim requires source verification.
4. Follow wikilinks and graph relations when neighboring concepts or projects are relevant.
5. Cite relevant wiki/raw sources for non-trivial claims.
6. State uncertainty when sources are missing, contradictory, or insufficient.

Query does not authorize ingest or wiki mutation and does not search activity-context or taskbook notes automatically.

## Ingest Workflow

Run ingest only after an explicit user request or an allowed wiki-write request mode.

1. Read the authorized source through MCP.
2. Summarize it in original wording rather than copying large passages.
3. Identify key ideas, terms, entities, decisions, relationships, and project implications.
4. Search existing wiki pages before creating new ones.
5. Update an existing atomic page when it is the correct canonical location; otherwise create a focused new page.
6. Add `[[wikilinks]]` between related pages.
7. Include the source logical path and original source URL when available.
8. Update `wiki/Source Notes.md` when the source belongs to the raw-source register.
9. Update `wiki/index.md` when new or significantly changed pages need discovery.
10. Append an entry to `wiki/log.md`.
11. Re-read and verify all modified notes through MCP.

Atomicity is preferred over dumping unrelated concepts into one page.

## Explicit Activity Context As Source

An activity context may be used as a wiki source only when both the wiki and activity-context surfaces are explicitly authorized.

- Preserve the activity-context note in place and do not move it into `raw/`.
- Apply ordinary wiki attribution and verification to the resulting wiki content.
- Follow `.agents/skills/obsidian-activity-context/references/activity-context-workflow.md` for context-side lifecycle and ownership semantics.

## Templater-Aware Wiki Formatting

- Use templates only when enabled, explicitly requested, or already used by the target note.
- Discover and read templates through MCP only.
- Do not assume an MCP create/update call executes Templater.
- Write resolved Markdown unless an MCP tool explicitly applies a template.
- Preserve frontmatter, required headings, wikilinks, and intentional Templater expressions.
- Do not add executable template logic without explicit approval.

## Wiki Boundaries

- Do not create, update, complete, reopen, or synchronize activity-context notes during wiki-only work.
- Do not create, update, close, archive, or re-index taskbook notes.
- Do not write to task logs during wiki work.
- Use `obsidian-activity-context` or `obsidian-taskbook` separately when those surfaces are requested and authorized.

## Review Checklist

- [ ] Query and Ingest were distinguished.
- [ ] Ingest had explicit authorization.
- [ ] Wiki was searched before raw sources and before creating duplicate pages.
- [ ] Existing raw sources remained immutable.
- [ ] Activity contexts were not placed in `raw/` or queried/ingested automatically.
- [ ] Explicit context-source ingest preserved the original context note.
- [ ] Wikilinks and source references were preserved or added appropriately.
- [ ] Source register, index, and log updates matched the actual change.
- [ ] No activity-context or taskbook notes were modified implicitly.
