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

When `unity-cli` is active, inspect the installed CLI command schema rather than memorizing flags.

For the verified `1.0.0-beta.10` line, the official CLI includes project-aware test workflows and affected/watch capabilities. Use:

- normal/focused/affected test runs according to project policy;
- reports/coverage only when configured;
- `watch test` only when the user or project workflow explicitly asks for a long-running watcher.

The Unity CLI is optional. A Unity project remains testable through the Editor/batch workflow without activating the CLI profile.

## Failure triage

1. Re-run the focused failing test.
2. Inspect Unity Console/test report.
3. Check leaked state/order/timing assumptions.
4. Re-run at the broader boundary required by policy.
5. Only then change production behavior.
