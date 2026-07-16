---
name: jira-data-center
description: "Use for Jira Data Center 8.22.x REST API clients, JQL, issue workflows, changelog/status history, and safe automation."
---

# Jira Data Center 8.22.x REST API

## Activation

Use this skill only when at least one allowed project-profile signal selects it:

- `jira-data-center` is listed exactly in `Active Skills`;
- `jira-data-center` is listed in `Active Stack Profiles`;
- the enabled Jira Data Center specialized profile names the exact `jira_data_center.md + jira-data-center` rule/skill pair.

A target-project task that merely mentions Jira, requests a live Jira operation, or reviews Jira integration code does not activate this skill by itself. When the Jira profile is missing, incomplete, disabled, set to `none`, or version-incompatible, report a profile error instead of applying this skill. Template-repository maintenance may review or edit this source package directly under Template Repository Mode.

Applicable tasks after valid activation include:

- reading, searching, creating, and editing issues;
- JQL and incremental synchronization;
- transitions, comments, worklogs, attachments, and issue links;
- changelog and status history with the change author;
- custom fields and create/edit/transition metadata;
- Jira Software boards, sprints, backlog, and epics;
- REST clients, ETL, automation, and diagnostics;
- unit/integration tests and Jira integration review.

Do not use this skill for Jira Cloud, Jira Service Management Cloud, an arbitrary Help Desk API, or a Jira Data Center major/minor version outside `8.22.x`. A Jira-compatible Help Desk must use a separate profile with its own version boundary and environment variables.

## Required Dependencies

- `.codex/rules/jira_data_center.md`

Load references when needed:

- `references/official-sources.md` as the source-of-truth index and precedence policy for version, endpoint, authentication, security, and compatibility claims;
- `references/rest-api-8.22-patterns.md` for concrete REST paths, payloads, pagination, metadata, changelog, custom fields, and idempotency;
- `references/dotenv-auth-patterns.md` for `.env`, macOS/Linux shell, Windows PowerShell, `cmd.exe`, and local diagnostics.

## Profile Validity

The specialized Jira Data Center profile is valid only when all of these conditions hold:

- `Jira Data Center enabled` is `yes`;
- `Declared Jira version` is `8.22.x` or an exact `8.22.z` runtime version;
- `Active Jira rule/skill` names `jira_data_center.md + jira-data-center`;
- the Jira instance/environment, base URL source, authentication source, timeout source, and TLS verification source are declared;
- `/rest/api/2/serverInfo` is the runtime-version verification source.

Do not infer missing profile values from `.env`, source code, prior conversations, or a reachable Jira instance. Repository evidence may be used to propose a profile update, but this skill remains inactive until the profile is valid.

## Request Mode Boundary

- Use `external-system-only` for direct reads or changes to live Jira data through an approved connector, MCP server, or Jira REST API.
- Use `implementation` when creating or changing Jira client code, ETL code, tests, settings, configuration, or other repository files.
- Use `documentation-only` when only Jira rules, profiles, references, or documentation are changed.
- A read-only Jira request does not authorize a mutation, regardless of whether the user intent is a question, status check, analysis, or review.
- A request to change integration code does not authorize a live Jira mutation.
- A request to read or change live Jira data does not authorize repository edits.
- When the user explicitly requests both repository work and a live Jira operation, gate the surfaces separately and perform only the explicitly requested side effects.

## Version Boundary

This skill package supports Jira Data Center / Jira Software `8.22.x` only.

Mandatory constraints:

1. `CODEX_PROJECT.md` must declare `8.22.x` or the exact deployed `8.22.z` version before this skill is applied.
2. Use Jira Server/Data Center REST APIs, not Jira Cloud REST APIs.
3. Use `/rest/api/2` for the platform API, not `/rest/api/3`.
4. Use `/rest/agile/1.0` only when the profile declares Jira Software available.
5. Do not use Cloud-only `accountId`, Atlassian Document Format, Forge, or OAuth 2.0 Cloud scopes without explicit evidence that the target API supports them.
6. Do not use `/rest/api/latest` in production code when `/rest/api/2` can be fixed explicitly.
7. Never write directly to the Jira database.
8. Do not transfer Jira 8.20, another Jira 8 minor, Jira 9/10/11, or future-version behavior to this package without a version-specific update.

Before version-specific implementation, diagnostics beyond version discovery, or live mutations, check:

```text
GET /rest/api/2/serverInfo
GET /rest/api/2/myself
GET /rest/api/2/field
```

A first read-only `serverInfo` call may be used to discover the runtime version when completing or validating the project profile.

If `serverInfo` reports a version outside `8.22.x`, stop applying this skill after the version diagnostic and report the profile mismatch. If the profile declares an exact `8.22.z` version and the runtime patch differs, report the mismatch before version-sensitive work and update the profile only when the request authorizes it. Supporting another major/minor version requires separate version-specific materials or an explicit repository update that verifies and changes this package boundary.

## Project Discovery And Coordination

Before adding or changing a Jira integration:

1. Read `CODEX_PROJECT.md`, manifests, settings, existing client code, tests, and validation commands.
2. Validate the Jira specialized profile and the exact active rule/skill pair before applying Jira-specific guidance.
3. Confirm the declared version through `serverInfo`; stop on a version mismatch as defined above.
4. Check whether a shared HTTP client/factory already exists; do not create a parallel transport layer without need.
5. Determine whether the platform API, Agile API, or both are required.
6. Classify the operation as read-only, scoped write, bulk write, or admin-level.
7. Check required permissions: Browse Projects, Create Issues, Edit Issues, Transition Issues, Add Comments, Work On Issues, Create Attachments, Link Issues, and Administer Jira as applicable.
8. Check create/edit/transition screens and metadata for the affected fields.
9. Determine the supported user identifier (`name`, `key`, or a project-specific representation); do not assume Cloud `accountId`.

Coordinate this skill with the active:

- language/core skill for the selected language;
- HTTP-client skill for transport, lifecycle, and retry policy;
- security skill for secret handling and trust boundaries;
- testing skill for unit/integration test policy.

This skill does not select a language, HTTP-client library, or test runner by itself.

## Configuration And Secrets

By default, credentials are stored in `.env` at the target project root:

```dotenv
JIRA_BASE_URL=https://jira.example.com
JIRA_PAT=replace_with_real_pat
JIRA_TIMEOUT_SECONDS=30
JIRA_VERIFY_TLS=true
```

Contract:

- `JIRA_BASE_URL` includes the Jira context path when Jira is deployed below `/`, for example `/jira`;
- `JIRA_PAT` contains the Personal Access Token;
- `JIRA_TIMEOUT_SECONDS` defines the project-approved timeout;
- `JIRA_VERIFY_TLS` controls TLS verification and must not be disabled without an explicit reason.

`.env.example` may contain placeholders only. The real `.env` must be excluded from Git and the Docker build context according to project policy.

Preferred authentication header:

```http
Authorization: Bearer <JIRA_PAT>
Accept: application/json
```

For JSON bodies:

```http
Content-Type: application/json
```

When PAT is unavailable, OAuth 1.0a, Basic Auth over HTTPS, or cookie authentication are allowed only when explicitly selected by the project.

Forbidden:

- storing PATs, passwords, or cookies in code;
- passing a PAT in a URL, query parameter, JSON body, or CLI argument;
- printing `.env`, `Authorization`, `Cookie`, `Set-Cookie`, session IDs, or PAT values;
- adding real secrets to fixtures, snapshots, VCR cassettes, documentation, or examples;
- treating Jira Cloud `email:api_token` authentication as a universal Data Center flow.

## REST Client Contract

The Jira client must:

- normalize `base_url` once while preserving the context path;
- expose one `request(method, path, params=None, json=None, files=None)`-like boundary;
- add authentication and content headers centrally;
- define explicit connect/read/write timeouts;
- apply the project-approved TLS/proxy/`trust_env` policy;
- handle JSON and `204 No Content` correctly;
- translate HTTP/Jira failures into a typed integration error with safe fields;
- extract `status_code`, `errorMessages`, `errors`, and bounded sanitized body context;
- mask secrets and sensitive payloads;
- support pagination for resource-specific collection fields.

Do not scatter REST calls across routers, commands, or business services. Use one integration boundary such as `JiraClient` or the project equivalent.

## Pagination

Expect collections with `startAt`, `maxResults`, `total`, and an array such as `issues`, `values`, `comments`, `worklogs`, or another resource-specific field.

Rules:

- do not assume `total` is stable between pages;
- increment `startAt` by the actual number of returned items;
- stop on an empty page, short page, or explicit end flag;
- do not request an excessively large `maxResults` without a reason;
- use `POST /rest/api/2/search` for long JQL;
- always restrict `fields` for bulk searches.

## Issue Metadata And Fields

Use:

```text
GET /rest/api/2/field
GET /rest/api/2/issue/{issueIdOrKey}/editmeta
GET /rest/api/2/issue/{issueIdOrKey}/transitions?expand=transitions.fields
```

For create flows, retrieve project/issue-type metadata narrowly when the target Jira 8.22.x configuration supports it.

Rules:

- do not send fields absent from the relevant screen/metadata;
- do not specify the same field in both `fields` and `update`;
- address custom fields through `customfield_<id>`;
- do not guess value shape; inspect `schema`, `allowedValues`, and `operations`;
- do not change field contexts, screens, workflows, or schemes without a separate administrative task.

## Issue And Workflow Operations

Base paths:

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

- Retrieve available transitions for the current issue and user.
- Select a transition by `id`, not only by display name.
- Check required fields.
- Do not change `status` through a direct issue edit.
- Check the current status before repeating a transition.

Comments and worklogs must use Jira Data Center string bodies rather than Cloud ADF unless the target API proves otherwise.

Attachments require:

```http
X-Atlassian-Token: no-check
Content-Type: multipart/form-data
```

The multipart field must be named `file`.

For issue links, retrieve available link types first when portability matters.

## Changelog And Status History With Author

Scoped history read:

```text
GET /rest/api/2/issue/{issueIdOrKey}?fields=key,created,updated,status&expand=changelog
```

The structure has distinct ownership:

- a history record contains `author`, `created`, and `items`;
- an item contains the changed field and `from`, `fromString`, `to`, and `toString` values.

For status history:

1. Iterate over `changelog.histories`.
2. Preserve `created` and `author` from each history record.
3. Select items where `field == "status"`.
4. Build a transition from `from`/`fromString` to `to`/`toString`.
5. Attach the author from the containing history record.

Choose author fields from the representation actually available in Jira Data Center:

- `name`;
- `key`;
- `displayName`;
- active/deleted state when available and required by the contract.

Do not infer the status author from assignee, reporter, current user, comment author, or worklog author. Do not fabricate an identity for a deleted or inactive user.

Constraints:

- do not use `expand=changelog` in unbounded JQL;
- split bulk exports by project/date windows;
- exclude heavy fields;
- expanded changelog may be bounded; when complete long history is required, verify the pagination strategy supported by the target instance and cover it with an integration test;
- UI History, REST changelog, and Jira database tables are different representations; this skill uses REST.

## JQL And Incremental Synchronization

Prefer stable ordering:

```jql
project = ABC AND updated >= "2026-01-01 00:00" ORDER BY updated ASC, key ASC
```

- Store the checkpoint as `updated` plus `key`, or use an overlap window.
- Make overlap reprocessing idempotent.
- Do not use `ORDER BY rank` for time-based ETL synchronization.
- Restrict `fields` and page size.
- Return JQL validation errors without exposing secrets or sensitive payloads.

## Jira Software Agile API

Use `/rest/agile/1.0` only when Jira Software is installed and the task requires it.

Typical resources:

```text
/board
/board/{boardId}/issue
/board/{boardId}/backlog
/board/{boardId}/sprint
/sprint/{sprintId}
/sprint/{sprintId}/issue
```

- Resolve the board by project/type first.
- Paginate board/sprint/issue collections.
- Do not change rank without an explicit request and sandbox verification.

## Safe Writes

Before any mutation:

1. Resolve the `external-system-only` write gate for the exact Jira instance/environment, target resource, requested state change, and bounded scope.
2. Confirm that the user explicitly requested this exact write side effect; a read-only Jira request does not authorize mutation.
3. Determine the environment: prod/stage/dev/test.
4. Restrict the project/issue scope.
5. Check permissions and metadata.
6. For a bulk, destructive, or administrative write, prepare a dry run, preview, or target-state check when supported by the Jira boundary.
7. Use small batches.
8. Log only safe identifiers and sanitized errors.
9. Define an idempotency marker or target-state check.
10. After the mutation, re-read the affected Jira resource through the same approved boundary and verify the expected state when technically possible.

Handle delete/archive, bulk edit, Done/Closed transitions, assignee/reporter/security level, attachments, comments, worklogs, and administrative endpoints with particular care.

Do not suppress `403` or `404`; they may represent permissions or issue-security behavior.

When post-write read-back is impossible, state explicitly that the remote state was not verified. For partial success, list successful, rejected, and unverified targets without exposing sensitive data.

## Testing

Unit tests:

- mock the transport boundary, not the Jira client logic under test;
- verify context-path URL construction;
- verify headers without exposing the PAT;
- cover pagination and `204`;
- cover Jira error collections;
- cover create/edit/transition metadata;
- cover status changelog with the author at history-record level;
- cover deleted/inactive author representations;
- cover `400`, `401`, `403`, `404`, `409`, `413`, `415`, network failures, and `5xx`;
- verify the absence of automatic write retries.

Integration tests:

- are opt-in through a project-approved environment flag;
- run only against sandbox/test Jira;
- are excluded from the ordinary unit test run;
- create data with a unique marker, label, or property;
- restrict project scope;
- delete or archive test data only when cleanup is safe and authorized.

Do not add a heavy Jira SDK without need. When an SDK is already used, verify its Jira Data Center 8.22.x compatibility and absence of Cloud-only semantics.

## Review Checklist

- [ ] Jira Data Center, not Jira Cloud, is active.
- [ ] An allowed project-profile signal activated the exact Jira rule/skill pair.
- [ ] The specialized Jira profile is enabled, complete, and not set to `none`.
- [ ] The declared and runtime versions are both inside `8.22.x`.
- [ ] A version mismatch stopped package application beyond version diagnostics.
- [ ] Endpoint, authentication, version, security, and compatibility claims were checked against `official-sources.md` and the matching official Atlassian source.
- [ ] Request mode separates live Jira operations from repository implementation and documentation work.
- [ ] A read-only Jira request was not used as mutation authorization.
- [ ] Runtime version and context path were checked.
- [ ] `/rest/api/2` is used; the Agile API is enabled only when required.
- [ ] `.env`/settings contract and PAT handling are safe.
- [ ] Timeouts and an explicit TLS policy exist.
- [ ] Error collections and pagination are typed and tested.
- [ ] Search restricts `fields`.
- [ ] Create/edit/transition operations use metadata.
- [ ] Custom fields are addressed by id and the correct value shape.
- [ ] Status history uses the author and timestamp from the containing history record.
- [ ] Attachments use the correct XSRF header and multipart field.
- [ ] Write scope, dry-run, permissions, and idempotency were checked.
- [ ] Post-write remote state was verified or the outcome was explicitly marked unverified.
- [ ] Unit tests do not call real Jira.
- [ ] Integration tests are opt-in and sandbox-only.
