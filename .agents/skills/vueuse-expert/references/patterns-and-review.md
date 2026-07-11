# VueUse Patterns And Review

Use this reference when designing or reviewing VueUse usage in Vue + TypeScript projects.

This reference complements `vue3-typescript-vite-expert` and `typescript-core`: Vue component and TypeScript rules stay in those base skills, while this file focuses on VueUse utility selection, lifecycle cleanup, browser API wrappers, reactive arguments, storage, event filters, SSR/browser guards, and project exclusions.

## Core Principles

- Use VueUse only when the project profile enables it or the touched code already depends on VueUse.
- Prefer VueUse when it improves lifecycle cleanup, reactive integration, browser API ergonomics, or repeated pattern readability.
- Prefer native APIs when the native code is clearer and lifecycle cleanup/reactivity are irrelevant.
- Verify the utility against the installed VueUse version before using version-sensitive options.
- Keep imports explicit and local to the functions used.
- Keep browser-only utilities guarded when SSR, tests, prerendering, or non-browser execution is possible.
- Preserve project-specific exclusions such as custom color mode, storage, breakpoint, or feature-flag policy.

## Good: VueUse For Lifecycle-Safe Browser Events

```ts
import {useEventListener} from '@vueuse/core'

useEventListener(window, 'resize', () => {
  recalculateLayout()
})
```

Why this is good:

- Listener cleanup follows the component lifecycle.
- The browser event is attached through a composable designed for side-effect cleanup.
- The cleanup contract is clearer than manual mount/unmount code.

## Bad: Manual Event Listener Without Cleanup

```ts
window.addEventListener('resize', () => {
  recalculateLayout()
})
```

Problems:

- The listener can leak after component unmount.
- SSR/tests can fail if `window` is unavailable.
- The cleanup contract is implicit or absent.

## Good: Stop Handler When Manual Disposal Is Needed

```ts
const stop = useEventListener(document, 'visibilitychange', () => {
  syncVisibilityState()
})

function disableVisibilitySync(): void {
  stop()
}
```

Use manual disposal only when the feature has a real disable/detach workflow. Otherwise rely on component lifecycle cleanup.

## Good: Destructure Returned Refs

```ts
import {useMouse} from '@vueuse/core'

const {x, y} = useMouse()
```

Why this is good:

- VueUse functions often return objects of refs.
- Destructuring keeps only the values the component uses.

## Good: Wrap With `reactive()` When Object-Style Access Is Preferred

```ts
import {useMouse} from '@vueuse/core'
import {reactive} from 'vue'

const mouse = reactive(useMouse())
```

Use this only when object-style access is clearer for the component.

## Bad: Copying Ref Values Into Plain State

```ts
const {x, y} = useMouse()

const position = {
  x: x.value,
  y: y.value,
}
```

Problems:

- Reactivity is lost.
- `position` becomes a stale snapshot.

## Good: Reactive Arguments

```ts
const title = computed(() => `${projectName.value} — Dashboard`)

useTitle(title)
```

Why this is good:

- The composable receives a reactive value.
- Derived browser state follows Vue reactivity.

## Bad: Watch Glue Around A Composable That Accepts Reactive Input

```ts
const title = useTitle('Dashboard')

watch(projectName, (name) => {
  title.value = `${name} — Dashboard`
})
```

Problem: extra watch glue is unnecessary when the utility supports reactive input.

## Good: Event Filters For High-Frequency Updates

```ts
import {throttleFilter, useMouse} from '@vueuse/core'

const {x, y} = useMouse({
  eventFilter: throttleFilter(100),
})
```

Why this is good:

- Update frequency is controlled explicitly.
- The performance policy is visible at the call site.

## Bad: Unbounded High-Frequency Work

```ts
const {x, y} = useMouse()

watch([x, y], () => {
  expensiveRecalculation()
})
```

Problems:

- Mouse updates can trigger excessive work.
- Throttle/debounce policy is hidden or absent.

## Good: Project-Approved Storage Wrapper

```ts
import {useLocalStorage} from '@vueuse/core'

const sidebarCollapsed = useLocalStorage<boolean>(
  'ui.sidebar.collapsed',
  false,
)
```

Why this is good:

- The key is explicit and stable.
- The default value defines the state contract.
- Storage integration is reactive and lifecycle-aware.

## Bad: Ad Hoc Storage For Reactive UI State

```ts
const sidebarCollapsed = ref(false)

watch(sidebarCollapsed, (value) => {
  localStorage.setItem('sidebarCollapsed', JSON.stringify(value))
})
```

Problems:

- Serialization and cleanup are scattered.
- SSR/tests can fail if storage is unavailable.
- The storage key policy is inconsistent.

## Storage Guardrails

- Do not store secrets, tokens, or sensitive data through VueUse storage helpers.
- Do not introduce persistence unless the project policy allows it.
- Keep keys stable and namespaced according to project conventions.
- Check merge/default behavior before changing stored object shapes.
- Provide serializers only when the default serializer is not appropriate.

## Browser And SSR Guardrails

- Do not assume browser globals in code that can run during SSR, tests, prerendering, or server-side rendering.
- Prefer VueUse utilities that are SSR-aware when browser API access is needed.
- Guard optional browser APIs and permissions: clipboard, geolocation, notifications, fullscreen, wake lock, bluetooth, media devices, and similar APIs.
- Keep fallback UI explicit when a browser feature is unsupported or permission is denied.

## Good: Feature Availability Is Explicit

```ts
const {isSupported, copy} = useClipboard()

async function copyInviteLink(): Promise<void> {
  if (!isSupported.value) {
    showClipboardUnsupportedMessage()
    return
  }

  await copy(inviteLink.value)
}
```

## Bad: Browser Feature Assumed To Exist

```ts
await navigator.clipboard.writeText(inviteLink.value)
```

Problems:

- The API can be unavailable or permission-gated.
- Failure handling is missing.
- The logic bypasses project VueUse policy.

## Review Questions

- Is VueUse active for this project or already present in the touched code?
- Does VueUse improve lifecycle cleanup, reactivity, browser API ergonomics, or repeated pattern readability here?
- Is a native API simpler and safer for this case?
- Was the utility checked against the installed VueUse version?
- Are returned refs handled without losing reactivity?
- Are high-frequency updates throttled/debounced/paused when needed?
- Are browser-only APIs guarded for SSR/tests/prerendering where relevant?
- Is persistence project-approved, namespaced, and non-sensitive?
- Are project-specific exclusions preserved?
