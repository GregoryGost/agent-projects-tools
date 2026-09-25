# PBR, Images, And Color Space

## Lookdev

Use Blender materials to express source visual intent.

Principled BSDF is a useful Blender 5.2 PBR-style basis, but target engines may use different parameters, packing, BRDF implementation, or shader features.

Do not treat node-graph similarity as proof of runtime equivalence.

## Image semantic classification

Classify images before configuring them.

### Display/color data

Examples:

- Base Color / albedo;
- painted color;
- emissive color when treated as color.

These participate in the active color-management workflow.

### Numeric/data textures

Examples:

- tangent normal;
- roughness;
- metallic;
- AO;
- height;
- masks;
- packed channels.

These should be treated as numeric data. Avoid unintended display transforms.

## External and packed images

An Image data-block can reference an external file or contain packed/generated data.

Before export or hand-off, check source type, filepath, packed state, dirty/unsaved image state, bit depth/format, and destination ownership.

Do not assume `.blend` persistence equals external texture persistence.

## Channel packing

Define channel meaning explicitly:

```text
R = ...
G = ...
B = ...
A = ...
```

Never infer a project's packing convention from one asset unless the project declares it as policy.
