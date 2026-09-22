# Unity Async, Performance, And Architecture Patterns

## Awaitable is single-await by instance

Unity `Awaitable` instances are pooled.

Bad:

```csharp
var operation = LoadAsync();

await operation;
await operation;
```

Do not await the same `Awaitable` instance more than once.

## Main-thread boundary

```csharp
await Awaitable.BackgroundThreadAsync();

// CPU-only work here.

await Awaitable.MainThreadAsync();

transform.position = calculatedPosition;
```

Most Unity APIs are not thread-safe. Make the thread transition explicit when background work precedes Unity API access.

## Avoid sync-over-async

Bad:

```csharp
var result = LoadRemoteConfigAsync().Result;
```

Prefer an asynchronous call chain and explicit lifecycle/cancellation.

## Task versus Awaitable versus coroutine

Use `Awaitable` when Unity player-loop/thread switching semantics and single-consumer async flow fit.

Use `Task` when .NET interoperability, multiple awaiters, composition, or external APIs make it the appropriate contract.

Use coroutines for frame/yield-driven flows where iterator semantics match the project.

Use Jobs/Burst for suitable data-parallel CPU workloads after their package/platform constraints and measurement justify them.

No mechanism is the universal default.

## LINQ and allocations

Potentially bad in a measured hot path:

```csharp
private void Update()
{
    _visibleEnemies = _enemies
        .Where(enemy => enemy.IsVisible)
        .ToList();
}
```

A reusable list/manual loop can be better when profiling confirms per-frame allocation cost.

LINQ is acceptable in initialization, editor tooling, low-frequency transformations, and other paths where clarity dominates and allocation is immaterial.

## Update scale

A handful of meaningful `Update` callbacks is normal. Thousands of trivial callbacks can become an architectural cost.

Consider events, centralized update services, batching, or Jobs only when scale/profiling supports the change.

## ScriptableObject boundaries

Good use:

- shared immutable/tunable configuration;
- authored data assets;
- reusable designer data.

Risky use:

- mutable global session state stored in project assets;
- implicit service locator;
- hidden singleton with unclear reset/persistence semantics.

## Assembly layout example

```text
Game.Domain
Game.Runtime.Unity
Game.Editor
Game.Tests.EditMode
Game.Tests.PlayMode
```

Use only as a conceptual example. The actual number and shape of `.asmdef` boundaries must follow project dependency and compilation needs.
