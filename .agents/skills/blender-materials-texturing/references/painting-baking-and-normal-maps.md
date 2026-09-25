# Texture Painting, Baking, And Normal Maps

## Texture painting

Before painting:

- confirm active material and image node;
- confirm intended UV map;
- verify image dimensions/format/color space;
- determine save destination.

After painting, explicitly save external images required by the project.

## Baking

A bake request should define source object(s), target object, target Image, UV map, resolution, pass, margin, render engine, selected-to-active policy, ray distance/cage where used, and output file.

Validate the image after baking rather than assuming the operator succeeded.

Common failure evidence includes black/empty regions, projection misses, seams, inverted/incorrect normals, wrong active image, or wrong color-space interpretation.

## Tangent-space normal maps

Tangent normals depend on UV/tangent basis.

Keep the normal convention explicit. Blender commonly authors OpenGL-style tangent normals; target engines/importers may have a different convention or conversion switch.

Do not modify the source image repeatedly to compensate for an importer configuration problem.

## Roughness / smoothness

Roughness and Smoothness/Gloss are opposite semantic directions in common PBR workflows.

If a target shader expects Smoothness:

```text
smoothness = 1 - roughness
```

subject to the target project's exact material convention.

Do not copy one channel to the other unchanged merely because both are grayscale.
