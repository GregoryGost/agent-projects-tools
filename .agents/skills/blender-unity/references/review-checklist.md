# Blender To Unity Review Checklist

## Version/project

- [ ] Blender 5.2 patch is known.
- [ ] Unity 6000.3 patch is read from the project.
- [ ] Render pipeline/target platforms/import conventions were inspected.

## Export

- [ ] Source versus interchange asset ownership is clear.
- [ ] Export includes only intended runtime data.
- [ ] Scale and axes are converted once.
- [ ] No universal manual `-90°` fix was added.
- [ ] Experimental space-transform behavior was not enabled casually.
- [ ] Modifier/Shape Key compatibility was checked.

## Mesh/material

- [ ] Normals/tangents/UV policy matches Unity importer settings.
- [ ] Blender material is not treated as Unity runtime shader.
- [ ] Color/data texture semantics are preserved.
- [ ] Normal convention and Roughness/Smoothness conversion are explicit.
- [ ] Channel packing comes from project policy.

## Rig/animation/LOD

- [ ] Runtime skeleton excludes unnecessary authoring controls where appropriate.
- [ ] Constraints/IK required at runtime were baked or otherwise handled.
- [ ] Rig type/root motion/clip packaging come from Unity project policy.
- [ ] Blend Shapes were validated when present.
- [ ] LOD naming/setup matches project convention.

## Validation

- [ ] Unity import result was checked when available.
- [ ] Full round trip was used only when it adds diagnostic value.
- [ ] Unity-owned serialized/import state was not text-edited from Blender workflow.
