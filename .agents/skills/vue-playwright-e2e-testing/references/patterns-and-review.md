# Vue Playwright E2E Patterns And Review

Use this reference when designing or reviewing Playwright E2E tests for Vue frontend projects.

## What Counts As Vue E2E

A Vue E2E test should navigate real browser pages and assert behavior visible to users or external systems.

Examples:

- a login redirect flow guarded by Vue Router;
- a form submission that calls an API and shows persisted data;
- a route transition that preserves or resets visible state correctly;
- a Pinia-backed UI state change verified through the page, not by importing the store;
- an App/Layout-level behavior that unit/component tests cannot cover.

## Router Pattern

- Start from a public URL and navigate like a user.
- Assert route-visible behavior, URL changes, page content, redirects, and guard outcomes.
- Do not import route records or call router internals directly from E2E tests.
- Prefer stable public routes declared by the project profile.

## State Pattern

- Treat Pinia and VueUse-driven behavior as observable UI or API behavior.
- Do not import stores, composables, or app instances into E2E tests.
- Set state through auth setup, API fixtures, seed data, local storage policy, or user actions.
- Assert visible UI state and externally visible effects.

## Backend And Data Pattern

- Prefer production preview or project-declared dev server for local E2E.
- Ensure backend/API readiness before browser tests run.
- Seed only the data required for the scenario.
- Use deterministic test accounts and isolated records.
- Avoid relying on uncontrolled third-party services.

## Playwright Pattern

- Use user-facing locators: role, label, text, placeholder, alt text, or explicit test IDs approved by the project.
- Use web-first assertions such as visibility, text, URL, and enabled/disabled states.
- Avoid fixed sleeps and manual polling when Playwright auto-waiting can handle the condition.
- Capture trace/screenshot/video artifacts according to project policy.
- Keep tests isolated: cookies, storage, backend data, auth state, and routes.

## Anti-patterns

- Importing Vue components, stores, composables, or router instances into E2E tests.
- Using Vue Test Utils or component mounting in E2E.
- Duplicating component tests as slow E2E tests.
- Testing CSS classes or private implementation details instead of user-visible behavior.
- Running against a backend with uncontrolled shared data.
- Treating `playwright-ui-checks-mcp` screenshots as a persistent E2E suite.

## Review Questions

- What user flow is covered?
- Does the test avoid importing Vue internals?
- Does the scenario justify browser E2E instead of unit/component testing?
- Are route, state, auth, and backend setup deterministic?
- Are locators resilient and user-facing?
- Are traces/screenshots/videos configured according to project policy?
- Does the test remain independent and safe to run in CI?
