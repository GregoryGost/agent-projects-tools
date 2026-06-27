# Vue Router Review Checklist

Load this checklist for route additions, route refactors, navigation bug fixes, guard changes, and route-related reviews.

## Activation

- [ ] `CODEX_PROJECT.md` declares Vue Router active, or the task directly touches routing.
- [ ] `vue-expert` and `typescript-core` are also applied.

## Route Records

- [ ] Added or changed paths match project conventions.
- [ ] Route names remain stable unless intentionally changed.
- [ ] Params and query values are typed or narrowed before use.
- [ ] Lazy route component imports are used where project convention expects them.
- [ ] Route meta shape is consistent with existing routes.

## Navigation

- [ ] `router.push`, `router.replace`, `<RouterLink>`, redirects, and guards were checked for affected routes.
- [ ] Redirects cannot loop.
- [ ] Guards do not perform component-local UI work.
- [ ] Auth/layout/title/meta behavior remains consistent.

## Validation

- [ ] Updated routes are included in UI validation when Playwright MCP is active.
- [ ] Broken route warnings, console errors, and failed navigation states were checked where possible.
