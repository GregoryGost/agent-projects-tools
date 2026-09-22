# Portable C# EditorConfig Baseline

Use this only when a project has no established C# style configuration. Adapt it instead of replacing an existing `.editorconfig`.

```ini
[*.cs]
indent_style = space
indent_size = 4
tab_width = 4
insert_final_newline = true

dotnet_sort_system_directives_first = true
dotnet_separate_import_directive_groups = false

dotnet_style_qualification_for_field = false:suggestion
dotnet_style_qualification_for_property = false:suggestion
dotnet_style_qualification_for_method = false:suggestion
dotnet_style_qualification_for_event = false:suggestion

csharp_style_var_for_built_in_types = false:suggestion
csharp_style_var_when_type_is_apparent = true:suggestion
csharp_style_var_elsewhere = false:suggestion

csharp_new_line_before_open_brace = all

dotnet_naming_rule.interfaces_should_be_prefixed.severity = suggestion
dotnet_naming_rule.interfaces_should_be_prefixed.symbols = interfaces
dotnet_naming_rule.interfaces_should_be_prefixed.style = prefix_interface

dotnet_naming_symbols.interfaces.applicable_kinds = interface
dotnet_naming_style.prefix_interface.required_prefix = I
dotnet_naming_style.prefix_interface.capitalization = pascal_case

```

## Important limitations

- The baseline documents `_camelCase` for private/internal instance fields but deliberately does not encode that rule in the portable snippet: EditorConfig naming symbol groups do not provide a clean non-static field selector. Add project-specific field rules only when their static/instance semantics are explicit.
- Keep portable defaults at `suggestion` until the project explicitly adopts stricter enforcement.
- Do not set `dotnet_diagnostic.IDE0055.severity = error` by default.
- Do not add `root = true` unless the repository should stop inheriting parent configuration.
- Do not assume the Unity Editor compiler enforces all IDE style preferences. Unity analyzer/ruleset behavior is a separate concern.
- Preserve the repository's line ending and encoding policy rather than copying a platform-specific default blindly.
