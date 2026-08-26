---
name: node-red-contrib-expert
description: "Use for Node-RED custom/contrib node modules: runtime/editor contracts, lifecycle, config nodes, credentials, packaging, resources, and review."
---

# Node-RED Contrib Expert

Use this skill for implementation, refactoring, diagnosis, and review of Node-RED custom/contrib node modules when the `node-red-contrib` profile is active.

## Required Dependencies

- `.codex/rules/node_red_contrib.md`

Load references when needed:

- `references/architecture-lifecycle-and-messages.md` for runtime adapter design, messages, errors, lifecycle, status, and config-node ownership.
- `references/editor-packaging-and-resources.md` for editor HTML, properties, credentials, HTTP/resource boundaries, build artifacts, and npm packaging.
- `references/review-checklist.md` for focused Node-RED contrib review prompts and anti-patterns.
- `references/official-sources.md` for Node-RED documentation, release/version sources, and source precedence.

## Workflow

1. Read `CODEX_PROJECT.md` in a target project.
2. Confirm the `node-red-contrib` profile and validate this skill's required dependency.
3. Inspect `package.json`, lockfile, `node-red` metadata, Node.js engines, build scripts, source/build layout, module format, runtime node files, editor HTML, config nodes, credentials, resources, examples, and relevant tests.
4. Determine the supported Node-RED range and the concrete Node-RED version used for development/testing from project evidence.
5. Map each node type across package entrypoint, runtime registration, editor registration, edit/help templates, properties, credentials, config-node references, inputs, outputs, HTTP routes, and resources.
6. Identify the lifecycle owner for every client, connection, timer, listener, subscription, watcher, or other stateful resource.
7. Keep the Node-RED adapter thin when reusable business logic can live in framework-neutral modules.
8. Make the smallest change that preserves documented flow and package contracts.
9. Coordinate with optional TypeScript, testing, formatting, browser/UI, security, or E2E overlays only when independently active.
10. Run or report project-declared validation commands, including build/package checks when available.

## Architecture baseline

A contrib node has multiple coupled surfaces that must be reviewed together:

```text
package.json -> node-red.nodes -> runtime artifact
                                  |
                                  +-> RED.nodes.registerType(type, ...)

editor HTML -> RED.nodes.registerType(type, definition)
            -> data-template-name=type
            -> data-help-name=type
```

For TypeScript projects, insert the authoring/build boundary explicitly rather than pretending Node-RED loads the TypeScript source directly unless the declared runtime/toolchain proves that it does.

Prefer a thin Node-RED adapter around reusable domain/service code. Do not force framework-neutral logic to depend on `RED`, `Node`, editor globals, or flow configuration when it can be expressed independently.

## Runtime behavior

- Initialize each runtime instance with `RED.nodes.createNode` before Node-RED node APIs are used.
- Treat `input`, `send`, `done`, `close`, status, error reporting, and config-node resolution as framework contracts.
- Preserve incoming messages when responding to them unless new-message semantics are intentional and documented.
- Keep output index/order semantics explicit for multi-output nodes.
- Catch asynchronous failures and route them through the Node-RED error/completion contract.
- Own shared connections in a config node when that matches the domain and project design.
- Make cleanup idempotent when shutdown paths can be reached after partial initialization or failed connections.

## Editor and packaging behavior

- Keep `defaults`, credentials, template control IDs, editor validators, lifecycle hooks, and runtime configuration reads aligned.
- Use Node-RED standard editor widgets and conventions before inventing custom UI patterns.
- Keep editor-only code out of runtime modules and runtime-only secrets out of editor-visible state.
- Prefer `resources/` for static editor resources and relative resource paths compatible with non-root deployments.
- Verify the built and packed package, not only the source tree, when packaging paths change.
- Treat Node-RED and Node.js support constraints as public package contracts.

## Optional coordination

- `typescript-core`: TypeScript implementation, typing, services, public contracts, and safe refactoring.
- `node-red-contrib-testing`: Node-RED runtime/component testing through the separate testing profile.
- `typescript-jest-testing`: framework-neutral Jest tests only when Jest is active.
- formatting/linting skills: only when active in the project.
- UI/browser validation: Node-RED editor behavior that requires an actual browser.
- project E2E: separately installed/running Node-RED and real dependency scenarios.

## Review checklist

- [ ] Version, module format, source layout, build output, and package metadata were inspected.
- [ ] Runtime/editor/template/help type identifiers were mapped together.
- [ ] Property, credential, input/output, and config-node contracts remain aligned.
- [ ] Message completion and error semantics are correct for the supported runtime range.
- [ ] Every stateful runtime/editor resource has an explicit lifecycle owner and cleanup path.
- [ ] Secrets stay inside the approved credential boundary.
- [ ] Admin/runtime HTTP routes use the correct Node-RED surface.
- [ ] Published artifacts include everything the registered package paths require.
- [ ] Reusable logic stays framework-neutral where practical.
- [ ] Optional testing/style/security/browser/E2E concerns were delegated instead of duplicated.
