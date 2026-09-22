# Unity Editor Review Checklist

- [ ] Exact Unity 6000.3 patch was confirmed.
- [ ] All `UnityEditor` references are Editor-only.
- [ ] Serialized state uses `SerializedObject`/`SerializedProperty` where appropriate.
- [ ] Undo behavior is preserved for user-visible mutations.
- [ ] Multi-object editing is preserved when expected.
- [ ] Prefab instance/asset changes preserve override semantics.
- [ ] Dirty/save/refresh operations are necessary and scoped.
- [ ] Importer/AssetDatabase operations avoid invalid callback contexts and excessive global work.
- [ ] Scene/prefab automation preserves unrelated user state.
- [ ] Editor callbacks/resources/listeners are cleaned up.
- [ ] EditMode/Editor tests or equivalent validation cover the changed tooling.
