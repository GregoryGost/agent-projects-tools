# Unity 6.3 Core Review Checklist

## Version/profile

- [ ] `ProjectSettings/ProjectVersion.txt` confirms Unity 6000.3.x.
- [ ] Exact package versions affecting the change were checked.
- [ ] Target platforms, scripting backends, and API Compatibility Level are known where relevant.
- [ ] Later-Unity behavior was not imported without verification.

## Runtime/Editor boundaries

- [ ] Runtime assemblies do not reference `UnityEditor`.
- [ ] Generated project/solution files were not edited as durable configuration.
- [ ] Assembly Definition dependencies remain intentional.

## Serialization

- [ ] Serialized fields use supported types.
- [ ] Serialized field renames preserve data.
- [ ] Transient/derived state is not persisted accidentally.
- [ ] Inspector exposure did not unnecessarily widen public API.

## Lifecycle

- [ ] Event/listener registration has matching cleanup.
- [ ] Unity callbacks do not rely on undocumented cross-object ordering.
- [ ] Static state respects Enter Play Mode/domain reload settings.
- [ ] Destroyed Unity object semantics are handled correctly.

## Async/threading

- [ ] No `Awaitable` instance is awaited more than once.
- [ ] Unity APIs run on the main thread when required.
- [ ] No sync-over-async was introduced.
- [ ] Background work has lifetime/cancellation/error ownership.

## Performance

- [ ] Optimization is supported by scale/profiler evidence.
- [ ] Hot-path allocations/lookups are intentional.
- [ ] Readability/correctness was not sacrificed for speculative optimization.

## Diagnostics

- [ ] Non-trivial failure, decision, integration, or state-transition paths are diagnosable where resulting state alone would be insufficient.
- [ ] Every persistent diagnostic signal answers a concrete debugging question; instrumentation was not added mechanically.
- [ ] Meaningful changes/transitions are preferred over repeated state polling, and decision reasons are captured where useful.
- [ ] High-frequency paths contain no uncontrolled textual logging, expensive disabled-message construction, or speculative instrumentation.
- [ ] Recurring timing/allocation questions use profiler instrumentation where appropriate.
- [ ] Exception/result ownership is preserved; the same failure is not redundantly logged at multiple layers.
- [ ] Runtime diagnostics do not acquire `UnityEditor` dependencies; Editor-only visualization remains in the Editor boundary.
- [ ] Breadcrumb/snapshot storage, when used, is bounded and has explicit ownership/reset/build behavior.
- [ ] Diagnostic categories and strings contain product/domain terminology, not task/ticket/implementation-history markers.

## Validation

- [ ] Compilation/Console state was checked.
- [ ] Relevant EditMode/PlayMode tests were run where available.
- [ ] Runtime behavior was validated when compile-time evidence was insufficient.
