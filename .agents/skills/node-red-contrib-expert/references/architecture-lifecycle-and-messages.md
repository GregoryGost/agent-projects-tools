# TypeScript Node-RED contrib architecture, lifecycle, and messages

## Adapter boundary

Keep Node-RED-specific orchestration at the edge and reusable logic behind an ordinary TypeScript module/service boundary.

The examples below use module-format-neutral type queries. Export the initializer according to the project's declared emitted JavaScript module format rather than copying a CommonJS or ESM export blindly.

Good:

```ts
type Node = import("node-red").Node
type NodeAPI = import("node-red").NodeAPI
type NodeDef = import("node-red").NodeDef
type NodeInitializer = import("node-red").NodeInitializer
type NodeMessage = import("node-red").NodeMessage

interface TransformNodeDef extends NodeDef {
  mode: "lower" | "upper"
}

type TransformNode = Node

function readStringPayload(msg: NodeMessage): string {
  if (typeof msg.payload !== "string") {
    throw new TypeError("msg.payload must be a string")
  }
  return msg.payload
}

const initializer: NodeInitializer = (RED: NodeAPI) => {
  function TransformNodeConstructor(
    this: TransformNode,
    config: TransformNodeDef,
  ): void {
    RED.nodes.createNode(this, config)
    const node = this
    const transform = createTransform(config.mode)

    node.on("input", async (msg: NodeMessage, send, done) => {
      try {
        const payload = readStringPayload(msg)
        msg.payload = await transform(payload)
        send(msg)
        done?.()
      } catch (error: unknown) {
        const normalized =
          error instanceof Error ? error : new Error(String(error))
        if (done) done(normalized)
        else node.error(normalized, msg)
      }
    })
  }

  RED.nodes.registerType("example-transform", TransformNodeConstructor)
}

// Export `initializer` using the project's declared CJS/ESM strategy.
```

The Node-RED adapter owns framework semantics; `createTransform` remains ordinary TypeScript and can be tested independently.

Bad:

```ts
class EntireApplication {
  // Domain logic, network policy, editor assumptions, flow parsing,
  // Node-RED lifecycle, persistence, and untyped runtime values all mix here.
}
```

Do not select functions versus classes merely to satisfy a framework example. Follow `typescript-core` for framework-neutral modeling while preserving Node-RED's constructor/registration contract.

## Message contract

Treat `NodeMessage` as the framework base type and narrow node-specific properties at runtime when the flow contract does not guarantee their shape.

When a node receives a message:

- preserve the received object when the output is a continuation of that message;
- validate properties before assuming string/object/buffer shape;
- use narrow message-extension interfaces only after their invariants are established;
- document properties added, removed, or changed;
- preserve correlation metadata such as `_msgid` by reusing the message where appropriate;
- use the input handler's `send` callback for work correlated with an incoming message on runtimes that support it;
- call `done()` exactly once on successful completion and `done(error)` exactly once on handled failure when available.

For multiple outputs:

```ts
send([successMsg, null])
send([null, errorMsg])
```

For multiple messages to one output, use the nested-array form defined by Node-RED rather than inventing batching semantics.

Avoid creating a new message object only to replace `payload`:

```ts
// Bad when this is just a transformation of the incoming message.
send({ payload: mappedValue })
```

A type assertion is not validation:

```ts
// Bad when payload is not already guaranteed by the flow contract.
const payload = (msg as { payload: string }).payload
```

Prefer explicit narrowing:

```ts
if (typeof msg.payload !== "string") {
  throw new TypeError("msg.payload must be a string")
}
```

## Error handling

Node-RED flow errors are part of the flow contract. TypeScript's `unknown` catch boundary should not be weakened just to call a Node-RED API.

```ts
node.on("input", async (msg: NodeMessage, send, done) => {
  try {
    await service.handle(msg)
    done?.()
  } catch (error: unknown) {
    const normalized = error instanceof Error ? error : new Error(String(error))
    if (done) done(normalized)
    else node.error(normalized, msg)
  }
})
```

Do not rely on `status({ fill: "red", ... })` instead of reporting an error. Status communicates operational state; Catch/error handling is a separate contract.

Register error handlers for typed clients, streams, EventEmitters, and libraries that can emit failures outside the input Promise chain.

## Lifecycle ownership

Inventory stateful resources during review:

| Resource | Typical owner | Required cleanup |
| --- | --- | --- |
| Per-node timer/interval | runtime node | clear on `close` |
| Per-node listener/watcher | runtime node | remove/unsubscribe on `close` |
| Per-node socket/client | runtime node | disconnect/close on `close` |
| Shared broker/API client | config node | disconnect when config node closes |
| Editor text/code widget | editor dialog instance | destroy on save/cancel as applicable |

Prefer the contextual `close` listener type supplied by the verified Node-RED declarations:

```ts
node.on("close", async (removed, done) => {
  try {
    await client.close()
  } catch (error: unknown) {
    const normalized =
      error instanceof Error ? error : new Error(String(error))
    node.error(normalized)
  } finally {
    done()
  }
})
```

The asynchronous `close` completion callback is a completion signal, not the input-handler `done(err?)` contract. Do not pass an error argument to the close callback merely because the input callback accepts one.

If cleanup failure needs stronger handling than logging/reporting, follow the verified Node-RED version and project shutdown policy; do not invent an unsupported callback signature. Cleanup should still avoid leaving the flow shutdown hanging.

Cleanup should be safe after partial startup and should not leave timers/listeners that keep the process alive.

## Config nodes

Use a config node when several runtime nodes intentionally share durable configuration or a costly connection.

`RED.nodes.getNode()` crosses a runtime boundary. Narrow the returned value before using custom methods/state rather than applying an unchecked cast.

```ts
const server = RED.nodes.getNode(config.server)
if (!isServerNode(server)) {
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
- type retrieved context values according to project policy and still handle missing/unknown stored data safely;
- do not assume config nodes always have meaningful flow context because config nodes are global by default;
- treat context-store async behavior according to the project's configured store and applicable Node-RED API.

## Status

Use status for concise operational state such as connecting, connected, disconnected, rate-limited, or failed. Keep text short and stable enough to remain useful in the editor.

Avoid high-frequency status churn on every normal message when it adds no operational value.
