---
name: unity-testing
description: "Use for Unity 6.3 EditMode/PlayMode tests, Unity Test Framework boundaries, lifecycle/scene/physics tests, isolation, cleanup, CLI/CI execution, and review."
---

# Unity Testing

Use this skill for Unity 6.3 tests and test review.

## Required Dependencies

Required skills:

- `unity-core`.

Required rules:

- `.codex/rules/unity_core.md`;
- `.codex/rules/unity_testing.md`.

The mutual `unity_testing.md ↔ unity-testing` pair is intentional.

## Workflow

1. Confirm the Unity 6000.3 patch and Test Framework package version.
2. Inspect test assembly definitions and existing EditMode/PlayMode conventions.
3. Identify the narrowest engine boundary required by the behavior.
4. Keep pure logic outside PlayMode when possible.
5. Design deterministic setup, assertion, timeout, and cleanup behavior.
6. If `unity-cli` is active, choose live MCP/Pipeline execution for an already open reachable Editor and batch `unity test` for CI/headless/no-live-Editor workflows.
7. Use only the discovered/project-declared test command schema.
8. Re-run failures in isolation before changing production behavior.

Load references:

- `references/editmode-playmode-patterns.md`.
- `references/isolation-and-cli.md`.
- `references/review-checklist.md`.
- `references/official-sources.md`.

## Execution policy

An open Unity Editor is not a reason to close it for validation. When the official `unity-cli` profile is active and the Editor is reachable, prefer its live Pipeline/MCP test surface. Use top-level `unity test` when the workflow is intentionally batch/headless/CI or no suitable live Editor exists.

Do not silently switch between live and batch paths after a failure because they differ in Editor lifecycle and can observe different state.

## Guardrails

- No `dotnet test` assumption for Unity-specific assemblies.
- No public production API added only to make tests easier.
- No mutation of canonical scenes/prefabs as shared test state.
- No arbitrary frame/time sleeps when a condition can be observed.
- No leaked GameObjects, scenes, assets, subscriptions, static state, or Editor state.
- No persistent test watcher without explicit project policy/request.
