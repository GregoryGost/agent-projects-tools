# Blender 5.2 to Unity 6.3 asset pipeline rules

Apply this rule only when `CODEX_PROJECT.md` declares the `blender-unity` profile active, or when this source artifact is maintained directly in the template repository.

This is a Blender-side integration overlay for preparing graphical assets for Unity 6.3 / `6000.3.x`. The priority verified baseline is Blender `5.2.2 LTS` with Unity `6000.3.24f1`.

## Required skills

Use together with:

- `blender-core`;
- `blender-unity`.

Required base rule:

- `.codex/rules/blender_core.md`.

The mutual `blender_unity.md ↔ blender-unity` pair is intentional.

## Source of truth

Before changing the Blender→Unity asset boundary:

1. Confirm the exact Blender 5.2 patch.
2. Confirm Unity `6000.3.x` and exact patch from the target project's `ProjectSettings/ProjectVersion.txt`.
3. Inspect the project's render pipeline/packages, existing ModelImporter/TextureImporter conventions, asset naming/layout, materials/shaders, rigs/animation setup, LOD conventions, and target platforms.
4. Read the project's Blender source/export policy and export preset when present.
5. Do not replace established project conventions with portable defaults merely because another Unity project uses them.

## Source and interchange boundary

- Treat `.blend` as Blender authoring/source data unless the project explicitly chooses another source format.
- Prefer a standard interchange artifact such as FBX for production Unity model import when no project-specific alternative is declared.
- Do not make direct `.blend` import the portable default: it couples Unity import to a compatible Blender installation and DCC conversion environment.
- Keep texture files as explicit project assets according to project policy rather than relying on FBX embedded media as the default.
- Export only intended runtime objects/data. Do not leak cameras, lights, control rigs, hidden helpers, high-poly sources, cages, or unrelated collections unless the target asset contract needs them.

## Units, axes, and transforms

- Author assets at meaningful physical scale. Unity's portable expectation is `1 Unity unit = 1 meter`; project exceptions must be explicit.
- Inspect Blender scene units and object transforms; do not infer correct world scale from object scale values alone.
- Use the FBX/exporter and Unity importer axis-conversion mechanisms. Do not pre-rotate every Blender object by a hard-coded `-90° X` or similar compensation.
- Treat Blender FBX defaults such as `axis_forward='-Z'`, `axis_up='Y'`, unit scaling, and space transform as exporter policy to verify/pin, not a reason to add duplicate manual conversions.
- Do not use Blender FBX `bake_space_transform` as a universal orientation fix; it is an experimental boundary and needs specific validation, especially for armatures/animation.
- Apply transforms/origin changes only when the asset/import contract requires them and dependent modifiers/rigs/animation were checked.

## Mesh, normals, tangents, and UV

- Export polygonal/evaluated geometry appropriate for the asset.
- Decide modifier application/evaluated export per asset type. Do not blindly enable mesh-modifier application when Shape Keys or other topology-sensitive data must survive.
- Keep face orientation, smoothing/custom normals, UVs, material slots, and triangulation behavior consistent with the Unity importer policy.
- Let the project decide whether Unity imports normals/tangents or calculates them. Do not force one portable choice.
- Remember that UV seams, hard normals, material boundaries, and attributes can split downstream vertices; Blender geometric vertex count is not a complete runtime-vertex budget.
- Keep lightmap/detail/additional UV-channel ownership explicit.

## Materials, textures, and shaders

- Blender materials/Shader Nodes are authoring/lookdev data, not Unity runtime shaders.
- Transport portable texture/mask data and recreate/map runtime materials in Unity according to the active render pipeline (Built-in/URP/HDRP/custom).
- Keep color textures and numeric/data textures semantically distinct through export/import.
- Normal-map convention must be declared. Prefer importer/pipeline conversion over repeatedly editing source images ad hoc.
- Blender Roughness and Unity Smoothness/Gloss semantics are inverse concepts unless a project-specific shader says otherwise. Transform/pack channels deliberately.
- Channel packing, alpha ownership, texture format, compression, and resolution are project/target-platform policy.

## Rigs, animation, and blend shapes

- Export the runtime deformation skeleton and required animation data, not the entire Blender control rig by default.
- Treat constraints/IK/drivers as authoring features unless baked or explicitly supported by the target pipeline.
- Keep Humanoid/Generic/Legacy rig import choice, Avatar mapping, root-motion ownership, clip splitting, and animation file packaging as Unity/project policy.
- Preserve Shape Key/Blend Shape topology and validate their import when present.
- Use the smallest practical runtime bone/influence set, but do not invent a universal project limit.

## LOD

- Authored Blender LOD source meshes belong to modeling; Unity LOD import/naming and `LODGroup` setup belong to this integration boundary.
- When the project uses Unity's DCC naming convention, keep `_LOD0`, `_LOD1`, ... groups consistent and validate the generated/imported LOD setup.
- Do not invent reduction percentages or screen-relative thresholds; they depend on target platforms and project performance goals.

## Ownership after import

- Blender owns source authoring and export preparation.
- Unity owns ModelImporter/TextureImporter settings, Unity Materials/Shaders, AnimationClip import settings, Avatar/Animator configuration, Prefabs, colliders, and `LODGroup` runtime setup.
- Prefer Unity Editor APIs for Unity-owned serialized/import state when `unity-editor` is active. Do not text-edit Unity `.meta` files as a normal Blender pipeline step.

## Validation

Use the narrowest validation that proves the change:

1. validate Blender source structure/data;
2. validate visible result in Blender when appearance/deformation matters;
3. export the intended interchange asset;
4. validate the imported asset in Unity when the target project is available.

Re-import FBX into Blender as a diagnostic when changing exporter presets or investigating scale/axis/rig/animation/data-loss problems. Do not require a full round trip for every ordinary asset edit.

## Optional coordination

- `blender-modeling`, `blender-materials-texturing`, and `blender-rigging-animation` for their authoring domains.
- `blender-mcp` for live Blender automation.
- `unity-editor` for Unity-owned importer/material/prefab/animation settings.
- `unity-cli` for discovered live Unity Editor validation or batch/CI workflows.

## Review checklist

- [ ] Exact Blender and Unity version lines were confirmed.
- [ ] Source/interchange ownership and export target are explicit.
- [ ] Scale/axis conversion is handled once, not duplicated manually.
- [ ] Modifier/Shape Key, normals/UV, texture, rig/animation, and LOD boundaries match the asset type.
- [ ] Blender material semantics are not confused with Unity runtime shader semantics.
- [ ] Unity-owned import/runtime state remains on the Unity side.
- [ ] Validation is proportional to the change and uses Unity import evidence when needed.
