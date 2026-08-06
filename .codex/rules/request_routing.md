# Request routing rules

Before any tool call, file edit, MCP operation, or final answer, classify the
current user request by mode. Do this for every new user message, including
follow-up messages after a long implementation task.

## Required mode gate

Choose the narrowest applicable mode before acting:

- `implementation`: code, tests, configuration, or project files may be changed
  when the request asks to perform work.
- `review-only`: inspect and report findings; do not create tasks or code changes
  unless the user explicitly changes the mode. Activity-context creation or
  updates are allowed only through an explicitly composed
  `activity-context-only` surface and the active project policy.
- `analysis-only`: investigate and explain; do not change files or taskbook
  state. Activity-context creation or updates are allowed only through an
  explicitly composed `activity-context-only` surface and the active project
  policy.
- `activity-context-only`: read or update one canonical Obsidian activity
  context, its required Templater template, or its temporary fallback outbox
  only through the configured MCP or declared fallback path.
- `taskbook-only`: read or update Obsidian task state only through the
  configured MCP or declared fallback outbox.
- `wiki-only`: query or update LLM Wiki/backlog content only through the
  configured MCP or declared fallback outbox.
- `external-system-only`: read or mutate explicitly scoped data in a configured
  external system through its approved connector, MCP server, or API. Do not
  change repository files, code, tests, configuration, activity context,
  taskbook, or wiki state unless the request separately authorizes those
  surfaces.
- `commit-text-only`: prepare commit message text only. Read-only inspection of
  the current Git state is allowed solely to determine the complete verified
  change set. Do not mutate Git state. When verification succeeds, do not add
  explanatory prose outside the requested format; when it is unavailable,
  report the verification gap instead of fabricating commit text.
- `status-only`: report the current state; do not continue implementation unless
  the user asks to keep working.
- `question-only`: answer the question; do not make repository changes or
  external-system mutations.
- `documentation-only`: change only the requested documentation/rule/profile
  files.

Use `external-system-only` for direct operations such as reading or changing a
Jira issue, updating a ticket, posting a comment, changing a remote workflow
state, or invoking another configured external service. Use `implementation`
when the task changes integration source code, tests, configuration, or project
files rather than the external system's live data.

## Mode precedence and composition

A direct call to a configured external system uses the external-system gate even
when the user-facing intent is a question, status check, analysis, or review.
For read-only calls, keep the operation read-only and preserve the requested
answer format; `question-only`, `status-only`, `analysis-only`, or `review-only`
do not authorize a mutation.

If the request only discusses an external system without calling it, use the
ordinary `question-only`, `status-only`, `analysis-only`, or `review-only` mode
without the external-system gate.

Use the specialized Obsidian modes instead of the generic external-system mode:

- `activity-context-only` has priority for activity-context reads, writes,
  template management, fallback writes, and synchronization;
- `taskbook-only` has priority for all taskbook reads and writes;
- `wiki-only` has priority for all LLM Wiki Query/Ingest reads and writes;
- `external-system-only` does not authorize activity-context, taskbook, or wiki
  side effects;
- other explicitly requested Obsidian MCP operations outside those overlays may
  use `external-system-only` together with `obsidian-mcp-core`.

Activity-context tracking may compose with another mode only when the profile or
the user authorizes it. The default activity-context profile may automatically
compose `activity-context-only` with `implementation`, `documentation-only`,
`analysis-only`, `review-only`, and mutating `external-system-only`.
`taskbook-only`, `wiki-only`, `question-only`, `status-only`, and
`commit-text-only` do not create a new activity context automatically, but may
update an existing context when the message continues the same tracked activity
and the combined gate explicitly includes the activity-context surface.

Reclassifying a follow-up message does not create a new activity by itself.
Resolve whether the message continues an existing activity independently from
the request-mode classification.

Repository-hosting operations that complete the current repository workflow
inherit the repository mode. Branch creation, commits, pushes, and pull-request
creation or updates performed as part of an authorized `implementation` or
`documentation-only` change do not require a separate `external-system-only`
mode. A standalone operation on remote issue or pull-request metadata, such as
adding a comment, label, assignee, reviewer, or changing remote state without a
repository change, uses `external-system-only`. `commit-text-only` remains a
strict text-output mode and never authorizes Git mutations or remote hosting
operations. It may use read-only Git inspection solely to verify the commit
contents.

If the request combines repository work with a direct external-system operation,
identify each requested surface and side effect separately. A repository change
does not authorize an external-system mutation, and an external-system operation
does not authorize repository changes. Use a combined gate only for side
effects explicitly requested by the user or automatically authorized by an
active activity-context profile. If the required target or side effect remains
ambiguous, ask before acting.

## Surface and side-effect gate

After selecting the mode, identify all allowed and forbidden surfaces before the
first action:

- code files
- tests
- project configuration
- Markdown rules/docs
- Obsidian activity context
- Obsidian taskbook
- Obsidian wiki
- shell commands
- Git commands
- web access
- external services

Do not run tools or produce the final answer until this gate is resolved.

For the selected mode, explicitly account for:

- whether file edits are allowed;
- whether activity-context, taskbook, or wiki updates are allowed;
- whether shell/Git commands are allowed;
- whether external network calls are allowed;
- which repository rules and skills are active;
- which source-of-truth files must be read;
- the required final response format.

If a candidate command or edit would touch a forbidden surface, replace it with
a project-safe action or do not run it.

## External-system gate

Before any direct external-system call, resolve:

- the exact external system and configured instance/account/environment;
- whether the operation is read-only or mutating;
- the target resource identifiers and bounded scope;
- the exact requested action and expected state change;
- the approved connector, MCP server, or API boundary;
- the configured credential source without exposing secrets;
- whether the action is bulk, destructive, administrative, or difficult to
  reverse.

A read-only request does not authorize a mutation. Ordinary scoped writes require
an explicit user request naming the intended state change. Bulk, destructive,
administrative, or broadly scoped writes require an explicit scope and a
preview, dry-run, or target-state check when the external system supports one.
Do not perform a write when the instance, environment, target, action, or scope
is ambiguous.

After a mutation, verify the resulting remote state through the same approved
boundary when technically possible. Report partial success, rejected items, or
unverified outcomes explicitly.

## Project-rule precedence

Active repository rules and `CODEX_PROJECT.md` refine reusable memory and generic
workflows. When a remembered workflow conflicts with current project rules, the
current project rules win.

Do not treat a follow-up request as continuing the previous mode by default.
Reclassify the new user message independently before acting, then separately
resolve whether it belongs to an existing tracked activity.

## Output gate

Before the final answer, verify:

- the response language matches `CODEX_PROJECT.md`;
- the output format matches the selected mode and the user request;
- the answer does not report side effects that were not performed;
- required citations or memory citations are present when applicable;
- disallowed explanation is not added for strict-output modes;
- unresolved verification gaps are stated plainly.
