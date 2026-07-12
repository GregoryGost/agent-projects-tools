# Obsidian LLM Wiki Lifecycle Reference

Use this reference only with the `obsidian-llm-wiki` profile and only when the task explicitly concerns wiki confidence, freshness, supersession, archival, or typed relationships.

All vault access and mutation safety remain governed by `obsidian-mcp-core`. Reading lifecycle metadata does not authorize changing it. Any wiki mutation still requires explicit user authorization or an allowed wiki-write request mode.

## Confidence

Confidence metadata may be used when the project already declares it or when the user explicitly requests it.

- Prefer a small project-defined vocabulary such as `high`, `medium`, and `low`.
- Base confidence on source quality, source agreement, freshness, and verification evidence.
- Do not invent precise confidence values without project evidence.
- Record uncertainty when sources are incomplete or contradictory.

## Freshness

Freshness policy must be project-specific.

- Use a field such as `last_verified` only when the project profile or existing wiki schema defines it.
- Do not impose a universal stale threshold.
- Use shorter review intervals for rapidly changing operational or dependency information and longer intervals for stable concepts.
- A Query may report stale metadata, but it must not update freshness fields automatically.

## Supersession

When an authorized wiki update replaces an older statement:

- preserve relevant historical context instead of silently deleting it;
- mark or explain that the older statement is superseded according to project convention;
- link the old and new statements or pages when both remain useful;
- keep source references for the change.

## Archival And Forgetting

Archive or demote wiki material only when the user explicitly requests it or the active project policy authorizes lifecycle maintenance.

- Do not delete material merely because it is old or rarely linked.
- Prefer archive or superseded status when history remains useful.
- Keep archived material excluded from normal current-state Query results unless historical context is requested.
- Do not archive or modify taskbook notes through the wiki lifecycle workflow.

## Typed Relationships

Typed relationships are optional project metadata, not a portable mandatory schema.

Examples include:

- `supports`;
- `contradicts`;
- `extends`;
- `implements`;
- `used_by`;
- `supersedes`.

Use them only when the wiki schema already supports them or the user explicitly requests the schema change. Preserve ordinary wikilinks even when typed relationship metadata is added.

## Lifecycle Boundaries

- Query remains read-only.
- Do not convert a Query into crystallization, lifecycle maintenance, metadata repair, or archival without separate authorization.
- Do not read `tasks/` as a wiki source by default.
- Do not update task notes, task indexes, checks, statuses, or archives.
- Existing `raw/` sources remain immutable unless the user explicitly requests a source change.
- Re-read and verify every authorized lifecycle mutation through MCP.

## Review Checklist

- [ ] Lifecycle behavior was explicitly in scope.
- [ ] `obsidian-mcp-core` governed all access and edits.
- [ ] Query did not trigger lifecycle mutations.
- [ ] Confidence and freshness followed the project schema rather than invented defaults.
- [ ] Supersession preserved useful history and source references.
- [ ] Archival was explicitly authorized and excluded taskbook content.
- [ ] Typed relationships were added only under an existing or explicitly approved schema.
