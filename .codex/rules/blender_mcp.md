# Official Blender Lab MCP rules

Apply this rule only when `CODEX_PROJECT.md` declares the `blender-mcp` profile active, or when this source artifact is maintained directly in the template repository.

This profile is for the official Blender Lab MCP server and add-on. The priority verified MCP version is `1.0.3`, with Blender `5.2.2 LTS` as the priority live-Editor baseline. Third-party projects with similar names are outside this profile.

The MCP server and Blender add-on are separate components. The MCP client normally talks stdio to `blender-mcp`; the server relays to the add-on over a local TCP socket.

## Required skills

Use together with:

- `blender-mcp`.

The mutual `blender_mcp.md ↔ blender-mcp` pair is intentional; both artifacts must be active independently through the project profile.

## Identity and version gate

Before using Blender MCP:

1. Confirm the intended MCP implementation is Blender Lab's official `blender_mcp`, not a same-named third-party package.
2. Confirm the configured server/add-on version or pinned source revision. Re-discover behavior for a version other than the priority `1.0.3`.
3. Identify the intended Blender process/session, current `.blend` path/save state, active scene, and whether the add-on bridge is reachable.
4. Keep client configuration, MCP source installation, add-on installation/upgrade, ports, and machine-local paths under the local-environment/configuration gate. Do not change them as an incidental prerequisite.
5. Keep the bridge loopback/local unless the user/project explicitly authorizes a different network boundary and its security implications.

## Live Editor first

For agent-driven work on a Blender file already open in the intended Editor:

- prefer the connected live Blender session;
- inspect the blend-file path/save status and scene before mutations;
- do not silently start a second background Blender against the same asset after a live failure;
- do not silently switch to a different Blender process/session;
- preserve incidental selection, workspace, area, and mode state when the task does not require changing them.

Use background/CLI tools when the workflow is intentionally headless/batch, when a specific on-disk file is the target and no live state must be preserved, or when project policy explicitly selects that path.

## Tool discovery and read-first workflow

Treat the current MCP tool catalog as authoritative. Version `1.0.3` exposes dedicated tools for blend/object summaries, docs search, screenshots, UI navigation, renders, live Python execution, and background/CLI variants.

Before authoring:

1. Use dedicated summary/inspection tools to understand scene/object/file state.
2. Use bundled API/manual search tools for version-specific Blender questions instead of guessing `bpy` signatures.
3. Use screenshots/window-layout inspection when visible state matters.
4. Use the narrowest tool that proves the required fact.

Do not classify an operation only from an MCP annotation. Determine the real side effect: a tool may navigate UI, change visibility, render, or write a file even if its annotation appears read-only.

## Authoring through execute_blender_code

The official MCP does not expose a complete typed mutation API for modeling/material/rigging operations. For real asset authoring, bounded `execute_blender_code` calls using Blender's `bpy`/BMesh APIs are an expected path.

Before each code execution:

- apply `request_routing.md` to the actual data/UI/filesystem side effects;
- inspect enough state to address objects/data-blocks by verified identity;
- keep the script focused on one logical change or tightly related batch;
- prefer deterministic data/Blender APIs over UI automation;
- return compact structured results through the `result` dict;
- avoid unrelated filesystem, network, subprocess, preference, startup-file, or environment changes;
- validate the resulting Blender state through summaries and, when visual output matters, screenshots/renders.

Do not send large opaque multi-purpose scripts when smaller reviewable operations can achieve the task.

## Security boundary

Treat `execute_blender_code` and `execute_blender_code_for_cli` as full-trust code execution in the Blender process/environment.

The upstream `WeakSandboxForLLM` is explicitly not a security sandbox. It blocks only a small set of operations and can be worked around. Therefore:

- do not rely on it to protect files, credentials, network data, or user assets;
- do not read/send unrelated files or environment data;
- do not reset preferences/factory state or quit Blender as part of ordinary authoring;
- do not execute third-party/untrusted code merely because it is reachable from Blender;
- keep writes inside the authorized project/artifact scope.

## Background/CLI execution

- Treat `*_for_cli` and `execute_blender_code_for_cli` as a distinct Blender lifecycle.
- Require an explicit on-disk target and account for save/overwrite behavior.
- Do not use CLI mode as a silent fallback for a live session failure.
- Validate outputs and report partial/unverified results.

## Optional coordination

- `blender-core` and the relevant authoring profiles when `execute_blender_code` changes Blender data.
- `blender-unity` when the operation prepares/exports assets for Unity.

## Review checklist

- [ ] Official Blender Lab MCP identity/version was confirmed.
- [ ] Intended live Blender session/file is unambiguous.
- [ ] Dedicated inspection/docs/screenshot tools were used where they fit.
- [ ] Real side effects were classified rather than trusting annotations alone.
- [ ] Code execution is bounded, structured, and validated.
- [ ] Weak sandbox behavior was not treated as a security boundary.
- [ ] Live Editor was not silently replaced by a second/background Blender.
- [ ] MCP/add-on/config installation state was not changed without local-environment authorization.
