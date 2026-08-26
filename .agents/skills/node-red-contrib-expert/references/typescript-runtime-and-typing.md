# TypeScript runtime and typing for Node-RED contrib nodes

## Portable standard

This profile assumes runtime node implementation is authored in TypeScript and emitted to JavaScript before Node-RED loads it.

```text
src/nodes/example.ts
        |
        | type check + build
        v
dist/nodes/example.js
        |
        +-> package.json -> node-red.nodes
```

Do not treat the emitted JavaScript as a second implementation. If behavior changes, change the TypeScript source and rebuild.

## Declaration source

The target project must declare where Node-RED TypeScript types come from.

A common source is DefinitelyTyped's `@types/node-red`, which exposes shortcuts including:

- `NodeInitializer`;
- `NodeAPI`;
- `NodeDef`;
- `Node`;
- `NodeMessage`;
- credential types;
- editor-side types such as `EditorRED` and `EditorNodeDef`.

`@types/node-red` is not the Node-RED runtime and its package version does not track the Node-RED major version. Treat these as separate compatibility questions:

1. Which Node-RED runtime versions does the package support?
2. Which Node.js versions do those runtimes support?
3. Which TypeScript compiler/version does the project use?
4. Which declaration package or project declarations provide the APIs used by the code?
5. Do those declarations actually model the verified runtime API used by the project?

Do not widen code to `any` merely because declaration packages lag a runtime feature. Prefer a narrow local module augmentation or another project-approved declaration fix scoped to the verified API difference.

## Runtime initializer pattern

Use the exact import/module syntax required by the project's module format and TypeScript configuration. The important part is the typed boundary, not one universal import spelling.

Conceptual CommonJS-oriented example with the common DefinitelyTyped declarations:

```ts
import type {
  Node,
  NodeAPI,
  NodeDef,
  NodeInitializer,
  NodeMessage,
} from "node-red"

interface TransformNodeDef extends NodeDef {
  name: string
  mode: "lower" | "upper"
}

interface TransformNode extends Node {}

interface TransformMessage extends NodeMessage {
  payload: string
}

const initializer: NodeInitializer = (RED: NodeAPI) => {
  function TransformNodeConstructor(
    this: TransformNode,
    config: TransformNodeDef,
  ): void {
    RED.nodes.createNode(this, config)
    const node = this

    node.on("input", (msg, send, done) => {
      try {
        const input = msg as TransformMessage
        input.payload =
          config.mode === "lower"
            ? input.payload.toLowerCase()
            : input.payload.toUpperCase()
        send(input)
        done?.()
      } catch (error: unknown) {
        if (done) {
          done(error instanceof Error ? error : new Error(String(error)))
        } else {
          node.error(error instanceof Error ? error : String(error), msg)
        }
      }
    })
  }

  RED.nodes.registerType("example-transform", TransformNodeConstructor)
}

export = initializer
```

This is a structural example, not a requirement to use CommonJS. For an ESM build supported by the target Node-RED version, use the project-declared ESM export shape and verify it against the applicable Node-RED loading behavior.

## Do not cast before validation

The previous example uses a cast only to illustrate the type locations. For untrusted or optional message properties, prefer real narrowing before use.

Good:

```ts
function readStringPayload(msg: NodeMessage): string {
  if (typeof msg.payload !== "string") {
    throw new TypeError("msg.payload must be a string")
  }
  return msg.payload
}
```

Bad:

```ts
const payload = (msg as { payload: string }).payload
```

A TypeScript assertion does not validate a flow message at runtime.

## Node definition and instance types

Keep these concepts separate:

- `NodeDef` extension: persisted/configuration properties supplied by the flow;
- `Node` extension: runtime node instance state and typed credentials where applicable;
- `NodeMessage` extension: message properties this node consumes or emits;
- service/domain types: framework-neutral application logic outside the Node-RED adapter.

Do not put runtime clients, sockets, timers, or calculated state into the persisted `NodeDef` interface just because they are used by the same constructor.

## Credentials

Model credentials independently from ordinary config.

Conceptually:

```ts
interface ApiCredentials {
  token: string
}

interface ApiNode extends Node<ApiCredentials> {}

interface ApiNodeDef extends NodeDef {
  endpoint: string
}
```

Keep the runtime credential type aligned with the editor credential definition and do not duplicate secret fields in `NodeDef`.

Never log a typed credential merely because TypeScript makes it easy to access.

## Config nodes

When a node references a config node, do not assume `RED.nodes.getNode()` returned the expected custom type.

Prefer a local type guard or another verified narrowing strategy around the config-node contract.

```ts
interface ServerNode extends Node {
  request(input: string): Promise<string>
}

function isServerNode(value: unknown): value is ServerNode {
  return (
    typeof value === "object" &&
    value !== null &&
    "request" in value &&
    typeof (value as { request?: unknown }).request === "function"
  )
}
```

Then handle the missing/invalid reference explicitly before processing messages.

## Framework-neutral logic

Prefer:

```text
Node-RED adapter (typed RED/config/msg/lifecycle)
        |
        v
framework-neutral TypeScript service/domain code
```

The adapter should translate Node-RED input into ordinary typed inputs, invoke reusable logic, then translate the result back into Node-RED message/status/error semantics.

This lets generic logic remain covered by the active framework-neutral TypeScript testing material while Node-RED runtime behavior is covered by `node-red-contrib-testing`.

## Generated artifacts

Review generated JavaScript when build/package behavior changes, but do not hand-maintain it in parallel with TypeScript source.

Check that:

- sourcemaps point to the intended source tree when published;
- declarations are emitted only when they are part of the package contract;
- internal `.d.ts` output does not accidentally become a public API;
- clean builds remove stale runtime artifacts;
- all runtime `.js` files referenced by `node-red.nodes` are reproducible from committed TypeScript source;
- matching editor `.html`, icons, locales, and resources survive the same package build.

## Review anti-patterns

Avoid:

- editing generated `.js` instead of `.ts`;
- `RED: any`, `config: any`, `msg: any`, or untyped credentials by default;
- copying Node-RED declaration interfaces into the project without a compatibility reason;
- using `as SomeMessage` as runtime validation;
- mixing persisted config and runtime-only state in one interface;
- treating a passing `tsc` build as proof the node will load in Node-RED;
- treating a passing Node-RED runtime test as replacement for project type checking;
- assuming declaration-package semver equals Node-RED runtime semver.
