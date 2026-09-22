# C# Core Official Sources

Use project evidence first to determine the effective language, runtime, target framework, and framework/engine constraints.

## Microsoft sources

- C# documentation: https://learn.microsoft.com/en-us/dotnet/csharp/
- C# language reference: https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/
- C# version history: https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-version-history
- Async programming: https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/
- Exceptions and best practices: https://learn.microsoft.com/en-us/dotnet/standard/exceptions/best-practices-for-exceptions
- IDisposable guidance: https://learn.microsoft.com/en-us/dotnet/standard/garbage-collection/implementing-dispose
- Nullable reference types: https://learn.microsoft.com/en-us/dotnet/csharp/nullable-references

## Framework/engine precedence

Language documentation describes C# semantics but does not prove that a framework or engine supports the latest language/runtime surface.

For Unity work, use the active Unity profile and matching Unity version documentation to establish the supported C# subset, .NET API profile, scripting backend, AOT constraints, serialization behavior, and thread/lifecycle rules.

## Source precedence

1. `CODEX_PROJECT.md` and repository/runtime evidence.
2. Active framework/engine profile and version-specific official docs.
3. Microsoft C#/.NET documentation for language/runtime semantics within that boundary.
4. Curated patterns in this skill.
5. Community guidance only as supplementary evidence.
