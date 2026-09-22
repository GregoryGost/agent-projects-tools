# C# core rules

Apply this rule when `CODEX_PROJECT.md` declares C# active or when the task directly creates, changes, reviews, or refactors C# code.

This rule is framework-neutral. Framework and engine constraints, including Unity language/API/runtime constraints, belong to their active overlays.

## Required skills

Use together with:

- `csharp-core`.

## Source of truth

Before changing C# code:

1. Read `CODEX_PROJECT.md` when it exists.
2. Determine the effective language version, runtime/API surface, target framework or engine, nullable context, unsafe-code policy, analyzer configuration, and project-declared validation commands.
3. Inspect existing source conventions and public contracts before changing structure.
4. Treat generated project files as generated when the owning framework or engine regenerates them.
5. Do not assume the latest C# or .NET feature is available merely because current Microsoft documentation describes it.

When Unity is active, the Unity profile owns the effective C# subset, API Compatibility Level, scripting backend, target platform, and generated project-file constraints.

## Code structure

- Keep types and members focused on one responsibility.
- Prefer explicit domain names over vague names such as `data`, `item`, `manager`, or `helper` when a more precise concept is known.
- Prefer early returns when they reduce nesting and preserve readability.
- Keep public API intentional; do not widen visibility only to make testing or access easier.
- Prefer composition over inheritance unless a true subtype relationship or framework contract requires inheritance.
- Use interfaces at boundaries with meaningful substitutability or multiple implementations; do not create one-member interfaces mechanically.
- Keep side effects at explicit boundaries where practical.
- Do not introduce static mutable global state without a clear lifecycle and ownership model.

## Types and contracts

- Prefer the narrowest type that expresses the contract.
- Keep public method, property, event, and constructor contracts explicit.
- Use nullable reference annotations only when the project enables and understands that nullable context.
- Do not suppress nullable diagnostics broadly to avoid modeling nullability.
- Prefer immutable state when mutation is not required, while respecting framework serialization and lifecycle constraints.
- Use records only when supported by the effective language/runtime and appropriate for the framework contract.
- Do not change public signatures, serialized contracts, reflection-discovered names, or framework callback signatures without checking consumers.

## Exceptions and results

- Throw exceptions for exceptional or contract-violating conditions, not ordinary branching.
- Preserve project-specific result/error conventions at service and integration boundaries.
- Never catch `Exception` only to ignore it.
- Preserve the original exception as `InnerException` when translating exceptions and the original failure is relevant.
- Do not use exceptions as expected per-frame or high-frequency control flow.

## Resource ownership

- Dispose `IDisposable` and `IAsyncDisposable` resources according to their ownership boundary.
- Do not dispose a borrowed/shared resource owned by a container, framework, engine, or caller.
- Prefer `using` / `await using` when the effective language/runtime supports them and lexical ownership is correct.
- Make cleanup idempotent when partial initialization or repeated shutdown is possible.

## Async and concurrency

- Prefer `async`/`await` over blocking waits for asynchronous operations.
- Avoid `.Result`, `.Wait()`, and sync-over-async on contexts where they can block or deadlock.
- Propagate cancellation when the operation has a meaningful cancellation boundary.
- Do not start fire-and-forget work without explicit lifetime, error observation, and shutdown behavior.
- Treat thread affinity as a framework/runtime concern; active overlays may require main-thread execution.

## Collections and LINQ

- Choose collections by semantics, lookup/update complexity, ordering, uniqueness, allocation behavior, and project constraints.
- LINQ is not forbidden. Avoid it in measured hot paths when allocations, enumeration cost, or readability are materially worse.
- Do not replace a clear LINQ query with manual loops without an actual performance or compatibility reason.
- Avoid repeated enumeration when the source is expensive, stateful, or not guaranteed to be repeatable.

## Review checklist

- [ ] Effective C# and runtime/API versions were established from project evidence.
- [ ] Public and framework contracts remain compatible or changed intentionally.
- [ ] Nullability, resource ownership, async behavior, and exceptions have explicit semantics.
- [ ] No unsupported language feature was introduced.
- [ ] Generated files were not treated as durable source configuration.
- [ ] Active framework/engine overlays were applied where required.
- [ ] Project-declared validation was run or the gap was reported.
