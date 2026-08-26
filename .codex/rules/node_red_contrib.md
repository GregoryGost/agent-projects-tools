# Node-RED contrib rules

Apply this rule only when `CODEX_PROJECT.md` declares the `node-red-contrib` active stack profile or when the file is being maintained directly in the `agent-projects-tools` template repository.

## Required skills

Use together with:

- `node-red-contrib-expert`.

## Source of truth and version boundary

Before changing a Node-RED node module:

1. Read `CODEX_PROJECT.md` in a target project.
2. Inspect `package.json`, the lockfile, `node-red` metadata, Node.js `engines`, build scripts, `tsconfig*` when present, and the existing runtime/editor artifacts.
3. Determine the supported Node-RED range from `package.json -> node-red.version` or another project-declared source and the actual development/runtime version from project evidence.
4. Treat Node-RED major-version behavior as version-sensitive. Do not silently apply current-runtime behavior to an older supported range.
5. Determine the module format from project evidence. Node-RED 5 introduced support for installing ESM node modules; do not assume ESM support for older targets and do not migrate CommonJS/ESM format unless the task requires it.
6. Use only project-declared build, test, lint, package, and validation commands.

Do not copy historical version statements from tutorial pages into project constraints. Prefer the release plan, changelog, package metadata, and applicable version-specific documentation.

## Package and artifact contract

- `package.json -> node-red.nodes` must point to runtime artifacts that actually exist after the project build and are included in the published package.
- When TypeScript is the authoring language, treat generated JavaScript as a runtime artifact and verify the source-to-build-to-package path explicitly.
- Do not infer a runtime node type solely from a `node-red.nodes` map key. Verify the type strings registered by the runtime and editor artifacts.
- Keep `package.json -> node-red.version` aligned with the Node-RED versions the module is intentionally tested and documented to support.
- Runtime dependencies required after installation belong in `dependencies`; build/test-only tooling belongs in the project-declared development dependency boundary.
- Preserve package naming, examples, icons, locale files, `resources/`, README, license, and publish-file policies used by the project.
- Do not change package discoverability or publishing metadata as a side effect of unrelated implementation work.

## Runtime and editor contract

For each node type:

- runtime registration and editor registration must use the same node type string;
- `data-template-name` and `data-help-name` must target the corresponding editor node type when those templates are present;
- `RED.nodes.createNode(this, config)` must initialize a runtime node before node-specific behavior uses Node-RED node APIs;
- editor `defaults`, `credentials`, inputs/outputs, validators, edit-template controls, and runtime configuration reads must remain compatible;
- ordinary property controls use `node-input-<property>` and configuration-node controls use `node-config-input-<property>` unless an applicable Node-RED API explicitly requires another pattern;
- editor lifecycle hooks must clean up editor instances, event handlers, and temporary state they create.

Do not place business logic in the editor artifact. Keep editor behavior focused on configuration, validation, preview, and documented editor integration.

## Message handling and errors

- Treat `msg` as an integration boundary. Validate or narrow message properties before using them when their shape is not guaranteed by the flow contract.
- When handling an input message, preserve the received `msg` unless creating a new message is part of the node's documented semantics.
- Use the `send` callback supplied to the `input` handler for message-correlated sends on supported runtimes; preserve project compatibility policy for older targets when relevant.
- Call `done()` when input handling completes and `done(err)` for handled failures when the supported runtime provides it.
- Never allow asynchronous callback, Promise, EventEmitter, stream, or client errors to escape uncaught and destabilize the flow runtime.
- Keep multi-output and multi-message ordering explicit and compatible with Node-RED `send` semantics.
- Do not use node status as the only error-reporting mechanism. Status is operational feedback, not a replacement for error handling.

## Lifecycle and shared resources

- Every timer, interval, listener, subscription, socket, client, watcher, or other resource owned by a node instance must have an explicit shutdown path.
- Use the Node-RED `close` lifecycle for runtime cleanup and complete asynchronous shutdown before invoking the close callback.
- Distinguish removal from restart when behavior legitimately depends on the `removed` flag supported by the target Node-RED range.
- Prefer a configuration node to own a connection or other shareable resource when multiple runtime nodes intentionally share the same configuration/lifecycle.
- A consuming node must handle a missing or invalid configuration-node reference safely.
- Avoid reconnecting expensive shared clients per message when the lifecycle can be owned by the node or a config node.

## Credentials, HTTP endpoints, and resources

- Store passwords, tokens, private keys, and comparable secrets through Node-RED credentials or another project-approved secret boundary, not ordinary exported node properties.
- Keep editor and runtime credential definitions aligned. Do not assume password credentials are readable back by editor code.
- Use `RED.httpAdmin` for editor/admin integration and `RED.httpNode` for runtime HTTP endpoints; do not interchange them casually.
- Protect custom admin endpoints with the appropriate Node-RED permission middleware unless the applicable documented flow intentionally requires a different authentication boundary.
- Prefer the top-level `resources/` mechanism for static editor assets instead of creating custom admin endpoints only to serve static files.
- Load editor resources with Node-RED-compatible relative URLs so non-root editor deployments continue to work.
- Do not expose secret material through node status, logs, help text, editor resources, HTTP responses, or exported flows.

## Optional coordination

- Use `typescript-core` when TypeScript is active for authoring, public types, refactoring, and type-safe boundaries.
- Use `typescript-jest-testing` only for framework-neutral Jest tests of TypeScript logic when that profile is active.
- Use `node-red-contrib-testing` for Node-RED runtime/component tests when its separate testing profile is active.
- Use formatting/linting, UI/browser validation, security, or E2E overlays only when they are independently active and relevant.

## Review checklist

- [ ] Supported Node-RED and Node.js versions came from current project evidence.
- [ ] Module format and build output were verified rather than assumed.
- [ ] `node-red.nodes` points to published runtime artifacts.
- [ ] Runtime/editor/template/help type identifiers are consistent.
- [ ] Defaults, credentials, config-node references, inputs, and outputs stay aligned.
- [ ] Input handling preserves `msg`, completion, error, and multi-output semantics.
- [ ] Runtime and editor lifecycle resources are cleaned up.
- [ ] Shared connections have one explicit lifecycle owner.
- [ ] Admin/runtime HTTP endpoints use the correct boundary and permissions.
- [ ] Static editor resources use the supported resource mechanism when applicable.
- [ ] Generic TypeScript/testing/style concerns were delegated to their active overlays rather than duplicated here.
