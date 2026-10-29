#!/usr/bin/env python3
"""Optional Codex PreToolUse guardrail. Inert until explicitly configured/trusted.

No dependencies, network calls, or filesystem writes.
"""
import json
import sys


def deny(reason: str) -> None:
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "deny",
            "permissionDecisionReason": reason,
        }
    }))


def main() -> None:
    try:
        event = json.load(sys.stdin)
    except (ValueError, OSError):
        deny("Malformed event: cannot verify a fresh subagent dispatch.")
        return

    if not isinstance(event, dict) or event.get("hook_event_name") != "PreToolUse":
        deny("Unexpected hook event: cannot verify a fresh subagent dispatch.")
        return

    tool = event.get("tool_name")
    if tool == "followup_task":
        deny("New assignments must spawn fresh threads; followup_task is forbidden.")
        return
    if tool not in ("spawn_agent", "Agent"):
        return

    arguments = event.get("tool_input")
    if not isinstance(arguments, dict):
        deny("Missing or invalid spawn arguments.")
        return

    v2 = arguments.get("fork_turns") == "none" and "fork_context" not in arguments
    legacy_v1 = arguments.get("fork_context") is False and "fork_turns" not in arguments
    if not (v2 or legacy_v1):
        deny('Fresh spawn requires explicit fork_turns="none" (V2) or verified fork_context=false (legacy V1).')


if __name__ == "__main__":
    main()
