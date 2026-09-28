# Unity Editor Patterns And Review

## Serialized inspector editing

Bad:

```csharp
public override void OnInspectorGUI()
{
    var component = (Mover)target;
    component.Speed = EditorGUILayout.FloatField("Speed", component.Speed);
}
```

This bypasses normal serialized-property handling and can undermine multi-object editing, Undo, and prefab override behavior.

Preferred when editing serialized state:

```csharp
private SerializedProperty _speed;

private void OnEnable()
{
    _speed = serializedObject.FindProperty("_speed");
}

public override void OnInspectorGUI()
{
    serializedObject.Update();
    EditorGUILayout.PropertyField(_speed);
    serializedObject.ApplyModifiedProperties();
}
```

## Direct non-serialized mutation

When serialized properties are not the right abstraction:

```csharp
Undo.RecordObject(target, "Rebuild Cache");
component.RebuildEditorCache();
EditorUtility.SetDirty(component);
```

Use dirty/save APIs only when required for the kind of object being changed.

## Asset batch

Potentially bad:

```csharp
foreach (var path in paths)
{
    ImportOne(path);
    AssetDatabase.Refresh();
    AssetDatabase.SaveAssets();
}
```

Prefer a bounded batch and one appropriate refresh/save boundary when the APIs and importer lifecycle permit it.

## Scene/prefab text editing

Bad default:

- search/replace YAML fields in `.unity` or `.prefab`;
- invent file IDs/GUID references manually.

Preferred:

- load through Unity Editor APIs;
- change objects/components/serialized properties;
- save the intended asset/scene explicitly.

Textual serialization edits are exceptional and require strong evidence that Unity's API path cannot express the change safely.

## Diagnostic visualization

Prefer visual diagnostics over repeated Console output when the problem is spatial or difficult to reconstruct from text.

Runtime-component example using `UnityEngine.Gizmos`:

```csharp
private void OnDrawGizmosSelected()
{
    Gizmos.DrawWireSphere(transform.position, detectionRadius);
}
```

Keep the computation bounded; do not perform expensive searches, allocations, or gameplay mutations from the draw callback.

If diagnostics require `UnityEditor.Handles`, a custom inspector, or an `EditorWindow`, put that adapter in an Editor-only folder/assembly. Do not wrap substantial Editor tooling inside runtime code with `#if UNITY_EDITOR` merely to avoid a proper assembly boundary.

Temporary visual-debug state should normally remain transient. Do not modify canonical scenes, prefabs, or assets simply to remember a debugging session unless persistence is an intentional authoring feature.
