# Jira Data Center 8.22.x: `.env` auth and CLI patterns

Этот reference открывать, когда нужно написать или проверить вызовы Jira REST API из macOS/Linux shell, Windows PowerShell, Windows `cmd.exe` или из локального диагностического скрипта.

## 1. Project root `.env`

Credentials лежат в `.env` в корне целевого проекта. Не создавай дополнительные файлы с реальными секретами.

Минимальный состав:

```dotenv
JIRA_BASE_URL=https://jira.example.com
JIRA_PAT=replace_with_real_pat
JIRA_TIMEOUT_SECONDS=30
JIRA_VERIFY_TLS=true
```

Правила формата:

- используй `KEY=value`;
- не ставь пробелы вокруг `=`;
- не добавляй реальные секреты в `.env.example`;
- не добавляй inline-комментарии после secret value;
- для cross-platform CLI examples предпочитай простые значения без shell-спецсимволов;
- если значение содержит спецсимволы, используй штатный dotenv/config loader проекта, а не ручной shell parsing.

## 2. `.gitignore` And Docker Context

В проекте должен быть запрет на commit реального `.env`:

```gitignore
.env
.env.*
!.env.example
```

Если проект использует Docker, проверь `.dockerignore`, чтобы `.env` не попадал в build context или image.

## 3. Header Construction

После загрузки `.env` в process environment формируй headers:

```http
Authorization: Bearer <JIRA_PAT>
Accept: application/json
```

Для JSON-body:

```http
Content-Type: application/json
```

Запрещено передавать PAT в URL:

```text
/rest/api/2/issue/ABC-1?token=...
```

## 4. macOS/Linux Shell

Используй этот вариант только если `.env` совместим с POSIX shell syntax.

```bash
set -a
. ./.env
set +a

curl --fail-with-body \
  -H "Authorization: Bearer ${JIRA_PAT}" \
  -H "Accept: application/json" \
  "${JIRA_BASE_URL%/}/rest/api/2/myself"
```

Получение задачи с changelog:

```bash
ISSUE_KEY='ABC-1'

curl --fail-with-body \
  -H "Authorization: Bearer ${JIRA_PAT}" \
  -H "Accept: application/json" \
  "${JIRA_BASE_URL%/}/rest/api/2/issue/${ISSUE_KEY}?fields=key,created,updated,status&expand=changelog"
```

POST search:

```bash
curl --fail-with-body \
  -H "Authorization: Bearer ${JIRA_PAT}" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  --data @- \
  "${JIRA_BASE_URL%/}/rest/api/2/search" <<'JSON'
{
  "jql": "project = ABC ORDER BY updated ASC, key ASC",
  "startAt": 0,
  "maxResults": 50,
  "fields": ["key", "summary", "status", "updated"]
}
JSON
```

Attachment upload:

```bash
ISSUE_KEY='ABC-1'
FILE_PATH='./artifact.txt'

curl --fail-with-body \
  -H "Authorization: Bearer ${JIRA_PAT}" \
  -H "X-Atlassian-Token: no-check" \
  -F "file=@${FILE_PATH}" \
  "${JIRA_BASE_URL%/}/rest/api/2/issue/${ISSUE_KEY}/attachments"
```

## 5. Windows PowerShell: `Invoke-RestMethod`

Загрузи `.env` в переменные текущего процесса:

```powershell
foreach ($rawLine in Get-Content -Path ".env") {
  $line = $rawLine.Trim()
  if ($line -eq "" -or $line.StartsWith("#")) { continue }

  $parts = $line -split "=", 2
  if ($parts.Count -ne 2) { continue }

  $name = $parts[0].Trim()
  $value = $parts[1].Trim()

  if (($value.StartsWith('"') -and $value.EndsWith('"')) -or
      ($value.StartsWith("'") -and $value.EndsWith("'"))) {
    $value = $value.Substring(1, $value.Length - 2)
  }

  Set-Item -Path "Env:$name" -Value $value
}
```

Базовый GET:

```powershell
$baseUrl = $env:JIRA_BASE_URL.TrimEnd("/")
$headers = @{
  Authorization = "Bearer $env:JIRA_PAT"
  Accept        = "application/json"
}

Invoke-RestMethod `
  -Method Get `
  -Uri "$baseUrl/rest/api/2/myself" `
  -Headers $headers
```

Получение задачи с changelog:

```powershell
$issueKey = "ABC-1"

Invoke-RestMethod `
  -Method Get `
  -Uri "$baseUrl/rest/api/2/issue/$issueKey`?fields=key,created,updated,status&expand=changelog" `
  -Headers $headers
```

POST search:

```powershell
$body = @{
  jql        = "project = ABC ORDER BY updated ASC, key ASC"
  startAt    = 0
  maxResults = 50
  fields     = @("key", "summary", "status", "updated")
} | ConvertTo-Json -Depth 10

Invoke-RestMethod `
  -Method Post `
  -Uri "$baseUrl/rest/api/2/search" `
  -Headers $headers `
  -ContentType "application/json" `
  -Body $body
```

Attachment upload через `curl.exe` предпочтительнее, потому что multipart проще и ближе к Jira examples:

```powershell
$issueKey = "ABC-1"
$filePath = ".\artifact.txt"

curl.exe --fail-with-body `
  -H "Authorization: Bearer $env:JIRA_PAT" `
  -H "X-Atlassian-Token: no-check" `
  -F "file=@$filePath" `
  "$baseUrl/rest/api/2/issue/$issueKey/attachments"
```

## 6. Windows PowerShell: `curl.exe`

После загрузки `.env` используй именно `curl.exe`, а не `curl`, чтобы избежать конфликтов с alias/function в старых PowerShell environments.

```powershell
$baseUrl = $env:JIRA_BASE_URL.TrimEnd("/")

curl.exe --fail-with-body `
  -H "Authorization: Bearer $env:JIRA_PAT" `
  -H "Accept: application/json" `
  "$baseUrl/rest/api/2/myself"
```

## 7. Windows `cmd.exe`

`cmd.exe` плохо подходит для безопасного parsing `.env`. Предпочитай PowerShell. Если требуется именно `cmd.exe`, допустим только простой `.env` формата `KEY=value` без кавычек, пробелов, inline-комментариев и спецсимволов.

Одноразовая команда:

```cmd
for /f "usebackq eol=# tokens=1,* delims==" %A in (".env") do @set "%A=%B"

curl.exe --fail-with-body ^
  -H "Authorization: Bearer %JIRA_PAT%" ^
  -H "Accept: application/json" ^
  "%JIRA_BASE_URL%/rest/api/2/myself"
```

В `.bat` используй `%%A` и `%%B`:

```cmd
for /f "usebackq eol=# tokens=1,* delims==" %%A in (".env") do @set "%%A=%%B"
```

## 8. Python Project Code

Правильный принцип: `.env` читает config layer, Jira client получает готовые settings.

```python
settings = load_project_settings_from_root_dotenv()

jira_client = JiraClient(
    base_url=settings.jira_base_url,
    pat=settings.jira_pat,
    timeout=settings.jira_timeout_seconds,
    verify_tls=settings.jira_verify_tls,
)
```

Jira client формирует headers сам:

```python
headers = {
    "Authorization": f"Bearer {settings.jira_pat}",
    "Accept": "application/json",
}
```

Нельзя читать `.env` перед каждым вызовом:

```python
load_dotenv()
requests.get(
    url,
    headers={"Authorization": f"Bearer {os.environ['JIRA_PAT']}"},
)
```

Не копируй этот pseudocode как требование использовать `requests`: применяй HTTP stack, уже выбранный проектом.

## 9. Diagnostics

Разрешено выводить:

```text
JIRA_BASE_URL is configured
JIRA_PAT is configured: yes
```

Запрещено выводить:

```text
JIRA_PAT=...
Authorization: Bearer ...
cat .env
```

Для проверки authentication используй:

```text
GET /rest/api/2/myself
```

Если ответ `401`, диагностируй без раскрытия token:

- `.env` или другой approved config source найден;
- `JIRA_PAT` не пустой;
- используется `Authorization: Bearer ...`;
- URL указывает на правильный Jira Data Center instance и context path;
- PAT не истёк и не отозван;
- запрос идёт по HTTPS, если это не локальное test environment;
- reverse proxy не удаляет `Authorization` header.

Если ответ HTML вместо JSON, проверь base URL, context path, reverse proxy, SSO redirect и authentication endpoint behavior; не выводи HTML login page целиком.
