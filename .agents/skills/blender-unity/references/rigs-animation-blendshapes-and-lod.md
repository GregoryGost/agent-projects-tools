# Rigs, Animation, Blend Shapes, And LOD — Blender To Unity

## Export skeleton

Prefer exporting the runtime deformation skeleton and required animation data rather than every control/helper object.

Constraints, IK/FK controllers, and drivers are Blender authoring systems unless the target explicitly supports them. Bake required visible motion into supported transforms/curves.

## Skinning

Minimize unnecessary bones and influences while preserving deformation quality.

Unity commonly benefits from four or fewer skin influences per vertex, but this is a performance baseline rather than an absolute portable rule. Project/platform quality requirements may justify more.

## Rig type

Unity project policy determines Generic/Humanoid/Legacy choice, Avatar mapping, Optimize Game Objects, and root-motion source.

Do not decide these from Blender alone.

## Animation clips

Both strategies are valid:

- multiple clips/actions in one exported model;
- separate animation FBX files such as `Model@walk.fbx`.

Use the project's existing convention.

Preserve FPS/frame range and bake required constraints/IK before export.

## Blend Shapes

Blender Shape Keys map to Unity Blend Shapes only when topology/export/import behavior preserves them.

Avoid topology-changing modifier/export options that invalidate Shape Keys.

Validate imported blend shape count/names/deformation where they matter.

## LOD

If the project uses Unity's DCC naming convention, keep names/groups such as:

```text
Asset_LOD0
Asset_LOD1
Asset_LOD2
```

Unity can build an `LODGroup` from recognized imported LOD naming.

Reduction percentage and transition thresholds are project/target-performance policy.
