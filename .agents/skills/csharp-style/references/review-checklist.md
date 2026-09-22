# C# Style Review Checklist

## Configuration

- [ ] Applicable `.editorconfig` hierarchy was identified.
- [ ] `CODEX_PROJECT.md` style policy was checked.
- [ ] Existing source convention was inspected where configuration is silent.
- [ ] Portable defaults were not substituted for explicit project rules.

## Naming

- [ ] Public/types/interfaces/locals/fields follow active naming rules.
- [ ] Boolean names communicate state/capability.
- [ ] Static-field prefix follows project policy rather than an assumed universal rule.
- [ ] Framework/reflection/serialization-discovered names were preserved.

## Formatting

- [ ] Formatting is scoped to owned/touched code.
- [ ] No generated or vendored code was reformatted unintentionally.
- [ ] Line ending and final-newline policy is preserved.
- [ ] IDE0055 severity was not escalated without project policy.

## Unity safety

- [ ] Serialized field renames were avoided or migrated intentionally.
- [ ] Unity callbacks/messages were not renamed.
- [ ] Unity-generated `.csproj`/`.sln` were not edited as durable configuration.
- [ ] Unity analyzer/ruleset enforcement was not conflated with IDE preferences.
