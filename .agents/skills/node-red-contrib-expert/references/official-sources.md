# Official Node-RED sources

Use project/runtime evidence first to determine the applicable Node-RED, Node.js, module-format, and package versions. Then use official Node-RED sources for the matching behavior.

## Creating nodes

- Creating Nodes: https://nodered.org/docs/creating-nodes/
- JavaScript/runtime file: https://nodered.org/docs/creating-nodes/node-js
- HTML/editor file: https://nodered.org/docs/creating-nodes/node-html
- Node properties: https://nodered.org/docs/creating-nodes/properties
- Node edit dialog: https://nodered.org/docs/creating-nodes/edit-dialog
- Credentials: https://nodered.org/docs/creating-nodes/credentials
- Configuration nodes: https://nodered.org/docs/creating-nodes/config-nodes
- Node context: https://nodered.org/docs/creating-nodes/context
- Node status: https://nodered.org/docs/creating-nodes/status
- Editor resources: https://nodered.org/docs/creating-nodes/resources
- Packaging: https://nodered.org/docs/creating-nodes/packaging
- Packaging subflows: https://nodered.org/docs/creating-nodes/packaging-subflows
- Adding examples: https://nodered.org/docs/creating-nodes/examples
- Internationalisation: https://nodered.org/docs/creating-nodes/i18n

## Runtime and editor APIs

- API reference: https://nodered.org/docs/api/
- Admin API: https://nodered.org/docs/api/admin/
- Node-RED module API overview: https://nodered.org/docs/api/modules/

Use API-module pages carefully: some published API docs are versioned and may describe an older Node-RED line. Do not use an older API reference to infer the current runtime version.

## Versions and compatibility

- Release plan: https://nodered.org/about/releases/
- Node-RED blog/releases: https://nodered.org/blog/
- Node-RED changelog: https://github.com/node-red/node-red/blob/main/CHANGELOG.md
- Node-RED repository/package metadata: https://github.com/node-red/node-red

Node-RED 5 added support for installing ESM module nodes. Treat module loading as version-sensitive and verify the project's declared support range before changing module format.

## Source precedence

1. `CODEX_PROJECT.md`, `package.json`, lockfile, build config, and runtime evidence determine what version/configuration actually applies.
2. Current official creating-node documentation is the preferred general behavior source.
3. Release plan/changelog/repository history resolve version-specific changes.
4. Curated examples from official Node-RED repositories can clarify patterns but do not override documented compatibility constraints.
5. Community posts are supplementary only and should not be the sole basis for a portability or security rule.

When `context7_documentation.md` is active, Context7 may be used as an optional retrieval path for the matching Node-RED source/version. It does not replace project evidence or these curated official sources.
