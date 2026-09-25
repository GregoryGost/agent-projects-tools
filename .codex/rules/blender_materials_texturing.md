# Blender 5.2 materials and texturing rules

Apply this rule only when `CODEX_PROJECT.md` declares the `blender-materials-texturing` profile active, or when this source artifact is maintained directly in the template repository.

This Blender 5.2.x overlay covers Images, materials, Shader Editor lookdev, texture painting, baking, color-space semantics, normal maps, masks, packed channels, and texture asset ownership.

## Required skills

Use together with:

- `blender-core`;
- `blender-materials-texturing`.

Required base rule:

- `.codex/rules/blender_core.md`.

The mutual `blender_materials_texturing.md ↔ blender-materials-texturing` pair is intentional.

## Source of truth

Before material/texture work:

1. Confirm the exact Blender 5.2 patch and active `blender-core` profile.
2. Inspect render engine, material slots, node graphs, image data-blocks, image file paths/packing, UV maps, color-management settings, bake targets, and project texture conventions.
3. Determine project-declared PBR workflow, texture naming, output formats, bit depth, resolution policy, normal convention, channel packing, and destination paths.
4. Do not infer an engine runtime shader from a visually similar Blender material.

## Material and lookdev boundary

- Use Blender material nodes as an authoring/lookdev representation.
- Prefer Principled BSDF for portable PBR-style lookdev when it represents the material intent cleanly, while preserving project-specific node setups where they are intentional.
- Separate visual intent from transport: procedural nodes, unsupported node graphs, and Blender-only effects may need baking or a target-engine material implementation.
- Do not flatten an editable node graph merely to make it "simpler" unless the asset boundary requires it.

## Images and color spaces

- Classify every image by semantic role before assigning color-space behavior.
- Treat color imagery according to the active color-management workflow.
- Treat normal maps, masks, packed numeric channels, height/displacement data, and similar numeric textures as data rather than display color.
- Do not apply display/color transforms to data textures merely because they are stored in common image formats.
- Preserve bit depth and dynamic range where the asset requires it; do not convert to 8-bit by default.
- Keep external image paths and packed-image state intentional. A Blender file containing an image data-block does not prove the external texture asset has been saved.

## UV use and texture painting

- Consume the UV layout supplied by modeling and verify the intended UV map is active for painting/baking.
- Save modified image buffers explicitly according to project policy; do not assume saving the `.blend` writes every external image file.
- Keep paint targets, masks, stencils, and generated files inside declared project locations.
- Do not overwrite source textures or external libraries as an incidental painting/bake step.

## Baking

- Establish bake purpose, source, target image, UV map, resolution, margin, color space, ray/cage policy, and render engine before baking.
- Use bake passes appropriate to the desired transport data: for example Base Color, Normal, AO, emission, or project-defined masks.
- For tangent-space normal baking, keep tangent basis, UV map, and target-engine normal convention explicit.
- Validate baked results for seams, projection misses, gradients, clipping, color-space mistakes, and unexpected black/transparent regions.
- Keep high/low/cage relationships explicit when projection baking is used.

## Normal maps and packed channels

- Do not assume OpenGL/DirectX normal-map convention from filename alone.
- Record/declare the convention at the project boundary and convert in the owning pipeline rather than repeatedly flipping data ad hoc.
- Do not treat Blender Roughness and an engine's Smoothness/Gloss channel as the same numeric meaning without verifying the target convention.
- Channel packing is project-specific. Document channel ownership before writing packed textures and preserve unused/alpha channels intentionally.

## Performance and reuse

- Reuse shared materials/images when sharing is intentional; make data single-user before divergent edits.
- Avoid duplicated high-resolution images and redundant material slots without a concrete reason.
- Do not impose universal texture resolution or compression limits; those belong to project/target-platform policy.

## Optional coordination

- `blender-modeling` when UV creation or geometry changes are required.
- `blender-mcp` for live authoring/inspection through official Blender MCP.
- `blender-unity` for Unity texture/material transport semantics.

## Review checklist

- [ ] Image semantic role and color-space treatment are explicit.
- [ ] Material lookdev is not confused with a target-engine runtime shader.
- [ ] External/packed image ownership and unsaved image buffers were checked.
- [ ] Bake source/target/UV/cage/pass/output are explicit and validated.
- [ ] Normal-map convention and packed-channel meanings are declared.
- [ ] No universal resolution/compression policy was invented.
