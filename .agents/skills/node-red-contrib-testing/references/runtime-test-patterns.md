# Node-RED runtime test patterns

## Minimal message-flow test

Prefer a small flow with the node under test and a helper observer:

```js
const flow = [
  { id: "n1", type: "example-transform", wires: [["out"]] },
  { id: "out", type: "helper" },
]

await helper.load(exampleNode, flow)

const input = helper.getNode("n1")
const output = helper.getNode("out")

const received = new Promise((resolve) => {
  output.on("input", resolve)
})

input.receive({ payload: "VALUE" })
const msg = await received
// Assert `msg` here with the project-declared assertion API.
```

Keeping the ordinary assertion outside the Node-RED callback avoids the swallowed-assertion problem entirely. If the assertion must run inside a Node-RED event callback, catch the failure and explicitly reject/fail the test as described in `test-boundaries-and-cleanup.md`.

Keep runner-specific assertion syntax out of shared Node-RED helpers unless the project deliberately standardizes it.

## Loading test flows

Use `helper.load` for a fresh runtime flow. Include only:

- the node module(s) being registered;
- the node under test;
- required configuration nodes;
- helper nodes that observe outputs;
- core Catch/Status/Complete or other nodes only when their semantics are part of the test.

Avoid pasting a production flow containing unrelated nodes into a unit/component test. Exported flow JSON is useful as a starting point, not as a reason to keep irrelevant fixtures.

## Config nodes

A config-node test should wire the reference exactly as Node-RED does:

```js
const flow = [
  { id: "cfg", type: "example-server", host: "localhost" },
  { id: "n1", type: "example-node", server: "cfg", wires: [["out"]] },
  { id: "out", type: "helper" },
]
```

Useful assertions include:

- consuming node resolves the config node;
- missing config references fail safely;
- two consumers share the intended connection owner;
- config-node shutdown closes the shared resource once.

Do not unit-test the same framework-neutral connection manager again through several nearly identical flows.

## Credentials

Pass credentials through the helper's credential input rather than adding password/token fields to flow JSON.

Conceptually:

```js
await helper.load(nodeModule, flow, {
  n1: {
    username: "test-user",
    password: "test-secret",
  },
})
```

Use synthetic test values. Never copy production credentials into tests or fixtures.

Test both presence and absence/invalid credential behavior when those branches are part of the node contract.

## Errors, status, and completion

When error/status behavior is public Node-RED behavior, observe it through helper/runtime facilities instead of testing private booleans.

Examples:

- input failure reaches the Node-RED error/completion path;
- connection state sets/clears expected node status;
- cleanup resets status if the project contract requires it;
- a Complete/Catch/Status core node observes the event when the declared helper version and test setup preload/support that core node behavior.

`node-red-node-test-helper` added optional preloading for catch/status/complete nodes before its current releases. Treat that capability as helper-version/setup-specific rather than assuming every historical project has it enabled.

## Multiple outputs

Represent output wiring explicitly:

```js
const flow = [
  {
    id: "n1",
    type: "router-node",
    wires: [["success"], ["failure"]],
  },
  { id: "success", type: "helper" },
  { id: "failure", type: "helper" },
]
```

Assert which observer received the message and that the other output did not receive an unintended message.

For multiple messages to one output, assert ordering only when ordering is part of the documented node contract.

## HTTP routes

For nodes that register `RED.httpAdmin` or `RED.httpNode` routes:

1. start the helper server according to the helper/project API;
2. load the node module;
3. for `httpAdmin`, use `helper.request()` when it matches the declared helper version and route under test;
4. for `httpNode`, use `helper.url()` with the project-approved HTTP client and the configured runtime HTTP root, rather than assuming `helper.request()` targets runtime routes;
5. assert authentication/permission and validation behavior when relevant;
6. unload the flow/module state;
7. stop the helper server.

Do not start an HTTP server in every test file if only one route suite needs it.

## Flow changes

Use `helper.setFlows` for behavior that intentionally depends on redeploying or modifying flows. A normal input/output test should not use redeploy machinery merely because the helper exposes it.

When testing redeploy:

- establish initial state;
- change the flow;
- await deployment completion;
- assert shutdown/reinitialization behavior;
- ensure the final teardown still unloads the runtime.
