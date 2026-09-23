# Official Unity CLI Sources

Priority profile: official Unity CLI `1.0.0-beta.10`.

- Unity CLI overview: https://docs.unity.com/en-us/unity-cli
- Unity CLI reference: https://docs.unity.com/en-us/unity-cli/unity-cli-reference
- Release notes: https://docs.unity.com/en-us/unity-cli/release-notes
- Unity Pipeline package: https://docs.unity.com/en-us/unity-production-pipeline/local-tools-cli/unity-pipeline-package
- Official Unity CLI skill: https://github.com/Unity-Technologies/skills/tree/main/skills/unity-cli
- Official MCP/live Editor reference: https://github.com/Unity-Technologies/skills/blob/main/skills/unity-cli/references/integration-advanced.md

## Source precedence

1. installed executable identity/version;
2. `unity commands --format json`, `unity status --format json`, `unity list --format json`, and MCP `tools/list` as applicable for live machine-readable discovery;
3. `unity skill show --format json` and installed plugin/Pipeline skill material as supplemental version-specific guidance;
4. official reference/release notes matching the installed CLI;
5. project `ProjectSettings/UnityCliConfig.json` and resolved config for project-specific defaults;
6. curated repository guidance.

Never assume a command introduced in a later beta exists in beta.10.
