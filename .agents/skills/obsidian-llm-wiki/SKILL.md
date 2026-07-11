---
name: obsidian-llm-wiki
description: "Use for the Obsidian LLM Wiki workflow: querying project knowledge, explicit ingest from raw sources, wiki synthesis, wikilinks, source register, index maintenance, wiki log, and immutable raw-source policy."
---

# Obsidian LLM Wiki

Use this skill only when `CODEX_PROJECT.md` declares the `obsidian-llm-wiki` profile active, or when the task directly queries, ingests, creates, changes, or reviews LLM Wiki content.

Apply `.codex/rules/obsidian_wiki.md` and `obsidian-mcp-core` together with this skill.

The `obsidian-mcp-core` profile and skill are required. This overlay does not authorize taskbook changes.

## Scope

This skill owns:

- knowledge queries through `wiki/` and verified `raw/` sources;
- explicit ingest from `raw/` into processed wiki pages;
- `wiki/index.md`, `wiki/Source Notes.md`, and `wiki/log.md` maintenance;
- atomic concept/entity/comparison/synthesis pages;
- wikilinks and source references;
- the immutable `raw/` policy;
- the detailed `LLM Wiki Workflow` referenced by the rule.

It does not own:

- task creation, status changes, checks, task overviews, or task archive;
- generic MCP access and mutation safety, which remain in `obsidian-mcp-core`.

## Activation And Side Effects

- Query is read-oriented and must use MCP-only access.
- Ingest and wiki writes require an explicit user request or an allowed request mode/surface.
- Do not infer wiki ingest from ordinary implementation, taskbook, review, or status requests.
- Do not update task notes or task indexes while performing wiki-only work.

## Workflow

1. Read `CODEX_PROJECT.md` and confirm `obsidian-llm-wiki` is active or wiki content is directly in scope.
2. Apply `obsidian-mcp-core` for all vault access and edits.
3. Apply `.codex/rules/obsidian_wiki.md` for Query/Ingest structure and source policy.
4. Use the project logical root and declared wiki paths.
5. Re-read and verify every changed wiki note through MCP.

## Review Checklist

- [ ] `obsidian-llm-wiki` was explicitly active or wiki content was directly requested.
- [ ] `obsidian-mcp-core` governed all access and edits.
- [ ] Ingest occurred only with explicit authorization.
- [ ] `raw/` sources were not modified unless explicitly requested.
- [ ] Wiki index, source register, and log were updated only when required.
- [ ] No taskbook side effects were introduced.
