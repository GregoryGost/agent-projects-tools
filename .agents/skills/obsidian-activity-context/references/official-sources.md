# Official Sources

Use these sources to verify plugin capabilities and configuration boundaries before changing claims in this skill.

## Semantic Notes Vault MCP

- Repository: <https://github.com/aaronsb/obsidian-mcp-plugin>

Verify the connected server version and exposed tool schemas at runtime. Do not infer a Templater execution operation unless the connected MCP explicitly exposes and documents it.

## Templater

- Repository: <https://github.com/SilentVoid13/Templater>
- Documentation: <https://silentvoid13.github.io/Templater/>
- Settings and folder-template behavior: <https://silentvoid13.github.io/Templater/settings.html>

Templater can apply templates through configured Obsidian workflows, but the activity-context workflow must verify the resulting note through MCP rather than assume that note creation executed template expressions.
