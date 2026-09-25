---
name: blender-rigging-animation
description: "Use for Blender 5.2 armatures, skinning, weights, constraints, IK/FK, Shape Keys, drivers, Actions/Slots, NLA, baking, and animation review."
---

# Blender 5.2 Rigging And Animation

Use this skill for Blender rigging, deformation, and animation authoring/review.

## Required Dependencies

Required skills:

- `blender-core`.

Required rules:

- `.codex/rules/blender_core.md`;
- `.codex/rules/blender_rigging_animation.md`.

The mutual `blender_rigging_animation.md ↔ blender-rigging-animation` pair is intentional.

## Workflow

1. Confirm Blender 5.2 patch and inspect mesh topology/transforms.
2. Inspect Armature hierarchy, bone orientation/deform flags, vertex groups/weights, constraints, drivers, Actions/Slots, NLA, Shape Keys, FPS, and frame ranges.
3. Determine the authoring rig versus runtime/deformation/export skeleton responsibilities.
4. Make the smallest rig/animation change while preserving source/control data where practical.
5. Validate deformation at representative poses and animation at representative ranges.
6. Bake only when the target pipeline requires sampled runtime motion.
7. Apply `blender-unity` for Unity-specific rig/clip/root-motion/import choices.

Load:

- `references/armatures-skinning-and-controls.md`.
- `references/actions-slots-shape-keys-and-baking.md`.
- `references/review-checklist.md`.
- `references/official-sources.md`.

## Baseline

- Control constraints/IK/drivers are not assumed to execute in a target engine.
- Blender 5.2 Action Slot semantics are part of low-level animation ownership.
- Shape Keys are topology-dependent.
- Runtime bone/influence budgets and root-motion behavior are target/project policy.

## Guardrails

- No topology edit that silently invalidates Shape Keys/weights.
- No destructive bake that deletes the only editable source animation unless explicitly requested.
- No assumption that pre-5.x Action snippets completely describe Blender 5.2 animation assignment.
- No automatic removal of control bones/constraints without a defined export-rig strategy.
