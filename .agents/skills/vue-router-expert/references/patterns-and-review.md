# Vue Router Patterns And Review

Use this reference when designing or reviewing Vue Router behavior in Vue + TypeScript projects.

This reference complements `vue3-typescript-vite-expert` and `typescript-core`: Vue component and TypeScript rules stay in those base skills, while this file focuses on route contracts, navigation, route params, query, meta, guards, redirects, and RouterLink behavior.

## Core Principles

- Treat route records as public navigation contracts.
- Keep route names, params, query keys, and meta fields stable unless the task explicitly changes them.
- Prefer named routes for programmatic navigation when the route is part of a stable app contract.
- Prefer route props over coupling route components directly to `$route` or `useRoute()` when params are component inputs.
- Keep guards minimal, scoped, and focused on navigation decisions.
- Use route meta for cross-cutting route policy such as auth, layout, title, or permissions when the project already follows that pattern.
- Use lazy imports for route-level views when it matches project convention.
- Handle navigation failures where navigation result matters.

## Good: Named Route Navigation

```ts
router.push({
  name: 'user-details',
  params: {userId},
})
```

Why this is good:

- The navigation targets a stable route contract.
- Params are explicit.
- Path construction is left to the router.

## Bad: Hardcoded Path Construction

```ts
router.push(`/users/${userId}`)
```

Problems:

- Manual string construction can miss encoding or route changes.
- Renaming route paths requires broader call-site changes.

## Good: Route Props For Component Inputs

```ts
const routes = [
  {
    path: '/users/:userId',
    name: 'user-details',
    component: UserDetailsView,
    props: true,
  },
]
```

```vue
<script setup lang="ts">
defineProps<{
  userId: string
}>()
</script>
```

Why this is good:

- The component receives an explicit prop contract.
- The component is less coupled to router internals.
- The view is easier to test as a component.

## Bad: Component Coupled To Route Params

```vue
<script setup lang="ts">
import {useRoute} from 'vue-router'

const route = useRoute()
const userId = route.params.userId as string
</script>
```

Problems:

- The component depends directly on router state.
- The param cast can hide invalid route contracts.
- Component tests need router setup even when only the prop matters.

## Good: Watch Specific Route Properties

```ts
const route = useRoute()

watch(
  () => route.params.userId,
  async (userId) => {
    await loadUser(String(userId))
  },
)
```

Why this is good:

- Only the expected route dependency is watched.
- Unrelated query/hash/meta changes do not retrigger the side effect.

## Bad: Watching The Whole Route Object

```ts
watch(route, async () => {
  await loadUser(String(route.params.userId))
})
```

Problems:

- The whole route object is reactive.
- Unrelated route changes can trigger unnecessary effects.

## Good: Scoped Guard For Local Rule

```ts
const routes = [
  {
    path: '/billing',
    name: 'billing',
    component: BillingView,
    beforeEnter: requireActiveSubscription,
  },
]
```

Why this is good:

- The guard is scoped to the route that needs it.
- The global navigation pipeline stays smaller.

## Bad: Global Guard For Local Page Behavior

```ts
router.beforeEach((to) => {
  if (to.name === 'billing') {
    return requireActiveSubscription(to)
  }
})
```

Problems:

- Local behavior is hidden in a global pipeline.
- The global guard grows as pages add special cases.

## Good: Meta Contract For Cross-Cutting Policy

```ts
const routes = [
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: () => import('@/views/AdminDashboardView.vue'),
    meta: {
      requiresAuth: true,
      layout: 'admin',
    },
  },
]
```

Review points:

- Meta field names should follow project conventions.
- Guards/layout/title handlers must be updated when meta contracts change.
- Type route meta when the project has a TypeScript route-meta policy.

## Bad: Redirect Loop Risk

```ts
router.beforeEach((to) => {
  if (!authStore.isAuthenticated) {
    return {name: 'login'}
  }
})
```

Problem: navigating to `login` can trigger the same guard and loop.

## Good: Guard Avoids Redirect Loop

```ts
router.beforeEach((to) => {
  if (!authStore.isAuthenticated && to.name !== 'login') {
    return {name: 'login', query: {redirect: to.fullPath}}
  }
})
```

## Good: Navigation Failure Handling When Result Matters

```ts
const failure = await router.push({name: 'profile'})

if (failure) {
  reportNavigationFailure(failure)
}
```

Use this only when the navigation result changes behavior. Do not add navigation-failure handling to every call site by default.

## Lazy Route Component Imports

Good:

```ts
const routes = [
  {
    path: '/reports',
    name: 'reports',
    component: () => import('@/views/ReportsView.vue'),
  },
]
```

Guardrails:

- Follow existing project chunking and route-file conventions.
- Do not convert eager/lazy imports broadly without measuring or project direction.
- Update tests and E2E route coverage when route-level views move.

## RouterLink And Active State

- Prefer `RouterLink` for internal app navigation instead of raw anchors.
- Use project-approved active/exact-active classes for navigation UI.
- Use raw anchors only for external links or full document navigation.

## Review Questions

- Is the changed route part of a public navigation contract?
- Were route names, params, query keys, and meta fields checked at all call sites?
- Should params be passed as props to the route component?
- Is `useRoute()` watched narrowly when route changes trigger side effects?
- Are guards scoped correctly and free of redirect loops?
- Are route meta fields typed or documented according to project policy?
- Are lazy imports consistent with the project route-view convention?
- Are navigation failures handled only where the result matters?
- Were affected links, redirects, tests, E2E flows, and UI validation paths updated?
