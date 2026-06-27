# Agent Material Routing Review Checklist

Use this checklist when adding reusable rules or skills.

## Portability

- [ ] The material does not assume one concrete project layout unless declared as configurable.
- [ ] Project-specific scripts, ports, URLs, artifact paths, and package-manager choices are not hardcoded.
- [ ] Dependencies are not added implicitly.
- [ ] Official sources are listed when external tools, frameworks, or plugins are referenced.

## Activation

- [ ] The activation condition is explicit.
- [ ] Baseline and overlay responsibilities are separated.
- [ ] Optional overlays are not mentioned as dependencies of baseline materials.
- [ ] The material can be disabled by omitting it from `CODEX_PROJECT.md`.

## PR Boundaries

- [ ] The PR changes one responsibility area.
- [ ] The PR does not modify shared files unless it is the shared-structure PR.
- [ ] Related future stages can be merged without editing the same files.
