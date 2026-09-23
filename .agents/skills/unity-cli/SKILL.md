---
name: unity-cli
description: "Use for official Unity CLI 1.0.0-beta.10 discovery, Unity MCP/live Editor automation, Pipeline commands, tests/builds, eval safety, contexts, and routed side effects."
---

# Official Unity CLI

Use this skill for the official `unity` CLI, priority version `1.0.0-beta.10`.

It is an automation/validation overlay. It is not a hard dependency of Unity runtime, Editor, or testing profiles.

## Required Dependencies

Required rules:

- `.codex/rules/unity_cli.md`.

The mutual `unity_cli.md ↔ unity-cli` pair is intentional; both artifacts must be active independently through the project profile.

## Workflow

1. Confirm executable identity and installed CLI version.
2. Identify the target project and inspect reachable Editor state when the task can use a live Editor.
3. Prefer an already configured `unity mcp` connection for agent-driven live Editor work; otherwise use the equivalent `unity command` surface.
4. Discover the live CLI/Pipeline/MCP schema instead of assuming tool names or parameters.
5. Inspect effective project/global configuration when relevant.
6. Classify actual side effects with `request_routing.md`.
7. Prefer the narrowest structured command over arbitrary `eval`.
8. Use batch `unity test`/build/run only when the workflow is actually batch/headless/CI or no suitable live Editor exists.
9. Execute only within authorized project/local-environment/external surfaces.
10. Verify resulting state/output.

Load references:

- `references/beta10-command-model.md`.
- `references/mcp-live-editor.md`.
- `references/safety-and-routing.md`.
- `references/review-checklist.md`.
- `references/official-sources.md`.

## Priority discovery for beta.10

Prefer:

```text
unity version --format json
unity commands --format json
unity skill show --format json
unity status --format json
unity list --format json
```

Use command-specific help as a secondary source. Do not parse human help text if the installed command exposes a machine-readable schema.

## Live Editor first

For interactive work on a project that is already open:

- use `unity status --format json` to establish the intended Editor is ready;
- if Unity MCP is already configured for the agent, use its discovered tools as the primary live control surface;
- otherwise use `unity command <name>` against the same Pipeline catalog;
- pass/bind the project explicitly when more than one Editor may be running;
- do not start a second batch Editor as a silent fallback.

For tests, prefer live `run_tests` + `test_status` only after those commands appear in the current catalog. Use top-level `unity test` for CI/headless/closed-Editor workflows or when project policy explicitly selects batch execution.

Configuring MCP is separate from using it: `unity mcp configure <client>` changes local agent configuration and requires the corresponding routing authorization.

## Project configuration

`ProjectSettings/UnityCliConfig.json` may define project defaults for supported workflows. Read it when present. Use live config-resolution commands when the effective source matters.

Do not modify CLI config as an implementation shortcut.

## Side-effect model

The CLI can touch:

- read-only local/project state;
- running Editor state;
- persistent project assets/settings;
- machine-local Editor/module/plugin/tool configuration;
- credentials and remote/cloud/VCS state.

Classify each operation by the real target. A single CLI command may span more than one surface.

## Eval

`unity eval` is a fallback escape hatch, not the default automation API.

Before eval:

- inspect whether a dedicated/registered command exists;
- classify the expression's effects;
- keep expression scope bounded;
- avoid unreviewable multi-step mutations;
- verify resulting project/Editor state.

## Validation role

When active, the CLI is a preferred reproducible surface for:

- Editor/command discovery;
- compilation/Console-related automation available in the installed tool;
- Unity tests/reports/coverage;
- builds;
- registered project Editor commands.

It does not replace source review, Unity-specific test-boundary reasoning, or project policy.
