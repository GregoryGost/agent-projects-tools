# TypeScript Node-RED contrib review checklist

## Activation and versions

- [ ] `node-red-contrib` is active in the target project.
- [ ] `typescript-core` and `.codex/rules/typescript_core.md` are active and dependency-valid.
- [ ] Runtime implementation source is TypeScript rather than handwritten JavaScript.
- [ ] TypeScript version and config paths come from project evidence.
- [ ] Node-RED declaration source/version is known and is not treated as runtime-version evidence.
- [ ] Node-RED supported range is explicit and comes from project/package evidence.
- [ ] Development/test Node-RED version is known.
- [ ] Node.js runtime constraint is known.
- [ ] Emitted CommonJS/ESM strategy is verified from the project.

## TypeScript source and build contract

- [ ] Runtime `.ts` is the editable source of truth.
- [ ] Generated runtime `.js` is reproducible from committed TypeScript source and is not hand-maintained in parallel.
- [ ] Type checking and Node-RED runtime validation are both preserved as separate checks.
- [ ] Node-RED framework boundaries use the project-declared declarations rather than broad `any`.
- [ ] Declaration mismatches use bounded project-approved augmentation/workarounds rather than global type weakening.
- [ ] Config, node instance, message, credential, and integration types remain distinct and narrow.
- [ ] Runtime data is narrowed/validated where static typing alone cannot establish the flow contract.

## Package contract

- [ ] Every `node-red.nodes` entry resolves to an installed/published emitted JavaScript runtime artifact.
- [ ] Each registered JavaScript artifact traces back to the intended TypeScript source.
- [ ] Runtime JavaScript and editor HTML pairing survives the build/package step.
- [ ] Build cleanup and npm file filtering do not remove editor HTML, resources, icons, locales, or examples.
- [ ] Runtime dependencies are declared in the correct dependency boundary; TypeScript/declaration/build tooling remains development-only unless genuinely needed at runtime.
- [ ] Node-RED support range is not widened without compatibility evidence.

## Node type contract

- [ ] Runtime `registerType` and editor `registerType` type strings match.
- [ ] Edit-template and help-template names match the intended node type.
- [ ] Renames update flows/migration compatibility intentionally rather than accidentally breaking existing flow JSON.
- [ ] Inputs/outputs and labels match runtime behavior.

## Properties and credentials

- [ ] Typed runtime config matches editor `defaults`, edit-template controls, and runtime reads.
- [ ] Required fields and validators match the real runtime requirements.
- [ ] Config-node references declare/narrow the correct config-node type.
- [ ] Secrets use credentials or a stricter project-approved secret source.
- [ ] Runtime credential types stay aligned with editor credential definitions.
- [ ] Password credentials are not expected to round-trip visibly through the editor.

## Runtime behavior

- [ ] `RED.nodes.createNode` initializes each runtime node before Node-RED APIs are used.
- [ ] Incoming messages are narrowed/validated where needed.
- [ ] Transform nodes preserve incoming message metadata unless replacement is intentional.
- [ ] `send`/`done` behavior is correct for the supported runtime range.
- [ ] Caught `unknown` errors are narrowed before APIs require a concrete shape.
- [ ] Errors reach Catch/error handling rather than escaping or being represented only as status.
- [ ] Multiple outputs/messages preserve documented ordering and null-slot semantics.

## Lifecycle

- [ ] Every timer, listener, subscription, watcher, socket, and client has one owner.
- [ ] Node-owned resources close on `close`.
- [ ] Shared resources close in the config node rather than in each consumer.
- [ ] Cleanup handles partial startup and repeated/late shutdown safely.
- [ ] Editor-created widgets/listeners are destroyed or removed at the corresponding editor lifecycle boundary.

## HTTP and resources

- [ ] Admin/editor routes use `RED.httpAdmin`; runtime HTTP routes use `RED.httpNode`.
- [ ] Admin routes use appropriate permission middleware where applicable.
- [ ] Request data is validated and secret values are not returned/logged.
- [ ] Static editor assets use `resources/` when appropriate.
- [ ] Resource URLs are relative and preserve scoped package names.

## Separation of concerns

- [ ] Framework-neutral TypeScript/business logic is not unnecessarily coupled to Node-RED APIs.
- [ ] Generic TypeScript/Jest testing is not duplicated in Node-RED-specific tests.
- [ ] Browser editor testing and separate-process E2E remain optional overlays.
- [ ] JavaScript-only Node-RED projects are not silently treated as compatible with this TypeScript profile.
