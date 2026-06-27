# Playwright UI validation rules

Apply this rule only when `CODEX_PROJECT.md` declares Playwright, Playwright MCP, or browser-based UI validation as active, or when the task directly asks for UI validation through Playwright.

## Required skills

Use together with:

- `playwright-ui-checks-mcp`.

Do not run Playwright MCP checks against hardcoded URLs. Use only the dev server URL, routes, wait targets, artifact paths, and validation scope declared in `CODEX_PROJECT.md` or supplied by the user.

## Source of truth

Before running UI validation:

1. Read `CODEX_PROJECT.md`.
2. Check the active dev server URL, required startup commands, MCP server name, artifact path, and target routes.
3. Confirm that the web app and required backend/MCP services are running or report what is unavailable.
4. Use the smallest route set that validates the changed behavior.

## Constraints

- Use browser snapshot and screenshot checks when validating UI changes.
- Summarize console errors and failed network requests when available.
- Do not wait blindly for long periods; use specific wait targets.
- Do not create or rely on project-local artifact paths unless they are declared by the project.
- Do not treat visual validation as a replacement for unit, component, integration, or E2E tests when those are required by the project.

## Review expectations

Report route checked, browser observations, console/network issues, screenshots or artifact locations when applicable, and any validation gaps caused by unavailable services.
