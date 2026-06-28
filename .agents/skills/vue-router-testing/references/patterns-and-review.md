# Vue Router Testing Patterns And Review

Use this reference when designing or reviewing Vue Router tests with Vitest and Vue Test Utils.

This reference complements `vue-router-expert/references/patterns-and-review.md`: the Router design reference defines route contracts, and this testing reference defines how to verify those contracts.

## Core Principles

- Test router-dependent component logic with a mocked route/router when Vue Router behavior itself is not under test.
- Use a real router for route rendering, guard, redirect, link, and integration behavior.
- Create a fresh router instance per test when using a real router.
- Await `router.isReady()` before asserting initial route rendering.
- Await pending navigation with `flushPromises()` or project-approved helpers after link clicks or navigation triggers.
- Keep route contract tests aligned with `vue-router-expert`: names, params, query keys, meta fields, guards, redirects, route props, and navigation failures.
- Do not rely on global router state leaking across tests.

## Good: Mock Router For Component Navigation Logic

```ts
import {mount} from '@vue/test-utils'
import {describe, expect, it, vi} from 'vitest'
import {useRoute, useRouter} from 'vue-router'
import EditPostButton from '@/components/EditPostButton.vue'

vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
  useRouter: vi.fn(),
}))

describe('EditPostButton', () => {
  it('requests navigation to the edit route', async () => {
    const push = vi.fn()

    vi.mocked(useRoute).mockReturnValue({
      params: {postId: '42'},
    } as ReturnType<typeof useRoute>)

    vi.mocked(useRouter).mockReturnValue({
      push,
    } as unknown as ReturnType<typeof useRouter>)

    const wrapper = mount(EditPostButton)

    await wrapper.get('button').trigger('click')

    expect(push).toHaveBeenCalledWith({
      name: 'post-edit',
      params: {postId: '42'},
    })
  })
})
```

Why this is good:

- The component logic is under test, not Vue Router internals.
- The expected route contract is explicit.
- The test stays small and avoids full router setup.

## Bad: Real Router For Simple Button Navigation Logic

```ts
const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

router.push('/posts/42')
await router.isReady()

const wrapper = mount(EditPostButton, {
  global: {
    plugins: [router],
  },
})

await wrapper.get('button').trigger('click')
expect(router.currentRoute.value.name).toBe('post-edit')
```

Problems:

- The test verifies a simple component decision through a full router integration setup.
- Failures can come from router config instead of the component behavior.
- This belongs in an integration test only if route rendering or guards are part of the behavior under test.

## Good: Real Router For Route Rendering Integration

```ts
import {flushPromises, mount} from '@vue/test-utils'
import {beforeEach, describe, expect, it} from 'vitest'
import {createMemoryHistory, createRouter, type Router} from 'vue-router'
import App from '@/App.vue'
import {routes} from '@/router/routes'

describe('app routing', () => {
  let router: Router

  beforeEach(async () => {
    router = createRouter({
      history: createMemoryHistory(),
      routes,
    })

    await router.push('/')
    await router.isReady()
  })

  it('renders the reports route', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    })

    await router.push({name: 'reports'})
    await flushPromises()

    expect(wrapper.text()).toContain('Reports')
  })
})
```

Why this is good:

- A fresh real router is used per test.
- Initial navigation is awaited.
- Route rendering is asserted through the rendered app.
- Navigation is awaited before assertions.

## Bad: Shared Router Across Tests

```ts
const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

it('starts at home', async () => {
  await router.push('/')
  expect(router.currentRoute.value.name).toBe('home')
})

it('starts at login', async () => {
  await router.push('/login')
  expect(router.currentRoute.value.name).toBe('login')
})
```

Problems:

- Tests share mutable router state.
- Route history and guards can leak between tests.
- Failures can depend on test order.

## Good: Guard Redirect Test

```ts
it('redirects unauthenticated users to login', async () => {
  authStore.isAuthenticated = false

  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  })

  await router.push({name: 'admin-dashboard'})
  await router.isReady()

  expect(router.currentRoute.value.name).toBe('login')
})
```

Guard tests should assert final navigation behavior or rendered output, not private guard implementation details.

## Good: Navigation Failure Test

```ts
import {isNavigationFailure, NavigationFailureType} from 'vue-router'

const failure = await router.push({name: 'same-route'})

expect(isNavigationFailure(failure, NavigationFailureType.duplicated)).toBe(true)
```

Use navigation-failure assertions only when the application behavior depends on the navigation result.

## RouterLink And RouterView

- Stub `RouterLink` and `RouterView` when testing component logic that does not depend on real routing.
- Use a real router when the rendered route outlet, link navigation, active link state, guards, or redirects are the behavior under test.
- Test visible output and route contract, not Vue Router internals.

## Route Props And Params

- Prefer testing route-prop view components by passing props directly in component tests.
- Test router param-to-prop wiring with a real router only when the route config is the behavior under test.
- Keep params and query assertions aligned with the route contracts from `vue-router-expert`.

## Review Questions

- Is this a unit-level component test or a router integration test?
- If mocked, are only the required route/router APIs mocked?
- If real router is used, is a fresh router created per test?
- Is initial navigation awaited with `router.isReady()`?
- Are route changes awaited with `flushPromises()` or a project-approved helper?
- Are route names, params, query keys, meta, guards, redirects, route props, and navigation failures covered when affected?
- Does the test avoid global router state leaks?
- Does it assert public behavior or rendered output rather than private router internals?
