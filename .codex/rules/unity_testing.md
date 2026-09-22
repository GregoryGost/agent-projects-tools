# Unity 6.3 testing rules

Apply this rule only when `CODEX_PROJECT.md` declares the `unity-testing` profile active, or when this source artifact is maintained in the template repository.

This is a Unity Test Framework overlay for Unity 6000.3.x. It does not replace framework-neutral C# tests or project E2E/build validation.

## Required skills

Use together with:

- `unity-core`;
- `unity-testing`.

Required base rule:

- `.codex/rules/unity_core.md`.

## Source of truth

Before changing tests:

1. Confirm the exact Unity 6000.3 patch.
2. Read `Packages/manifest.json` and `Packages/packages-lock.json` to determine the Unity Test Framework package/version actually used by the project.
3. Inspect test assemblies, `.asmdef` constraints, EditMode/PlayMode layout, existing fixtures, setup/teardown, and project test commands.
4. Use project-declared CLI/batch commands when present; do not invent command names or assume `dotnet test` can run Unity-specific tests.

## Boundary selection

Prefer the narrowest test boundary that proves the behavior:

- pure framework-neutral logic: ordinary C# unit test where the project supports it;
- Editor API and serialization tooling: EditMode/Editor test;
- `MonoBehaviour` lifecycle, scenes, physics, frames, coroutines, Unity `Awaitable`/player-loop behavior: PlayMode test;
- build/player/platform-specific behavior: player/build/CI validation as declared by the project.

Do not use PlayMode merely because production code lives in a Unity project.

## EditMode

- Keep EditMode tests fast and isolated.
- Use temporary assets/scenes/directories where mutation is required and clean them up reliably.
- Avoid dependence on current open scene, selection, Editor window state, user preferences, or unrelated project assets unless that state is the subject of the test.
- Restore global/static/Editor state changed by a test.

## PlayMode

- Make frame/timing expectations explicit.
- Use `UnityTest`/yield-based or project-supported async test patterns for player-loop-dependent behavior.
- Bound waits with timeouts/conditions; do not rely on arbitrary long delays.
- Clean up spawned objects, loaded scenes, subscriptions, statics, and persistent state.
- Keep tests deterministic across repeated runs and the project's configured Enter Play Mode behavior.

## Test doubles and architecture

- Prefer pure-domain tests for framework-neutral logic.
- Do not mock Unity lifecycle methods to "test" behavior that must be validated by the actual engine lifecycle.
- Use small fakes/stubs at external integration boundaries where useful.
- Avoid broad mocking of `UnityEngine.Object` behavior because its lifetime/null semantics differ from ordinary CLR objects.
- Do not make production fields public only for test access.

## Assets and scenes

- Tests creating assets/scenes must use isolated names/paths and delete them in teardown.
- Do not modify canonical production prefabs/scenes as shared mutable test fixtures.
- If a test intentionally validates migration of a real serialized asset, isolate/copy the fixture according to project policy.
- Avoid assertions that depend on unstable Unity-generated IDs unless IDs are the contract.

## Coverage and affected tests

- Use project-declared coverage workflow only when coverage is active.
- Treat line coverage as supporting evidence, not proof of runtime behavior.
- Use affected/focused test selection when the active tooling supports it, then run the broader suite required by project policy.
- Do not start a persistent test watcher unless explicitly requested or declared as the development workflow.

## Unity CLI coordination

When `unity-cli` is active, its native test/report/coverage commands are a preferred automation surface when they match project policy. The CLI remains optional and is not a hard dependency of this testing profile.

## Review checklist

- [ ] Actual Unity Test Framework package/version was confirmed.
- [ ] Test boundary is no broader than necessary.
- [ ] Unity-specific lifecycle behavior is tested in the real engine boundary.
- [ ] Test assets/scenes/global state are isolated and cleaned up.
- [ ] No arbitrary sleeps replace deterministic conditions.
- [ ] Tests are repeatable across the configured Play Mode reload policy.
- [ ] Project-declared test/coverage commands were used.
