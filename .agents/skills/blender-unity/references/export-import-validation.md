# Export / Import Validation

Use proportional validation.

## Ordinary asset change

```text
Blender structural validation
→ Blender visual validation when needed
→ export
→ Unity import/refresh
→ Unity-side validation
```

Do not add a Blender re-import round trip to every routine edit.

## When to re-import FBX into Blender

Use a round-trip diagnostic when:

- changing the exporter preset;
- investigating scale/orientation;
- investigating missing objects/material slots/UV/normals;
- investigating rig/animation/Shape Key data loss;
- validating a new interchange convention.

The purpose is to isolate whether data was lost at export before debugging Unity.

## Unity-side evidence

When Unity project access is available, validate the actual imported result: ModelImporter scale/axis/settings, hierarchy/mesh/material slots, normals/tangents/UVs, rig/Avatar, AnimationClips, Blend Shapes, LODGroup, and TextureImporter/material/shader assignments.

Use `unity-editor` / `unity-cli` only when active.

## Do not text-edit Unity ownership

Do not "fix" importer configuration by editing `.meta`, prefab YAML, or serialized Unity assets as text when Unity APIs own the state.

## Failure isolation

If Unity result is wrong, isolate:

```text
Blender source
vs
FBX output
vs
Unity importer
vs
runtime material/rig/prefab setup
```

before changing source geometry blindly.
