# Armatures, Skinning, And Control Rigs

## Armature ownership

Separate these concepts when the project uses them:

```text
control/authoring rig
    ↓ constraints / IK / drivers
deformation skeleton
    ↓ weighted vertices
export/runtime skeleton
```

They may be the same Armature in a simple asset, but do not assume that for complex rigs.

## Bones

Review hierarchy, names, head/tail/orientation/roll, deform flags, parent relationships, scale, constraints, and custom properties.

Do not remove non-deforming/control bones until the export strategy is known.

## Skin weights

Review representative poses and deformation areas rather than only normalized numeric values.

Check unweighted vertices, unexpected influences, normalization, symmetry when expected, joint collapse/candy-wrapper artifacts, and extreme pose behavior.

Runtime influence limits belong to the target platform/engine profile. Prefer the smallest set that preserves required deformation.

## Constraints and drivers

Constraints, IK/FK, and drivers are authoring systems unless the target specifically transports/evaluates them.

For runtime interchange, bake their visible motion to supported transforms/curves when required, while retaining editable source control data.
