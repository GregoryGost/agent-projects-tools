# Vitest Vue Testing Dependency Matrix

This matrix describes dev dependencies for Vue unit and component integration testing. It is not a command to install everything at once.

Always read `CODEX_PROJECT.md`, `package.json`, lockfiles, and dependency policy before recommending or adding dependencies.

## Vue 3 + TypeScript + Vite Testing Baseline

Use when the project activates Vue frontend testing with Vitest.

| Purpose | Dev dependencies | Notes |
| --- | --- | --- |
| Test runner | `vitest` | Vite-powered test runner for unit and component tests. |
| Vue component mounting | `@vue/test-utils` | Official Vue testing utility for mounting and interacting with Vue 3 components. |
| DOM environment | `jsdom` or `happy-dom` | Needed when tests require browser APIs. `node` is enough for pure unit tests. |
| Pinia component tests | `@pinia/testing` | Use only when Pinia is active and components need testing stores. |
| Coverage | `@vitest/coverage-v8` | Use only when coverage reporting is enabled. |

## Observed In `gost-rdpr-ui`

The `gost-rdpr-ui` reference project currently has Vue, TypeScript, Vite, Pinia, Vue Router, ESLint, Prettier, and `vue-tsc`, but does not declare a unit or component test runner in `package.json`.

Therefore these testing dependencies are recommendations for an activated testing profile, not assumptions about already installed packages.

## Optional Or Project-Specific

| Purpose | Dev dependencies | When to use |
| --- | --- | --- |
| Accessibility-oriented component tests | `@testing-library/vue` | Optional. Use only when the project wants Testing Library style queries and accepts its tradeoffs. |
| Network or API mocking | `msw` or project-specific mock layer | Use only when component integration tests need realistic network boundaries. |
| Browser component tests | project-specific browser test runner | Use only under a dedicated browser component testing profile. |
| UI validation | Playwright MCP tooling | Use `playwright-ui-checks-mcp`, not this skill, for browser route validation and screenshots. |

## Excluded From Unit Or Component Test Baseline

Do not list runtime/framework dependencies as test tooling dependencies:

- `vue`
- `vue-router`
- `pinia`
- `@vueuse/core`

These packages are still relevant when writing tests, but their presence does not mean the project has a test runner installed.
