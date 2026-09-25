# Topology, Modifiers, And Transforms

## Topology

Evaluate topology against the asset purpose:

- silhouette;
- deformation;
- shading;
- UV layout;
- baking;
- downstream LOD/collision/export.

Check for accidental duplicate vertices/faces, zero-area geometry, internal faces, non-manifold edges where closed manifold geometry is expected, flipped face orientation, and loose elements.

Do not treat every n-gon or pole as an error. The question is whether it produces stable modeling/shading/export results.

## Modifiers

Keep editable source modifiers while iteration benefits from them.

Before applying a modifier, check:

- whether the result is required by export;
- whether Shape Keys must survive;
- whether modifier order is intentional;
- whether shared mesh data would affect multiple Objects;
- whether the modifier depends on unapplied scale/other objects.

Inspect both source and evaluated geometry after material changes.

## Geometry Nodes

Geometry Nodes belongs to modeling when it generates/changes geometry.

For export, decide whether the pipeline exports evaluated realized geometry, retains procedural Blender source only, or needs special handling for instances/attributes.

Do not assume a target engine understands the Blender node graph itself.

## Origins and transforms

Origin placement may encode hinge/pivot, modular snapping point, placement anchor, animation center, or procedural reference.

Do not automatically center origins.

Use dimensions and actual physical intent rather than accepting arbitrary non-uniform Object scale when downstream modifiers/physics/export rely on scale.
