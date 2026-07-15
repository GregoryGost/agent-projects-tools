---
name: jira-data-center
description: "Use for Jira Data Center 8.22.x REST API clients, JQL, issue workflows, changelog/status history, and safe automation."
---

# Jira Data Center 8.22.x REST API

## Activation

Применяй этот skill, когда `CODEX_PROJECT.md` активирует `jira-data-center`, явно перечисляет `jira-data-center` в `Active Skills`, включает специализированный Jira Data Center profile section или задача напрямую касается live-данных либо существующей интеграции с Jira Data Center / Jira Software 8.22.x.

Подходящие задачи:

- чтение, поиск, создание и изменение задач;
- JQL и инкрементальная синхронизация;
- transitions, comments, worklogs, attachments и issue links;
- changelog и история статусов с автором изменения;
- custom fields и create/edit/transition metadata;
- Jira Software boards, sprints, backlog и epics;
- REST-клиенты, ETL, автоматизация и диагностика;
- unit/integration tests и review Jira-интеграции.

Не применяй этот skill к Jira Cloud, Jira Service Management Cloud или произвольному Help Desk API. Для Jira-compatible Help Desk должен существовать отдельный профиль с собственной version boundary и переменными окружения.

Применяй `.codex/rules/jira_data_center.md` вместе с этим skill.

Load references when needed:

- `references/rest-api-8.22-patterns.md` — конкретные REST paths, payloads, pagination, metadata, changelog, custom fields и idempotency;
- `references/dotenv-auth-patterns.md` — `.env`, macOS/Linux shell, Windows PowerShell, `cmd.exe` и локальная диагностика.

## Request Mode Boundary

- Используй `external-system-only` для прямого чтения или изменения live-данных Jira через approved connector, MCP server или Jira REST API.
- Используй `implementation` для создания или изменения Jira client code, ETL code, tests, settings, configuration и других repository files.
- Используй `documentation-only`, когда изменяются только Jira rules, profiles, references или documentation.
- Read-only Jira request не разрешает mutation независимо от того, сформулирован ли запрос как question, status check, analysis или review.
- Запрос на изменение integration code не разрешает live Jira mutation.
- Запрос на чтение или изменение live Jira data не разрешает repository edits.
- Когда пользователь явно просит и repository work, и live Jira operation, разрешай эти поверхности отдельными gates и выполняй только явно названные side effects.

## Version Boundary

Целевая платформа: Jira Data Center / Jira Software `8.22.x`.

Обязательные ограничения:

1. Используй Jira Server/Data Center REST API, а не Jira Cloud REST API.
2. Для platform API используй `/rest/api/2`, а не `/rest/api/3`.
3. Для Jira Software Agile API используй `/rest/agile/1.0`.
4. Не используй Cloud-only `accountId`, Atlassian Document Format, Forge и OAuth 2.0 Cloud scopes без явного подтверждения целевого API.
5. Не используй `/rest/api/latest` в production-коде, когда можно зафиксировать `/rest/api/2`.
6. Не выполняй прямые записи в базу Jira.
7. Не переноси автоматически поведение Jira 9/10/11 или другой minor-версии.

Перед реализацией или диагностикой проверь:

```text
GET /rest/api/2/serverInfo
GET /rest/api/2/myself
GET /rest/api/2/field
```

Если runtime version отличается от заявленной в `CODEX_PROJECT.md`, сообщи о profile mismatch и проверь совместимость нужных endpoints до изменения поведения.

## Project Discovery And Coordination

Перед добавлением или изменением Jira-интеграции:

1. Прочитай `CODEX_PROJECT.md`, manifests, settings, existing client code, tests и validation commands.
2. Проверь, существует ли общий HTTP client/factory; не создавай параллельный transport layer без необходимости.
3. Определи, нужен platform API, Agile API или оба.
4. Классифицируй операцию: read-only, scoped write, bulk write или admin-level.
5. Проверь permissions: Browse Projects, Create Issues, Edit Issues, Transition Issues, Add Comments, Work On Issues, Create Attachments, Link Issues и Administer Jira по необходимости.
6. Проверь create/edit/transition screens и metadata для затрагиваемых полей.
7. Определи поддерживаемый user identifier (`name`, `key` или project-specific representation); не предполагай Cloud `accountId`.

Сочетай этот skill с активными:

- language/core skill для выбранного языка;
- HTTP-client skill для transport/lifecycle/retry policy;
- security skill для secret handling и trust boundaries;
- testing skill для unit/integration test policy.

Этот skill не выбирает язык, библиотеку HTTP-клиента или test runner самостоятельно.

## Configuration And Secrets

По умолчанию credentials хранятся в `.env` в корне целевого проекта:

```dotenv
JIRA_BASE_URL=https://jira.example.com
JIRA_PAT=replace_with_real_pat
JIRA_TIMEOUT_SECONDS=30
JIRA_VERIFY_TLS=true
```

Контракт:

- `JIRA_BASE_URL` включает context path, если Jira развернута, например, на `/jira`;
- `JIRA_PAT` содержит Personal Access Token;
- `JIRA_TIMEOUT_SECONDS` задаёт project-approved timeout;
- `JIRA_VERIFY_TLS` управляет TLS verification и не должен отключаться без явной причины.

`.env.example` может содержать только placeholders. Реальный `.env` должен быть исключён из Git и Docker build context по политике проекта.

Предпочтительный auth header:

```http
Authorization: Bearer <JIRA_PAT>
Accept: application/json
```

Для JSON-body:

```http
Content-Type: application/json
```

Если PAT недоступен, OAuth 1.0a, Basic Auth поверх HTTPS или cookie auth допустимы только при явном выборе проекта.

Запрещено:

- хранить PAT, passwords или cookies в коде;
- передавать PAT в URL, query params, JSON body или CLI arguments;
- выводить `.env`, `Authorization`, `Cookie`, `Set-Cookie`, session IDs или PAT;
- добавлять реальные secrets в fixtures, snapshots, VCR cassettes, docs и examples;
- применять Jira Cloud `email:api_token` как универсальный Data Center auth flow.

## REST Client Contract

Jira client должен:

- нормализовать `base_url` один раз с сохранением context path;
- предоставлять единый `request(method, path, params=None, json=None, files=None)`-подобный boundary;
- централизованно добавлять auth и content headers;
- иметь явные connect/read/write timeouts;
- применять project-approved TLS/proxy/`trust_env` policy;
- корректно обрабатывать JSON и `204 No Content`;
- преобразовывать HTTP/Jira failures в типизированную integration error с безопасными полями;
- извлекать `status_code`, `errorMessages`, `errors` и bounded/sanitized body context;
- маскировать secrets и чувствительные payloads;
- поддерживать pagination для разных collection fields.

Не рассыпай REST-вызовы по routers, commands или business services. Используй один интеграционный boundary `JiraClient` или эквивалент проекта.

## Pagination

Ожидай коллекции с `startAt`, `maxResults`, `total` и массивом `issues`, `values`, `comments`, `worklogs` или другим resource-specific field.

Правила:

- не считай `total` стабильным между страницами;
- увеличивай `startAt` на фактическое число полученных элементов;
- останавливайся на пустой странице, короткой странице или явном end flag;
- не задавай огромный `maxResults` без причины;
- для длинного JQL используй `POST /rest/api/2/search`;
- для массового поиска всегда ограничивай `fields`.

## Issue Metadata And Fields

Используй:

```text
GET /rest/api/2/field
GET /rest/api/2/issue/{issueIdOrKey}/editmeta
GET /rest/api/2/issue/{issueIdOrKey}/transitions?expand=transitions.fields
```

Для create flow получай project/issue-type metadata точечно, когда endpoints поддерживаются целевой 8.22.x конфигурацией.

Правила:

- не отправляй поля, отсутствующие на соответствующем screen/metadata;
- не указывай один field одновременно в `fields` и `update`;
- custom fields используй по `customfield_<id>`;
- не угадывай value shape; проверяй `schema`, `allowedValues` и `operations`;
- не меняй field contexts, screens, workflows и schemes без отдельной admin-задачи.

## Issue And Workflow Operations

Базовые paths:

```text
GET    /rest/api/2/issue/{issueIdOrKey}
POST   /rest/api/2/issue
POST   /rest/api/2/issue/bulk
PUT    /rest/api/2/issue/{issueIdOrKey}
DELETE /rest/api/2/issue/{issueIdOrKey}
```

Transitions:

```text
GET  /rest/api/2/issue/{issueIdOrKey}/transitions
GET  /rest/api/2/issue/{issueIdOrKey}/transitions?expand=transitions.fields
POST /rest/api/2/issue/{issueIdOrKey}/transitions
```

- Получай доступные transitions для текущей задачи и пользователя.
- Выбирай transition по `id`, а не только по display name.
- Проверяй required fields.
- Не меняй `status` прямым edit issue.
- Перед повторным transition проверяй текущий status.

Comments и worklogs должны использовать Jira Data Center string bodies, а не Cloud ADF, если целевой API не подтверждает другое.

Attachments требуют:

```http
X-Atlassian-Token: no-check
Content-Type: multipart/form-data
```

Multipart field должен называться `file`.

Для issue links сначала получай доступные link types, если переносимость важна.

## Changelog And Status History With Author

Scoped history read:

```text
GET /rest/api/2/issue/{issueIdOrKey}?fields=key,created,updated,status&expand=changelog
```

Структура принципиально разделена:

- history record содержит `author`, `created` и `items`;
- item содержит изменённое поле и значения `from`, `fromString`, `to`, `toString`.

Для истории статусов:

1. Итерируй `changelog.histories`.
2. Для каждого history record сохрани `created` и `author`.
3. Выбери `items`, где `field == "status"`.
4. Сформируй запись перехода из `from`/`fromString` в `to`/`toString`.
5. Привяжи автора именно из содержащего history record.

Поля автора выбирай по фактически доступной Jira DC representation:

- `name`;
- `key`;
- `displayName`;
- active/deleted state, если доступно и нужно контракту.

Не выводи автора статуса из assignee, reporter, текущего пользователя, комментария или worklog. Не создавай вымышленную identity для deleted/inactive user.

Ограничения:

- не используй `expand=changelog` в неограниченном JQL;
- режь массовую выгрузку по project/date windows;
- исключай тяжёлые поля;
- expanded changelog может быть bounded; если требуется полная длинная история, проверь поддерживаемую целевым instance pagination strategy и покрой её integration test;
- UI History, REST changelog и Jira database tables — разные представления; этот skill использует REST.

## JQL And Incremental Synchronization

Для устойчивой синхронизации предпочитай порядок:

```jql
project = ABC AND updated >= "2026-01-01 00:00" ORDER BY updated ASC, key ASC
```

- Храни checkpoint по `updated` + `key` либо используй overlap window.
- Делай overlap reprocessing идемпотентным.
- Не используй `ORDER BY rank` для временной ETL-синхронизации.
- Ограничивай `fields` и размер страниц.
- Возвращай JQL validation errors без раскрытия secrets и чувствительных payloads.

## Jira Software Agile API

Используй `/rest/agile/1.0` только при наличии Jira Software и соответствующей задачи.

Типичные resources:

```text
/board
/board/{boardId}/issue
/board/{boardId}/backlog
/board/{boardId}/sprint
/sprint/{sprintId}
/sprint/{sprintId}/issue
```

- Сначала разреши board по project/type.
- Пагинируй board/sprint/issue collections.
- Не меняй rank без явного запроса и проверки sandbox.

## Safe Writes

Перед любой mutation:

1. Разреши `external-system-only` write gate для точного Jira instance/environment, target resource, requested state change и bounded scope.
2. Подтверди, что пользователь явно запросил именно этот write side effect; read-only Jira request не разрешает mutation.
3. Определи environment: prod/stage/dev/test.
4. Ограничь project/issue scope.
5. Проверь permissions и metadata.
6. Для bulk, destructive или administrative write подготовь dry-run, preview или target-state check, когда Jira boundary это поддерживает.
7. Используй малые batches.
8. Логируй только безопасные identifiers и sanitized errors.
9. Определи idempotency marker или target-state check.
10. После mutation перечитай затронутый Jira resource через тот же approved boundary и проверь ожидаемое состояние, когда это технически возможно.

Особенно осторожно обрабатывай delete/archive, bulk edit, Done/Closed transitions, assignee/reporter/security level, attachments, comments, worklogs и admin endpoints.

Не подавляй `403`/`404`: они могут отражать permission или issue-security behavior.

Если post-write read-back невозможен, явно сообщи, что remote state не проверен. Для partial success перечисли успешные, отклонённые и непроверенные targets без раскрытия чувствительных данных.

## Testing

Unit tests:

- мокают transport boundary, а не Jira client logic под тестом;
- проверяют context path URL construction;
- проверяют headers без раскрытия PAT;
- покрывают pagination и `204`;
- покрывают Jira error collection;
- покрывают create/edit/transition metadata;
- покрывают status changelog с author на history level;
- покрывают deleted/inactive author representation;
- покрывают `400`, `401`, `403`, `404`, `409`, `413`, `415`, network failures и `5xx`;
- проверяют отсутствие автоматического write retry.

Integration tests:

- opt-in через project-approved environment flag;
- выполняются только против sandbox/test Jira;
- не входят в обычный unit run;
- создают данные с уникальным marker/label/property;
- ограничивают project scope;
- удаляют или архивируют тестовые данные только когда cleanup безопасен и разрешён.

Не добавляй тяжёлый Jira SDK без необходимости. Если SDK уже используется, проверь его Data Center 8.22.x совместимость и отсутствие Cloud-only semantics.

## Review Checklist

- [ ] Активирован Jira Data Center, а не Jira Cloud.
- [ ] Request mode отделяет live Jira operations от repository implementation и documentation work.
- [ ] Read-only Jira request не использован как разрешение mutation.
- [ ] Runtime version и context path проверены.
- [ ] Используется `/rest/api/2`; Agile API подключён только при необходимости.
- [ ] `.env`/settings contract и PAT handling безопасны.
- [ ] Есть timeout и явная TLS policy.
- [ ] Error collection и pagination типизированы и протестированы.
- [ ] Search ограничивает `fields`.
- [ ] Create/edit/transition используют metadata.
- [ ] Custom fields адресуются по id и корректному value shape.
- [ ] Status history использует author и timestamp containing history record.
- [ ] Attachments используют правильный XSRF header и multipart field.
- [ ] Write scope, dry-run, permissions и idempotency проверены.
- [ ] Post-write remote state проверен или результат явно помечен как unverified.
- [ ] Unit tests не вызывают реальную Jira.
- [ ] Integration tests opt-in и sandbox-only.
