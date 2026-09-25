# Files, Transforms, And Evaluation

## File state

Before saving, inspect:

- `bpy.data.filepath`;
- whether the file has ever been saved;
- dirty/unsaved-change state when available through the active tool;
- target path ownership.

Do not invent an output path for an unsaved file.

Do not call save/save-as as an incidental final line in every script. Persistence is a separate side effect.

## Coordinate spaces

Keep these distinct:

- mesh vertex coordinates: Object space;
- Object location/rotation/scale: local/parent-relative transform state;
- `matrix_world`: world transform;
- evaluated object/mesh: result after dependencies/modifiers.

For parented objects, use matrices instead of manually composing location/rotation/scale when world-space correctness matters.

Check `rotation_mode` before writing rotation properties.

## Applying transforms

Applying scale/rotation changes where transform information lives. It may affect:

- modifiers;
- constraints;
- armatures;
- children;
- animation;
- physics;
- export results.

Apply only when required by the asset/tool contract.

## Evaluated dependency graph

Source mesh data is not the same as the evaluated result when modifiers, Geometry Nodes, armatures, or other dependencies are active.

When measuring/export-validating final geometry, obtain the evaluated object through the dependency graph and inspect the evaluated mesh/result.

Release temporary evaluated meshes according to the API contract; do not retain stale evaluated data across later scene changes.

## Units

Do not assume project units. Inspect `scene.unit_settings`.

For target-engine overlays, translate the project's physical-scale policy into Blender dimensions and export/import settings rather than hiding scale differences in arbitrary Object scale values.
