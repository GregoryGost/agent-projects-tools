# Actions, Slots, NLA, Shape Keys, And Baking

## Blender 5.2 Actions and Slots

Blender 5.x Actions can contain slots. Low-level animation code must reason about:

- Action;
- Action Slot;
- animated ID type/data-block;
- F-Curves/keyframes belonging to that slot.

Do not rely on old snippets that only assign `animation_data.action` and then assume every curve relationship is resolved.

Use the Blender 5.2 API for the exact assignment/slot operation being performed.

## NLA

Inspect tracks, strips, action/slot relationship, strip timing/scale/repeat, blend mode/influence, and muted/solo state.

Do not flatten NLA merely to simplify code unless the target requires baking.

## Shape Keys

All keys share mesh topology.

Before topology changes, detect Shape Keys and determine whether topology is allowed to change.

Review Basis, relative/absolute mode, values/ranges, drivers, animation, and deformation/normals.

## Baking

Before bake/export, establish FPS, frame range, channels, object/armature/root ownership, constraint/driver evaluation, and interpolation/sampling policy.

Keep source control animation separate from baked runtime copies when practical.
