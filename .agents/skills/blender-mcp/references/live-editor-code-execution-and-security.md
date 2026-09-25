# Live Editor, Code Execution, And Security

## Architecture

```text
MCP client
  ⇅ stdio
blender-mcp
  ⇅ local TCP socket
Blender MCP add-on
  ↓
Blender / bpy
```

The add-on and MCP server are separate components.

Default upstream bridge settings use a local host and port 9876. Keep project/client configuration consistent with the add-on.

## Live session

Before a mutating request:

- identify current blend-file path/save state;
- identify Scene/Collection/Object target;
- inspect active selection/mode when operators may be used.

If the intended file is already open, keep using that live process unless the workflow explicitly calls for background processing.

## execute_blender_code

The code runs in Blender's Python environment with full `bpy` access.

Good pattern:

```python
import bpy

obj = bpy.data.objects.get("VerifiedName")
if obj is None:
    raise RuntimeError("target not found")

# one bounded logical change

result = {
    "object": obj.name,
    "value": "...",
}
```

Return JSON-friendly structured evidence.

Avoid scripts that inspect arbitrary user files/environment, make unrelated network calls, start subprocesses, change preferences/startup files, save/overwrite unrelated files, or combine unrelated large authoring steps.

## Weak sandbox

Upstream names the guard `WeakSandboxForLLM` and explicitly documents that it is not a real sandbox.

It blocks only a small set of operations such as some preference/factory-reset/quit paths. It does not create a security boundary.

Treat code execution as trusted local code with the permissions of Blender.

## UI state

Dedicated navigation tools may change workspace/focus/visibility.

If UI mutation is only incidental:

- snapshot relevant state when practical;
- perform the operation;
- restore it.

If UI state is the requested result, leave the intentional change.

## Background CLI

`*_for_cli` opens an on-disk blend file in a background Blender lifecycle.

Use it for deliberate batch/headless work, not as an automatic fallback from a failed live session.
