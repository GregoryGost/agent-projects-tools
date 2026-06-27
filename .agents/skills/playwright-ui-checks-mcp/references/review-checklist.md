# Playwright UI Checks MCP Review Checklist

Load this checklist when validating UI changes with Playwright MCP.

## Activation

- [ ] `CODEX_PROJECT.md` declares Playwright MCP/browser UI validation active, or the user explicitly requested it.
- [ ] Active frontend framework skill is also applied.

## Setup

- [ ] Dev server URL came from `CODEX_PROJECT.md` or user instruction.
- [ ] Target routes and wait targets are known.
- [ ] Artifact path is declared by the project if screenshots are saved.
- [ ] Required app/backend/MCP services are running, or unavailability is reported.

## Browser Check

- [ ] Navigated to the relevant route.
- [ ] Waited for a specific element, state, or URL condition.
- [ ] Captured accessibility snapshot when available.
- [ ] Captured screenshot when visible UI changed or evidence was requested.
- [ ] Console errors were reviewed.
- [ ] Failed network requests were reviewed.

## Result

- [ ] Observed behavior matches the intended change.
- [ ] Remaining visual, network, or service gaps are reported.
- [ ] Any follow-up correction is scoped to the failing behavior.
