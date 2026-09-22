---
name: unity-editor
description: "Use for Unity 6.3 Editor scripting: inspectors, SerializedObject, Undo, prefabs, AssetDatabase/importers, Editor windows, and safe asset authoring."
---

# Unity Editor

Use this skill for Unity 6.3 Editor-only code and authoring automation.

## Required Dependencies

Required skills:

- `unity-core`.

Required rules:

- `.codex/rules/unity_core.md`;
- `.codex/rules/unity_editor.md`.

The mutual `unity_editor.md ↔ unity-editor` pair is intentional.

## Workflow

1. Confirm the active Unity 6000.3 profile and exact Editor patch.
2. Locate the Editor-only assembly/folder boundary.
3. Identify the data surface: serialized object, prefab, scene, import settings, asset, or Editor-local state.
4. Choose the Unity API that preserves Undo, dirty state, multi-object editing, prefab overrides, and import semantics.
5. Keep runtime/domain behavior outside the Editor adapter where practical.
6. Make operations reversible and bounded.
7. Validate through Editor tests and/or active Unity CLI workflows.

Load:

- `references/patterns-and-review.md`.
- `references/review-checklist.md`.
- `references/official-sources.md`.

## Guardrails

- No `UnityEditor` in runtime assemblies.
- No direct scene/prefab YAML rewriting when a safe Editor API owns the operation.
- No silent loss of Undo or prefab override information.
- No unconditional global refresh/save loops.
- No destructive asset operation without clear target/scope.
