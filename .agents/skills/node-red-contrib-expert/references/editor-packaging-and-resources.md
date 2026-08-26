# Node-RED editor, packaging, and resources

## Three-way editor/runtime contract

A typical node type is represented by runtime code, editor registration, and editor templates/help.

```text
runtime: RED.nodes.registerType("sample", RuntimeConstructor)
editor:  RED.nodes.registerType("sample", editorDefinition)
template: data-template-name="sample"
help:     data-help-name="sample"
```

Treat these identifiers as one contract during renames and refactors.

`package.json -> node-red.nodes` identifies runtime files/node sets to load. A single runtime file may register multiple node types, so do not assume the map key is identical to every type registered by that file.

For an ordinary Node-RED node set, the runtime JavaScript artifact and its editor HTML companion must remain a matching pair after build/package processing. When TypeScript is compiled into another directory, copy/package the companion HTML into the matching runtime-artifact location rather than leaving the editor artifact behind in the source tree.

## Properties and editor controls

For an ordinary property `host`:

```js
defaults: {
  host: { value: "", required: true }
}
```

```html
<input id="node-input-host" type="text">
```

For a config-node property, editor controls use the `node-config-input-*` convention.

Keep these surfaces aligned:

- editor `defaults` and validators;
- edit-template control IDs;
- `oneditprepare`, `oneditsave`, `oneditcancel`, `oneditdelete`, and `oneditresize` behavior when used;
- runtime reads from `config`;
- help text and examples describing the property.

Prefer Node-RED-provided widgets such as TypedInput and editor APIs when they fit the use case. If a widget creates an editor/object with its own lifecycle, destroy it on save/cancel as required by that API.

## Credentials

Credentials are stored separately from the main flow definition.

Use the credential definition in both editor/runtime registration as required by Node-RED and keep the edit control IDs consistent with ordinary node properties.

Do not read a password credential back in editor code as if it were an ordinary property. Node-RED exposes presence information for password credentials instead of returning the secret value.

Good boundaries:

- username-like non-secret values may be ordinary properties or text credentials according to the project contract;
- passwords/tokens/private keys use credentials or a stricter project secret source;
- runtime code reads secret credentials only where needed;
- logs, status, errors, exported flows, and help examples never echo secrets.

## Admin and runtime HTTP routes

`RED.httpAdmin` belongs to editor/admin integration. `RED.httpNode` belongs to runtime HTTP nodes/endpoints.

For custom admin routes:

- require an appropriate `RED.auth.needsPermission("<resource>.read|write")` middleware unless the documented design establishes another authentication flow;
- distinguish read and write permissions;
- validate request input at the route boundary;
- do not expose credentials in responses;
- avoid using an admin route merely to serve static files when `resources/` is sufficient.

## Editor resources

For Node-RED versions that support it, a top-level package `resources/` directory is exposed to the editor under the module resource path.

Use relative references from node editor HTML, for example:

```html
<script src="resources/@scope/node-red-example/editor.js"></script>
```

Do not add a leading `/`; the editor may be mounted below a non-root path.

For scoped packages, preserve the scope in the resource path.

## TypeScript build boundary

A common TypeScript package has a source/build split where compilation and copy steps preserve the Node-RED node-set pairing:

```text
src/nodes/example.ts
src/nodes/example.html
        |
        | build + copy editor artifact
        v
dist/nodes/example.js    <- package.json node-red.nodes
dist/nodes/example.html  <- matching editor artifact
resources/...            <- editor resources
```

The exact source and output directories are project-specific. The invariant is that the installed/published node set contains the runtime artifact selected by `node-red.nodes` together with the editor HTML Node-RED resolves for that same node set.

Check:

- `package.json -> node-red.nodes` points to built runtime code;
- the matching editor `.html` survives the build/package step in the location expected for that runtime node set;
- required resources/icons/locales/examples are included;
- `files`, `.npmignore`, build cleanup, and package scripts do not omit required artifacts;
- source maps and declarations follow the project's publish policy rather than being included accidentally.

## Module format and Node-RED versions

Do not treat CommonJS or ESM as a timeless Node-RED rule.

Node-RED 5 added support for installing ESM node modules. Older supported runtimes may have different loading constraints. When changing `type`, export syntax, file extensions, build output, or package entrypoints:

1. determine the module's supported Node-RED range;
2. verify the development/test runtime;
3. check the applicable Node-RED changelog/documentation;
4. test the packed artifact against every support boundary required by the project.

## Packaging review

The official packaging guidance expects a Node-RED package to declare its node files and supported Node-RED version. Treat that version range as a public compatibility promise.

Before publishing-related changes, verify:

- npm package name and scope;
- license and README;
- Node-RED support range;
- runtime dependencies;
- examples in the package-root `examples/` directory when provided;
- `node-red` keyword/discoverability policy only when the module is ready for that publication state;
- packed file list and installed runtime behavior.

Do not broaden the support range only because code compiles on a newer Node.js version.
