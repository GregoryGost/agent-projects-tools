# TypeScript Node-RED build and artifact workflow

## Build model

A TypeScript Node-RED contrib package is not a Vite-style application bundle. Node-RED consumes an installed npm package with a concrete node-set artifact contract.

```text
runtime TypeScript source
        |
        | type check / compile
        v
runtime JavaScript artifact ---- package.json -> node-red.nodes
        |
        +---- matching editor HTML
        +---- package resources/icons/locales/examples as declared
```

Treat the runtime `.ts` files as source and the `.js` files selected by `node-red.nodes` as generated runtime artifacts. Do not hand-maintain both.

## Recommended build stages

Keep build responsibilities separate:

```text
clean
  |
  v
type check / TypeScript compilation
  |
  v
optional editor TypeScript/resource build
  |
  v
Node-RED postbuild assembly + artifact validation
  |
  v
packed-package validation
```

The exact commands come from the target project. Do not invent `tsc`, bundler, clean, or package commands when the project declares another workflow.

The Node-RED postbuild stage must not compile TypeScript, choose CommonJS versus ESM, clean output directories, publish packages, or run the test suite. Those responsibilities stay with their owning build/test/package stages.

## Canonical postbuild asset

This skill ships a canonical zero-dependency implementation at:

```text
.agents/skills/node-red-contrib-expert/scripts/node-red-postbuild.mjs
```

This file is a reusable skill asset, not a runtime dependency of a target project.

When the active project uses the canonical workflow:

1. Inspect existing project build scripts and Node-RED artifact handling.
2. If no suitable project-owned postbuild script exists and the requested change authorizes build configuration, copy/adapt the canonical script to a project-owned path such as `scripts/node-red-postbuild.mjs`.
3. Point the project build lifecycle to the project-owned copy, not to `.agents/skills/...`.
4. If a project-owned script already exists, inspect its behavior and preserve project-specific extensions. Do not overwrite it merely because its contents or hash differ from the canonical asset.
5. Compare required capabilities rather than requiring byte-for-byte identity with the canonical script.

The canonical script is intended as a safe baseline that projects may extend deliberately.

## Canonical script responsibilities

The script:

- reads `package.json -> node-red.nodes` as the authoritative list of runtime node-set artifacts;
- reads the project-local `node-red-build` configuration described below;
- requires each `node-red.nodes` entry to point to an emitted `.js` file inside the declared output root;
- assembles or validates the matching `.html` node-set companion;
- optionally copies explicitly configured files/directories;
- rejects absolute paths, lexical path traversal, existing symlink traversal in intermediate path components, direct symbolic-link sources/outputs, and recursive/overlapping copy mappings;
- requires `sourceRoot` and `outputRoot` to be separate trees when HTML is copied from source;
- validates the complete copy-mapping graph so mapping destinations cannot overlap each other or act as another mapping's source;
- prevents additional copy mappings from overlapping protected runtime `.js` or matching editor `.html` node-set artifacts;
- detects stale extra paths in copy-owned destination trees and stale outputs left behind when an optional source disappears;
- supports a read-only `--check` mode;
- fails fast when required artifacts are missing or stale.

It intentionally does not parse `registerType` source code or rewrite node type names. Runtime/editor type-string consistency remains a semantic Node-RED contract covered by review/tests rather than fragile source rewriting.

## Project-local configuration

`node-red-build` is a convention of this portable skill, not an official Node-RED package.json field.

Example:

```json
{
  "node-red": {
    "nodes": {
      "example": "dist/nodes/example/example.js"
    }
  },
  "node-red-build": {
    "sourceRoot": "src/nodes",
    "outputRoot": "dist/nodes",
    "editorHtml": "copy",
    "copy": [
      {
        "from": "src/locales",
        "to": "dist/locales",
        "optional": true
      }
    ]
  }
}
```

### `sourceRoot`

Root used to locate source editor HTML when `editorHtml` is `copy`.

It is required in `copy` mode and not required in `validate-only` mode. If provided in `validate-only`, the canonical script only validates that its path is project-relative and does not traverse an existing symlink; it is not used to derive HTML.

In `copy` mode, `sourceRoot` and `outputRoot` must not be the same tree or parent/child trees. This keeps source and generated artifacts unambiguous.

For:

```text
node-red.nodes.example = dist/nodes/example/example.js
outputRoot = dist/nodes
sourceRoot = src/nodes
```

the canonical mapping is:

```text
src/nodes/example/example.html
        ->
dist/nodes/example/example.html
```

The relative path below `outputRoot` is preserved.

### `outputRoot`

Root that contains generated Node-RED runtime node-set artifacts. Every `node-red.nodes` value must resolve inside this directory.

The canonical profile expects `.js` runtime artifacts. TypeScript source paths must not be listed directly in `node-red.nodes`.

### `editorHtml`

Supported values:

- `copy`: copy the matching `.html` from `sourceRoot` beside the emitted `.js`; `--check` verifies source/output content equality;
- `validate-only`: do not copy HTML; require the project build to have already produced the matching `.html` artifact.

Use `validate-only` when another declared build step generates the editor HTML rather than storing it as a static source companion.

### `copy`

Optional explicit copy mappings for package artifacts not owned by TypeScript compilation, for example locales or other static files.

Each mapping has:

```json
{
  "from": "project-relative source",
  "to": "project-relative output",
  "optional": false
}
```

Mappings are deliberately explicit. Do not turn the canonical script into a hidden glob-based package assembler.

Each mapping owns its destination path exclusively. Do not point a mapping at a directory that is also populated by another build stage. In normal mode the canonical script rejects stale extra paths in an existing destination tree; in `--check` mode it requires the destination tree/content to match the source exactly.

The mapping graph must be order-independent: mapping destinations cannot overlap each other and a mapping destination cannot overlap another mapping's source. Chained copies where one mapping consumes another mapping's generated output require a project-specific build stage rather than the canonical postbuild baseline.

A mapping destination must not be a parent/child of a `node-red.nodes` runtime `.js` artifact or its matching editor `.html`. Use narrower targets such as a dedicated `locales/`, `icons/`, or resource subdirectory instead of copying across an entire node-set directory.

If an optional source does not exist, the corresponding output must also be absent. A remaining output is treated as stale rather than silently accepted.

The script rejects symbolic links and overlapping source/output mappings to avoid accidental traversal, recursive copies, or package content sourced outside the project tree.

## Build script integration

A typical npm lifecycle may look like:

```json
{
  "scripts": {
    "build": "<project-declared TypeScript build>",
    "postbuild": "node scripts/node-red-postbuild.mjs",
    "check:node-red-artifacts": "node scripts/node-red-postbuild.mjs --check",
    "validate:package": "npm pack --dry-run"
  }
}
```

These names are examples, not mandatory script names. Preserve existing package-manager conventions and commands.

Do not invoke `npm pack` from the canonical postbuild script. Packaging commands can trigger package lifecycle hooks and can create recursion or surprising side effects when nested inside `postbuild`/`prepack` flows.

## `--check` mode

Run the project-owned script with `--check` after the build when CI/review needs artifact validation without writes.

It verifies:

- every `node-red.nodes` runtime `.js` exists and is a regular file;
- every runtime artifact is inside `outputRoot`;
- every matching editor `.html` exists;
- `copy`-mode HTML matches its source exactly;
- every configured copy mapping has the same exclusively owned file tree/content as its source;
- required paths do not escape through lexical traversal or existing symlink path components;
- optional mappings do not leave stale output after their source disappears;
- copy mappings remain independent and do not overlap protected node-set artifacts.

`--check` does not compile, copy, clean, modify package metadata, or publish anything.

## Clean builds and stale artifacts

The postbuild script does not clean `outputRoot` because cleanup belongs before compilation.

The target project should have an explicit clean-build policy when stale generated files can survive removal/renaming of TypeScript sources. Prefer:

```text
clean -> build -> postbuild -> package validation
```

rather than attempting to infer which generated JavaScript files are safe to delete after compilation.

A project may use a build tool that already guarantees a clean output directory; record that policy instead of adding duplicate cleanup.

## Runtime bundling policy

Do not introduce Vite/esbuild/Rollup bundling for Node-RED runtime code by default.

Prefer ordinary TypeScript compilation when runtime dependencies can remain normal npm dependencies. Bundle runtime code only when the project has a concrete reason and compatibility evidence for dynamic imports/requires, native modules, optional dependencies, package-relative files, source maps, and Node-RED loading behavior.

Editor browser resources are a separate boundary. They may use a bundler when the editor code warrants it, but keep stable resource entry names unless a deliberate manifest/rewrite strategy manages hashed filenames.

The Node-RED `.html` node-set companion is not a normal Vite `index.html` entrypoint and must preserve Node-RED's template/help/registration semantics.

## Packed artifact validation

A successful source build does not prove the npm package is complete.

When the project declares a package validation command, inspect the packed file list and verify that it contains all artifacts required by `node-red.nodes` and the corresponding editor/runtime package contract.

Keep this separate from postbuild assembly. A project-specific package check may use `npm pack --dry-run` or another package-manager command, but the portable skill must not invent one when none is declared.

## Canonical script capability checklist

A project-owned equivalent is suitable when it preserves the required project behavior, including:

- [ ] derives runtime node sets from `package.json -> node-red.nodes`;
- [ ] treats `.ts` as source and `.js` as runtime artifact;
- [ ] preserves/validates matching `.html` companions;
- [ ] does not compile TypeScript itself;
- [ ] does not clean output after build;
- [ ] does not publish or call package lifecycle commands recursively;
- [ ] supports read-only artifact validation;
- [ ] keeps source/output trees distinct for copied HTML;
- [ ] prevents unsafe lexical/symlink traversal and unintended recursive copies;
- [ ] validates copy mappings as an independent, non-overlapping graph;
- [ ] prevents static copy mappings from overlapping protected node-set artifacts;
- [ ] detects stale output in copy-owned destinations;
- [ ] remains cross-platform without shell-specific `cp`, `rm`, or glob syntax;
- [ ] keeps optional static copies explicit and reviewable.
