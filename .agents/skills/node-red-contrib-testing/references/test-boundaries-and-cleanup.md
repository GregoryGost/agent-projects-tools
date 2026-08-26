# Node-RED test boundaries and cleanup

## Boundary decision

Choose the smallest layer that proves the behavior.

| Behavior | Preferred layer |
| --- | --- |
| Pure mapper/validator/codec | framework-neutral language test |
| Service/class without `RED` APIs | framework-neutral language test |
| Node registration/load | Node-RED contrib testing |
| `msg` flow/output wiring | Node-RED contrib testing |
| Config-node resolution | Node-RED contrib testing |
| Credentials injection | Node-RED contrib testing |
| Node `close` lifecycle | Node-RED contrib testing |
| `httpAdmin`/`httpNode` route in test runtime | Node-RED contrib testing |
| Editor dialog browser behavior | UI/browser testing overlay |
| Packed module installed into separate Node-RED process | project E2E |
| Real NATS/MQTT/database/provider end-to-end flow | project E2E or integration boundary declared by that dependency profile |

Do not add a Node-RED flow test merely to re-run assertions already proven against a pure function. Add the runtime test only for the adapter contract that pure tests cannot cover.

## Do not fake the framework contract

Bad for a runtime-contract test:

```js
const RED = {
  nodes: {
    createNode() {},
    registerType() {},
  },
}
```

This can be useful in a tiny isolated unit test only when the test explicitly does not claim to validate Node-RED integration. It must not replace helper-based coverage of registration, flow messaging, credentials, config nodes, or lifecycle semantics.

## Assertion failures inside flow callbacks

Node-RED catches exceptions inside flow execution. If a runner assertion throws inside an `input` callback and the test does not forward that failure, the test can hang until timeout.

Use a Promise or the runner's completion callback and explicitly reject/fail it:

```js
await new Promise((resolve, reject) => {
  output.on("input", (msg) => {
    try {
      assertMessage(msg)
      resolve()
    } catch (error) {
      reject(error)
    }
  })

  input.receive({ payload: "test" })
})
```

If the project uses a runner helper such as `expect(...).resolves`, `done`, or another mechanism, follow that runner's active testing material. The Node-RED invariant is that failure must leave the flow callback and reach the runner.

## Avoid sleeps

Bad:

```js
input.receive(msg)
await sleep(500)
expect(output).toHaveBeenCalled()
```

Prefer the actual output event, status/error event, connection Promise, close completion, or bounded polling when the external API offers no event.

A timeout can still bound a test globally; it should not be the signal that the expected behavior completed.

## Teardown matrix

After each suite/test, clean what it owns:

| Resource | Owner of teardown |
| --- | --- |
| Loaded Node-RED flow | `helper.unload()` |
| Helper HTTP server | helper stop-server API |
| Test-runner mocks/spies | active runner testing skill |
| Fake timers | active runner testing skill |
| Environment overrides | test setup that changed them |
| External container/service | E2E/integration owner |
| Node-owned production client | production `close` handler, observed by the Node-RED test |
| Config-node shared client | config-node `close` handler, observed by the Node-RED test |

Do not rely on process exit to hide leaked listeners/timers.

## Runtime settings isolation

If tests change helper/runtime settings:

- scope the setting to the suite/test that needs it;
- restore defaults or establish a fresh helper state before unrelated tests;
- avoid mutable module-level fixtures shared across parallel tests;
- reserve unique ports/IDs when the runner can execute Node-RED suites concurrently.

## Browser boundary

`node-red-node-test-helper` exercises the runtime; it is not a substitute for the real editor DOM and editor widget lifecycle.

Use browser/UI tests only when behavior depends on actual rendering or interaction, for example:

- dynamic TypedInput behavior;
- edit-dialog conditional fields;
- custom editor widgets;
- keyboard/focus/accessibility behavior;
- loading editor resources in a real editor page.

Static consistency of type names, templates, defaults, and package artifacts can still be reviewed/tested without browser automation.

## E2E boundary

Escalate to project E2E only when the risk depends on installation/process/dependency integration that the helper intentionally abstracts away, such as:

```text
npm-packed contrib module
        |
        v
separate Node-RED process
        |
        +--> real broker/database/API
        |
        +--> deployed flow
```

Keep the helper suite fast and deterministic even when a smaller number of E2E scenarios also exist.
