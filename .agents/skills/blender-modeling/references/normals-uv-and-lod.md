# Normals, UV, High-Low, And LOD

## Normals and smoothing

Review face orientation, smooth/flat shading, sharp edges, custom split normals, weighted-normal/bevel interaction, and topology around hard transitions.

Hard edges, UV seams, material boundaries, and other splits can increase downstream runtime vertices. Do not equate Blender geometric vertex count with GPU vertex count.

## UV

Create seams where they balance distortion, paint/bake usability, and hidden placement.

Review island orientation/scale, unwanted overlap, intentional mirrored/stacked overlap, padding for the intended bake/filtering, and multiple UV map ownership.

Do not normalize all island scale or eliminate all overlaps without project intent.

## High/low workflows

Keep roles explicit:

```text
high source
low/runtime
cage (optional)
collision (optional)
LOD0..N (optional)
```

After simplification, re-check silhouette, shading, normals, UVs, and bake compatibility.

## LOD source geometry

LOD meshes may be authored in Blender, but reduction percentage and screen-space thresholds are target/project policy.

Preserve a higher-quality editable source and derive lower levels from it rather than repeatedly reducing the previous LOD when that accumulates avoidable artifacts.
