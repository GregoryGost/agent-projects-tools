# Jira Data Center 8.22.x: `.env` authentication and CLI patterns

Load this reference when implementing or reviewing Jira REST API calls from macOS/Linux shell, Windows PowerShell, Windows `cmd.exe`, or a local diagnostic script.

## 1. Project-Root `.env`

Credentials live in `.env` at the target project root. Do not create additional files containing real secrets.

Minimum contract:

```dotenv
JIRA_BASE_URL=https://jira.example.com
JIRA_PAT=replace_with_real_pat
JIRA_TIMEOUT_SECONDS=30
JIRA_VERIFY_TLS=true
```

Format rules:

- use `KEY=value`;
- do not add spaces around `=`;
- never put real secrets in `.env.example`;
- do not add inline comments after secret values;
- prefer simple values without shell-special characters in cross-platform CLI examples;
- when a value contains special characters, use the project's normal dotenv/config loader rather than manual shell parsing.

## 2. `.gitignore` And Docker Context

Exclude the real `.env` from version control:

```gitignore
.env
.env.*
!.env.example
```

When Docker is used, verify `.dockerignore` so `.env` cannot enter the build context or image.

## 3. Header Construction

After loading settings into the process environment, build headers through the client or diagnostic command:

```http
Authorization: Bearer <JIRA_PAT>
Accept: application/json
```

For JSON bodies:

```http
Content-Type: application/json
```

Never pass the PAT in a URL or query parameter.

## 4. macOS/Linux Shell

Use this approach only when `.env` is compatible with POSIX shell syntax:

```bash
set -a
. ./.env
set +a

curl --fail-with-body \
  -H "Authorization: Bearer ${JIRA_PAT}" \
  -H "Accept: application/json" \
  "${JIRA_BASE_URL%/}/rest/api/2/myself"
```

Read an issue with changelog:

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

Load `.env` into the current process environment only for simple dotenv files:

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

Basic GET:

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

Read an issue with changelog:

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

For attachment multipart uploads, prefer `curl.exe` because its behavior is clearer and closer to Jira examples:

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

After loading `.env`, invoke `curl.exe` explicitly rather than `curl` to avoid alias/function conflicts in older PowerShell environments:

```powershell
$baseUrl = $env:JIRA_BASE_URL.TrimEnd("/")

curl.exe --fail-with-body `
  -H "Authorization: Bearer $env:JIRA_PAT" `
  -H "Accept: application/json" `
  "$baseUrl/rest/api/2/myself"
```

## 7. Windows `cmd.exe`

`cmd.exe` is poorly suited to safe `.env` parsing. Prefer PowerShell. When `cmd.exe` is mandatory, allow only a simple `KEY=value` file without quotes, spaces, inline comments, or special characters.

One-time command:

```cmd
for /f "usebackq eol=# tokens=1,* delims==" %A in (".env") do @set "%A=%B"

curl.exe --fail-with-body ^
  -H "Authorization: Bearer %JIRA_PAT%" ^
  -H "Accept: application/json" ^
  "%JIRA_BASE_URL%/rest/api/2/myself"
```

In a `.bat` file, use `%%A` and `%%B`:

```cmd
for /f "usebackq eol=# tokens=1,* delims==" %%A in (".env") do @set "%%A=%%B"
```

## 8. Python Project Code

The configuration layer reads `.env`; the Jira client receives validated settings:

```python
settings = load_project_settings_from_root_dotenv()

jira_client = JiraClient(
    base_url=settings.jira_base_url,
    pat=settings.jira_pat,
    timeout=settings.jira_timeout_seconds,
    verify_tls=settings.jira_verify_tls,
)
```

The client owns header construction:

```python
headers = {
    "Authorization": f"Bearer {settings.jira_pat}",
    "Accept": "application/json",
}
```

Do not reload `.env` before every request. The pseudocode does not require the `requests` library; use the HTTP stack already selected by the project.

## 9. Diagnostics

Safe output:

```text
JIRA_BASE_URL is configured
JIRA_PAT is configured: yes
```

Forbidden output:

```text
JIRA_PAT=...
Authorization: Bearer ...
cat .env
```

Use `GET /rest/api/2/myself` to verify authentication.

For `401`, diagnose without exposing the token:

- the approved configuration source exists;
- `JIRA_PAT` is non-empty;
- the Bearer authentication scheme is used;
- the URL targets the correct Jira Data Center instance and context path;
- the PAT is not expired or revoked;
- HTTPS is used unless this is an approved local test environment;
- the reverse proxy preserves the authentication header.

When the response is HTML rather than JSON, inspect base URL, context path, reverse proxy, SSO redirects, and authentication endpoint behavior. Do not print the complete HTML login page.
