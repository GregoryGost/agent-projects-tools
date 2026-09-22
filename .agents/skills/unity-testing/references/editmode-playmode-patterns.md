# Unity EditMode And PlayMode Test Patterns

## Pure logic should stay narrow

Bad default:

- create a GameObject;
- add a component;
- enter PlayMode;
- wait a frame;
- assert a pure arithmetic rule.

Better:

```csharp
[Test]
public void DamageCannotReduceHealthBelowZero()
{
    var health = new Health(10);

    health.ApplyDamage(20);

    Assert.That(health.Current, Is.Zero);
}
```

Use PlayMode only if Unity lifecycle/engine behavior is part of the contract.

## Lifecycle behavior belongs in PlayMode

Example intent:

- instantiate prefab;
- allow `Awake`/`OnEnable`/`Start` to run;
- perform action;
- observe component state;
- destroy spawned object.

Use project Test Framework helpers/patterns; clean everything created.

## Avoid arbitrary delays

Bad:

```csharp
yield return new WaitForSeconds(5f);
Assert.That(component.IsReady, Is.True);
```

Better:

- wait for an observable condition with a bounded timeout;
- yield the minimum frames required by a documented engine transition.

## Physics

Physics tests that depend on the fixed update/physics engine should run against the real Unity physics boundary. Avoid replacing the entire physics interaction with mocks and then claiming engine behavior is tested.

## Editor serialization

Use EditMode tests for custom inspectors, SerializedObject workflows, importers, asset migration, and Editor-only utilities. Create/copy isolated assets and remove them in teardown.
