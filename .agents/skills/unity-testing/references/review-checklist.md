# Unity Testing Review Checklist

- [ ] Unity/Test Framework versions match project evidence.
- [ ] Pure logic is not unnecessarily tied to PlayMode.
- [ ] Lifecycle/physics/scene behavior is tested through the real Unity boundary.
- [ ] Test assemblies/platform constraints are correct.
- [ ] Temporary assets/scenes/objects are cleaned up.
- [ ] Static/global/Editor state is restored.
- [ ] Timing assertions use deterministic conditions and bounded waits.
- [ ] Production visibility was not widened only for tests.
- [ ] Test runner/CLI commands come from project configuration/tool discovery.
- [ ] Failures were rechecked in isolation.
