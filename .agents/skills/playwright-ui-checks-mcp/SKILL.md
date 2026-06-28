---
name: playwright-ui-checks-mcp
description: "Use for browser-based UI validation through Playwright MCP: route navigation, wait targets, accessibility snapshots, screenshots, console/network summaries, and validation reporting."
---

# Playwright UI Checks MCP

Use this skill when `CODEX_PROJECT.md` declares Playwright MCP or browser UI validation active, or when the user explicitly asks for Playwright-based UI checks.

Apply `.codex/rules/playwright_ui_validation.md` together with this skill.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm MCP server name, dev server URL, target routes, wait targets, and artifact path.
3. Confirm the web app and required backend/MCP services are available, or report what is unavailable.
4. Navigate only to routes relevant to the changed behavior.
5. Wait for a specific element or state.
6. Capture an accessibility snapshot when available.
7. Capture screenshots when visible UI changed or the task asks for evidence.
8. Summarize console errors and failed network requests when available.

## Guardrails

- Use project-declared URL and routes; do not hardcode local defaults.
- Use project-declared artifact paths.
- Do not retry indefinitely; report unavailable apps, failed services, or missing wait targets.
- Do not treat screenshots as the only validation signal.

## Report Format

Include route checked, wait target, visible result summary, console/network errors, screenshots or artifact references when available, and remaining validation gaps.
