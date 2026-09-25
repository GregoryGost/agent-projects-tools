# Materials, Textures, And Shaders — Blender To Unity

## Material boundary

Do not transport Blender Shader Nodes conceptually as if they were Unity runtime shaders.

```text
Blender material / lookdev
        ↓
portable texture/mask/parameter intent
        ↓
Unity Material + Shader Graph/HLSL/shader
```

The Unity render pipeline owns the runtime material implementation.

## Textures

Keep external texture files under project ownership rather than relying on FBX embedded media by default.

Classify textures as color, normal, mask/data, HDR/emission/environment, or project-specific packed data.

Unity TextureImporter settings own runtime import/compression/type behavior.

## Normal convention

Keep OpenGL/DirectX convention explicit.

Prefer a declared importer/pipeline conversion policy over destructive repeated edits of the source normal map.

Unity provides importer-side green-channel flipping for mismatched conventions.

## Roughness and Smoothness

Blender Principled uses Roughness semantics.

Common Unity workflows expose Smoothness/Gloss, where:

```text
smoothness = 1 - roughness
```

subject to the active shader's exact convention.

Do not pack Roughness directly into a Smoothness slot without the required inversion.

## Channel packing

Packing conventions vary by render pipeline and shader.

Declare exact ownership:

```text
R = ...
G = ...
B = ...
A = ...
```

before generating/rewriting packed maps.
