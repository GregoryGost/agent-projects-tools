# Unity CLI Safety And Routing

## Read-only examples

Typical read-only operations include:

- version/schema/help discovery;
- current context/status/config resolution;
- registered command listing;
- inspecting build/test configuration;
- Editor queries with documented read-only semantics.

Still classify a registered Editor command from its documented schema/behavior; a custom command can mutate even if its name sounds like a query.

## Project mutations

Examples:

- creating/modifying/deleting scenes, prefabs, ScriptableObjects, assets, source files, or ProjectSettings;
- changing packages/manifest;
- saving serialized object changes through a registered Editor command or eval.

These require `implementation`.

## Local environment mutations

Examples:

- CLI self-update;
- Editor install/remove/default selection;
- module install/remove;
- plugin install/remove/upgrade;
- local MCP/client configuration;
- saved/default CLI contexts and other machine-local tool state.

These require `local-environment-only`, or a combined gate when project/remote changes are also requested.

## External/remote mutations

Examples:

- login/logout/account state;
- organization/cloud project/VCS remote state;
- remote jobs/services when applicable.

These require `external-system-only`.

## Eval examples

Read-only intent:

```csharp
Application.unityVersion
```

Potential project mutation:

```csharp
UnityEditor.AssetDatabase.DeleteAsset("Assets/Generated.asset")
```

Both run through the same CLI verb, but their routing is different.

## Combined commands

A command that creates a local project and also provisions/links cloud state spans multiple surfaces. Do not reduce it to a single mode because the executable is local.

Resolve each intended side effect explicitly.
