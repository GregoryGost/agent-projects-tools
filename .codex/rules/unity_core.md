# Unity 6.3 core rules

Apply this rule only when `CODEX_PROJECT.md` declares the `unity-core` stack profile active, or when this source artifact is being maintained directly in the `agent-projects-tools` template repository.

The portable profile is version-bounded to Unity 6.3 / `6000.3.x`. The priority verified target for this profile is Unity `6000.3.24f1`. A different Unity major/minor line requires separate verification or an explicit update of this profile.

## Required skills

Use together with:

- `csharp-core`;
- `unity-core`.

Required base rule:

- `.codex/rules/csharp_core.md`.

## Version and project evidence

Before changing Unity runtime code:

1. Read `ProjectSettings/ProjectVersion.txt` and confirm the exact Editor version.
2. Read `Packages/manifest.json` and `Packages/packages-lock.json` for package versions that affect the task.
3. Read the Unity section of `CODEX_PROJECT.md` for targets, scripting backends, API Compatibility Level, assembly policy, Enter Play Mode policy, and validation commands.
4. Inspect relevant `.asmdef`/`.asmref` files, Player settings, source, scenes/prefabs/assets, and tests as needed.
5. Use Unity 6000.3 documentation for engine behavior. Use exact patch release notes/Issue Tracker when the behavior may be patch-specific.
6. Do not silently apply guidance from a later Unity line to 6000.3.

Unity 6000.3 uses the Unity-supported Roslyn/C# 9 language surface. Unsupported C# features listed by Unity remain unsupported even if modern Microsoft C# documentation describes them.

## Runtime versus Editor boundary

- Runtime assemblies must not depend on `UnityEditor`.
- Keep Editor tools in Editor-only folders/assemblies or assemblies constrained to the Editor platform.
- Do not hide an Editor dependency behind conditional compilation when the code should be structurally separated.
- Treat Unity-generated solution/project files as generated artifacts, not durable configuration sources.

## Serialization

- Unity serialization is field-based; properties are not a replacement for serialized fields.
- Prefer private `[SerializeField]` fields when Inspector exposure is needed but public mutation is not part of the API.
- Do not serialize derived/cache/transient state when it can be recomputed safely.
- In the 6000.3 profile, do not assume dictionaries, multidimensional arrays, jagged arrays, or nested containers serialize directly. Use a supported representation or explicit serialization strategy.
- Before renaming a serialized field, preserve data with `FormerlySerializedAs` or a project-approved migration.
- Avoid deep managed-reference graphs and polymorphic serialization unless their semantics are required and understood.
- Do not use constructors of `MonoBehaviour` or `ScriptableObject` as normal runtime initialization hooks.

## Unity object semantics

- `UnityEngine.Object` has engine-managed lifetime and custom null/equality behavior. Do not replace Unity-aware null checks with CLR-only `ReferenceEquals` checks unless CLR wrapper identity is explicitly the subject.
- Use `Destroy` for ordinary runtime destruction. Use `DestroyImmediate` only in appropriate Editor-only workflows.
- Do not retain scene-object references in static state without an explicit lifetime/reset policy.

## Lifecycle and callbacks

- Use Unity callbacks for the responsibilities they own; do not rely on undocumented ordering between unrelated components.
- Prefer explicit initialization/dependency contracts over expanding Script Execution Order as a general architecture tool.
- Pair event/listener/subscription registration with a matching lifecycle cleanup path.
- Keep `Update`/`FixedUpdate`/`LateUpdate` work bounded. Do not ban per-frame callbacks mechanically; optimize measured scaling problems.
- Physics mutations that require the fixed timestep belong on the appropriate physics boundary.

## Enter Play Mode and static state

Domain reload is normally enabled in Unity 6000.3, but projects can disable it for faster Play Mode entry.

- Read the project Enter Play Mode settings before assuming static state resets.
- When domain reload is disabled, explicitly reset static mutable state and prevent duplicate static-event subscriptions.
- Do not add reset hooks everywhere when domain reload is enabled and the project has no need for them.
- Tests must not accidentally depend on the Editor's current Play Mode reload configuration unless that configuration is what the test verifies.

## Async, coroutines, jobs, and threads

- Select between `Awaitable`, `Task`, coroutines, and the Job System based on semantics, lifetime, thread affinity, fan-out, and package/platform constraints.
- Unity `Awaitable` instances are pooled; do not await the same instance multiple times.
- Most Unity APIs require the main thread. Return to the main thread before Unity API access after background work.
- Avoid `Task.Result`/`Wait()` on Unity execution paths.
- Fire-and-forget work requires explicit ownership, cancellation/error observation, and destruction/scene-change behavior.
- Do not introduce Jobs/Burst/DOTS as a style preference; use them for a demonstrated workload and with their dedicated project constraints.

## Performance and allocations

- Profile before architecture-scale optimization.
- Avoid repeated component/object lookup, LINQ allocations, string formatting, collection allocation, reflection, and boxing in measured hot paths when they are material.
- Cache stable references used frequently, but do not create permanent caches for cheap one-off operations.
- Prefer non-alloc/reuse patterns when profiling identifies garbage-collection pressure.
- Avoid large numbers of empty or trivial per-frame callbacks when a centralized/event-driven approach materially improves scale.
- Performance guidance must preserve correctness and readability.

## ScriptableObject and data

- Use `ScriptableObject` intentionally for shared serialized data/assets, configuration, and authoring workflows.
- Do not use mutable ScriptableObject assets as implicit global runtime singletons without an explicit ownership/reset policy.
- Separate immutable configuration from runtime session state when persistence across Play sessions/assets would be surprising.

## Assemblies

- Use assembly definitions as the project grows to express runtime/editor/test/feature boundaries and reduce unnecessary recompilation.
- Keep references narrow and acyclic where practical.
- Do not create an assembly for every folder without a dependency or compilation reason.
- Keep Editor and test assemblies separated from player/runtime assemblies.

## Optional coordination

- `csharp-style` for active C# formatting/naming policy.
- `unity-editor` for Editor API, asset authoring, inspectors, importers, and serialized Editor operations.
- `unity-testing` for Unity Test Framework behavior.
- `unity-cli` for official Unity CLI automation/validation.
- Package-specific overlays only when independently active.

## Review checklist

- [ ] Exact Unity 6000.3 patch and relevant package versions were confirmed.
- [ ] Runtime code is free of accidental `UnityEditor` dependencies.
- [ ] Serialized fields and migrations preserve project data.
- [ ] Unity object lifetime/null semantics are respected.
- [ ] Callback/event/static state lifecycle is explicit.
- [ ] Async/thread-affinity behavior is safe.
- [ ] Performance changes are evidence-based.
- [ ] Assembly and platform/backend constraints were considered.
- [ ] Project-declared Unity validation was run or the gap was reported.
