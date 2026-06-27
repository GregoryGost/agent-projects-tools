# Pinia Review Checklist

Load this checklist for Pinia store changes and reviews.

## Activation

- [ ] `CODEX_PROJECT.md` declares Pinia active, or the task directly touches Pinia.
- [ ] `vue-expert` and `typescript-core` are also applied.

## Store Boundary

- [ ] Store responsibility is domain-oriented and clear.
- [ ] Component-local state was not promoted to a store without need.
- [ ] Shared state is not duplicated across stores.
- [ ] Store naming follows project convention.

## State And Actions

- [ ] State shape is typed and compatible with consumers.
- [ ] Getters are used for derived state.
- [ ] Actions contain async work or side effects only when this matches project architecture.
- [ ] API data is normalized or narrowed before assignment.
- [ ] Persistence/hydration assumptions are explicit.

## Call Sites

- [ ] Components using the store were checked.
- [ ] Composables and router guards using the store were checked.
- [ ] Tests and mocks were updated when state contracts changed.

## Validation

- [ ] Project-declared type check, lint, tests, or UI validation were run when applicable.
