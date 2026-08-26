# Node-RED testing and TypeScript sources

Determine Node-RED, `node-red-node-test-helper`, Node.js, TypeScript, declaration, and test-runner versions from project evidence before selecting an API pattern.

## Node-RED node testing

- Creating your first node / unit testing: https://nodered.org/docs/creating-nodes/first-node
- JavaScript runtime artifact/lifecycle: https://nodered.org/docs/creating-nodes/node-js
- Node credentials: https://nodered.org/docs/creating-nodes/credentials
- Configuration nodes: https://nodered.org/docs/creating-nodes/config-nodes

The production runtime source in this profile is TypeScript; Node-RED's JavaScript documentation defines the behavior of the emitted runtime artifact that the TypeScript build must preserve.

## node-red-node-test-helper

- Official repository and README: https://github.com/node-red/node-red-node-test-helper
- Changelog: https://github.com/node-red/node-red-node-test-helper/blob/master/CHANGELOG.md
- Package source: https://github.com/node-red/node-red-node-test-helper/blob/master/package.json
- Node-RED core tests/examples: https://github.com/node-red/node-red/tree/main/test

The helper runs a Node-RED test runtime, loads test flows, exposes helper nodes/runtime instances, supports credentials, flow changes, HTTP testing, and runtime cleanup. Current helper releases provide Promise-based load/set-flow and server lifecycle APIs; older projects may use callback patterns.

The helper changelog records version-sensitive capabilities such as Promise APIs and support work that enables Vitest. Do not infer the test runner from the helper itself.

## TypeScript declarations for tests

Common supplemental sources:

- `@types/node-red-node-test-helper`: https://www.npmjs.com/package/@types/node-red-node-test-helper
- DefinitelyTyped helper declarations: https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/node-red-node-test-helper
- `@types/node-red`: https://www.npmjs.com/package/@types/node-red
- TypeScript documentation: https://www.typescriptlang.org/docs/

These declaration packages are maintained separately from the helper and Node-RED runtime. Their versions are not runtime/helper compatibility guarantees.

When a verified helper API is missing or inaccurate in the declaration source:

1. verify the helper/runtime API against the actual installed version;
2. use a minimal project-approved augmentation/workaround;
3. keep the workaround scoped to the mismatched API;
4. do not convert helper/runtime objects broadly to `any`;
5. remove the workaround when dependency declarations catch up.

## Source precedence

1. Target-project package metadata, lockfile, TypeScript config, runner config, and existing tests determine actual versions and conventions.
2. The helper README/API for the declared helper version determines helper runtime usage.
3. The helper changelog resolves version-specific API changes.
4. Node-RED creating-node documentation defines the runtime contracts being exercised.
5. Project-declared TypeScript declaration sources provide static typing only after compatibility with the used API is established.
6. Generic runner documentation belongs to the active runner/testing overlay and should not be duplicated here.

When `context7_documentation.md` is active, Context7 may retrieve matching Node-RED/helper/TypeScript documentation if a reliable source is available. Curated primary sources remain the fallback and version cross-check.
