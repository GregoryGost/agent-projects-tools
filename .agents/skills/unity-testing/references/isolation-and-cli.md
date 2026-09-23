# Unity Test Isolation And CLI

## Isolation

Each test owns and cleans up what it creates:

- GameObjects;
- loaded additive scenes;
- temporary assets/directories;
- event subscriptions;
- static state;
- modified Editor preferences/settings when unavoidable;
- test-specific files and reports.

Prefer unique temporary paths and deterministic fixture names.

## Enter Play Mode settings

Do not assume domain/scene reload policy. A suite should either:

- remain correct under the project's declared settings; or
- state that a specific reload configuration is the subject/precondition.

## Unity CLI

When `unity-cli` is active, inspect the installed CLI and connected Editor command schemas rather than memorizing flags.

### Open reachable Editor

Prefer the warm live-Editor path:

- use a discovered MCP tool when the agent is connected through official `unity mcp`;
- otherwise use the equivalent `unity command`;
- for tests, use `run_tests` and `test_status` only when the current Pipeline catalog exposes them;
- keep the target project explicit when multiple Editors can run.

This avoids starting a second Editor solely to validate a project that is already open.

### Batch/headless/CI

Use project-aware top-level `unity test` workflows for CI, intentionally headless validation, or when no suitable live Editor exists. For the verified `1.0.0-beta.10` line, affected/watch capabilities are available; use:

- normal/focused/affected test runs according to project policy;
- reports/coverage only when configured;
- `watch test` only when the user or project workflow explicitly asks for a long-running watcher.

Do not silently fall back from a failed live connection to batch execution against the same open project. Diagnose Safe Mode, ambiguous targeting, sandbox/localhost access, or Editor readiness first.

The Unity CLI is optional. A Unity project remains testable through its Editor/batch workflow without activating the CLI profile.

## Failure triage

1. Re-run the focused failing test.
2. Inspect Unity Console/test report.
3. Check leaked state/order/timing assumptions.
4. Re-run at the broader boundary required by policy.
5. Only then change production behavior.
