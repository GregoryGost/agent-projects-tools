---
name: node-red-contrib-testing
description: "Use for Node-RED contrib runtime/component tests with node-red-node-test-helper, test flows, credentials/config nodes, lifecycle, HTTP routes, and cleanup."
---

# Node-RED Contrib Testing

Use this skill for Node-RED-specific runtime/component tests when the `node-red-contrib-testing` profile is active. Keep runner-specific and framework-neutral language tests in their own testing overlays.

## Required Dependencies

- `.codex/rules/node_red_contrib_testing.md`

Load references when needed:

- `references/runtime-test-patterns.md` for test flows, messages, config nodes, credentials, status/errors, HTTP routes, and flow changes.
- `references/test-boundaries-and-cleanup.md` for ownership boundaries, async failure propagation, isolation, cleanup, and E2E/browser separation.
- `references/review-checklist.md` for focused Node-RED test review prompts.
- `references/official-sources.md` for official helper and Node-RED testing sources.

## Workflow

1. Read `CODEX_PROJECT.md` in a target project.
2. Confirm the `node-red-contrib` and `node-red-contrib-testing` profiles and validate the full transitive dependency graph.
3. Inspect Node-RED/runtime/helper versions, test-runner configuration, setup/teardown, existing test helpers, flow fixtures, credentials fixtures, and relevant runtime node code.
4. Classify the behavior: framework-neutral logic, Node-RED runtime/component contract, browser editor behavior, or separate-process E2E.
5. Use this skill only for the Node-RED runtime/component portion.
6. Build the smallest flow that exposes the behavior through Node-RED semantics.
7. Choose the helper's Promise or callback API according to the declared helper version and project conventions.
8. Attach observers before triggering messages/events and ensure failures propagate to the runner.
9. Unload flows and stop any helper server started by the test.
10. Run or report the project-declared Node-RED test command.

## Core boundary

Use `node-red-node-test-helper` to exercise Node-RED runtime contracts rather than manually reproducing the runtime.

Typical test shape:

```text
helper.load(runtimeModule, testFlow, credentials)
        |
        v
 custom node ---- message ----> helper node
        |
        +---- status/error/close/config/http behavior
```

Pure mapper/service/class behavior should normally have a smaller framework-neutral test. A Node-RED runtime test should exist because the behavior depends on flow wiring, node lifecycle, Node-RED APIs, credentials/config nodes, runtime HTTP routes, or another Node-RED contract.

## Runner neutrality

This skill does not choose the runner.

- Jest configuration, typed Jest mocks, fake timers, and Jest coverage belong to `typescript-jest-testing` when active.
- Vitest/Mocha/other runner setup belongs to the project-declared runner policy.
- The Node-RED layer owns `node-red-node-test-helper` usage and Node-RED flow semantics only.

The helper has Promise-based `load`, `setFlows`, and lifecycle APIs in current releases, so do not preserve callback-only patterns when the project's declared version and runner use async/await.

## Test design

- Keep each flow minimal and behavior-focused.
- Use helper nodes to observe emitted messages rather than spying on private implementation.
- Test config-node sharing through actual flow references.
- Supply credentials through the helper credential argument.
- Exercise status/error/complete behavior through Node-RED runtime observability when it is part of the contract.
- Start the helper server only for custom HTTP/WebSocket route tests.
- Use `setFlows` only when redeploy/flow-change behavior is the subject of the test.
- Verify lifecycle cleanup when the production node owns long-lived resources.

## Review checklist

- [ ] The behavior genuinely requires Node-RED runtime semantics.
- [ ] Helper/runtime/runner versions and commands come from project evidence.
- [ ] The flow is minimal and deterministic.
- [ ] Config nodes and credentials use real Node-RED test boundaries.
- [ ] Observers are attached before events are triggered.
- [ ] Assertions inside callbacks cannot be swallowed into timeouts.
- [ ] Flows, servers, listeners, timers, clients, and mutable settings are cleaned up.
- [ ] Generic TypeScript/Jest behavior, browser editor tests, and E2E were not duplicated.
