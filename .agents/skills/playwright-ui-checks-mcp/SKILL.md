---
name: playwright-ui-checks-mcp
description: "Use for browser-based UI validation through Playwright MCP: route navigation, wait targets, accessibility snapshots, screenshots, console/network summaries, and validation reporting."
---

# Playwright UI Checks MCP

Use this skill when `CODEX_PROJECT.md` declares Playwright MCP or browser UI validation as active, or when the user explicitly asks for Playwright-based UI checks.

Apply `.codex/rules/playwright_ui_validation.md` together with the active frontend framework skill, such as `vue-expert`.

For review checks, load `references/review-checklist.md`. For official docs, load `references/official-sources.md`.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Confirm the Playwright MCP server name, dev server URL, target routes, wait targets, and artifact path.
3. Confirm the web app and required backend/MCP services are available, or report what is unavailable.
4. Navigate only to routes relevant to the changed behavior.
5. Wait for a specific element or state rather than using blind long waits.
6. Capture an accessibility snapshot when the MCP tool supports it.
7. Capture screenshots when visual behavior changed or the task asks for evidence.
8. Summarize console errors and failed network requests when available.
9. If validation fails and the task includes fixing the UI, make the smallest correction and repeat the relevant check.

## Guardrails

- Do not hardcode a default URL such as `127.0.0.1:5000`; use `CODEX_PROJECT.md` or the user's instruction.
- Do not create artifact paths unless the project profile declares them.
- Do not retry indefinitely; report unavailable apps, failed services, or missing wait targets.
- Do not treat screenshots as the only validation signal; include console/network and accessibility snapshot observations when available.
- Do not replace project-declared automated tests with UI inspection when tests are required.

## Report Format

When reporting a UI check, include:

- route or URL checked;
- target element or state waited for;
- visible result summary;
- console/network errors if any;
- screenshot or artifact reference when available;
- remaining validation gaps.

## Review Checklist

- [ ] URL and routes came from `CODEX_PROJECT.md` or the user.
- [ ] Required services were confirmed or reported unavailable.
- [ ] Wait target was specific.
- [ ] Snapshot/screenshot/console/network observations were captured when available.
- [ ] Failures were corrected or reported with enough detail.
