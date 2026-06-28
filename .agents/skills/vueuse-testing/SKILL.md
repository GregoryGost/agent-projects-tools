---
name: vueuse-testing
description: "Use for testing VueUse-based composables and integrations: lifecycle cleanup, browser guards, reactive return values, and project-specific exclusions."
---

# VueUse Testing

Use this skill when testing VueUse-based composables or integrations.

Apply `.codex/rules/vueuse_testing.md`, `vitest-vue-testing`, and `vueuse-expert` together with this skill.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm VueUse and Vue testing are active.
3. Inspect VueUse utility usage, browser assumptions, test environment, and existing helpers.
4. Choose a test boundary focused on the public composable behavior.
5. Run or report the project-declared test command.

## Review Checklist

- [ ] VueUse utility behavior matches installed version.
- [ ] Browser-only APIs are guarded or mocked.
- [ ] Lifecycle cleanup is tested when relevant.
- [ ] Reactive return values are asserted through public behavior.
- [ ] Project-specific exclusions were preserved.
