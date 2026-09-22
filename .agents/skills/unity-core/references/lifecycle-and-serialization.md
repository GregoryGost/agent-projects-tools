# Unity Lifecycle And Serialization Patterns

## Inspector exposure is not public API

Bad:

```csharp
public float MoveSpeed = 5f;
```

when the field is public only so a designer can edit it.

Good:

```csharp
[SerializeField]
private float _moveSpeed = 5f;

public float MoveSpeed => _moveSpeed;
```

Public mutability is still correct when it is an intentional external contract.

## Serialized rename

Bad:

```csharp
[SerializeField]
private float speed;

// Later renamed only for style:
[SerializeField]
private float _speed;
```

Existing serialized data can lose the connection to the field.

Good for an intentional rename:

```csharp
[FormerlySerializedAs("speed")]
[SerializeField]
private float _speed;
```

Follow the project's migration-retention policy for the attribute.

## Unsupported container assumption

Bad in the Unity 6000.3 portable profile:

```csharp
[SerializeField]
private Dictionary<string, ItemData> _items;
```

Do not assume direct Unity serialization for dictionaries or nested containers. Prefer a serializable list/wrapper or a deliberate custom serialization layer when dictionary semantics are needed.

## Unity object null semantics

Bad cleanup refactor:

```csharp
if (!ReferenceEquals(target, null))
{
    target.Use();
}
```

A destroyed `UnityEngine.Object` can still have a managed wrapper. Use Unity-aware object validity semantics when engine object lifetime is what matters.

## Event lifecycle

Bad:

```csharp
private void OnEnable()
{
    GameEvents.ScoreChanged += OnScoreChanged;
}
```

with no matching unsubscribe.

Good:

```csharp
private void OnEnable()
{
    GameEvents.ScoreChanged += OnScoreChanged;
}

private void OnDisable()
{
    GameEvents.ScoreChanged -= OnScoreChanged;
}
```

Choose `OnDisable`/`OnDestroy` according to the actual lifetime; do not copy the pair mechanically when the subscription owner has different semantics.

## Domain reload disabled

If the project's Enter Play Mode settings disable domain reload, static fields and static event handlers persist across Play sessions.

Good pattern when a static value must reset:

```csharp
[RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.SubsystemRegistration)]
private static void ResetState()
{
    s_sessionCounter = 0;
}
```

Use a reset hook because the project needs it, not because all static fields universally require one.

## Component lookup

Potentially bad in a hot per-frame path:

```csharp
private void Update()
{
    GetComponent<Rigidbody>().AddForce(_force);
}
```

Better when the reference is stable:

```csharp
private Rigidbody _body;

private void Awake()
{
    _body = GetComponent<Rigidbody>();
}

private void FixedUpdate()
{
    _body.AddForce(_force);
}
```

Do not cache one-off lookups that are cheap and clearer inline merely to satisfy a rule.
