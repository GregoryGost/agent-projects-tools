---
name: vue-playwright-e2e-testing
description: "Use for Vue frontend browser E2E testing with Playwright: user flows, routing, auth, forms, API-backed behavior, fixtures, webServer, locators, traces, styling-visible behavior, CI policy, and E2E review."
---

# Vue Playwright E2E Testing

Use this skill for Vue frontend browser E2E tests. It covers Playwright Test suites that exercise the Vue application as a user through real browser pages.

Apply `CODEX_PROJECT.md`, `.codex/rules/vue_playwright_e2e_testing.md`, `typescript-core`, and `vue3-typescript-vite-expert` together with this skill.

Load references when needed:

- `references/patterns-and-review.md` for Vue E2E design patterns and review prompts.
- `references/official-sources.md` for official Vue and Playwright sources.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm Vue frontend and Vue Playwright E2E are active.
3. Check Playwright version, config path, E2E command, app start/preview command, base URL, browser matrix, auth policy, backend requirements, and artifact policy.
4. Inspect `package.json`, lockfile, `playwright.config.*`, `vite.config.*`, `tsconfig*`, route definitions, public env usage, and existing E2E tests.
5. Identify the user flow and active overlays: Vue Router, Pinia, VueUse, CSS, CSS animation, Tailwind, SCSS, UI/UX.
6. Apply styling overlays only to user-visible behavior; do not assert private CSS implementation details.
7. Add the smallest browser E2E scenario that validates a critical flow.
8. Run or report the project-declared E2E command.

## Baseline

- Use Playwright Test for Vue browser E2E.
- Do not import Vue app internals into E2E tests.
- Do not use Vue Test Utils here; that belongs to `vitest-vue-testing`.
- Do not rely on Jest rules from `typescript-jest-testing`; this is a Playwright browser suite.
- Prefer production preview or project-declared app startup for E2E.
- Keep type checking separate from Playwright execution unless the project declares another policy.

## Guardrails

- Test user-visible behavior and public app effects.
- Prefer Playwright locators and web-first assertions.
- Keep tests isolated and deterministic.
- Avoid fixed sleeps; use auto-waiting, locators, readiness checks, or explicit app states.
- Do not test third-party sites directly.
- Keep route/auth/backend state setup explicit.
- Capture artifacts according to project policy.
- Treat Playwright MCP UI checks as local evidence gathering, not as a replacement for this persistent E2E suite.

## Review Checklist

- [ ] Vue E2E is active in the project profile.
- [ ] Playwright config, command, webServer/base URL, and browser matrix were checked.
- [ ] The test does not import Vue internals.
- [ ] The scenario covers a critical user flow rather than a component detail.
- [ ] Router, Pinia, VueUse, CSS, CSS animation, Tailwind, SCSS, or UI/UX overlays were applied only when active.
- [ ] Styling-related assertions check user-visible behavior rather than private class implementation.
- [ ] Test data, auth state, and backend readiness are deterministic.
- [ ] Locators use user-facing attributes or explicit contracts.
- [ ] Trace/screenshot/video policy is followed.
