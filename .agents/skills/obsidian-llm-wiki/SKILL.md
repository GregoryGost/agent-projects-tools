---
name: obsidian-llm-wiki
description: "Use for Obsidian LLM Wiki queries, explicit ingest, synthesis, wikilinks, indexes, source register, and logs."
---

# Obsidian LLM Wiki

Use this skill only when `CODEX_PROJECT.md` declares the `obsidian-llm-wiki` profile active, or when the task directly queries, ingests, creates, changes, or reviews LLM Wiki content.

Apply `.codex/rules/obsidian_llm_wiki.md` and `obsidian-mcp-core` together with this skill.

The `obsidian-mcp-core` profile and skill are required. This overlay does not authorize taskbook changes.

Load references when needed:

- `references/wiki-workflow.md` for detailed Query/Ingest, structure, source, index, and log conventions.
- `references/wiki-lifecycle.md` when the task explicitly concerns confidence, freshness, supersession, archival, or typed wiki relationships.

## Scope

This skill owns:

- knowledge queries through `wiki/` and verified `raw/` sources;
- explicit ingest from `raw/` into processed wiki pages;
- `wiki/index.md`, `wiki/Source Notes.md`, and `wiki/log.md` maintenance;
- atomic concept/entity/comparison/synthesis pages;
- wikilinks and source references;
- the immutable `raw/` policy;
- the Query/Ingest workflow in `references/wiki-workflow.md`;
- optional lifecycle conventions in `references/wiki-lifecycle.md` when directly in scope.

It does not own:

- task creation, status changes, checks, task overviews, or task archive;
- generic MCP access and mutation safety, which remain in `obsidian-mcp-core`.

## Activation And Side Effects

- Query is read-oriented and must use MCP-only access.
- Query does not authorize ingest, crystallization, page creation, page updates, index changes, source-register changes, or wiki-log changes.
- Ingest and wiki writes require an explicit user request or an allowed request mode/surface.
- Do not infer wiki ingest from ordinary implementation, taskbook, review, or status requests.
- Do not read or update task notes or task indexes while performing wiki-only work.

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
- [ ] Wiki index, source register, and log were updated only when required by an authorized write.
- [ ] No taskbook side effects were introduced.
