# Official Unity CLI rules

Apply this rule only when `CODEX_PROJECT.md` declares the `unity-cli` profile active, or when this source artifact is maintained directly in the template repository.

This profile is for the official Unity CLI executable `unity`. The priority verified version is `1.0.0-beta.10`. Other implementations named `unity-cli` are outside this profile.

The CLI is experimental and version-sensitive. Discover the installed command surface instead of relying on remembered syntax.

## Required skills

Use together with:

- `unity-cli`.

## Version and identity gate

Before using the CLI:

1. Resolve the executable actually invoked by the environment.
2. Run the project-declared version command and confirm the implementation/version.
3. For the priority profile, require official Unity CLI `1.0.0-beta.10` or explicitly re-verify the installed version.
4. Identify the target Unity project and, for Editor operations, the intended connected Editor.
5. Do not self-update the CLI, install/remove Editors/modules/plugins, switch contexts, alter authentication, or configure integrations unless the request/profile authorizes that surface.

## Command discovery

For `1.0.0-beta.10` prefer machine-readable discovery:

- `unity version --format json` for CLI identity/version when supported;
- `unity commands --format json` for commands/subcommands/options;
- `unity skill show --format json` for vendor skill material when useful;
- `unity list` for commands registered by a connected Editor/Pipeline;
- command-specific help when additional detail is needed.

Do not invent a command, flag, argument, or Editor command schema.

Vendor CLI/Pipeline/plugin skills are optional supplemental material, not hard dependencies of this repository profile.

## Configuration discovery

- Prefer explicit command-line flags for one-off overrides.
- Read `ProjectSettings/UnityCliConfig.json` when present.
- Use `unity config resolve` or the installed equivalent to determine effective configuration/source when configuration precedence matters.
- Do not create or rewrite project/global CLI configuration merely to make a command shorter unless the task requests configuration changes.
- Treat project config changes as repository/project mutations.

## Request-routing boundary

Every CLI operation inherits `.codex/rules/request_routing.md` and must be classified by actual side effects, not by the CLI verb.

Examples:

- command/schema/version/status/list queries: read-only;
- Play/pause/temporary profiler capture: local application/editor state;
- scene/prefab/asset/ProjectSettings mutation through an Editor command/eval: `implementation`;
- installing/removing Editors/modules/plugins, changing local defaults, CLI self-update: `local-environment-only`;
- authentication, cloud project/VCS/remote account mutation: `external-system-only`;
- commands combining project, local environment, and cloud mutations require all explicitly authorized surfaces.

A local HTTP/IPC/Pipeline boundary controlling the local Editor is not automatically an external-system operation.

## Structured commands before eval

Prefer, in order:

1. dedicated typed CLI command;
2. registered Editor/Pipeline command with discovered schema;
3. project-owned Editor utility;
4. `unity eval` only when no safer structured boundary fits.

Classify `unity eval` by the C# expression's real side effects. Read-only syntax can still call mutating APIs; the command name itself does not authorize mutation.

## Editor command safety

- Use `unity list`/live schema before calling version-sensitive registered commands.
- Prefer `--result-only` only when the caller genuinely needs only the returned payload; use the full envelope for diagnostics where errors/warnings/target/parameters matter.
- Verify persistent mutations by re-reading Unity/project state when practical.
- Do not run arbitrary asset/scene mutations against an ambiguous Editor/project.
- Preserve dirty user scenes/state when an automation path can avoid destructive changes.

## Build and test automation

- Use project CLI defaults when present and intentional.
- Do not silently change build target/profile/output or test mode based on global machine defaults.
- `unity watch test` or other persistent watchers require explicit request or project-declared workflow.
- Treat build/test reports, coverage, and output directories as project artifacts with project cleanup/version-control policy.

## Contexts, auth, plugins, and MCP

- Reading the current context is read-only.
- Saving/using/deleting named contexts changes local targeting state and requires `local-environment-only`; if it changes cloud/account targeting, account for the external-system surface before subsequent writes.
- Login/logout/token/account/org/cloud operations follow the external-system gate.
- Plugin install/remove/upgrade and CLI self-update require `local-environment-only` and explicit authorization.
- MCP/agent-client configuration writes are local-environment/configuration mutations and must not happen as an incidental prerequisite.

## Optional coordination

- `unity-core` for runtime/serialization/lifecycle semantics.
- `unity-editor` for persistent Editor/asset mutations.
- `unity-testing` for test boundary semantics.
- `csharp-core`/`csharp-style` when the CLI action creates/reviews C#.

## Review checklist

- [ ] Official Unity CLI identity/version was confirmed.
- [ ] Command/schema came from live discovery for the installed version.
- [ ] Target project/Editor/context is unambiguous.
- [ ] Real side effects were classified through request routing.
- [ ] No implicit self-update/install/context/auth/plugin/MCP mutation occurred.
- [ ] Structured commands were preferred over `eval`.
- [ ] Persistent project/environment/remote mutations were verified when possible.
