# Blender 5.2 core rules

Apply this rule only when `CODEX_PROJECT.md` declares the `blender-core` profile active, or when this source artifact is maintained directly in the template repository.

The portable profile is version-bounded to Blender 5.2.x. The priority verified target is Blender `5.2.2 LTS`. Another Blender major/minor line requires separate verification or an explicit profile update.

## Required skills

Use together with:

- `blender-core`.

The mutual `blender_core.md ↔ blender-core` pair is intentional; both artifacts must be active independently through the project profile.

## Source of truth

Before changing Blender data or authoring behavior:

1. Read `CODEX_PROJECT.md`.
2. Confirm the exact Blender 5.2 patch from runtime/project evidence. When a live Blender session is available, prefer runtime evidence such as `bpy.app.version_string`.
3. Inspect the affected `.blend`, scene, collections, object/data relationships, modes, modifiers, linked data, unit settings, animation state, and project naming/storage policy.
4. Use Blender 5.2 documentation or the exact installed API surface for version-sensitive behavior. Do not assume examples from older Blender releases still match Actions, operators, properties, or export behavior.
5. Apply the active specialist Blender overlays only when the task touches their area.

Blender's embedded Python runtime owns `bpy`. A separately installed `bpy` package is not required for normal in-Editor or MCP-driven Blender work.

## Data-block ownership

- Treat Object and Object Data as separate contracts. An Object owns transform/state and references Mesh, Curve, Armature, Camera, Light, and other data-blocks.
- Check data-block user counts before mutation. Editing shared mesh/material/armature data can affect multiple Objects.
- Link newly created Objects to an intended Collection explicitly when using the data API.
- Do not assume deleting an Object deletes its referenced data-blocks or that zero-user data is immediately removed.
- Preserve linked/library-owned data unless the task explicitly authorizes making data local or otherwise changing library relationships.
- Resolve names from returned references after creation; do not depend on Blender's automatic `.001` collision suffix.

## Context, modes, and operators

- Active Object and selection are distinct. Establish both explicitly before context-sensitive operators.
- Confirm Object/Edit/Sculpt/Pose or other required mode before an operator. Do not assume the user's current mode is suitable.
- Use `bpy.context.temp_override(...)` when an operator requires a specific window, area, region, scene, view layer, or active object and an explicit override is safer than disturbing unrelated UI state.
- Prefer a Blender operator when the operation is naturally defined as an operator and its context/Undo semantics are useful.
- Prefer direct data APIs for precise structural or batch edits where operator selection/mode/UI side effects are unnecessary.
- Do not call an operator merely because an equivalent UI action exists; verify its `poll()` requirements and resulting side effects.

## Mesh editing

- For Object Mode mesh manipulation, use the Mesh/BMesh workflow appropriate to the operation and update the Mesh after writes.
- In Edit Mode, use `bmesh.from_edit_mesh()` and flush changes with `bmesh.update_edit_mesh()`; do not treat Edit Mode mesh state as an ordinary detached Mesh copy.
- Keep topology-changing operations aware of dependent UVs, vertex groups, shape keys, skinning, custom attributes, and project asset contracts.

## Transforms and evaluated data

- Distinguish local, parent-relative, object-space, and world-space data.
- Use matrices for world-space reads/writes when parenting or non-trivial transforms make separate location/rotation/scale reasoning ambiguous.
- Check `rotation_mode` before writing Euler, quaternion, or axis-angle rotation data.
- Do not apply transforms mechanically. Applying scale/rotation/origin changes can affect modifiers, rigs, constraints, animation, physics, shape keys, and export behavior.
- Use the evaluated dependency graph when the task requires modifier/evaluated geometry or other computed state; do not mistake source mesh data for evaluated output.
- Refresh/update the relevant data before validating computed properties after mutations.

## Threading and lifetime

- Treat Blender API access as main-thread/editor-owned unless Blender explicitly documents another boundary.
- Do not keep background Python threads that call Blender APIs after the originating script/tool has returned.
- Keep callbacks, handlers, timers, temporary data, and subscriptions bounded and clean them up when the task creates them.

## Undo, saving, and persistence

- Preserve Blender Undo semantics for user-facing mutations. Operators that intentionally mutate data should participate in Undo according to Blender's operator contract.
- Do not create arbitrary extra Undo steps after every low-level assignment. Group one logical agent operation into a reviewable bounded change when practical.
- Inspect whether the current file is saved and whether it has unsaved changes before overwriting or saving.
- Save only when the task/workflow requires persistence, and never invent a path for an unsaved `.blend`.
- Do not reset preferences, factory state, workspaces, scenes, or user configuration as a shortcut.

## Optional coordination

- `blender-modeling` for mesh/topology/UV/modifier authoring.
- `blender-materials-texturing` for materials, images, baking, and texture workflows.
- `blender-rigging-animation` for armatures, skinning, Actions, NLA, and deformation animation.
- `blender-mcp` for official Blender Lab MCP automation.
- `blender-unity` for Blender-to-Unity asset preparation.
- `python-core` only when ordinary project Python outside Blender's embedded runtime is actually in scope.

## Review checklist

- [ ] Exact Blender 5.2 patch was established from project/runtime evidence.
- [ ] Object/data-block ownership and shared users were checked before mutation.
- [ ] Context, selection, active object, mode, and operator requirements are explicit.
- [ ] Mesh editing uses the correct Object/Edit Mode API.
- [ ] Transform and evaluated-data spaces are not conflated.
- [ ] Blender API calls remain within a safe lifetime/thread boundary.
- [ ] Undo and save behavior are intentional and bounded.
- [ ] No separately installed `bpy` package was assumed for in-Editor work.
