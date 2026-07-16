# Jira Data Center 8.22.x REST API: endpoint patterns and review notes

Load this reference when implementing or reviewing concrete Jira Data Center / Jira Software 8.22.x REST calls.

## 1. URL Construction

Use normalized paths:

```text
{JIRA_BASE_URL}/rest/api/2/{resource}
{JIRA_BASE_URL}/rest/agile/1.0/{resource}
```

`JIRA_BASE_URL` must include the context path when Jira is deployed below `/`, for example `https://jira.example.com/jira`. Do not concatenate URL strings without normalizing `/`.

## 2. Minimal Client Contract

The client must:

- expose one `request(method, path, params=None, json=None, files=None)`-like boundary;
- apply the base URL, authentication, headers, timeout, TLS, proxy, and `trust_env` policy centrally;
- parse JSON and handle `204 No Content`;
- map failures to a typed integration error containing safe `status_code`, `errorMessages`, `errors`, and bounded sanitized body context;
- mask secrets;
- support resource-specific pagination.

## 3. Error Collection

Typical Jira error shape:

```json
{
  "errorMessages": ["Field 'priority' is required"],
  "errors": {"summary": "You must specify a summary of the issue."},
  "status": 400
}
```

Diagnostics may include HTTP status, sanitized endpoint, Jira error collections, issue/project key, and a safe operation name. Never expose authentication headers, cookies, PAT values, attachment contents, sensitive request bodies, or complete HTML login pages.

## 4. Search And Pagination

Use GET only for short JQL. Prefer POST for long JQL:

```json
{
  "jql": "project = ABC AND updated >= \"2026-01-01 00:00\" ORDER BY updated ASC, key ASC",
  "startAt": 0,
  "maxResults": 100,
  "fields": ["key", "summary", "status", "updated", "assignee"]
}
```

Pagination:

```text
startAt = 0
while true:
    page = POST /rest/api/2/search with startAt and maxResults
    items = page.issues or []
    if items is empty: break
    yield items
    if len(items) < maxResults: break
    startAt += len(items)
```

Increment by the actual number of returned items, not by `maxResults`. Do not assume `total` is stable between pages.

## 5. Create Issue Flow

1. Resolve project id/key.
2. Retrieve project issue types.
3. Retrieve create fields for the selected project and issue type.
4. Build a payload from allowed fields only.
5. Send `POST /rest/api/2/issue`.
6. Treat `400` as metadata or payload validation failure.

```json
{
  "fields": {
    "project": {"key": "ABC"},
    "issuetype": {"id": "10001"},
    "summary": "Integration-created issue",
    "description": "Created by integration",
    "labels": ["integration"]
  }
}
```

A sub-task also requires `parent`. Avoid broad create-metadata queries when a narrower project/issue-type flow is available.

## 6. Edit Issue Flow

1. Read `GET /rest/api/2/issue/{key}/editmeta`.
2. Verify the field and supported operations.
3. Send `PUT /rest/api/2/issue/{key}` with either `fields` or `update`.

```json
{"fields": {"summary": "New summary"}}
```

```json
{
  "update": {
    "labels": [
      {"add": "triaged"},
      {"remove": "needs-review"}
    ]
  }
}
```

Do not specify the same field id in both `fields` and `update`.

## 7. Transition Flow

1. Read `GET /rest/api/2/issue/{key}/transitions?expand=transitions.fields`.
2. Resolve the transition id.
3. Check required fields and current status.
4. Send `POST /rest/api/2/issue/{key}/transitions`.

```json
{
  "transition": {"id": "5"},
  "fields": {"resolution": {"name": "Fixed"}},
  "update": {"comment": [{"add": {"body": "Moved by integration."}}]}
}
```

Never edit `status` directly. Do not repeat a transition when the issue already has the target status.

## 8. Changelog And Status Author

Scoped read:

```text
GET /rest/api/2/issue/ABC-1?fields=key,created,updated,status&expand=changelog
```

The history record owns `author`, `created`, and `items`. The status item owns `from`, `fromString`, `to`, and `toString`.

```text
for history in changelog.histories:
    for item in history.items:
        if item.field == "status":
            emit changed_at=history.created,
                 author=history.author,
                 from_id=item.from,
                 from_name=item.fromString,
                 to_id=item.to,
                 to_name=item.toString
```

Rules:

- never infer the author from assignee, reporter, current user, comments, or worklogs;
- preserve stable `name`/`key` when available and `displayName` as display data;
- handle deleted/inactive users without fabricating identity;
- preserve timezone-aware Jira timestamps;
- do not treat current status as complete history;
- do not use changelog expansion in unbounded JQL.

Expanded changelog may be bounded. Verify actual page metadata and the instance-supported pagination mechanism before claiming complete long history. Cover that mechanism with a sandbox integration test.

## 9. Comments

```json
{"body": "Comment text"}
```

A restricted comment may include `visibility` with a role or group. Do not use Cloud ADF without evidence. Add markers to machine comments, require explicit authorization for update/delete operations, and avoid logging sensitive comment bodies.

## 10. Worklogs

```text
POST /rest/api/2/issue/ABC-1/worklog?adjustEstimate=auto
```

```json
{
  "comment": "Investigation",
  "started": "2026-01-10T09:00:00.000+0000",
  "timeSpentSeconds": 3600
}
```

Use Jira timestamp format, prefer `timeSpentSeconds` for calculated values, select the `adjustEstimate` policy explicitly, and require a marker or state check for retries.

## 11. Attachments

Attachments require `X-Atlassian-Token: no-check`, multipart form data, and a field named `file`.

Common failures:

- `403 XSRF check failed`: required header missing;
- `413 Payload Too Large`: file exceeds Jira limit;
- `415 Unsupported Media Type`: invalid multipart type;
- `404`: invalid key, insufficient permissions, issue security, or archived issue.

Validate local path ownership, file size, and allowed source before upload. Never upload an arbitrary user-controlled path without filesystem safety checks.

## 12. Custom Field Value Shapes

Use shapes only after checking metadata:

```json
{"customfield_10010": "plain text"}
```

```json
{"customfield_10011": {"id": "10100"}}
```

```json
{"customfield_10012": [{"id": "10100"}, {"id": "10101"}]}
```

Jira Server/Data Center user picker example:

```json
{"customfield_10013": {"name": "jdoe"}}
```

Use ids when `allowedValues` provides them. Do not transfer Cloud `accountId` shapes automatically.

## 13. Idempotency Patterns

### Create Issue

Use a project-owned external marker in a label, issue property, or dedicated custom field. Search by marker before creation and update an existing issue on retry only when permitted by the business contract.

```jql
project = ABC AND labels = integration-marker-123
```

### Comments

Add a machine-readable marker and search a bounded comment window before creation.

### Transitions

Check current status first. Skip an already satisfied transition and return a typed workflow error when the target transition is unavailable.

### Attachments And Worklogs

Jira has no universal idempotency key. Use a project marker, checksum, filename-and-size policy, external operation id, or target-state lookup.

## 14. Jira Software Agile API

Use only when Jira Software is installed and boards, sprints, backlog, epics, or rank are in scope:

```text
GET /rest/agile/1.0/board
GET /rest/agile/1.0/board/{boardId}/issue
GET /rest/agile/1.0/board/{boardId}/backlog
GET /rest/agile/1.0/board/{boardId}/sprint
GET /rest/agile/1.0/sprint/{sprintId}
GET /rest/agile/1.0/sprint/{sprintId}/issue
```

Resolve boards by `projectKeyOrId` and `type`, paginate collections, and require an explicit request plus sandbox verification for rank changes.

## 15. Review Red Flags

Stop and correct the implementation when you find:

- `/rest/api/3` in a Data Center integration;
- `accountId` treated as universal;
- ADF bodies without evidence;
- `/rest/api/latest` in production code;
- `fields=["*all"]` in bulk search;
- unbounded `expand=changelog`;
- status history without the containing history author;
- status author substituted from assignee/reporter;
- broad create metadata without scope;
- write retry without idempotency or state verification;
- hardcoded credentials or secrets in URLs, fixtures, or snapshots;
- direct Jira database writes;
- swallowed `403`/`404` without permission diagnostics;
- integration tests against production Jira.
