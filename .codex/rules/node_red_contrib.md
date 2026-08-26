# TypeScript Node-RED contrib rules

Apply this rule only when `CODEX_PROJECT.md` declares the `node-red-contrib` active stack profile or when the file is being maintained directly in the `agent-projects-tools` template repository.

The portable standard for this profile is **TypeScript-authored Node-RED custom/contrib node modules**. JavaScript-only node modules require separate project-specific materials and must not activate this profile by changing only a placeholder value.

## Required skills

Use together with:

- `typescript-core`;
- `node-red-contrib-expert`.

Required base rule:

- `.codex/rules/typescript_core.md`.

## Source of truth and version boundary

Before changing a Node-RED node module:

1. Read `CODEX_PROJECT.md` in a target project.
2. Inspect `package.json`, the lockfile, `node-red` metadata, Node.js `engines`, TypeScript version/configuration, build scripts, runtime source files, generated runtime artifacts, editor HTML/resources, and existing tests.
3. Confirm that runtime authoring is TypeScript and identify the project-declared Node-RED type-definition source.
4. Determine the supported Node-RED range from `package.json -> node-red.version` or another project-declared source and the actual development/test runtime version from project evidence.
5. Treat Node-RED major-version behavior as version-sensitive. Do not silently apply current-runtime behavior to an older supported range.
6. Determine the emitted JavaScript module format from project evidence. Node-RED 5 introduced support for installing ESM node modules; do not assume ESM support for older targets and do not migrate CommonJS/ESM format unless the task requires it.
7. Use only project-declared build, type-check, test, lint, package, and validation commands.

Do not copy historical version statements from tutorial pages into project constraints. Prefer the release plan, changelog, package metadata, applicable version-specific documentation, and current Node-RED Node.js support guidance when project metadata alone does not establish compatibility.

## TypeScript source contract

- Runtime implementation source is TypeScript. Treat `.ts` files as the editable source of truth and emitted `.js` files as Node-RED runtime artifacts.
- Do not implement or fix runtime behavior directly in generated JavaScript when a TypeScript source file owns that artifact. Change the TypeScript source and regenerate through the project-declared build.
- Keep TypeScript checking separate from Node-RED runtime loading: successful JavaScript emission does not prove Node-RED contract correctness, and successful Node-RED loading does not replace type checking.
- Use the active `typescript-core` rule/skill for generic language structure, narrowing, async/error handling, classes/functions, exported contracts, and avoidance of unjustified `any`.
- Type Node-RED framework boundaries explicitly using the project-declared declaration source. Prefer established Node-RED types such as `NodeAPI`, `NodeInitializer`, `NodeDef`, `Node`, `NodeMessage`, credential types, and editor types when that declaration source provides them.
- Keep node-specific configuration, credentials, and message extensions as narrow project types rather than broad casts.
- Do not duplicate or locally redefine Node-RED framework types merely to bypass a type error. If declarations do not match the verified runtime API, establish a bounded declaration augmentation or another project-approved compatibility fix.
- Do not infer Node-RED runtime compatibility from an `@types/*` version. DefinitelyTyped declarations and the Node-RED runtime have independent release/version histories; verify APIs against the actual supported Node-RED range.

## Package and artifact contract

- `package.json -> node-red.nodes` must point to emitted JavaScript runtime artifacts that actually exist after the project build and are included in the published package.
- Preserve the source-to-build-to-package traceability from each TypeScript runtime entrypoint to its emitted JavaScript node-set artifact.
- Preserve the Node-RED runtime/editor node-set pairing through build and package processing: the editor HTML companion for a runtime node artifact must be present where Node-RED resolves it for that node set.
- Do not infer a runtime node type solely from a `node-red.nodes` map key. Verify the type strings registered by the runtime and editor artifacts.
- Keep `package.json -> node-red.version` aligned with the Node-RED versions the module is intentionally tested and documented to support.
- Runtime dependencies required after installation belong in `dependencies`; TypeScript, declaration packages, build/test tooling, and other development-only tooling belong in the project-declared development dependency boundary unless they are genuinely required at runtime.
- Preserve package naming, examples, icons, locale files, `resources/`, README, license, and publish-file policies used by the project.
- Do not change package discoverability or publishing metadata as a side effect of unrelated implementation work.

## Runtime and editor contract

For each node type:

- runtime registration and editor registration must use the same node type string;
- `data-template-name` and `data-help-name` must target the corresponding editor node type when those templates are present;
- `RED.nodes.createNode(this, config)` must initialize a runtime node before node-specific behavior uses Node-RED node APIs;
- the runtime constructor's `this`, config, credentials, and message boundaries must remain type-safe and compatible with the Node-RED declaration source;
- editor `defaults`, `credentials`, inputs/outputs, validators, edit-template controls, and runtime configuration reads must remain compatible;
- ordinary property controls use `node-input-<property>` and configuration-node controls use `node-config-input-<property>` unless an applicable Node-RED API explicitly requires another pattern;
- editor lifecycle hooks must clean up editor instances, event handlers, and temporary state they create.

Do not place business logic in the editor artifact. Keep editor behavior focused on configuration, validation, preview, and documented editor integration.

## Message handling and errors

- Treat `msg` as a typed integration boundary. Narrow or validate node-specific message properties before using them when their shape is not guaranteed by the flow contract.
- When handling an input message, preserve the received `msg` unless creating a new message is part of the node's documented semantics.
- Use the `send` callback supplied to the `input` handler for message-correlated sends on supported runtimes; preserve project compatibility policy for older targets when relevant.
- Call `done()` when input handling completes and `done(err)` for handled failures when the supported runtime provides it.
- Narrow caught `unknown` errors according to `typescript-core` before passing/logging data that requires a specific shape.
- Never allow asynchronous callback, Promise, EventEmitter, stream, or client errors to escape uncaught and destabilize the flow runtime.
- Keep multi-output and multi-message ordering explicit and compatible with Node-RED `send` semantics.
- Do not use node status as the only error-reporting mechanism. Status is operational feedback, not a replacement for error handling.

## Lifecycle and shared resources

- Every timer, interval, listener, subscription, socket, client, watcher, or other resource owned by a node instance must have an explicit shutdown path.
- Use the Node-RED `close` lifecycle for runtime cleanup and complete asynchronous shutdown before invoking the close callback.
- Distinguish removal from restart when behavior legitimately depends on the `removed` flag supported by the target Node-RED range.
- Prefer a configuration node to own a connection or other shareable resource when multiple runtime nodes intentionally share the same configuration/lifecycle.
- A consuming node must type and handle a missing or invalid configuration-node reference safely.
- Avoid reconnecting expensive shared clients per message when the lifecycle can be owned by the node or a config node.

## Credentials, HTTP endpoints, and resources

- Store passwords, tokens, private keys, and comparable secrets through Node-RED credentials or another project-approved secret boundary, not ordinary exported node properties.
- Keep typed credential declarations, editor credential definitions, and runtime credential access aligned. Do not assume password credentials are readable back by editor code.
- Use `RED.httpAdmin` for editor/admin integration and `RED.httpNode` for runtime HTTP endpoints; do not interchange them casually.
- Protect custom admin endpoints with the appropriate Node-RED permission middleware unless the applicable documented flow intentionally requires a different authentication boundary.
- Prefer the top-level `resources/` mechanism for static editor assets instead of creating custom admin endpoints only to serve static files.
- Load editor resources with Node-RED-compatible relative URLs so non-root editor deployments continue to work.
- Do not expose secret material through node status, logs, help text, editor resources, HTTP responses, or exported flows.

## Optional coordination

- Use `typescript-jest-testing` only for framework-neutral Jest tests of TypeScript logic when that profile is independently active.
- Use `node-red-contrib-testing` for TypeScript-authored Node-RED runtime/component tests when its separate testing profile is active.
- Use formatting/linting, UI/browser validation, security, or E2E overlays only when they are independently active and relevant.

## Review checklist

- [ ] `typescript-core` and `.codex/rules/typescript_core.md` are active and dependency-valid.
- [ ] Runtime implementation is authored in TypeScript; generated JavaScript was not edited as source.
- [ ] TypeScript version/configuration and Node-RED declaration source came from project evidence.
- [ ] Node-RED declaration-package versions were not treated as runtime-version evidence.
- [ ] Supported Node-RED and Node.js versions came from current project evidence plus applicable official compatibility sources where needed.
- [ ] Emitted JavaScript module format and build output were verified rather than assumed.
- [ ] `node-red.nodes` points to published JavaScript runtime artifacts produced from TypeScript source.
- [ ] Runtime/editor node-set artifact pairing survives the build/package step.
- [ ] Runtime/editor/template/help type identifiers are consistent.
- [ ] Config, credential, message, node-instance, and integration boundaries remain type-safe without unjustified `any`/casts.
- [ ] Input handling preserves `msg`, completion, error, and multi-output semantics.
- [ ] Runtime and editor lifecycle resources are cleaned up.
- [ ] Shared connections have one explicit lifecycle owner.
- [ ] Admin/runtime HTTP endpoints use the correct boundary and permissions.
- [ ] Static editor resources use the supported resource mechanism when applicable.
- [ ] Generic TypeScript/testing/style concerns are delegated rather than duplicated here.
