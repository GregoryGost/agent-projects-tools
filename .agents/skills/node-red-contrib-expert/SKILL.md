---
name: node-red-contrib-expert
description: "Use for TypeScript-authored Node-RED custom/contrib node modules: runtime/editor contracts, typed boundaries, lifecycle, packaging, resources, and review."
---

# TypeScript Node-RED Contrib Expert

Use this skill for implementation, refactoring, diagnosis, and review of **TypeScript-authored** Node-RED custom/contrib node modules when the `node-red-contrib` profile is active.

JavaScript-only Node-RED modules are outside this portable profile and require separate project-specific materials.

## Required Dependencies

- `.codex/rules/node_red_contrib.md`
- `.codex/rules/typescript_core.md`
- `typescript-core`

Load references when needed:

- `references/architecture-lifecycle-and-messages.md` for typed runtime adapter design, messages, errors, lifecycle, status, and config-node ownership.
- `references/typescript-runtime-and-typing.md` for Node-RED TypeScript types, constructor/config/message/credential modeling, declaration-source policy, and `.ts -> .js` boundaries.
- `references/editor-packaging-and-resources.md` for editor HTML, properties, credentials, HTTP/resource boundaries, TypeScript build artifacts, and npm packaging.
- `references/review-checklist.md` for focused TypeScript Node-RED contrib review prompts and anti-patterns.
- `references/official-sources.md` for Node-RED documentation, TypeScript declaration sources, release/version sources, and source precedence.

## Workflow

1. Read `CODEX_PROJECT.md` in a target project.
2. Confirm the `node-red-contrib` and `typescript-core` profiles/materials and validate all required dependencies.
3. Inspect `package.json`, lockfile, TypeScript version/configuration, Node-RED type-definition source, `node-red` metadata, Node.js engines, build scripts, source/build layout, emitted module format, runtime `.ts` files, generated `.js` files, editor HTML/resources, config nodes, credentials, examples, and relevant tests.
4. Determine the supported Node-RED range and the concrete Node-RED version used for development/testing from project evidence.
5. Trace each runtime node entrypoint from TypeScript source through emitted JavaScript to `package.json -> node-red.nodes` and its matching editor HTML.
6. Map each node type across typed runtime registration, editor registration, edit/help templates, properties, credentials, config-node references, inputs, outputs, HTTP routes, and resources.
7. Identify the lifecycle owner for every client, connection, timer, listener, subscription, watcher, or other stateful resource.
8. Keep the Node-RED adapter thin when reusable business logic can live in framework-neutral TypeScript modules.
9. Make the smallest change that preserves documented flow, type, build, and package contracts.
10. Coordinate with optional testing, formatting, browser/UI, security, or E2E overlays only when independently active.
11. Run or report project-declared type-check, build, package, and other validation commands when available.

## Architecture baseline

The portable profile has an explicit TypeScript authoring boundary:

```text
TypeScript runtime source
src/.../example.ts
        |
        | project build / type check
        v
JavaScript runtime artifact
 dist/.../example.js <- package.json -> node-red.nodes
        |
        +-> RED.nodes.registerType(type, ...)

matching editor artifact
 dist/.../example.html
        |
        +-> RED.nodes.registerType(type, definition)
        +-> data-template-name=type
        +-> data-help-name=type
```

Node-RED executes the emitted JavaScript artifact. The TypeScript source remains the editable runtime source of truth.

Prefer a thin typed Node-RED adapter around reusable domain/service code. Do not force framework-neutral TypeScript logic to depend on `RED`, Node-RED node instances, editor globals, or flow configuration when it can be expressed independently.

## TypeScript boundaries

- Apply `typescript-core` for generic language design and type safety.
- Type the Node-RED initializer, runtime node instance, node definition/config, message extensions, credentials, config-node references, and integration boundaries using the project-declared Node-RED declarations.
- Prefer narrow interfaces extending the established Node-RED types over `any`, broad casts, or locally copied framework definitions.
- Treat external `msg` properties, flow configuration, credentials, HTTP input, and external-service data as runtime inputs that still need validation/narrowing where TypeScript alone cannot establish correctness.
- If declaration files lag a verified Node-RED runtime API, use a bounded project-approved augmentation rather than weakening the entire node to `any`.
- Do not equate `@types/node-red` or another declaration-package version with the Node-RED runtime version.

## Runtime behavior

- Initialize each runtime instance with `RED.nodes.createNode` before Node-RED node APIs are used.
- Treat `input`, `send`, `done`, `close`, status, error reporting, and config-node resolution as framework contracts.
- Preserve incoming messages when responding to them unless new-message semantics are intentional and documented.
- Keep output index/order semantics explicit for multi-output nodes.
- Narrow caught errors and asynchronous inputs according to TypeScript project policy.
- Catch asynchronous failures and route them through the Node-RED error/completion contract.
- Own shared connections in a config node when that matches the domain and project design.
- Make cleanup idempotent when shutdown paths can be reached after partial initialization or failed connections.

## Editor and packaging behavior

- Keep typed runtime config/credential contracts aligned with editor `defaults`, credentials, template control IDs, validators, lifecycle hooks, and generated runtime reads.
- Use Node-RED standard editor widgets and conventions before inventing custom UI patterns.
- Keep editor-only code out of runtime TypeScript modules and runtime-only secrets out of editor-visible state.
- Prefer `resources/` for static editor resources and relative resource paths compatible with non-root deployments.
- Verify the built and packed package, not only the TypeScript source tree, when packaging paths change.
- Treat Node-RED, Node.js, TypeScript compiler, emitted module format, and declaration compatibility as distinct constraints.

## Optional coordination

- `node-red-contrib-testing`: Node-RED runtime/component testing through the separate testing profile.
- `typescript-jest-testing`: framework-neutral Jest tests only when Jest is independently active.
- formatting/linting skills: only when active in the project.
- UI/browser validation: Node-RED editor behavior that requires an actual browser.
- project E2E: packed/installed module in a separately running Node-RED process with real dependency scenarios.

## Review checklist

- [ ] TypeScript is the runtime authoring language and `typescript-core` dependencies are valid.
- [ ] TypeScript config, declaration source, Node-RED version, Node.js version, module format, source layout, and build output were inspected.
- [ ] Runtime `.ts` source traces to emitted `.js` package entrypoints without hand-edited generated code.
- [ ] Runtime/editor/template/help type identifiers were mapped together.
- [ ] Config, credential, message, node-instance, input/output, and config-node contracts remain typed and aligned.
- [ ] Node-RED declaration versions were not mistaken for runtime compatibility evidence.
- [ ] Message completion and error semantics are correct for the supported runtime range.
- [ ] Every stateful runtime/editor resource has an explicit lifecycle owner and cleanup path.
- [ ] Secrets stay inside the approved credential boundary.
- [ ] Admin/runtime HTTP routes use the correct Node-RED surface.
- [ ] Published artifacts include everything the registered package paths require.
- [ ] Reusable logic stays framework-neutral TypeScript where practical.
- [ ] Optional testing/style/security/browser/E2E concerns were delegated instead of duplicated.
