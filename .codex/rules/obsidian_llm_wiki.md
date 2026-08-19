# Obsidian LLM Wiki rules

Apply this rule only when `CODEX_PROJECT.md` declares the `obsidian-llm-wiki` active stack profile, or when the task directly queries, ingests, creates, changes, or reviews LLM Wiki content.

Do not activate this rule solely because `obsidian-mcp-core` or `obsidian-activity-context` is active. Core MCP access and activity-context tracking do not imply a wiki workflow.

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

It does not govern activity-context lifecycle/template/fallback behavior or taskbook lifecycle.

## Authorization

- Use `wiki-only` for every LLM Wiki Query or write. When another authorized surface is also requested, use a combined gate that explicitly includes every requested surface.
- Generic `external-system-only` does not authorize LLM Wiki Query, Ingest, or writes and must not substitute for `wiki-only`.
- Query is read-oriented and does not authorize Ingest or wiki mutation.
- Ingest and wiki writes require explicit user authorization and a gate that includes the wiki surface.
- Never infer Ingest from ordinary analysis, implementation, activity-context, taskbook, review, status, or external-system work.
- Do not read or modify activity-context or taskbook notes as part of wiki-only work.

Activity contexts are mutable working records, not immutable `raw/` sources. Detailed rules for explicitly using an activity context as a wiki source live only in `.agents/skills/obsidian-llm-wiki/references/wiki-workflow.md`.

## Workflow

1. Read `CODEX_PROJECT.md` and confirm the profile, logical root, wiki paths, language policy, and enabled plugins.
2. Resolve `wiki-only` or a combined request gate that explicitly includes the wiki surface.
3. Apply `obsidian-mcp-core` for all reads, searches, edits, moves, and verification.
4. Follow `.agents/skills/obsidian-llm-wiki/references/wiki-workflow.md` for Query/Ingest ordering, raw-source policy, and optional activity-context source handling.
5. Do not modify existing `raw/` entries except when the user explicitly requests a source change.
6. Re-read and verify every changed note through MCP.

When the task explicitly concerns confidence, freshness, supersession, archival, or typed wiki relationships, also follow `.agents/skills/obsidian-llm-wiki/references/wiki-lifecycle.md`.

## Review Checklist

- [ ] `obsidian-llm-wiki` was active or wiki work was directly requested.
- [ ] Request mode explicitly allowed wiki access or side effects.
- [ ] `obsidian-mcp-core` governed all vault access and edits.
- [ ] Query remained read-only unless a separate write operation was explicitly authorized.
- [ ] Ingest was explicitly authorized.
- [ ] Raw sources remained immutable unless explicitly requested.
- [ ] Activity-context source handling, when applicable, followed the wiki workflow reference.
- [ ] No activity-context or taskbook side effects were introduced implicitly.
