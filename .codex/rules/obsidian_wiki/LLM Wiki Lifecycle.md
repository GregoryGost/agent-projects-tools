# LLM Wiki Lifecycle

The lifecycle approach solves the "wiki rot" problem: not all statements remain equally accurate, fresh, and useful.

## Confidence

Each important statement should be assessed for reliability: how many sources support it, how fresh they are, and whether there are any contradictions. The minimum version requires levels of `high`, `medium`, and `low`.

## Freshness

`last_verified` indicates when a page or statement was last verified. For rapidly changing topics, the stale threshold can be 90 days; for stable concepts like `Zettelkasten`, it can be much longer.

## Supersession

If a new source updates an old statement, the old one shouldn't be silently deleted. It should be marked as superseded and linked to the new statement. This preserves the history of knowledge.

## Forgetting

Not all facts should remain in the active layer. Obsolete or long-unused observations can be demoted, archived, or marked as low-confidence.

## Typed relationships

Regular wikilinks show the relationship, but not the relationship type. An extended LLM Wiki can store the following relationships:

- `supports` - supports the statement;
- `contradicts` - contradicts;
- `extends` - expands the basic idea;
- `implements` - implements the concept;
- `used_by` - is used by something;
- `supersedes` - replaces the old version.

## Conflict in current sources

No obvious substantive contradiction between the sources has yet been found. There is a difference in emphasis:

- Karpathy proposes a minimal viable wiki with `raw/`, `wiki/`, schema, `index.md`, and `log.md`. - LLM Wiki v2 and Rangaprabhu's technical implementation add lifecycle, graph, automation, and quality controls.

This isn't a conflict, but an extension: `LLM Wiki` can start minimally and gradually incorporate lifecycle mechanics.

## Connections

- [LLM Wiki Workflow](./LLM%20Wiki%20Workflow.md)
