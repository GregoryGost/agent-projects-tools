# Context, Modes, Mesh Editing, And Undo

## Context-sensitive operators

Many `bpy.ops` calls depend on current mode, active Object, selection, View Layer, and sometimes window/area/region.

Before an operator:

1. inspect current mode;
2. establish the intended active Object;
3. establish the intended selection;
4. verify the operator's `poll()` requirements;
5. use `bpy.context.temp_override(...)` when a specific UI/context member is required.

Do not permanently switch unrelated user workspace/area state merely to satisfy an operator if an explicit override is available.

## Operators versus data API

Use operators when the operation is naturally a Blender action and its context/Undo behavior is useful.

Use direct data APIs when:

- creating or editing many data-blocks deterministically;
- selection/mode side effects add no value;
- the data contract is clearer than the UI operator contract.

Do not turn this into a blanket "never use bpy.ops" or "always use bpy.ops" rule.

## BMesh

Object Mode pattern:

```python
bm = bmesh.new()
bm.from_mesh(mesh)
# mutate bm
bm.to_mesh(mesh)
bm.free()
mesh.update()
```

Edit Mode pattern:

```python
bm = bmesh.from_edit_mesh(mesh)
# mutate bm
bmesh.update_edit_mesh(mesh)
```

Do not mix these boundaries casually. Edit Mode maintains an edit BMesh that must be flushed back.

## Undo

An operator that mutates Blender data should participate in Blender Undo according to its operator definition.

For agent-generated low-level data edits:

- keep a single logical operation bounded;
- avoid artificial undo pushes after every assignment;
- prefer a project/tool-owned operator wrapper when a complex recurring mutation needs reliable one-step Undo.

After mutation, verify the actual resulting state rather than assuming Undo configuration implies success.
