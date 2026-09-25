# Blender Data Model And Lifetime

## Object versus data

Blender separates scene objects from the data they reference.

Typical relationships:

```text
Object
├── transform / parent / constraints / visibility
└── data
    ├── Mesh
    ├── Curve
    ├── Armature
    ├── Camera
    └── Light
```

Multiple Objects may reference one data-block. Before changing mesh/material/armature data, inspect `users` and determine whether the change is intended for every user.

When a divergent edit is required, make the data single-user deliberately instead of accidentally changing all linked duplicates.

## Collections and scenes

Objects can be linked to more than one Collection. A Scene owns a collection tree and View Layers determine visibility/selectability.

Creating an Object through `bpy.data.objects.new(...)` does not make it visible in a scene until it is linked to a Collection.

Do not infer object ownership from the active Collection alone. Inspect `users_collection` and the relevant View Layer when behavior appears inconsistent.

## Removal and orphan data

Removing an Object and removing its data-block are separate operations.

Use unlink-aware removal only for data explicitly owned by the operation. Do not purge all orphans as generic cleanup: zero-user data may be intentionally retained while an artist is working.

## Linked libraries

Linked data can be read-only or owned by another `.blend`. Before changing linked data, identify:

- source library;
- direct/indirect linkage;
- whether the task expects an override/local copy;
- whether changing the source library is within scope.

Do not silently make linked data local simply to bypass an ownership constraint.

## Names

Blender resolves name collisions by suffixing names such as `.001`. Code that creates data should keep the returned object/data reference and report the actual resulting name.

Do not:

```python
bpy.ops.mesh.primitive_cube_add()
obj = bpy.data.objects["Cube"]
```

when another `Cube` may already exist.

Prefer:

```python
bpy.ops.mesh.primitive_cube_add()
obj = bpy.context.active_object
result = {"object": obj.name}
```
