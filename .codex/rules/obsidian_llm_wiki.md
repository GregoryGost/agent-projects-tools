# Obsidian LLM Wiki rules

Apply this rule only when `CODEX_PROJECT.md` declares the `obsidian-llm-wiki` active stack profile, or when the task directly queries, ingests, creates, changes, or reviews LLM Wiki content.

Do not activate this rule solely because `obsidian-mcp-core` is active. Core MCP access does not imply a wiki workflow.

## Required skills

Use together with:

- `obsidian-mcp-core`;
- `obsidian-llm-wiki`.

Apply `.codex/rules/request_routing.md` before every LLM Wiki Query, Ingest, read, write, move, archive, fallback write, or synchronization.

## Scope

This rule governs:

- Query through `wiki/` and verified `raw/` sources;
- explicit Ingest from `raw/` into `wiki/`;
- `wiki/index.md`, `wiki/Source Notes.md`, and `wiki/log.md`;
- atomic wiki pages, wikilinks, source references, and archive exclusions;
- immutable `raw/` source policy;
- Templater-aware wiki formatting when enabled.

It does not govern task creation, task status, task checks, task overview pages, or task archive.

## Authorization

- Use `wiki-only` for every LLM Wiki Query or write. When another repository or external-system operation is also requested, use a combined gate that explicitly includes the `wiki-only` surface.
- Generic `external-system-only` does not authorize LLM Wiki Query, Ingest, or writes and must not substitute for `wiki-only`.
- Query is read-oriented and must use the MCP-only access rules from `obsidian-mcp-core`.
- Query does not authorize Ingest, crystallization, page creation, page updates, index changes, source-register changes, or wiki-log changes.
- Ingest and wiki writes require explicit user authorization and a `wiki-only` or explicitly combined request gate that authorizes the wiki surface.
- Never infer Ingest from ordinary analysis, implementation, taskbook, review, status, or external-system work.
- Do not read or modify taskbook notes as part of the wiki workflow unless the user separately authorizes taskbook work and the `obsidian-taskbook` profile is active.

## Workflow

1. Read `CODEX_PROJECT.md` and confirm the profile, logical root, wiki paths, language policy, and enabled plugins.
2. Resolve `wiki-only` or a combined request gate that explicitly includes the wiki surface.
3. Apply `obsidian-mcp-core` for all reads, searches, edits, moves, and verification.
4. For Query, inspect `wiki/index.md` and relevant wiki pages first; consult `raw/` only when verification or missing knowledge requires it.
5. For explicitly authorized Ingest, synthesize sources into atomic wiki pages, add wikilinks and source references, update the source register and index when needed, and append the wiki log.
6. Do not modify existing `raw/` entries except when the user explicitly requests a source change.
7. Re-read and verify every changed note through MCP.

For detailed Query/Ingest conventions, follow `.agents/skills/obsidian-llm-wiki/references/wiki-workflow.md`.

When the task explicitly concerns confidence, freshness, supersession, archival, or typed wiki relationships, also follow `.agents/skills/obsidian-llm-wiki/references/wiki-lifecycle.md`.

## Review Checklist

- [ ] `obsidian-llm-wiki` was active or wiki work was directly requested.
- [ ] `wiki-only` or an explicitly combined gate governed every LLM Wiki Query and side effect.
- [ ] Generic `external-system-only` was not used as a substitute for `wiki-only`.
- [ ] `obsidian-mcp-core` governed all vault access and edits.
- [ ] Query remained read-only unless a separate write operation was explicitly authorized.
- [ ] Ingest was explicitly authorized.
- [ ] Raw sources remained immutable unless explicitly requested.
- [ ] Wiki index, source register, and log were updated only when required by an authorized write.
- [ ] No taskbook side effects were introduced.
