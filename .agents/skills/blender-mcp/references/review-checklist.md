# Blender MCP Review Checklist

- [ ] Official Blender Lab implementation was identified.
- [ ] MCP/add-on version or pinned source is known.
- [ ] Intended Blender process/file/scene is unambiguous.
- [ ] Current tool catalog was used for the active version.
- [ ] Dedicated summaries/docs/screenshots were preferred for inspection.
- [ ] `execute_blender_code` is bounded and returns structured evidence.
- [ ] Real side effects were classified independently of MCP annotations.
- [ ] Weak sandbox was not treated as a security boundary.
- [ ] Unrelated files/secrets/network/environment were not accessed.
- [ ] Incidental UI state was preserved/restored where practical.
- [ ] Live Editor was not silently replaced by background Blender.
- [ ] MCP/add-on/client configuration was not changed without authorization.
