# TypeScript Node-RED contrib testing rules

Apply this rule only when `CODEX_PROJECT.md` declares the `node-red-contrib-testing` active stack profile or when the file is being maintained directly in the `agent-projects-tools` template repository.

This is a Node-RED-specific testing overlay for the **TypeScript Node-RED contrib** profile. It does not replace framework-neutral TypeScript/Jest testing or project E2E testing.

## Required skills

Use together with:

- `node-red-contrib-testing`;
- `node-red-contrib-expert`.

Required base rule:

- `.codex/rules/node_red_contrib.md`.

The base Node-RED profile transitively requires `typescript-core` and `.codex/rules/typescript_core.md`; do not duplicate those dependencies here.

## Source of truth

Before adding or changing Node-RED tests:

1. Read `CODEX_PROJECT.md` in a target project.
2. Confirm the active `node-red-contrib`, `node-red-contrib-testing`, and transitive TypeScript dependencies.
3. Inspect `package.json`, lockfile, TypeScript/test compilation configuration, Node-RED version constraint, installed/development Node-RED version source, `node-red-node-test-helper` version source, helper type-definition source, test-runner configuration, setup files, and existing `.ts` test flows/tests.
4. Check whether the project uses callback or Promise APIs for the declared helper version.
5. Use project-declared type-check/test commands and test-runner conventions.

Node-RED runtime/component test source is TypeScript in this profile. Do not add parallel JavaScript test implementations or edit generated JavaScript test output as source.

Do not hardcode Mocha, Jest, Vitest, assertion libraries, TypeScript transformers, or coverage configuration in this Node-RED-specific layer.

## Testing boundary

Use this profile to test behavior that depends on a Node-RED runtime contract, including:

- typed node registration and runtime loading of the built node module;
- flow wiring and messages between nodes;
- multiple outputs and multiple emitted messages;
- config-node resolution and shared-resource behavior;
- credentials supplied through the Node-RED credential boundary;
- `status`, `error`, completion, and close behavior when relevant;
- custom `httpAdmin` or `httpNode` routes through the test runtime;
- redeploy/set-flow behavior when the node intentionally reacts to flow changes.

Keep pure transformations, DTO/model behavior, generic classes, ordinary services, and framework-neutral mocks in the active TypeScript/test-runner skill instead of repeating them through a Node-RED flow.

Actual browser interaction with the Node-RED editor belongs to an independently active UI/browser testing overlay. A real packed/installed package running in a separate Node-RED process with real external dependencies belongs to project E2E scope rather than this runtime-component profile.

## TypeScript test boundary

- Author Node-RED runtime/component tests and reusable flow/test helpers in TypeScript.
- Use the project-declared Node-RED and test-helper declarations when available; do not introduce `any` around helper/runtime objects merely to make tests compile.
- Treat `@types/node-red-node-test-helper` or another declaration source as typing metadata, not proof of helper/runtime compatibility.
- Keep test flow objects narrow and typed enough to catch misspelled ids/types/properties where the declaration/project model permits it, without building a second framework type system.
- Narrow values returned from helper/runtime boundaries before invoking project-specific methods when their static type is broader than the actual test node.
- Keep test-runner globals, mocks, fake timers, coverage, and transform configuration in the runner-specific overlay.

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

- [ ] The base TypeScript Node-RED contrib dependency graph is valid.
- [ ] Node-RED runtime/component test source is TypeScript and generated JavaScript is not edited as source.
- [ ] Node-RED, helper, declaration, TypeScript, and runner versions/sources came from project evidence.
- [ ] Declaration package versions were not treated as runtime/helper compatibility evidence.
- [ ] The test requires Node-RED runtime semantics rather than only generic TypeScript behavior.
- [ ] The test uses the real Node-RED test runtime when runtime behavior is under test.
- [ ] The flow fixture is minimal and includes required config/helper/core nodes explicitly.
- [ ] Credentials are passed through the helper credential boundary.
- [ ] Async assertion failures reach the test runner.
- [ ] No arbitrary sleep substitutes for an observable completion condition.
- [ ] Loaded flows and helper servers are fully torn down.
- [ ] Runtime resources are checked for cleanup when lifecycle behavior is relevant.
- [ ] Generic Jest/TypeScript/browser/E2E concerns are not duplicated.
