---
name: node-red-contrib-expert
description: "Use for TypeScript-authored Node-RED custom/contrib node modules: runtime/editor contracts, typed boundaries, build artifacts, lifecycle, packaging, resources, and review."
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
- `references/build-and-artifacts.md` for build stages, the canonical project-owned postbuild workflow, `node-red-build` configuration, clean/check/package boundaries, and bundling policy.
- `references/editor-packaging-and-resources.md` for editor HTML, properties, credentials, HTTP/resource boundaries, TypeScript build artifacts, and npm packaging.
- `references/review-checklist.md` for focused TypeScript Node-RED contrib review prompts and anti-patterns.
- `references/official-sources.md` for Node-RED documentation, TypeScript declaration sources, release/version sources, and source precedence.

Reusable skill asset:

- `scripts/node-red-postbuild.mjs` is the canonical zero-dependency postbuild implementation. Target-project builds must use a project-owned copy or an explicitly equivalent project script, not execute this skill asset directly.

## Workflow

1. Read `CODEX_PROJECT.md` in a target project.
2. Confirm the `node-red-contrib` and `typescript-core` profiles/materials and validate all required dependencies.
3. Inspect `package.json`, lockfile, TypeScript version/configuration, Node-RED type-definition source, `node-red` metadata, Node.js engines, build scripts, source/build layout, emitted module format, runtime `.ts` files, generated `.js` files, editor HTML/resources, config nodes, credentials, examples, and relevant tests.
4. Inspect the Node-RED postbuild/artifact policy: project-owned script path, `node-red-build` config, source/output roots, HTML strategy, clean-build policy, artifact-check command, and packed-package validation command.
5. Determine the supported Node-RED range and the concrete Node-RED version used for development/testing from project evidence.
6. Trace each runtime node entrypoint from TypeScript source through emitted JavaScript to `package.json -> node-red.nodes` and its matching editor HTML.
7. Map each node type across typed runtime registration, editor registration, edit/help templates, properties, credentials, config-node references, inputs, outputs, HTTP routes, and resources.
8. Identify the lifecycle owner for every client, connection, timer, listener, subscription, watcher, or other stateful resource.
9. Keep the Node-RED adapter thin when reusable business logic can live in framework-neutral TypeScript modules.
10. Preserve the build-stage boundary: compile/type-check first, assemble/validate Node-RED artifacts after build, and validate the packed package separately when the project declares that stage.
11. Make the smallest change that preserves documented flow, type, build, artifact, and package contracts.
12. Coordinate with optional testing, formatting, browser/UI, security, or E2E overlays only when independently active.
13. Run or report project-declared type-check, build, postbuild/artifact-check, package-check, and other validation commands when available.

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

## Build and artifact boundary

- Treat TypeScript compilation, Node-RED artifact assembly/validation, and packed-package validation as separate build stages.
- The standard requires a project-owned Node-RED postbuild script or a project-declared equivalent that provides the required artifact capabilities. Do not make the target build depend on `.agents/skills/...` paths.
- When no suitable project-owned script exists and the requested task authorizes build configuration, use `scripts/node-red-postbuild.mjs` from this skill as the canonical baseline and copy/adapt it to the project.
- When a project-owned postbuild already exists, inspect its capabilities and preserve project-specific behavior. Do not overwrite it merely because it differs from the canonical script or has a different hash.
- For the canonical workflow, read the project-local `node-red-build` configuration from `package.json`; this field is a convention of this skill, not an official Node-RED field.
- Keep runtime `.js` and matching editor `.html` pairing reproducible from the project source/build configuration. Use `editorHtml: "copy"` for static source companions or `"validate-only"` when another build step generates HTML.
- Keep additional static copies explicit and project-relative. Do not silently glob arbitrary package content.
- The postbuild stage must not compile TypeScript, choose CommonJS/ESM, clean output after compilation, run tests, invoke `npm pack`, publish, or mutate package metadata.
- Keep clean-before-build and packed-package validation as separate project-declared policies. Do not hide either inside postbuild.
- Prefer `--check` or an equivalent read-only project command for CI/review artifact validation after the build.
- Prefer plain TypeScript compilation for runtime code. Introduce runtime bundling only for a concrete project requirement with compatibility evidence.

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
- Treat Node-RED, Node.js, TypeScript compiler, emitted module format, declaration compatibility, postbuild assembly, and packed-package contents as distinct constraints.

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
- [ ] Project-owned postbuild/artifact validation exists and does not execute the skill asset directly.
- [ ] Canonical/equivalent postbuild capabilities, `node-red-build` config, clean policy, and package-check boundary were inspected.
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
