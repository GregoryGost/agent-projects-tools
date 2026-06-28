# Pinia Testing Patterns And Review

Use this reference when designing or reviewing tests for Pinia stores and component-store integration.

This reference complements `pinia-expert/references/patterns-and-review.md`: the Pinia design reference defines good store contracts, and this testing reference defines how to verify those contracts.

## Core Principles

- Test store contracts, not private implementation details.
- Use a fresh Pinia per store unit test.
- Use `createTestingPinia()` intentionally for component-store integration tests.
- Choose action stubbing based on the tested behavior.
- Test derived getters from state changes instead of duplicating getter logic in tests.
- Test actions through public state changes, returned values, emitted side effects, or collaborator calls.
- Include production plugins in test setup when behavior depends on plugins.
- Test persistence only when persistence is part of the project-approved store contract.

## Good: Fresh Pinia Per Store Unit Test

```ts
import {beforeEach, describe, expect, it} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useCartStore} from '@/stores/cart'

describe('cart store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('calculates total price from items', () => {
    const cartStore = useCartStore()

    cartStore.items.push({id: 'a', price: 10})
    cartStore.items.push({id: 'b', price: 15})

    expect(cartStore.totalPrice).toBe(25)
  })
})
```

Why this is good:

- Each test gets isolated store state.
- The test verifies the public getter contract.
- The test does not duplicate application implementation details.

## Bad: Shared Store State Across Tests

```ts
setActivePinia(createPinia())

const cartStore = useCartStore()

it('adds item', () => {
  cartStore.items.push({id: 'a', price: 10})
  expect(cartStore.items).toHaveLength(1)
})

it('starts empty', () => {
  expect(cartStore.items).toHaveLength(0)
})
```

Problems:

- Tests leak state into each other.
- Order changes can break results.
- The failure is caused by test setup, not store behavior.

## Good: Component Test With Testing Pinia

```ts
import {mount} from '@vue/test-utils'
import {createTestingPinia} from '@pinia/testing'
import {describe, expect, it, vi} from 'vitest'
import CartSummary from '@/components/CartSummary.vue'

it('renders cart item count', () => {
  const wrapper = mount(CartSummary, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            cart: {
              items: [{id: 'a', price: 10}],
            },
          },
        }),
      ],
    },
  })

  expect(wrapper.text()).toContain('1 item')
})
```

Why this is good:

- Component-store integration is tested through rendered output.
- Store initial state is explicit.
- `createTestingPinia()` is scoped to this component test.

## Bad: Testing Real Action While Actions Are Stubbed

```ts
const pinia = createTestingPinia()
const userStore = useUserStore()

await userStore.loadProfile()

expect(userStore.profile).not.toBeNull()
```

Problems:

- `createTestingPinia()` stubs actions by default.
- The action body may not execute.
- The assertion can verify the mock setup rather than real store behavior.

## Good: Execute Actions When Testing Action Behavior

```ts
const pinia = createTestingPinia({
  createSpy: vi.fn,
  stubActions: false,
})

const userStore = useUserStore()

await userStore.loadProfile()

expect(userStore.profile).not.toBeNull()
```

Use real Pinia with `setActivePinia(createPinia())` for pure store unit tests when component mounting is unnecessary.

## Good: Assert Action Was Requested In Component Test

```ts
const pinia = createTestingPinia({createSpy: vi.fn})
const userStore = useUserStore()

mount(ProfileButton, {
  global: {
    plugins: [pinia],
  },
})

await wrapper.get('button').trigger('click')

expect(userStore.loadProfile).toHaveBeenCalledTimes(1)
```

Here the action can remain stubbed because the component contract is "request profile loading", not "execute the profile loading workflow".

## Plugin And Persistence Tests

- If a store depends on a Pinia plugin, install the plugin in the test Pinia instance.
- If the plugin requires an app installation step, create a minimal app and install Pinia before using the store.
- Test persistence through the public persistence contract, not through unrelated component behavior.
- Mock or isolate storage only when the project persistence policy allows it.

## Setup Store Tests

- Verify returned setup-store state, getters, and actions through the public store API.
- Do not access hidden refs or unreturned local variables.
- If a setup store uses composables, follow project-approved composable mocking policy.

## Review Questions

- Does the test preserve the store boundary defined by `pinia-expert`?
- Is fresh Pinia state created per test where needed?
- Is `createTestingPinia()` used for component integration rather than pure store behavior by default?
- Is action stubbing intentional?
- Are getters tested as derived behavior from state changes?
- Are actions tested through public state, return values, or side effects?
- Are plugins, persistence, and setup-store assumptions represented in the test setup?
- Are component tests checking rendered behavior rather than store internals?
