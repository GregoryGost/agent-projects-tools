# Jira Data Center 8.22.x REST API: endpoint patterns and review notes

Этот reference открывать, когда нужно реализовать или проверить конкретные REST-вызовы Jira Data Center / Jira Software 8.22.x.

## 1. URL Construction

Правильная сборка URL:

```text
{JIRA_BASE_URL}/rest/api/2/{resource}
{JIRA_BASE_URL}/rest/agile/1.0/{resource}
```

`JIRA_BASE_URL` должен уже включать context path, если Jira развернута не в корне:

```text
https://jira.example.com
https://jira.example.com/jira
```

Нельзя склеивать URL простой конкатенацией без нормализации `/`, иначе ломаются instances с context path.

## 2. Minimal Client Contract

Клиент должен уметь:

- `request(method, path, params=None, json=None, files=None)`;
- подставлять base URL;
- добавлять auth headers;
- задавать timeout и TLS/proxy policy;
- парсить JSON и корректно обрабатывать `204 No Content`;
- выбрасывать типизированную integration error с `status_code`, `errorMessages`, `errors` и bounded sanitized body;
- маскировать secrets;
- поддерживать resource-specific pagination.

## 3. Error Collection

Типичный формат ошибок Jira:

```json
{
  "errorMessages": ["Field 'priority' is required"],
  "errors": {
    "summary": "You must specify a summary of the issue."
  },
  "status": 400
}
```

При диагностике выводи:

- HTTP status;
- endpoint без query secrets;
- Jira `errorMessages`;
- Jira `errors`;
- issue key/project key, если есть;
- безопасный integration operation name.

Не выводи:

- `Authorization`;
- `Cookie`/`Set-Cookie`;
- полный request body с personal/sensitive data;
- attachments;
- PAT;
- HTML login page целиком.

## 4. Search Examples

### GET Search Для Короткого JQL

```text
GET /rest/api/2/search?jql=project%20%3D%20ABC&fields=key,summary,status&startAt=0&maxResults=50
```

### POST Search Для Длинного JQL

```json
{
  "jql": "project = ABC AND updated >= \"2026-01-01 00:00\" ORDER BY updated ASC, key ASC",
  "startAt": 0,
  "maxResults": 100,
  "fields": ["key", "summary", "status", "updated", "assignee"]
}
```

### Search Pagination Pseudocode

```text
startAt = 0
while true:
    page = POST /rest/api/2/search with startAt and maxResults
    issues = page.issues or []
    if issues is empty: break
    yield issues
    if len(issues) < maxResults: break
    startAt += len(issues)
```

Не используй `startAt += maxResults`, если сервер вернул меньше элементов.

Не полагайся на неизменность `total` между страницами.

## 5. Create Issue Flow

Правильный flow:

1. Найти project id/key.
2. Получить issue types проекта.
3. Получить create fields для project + issue type.
4. Собрать payload только из разрешённых fields.
5. Отправить `POST /rest/api/2/issue`.
6. Обработать `400` как metadata/payload validation failure.

Payload example:

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

Для sub-task нужен `parent`:

```json
{
  "fields": {
    "project": {"key": "ABC"},
    "parent": {"key": "ABC-1"},
    "issuetype": {"id": "10002"},
    "summary": "Sub-task summary"
  }
}
```

Не используй широкий create metadata query по всем проектам, если целевая Jira 8.22.x поддерживает более точечный project/issue-type flow.

## 6. Edit Issue Flow

1. `GET /rest/api/2/issue/{key}/editmeta`.
2. Проверить наличие field.
3. Проверить доступные operations.
4. Отправить `PUT /rest/api/2/issue/{key}`.

Payload with `fields`:

```json
{
  "fields": {
    "summary": "New summary"
  }
}
```

Payload with `update`:

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

Не указывай один field id одновременно в `fields` и `update`.

## 7. Transition Flow

1. `GET /rest/api/2/issue/{key}/transitions?expand=transitions.fields`.
2. Найти transition id.
3. Проверить required fields.
4. Проверить текущий status.
5. Отправить transition.

Payload:

```json
{
  "transition": {"id": "5"},
  "fields": {
    "resolution": {"name": "Fixed"}
  },
  "update": {
    "comment": [
      {"add": {"body": "Moved by integration."}}
    ]
  }
}
```

Не меняй `status` прямым `PUT issue`; Jira workflow должен меняться transition endpoint-ом.

Если issue уже в целевом status, не выполняй повторный transition.

## 8. Changelog Extraction And Status Author

Single issue:

```text
GET /rest/api/2/issue/ABC-1?fields=key,created,updated,status&expand=changelog
```

Ожидаемая структура history:

```json
{
  "id": "12345",
  "author": {
    "name": "jdoe",
    "key": "JIRAUSER10000",
    "displayName": "John Doe",
    "active": true
  },
  "created": "2026-01-10T09:15:00.000+0000",
  "items": [
    {
      "field": "status",
      "fieldtype": "jira",
      "from": "1",
      "fromString": "Open",
      "to": "3",
      "toString": "In Progress"
    }
  ]
}
```

Для status history:

```text
for history in changelog.histories:
    author = history.author
    changed_at = history.created
    for item in history.items:
        if item.field == "status":
            emit transition(
                changed_at=changed_at,
                author_name=author.name,
                author_key=author.key,
                author_display_name=author.displayName,
                from_id=item.from,
                from_name=item.fromString,
                to_id=item.to,
                to_name=item.toString,
            )
```

Правила:

- author находится на history record, а не на status item;
- не подставляй assignee, reporter, current user, comment author или worklog author;
- обрабатывай missing/deleted/inactive author без вымышленной identity;
- сохраняй stable `name`/`key`, если они доступны, и `displayName` только как display field;
- сохраняй `created` как timezone-aware Jira timestamp;
- сортируй по `created` и history id только если API order недостаточен или объединяются страницы;
- не удаляй последовательные одинаковые display names, если IDs различаются;
- не считай current issue status полной историей;
- не выводи большие description/comment diffs без необходимости.

Search с changelog допустим только в ограниченном scope:

```json
{
  "jql": "project = ABC AND updated >= \"2026-01-01 00:00\" ORDER BY updated ASC, key ASC",
  "fields": ["key", "created", "updated", "status"],
  "expand": ["changelog"],
  "startAt": 0,
  "maxResults": 50
}
```

Expanded changelog может быть bounded. Если задача требует полной длинной истории:

1. проверь фактическую Jira 8.22.x response shape и `total`/page metadata;
2. проверь поддерживаемый instance endpoint или pagination mechanism;
3. добавь integration test против sandbox;
4. не заявляй полноту, если pagination не подтверждена.

UI History, REST changelog и database `changegroup/changeitem` — разные representations; этот skill использует REST, а не direct SQL.

## 9. Comments

Add comment:

```json
{
  "body": "Comment text"
}
```

Restricted comment:

```json
{
  "body": "Visible to Administrators role",
  "visibility": {
    "type": "role",
    "value": "Administrators"
  }
}
```

Правила:

- не используй ADF для Jira DC 8.22.x comments без проверки;
- для machine comments добавляй marker для защиты от duplicates;
- для update/delete comments требуй explicit scope и authorization;
- не логируй comment body целиком, если он может содержать sensitive data.

## 10. Worklog

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

Rules:

- `started` использует Jira timestamp format;
- `timeSpentSeconds` предпочтительнее text `timeSpent`, если значение вычисляется кодом;
- не меняй remaining estimate без business requirement;
- выбери и проверь `adjustEstimate` policy;
- write retry требует marker/state check.

## 11. Attachments

Curl shape:

```text
curl -H "Authorization: Bearer <token>" \
     -H "X-Atlassian-Token: no-check" \
     -F "file=@/path/to/file.txt" \
     "{baseUrl}/rest/api/2/issue/ABC-1/attachments"
```

Common errors:

- `403 XSRF check failed` — отсутствует `X-Atlassian-Token: no-check`;
- `413 Payload Too Large` — файл больше Jira limit;
- `415 Unsupported Media Type` — неверный multipart/content type;
- `404` — неверный key, нет Browse Projects, issue скрыта permission/security или архивна.

Перед upload проверь local path ownership, file size и allowed source. Не загружай произвольный user-controlled path без filesystem safety checks.

## 12. Custom Field Value Shapes

Examples допустимы только после metadata check.

Text:

```json
{"customfield_10010": "plain text"}
```

Single select:

```json
{"customfield_10011": {"id": "10100"}}
```

Multi select:

```json
{"customfield_10012": [{"id": "10100"}, {"id": "10101"}]}
```

User picker в Jira Server/Data Center style:

```json
{"customfield_10013": {"name": "jdoe"}}
```

Versions:

```json
{"fixVersions": [{"id": "10000"}]}
```

Components:

```json
{"components": [{"id": "10001"}]}
```

Если `allowedValues` содержит id, используй id; не полагайся на name.

Не переносись автоматически на `accountId` shape из Jira Cloud.

## 13. Idempotency Patterns

### Create Issue

- используй external marker в label, issue property или dedicated custom field;
- перед create ищи существующую issue по marker;
- при повторном запуске update существующую issue только если это соответствует business contract.

JQL marker example:

```jql
project = ABC AND labels = integration-marker-123
```

### Comments

- добавляй machine-readable marker;
- перед create ищи marker среди relevant comments;
- ограничивай comment pagination и scan window осознанно.

### Transitions

- сначала проверяй current status;
- если issue уже в target status, не повторяй transition;
- если target transition сейчас недоступен, возвращай typed workflow error.

### Attachments And Worklogs

Jira не предоставляет универсальный idempotency key для всех операций. Используй project-owned marker, checksum, filename+size policy, external operation id или state lookup, если повторная отправка возможна.

## 14. Jira Software Agile API

Используй только если Jira Software установлен и task касается boards, sprints, backlog, epics или rank.

```text
GET /rest/agile/1.0/board
GET /rest/agile/1.0/board/{boardId}
GET /rest/agile/1.0/board/{boardId}/issue
GET /rest/agile/1.0/board/{boardId}/backlog
GET /rest/agile/1.0/board/{boardId}/sprint
GET /rest/agile/1.0/sprint/{sprintId}
GET /rest/agile/1.0/sprint/{sprintId}/issue
```

- Сначала найди board по `projectKeyOrId` и `type`.
- Пагинируй board/sprint/issue collections.
- Не пытайся получать sprint data через platform API, если это Jira Software board resource.
- Rank changes требуют explicit request и sandbox verification.

## 15. Review Red Flags

Останови работу и исправь, если видишь:

- `/rest/api/3` в Data Center integration;
- `accountId` как универсальный user identifier;
- ADF body для description/comment без evidence;
- `/rest/api/latest` в production code;
- `fields=["*all"]` в массовом search;
- `expand=changelog` без JQL/date/project restriction;
- status history без containing history author;
- status author, подставленный из assignee/reporter;
- широкий create metadata query без scope;
- write retry без idempotency/state check;
- hardcoded credentials или PAT в URL;
- tokens в fixtures/snapshots;
- direct Jira DB write;
- swallowing `403`/`404` без permission diagnostics;
- integration tests против production Jira.
