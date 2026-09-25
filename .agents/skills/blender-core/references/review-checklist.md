# Blender Core Review Checklist

## Version and scope

- [ ] Exact Blender 5.2 patch is known.
- [ ] Active profile and project policy were read.
- [ ] A standalone `bpy` package was not assumed for normal Blender Editor work.

## Data ownership

- [ ] Object/data-block separation is respected.
- [ ] Shared data users were checked.
- [ ] Linked/library data ownership is explicit.
- [ ] Created Objects are linked to intended Collections.
- [ ] No broad orphan purge/delete occurred without scope.

## Context and mutation

- [ ] Mode, selection, and active Object are explicit.
- [ ] Operator context/poll requirements are satisfied.
- [ ] Edit Mode mesh changes use the edit BMesh boundary.
- [ ] Incidental UI/context state is restored when practical.

## Transforms/evaluation

- [ ] Coordinate spaces are not conflated.
- [ ] Transform application is intentional.
- [ ] Evaluated data is used when final modifier/deformation state matters.

## Persistence

- [ ] Save path/state is known.
- [ ] Save/overwrite is intentional.
- [ ] Undo behavior is bounded and reviewable.
