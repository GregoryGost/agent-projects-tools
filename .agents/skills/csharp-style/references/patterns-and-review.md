# C# Style Patterns And Review

## Good: private Inspector field without widening API

When Unity is active:

```csharp
[SerializeField]
private float _moveSpeed = 5f;

public float MoveSpeed => _moveSpeed;
```

Use a public field only when public mutability is part of the intended API.

## Bad: cosmetic serialized-field rename

```csharp
// Before
[SerializeField]
private float speed;

// Style-only rewrite
[SerializeField]
private float _speed;
```

Unity serialization uses field names. A cosmetic rename can disconnect existing serialized data.

## Good: intentional migration

```csharp
[FormerlySerializedAs("speed")]
[SerializeField]
private float _speed;
```

Use this only for a real rename and keep the attribute for the project's migration policy. Do not rename serialized fields solely to satisfy a style preference.

## Bad: style rule changes framework contracts

```csharp
private void update()
{
}
```

Renaming Unity's `Update` message to satisfy a mistaken local convention changes behavior.

## Good: style preferences remain configurable

```csharp
var player = new Player();
PlayerSettings settings = LoadSettings();
```

Whether `var` is preferred in either declaration is project policy. Read `csharp_style_var_*` options instead of enforcing a personal preference.

## Bad: repository-wide formatter churn during a feature change

A small gameplay change should not reformat hundreds of unrelated C# files.

## Good: scoped formatting

Format changed C# files or touched regions using the project-declared formatter and keep semantic changes reviewable.
