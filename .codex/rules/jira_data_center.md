# Jira Data Center REST API rules

Apply this rule only when at least one allowed project-profile signal selects it:

- `.codex/rules/jira_data_center.md` is listed exactly in `Active Rules`;
- `jira-data-center` is listed in `Active Stack Profiles`;
- the enabled Jira Data Center specialized profile names the exact `jira_data_center.md + jira-data-center` rule/skill pair.

A target-project task that merely mentions Jira, requests a live Jira operation, or reviews Jira integration code does not activate this rule by itself. When the Jira profile is missing, incomplete, disabled, set to `none`, or version-incompatible, report a profile error instead of applying this rule. Template-repository maintenance may review or edit this source rule directly under Template Repository Mode.

Do not apply this rule to Jira Cloud, Jira Service Management Cloud, a non-Jira help desk API, or any Jira Data Center major/minor version outside `8.22.x`.

## Required skill

Use together with:

- `jira-data-center`.

Apply active language, HTTP-client, security, and testing skills separately when the implementation touches those areas. This rule does not select a Python or TypeScript HTTP stack by itself.

## Profile validity

The specialized Jira Data Center profile is valid only when all of these conditions hold:

- `Jira Data Center enabled` is `yes`;
- `Declared Jira version` is `8.22.x` or an exact `8.22.z` runtime version;
- `Active Jira rule/skill` names `jira_data_center.md + jira-data-center`;
- the Jira instance/environment, base URL source, authentication source, timeout source, and TLS verification source are declared;
- `/rest/api/2/serverInfo` is the runtime-version verification source.

Do not infer missing profile values from `.env`, source code, prior conversations, or a reachable Jira instance. Repository evidence may be used to propose a profile update, but the rule remains inactive until the profile is valid.

## Request mode boundary

- Use `external-system-only` for direct reads or mutations against live Jira data through an approved connector, MCP server, or Jira REST API.
- Use `implementation` when creating or changing Jira client code, tests, settings, configuration, ETL code, or other repository files.
- Use `documentation-only` when only Jira-related rules, profiles, references, or documentation are changed.
- A read-only Jira request does not authorize a live Jira mutation, including when the user-facing intent is a question, status check, analysis, or review.
- A request to inspect or change integration code does not authorize a live Jira mutation.
- A request to read or change Jira data does not authorize repository edits.
- When one request explicitly includes both repository work and a live Jira operation, apply separate surface and side-effect gates for each part.

## Version and API boundary

- This rule package supports Jira Data Center / Jira Software `8.22.x` only.
- `CODEX_PROJECT.md` must declare `8.22.x` or the exact deployed `8.22.z` version before this rule is applied.
- Confirm the runtime version with `GET /rest/api/2/serverInfo` before version-specific implementation, diagnostics beyond version discovery, or live mutations.
- A first read-only `serverInfo` call may be used to discover the runtime version when completing or validating the project profile.
- If `serverInfo` reports a version outside `8.22.x`, stop applying this rule after the version diagnostic and report the profile mismatch.
- If the profile declares an exact `8.22.z` version and `serverInfo` reports a different patch version, report the mismatch before version-sensitive work; update the profile only when the request authorizes it.
- Do not claim compatibility with Jira 8.20, another Jira 8 minor, Jira 9/10/11, or future versions based only on shared endpoint names.
- Supporting another major/minor version requires a separate version-specific profile and materials, or an explicit repository update that verifies and changes this package boundary.
- Use Jira Server/Data Center platform API `/rest/api/2`.
- Use Jira Software Agile API `/rest/agile/1.0` only when the profile declares Jira Software available and boards, sprints, backlog, epics, or rank are in scope.
- Do not use Jira Cloud `/rest/api/3`, `accountId`-only assumptions, Atlassian Document Format, Forge, or OAuth 2.0 Cloud scopes without explicit evidence that the target API supports them.
- Do not use `/rest/api/latest` in production integration code when `/rest/api/2` is available.
- Never write directly to the Jira database. Use the REST API or an explicitly approved Jira administrative mechanism.

## Configuration and authentication

The default project-root `.env` contract is:

```dotenv
JIRA_BASE_URL=https://jira.example.com
JIRA_PAT=replace_with_real_pat
JIRA_TIMEOUT_SECONDS=30
JIRA_VERIFY_TLS=true
```

- `JIRA_BASE_URL` must include the Jira context path when Jira is not deployed at `/`.
- Prefer Personal Access Token authentication through `Authorization: Bearer <JIRA_PAT>` when PAT is enabled on the instance.
- Keep real credentials out of source code, examples, fixtures, snapshots, logs, exceptions, URLs, and shell history.
- Do not print or read `.env` contents into user-visible output.
- Use OAuth 1.0a, Basic Auth over HTTPS, or cookie authentication only when the project explicitly selects that mechanism.
- Do not treat Jira Cloud `email:api_token` authentication as the default for Data Center.

## REST client requirements

- Normalize `JIRA_BASE_URL` once while preserving its context path.
- Use explicit connect/read/write timeouts and the project-declared TLS verification policy.
- Send `Accept: application/json`; send `Content-Type: application/json` for JSON bodies.
- Parse Jira error collections through `errorMessages`, `errors`, and the HTTP status.
- Handle `204 No Content` without attempting JSON parsing.
- Mask `Authorization`, cookies, PAT values, personal data, attachment contents, and unsafe request bodies in logs.
- Paginate collections without assuming that `total` remains stable between requests.
- Retry read-only requests only under the active HTTP-client policy. Do not retry POST/PUT/DELETE automatically without an explicit idempotency or state-check strategy.

## Issue and workflow safety

- Request only required fields for issue reads and JQL searches.
- Use create/edit/transition metadata before sending fields whose availability depends on screens, workflow, issue type, or field context.
- Identify custom fields by `customfield_<id>`, not by display name alone.
- Change workflow status through the transitions endpoint, not by editing the `status` field directly.
- Resolve transition IDs from the current issue and user context before writing.
- Use `X-Atlassian-Token: no-check` and multipart field `file` for attachments.
- For bulk or destructive writes, establish environment, project/issue scope, permissions, dry-run output, batch size, and cleanup/rollback expectations first.

## Changelog and status history

- Use `GET /rest/api/2/issue/{issueIdOrKey}?expand=changelog` for scoped issue history reads.
- Do not request changelog for unbounded JQL searches or broad exports.
- A changelog history record owns the change author and timestamp; its `items` own field transitions.
- For status history, select items where `field == "status"` and pair them with the containing history record's `author` and `created` values.
- Preserve stable author identifiers available on the instance, such as `name` or `key`, plus `displayName` when useful. Do not infer the author from assignee, reporter, current user, or comment author.
- Handle deleted, inactive, or partially represented users without fabricating identity.
- Record `from`, `fromString`, `to`, and `toString` when available; do not reduce status history to the current status only.
- Treat expanded changelog as potentially bounded. If complete long history is required, verify and test the target instance's supported pagination mechanism before claiming completeness.

## Write authorization

- Read-only Jira questions and diagnostics use `external-system-only` but do not authorize Jira mutations.
- Before create, edit, transition, comment, worklog, attachment, link, bulk edit, delete, or archive operations, resolve the exact Jira instance/environment, project or issue targets, requested state change, bounded scope, permissions, and approved API boundary.
- Perform an ordinary scoped write only when the user explicitly requested that state change.
- For bulk, destructive, administrative, or broadly scoped writes, require explicit scope and use a preview, dry-run, or target-state check when supported.
- Do not write when the Jira instance, environment, target, action, or scope is ambiguous.
- Keep write retries disabled unless the operation has an explicit idempotency marker or verified target state.
- Do not suppress `403` or `404`; either may indicate permission or issue-security behavior.
- After a mutation, re-read the affected Jira resource when possible and report unverified or partial outcomes explicitly.

## References

Use:

- `.agents/skills/jira-data-center/references/rest-api-8.22-patterns.md` for endpoint payloads, pagination, changelog extraction, custom fields, and idempotency patterns;
- `.agents/skills/jira-data-center/references/dotenv-auth-patterns.md` for project-root `.env`, macOS/Linux, PowerShell, `cmd.exe`, and local diagnostic examples.

## Review checklist

- [ ] Jira Data Center, not Jira Cloud, was confirmed.
- [ ] An allowed project-profile signal activated the exact Jira rule/skill pair.
- [ ] The specialized Jira profile is enabled, complete, and not set to `none`.
- [ ] The declared and runtime versions are both inside `8.22.x`.
- [ ] A version mismatch stopped package application beyond version diagnostics.
- [ ] Request mode separates live Jira operations from repository implementation and documentation work.
- [ ] A read-only Jira request was not treated as mutation authorization.
- [ ] Runtime version and context path were checked.
- [ ] `/rest/api/2` and optional `/rest/agile/1.0` are used deliberately.
- [ ] Authentication comes from the approved configuration source and no secret is exposed.
- [ ] Timeouts, TLS verification, errors, and pagination are explicit.
- [ ] JQL and issue reads request only needed fields.
- [ ] Create/edit/transition payloads follow metadata and workflow constraints.
- [ ] Status-history entries preserve the containing history author and timestamp.
- [ ] Write scope, permissions, idempotency, and dry-run policy were reviewed.
- [ ] Post-write remote state was verified or the outcome was explicitly marked unverified.
- [ ] Unit tests avoid real Jira; integration tests are opt-in and sandbox-only.