# Node-RED contrib testing rules

Apply this rule only when `CODEX_PROJECT.md` declares the `node-red-contrib-testing` active stack profile or when the file is being maintained directly in the `agent-projects-tools` template repository.

This is a Node-RED-specific testing overlay. It does not replace framework-neutral TypeScript/Jest testing or project E2E testing.

## Required skills

Use together with:

- `node-red-contrib-testing`;
- `node-red-contrib-expert`.

Required base rule:

- `.codex/rules/node_red_contrib.md`.

## Source of truth

Before adding or changing Node-RED tests:

1. Read `CODEX_PROJECT.md` in a target project.
2. Confirm the active `node-red-contrib` and `node-red-contrib-testing` profiles.
3. Inspect `package.json`, lockfile, Node-RED version constraint, installed/development Node-RED version source, `node-red-node-test-helper` version source, test-runner configuration, setup files, and existing test flows.
4. Check whether the project uses callback or Promise APIs for the declared helper version.
5. Use project-declared test commands and test-runner conventions.

Do not hardcode Mocha, Jest, Vitest, assertion libraries, TypeScript transformers, or coverage configuration in this Node-RED-specific layer.

## Testing boundary

Use this profile to test behavior that depends on a Node-RED runtime contract, including:

- node registration and runtime loading;
- flow wiring and messages between nodes;
- multiple outputs and multiple emitted messages;
- config-node resolution and shared-resource behavior;
- credentials supplied through the Node-RED credential boundary;
- `status`, `error`, completion, and close behavior when relevant;
- custom `httpAdmin` or `httpNode` routes through the test runtime;
- redeploy/set-flow behavior when the node intentionally reacts to flow changes.

Keep pure transformations, DTO/model behavior, generic classes, ordinary services, and framework-neutral mocks in the active language/test-runner skill instead of repeating them through a Node-RED flow.

Actual browser interaction with the Node-RED editor belongs to an independently active UI/browser testing overlay. A real installed package running in a separate Node-RED process with real external dependencies belongs to project E2E scope rather than this runtime-component profile.

## Runtime harness

- Prefer the official `node-red-node-test-helper` when the profile declares it.
- For runtime-contract tests, do not replace Node-RED with a hand-built fake `RED` object when the helper can exercise the behavior through the real test runtime.
- Initialize the helper against the project-declared Node-RED runtime source.
- Keep test flows minimal: include only the node under test, required config nodes, helper/observer nodes, and core nodes needed for the asserted Node-RED behavior.
- Use `helper.getNode` only for public/runtime-observable behavior required by the test; do not turn runtime instances into a path for testing private implementation details.
- Use helper-supported credentials input instead of embedding secrets into exported flow JSON.
- Start the helper HTTP server only for tests that require registered HTTP/WebSocket behavior and stop it during teardown.

## Async behavior and assertion propagation

- Await `load`, `setFlows`, `unload`, and start/stop operations when the declared helper version provides Promise APIs.
- Propagate assertion failures raised inside Node-RED event callbacks back to the test runner. Node-RED can catch flow exceptions, so an uncaught assertion inside a node callback may otherwise become a timeout rather than a useful test failure.
- Prefer event completion, returned Promises, observable messages, status/error hooks, or bounded polling over arbitrary sleeps.
- Attach observers before triggering the event they must capture.
- Ensure each test has one deterministic completion path and cannot resolve successfully before the asserted Node-RED behavior occurred.

## Isolation and cleanup

- Use a fresh flow/runtime state per test or per suite according to the helper and project policy.
- Call `helper.unload()` after loaded-flow tests and stop the helper server when the suite started it.
- Verify cleanup behavior when the node owns timers, listeners, subscriptions, sockets, clients, watchers, or shared config-node resources.
- Restore environment, clocks, ports, external stubs, and test-runner mocks through the owning testing overlay.
- Do not let test flows, credentials, runtime settings, or mutable singleton state leak between tests.

## Optional coordination

- Use `typescript-jest-testing` for Jest configuration, typed mocks, fake timers, generic TypeScript unit/integration tests, and coverage when that profile is independently active.
- Use another project-declared runner policy when Node-RED tests run through Vitest, Mocha, or another supported runner.
- Use UI/browser validation only for actual Node-RED editor interaction.
- Use project E2E materials only for a separate-process Node-RED installation, packed/installed contrib module, or real external-service scenario.

## Review checklist

- [ ] The test requires Node-RED runtime semantics rather than only generic TypeScript behavior.
- [ ] Node-RED, helper, and runner versions came from project evidence.
- [ ] The test uses the real Node-RED test runtime when runtime behavior is under test.
- [ ] The flow fixture is minimal and includes required config/helper/core nodes explicitly.
- [ ] Credentials are passed through the helper credential boundary.
- [ ] Async assertion failures reach the test runner.
- [ ] No arbitrary sleep substitutes for an observable completion condition.
- [ ] Loaded flows and helper servers are fully torn down.
- [ ] Runtime resources are checked for cleanup when lifecycle behavior is relevant.
- [ ] Generic Jest/TypeScript/browser/E2E concerns are not duplicated.
