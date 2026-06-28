# VueUse Testing Patterns And Review

Use this reference when designing or reviewing tests for VueUse-based composables and integrations.

This reference complements `vueuse-expert/references/patterns-and-review.md`: the VueUse design reference defines utility selection and integration contracts, and this testing reference defines how to verify those contracts.

## Core Principles

- Test public composable behavior, not VueUse internals.
- Verify reactive return values through state changes and public effects.
- Preserve reactivity when asserting refs returned by VueUse utilities.
- Mock browser APIs explicitly when the test environment does not provide them.
- Use a DOM-capable test environment only when browser/DOM behavior is part of the contract.
- Use fake timers for debounce/throttle/timer-based utilities and event filters.
- Test cleanup when the utility manages listeners, timers, subscriptions, observers, or manual stop handlers.
- Test storage behavior only when persistence is part of the project-approved contract.

## Good: Test Reactive Return Values Through Public Behavior

```ts
import {describe, expect, it} from 'vitest'
import {useMousePositionLabel} from '@/composables/useMousePositionLabel'

it('formats the current mouse position', () => {
  const {x, y, label} = useMousePositionLabel()

  x.value = 10
  y.value = 20

  expect(label.value).toBe('10 × 20')
})
```

Why this is good:

- The test asserts the public composable contract.
- Returned refs stay reactive.
- The test does not assert VueUse internals.

## Bad: Copying Ref Values Before Assertion

```ts
const {x, y} = useMouse()
const snapshot = {x: x.value, y: y.value}

expect(snapshot.x).toBe(10)
```

Problems:

- The snapshot is no longer reactive.
- Later reactive updates will not be observed.
- The test can hide broken reactive behavior.

## Good: Mock Browser API Explicitly

```ts
import {describe, expect, it, vi} from 'vitest'
import {useCopyInviteLink} from '@/composables/useCopyInviteLink'

it('copies the invite link', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined)

  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: {writeText},
  })

  const {copyInviteLink} = useCopyInviteLink()

  await copyInviteLink('https://example.test/invite')

  expect(writeText).toHaveBeenCalledWith('https://example.test/invite')
})
```

Why this is good:

- The browser capability is explicit.
- The test does not depend on a real clipboard implementation.
- Permission/API failures can be tested separately.

## Bad: Assuming Browser APIs Exist In Test Environment

```ts
await navigator.clipboard.writeText('secret')
```

Problems:

- Test environment support can differ from real browsers.
- Permission failures and unsupported APIs are not represented.
- The test may be flaky or environment-dependent.

## Good: Fake Timers For Event Filters

```ts
import {debounceFilter, useMouse} from '@vueuse/core'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

it('debounces mouse updates', async () => {
  const {x} = useMouse({eventFilter: debounceFilter(100)})

  window.dispatchEvent(new MouseEvent('mousemove', {clientX: 42}))
  expect(x.value).not.toBe(42)

  await vi.advanceTimersByTimeAsync(100)
  expect(x.value).toBe(42)
})
```

Why this is good:

- Timer behavior is deterministic.
- Debounce/throttle policy is tested explicitly.
- Timers are restored after the test.

## Bad: Real Time Waits

```ts
await new Promise((resolve) => setTimeout(resolve, 150))
expect(x.value).toBe(42)
```

Problems:

- The test is slower than needed.
- Timing can be flaky.
- The test does not show the intended timer policy.

## Good: Storage Helper Test With Isolated Storage

```ts
import {beforeEach, describe, expect, it} from 'vitest'
import {useLocalStorage} from '@vueuse/core'

beforeEach(() => {
  localStorage.clear()
})

it('persists sidebar state', () => {
  const collapsed = useLocalStorage('ui.sidebar.collapsed', false)

  collapsed.value = true

  expect(localStorage.getItem('ui.sidebar.collapsed')).toBe('true')
})
```

Why this is good:

- Storage state is isolated per test.
- The key is explicit.
- The test verifies the persistence contract.

## Bad: Shared Storage State

```ts
it('reads previous sidebar state', () => {
  const collapsed = useLocalStorage('ui.sidebar.collapsed', false)
  expect(collapsed.value).toBe(false)
})
```

Problems:

- Previous tests can leave storage behind.
- Test order can change the result.
- The test does not own its state setup.

## Good: Cleanup Test For Listener-Based Composable

```ts
import {describe, expect, it, vi} from 'vitest'
import {useEventListener} from '@vueuse/core'

it('removes a listener when manually stopped', () => {
  const add = vi.spyOn(window, 'addEventListener')
  const remove = vi.spyOn(window, 'removeEventListener')

  const listener = vi.fn()
  const stop = useEventListener(window, 'resize', listener)

  expect(add).toHaveBeenCalledWith('resize', listener, undefined)

  stop()

  expect(remove).toHaveBeenCalledWith('resize', listener, undefined)
})
```

Use cleanup assertions only when cleanup is part of the changed behavior or the project has had lifecycle leaks in that area.

## Composable Mount Harness

Use a small component/mount harness when the composable depends on component lifecycle hooks such as mounted, unmounted, or scope disposal.

```ts
import {mount} from '@vue/test-utils'
import {defineComponent} from 'vue'

export function mountComposable<T>(useComposable: () => T): T {
  let result!: T

  const wrapper = mount(defineComponent({
    setup() {
      result = useComposable()
      return () => null
    },
  }))

  wrapper.unmount()
  return result
}
```

Adapt this pattern to the project helper policy. Do not introduce a new helper if the repository already has one.

## Review Questions

- Does the test assert public composable behavior instead of VueUse internals?
- Is VueUse active and is the tested utility available in the installed version?
- Are returned refs asserted without losing reactivity?
- Are reactive arguments tested when they are part of the contract?
- Are browser APIs mocked explicitly or covered by a DOM-capable environment?
- Are fake timers used for timer/event-filter behavior?
- Is storage state isolated and non-sensitive?
- Is cleanup tested when listeners, timers, subscriptions, observers, or stop handlers are part of the behavior?
- Are project-specific exclusions preserved?
