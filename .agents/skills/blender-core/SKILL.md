---
name: blender-core
description: "Use for Blender 5.2 bpy data model, context/modes, datablocks, transforms, depsgraph, BMesh, Undo, file state, and Blender-side review."
---

# Blender 5.2 Core

Use this skill for Blender 5.2 implementation/review that depends on Blender's object/data-block model, `bpy`, BMesh, context, modes, transforms, evaluated data, Undo, saving, or data ownership.

Priority verified target: Blender `5.2.2 LTS`. The portable profile covers Blender `5.2.x` only after the exact runtime version is confirmed.

## Required Dependencies

Required rules:

- `.codex/rules/blender_core.md`.

The mutual `blender_core.md ↔ blender-core` pair is intentional; both artifacts must be active independently through the project profile.

## Workflow

1. Read `CODEX_PROJECT.md` and confirm the Blender 5.2 patch.
2. Inspect the affected file/scene/collection/object/data-block relationships and save state.
3. Identify context/mode/selection/active-object requirements before operators.
4. Identify shared data-blocks, linked libraries, topology-dependent data, parenting, constraints, modifiers, and animation dependencies before mutation.
5. Choose the narrowest Blender API boundary: operator, direct data API, BMesh, evaluated depsgraph, or specialized active overlay.
6. Make one bounded logical change.
7. Update/evaluate as required and inspect the result.
8. Preserve incidental user state and save only when the workflow requires it.

Load references:

- `references/data-model-and-lifetime.md`.
- `references/context-modes-mesh-and-undo.md`.
- `references/files-transforms-and-evaluation.md`.
- `references/review-checklist.md`.
- `references/official-sources.md`.

## Baseline

- Object and Object Data are separate.
- Active Object and selection are separate.
- Context-sensitive operators require explicit context/mode reasoning.
- Edit Mode mesh work uses the Edit BMesh boundary.
- Evaluated data is different from source data.
- Shared data-block edits can affect multiple Objects.
- Blender's embedded Python owns `bpy`; do not require a standalone `bpy` package for normal Editor/MCP work.
- Keep Blender API calls on a safe Blender-owned lifetime/thread boundary.

## Guardrails

- No mechanical transform application or origin recentering.
- No blind deletion/purge of data-blocks.
- No assumption that an unsaved Blender file has a safe target path.
- No preference/factory reset as an authoring shortcut.
- No background Python thread that keeps calling Blender APIs after tool/script completion.
- No silent upgrade to APIs from another Blender major/minor line.
