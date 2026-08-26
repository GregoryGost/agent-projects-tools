# Official Node-RED testing sources

Determine Node-RED, `node-red-node-test-helper`, Node.js, and test-runner versions from project evidence before selecting an API pattern.

## Node-RED node testing

- Creating your first node / unit testing: https://nodered.org/docs/creating-nodes/first-node
- JavaScript/runtime lifecycle: https://nodered.org/docs/creating-nodes/node-js
- Node credentials: https://nodered.org/docs/creating-nodes/credentials
- Configuration nodes: https://nodered.org/docs/creating-nodes/config-nodes

## node-red-node-test-helper

- Official repository and README: https://github.com/node-red/node-red-node-test-helper
- Changelog: https://github.com/node-red/node-red-node-test-helper/blob/master/CHANGELOG.md
- Package source: https://github.com/node-red/node-red-node-test-helper/blob/master/package.json
- Node-RED core tests/examples: https://github.com/node-red/node-red/tree/main/test

The helper runs a Node-RED test runtime, loads test flows, exposes helper nodes/runtime instances, supports credentials, flow changes, HTTP testing, and runtime cleanup. Current helper releases provide Promise-based load/set-flow and server lifecycle APIs; older projects may use callback patterns.

The helper changelog records version-sensitive capabilities such as Promise APIs and support work that enables Vitest. Do not infer the test runner from the helper itself.

## Source precedence

1. Target-project package metadata, lockfile, runner config, and existing tests determine the actual versions and conventions.
2. The helper README/API for the declared helper version determines helper usage.
3. The helper changelog resolves version-specific API changes.
4. Node-RED creating-node documentation defines the runtime contracts being exercised.
5. Generic runner documentation belongs to the active runner/testing overlay and should not be duplicated here.

When `context7_documentation.md` is active, Context7 may retrieve matching Node-RED/helper documentation if a reliable source is available. Curated official sources remain the fallback and version cross-check.
