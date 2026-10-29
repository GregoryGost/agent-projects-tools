"""Opt-in freshness hook contract tests; use python -m unittest discover."""
import json
from pathlib import Path
import subprocess
import sys
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / "require_fresh_subagent.py"


def run_hook(tool: str, arguments: object, event: str = "PreToolUse") -> dict:
    payload = {"hook_event_name": event, "tool_name": tool, "tool_input": arguments}
    process = subprocess.run(
        [sys.executable, str(SCRIPT)], input=json.dumps(payload), text=True,
        capture_output=True, check=True, timeout=5,
    )
    return json.loads(process.stdout) if process.stdout else {}


class FreshDispatchTest(unittest.TestCase):
    def assert_denied(self, tool: str, args: object, event: str = "PreToolUse") -> None:
        self.assertEqual(run_hook(tool, args, event)["hookSpecificOutput"]["permissionDecision"], "deny")

    def test_v2_explicit_none_is_allowed(self) -> None:
        self.assertEqual(run_hook("spawn_agent", {"fork_turns": "none", "agent_type": "code_explorer"}), {})

    def test_verified_legacy_v1_is_allowed(self) -> None:
        self.assertEqual(run_hook("spawn_agent", {"fork_context": False}), {})

    def test_inherited_or_ambiguous_forks_are_denied(self) -> None:
        for args in ({}, {"fork_turns": "all"}, {"fork_turns": "3"},
                     {"fork_turns": ""}, {"fork_context": True},
                     {"fork_context": False, "fork_turns": "none"}, None):
            with self.subTest(args=args):
                self.assert_denied("spawn_agent", args)

    def test_followup_is_denied(self) -> None:
        self.assert_denied("followup_task", {"task_name": "existing"})

    def test_agent_alias_is_checked(self) -> None:
        self.assert_denied("Agent", {})
        self.assertEqual(run_hook("Agent", {"fork_turns": "none"}), {})

    def test_unrelated_tool_is_untouched(self) -> None:
        self.assertEqual(run_hook("Bash", {"command": "echo hi"}), {})

    def test_wrong_event_is_denied(self) -> None:
        self.assert_denied("spawn_agent", {"fork_turns": "none"}, event="PostToolUse")


if __name__ == "__main__":
    unittest.main()
