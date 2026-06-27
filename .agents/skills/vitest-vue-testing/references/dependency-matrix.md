# Vitest Vue Testing Dependency Matrix

This matrix describes dev dependencies for Vue unit and component integration testing. It is not a command to install everything at once.

Always read `CODEX_PROJECT.md`, `package.json`, lockfiles, and dependency policy before recommending or adding dependencies.

## Vue 3 + TypeScript + Vite Testing Baseline

Use for Vue 3 + TypeScript + Vite projects unless `CODEX_PROJECT.md` explicitly declares another testing stack or an approved no-tests policy.

| Purpose | Dev dependencies | Notes |
| --- | --- | --- |
| Test runner | `vitest` | Baseline test runner for Vite-based Vue projects. |
| Vue component mounting | `@vue/test-utils` | Baseline utility for mounting and interacting with Vue 3 components. |
| DOM environment | `jsdom` or `happy-dom` | Required for component tests that need browser APIs. `node` is enough only for pure unit tests. |
| Pinia component tests | `@pinia/testing` | Required when Pinia is active and component tests need testing-store helpers. |
| Coverage | `@vitest/coverage-v8` | Required when coverage reporting is enabled. |

## Observed In `gost-rdpr-ui`

The `gost-rdpr-ui` reference project currently has Vue, TypeScript, Vite, Pinia, Vue Router, ESLint, Prettier, and `vue-tsc`, but does not declare a unit or component test runner in `package.json`.

For a Vue frontend project, missing `vitest` and component testing dependencies should be treated as a quality gap to report and fix through the project dependency policy, not as a reason to skip the testing baseline.

## Optional Or Project-Specific

| Purpose | Dev dependencies | When to use |
| --- | --- | --- |
| Accessibility-oriented component tests | `@testing-library/vue` | Optional. Use only when the project wants Testing Library style queries and accepts its tradeoffs. |
| Network or API mocking | `msw` or project-specific mock layer | Use only when component integration tests need realistic network boundaries. |
| Browser component tests | project-specific browser test runner | Use only under a dedicated browser component testing profile. |
| UI validation | Playwright MCP tooling | Use `playwright-ui-checks-mcp`, not this skill, for browser route validation and screenshots. |

## Excluded From Unit Or Component Test Tooling

Do not list runtime/framework dependencies as test tooling dependencies:

- `vue`
- `vue-router`
- `pinia`
- `@vueuse/core`

These packages are still relevant when writing tests, but their presence does not mean the project has a test runner installed.
