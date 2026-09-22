# C# Core Review Checklist

## Compatibility

- [ ] Effective C# language version is known.
- [ ] Runtime/API surface and target framework/engine are known.
- [ ] Nullable and unsafe-code policies are known where relevant.
- [ ] No syntax/API was selected only because it exists in the latest .NET documentation.

## API and modeling

- [ ] Public surface is intentional.
- [ ] Visibility was not widened only for tests/convenience.
- [ ] Interfaces represent useful boundaries.
- [ ] Inheritance represents a real subtype/framework contract.
- [ ] Reflection-, serialization-, and callback-discovered names remain compatible.

## State and ownership

- [ ] Mutable static state has explicit ownership/lifetime.
- [ ] Owned disposable resources are cleaned up.
- [ ] Borrowed/shared resources are not disposed by consumers.
- [ ] Events/listeners/callbacks have symmetric lifecycle where required.

## Async/concurrency

- [ ] No avoidable blocking wait exists in async code.
- [ ] Fire-and-forget work has error observation and lifecycle ownership.
- [ ] Cancellation is propagated where meaningful.
- [ ] Framework thread-affinity rules are respected.

## Errors

- [ ] Exceptions are not swallowed.
- [ ] Expected outcomes are not modeled as high-frequency exceptions.
- [ ] Exception translation preserves useful cause information.

## Validation

- [ ] Call sites/tests were reviewed for changed contracts.
- [ ] Project-declared validation was run or explicitly reported as unavailable.
