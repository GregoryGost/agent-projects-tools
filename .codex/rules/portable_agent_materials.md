# Portable agent materials rules

Apply this rule when creating, reviewing, or selecting reusable rules and skills for AI agents.

## Purpose

This repository stores portable materials. A material is portable only if it can be reused across projects without assuming one concrete repository layout, package manager, command set, framework overlay, or external system.

## Source of truth

Before applying any rule or skill in a target project:

1. Read `CODEX_PROJECT.md`.
2. Identify active stack profiles, active rules, active skills, language policy, validation commands, dependency policy, and enabled external systems.
3. Apply only the rules and skills explicitly active for the current task or directly touched area.
4. Do not infer inactive stacks from file names, dependency names, or previous projects.

## Responsibility boundaries

- Core rules define generic agent behavior and selection policy.
- Language rules cover one programming language without framework assumptions.
- Framework rules are overlays over language rules.
- Library/module rules are overlays over framework rules and must be optional.
- Styling rules are overlays and must not be assumed from a frontend framework alone.
- Testing rules must state the exact test layer they cover: unit, component/integration, E2E, UI validation, or accessibility review.
- External-system rules must name the external system and access boundary.

## Portability constraints

- Keep project-specific commands in `CODEX_PROJECT.md`, not in portable rules.
- Keep project-specific paths configurable unless they are part of a documented portable convention.
- Do not add dependencies implicitly.
- Do not merge unrelated stacks into one rule when they can be activated independently.
- Avoid global names such as `code-quality` if sibling stacks may need their own language-specific quality layers.
- A rule may reference an overlay only in the overlay direction: the overlay can depend on the baseline, but the baseline must not depend on the overlay.

## PR split expectations

When adding a family of materials, split changes into non-overlapping PRs by responsibility area. A PR should add its own files and avoid modifying shared files unless the PR is specifically about shared routing or structure.
