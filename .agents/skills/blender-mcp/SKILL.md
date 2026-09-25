---
name: blender-mcp
description: "Use for official Blender Lab MCP 1.0.3 live-Editor automation, scene inspection, docs/screenshots, bounded bpy execution, routing/security, and headless fallback."
---

# Official Blender Lab MCP

Use this skill for the official Blender Lab MCP. Priority MCP version: `1.0.3`. Priority live baseline: Blender `5.2.2 LTS`.

This is an automation/inspection overlay. It is not a hard dependency of Blender authoring profiles.

## Required Dependencies

Required rules:

- `.codex/rules/blender_mcp.md`.

The mutual `blender_mcp.md ↔ blender-mcp` pair is intentional; both artifacts must be active independently through the project profile.

## Workflow

1. Confirm the configured MCP is the official Blender Lab implementation and resolve its version/pinned source.
2. Identify the intended live Blender session and inspect blend-file path/save state.
3. Discover/use the current tool catalog rather than assuming a third-party Blender MCP surface.
4. Inspect scene/object/file state with dedicated tools first.
5. Search bundled API/manual docs when `bpy` behavior is version-sensitive.
6. For actual authoring, use focused `execute_blender_code` scripts that implement one logical change and return structured `result` data.
7. Classify the real side effects with `request_routing.md`.
8. Validate structure and visible result through summaries/screenshots/renders as appropriate.
9. Use `*_for_cli` only for intentionally background/headless workflows.
10. Do not modify MCP/add-on/client configuration unless local-environment changes are authorized.

Load:

- `references/official-tool-surface.md`.
- `references/live-editor-code-execution-and-security.md`.
- `references/review-checklist.md`.
- `references/official-sources.md`.

## Tool-selection policy

For reading and diagnosis prefer dedicated tools:

```text
summaries / docs / screenshots
    >
bounded read-only execute_blender_code
```

For modeling/material/rigging mutations, the official MCP currently relies on Blender Python rather than a complete typed mutation catalog:

```text
inspect
→ bounded execute_blender_code + bpy/BMesh
→ structured result
→ inspect
→ visual validation when needed
```

Do not treat `execute_blender_code` as inherently inappropriate merely because it executes Python; instead keep its scope explicit and apply the full-trust security boundary.

## Live Editor first

When the target asset is already open, work in that connected Editor session. Do not silently open the same asset in a second/background Blender after a live failure.

Preserve incidental workspace/selection/mode state unless the requested operation intentionally changes it.

## Security

Upstream's `WeakSandboxForLLM` is not a security sandbox. Arbitrary code can access Blender/Python capabilities beyond ordinary scene edits.

Never use code execution to read/exfiltrate unrelated files, secrets, environment data, or network resources. Keep filesystem writes within authorized project/artifact paths.

## Guardrails

- No same-name third-party MCP substitution.
- No silent MCP/add-on upgrade or client reconfiguration.
- No blind trust in `readOnlyHint`/other annotations when the real tool writes files or mutates UI.
- No giant opaque script combining unrelated asset mutations and environment/file operations.
- No silent live→CLI fallback.
