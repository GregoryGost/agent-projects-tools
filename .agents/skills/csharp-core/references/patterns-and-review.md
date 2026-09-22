# C# Core Patterns And Review

These examples are portable defaults. Existing project contracts and active framework rules win.

## Good: narrow immutable input contract

```csharp
public sealed class MoveRequest
{
    public MoveRequest(Vector2 direction, float speed)
    {
        Direction = direction;
        Speed = speed;
    }

    public Vector2 Direction { get; }
    public float Speed { get; }
}
```

Why this is good:

- constructor establishes valid state;
- callers cannot mutate the request accidentally;
- the public contract is explicit.

Do not copy this pattern into a framework-serialized type when the framework requires mutable fields or another construction model.

## Bad: boolean flag API

```csharp
Save(user, true, false);
```

The call site does not communicate what either flag means.

## Better: explicit options or separate operations

```csharp
Save(user, new SaveOptions
{
    ValidateBeforeSave = true,
    PublishAfterSave = false,
});
```

Use a separate method instead when the options represent distinct operations rather than one cohesive command.

## Bad: sync-over-async

```csharp
var result = client.LoadAsync().Result;
```

Problems:

- can block a synchronization context;
- hides cancellation and asynchronous lifetime;
- can deadlock in framework-specific contexts.

## Good: preserve async flow

```csharp
var result = await client.LoadAsync(cancellationToken);
```

The exact cancellation and context behavior still belongs to the active framework.

## Bad: swallowed exception

```csharp
try
{
    Persist();
}
catch (Exception)
{
}
```

## Good: handle a known failure or propagate it

```csharp
try
{
    Persist();
}
catch (IOException exception)
{
    logger.LogError(exception, "Failed to persist the save file.");
    throw;
}
```

Do not add logging-and-rethrow if the project already logs centrally and this would duplicate logs.

## LINQ is contextual

Bad in a measured allocation-sensitive hot path:

```csharp
var visible = enemies.Where(enemy => enemy.IsVisible).ToList();
```

Good in a low-frequency data transformation where it improves clarity:

```csharp
var activeIds = users
    .Where(user => user.IsActive)
    .Select(user => user.Id)
    .ToArray();
```

The skill never bans LINQ globally. Profile first; optimize measured hot paths.
