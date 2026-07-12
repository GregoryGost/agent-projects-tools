# Jira Data Center REST API rules

Apply this rule only when `CODEX_PROJECT.md` activates the `jira-data-center` profile, lists `.codex/rules/jira_data_center.md` in `Active Rules`, enables the Jira Data Center specialized profile section, or when the task directly reviews existing Jira Data Center integration behavior.

Do not apply this rule to Jira Cloud, Jira Service Management Cloud, or a non-Jira help desk API.

## Required skill

Use together with:

- `jira-data-center`.

Apply active language, HTTP-client, security, and testing skills separately when the implementation touches those areas. This rule does not select a Python or TypeScript HTTP stack by itself.

## Version and API boundary

- Target Jira Data Center / Jira Software `8.22.x` unless `CODEX_PROJECT.md` declares another verified compatible version.
- Confirm the runtime version with `GET /rest/api/2/serverInfo` before relying on version-specific behavior.
- Use Jira Server/Data Center platform API `/rest/api/2`.
- Use Jira Software Agile API `/rest/agile/1.0` only when Jira Software is installed and boards, sprints, backlog, epics, or rank are in scope.
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

- Read-only Jira questions and diagnostics do not authorize Jira mutations.
- Before create, edit, transition, comment, worklog, attachment, link, bulk edit, delete, or archive operations, confirm that the user request and project policy authorize the write.
- Use dry-run or preview for bulk writes when technically possible.
- Do not suppress `403` or `404`; either may indicate permission or issue-security behavior.
- Keep write retries disabled unless the operation has an explicit idempotency marker or verified target state.

## References

Use:

- `.agents/skills/jira-data-center/references/rest-api-8.22-patterns.md` for endpoint payloads, pagination, changelog extraction, custom fields, and idempotency patterns;
- `.agents/skills/jira-data-center/references/dotenv-auth-patterns.md` for project-root `.env`, macOS/Linux, PowerShell, `cmd.exe`, and local diagnostic examples.

## Review checklist

- [ ] Jira Data Center, not Jira Cloud, was confirmed.
- [ ] Runtime version and context path were checked.
- [ ] `/rest/api/2` and optional `/rest/agile/1.0` are used deliberately.
- [ ] Authentication comes from the approved configuration source and no secret is exposed.
- [ ] Timeouts, TLS verification, errors, and pagination are explicit.
- [ ] JQL and issue reads request only needed fields.
- [ ] Create/edit/transition payloads follow metadata and workflow constraints.
- [ ] Status-history entries preserve the containing history author and timestamp.
- [ ] Write scope, permissions, idempotency, and dry-run policy were reviewed.
- [ ] Unit tests avoid real Jira; integration tests are opt-in and sandbox-only.
