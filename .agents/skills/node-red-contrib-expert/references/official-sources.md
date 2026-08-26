# Node-RED and TypeScript sources

Use project/runtime evidence first to determine the applicable Node-RED, Node.js, TypeScript, module-format, declaration, and package versions. Then use primary sources for the matching behavior.

## Official Node-RED creating-node sources

- Creating Nodes: https://nodered.org/docs/creating-nodes/
- JavaScript runtime artifact: https://nodered.org/docs/creating-nodes/node-js
- HTML/editor file: https://nodered.org/docs/creating-nodes/node-html
- Node properties: https://nodered.org/docs/creating-nodes/properties
- Node edit dialog: https://nodered.org/docs/creating-nodes/edit-dialog
- Credentials: https://nodered.org/docs/creating-nodes/credentials
- Configuration nodes: https://nodered.org/docs/creating-nodes/config-nodes
- Node context: https://nodered.org/docs/creating-nodes/context
- Node status: https://nodered.org/docs/creating-nodes/status
- Editor resources: https://nodered.org/docs/creating-nodes/resources
- Packaging: https://nodered.org/docs/creating-nodes/packaging
- Adding examples: https://nodered.org/docs/creating-nodes/examples
- Internationalisation: https://nodered.org/docs/creating-nodes/i18n

Node-RED documentation describes the runtime artifact as JavaScript because that is what Node-RED loads. Under this profile, the project authors that runtime implementation in TypeScript and verifies the build that emits the documented JavaScript artifact.

## Runtime and editor APIs

- API reference: https://nodered.org/docs/api/
- Admin API: https://nodered.org/docs/api/admin/
- Node-RED module API overview: https://nodered.org/docs/api/modules/

Use API-module pages carefully: some published API docs are versioned and may describe an older Node-RED line. Do not use an older API reference to infer the current runtime version.

## Versions and compatibility

- Release plan: https://nodered.org/about/releases/
- Supported Node.js versions: https://nodered.org/docs/faq/node-versions
- Node-RED blog/releases: https://nodered.org/blog/
- Node-RED changelog: https://github.com/node-red/node-red/blob/main/CHANGELOG.md
- Node-RED repository/package metadata: https://github.com/node-red/node-red

Node-RED 5 added support for installing ESM module nodes. Treat module loading as version-sensitive and verify the project's declared support range before changing emitted JavaScript module format.

## TypeScript declarations

Node-RED's creating-node documentation is the runtime behavior source. TypeScript declaration packages model that runtime for static checking but do not replace runtime documentation.

Common supplemental declaration sources:

- DefinitelyTyped `@types/node-red`: https://www.npmjs.com/package/@types/node-red
- DefinitelyTyped source for Node-RED declarations: https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/node-red
- TypeScript compiler documentation: https://www.typescriptlang.org/docs/

Current DefinitelyTyped Node-RED declarations expose runtime shortcuts such as `NodeInitializer`, `NodeAPI`, `NodeDef`, `Node`, `NodeMessage`, credentials, and editor-side types. Treat that surface as declaration metadata, not as a Node-RED version oracle.

Important separation:

- Node-RED runtime version comes from project/runtime evidence and Node-RED sources;
- Node.js compatibility comes from project engines/runtime and Node-RED compatibility guidance;
- TypeScript compiler version comes from project dependencies/tooling;
- declaration versions come from the lockfile/package manager;
- declaration correctness for a used API must be checked against the verified runtime behavior.

If an `@types/*` package lags a verified runtime API, prefer a minimal project declaration augmentation or another bounded compatibility fix. Do not weaken the entire Node-RED boundary to `any`.

## Source precedence

1. `CODEX_PROJECT.md`, `package.json`, lockfile, TypeScript/build config, and runtime evidence determine what versions/configuration actually apply.
2. Current official Node-RED creating-node documentation is the preferred runtime behavior source.
3. Release plan/changelog/repository history resolve Node-RED version-specific changes.
4. Project-declared TypeScript declarations provide static types only after their compatibility with the used runtime API is established.
5. Official TypeScript documentation resolves compiler/language behavior.
6. Curated examples can clarify patterns but do not override documented compatibility constraints.
7. Community posts are supplementary only and should not be the sole basis for portability, security, or compatibility policy.

When `context7_documentation.md` is active, Context7 may be used as an optional retrieval path for the matching Node-RED/TypeScript source/version. It does not replace project evidence or these curated sources.
