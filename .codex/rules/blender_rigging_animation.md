# Blender 5.2 rigging and animation rules

Apply this rule only when `CODEX_PROJECT.md` declares the `blender-rigging-animation` profile active, or when this source artifact is maintained directly in the template repository.

This Blender 5.2.x overlay covers Armatures, bones, skinning, weights, constraints, IK/FK, Shape Keys, drivers, Actions, Action Slots, NLA, keyframes, and runtime-animation preparation.

## Required skills

Use together with:

- `blender-core`;
- `blender-rigging-animation`.

Required base rule:

- `.codex/rules/blender_core.md`.

The mutual `blender_rigging_animation.md ↔ blender-rigging-animation` pair is intentional.

## Source of truth

Before rigging or animation work:

1. Confirm the exact Blender 5.2 patch and active `blender-core` profile.
2. Inspect mesh topology, transforms, armatures, bone hierarchy/roll, deform flags, vertex groups/weights, constraints, drivers, Actions/Slots, NLA tracks, Shape Keys, frame rate/ranges, and project export policy.
3. Determine project-specific rig type, deform/control-bone policy, clip packaging, root-motion policy, and target-engine requirements before changing the rig.

## Armatures and skinning

- Keep control/authoring rig concepts distinct from the deformation/export skeleton when the project uses both.
- Preserve intentional bone hierarchy, orientation, naming, deform flags, and constraints.
- Normalize and review skin weights according to the project's deformation needs; do not blindly prune meaningful influences.
- Use the smallest practical bone/influence set for runtime assets, but do not impose a universal maximum when quality or platform requirements differ.
- Validate deformation at representative extreme poses, not only rest pose.

## Constraints, IK/FK, and drivers

- Treat constraints, IK/FK controls, custom properties, and drivers as authoring behavior unless the target pipeline explicitly transports them.
- Do not assume a target engine evaluates Blender constraints or drivers.
- Bake runtime-relevant motion when the interchange format/engine requires sampled transforms.
- Keep driver dependencies and custom-property ownership explicit; avoid hidden scene-global dependencies.

## Actions, Slots, and NLA

- Blender 5.2 Actions use Action Slots. Treat the active Action and its Slot as a pair when low-level `bpy` code assigns or inspects animation.
- Do not rely on pre-5.x snippets that ignore Action Slot semantics when version-sensitive behavior matters.
- Preserve NLA track/strip ordering, blend modes, extrapolation, muting, and time mapping intentionally.
- Use project clip/action naming rather than inventing a new convention.
- Keep animation frame range and FPS explicit when baking/exporting.

## Shape Keys

- Treat Shape Keys as topology-dependent. Do not reorder/add/remove vertices without understanding the effect on all keys.
- Complete or stabilize topology before substantial Shape Key authoring when practical.
- Preserve Basis/key relationships, relative/absolute mode, drivers, and animation intentionally.
- Validate deformations and normals after Shape Key edits.

## Animation baking and export preparation

- Bake only the channels/ranges needed by the target pipeline.
- Preserve source/control animation when creating a baked export representation; do not make destructive baking the only copy unless explicitly requested.
- Keep root/object/armature transform responsibilities clear before export.
- Root-motion behavior, Humanoid/Generic mapping, and clip splitting are target-engine/project decisions, not Blender-core defaults.

## Review checklist

- [ ] Rig/control/deform/export responsibilities are explicit.
- [ ] Weight and deformation quality were reviewed on representative poses.
- [ ] Constraints/drivers are not assumed to run in the target engine.
- [ ] Blender 5.2 Action Slot semantics are respected.
- [ ] Shape Key topology invariants are preserved.
- [ ] Bake range/FPS/channels and root-motion ownership are explicit.
