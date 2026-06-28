# Playwright UI validation rules

Apply this rule only when `CODEX_PROJECT.md` declares Playwright MCP or browser-based UI validation active, or when the task directly asks for Playwright-based UI checks.

This rule covers local UI validation and evidence gathering through Playwright MCP. It does not define a persistent Playwright Test E2E suite.

## Required skills

Use together with:

- `playwright-ui-checks-mcp`.

## Source of truth

Before running UI validation:

1. Read `CODEX_PROJECT.md`.
2. Check the active dev server URL, required startup commands, MCP server name, artifact path, target routes, and wait targets.
3. Confirm that the web app and required backend/MCP services are running or report what is unavailable.
4. Use the smallest route set that validates the changed behavior.

## Constraints

- Do not run Playwright MCP checks against hardcoded URLs.
- Use browser snapshot and screenshot checks when validating UI changes.
- Summarize console errors and failed network requests when available.
- Use specific wait targets instead of blind long waits.
- Do not create or rely on project-local artifact paths unless they are declared by the project.
- Do not replace persistent E2E suites with screenshots or one-off MCP checks.
- Report unavailable apps, routes, backends, MCP servers, or wait targets as validation gaps.
