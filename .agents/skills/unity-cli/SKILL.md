---
name: unity-cli
description: "Use for official Unity CLI 1.0.0-beta.10 discovery, Editor/Pipeline automation, tests/builds, structured commands, eval safety, contexts, and routed side effects."
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
2. Identify target project and connected Editor when needed.
3. Discover the live CLI command schema.
4. Inspect effective project/global configuration when relevant.
5. Classify actual side effects with `request_routing.md`.
6. Prefer the narrowest structured command over arbitrary `eval`.
7. Execute only within authorized project/local-environment/external surfaces.
8. Verify resulting state/output.

Load references:

- `references/beta10-command-model.md`.
- `references/safety-and-routing.md`.
- `references/review-checklist.md`.
- `references/official-sources.md`.

## Priority discovery for beta.10

Prefer:

```text
unity version --format json
unity commands --format json
unity skill show --format json
unity list
```

Use command-specific help as a secondary source. Do not parse human help text if the installed command exposes a machine-readable schema.

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
