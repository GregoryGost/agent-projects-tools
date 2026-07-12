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

Task notes and task logs are not part of this workflow.

## Raw Source Policy

- Treat existing `raw/` entries as immutable.
- Do not edit, rename, normalize, move, or delete raw sources unless the user explicitly requests it.
- New raw entries may be created only through MCP and only when the request authorizes source storage.
- Reference raw sources from wiki pages using logical Markdown links and original URLs when available.

## Query Workflow

When the user asks a project knowledge question:

1. Read `CODEX_PROJECT.md` and resolve the project logical root.
2. Search `wiki/index.md` and relevant wiki pages through MCP first.
3. Consult `raw/` through MCP only when the wiki lacks the answer or a claim requires source verification.
4. Follow wikilinks and graph relations when neighboring concepts or projects are relevant.
5. Cite relevant wiki/raw sources for non-trivial claims.
6. State uncertainty when sources are missing, contradictory, or insufficient.

Query does not authorize ingest or wiki mutation.

## Ingest Workflow

Run ingest only after an explicit user request or an allowed wiki-write request mode.

1. Read the authorized raw source through MCP.
2. Summarize it in original wording rather than copying large passages.
3. Identify key ideas, terms, entities, decisions, relationships, and project implications.
4. Search existing wiki pages before creating new ones.
5. Update an existing atomic page when it is the correct canonical location; otherwise create a focused new page.
6. Add `[[wikilinks]]` between related pages.
7. Include the raw logical path and original source URL when available.
8. Update `wiki/Source Notes.md` with a short summary and key terms.
9. Update `wiki/index.md` when new or significantly changed pages need discovery.
10. Append an entry to `wiki/log.md`.
11. Re-read and verify all modified notes through MCP.

Atomicity is preferred over dumping unrelated concepts into one page.

## Templater-Aware Wiki Formatting

- Use templates only when enabled, explicitly requested, or already used by the target note.
- Discover and read templates through MCP only.
- Do not assume an MCP create/update call executes Templater.
- Write resolved Markdown unless an MCP tool explicitly applies a template.
- Preserve frontmatter, required headings, wikilinks, and intentional Templater expressions.
- Do not add executable template logic without explicit approval.

## Wiki Boundaries

- Do not create, update, close, archive, or re-index taskbook notes.
- Do not write to task logs during wiki work.
- Do not infer ingest from implementation or task tracking.
- Use `obsidian-taskbook` separately when taskbook work is requested and authorized.

## Review Checklist

- [ ] Query and Ingest were distinguished.
- [ ] Ingest had explicit authorization.
- [ ] Wiki was searched before raw sources and before creating duplicate pages.
- [ ] Existing raw sources remained immutable.
- [ ] Wikilinks and source references were preserved or added appropriately.
- [ ] Source register, index, and log updates matched the actual change.
- [ ] No taskbook notes or logs were modified.
