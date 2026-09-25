---
name: blender-unity
description: "Use for Blender 5.2 to Unity 6.3 asset preparation: FBX, scale/axes, meshes/UV/normals, textures/material data, rigs/animation, blend shapes, LOD, and import validation."
---

# Blender To Unity

Use this skill for the Blender-side asset contract targeting Unity 6.3 / `6000.3.x`.

Priority verified baseline: Blender `5.2.2 LTS` → Unity `6000.3.24f1`.

## Required Dependencies

Required skills:

- `blender-core`.

Required rules:

- `.codex/rules/blender_core.md`;
- `.codex/rules/blender_unity.md`.

The mutual `blender_unity.md ↔ blender-unity` pair is intentional.

## Workflow

1. Confirm the exact Blender 5.2 and Unity 6000.3 patch.
2. Inspect the target Unity project's render pipeline, importer conventions, target platforms, material/shader setup, rig/animation/LOD conventions, and existing comparable assets.
3. Inspect Blender source asset state and choose the declared interchange/export preset.
4. Prepare only the data the runtime asset needs.
5. Export with scale/axis/transform/modifier/animation behavior explicit.
6. Validate the interchange output when the boundary changed materially.
7. Import/refresh in Unity and validate the Unity-owned importer/material/rig/clip/LOD state when the Unity project is available.
8. Keep Blender and Unity ownership boundaries separate.

Load:

- `references/fbx-scale-axes-and-mesh.md`.
- `references/materials-textures-and-shaders.md`.
- `references/rigs-animation-blendshapes-and-lod.md`.
- `references/export-import-validation.md`.
- `references/review-checklist.md`.
- `references/official-sources.md`.

## Portable defaults

- `.blend` is source authoring data; FBX is the default portable production model interchange when the project has no different declared standard.
- Unity expects physical scale around `1 unit = 1 meter`.
- Use exporter/importer axis conversion instead of hard-coded object pre-rotation.
- Keep textures external/project-owned rather than relying on embedded FBX media by default.
- Treat Blender materials as lookdev/source intent, not Unity runtime Shader Graph/HLSL.
- Keep normal convention, Roughness→Smoothness conversion, packed channels, rig type, root motion, clip packaging, and LOD thresholds explicit/project-specific.

## Ownership boundary

Blender owns source geometry, UVs, texture generation/baking, rig/animation authoring, and export preparation.

Unity owns importer settings, runtime materials/shaders, Avatar/AnimationClip import configuration, Prefabs, colliders, and `LODGroup` runtime setup.

Apply `unity-editor` or `unity-cli` only when those profiles are active; they are optional coordination, not hard dependencies of this Blender integration profile.

## Guardrails

- No direct `.blend` import as a portable default.
- No universal `-90° X` fix.
- No universal `bake_space_transform=True`; it needs specific validation, especially for rigs/animation.
- No blind modifier application when Shape Keys must survive.
- No universal poly/texture/bone/LOD budgets.
- No direct textual Unity `.meta` editing from the Blender side.
