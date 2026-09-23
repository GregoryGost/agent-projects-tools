# Unity MCP And Live Editor Workflow

This reference applies to the official Unity CLI priority baseline `1.0.0-beta.10`. Live discovery remains authoritative because the Editor/Pipeline package supplies the actual command catalog.

## Execution model

`unity mcp` is the official CLI's built-in stdio MCP server. It exposes commands registered by the connected Unity Editor/Pipeline as MCP tools for an agent client.

The live control surfaces are two transports over the same Editor command catalog:

- MCP: the agent calls tools exposed by `unity mcp`;
- CLI: the agent calls `unity command <name>`.

Do not treat them as independent automation stacks. Side effects, target selection, command schemas, and project safety are shared concerns.

## Target selection

Before live mutation or validation:

1. identify the intended Unity project;
2. inspect `unity status --format json` when direct CLI access is available;
3. use explicit project targeting when more than one Editor can be running;
4. prefer `unity mcp --project-path <project>` or an equivalent project-pinned client configuration over implicit current-working-directory targeting.

A live MCP server can start before the Editor. Its tool catalog can change when an Editor connects, so refresh/use the client's current MCP tool list rather than assuming the initial catalog is final.

## Agent-client configuration

`unity mcp configure <client>` is setup, not ordinary task execution.

For Codex, project-local registration is supported:

```text
unity mcp configure codex --local --project-path <project>
```

Use the installed CLI's command discovery/help before applying configuration because the CLI is version-sensitive.

Do not run `mcp configure` merely because MCP would be convenient. It writes local agent configuration and requires authorization for that local-environment change.

## Tests in an already open Editor

When the intended Editor is already open and reachable:

1. discover the live Pipeline/MCP catalog;
2. locate the registered test command and its current schema;
3. when available, run the live `run_tests` command through MCP or `unity command`;
4. poll/read `test_status` when the command model requires asynchronous completion;
5. inspect the returned test result/report and re-run the focused failure when needed.

Do not hard-code flags such as mode/filter from memory. Parameter names belong to the connected Pipeline package version.

Commands such as `list_tests` or `cancel_tests` may exist in a particular catalog; use them only when live discovery confirms them.

## Batch and CI path

Top-level `unity test` launches the CLI-managed test workflow outside the warm connected-Editor command path. Prefer it for:

- CI;
- intentionally headless/batch validation;
- projects with no suitable reachable Editor;
- project workflows that explicitly standardize on batch test execution.

Do not invoke `unity test` as an automatic fallback merely because a live MCP/Pipeline call failed while the same project is open. First diagnose the live connection.

## Failure boundaries

### Multiple Editors

Do not guess. Bind the intended project explicitly.

### Safe Mode / compile errors

Pipeline/MCP may be unavailable when the Editor cannot load the package. Diagnose the compile failure and recover the Editor rather than interpreting missing MCP tools as proof that no Editor is open.

### Agent sandbox

A sandbox can block discovery files or localhost access. Do not disable the sandbox automatically and do not silently switch to a second Editor. Report the boundary and use an allowed project workflow.

### Blocking Editor UI

A modal/blocking Editor state can make live commands time out. Preserve user state and report the condition rather than forcing process termination.

## Decision table

| Situation | Preferred execution |
| --- | --- |
| Editor open, reachable, agent has Unity MCP | discovered MCP tool |
| Editor open, reachable, no MCP client connection | `unity command <name>` |
| Tests in open reachable Editor | discovered live `run_tests` / `test_status` |
| CI/headless/no suitable Editor | top-level `unity test` |
| Live connection ambiguous or blocked | diagnose/report; no silent batch substitution |

