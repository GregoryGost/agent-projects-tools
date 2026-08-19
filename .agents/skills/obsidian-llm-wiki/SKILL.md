---
name: obsidian-llm-wiki
description: "Use for Obsidian LLM Wiki queries, explicit ingest, synthesis, wikilinks, indexes, source register, and logs."
---

# Obsidian LLM Wiki

Use this skill only when `CODEX_PROJECT.md` declares the `obsidian-llm-wiki` profile active, or when the task directly queries, ingests, creates, changes, or reviews LLM Wiki content.

Apply `.codex/rules/obsidian_llm_wiki.md` and `obsidian-mcp-core` together with this skill.

The `obsidian-mcp-core` profile and skill are required. This overlay does not authorize activity-context or taskbook changes.

Load references when needed:

- `references/wiki-workflow.md` for detailed Query/Ingest, structure, source, index, log, and optional activity-context source conventions.
- `references/wiki-lifecycle.md` when the task explicitly concerns confidence, freshness, supersession, archival, or typed wiki relationships.

## Scope

This skill owns:

- knowledge queries through `wiki/` and verified `raw/` sources;
- explicit ingest into processed wiki pages;
- wiki index, source register, log, wikilinks, and immutable `raw/` policy;
- optional lifecycle conventions in `references/wiki-lifecycle.md` when directly in scope.

It does not own activity-context lifecycle/template/fallback behavior, taskbook lifecycle, or generic MCP safety.

## Activation And Side Effects

- Query is read-oriented and does not authorize ingest or wiki mutation.
- Ingest and wiki writes require an explicit user request or an allowed wiki-write surface.
- Do not infer wiki ingest from ordinary implementation, activity-context, taskbook, review, or status requests.
- Do not read or update activity-context or task notes while performing wiki-only work.

Activity contexts are mutable working records, not immutable `raw/` sources. Use `references/wiki-workflow.md` as the single detailed source for any explicitly authorized context-to-wiki source handling.

## Workflow

1. Read `CODEX_PROJECT.md` and confirm `obsidian-llm-wiki` is active or wiki content is directly in scope.
2. Apply `obsidian-mcp-core` for all vault access and edits.
3. Apply `.codex/rules/obsidian_llm_wiki.md` and `references/wiki-workflow.md` for Query/Ingest structure and source policy.
4. Load `references/wiki-lifecycle.md` only when its lifecycle concerns are directly requested or already part of the project policy.
5. Use the project logical root and declared wiki paths.
6. Re-read and verify every changed wiki note through MCP.

## Review Checklist

- [ ] `obsidian-llm-wiki` was explicitly active or wiki content was directly requested.
- [ ] `obsidian-mcp-core` governed all access and edits.
- [ ] Query remained read-only unless a separate write operation was explicitly authorized.
- [ ] Ingest occurred only with explicit authorization.
- [ ] `raw/` sources were not modified unless explicitly requested.
- [ ] Optional activity-context source handling followed `references/wiki-workflow.md`.
- [ ] No activity-context or taskbook side effects were introduced.
