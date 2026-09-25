---
name: blender-materials-texturing
description: "Use for Blender 5.2 materials, Shader Nodes lookdev, images, color spaces, texture painting, baking, normal maps, masks, and channel packing."
---

# Blender 5.2 Materials And Texturing

Use this skill for Blender material/lookdev, image-texture, painting, and baking work.

## Required Dependencies

Required skills:

- `blender-core`.

Required rules:

- `.codex/rules/blender_core.md`;
- `.codex/rules/blender_materials_texturing.md`.

The mutual `blender_materials_texturing.md ↔ blender-materials-texturing` pair is intentional.

## Workflow

1. Confirm Blender version, render engine, color-management settings, and active project texture policy.
2. Inspect material slots/nodes, Images and their sources/packing, UV maps, paint/bake targets, and output paths.
3. Classify each texture as display color or numeric/data.
4. Define the material/lookdev or bake contract before changing nodes/images.
5. Perform bounded authoring/baking and explicitly save generated/painted image files when required.
6. Validate node assignments, color spaces, bake output, normal convention, channel semantics, and external paths.
7. Apply `blender-unity` only for target-engine transport semantics.

Load:

- `references/pbr-images-and-color-space.md`.
- `references/painting-baking-and-normal-maps.md`.
- `references/review-checklist.md`.
- `references/official-sources.md`.

## Baseline

- Blender material graphs are authoring/lookdev data, not portable runtime shaders.
- Color and data textures have different color-space semantics.
- Baking requires an explicit source, target image, UV, pass, output policy, and validation.
- Normal convention and packed-channel meaning must be declared.
- Saving a `.blend` does not automatically prove external image files were saved.

## Guardrails

- No universal texture size/format/compression policy.
- No treating Roughness as identical to an engine Smoothness/Gloss channel.
- No blind green-channel flips for normal maps.
- No overwrite of source/library textures as an incidental bake/paint step.
