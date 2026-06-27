---
name: agent-material-routing
description: "Use when selecting or designing portable agent rules and skills: stack profile routing, baseline/overlay boundaries, activation policy, and non-overlapping PR planning."
---

# Agent Material Routing

Use this skill when creating, reviewing, or applying reusable rules and skills across projects.

Apply `.codex/rules/portable_agent_materials.md` together with this skill.

## Workflow

1. Read `CODEX_PROJECT.md` in the target project.
2. Identify active stack profiles, rules, skills, dependencies, external systems, and validation commands.
3. Separate baseline layers from overlays.
4. Apply a baseline only when its own stack is active.
5. Apply overlays only when their dependency baseline and their own activation condition are both satisfied.
6. Keep project-specific commands, paths, local URLs, artifact paths, and package-manager choices outside portable rules unless declared as configurable examples.
7. When preparing repository changes, split PRs by responsibility area and avoid touching the same shared file across unrelated PRs.

## Baseline And Overlay Model

- A language skill is a baseline for that language.
- A framework skill is an overlay over a language skill.
- A library or module skill is an overlay over a framework skill.
- A styling skill is an overlay over a frontend framework or CSS processing profile.
- A testing skill must declare whether it covers unit, component/integration, E2E, browser validation, or accessibility review.

## Review Checklist

- [ ] Activation is explicit in `CODEX_PROJECT.md` or directly required by the task.
- [ ] Baseline layers do not mention optional overlays as dependencies.
- [ ] Overlays state the baseline they require.
- [ ] Project-specific commands and paths are not hardcoded.
- [ ] Dependencies are not added without policy or user approval.
- [ ] PR boundaries do not overlap shared files unless the PR is the shared-structure PR.
