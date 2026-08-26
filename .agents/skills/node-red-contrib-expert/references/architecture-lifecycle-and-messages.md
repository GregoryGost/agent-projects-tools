# Node-RED contrib architecture, lifecycle, and messages

## Adapter boundary

Keep Node-RED-specific orchestration at the edge and reusable logic behind an ordinary module/service boundary.

Good:

```js
module.exports = function registerNodes(RED) {
  function TransformNode(config) {
    RED.nodes.createNode(this, config)
    const node = this
    const transform = createTransform(config)

    node.on("input", async (msg, send, done) => {
      try {
        msg.payload = await transform(msg.payload)
        send(msg)
        done?.()
      } catch (error) {
        if (done) done(error)
        else node.error(error, msg)
      }
    })
  }

  RED.nodes.registerType("example-transform", TransformNode)
}
```

The Node-RED adapter owns runtime semantics; `createTransform` can be tested independently.

Bad:

```js
class EntireApplication {
  // Domain logic, network policy, editor assumptions, flow parsing,
  // Node-RED lifecycle, and persistence are all mixed here.
}
```

Do not select functions versus classes merely to satisfy a framework example. Follow the active language skill for framework-neutral modeling, while preserving the constructor/registration contract expected by Node-RED.

## Message contract

When a node receives a message:

- preserve the received object when the output is a continuation of that message;
- validate properties before assuming string/object/buffer shape;
- document properties added, removed, or changed;
- preserve correlation metadata such as `_msgid` by reusing the message where appropriate;
- use the input handler's `send` callback for work correlated with an incoming message on runtimes that support it;
- call `done()` exactly once on successful completion and `done(error)` exactly once on handled failure when available.

For multiple outputs:

```js
send([successMsg, null])
send([null, errorMsg])
```

For multiple messages to one output, use the nested-array form defined by Node-RED rather than inventing batching semantics.

Avoid creating a new message object only to replace `payload`:

```js
// Bad when this is just a transformation of the incoming message.
send({ payload: mappedValue })
```

## Error handling

Node-RED flow errors are part of the flow contract.

Good:

```js
node.on("input", async (msg, send, done) => {
  try {
    await service.handle(msg)
    done?.()
  } catch (error) {
    if (done) done(error)
    else node.error(error, msg)
  }
})
```

Do not rely on `status({ fill: "red", ... })` instead of reporting an error. Status communicates operational state; Catch/error handling is a separate contract.

Register error handlers for clients, streams, EventEmitters, and libraries that can emit failures outside the input Promise chain.

## Lifecycle ownership

Inventory stateful resources during review:

| Resource | Typical owner | Required cleanup |
| --- | --- | --- |
| Per-node timer/interval | runtime node | clear on `close` |
| Per-node listener/watcher | runtime node | remove/unsubscribe on `close` |
| Per-node socket/client | runtime node | disconnect/close on `close` |
| Shared broker/API client | config node | disconnect when config node closes |
| Editor text/code widget | editor dialog instance | destroy on save/cancel as applicable |

Good async close:

```js
node.on("close", async (removed, done) => {
  try {
    await client.close()
    done()
  } catch (error) {
    done(error)
  }
})
```

Adapt the exact signature to the supported Node-RED range and project style. Cleanup should be safe after partial startup and should not leave timers/listeners that keep the process alive.

## Config nodes

Use a config node when several runtime nodes intentionally share durable configuration or a costly connection.

A consuming node should resolve and validate the reference:

```js
const server = RED.nodes.getNode(config.server)
if (!server) {
  node.status({ fill: "red", shape: "ring", text: "missing config" })
  return
}
```

Do not automatically create a config node for every object. Stateless helpers and per-node state should remain local when sharing would add coupling without a lifecycle benefit.

The config node owns its shared resource and its `close` path. Consumers must not independently close a client they do not own.

## Context

Node/flow/global context is a persistence-like boundary, not a substitute for ordinary local variables.

- use node context for state that must survive individual messages within the node lifecycle;
- use flow/global context only when cross-node scope is intentional;
- do not assume config nodes always have meaningful flow context because config nodes are global by default;
- treat context-store async behavior according to the project's configured store and applicable Node-RED API.

## Status

Use status for concise operational state such as connecting, connected, disconnected, rate-limited, or failed. Keep text short and stable enough to remain useful in the editor.

Avoid high-frequency status churn on every normal message when it adds no operational value.
