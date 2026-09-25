---
name: blender-modeling
description: "Use for Blender 5.2 mesh modeling, topology, modifiers, normals, UVs, transforms/origins, high-low workflows, source LODs, and modeling validation."
---

# Blender 5.2 Modeling

Use this skill for Blender 5.2 mesh authoring and review.

## Required Dependencies

Required skills:

- `blender-core`.

Required rules:

- `.codex/rules/blender_core.md`;
- `.codex/rules/blender_modeling.md`.

The mutual `blender_modeling.md ↔ blender-modeling` pair is intentional.

## Workflow

1. Confirm the active Blender 5.2 profile and exact patch.
2. Inspect dimensions/transforms, topology, modifier stack, normals/smoothing, UV layers, materials, Shape Keys, vertex groups, and rig dependencies.
3. Read project budgets/naming/modular-grid/UV/LOD policies.
4. Decide whether the requested result should remain procedural/non-destructive or become finalized geometry.
5. Make the smallest topology/modifier/UV change that satisfies the asset intent.
6. Validate source and evaluated mesh state, shading, UVs, dimensions, and dependent data.
7. Apply optional material/rig/MCP/Unity overlays only when active.

Load:

- `references/topology-modifiers-and-transforms.md`.
- `references/normals-uv-and-lod.md`.
- `references/review-checklist.md`.
- `references/official-sources.md`.

## Modeling decisions

- Preserve modifiers while iteration benefits from them; apply only for a concrete downstream boundary.
- Treat topology as a contract with shading, UVs, weights, Shape Keys, and export.
- Keep origins/pivots meaningful for placement/hinges/modular snapping/animation.
- Treat UV seams/packing/overlaps as intentional design, not automatic cleanup targets.
- Do not invent polygon, texel-density, or LOD-reduction budgets.

## Guardrails

- No destructive topology edit without checking Shape Keys/weights/attributes.
- No automatic `-90°` rotation or transform application for "game engine compatibility".
- No blanket triangulation/custom-normal cleanup without an export/shading reason.
- No destructive LOD/high-low reduction as the only retained source.
