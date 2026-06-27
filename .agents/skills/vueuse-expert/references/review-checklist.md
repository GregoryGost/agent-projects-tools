# VueUse Review Checklist

Load this checklist when adding, changing, or reviewing VueUse usage.

## Activation

- [ ] `CODEX_PROJECT.md` declares VueUse active, or existing VueUse code is directly touched.
- [ ] `vue-expert` and `typescript-core` are also applied.

## Utility Selection

- [ ] The VueUse utility solves a real lifecycle, reactivity, browser API, or readability issue.
- [ ] A simpler native API was considered where appropriate.
- [ ] Installed VueUse version supports the chosen API.
- [ ] Import pattern follows the project convention.

## Runtime Behavior

- [ ] Browser-only APIs are guarded when needed.
- [ ] SSR/non-browser execution is considered when relevant.
- [ ] Cleanup is handled automatically by the utility or explicitly by the caller.
- [ ] Reactive return values are consumed correctly.

## Project Conventions

- [ ] Color mode, storage, media queries, and async-state behavior follow project-specific policy.
- [ ] New VueUse dependency or plugin usage was approved or already allowed.

## Validation

- [ ] Type check, lint, tests, or UI validation were run when declared and applicable.
