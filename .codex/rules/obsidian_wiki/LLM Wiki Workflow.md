# LLM Wiki Workflow

> Agent rule: use the `obsidian-semantic-notes-mcp` skill for all Obsidian work. All Obsidian vault operations described in this workflow must be performed through the connected Obsidian MCP. `raw/`, `wiki/`, `tasks/`, and `archive/` are logical vault paths for MCP operations, not filesystem access instructions. Do not use shell commands, filesystem reads, scripts, editor search, or Git operations to read, list, search, inspect, diff, or modify Obsidian vault files. If MCP is unavailable, use local fallback storage only as a temporary offline outbox (using the fallback outboxes declared in `CODEX_PROJECT.md`), then synchronize it into Obsidian through MCP and delete the fallback files after successful verification. Existing notes must be read before editing and re-read after writing; full-file replacement must not be used for partial updates.

> Templater note: if `CODEX_PROJECT.md` declares Obsidian Templater as enabled, templates may define canonical note structure and frontmatter. Templates must still be discovered/read through MCP only. Do not assume MCP writes execute Templater commands unless the MCP tool explicitly applies a template; otherwise write final resolved Markdown and preserve existing Templater syntax.

The main operations of an LLM Wiki are ingest, query, lint, and crystallization. They transform a vault from a folder of notes into a maintainable knowledge system.

## Ingest

Ingest a new source:

1. Read a file from `raw/` or `tasks/`.
2. Create a short summary.
3. Highlight key ideas, terms, and entities.
4. Create or update pages in `wiki/`.
5. Add `[[wikilinks]]` and links to the raw/source URL.
6. Update the [[index]].
7. Add a log entry.

In the extended version, ingest also includes confidence, freshness, typed relationships, and a health check after processing.

## Query for ingest

When asked, the [[index]] is read first, then the relevant `wiki/` pages. Only if the wiki is insufficient does the agent access `raw/` and `tasks/`. If the response contains new, consistent findings, it should be saved as a separate page or section.

## Lint

Periodic lint should look for:

- broken `[[wikilinks]]`;
- duplicate pages;
- outdated statements;
- contradictions between sources;
- pages without incoming links;
- important mentions without a separate page.

## Crystallization

Crystallization is the process of saving a research result or response as a wiki page. Unlike a regular chat response, such findings become part of the database and can reinforce existing pages.

## Practical Rhythm

- Daily capture: new sources are added to `raw/` or `tasks/` via `Obsidian Web Clipper` or otherwise.
- Ingest one source at a time or in small batches.
- Query the wiki with source citations.
- Monthly lint: check database health and update stale pages.

## Links

- [LLM Wiki Lifecycle](./LLM%20Wiki%20Lifecycle.md)
