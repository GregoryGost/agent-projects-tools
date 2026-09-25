# FBX, Scale, Axes, And Mesh

## Source and interchange

Portable baseline:

```text
.blend
  source authoring
    ↓
FBX
  interchange
    ↓
Unity ModelImporter
```

A project may choose a different interchange format, but do not use direct `.blend` import as the reusable default.

## Scale

Unity's portable modeling expectation is approximately:

```text
1 meter = 1 Unity unit
```

Validate actual dimensions, Blender unit settings, FBX export scaling, and Unity ModelImporter scale as one chain.

Do not compensate for a scale problem by arbitrarily scaling the mesh in multiple places.

## Axes

Blender and Unity use different coordinate-system conventions. Use exporter/importer conversion once.

Blender 5.2 FBX API baseline includes axis controls such as:

```text
axis_forward = '-Z'
axis_up = 'Y'
apply_unit_scale = True
use_space_transform = True
```

Project presets remain authoritative.

Do not hard-code an extra object `-90° X` rotation as a general Unity fix.

`bake_space_transform` is an experimental FBX option and should not be a portable default, especially for armature/animation assets.

## Mesh/modifiers

Decide whether the export should contain source mesh, evaluated modifier result, or explicit applied geometry.

Do not blindly apply/export modifiers when Shape Keys or topology-dependent data must survive.

## Normals/tangents/triangles

Unity can import or calculate normals/tangents depending on importer policy.

Keep face orientation, smoothing/custom normals, UV maps, triangulation, and material slots consistent with the declared importer strategy.

Downstream vertex count may exceed Blender's geometric vertices because of splits at normals, UVs, materials, and attributes.
