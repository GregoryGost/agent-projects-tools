# Pinia Patterns And Review

Use this reference when designing or reviewing Pinia stores in Vue + TypeScript projects.

## Core Principles

- Keep stores domain-oriented and small enough to have a clear public contract.
- Keep component-local state in components or composables unless multiple routes/components need the same state.
- Use state for source-of-truth data.
- Use getters for derived state.
- Use actions for business operations, async workflows, and state-changing side effects.
- Keep persistence, storage, cross-tab sync, and plugins explicit and project-approved.
- Check all consumers before changing public store state, getters, or actions.

## Good: Domain Store With Explicit State, Getter, And Action

```ts
import {defineStore} from 'pinia'

interface UserProfile {
  id: string
  displayName: string
}

interface UserState {
  profile: UserProfile | null
  isLoading: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    profile: null,
    isLoading: false,
  }),

  getters: {
    isAuthenticated: (state): boolean => state.profile !== null,
  },

  actions: {
    async loadProfile(): Promise<void> {
      this.isLoading = true

      try {
        this.profile = await fetchUserProfile()
      } finally {
        this.isLoading = false
      }
    },
  },
})
```

Why this is good:

- The store has one domain responsibility.
- Empty/null state is typed explicitly.
- Derived state is a getter instead of duplicated state.
- Async state transition is in an action.

## Bad: One Store For Unrelated State

```ts
export const useAppStore = defineStore('app', {
  state: () => ({
    user: null,
    cartItems: [],
    selectedDashboardTab: 'overview',
    productFilters: {},
    checkoutStep: 1,
    toastQueue: [],
  }),
})
```

Problems:

- The boundary is not domain-oriented.
- Unrelated features become coupled through one public state contract.
- Any state shape change risks many unrelated call sites.

## Good: Split By Domain Boundary

```ts
export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null as UserProfile | null,
  }),
})

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),
})
```

## Bad: Derived State Stored As Mutable State

```ts
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    totalPrice: 0,
  }),

  actions: {
    addItem(item: CartItem): void {
      this.items.push(item)
      this.totalPrice += item.price
    },
  },
})
```

Problems:

- `totalPrice` can drift from `items`.
- Every mutation must remember to update duplicated state.

## Good: Derived State As Getter

```ts
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    totalPrice: (state): number => {
      return state.items.reduce((total, item) => total + item.price, 0)
    },
  },
})
```

## Bad: Undeclared State Shape

```ts
const userStore = useUserStore()

userStore.lastLoginAt = new Date().toISOString()
```

Problems:

- Pinia state properties must be declared in `state()`.
- Undeclared state is not part of the store contract.

## Good: Declare Optional State Up Front

```ts
interface UserState {
  lastLoginAt: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    lastLoginAt: null,
  }),
})
```

## Bad: Calling A Store Before Pinia Is Installed

```ts
import {useUserStore} from '@/stores/user'

const userStore = useUserStore()

export const routes = [
  {
    path: '/account',
    beforeEnter: () => userStore.isAuthenticated,
  },
]
```

Problems:

- The store can be created before the active Pinia instance exists.
- Router/module initialization order becomes fragile.

## Good: Defer Store Access Until Runtime

```ts
import {useUserStore} from '@/stores/user'

export const routes = [
  {
    path: '/account',
    beforeEnter: () => {
      const userStore = useUserStore()
      return userStore.isAuthenticated
    },
  },
]
```

## Bad: Hidden Private State In Setup Store

```ts
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const secretMultiplier = ref(2)

  const doubled = computed(() => count.value * secretMultiplier.value)

  return {count, doubled}
})
```

Problems:

- Setup stores must return all state properties for Pinia to track them as state.
- Hidden state can break SSR, devtools, and plugins.

## Good: Return Store State Explicitly

```ts
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const multiplier = ref(2)
  const doubled = computed(() => count.value * multiplier.value)

  return {count, multiplier, doubled}
})
```

## Bad: Replacing Store State As If It Were Plain Object State

```ts
const cartStore = useCartStore()

cartStore.$state = {
  items: [],
}
```

Problems:

- Replacing store state directly can break reactivity assumptions.
- Pinia treats `$state` assignment as a patch, so explicit `$patch()` is clearer.

## Good: Patch Store State Explicitly

```ts
const cartStore = useCartStore()

cartStore.$patch((state) => {
  state.items = []
  state.hasChanged = false
})
```

## Bad: Persistence Hidden In Random Components

```ts
watch(
  () => cartStore.items,
  (items) => {
    localStorage.setItem('cart', JSON.stringify(items))
  },
  {deep: true},
)
```

Problems:

- Persistence is scattered outside the store/plugin policy.
- Multiple components can create duplicate persistence behavior.

## Good: Centralize Persistence Policy

```ts
cartStore.$subscribe((_mutation, state) => {
  localStorage.setItem('cart', JSON.stringify(state.items))
})
```

Use persistence plugins or subscriptions only when project policy enables persistence.

## SSR Guardrails

- Do not add browser-only APIs such as `localStorage`, `window`, or `document` in stores that can run during SSR.
- Escape serialized Pinia state during SSR hydration when user-controlled data can be present.
- Be careful with composables inside setup stores when SSR is active.

## Review Questions

- Is this store boundary domain-oriented?
- Is the state shape declared up front and typed where inference needs help?
- Is derived state implemented as getters/computed values instead of duplicated mutable state?
- Are async operations and state-changing side effects placed in actions or declared service layers?
- Are stores accessed only after Pinia is installed?
- Are setup stores returning all state required by Pinia, devtools, SSR, and plugins?
- Are persistence and plugin assumptions explicit and project-approved?
- Were components, composables, router guards, API clients, and tests checked before public store contract changes?
