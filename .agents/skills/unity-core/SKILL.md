---
name: unity-core
description: "Use for Unity 6.3 runtime C# architecture, lifecycle, serialization, Unity object semantics, async/Awaitable, assemblies, and performance review."
---

# Unity Core

Use this skill for Unity 6.3 runtime implementation and review: `MonoBehaviour`, `ScriptableObject`, lifecycle callbacks, serialization, scenes/runtime objects, async work, thread affinity, assembly boundaries, performance-sensitive code, and Unity-specific C# behavior.

Priority verified target: Unity `6000.3.24f1`. The portable profile covers `6000.3.x` only after the exact project version is confirmed.

## Required Dependencies

Required skills:

- `csharp-core`.

Required rules:

- `.codex/rules/csharp_core.md`;
- `.codex/rules/unity_core.md`.

The mutual `unity_core.md ↔ unity-core` pair is intentional; both artifacts must be active independently through the project profile.

## Workflow

1. Read `CODEX_PROJECT.md`.
2. Read `ProjectSettings/ProjectVersion.txt` and confirm `6000.3.x`.
3. Inspect relevant package versions, Player/runtime settings, target platforms/backends, Enter Play Mode settings, assemblies, source, and tests.
4. Identify Unity-managed contracts: serialized fields, object references, callbacks, events, scenes/assets, async/thread boundaries, and runtime ownership.
5. Keep framework-neutral domain logic independent of `UnityEngine` when that reduces coupling and improves testability.
6. Make the smallest change consistent with existing architecture.
7. Validate compilation, Console state, focused tests, and runtime behavior through project-declared workflows.

Load references as needed:

- `references/lifecycle-and-serialization.md`.
- `references/async-performance-and-architecture.md`.
- `references/review-checklist.md`.
- `references/official-sources.md`.

## Baseline

- Treat Unity serialization and object lifetime as framework contracts, not ordinary CLR behavior.
- Prefer explicit ownership/lifecycle over hidden static/service-locator state.
- Keep runtime and Editor concerns separated.
- Keep version-sensitive behavior tied to `6000.3` docs and exact patch evidence.
- Prefer measurement over folklore for performance decisions.
- Use project package versions instead of assuming package APIs from the Editor version alone.

## Guardrails

- No direct `UnityEditor` dependency in runtime assemblies.
- No unsafe serialized-field rename.
- No blanket `Update`, LINQ, coroutine, `Task`, or `Awaitable` bans.
- No background-thread Unity API calls.
- No accidental persistent mutation of ScriptableObject assets for transient runtime state.
- No use of generated `.csproj`/`.sln` as durable Unity configuration.
