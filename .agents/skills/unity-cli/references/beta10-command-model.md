# Unity CLI 1.0.0-beta.10 Command Model

This reference records only stable workflow implications needed by the agent. Live discovery remains authoritative.

## Machine-readable discovery

Beta.10 provides a machine-readable command manifest through:

```text
unity commands --format json
```

Use it for commands, subcommands, arguments, and options instead of scraping `--help`.

`unity skill show` is available in this line and can expose vendor skill material without installing it into the repository. Treat that material as supplemental; it does not override `CODEX_PROJECT.md` or repository rules.

## Editor/Pipeline commands

Use `unity list` to discover registered commands exposed by the connected Editor/Pipeline package. Parameter binding/schema belongs to the live Editor integration.

Do not hard-code a project-specific registered command in the portable skill.

## Project defaults

Beta.10 supports project CLI configuration under:

```text
ProjectSettings/UnityCliConfig.json
```

for supported build/test defaults.

Treat this as project configuration:

- read it before inventing flags;
- do not create/change it unless requested;
- version it according to the project's repository policy.

## Tests

Beta.10 includes affected/watch test workflows.

Use a persistent watcher only when explicitly requested/project-declared. Normal implementation validation should prefer bounded focused/affected/broad test runs.

## Command result

`unity command --result-only` can simplify machine processing when only the command payload is required. Preserve the full result envelope during diagnostics when warnings/errors/target/parameters are useful.

## Contexts

Named contexts can change which account/organization/cloud project/Editor/install path subsequent commands target.

Read current targeting before writes. Do not switch contexts merely because a command failed to locate a target; resolve ambiguity first.
