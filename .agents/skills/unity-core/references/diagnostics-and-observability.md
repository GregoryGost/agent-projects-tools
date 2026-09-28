# Unity Diagnostics And Observability

Use diagnostics to answer a concrete debugging question. Text logging is one tool among several; do not add instrumentation merely because a code path changed.

## Choose the signal by the question

| Question | Prefer |
| --- | --- |
| What discrete event happened? | bounded log/event/marker |
| What unexpected but recoverable condition occurred? | warning at the owning boundary |
| What operation failed? | existing result/exception contract plus actionable context |
| How long or how often does this occur? | Unity Profiler marker/counter or project metrics |
| What is the current complex state? | snapshot, inspector, or debug overlay |
| Where is the spatial problem? | gizmo/overlay/visual debugger |
| What sequence preceded a rare failure? | bounded breadcrumb history |

Reuse the project's existing diagnostics/logging infrastructure and taxonomy. Do not introduce a new logging framework, telemetry backend, category hierarchy, or scripting define merely to follow these examples.

## Log changes, not polling

Bad in a hot path:

```csharp
private void Update()
{
    Debug.Log($"AI state: {_state}");
}
```

Better when a transition is genuinely useful to diagnose:

```csharp
private void TransitionTo(AiState next, string reason)
{
    if (_state == next)
        return;

    Debug.Log(
        $"[AI][frame={Time.frameCount}] {_state} -> {next}; reason={reason}",
        this);

    _state = next;
}
```

Record the reason when it explains a decision or rejected transition. Stable object/entity identity and frame/time are useful only when they materially improve correlation.

## Severity and ownership

- `Debug.Log` is development/informational diagnostics, not an automatic production requirement.
- `Debug.LogWarning` is for unexpected but recoverable conditions.
- `Debug.LogError` is for a failed operation or invalid state when that boundary owns reporting.
- `Debug.LogException` preserves the exception and stack information when the current boundary owns or adds actionable context.
- `Debug.Assert` expresses a programmer invariant; it is not a replacement for runtime validation or recovery.

Severity does not override the project's result/exception model. Do not catch only to log and rethrow when a higher owning boundary already reports the same failure. Avoid duplicate reports unless each layer adds materially different context.

When a relevant `UnityEngine.Object` exists, prefer the `context` overload so the Console can associate the message with that object.

## Build-aware diagnostics

Verbose diagnostics should be configurable, bounded, or removed from builds where they are not required. `UNITY_EDITOR` is not equivalent to "diagnostics enabled": Development Players and investigation builds can need diagnostics too.

If the project needs compile-time removable verbose logging and has no existing mechanism, a small conditional wrapper can be appropriate:

```csharp
using System.Diagnostics;
using UnityEngine;

internal static class GameDiagnostics
{
    [Conditional("ENABLE_GAME_DIAGNOSTICS")]
    public static void Log(string message, Object context = null)
    {
        UnityEngine.Debug.Log(message, context);
    }
}
```

Do not add this wrapper or define automatically. Prefer the project's existing build symbols and logging convention. Unity's `ILogger.logEnabled`, `filterLogType`, and `IsLogTypeAllowed` are useful runtime filters, but runtime filtering is not a substitute for compile-time removal when constructing the diagnostic arguments is itself expensive.

Unity Logging (`com.unity.logging`) is deprecated for Unity 6.3 and must not be introduced as this profile's default logging solution.

## Performance and stack traces

Diagnostic instrumentation shares the product performance budget.

- Do not emit uncontrolled text logs from `Update`, `FixedUpdate`, `LateUpdate`, animation/render/physics callbacks, polling loops, or per-entity loops.
- Prefer state-change-driven, one-shot, sampled, rate-limited, or investigation-only diagnostics.
- Avoid unnecessary interpolation, state dumps, allocations, stack capture, and serialization when the output is disabled or not useful.
- Use Unity Profiler/profiler markers for recurring timing, allocation, and hot-path questions instead of frame-by-frame timing logs.
- Do not enable full native/managed stack traces globally as a routine policy; configure stack trace depth by log type and investigation need.

## Breadcrumbs and snapshots

For genuinely sequence-dependent failures, a bounded in-memory history of significant events can be more useful than permanently emitting every event:

```text
12471 PlayerEnteredVehicle
12486 DoorClosed
12503 EngineStartRequested
12504 FuelCheckPassed
12505 EngineState Starting
12541 EngineState Failed reason=BatteryVoltageLow
```

Breadcrumbs are optional. If used, define ownership, bounded capacity, reset/session lifetime, thread behavior, and build policy. Do not create an unowned static global event list.

Snapshots are useful when the current state matters more than every transition. Keep them focused on fields required to answer the debugging question rather than serializing arbitrary object graphs.

## Visual diagnostics

Text is often the wrong medium for spatial and highly stateful problems. Prefer a bounded visual representation for paths, ranges, targets, trigger volumes, spawn regions, navigation, AI decisions, and similar state when it is clearer than a Console trace.

`UnityEngine.Gizmos`/`OnDrawGizmos*` can live with runtime components, but keep their work bounded. `UnityEditor.Handles`, custom inspectors, and `EditorWindow` tooling belong to Editor-only folders/assemblies through the `unity-editor` boundary. Do not add a `UnityEditor` dependency to runtime code merely for diagnostics.

## Diagnostic hygiene

- Use product/domain categories such as `[AI][Navigation]`, `[Save]`, or `[Network]` only when they fit the existing project taxonomy.
- Do not embed ticket IDs, backlog IDs, task names, implementation phases, temporary review markers, or historical workaround labels in runtime diagnostics.
- Do not log secrets, credentials, authentication tokens, personal data, or large payloads without an explicit project-approved diagnostic and redaction policy.
- Remote telemetry, crash uploads, screenshots, dumps, or persistent diagnostic collection are separate product/privacy/security decisions from local diagnostics.

## Testing coordination

When a Unity test intentionally exercises a path that emits an Error, Assert, Exception, or another message that the Unity Test Framework treats as a failure, use the project-supported `LogAssert` workflow to declare that expected output. Do not assert informational/debug message text merely to increase coverage; message wording becomes a test contract only when the text itself is required behavior.

## Industry patterns behind these recommendations

These are transferable patterns from public engineering material, not dependencies or APIs to copy:

- Riot Games: change-driven state logging, scoped detailed diagnostics, and state/history tooling for deterministic/gameplay debugging: https://www.riotgames.com/en/news/determinism-league-legends-fixing-divergences
- Riot Games: specialized tooling and low-impact instrumentation for complex spell/input state debugging: https://www.riotgames.com/en/news/art-of-spell-casting-part-2
- Ubisoft / Rainbow Six Siege: unified telemetry that distinguishes logs, markers, counters, scopes, state, call stacks, and performance data, with runtime masks and conditional C# instrumentation: https://media.gdcvault.com/gdc2016/Presentations/DePascale_Maurizio_Unified_Telemetry.pdf
- Guerrilla Games: AI debugging focused on explaining why behavior happened or did not happen, with visualized temporal/state information: https://www.guerrilla-games.com/read/out-of-sight-out-of-mind-improving-visualization-of-ai-info
- CD Projekt RED: runtime encounter/spawn debugging through visual state and profiler tooling rather than text-only traces: https://cdprojektred.atlassian.net/wiki/spaces/W3REDkit/pages/43810840/HOW-TO%2BFind%2Band%2Bdebug%2Bencounters
- Naughty Dog: post-failure forensic analysis through crash/core-dump context and game-specific tooling: https://www.naughtydog.com/blog/naughty_dog_at_gdc_2021

## Unity sources

- Debug.Log: https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Debug.Log.html
- Logger: https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Logger.html
- Application.SetStackTraceLogType: https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Application.SetStackTraceLogType.html
- Profiler: https://docs.unity3d.com/6000.3/Documentation/Manual/Profiler.html
- ProfilerMarker: https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Unity.Profiling.ProfilerMarker.html
- Gizmos: https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Gizmos.html
- Unity Logging package: https://docs.unity3d.com/Packages/com.unity.logging@1.3/manual/index.html
