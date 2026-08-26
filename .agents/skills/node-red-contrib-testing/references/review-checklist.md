# TypeScript Node-RED contrib testing review checklist

## Scope

- [ ] The base TypeScript Node-RED contrib dependency graph is active and valid.
- [ ] The behavior under test depends on Node-RED runtime semantics.
- [ ] Pure framework-neutral TypeScript behavior is tested at a smaller layer.
- [ ] Browser editor behavior is not simulated as if the runtime helper were a browser.
- [ ] Separate-process installation/dependency E2E is not disguised as a helper test.

## TypeScript and versions

- [ ] Test source and reusable flow fixtures are TypeScript rather than handwritten parallel JavaScript.
- [ ] Test TypeScript config/transform source comes from project evidence.
- [ ] Node-RED version/support range comes from project evidence.
- [ ] `node-red-node-test-helper` version comes from the lockfile/package metadata.
- [ ] Node-RED/helper declaration sources and versions are known.
- [ ] Declaration package versions are not treated as runtime/helper compatibility evidence.
- [ ] Callback versus Promise helper API matches the declared helper version rather than an assumed declaration signature.
- [ ] Runner/transformer/coverage configuration is delegated to the active runner skill/policy.

## Typed harness boundaries

- [ ] Helper/runtime objects use project-declared declarations rather than broad `any`.
- [ ] Known declaration/runtime mismatches are checked against the verified helper API before adding a workaround.
- [ ] Values returned from broad runtime/helper APIs are narrowed before project-specific methods are called.
- [ ] Flow fixtures are typed enough to catch relevant property/id/type mistakes without recreating Node-RED's type system locally.
- [ ] Declaration mismatches use minimal bounded augmentations/workarounds rather than whole-file suppression.

## Flow fixtures

- [ ] Test flows contain only nodes required for the behavior.
- [ ] Config nodes are represented explicitly and referenced by id.
- [ ] Helper nodes observe outputs instead of private implementation state.
- [ ] Credentials use synthetic typed values and the helper credential boundary.
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
- [ ] `httpAdmin` tests use the helper/admin boundary appropriate to the declared helper version.
- [ ] `httpNode` tests target the runtime HTTP root through the helper server URL and the project-approved HTTP client.
- [ ] `setFlows`/redeploy is used only when flow-change behavior is actually under test.
