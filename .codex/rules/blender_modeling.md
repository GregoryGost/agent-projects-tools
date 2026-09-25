# Blender 5.2 modeling rules

Apply this rule only when `CODEX_PROJECT.md` declares the `blender-modeling` profile active, or when this source artifact is maintained directly in the template repository.

This is a modeling overlay for Blender 5.2.x. It covers mesh construction, topology, modifiers, normals/smoothing, UV geometry, high/low preparation, source LOD geometry, and geometry cleanup.

## Required skills

Use together with:

- `blender-core`;
- `blender-modeling`.

Required base rule:

- `.codex/rules/blender_core.md`.

The mutual `blender_modeling.md ↔ blender-modeling` pair is intentional.

## Source of truth

Before modeling work:

1. Confirm the exact Blender 5.2 patch and active `blender-core` profile.
2. Inspect object dimensions/transforms, modifier stack, mesh topology, UV layers, normals/smoothing, vertex groups, shape keys, materials, and any armature/deformation dependencies.
3. Read project-specific budgets, naming, modular-grid, UV, LOD, collision, and export policy from `CODEX_PROJECT.md` or project evidence.
4. Do not introduce universal polygon, texture, texel-density, or LOD-reduction budgets when the project has not declared them.

## Modeling and topology

- Prefer topology that serves deformation, shading, silhouette, UV, and downstream editing requirements rather than maximizing or minimizing polygon count in isolation.
- Keep manifoldness, winding, duplicate geometry, degenerate faces, accidental internal faces, and unintended loose elements reviewable.
- Treat n-gons, triangulation, poles, and dense local topology as design choices with downstream consequences, not blanket errors.
- Preserve topology when shape keys, skinning, authored vertex data, or other index-sensitive data requires it.
- Before destructive topology edits, detect dependent shape keys, vertex groups, UVs, attributes, and rigging.

## Modifiers and Geometry Nodes

- Prefer non-destructive modifiers while an asset remains under iteration.
- Apply a modifier only when the asset boundary, downstream tool, or requested finalization requires evaluated geometry.
- Preserve modifier order intentionally; do not reorder unrelated modifiers as cleanup.
- Treat Geometry Nodes as part of modeling when they generate or transform geometry, but do not create a separate Geometry Nodes profile unless the project requires a specialized node-system policy.
- When export requires realized/evaluated geometry, validate the evaluated result rather than assuming the source mesh matches it.

## Transforms, origins, and dimensions

- Model to meaningful real dimensions according to the active project/unit profile.
- Do not use object scale as a hidden substitute for intended geometry dimensions when downstream operations depend on physical scale.
- Apply scale/rotation only when the operation or export contract requires it and dependent rig/animation/modifier behavior has been checked.
- Treat origin/pivot placement as an asset contract. Do not recenter an origin mechanically when placement encodes doors, hinges, modular snapping, placement anchors, or animation pivots.

## Normals and smoothing

- Validate face orientation and shading before export.
- Keep smooth/flat shading, sharp edges, custom split normals, weighted normals, bevels, and topology aligned with the intended visual result.
- Account for the fact that normal/UV/material-boundary splits can increase downstream vertex count even when Blender reports fewer geometric vertices.
- Do not add custom normals or triangulation unless they solve a concrete shading/export requirement.

## UV authoring

- UV seams, unwrap, islands, packing, overlaps, and UV layers belong to modeling; texture semantics and bake/color-space policy belong to `blender-materials-texturing`.
- Balance seam count against distortion and place seams intentionally.
- Preserve intentional overlaps/mirroring when allowed by the material/bake workflow; do not "fix" all overlaps without understanding their purpose.
- Keep multiple UV maps explicitly named/owned when the project uses separate texture, lightmap, detail, or other coordinate sets.
- Do not invent a texel-density target when the project has not declared one.

## High/low and LOD source geometry

- Keep high-poly, low-poly, cage, collision, and LOD source meshes distinguishable by project naming/collection policy.
- Preserve a non-destructive source where practical instead of making destructive reduction the only copy.
- Validate silhouette, shading, UVs, normals, and bake compatibility after reduction.
- LOD percentages and screen thresholds are project/engine policy, not portable Blender defaults.

## Review checklist

- [ ] Topology decisions match the asset's deformation/shading/export purpose.
- [ ] Modifier and evaluated-geometry behavior is intentional.
- [ ] Transform/origin changes do not break dependent systems.
- [ ] Normals, smoothing, UVs, and topology were reviewed together.
- [ ] Shape keys/weights/attributes were checked before topology changes.
- [ ] No universal polygon/texel/LOD budget was invented.
