# Vue Playwright E2E testing rules

Apply this rule when `CODEX_PROJECT.md` declares Vue Playwright E2E testing active, or when the task directly changes browser E2E tests for a Vue frontend project.

This rule is for Vue frontend projects only. It does not replace Jest TypeScript unit/integration tests, Vitest Vue unit/component tests, or Playwright MCP UI validation checks.

## Required skills

Use together with:

- `typescript-core`;
- `vue3-typescript-vite-expert`;
- `vue-playwright-e2e-testing`.

Use related overlay skills only when active:

- `vue-router-expert` when E2E covers routing, route params, guards, redirects, or navigation state;
- `pinia-expert` when E2E covers state effects visible through UI or API;
- `vueuse-expert` when E2E covers behavior driven by VueUse;
- `css-expert` when E2E validates visible layout or state driven by plain CSS, CSS Modules, or SFC style blocks;
- `css-animation-expert` when E2E validates visible transitions, motion, or Vue transition CSS;
- `tailwind-expert` or `scss-expert` when those styling overlays affect user-visible E2E behavior;
- `ui-ux-review` when the E2E task validates layout, interaction states, or accessibility-sensitive visible behavior.

## Source of truth

Before adding or changing Vue E2E tests:

1. Read `CODEX_PROJECT.md`.
2. Check Playwright version, E2E command, `playwright.config.*`, app start/preview command, base URL, browser matrix, artifact policy, auth policy, backend/API requirements, and dependency policy.
3. Inspect `package.json`, lockfile, `vite.config.*`, `tsconfig*`, route definitions, public environment variables, and existing E2E tests.
4. Check whether E2E targets local production preview, dev server, or staging.
5. Use project-declared commands and do not invent script names.

## E2E scope

Vue E2E tests must test the application as a user through real browser pages.

- Do not import Vue components, composables, stores, routers, or app internals into E2E tests.
- Do not use Vue Test Utils in E2E tests.
- Do not duplicate component tests already covered by `vitest-vue-testing`.
- Test critical multi-page/user flows, route transitions, auth redirects, form submission, API-backed behavior, layout-level behavior, and visible state effects.
- Verify externally visible behavior rather than implementation details.
- Do not assert private CSS class implementation unless the class is an explicit public test contract.

## Playwright policy

- Use Playwright Test as the browser E2E runner.
- Keep TypeScript type checking as a separate validation step because Playwright transpiles tests but does not fully type-check them.
- Prefer a test-specific `tsconfig` when the project needs E2E-specific paths or types.
- Prefer `webServer` or a project-declared external server setup instead of assuming a running app.
- Use Playwright locators with user-facing attributes and explicit contracts.
- Use web-first assertions instead of manual visibility checks.
- Keep tests isolated: independent storage, cookies, local storage, backend state, and test data.
- Do not test third-party sites or uncontrolled external dependencies directly.

## Data, auth, and backend

- Use deterministic test data and project-approved seed/reset strategy.
- Keep authentication setup explicit and isolated; use storage state only when it is part of the project E2E policy.
- Ensure backend/API readiness before running browser flows.
- Use controlled API fixtures, test accounts, or disposable backend state.
- Capture traces, screenshots, videos, and console/network summaries according to project artifact policy.

## Relationship to Playwright MCP UI validation

`playwright-ui-checks-mcp` is for local UI validation and evidence gathering. Vue Playwright E2E is a persistent test suite with assertions, config, fixtures, CI policy, and regression scenarios.

Do not replace one with the other.