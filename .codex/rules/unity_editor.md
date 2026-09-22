# Unity 6.3 Editor rules

Apply this rule only when `CODEX_PROJECT.md` declares the `unity-editor` profile active, or when this source artifact is maintained in the template repository.

This is an Editor-only overlay over `unity-core` for Unity 6000.3.x.

## Required skills

Use together with:

- `unity-core`;
- `unity-editor`.

Required base rule:

- `.codex/rules/unity_core.md`.

## Source of truth

Before changing Editor tooling:

1. Confirm the exact Unity 6000.3 patch and active `unity-core` profile.
2. Inspect Editor assemblies/folders, `.asmdef` constraints, custom inspectors/drawers/windows, serialized object workflow, assets/prefabs/scenes touched, and Editor tests.
3. Prefer Unity's Editor APIs over direct YAML manipulation for assets Unity owns.
4. Use project-declared validation and optional `unity-cli` automation when active.

## Assembly and namespace boundary

- `UnityEditor` code must compile only for the Editor.
- Prefer structural Editor-only assembly/folder boundaries over broad `#if UNITY_EDITOR` around substantial tooling.
- Runtime assemblies must not acquire Editor-only references as a convenience.

## Serialized editing

- Prefer `SerializedObject` and `SerializedProperty` for custom inspectors/property drawers editing serialized state.
- Call/update/apply serialized changes according to Unity API contracts.
- Preserve multi-object editing and Prefab override behavior when the tool is expected to support them.
- For direct non-serialized object mutation, use the appropriate Undo/dirty/save workflow.
- Do not bypass Prefab/serialization APIs in ways that lose overrides or Undo history.

## Undo, dirty state, and persistence

- Record Undo before an object mutation when the operation should be undoable.
- Use Prefab-specific APIs when changing prefab instances/assets and overrides.
- Mark/save assets only when the owning API requires it; avoid unconditional `AssetDatabase.SaveAssets()` after every small operation.
- Keep batch operations bounded and report partial failures.

## AssetDatabase and importers

- Treat asset paths, GUIDs, import state, and refresh/reimport as Unity-owned contracts.
- Avoid repeated full-database searches/refreshes in tight Editor loops.
- Do not invoke unsafe AssetDatabase operations from import callbacks where Unity documents restrictions.
- Use `StartAssetEditing`/`StopAssetEditing` only with robust `try/finally` and when batch import cost justifies it.

## Inspector and UI

- Keep custom inspectors focused on authoring/validation, not runtime business logic.
- Prefer standard property drawing when no custom UI is needed.
- UI Toolkit and IMGUI are project/version choices; do not migrate an established Editor UI stack without scope.
- Clean up Editor callbacks, scheduled items, event handlers, previews, and temporary resources.

## Scene and prefab editing

- Prefer opening/loading/working through Unity Editor APIs rather than textual scene/prefab mutation.
- Save only intentionally modified scenes/assets.
- Preserve existing dirty scenes and user state when automation can avoid destructive changes.
- Never assume a headless/batch workflow has the same interactive context as an open Editor.

## Optional coordination

- `csharp-style` for Editor C# style.
- `unity-testing` for Editor/EditMode tests.
- `unity-cli` for Editor command automation.
- UI-specific overlays only when active.

## Review checklist

- [ ] Editor-only code cannot enter a player/runtime assembly.
- [ ] Serialized edits preserve Undo, multi-object editing, and prefab semantics where applicable.
- [ ] Asset/import operations are bounded and lifecycle-safe.
- [ ] Scene/prefab changes are intentional and saved explicitly.
- [ ] Editor callbacks/resources are cleaned up.
- [ ] Relevant Editor tests/validation were run.
