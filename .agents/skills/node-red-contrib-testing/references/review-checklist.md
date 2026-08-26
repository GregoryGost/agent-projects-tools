# Node-RED contrib testing review checklist

## Scope

- [ ] The behavior under test depends on Node-RED runtime semantics.
- [ ] Pure TypeScript/JavaScript behavior is tested at a smaller framework-neutral layer.
- [ ] Browser editor behavior is not simulated as if the runtime helper were a browser.
- [ ] Separate-process installation/dependency E2E is not disguised as a helper test.

## Versions and harness

- [ ] Node-RED version/support range comes from project evidence.
- [ ] `node-red-node-test-helper` version comes from the lockfile/package metadata.
- [ ] Callback versus Promise helper API matches the declared helper version.
- [ ] Runner/transformer/coverage configuration is delegated to the active runner skill/policy.

## Flow fixtures

- [ ] Test flows contain only nodes required for the behavior.
- [ ] Config nodes are represented explicitly and referenced by id.
- [ ] Helper nodes observe outputs instead of private implementation state.
- [ ] Credentials use synthetic values and the helper credential boundary.
- [ ] Flow fixtures do not contain production secrets or unrelated exported nodes.

## Async behavior

- [ ] Observers are attached before triggering messages/events.
- [ ] Assertion errors inside flow callbacks reach the test runner.
- [ ] Completion waits for the actual observable behavior.
- [ ] Arbitrary sleeps are not used as success conditions.
- [ ] Test timeouts are bounds, not synchronization mechanisms.

## Lifecycle and isolation

- [ ] `helper.unload()` runs for every loaded flow.
- [ ] Helper HTTP server is stopped when started.
- [ ] Runtime/helper settings do not leak between tests.
- [ ] Node/config-node resource cleanup is asserted when it is part of the change.
- [ ] Test-runner mocks, environment changes, timers, and external resources are restored by their owning layer.

## HTTP and redeploy

- [ ] HTTP server setup exists only in suites that exercise registered routes.
- [ ] Admin/runtime route behavior is tested through the correct Node-RED surface.
- [ ] `setFlows`/redeploy is used only when flow-change behavior is actually under test.
