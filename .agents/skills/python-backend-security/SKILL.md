---
name: python-backend-security
description: "Use for security-sensitive Python 3.14+ backend work: authentication, authorization, input validation, secrets, CORS, SQL injection, SSRF, safe logging, file/path handling, rate limiting, dependency safety, and security regression tests for FastAPI, SQLAlchemy-backed persistence, and HTTPX projects."
---

# Python Backend Security

Use this skill to keep security-sensitive backend changes fail-closed, evidence-based, and covered by regression tests.

## Scope And Coordination

Apply this skill for any task touching authentication, authorization, user identity, tenant isolation, permissions, secrets, tokens, sessions, CORS, external URL fetching, file paths/uploads, SQL construction, logging, dependency updates, or security review.

Use it together with:

- `python-fastapi-expert` for FastAPI endpoints, dependencies, middleware, routers, lifespan, OpenAPI, and API contract changes.
- `python-cache` for `cashews` setup, cache key construction, TTL, tags, invalidation, backend/lifecycle configuration, test isolation, and FastAPI cache integration when the `cashews` cache profile is active.
- `python-sqlalchemy-core` for common SQLAlchemy models, repositories, raw SQL, sessions, transactions, and DB integration tests.
- The active database-specific skill from `CODEX_PROJECT.md` for database-specific behavior, migrations, locking, connection configuration, and backend-specific tests.
- `python-httpx-client` for outbound HTTP clients, callbacks, webhooks, previews, proxy-like fetches, redirects, and SSRF risk.
- `python-testing` for pytest structure, async tests, fixtures, mocks/fakes, coverage, and security regression tests.

Read `CODEX_PROJECT.md` and repository metadata before changing security behavior. Confirm security-sensitive libraries, password hashing or key-derivation choices, dependency source of truth, and dependency approval policy before adding, removing, or replacing security dependencies.

Do not replace those skills. Use this skill to identify and preserve security boundaries, then defer framework-specific mechanics to the matching specialist skill.

## Security Workflow

1. Inspect source, settings, tests, and local conventions before changing behavior. Do not infer auth, tenant, logging, cache, or HTTP-client policy from names alone.
2. Identify trust boundaries explicitly: inbound request, auth context, service/domain/policy layer, repository/DB, outbound HTTP, filesystem, cache, logs, and error responses.
3. State assumptions in the task plan when repository evidence is incomplete. If the assumption affects access control, secrets, or external fetch behavior, prefer asking or keeping behavior unchanged.
4. Prefer fail-closed behavior: deny when identity, scope, tenant, ownership, role, token validity, config, or URL safety is missing or ambiguous.
5. Do not introduce security-sensitive behavior without tests. Add regression tests for the boundary changed, not only for the success path.
6. After choosing an approach, try to refute it: look for bypasses, missing tenant predicates, post-fetch filtering, unsafe redirects, secret leakage, path traversal, cache scope gaps, and weaker error behavior.
7. Review code and tests together; security-sensitive behavior must have focused regression tests for the changed boundary.

Load `references/security-negative-examples.md` when implementing or reviewing one of the listed risky patterns. Load `references/security-review-checklist.md` before completing a security-sensitive change or security review.

## Authentication

- Do not invent authentication schemes without repository evidence or explicit user instruction.
- Centralize authentication dependencies and middleware according to the existing FastAPI/project pattern.
- Validate token or session presence, expiration, issuer, audience, and scope when the existing scheme supports them.
- Do not parse unsigned or unverified tokens as trusted identity.
- Do not log raw tokens, cookies, session IDs, API keys, password material, or refresh tokens.
- Keep secrets and tokens out of source code, committed test fixtures, snapshots, logs, and error messages.

## Authorization

- Treat authentication and authorization as separate checks.
- Enforce authorization in the service/domain/policy layer, not only in routers.
- Check tenant, user, and object ownership on every object-level read, update, delete, export, import, and background action.
- For list endpoints, enforce authorization inside query predicates. Do not fetch broad rows and filter unauthorized objects afterward.
- Deny by default when role, scope, tenant, owner, or permission state is missing or ambiguous.
- Cover owner, non-owner, missing user, disabled user, incomplete role, and tenant-boundary cases in tests.

## Input Validation

- Use Pydantic/FastAPI validation for request structure, types, enums, required fields, and serialization boundaries.
- Add domain validation in services or policies for business invariants that cannot be trusted to the HTTP schema alone.
- Bound lengths, counts, pagination limits, numeric ranges, date ranges, enum values, file counts, and response-size-affecting inputs.
- Do not trust client-provided `role`, `tenant_id`, `user_id`, `price`, `status`, ownership fields, or permission-bearing attributes.
- Derive security-sensitive identifiers from the authenticated context or server-side lookup, not from request payloads.
- Public request schemas must document security-relevant semantics in field descriptions: client-provided vs server-derived values, tenant/user ownership, read-only fields, permission-bearing fields, and fields that must not be trusted from request payloads.

## SQL And DB Safety

- Use SQLAlchemy expressions or parameterized `text()` SQL for user-controlled values.
- Never use f-strings, `.format()`, `%`, or concatenation for user-controlled SQL values.
- Treat `ORDER BY`, column names, table names, and sort direction as unsafe unless they are mapped through allowlists.
- Use database constraints for invariants. Application pre-checks improve messages but are not concurrency boundaries.
- Map `IntegrityError` to safe domain/API errors without leaking SQL, schema names, internal constraints, or stack traces.
- Do not expose raw DB errors, stack traces, internal file paths, or SQL fragments to clients.

For common SQLAlchemy mechanics, apply `python-sqlalchemy-core`. For migration and backend-specific mechanics, apply the active database-specific skill declared by `CODEX_PROJECT.md`.

## SQLite-Specific Safety

Use this section only when the active project database is SQLite.

- Ensure `PRAGMA foreign_keys=ON` is part of centralized connection setup and is covered by integration tests.
- Do not rely only on application checks for referential integrity.
- Avoid user-controlled database file paths.
- If a DB path can be configured dynamically, normalize it and constrain it to an allowed base directory.
- Keep SQLite database files, backups, WAL files, and SHM files out of public/static directories.

## HTTPX And SSRF

- Treat user-controlled URLs as unsafe by default.
- Enforce scheme and host allowlists for user-supplied fetches, callbacks, previews, webhooks, importers, and proxy-like behavior.
- Block localhost, loopback, private, link-local, metadata, and internal network addresses, including DNS results that resolve there.
- Re-check redirect targets before following redirects or sending credentials.
- Do not forward internal auth headers, cookies, API keys, or service credentials to user-controlled hosts.
- Set explicit timeouts and response size limits.
- Do not log sensitive upstream request or response data.

For lifecycle, retry, streaming, timeout, and HTTPX test details, apply `python-httpx-client`.

## CORS And Browser-Facing APIs

- Do not use wildcard CORS with credentials.
- Keep allowed origins explicit and environment-specific in settings.
- Avoid reflecting `Origin` dynamically without an allowlist.
- Do not use CORS as an authorization mechanism.
- When cookie-based auth exists, set cookies/tokens with secure attributes supported by the project contract: `Secure`, `HttpOnly`, `SameSite`, path, domain, and expiration.

## Secrets And Configuration

- Store secrets in environment variables, settings providers, or a secret manager, not source code.
- Do not commit `.env` files with real secrets.
- Redact secrets in logs, traces, error reports, and failed validation output.
- Keep cache DSNs, DB paths, API keys, JWT secrets, signing keys, upstream credentials, and cookie/session secrets in settings.
- Tests may use obvious dummy secrets only.

## Logging And Error Responses

- Log enough stable context for diagnostics without sensitive data.
- Redact `Authorization`, `Cookie`, `Set-Cookie`, tokens, passwords, API keys, personal data where applicable, and full payloads unless explicitly safe.
- Return stable client-safe error codes and messages.
- Avoid leaking stack traces, SQL, internal URLs, file paths, upstream credentials, or service topology to clients.

## File And Path Handling

- Treat filenames, MIME types, archive names, and paths from users as untrusted.
- Normalize paths and constrain them to an allowed base directory before use.
- Reject path traversal and ambiguous path forms.
- Validate file type by content when the file affects security or downstream parsing; do not rely only on extensions.
- Limit file size, file count, archive expansion, and parsing cost.

## Cache And Security Scope

- Include tenant, user, role, permission scope, and visibility-affecting filters in cache keys whenever response visibility depends on them.
- Do not cache authenticated or permission-filtered responses unless scope, invalidation, and TTL are explicit.
- Do not put raw tokens, passwords, emails, or long sensitive values into cache keys.
- Reference the active cache policy declared by `CODEX_PROJECT.md`. Use the active cache skill for TTL, keys, tags, backend/lifecycle, invalidation, and cache-test mechanics; for `cashews`, this is `python-cache`. Use `python-fastapi-expert` only for FastAPI-specific lifespan, dependency, middleware, routing, and API contract concerns.

## Rate Limiting And Abuse Controls

- Add rate limiting only when the project has a supported mechanism or the task explicitly asks for it.
- Prefer per-user, per-token, per-IP, or combined limits based on endpoint risk.
- Protect auth endpoints, expensive DB queries, external fetchers, file uploads, and write endpoints.
- Do not implement in-memory-only rate limits for multi-worker production unless the user explicitly accepts that limitation.

## Dependency And Supply-Chain Safety

- Do not add security-sensitive dependencies without clear need and user approval when project policy requires it.
- Do not replace the project-declared password hashing, key derivation, signing, token, or encryption libraries without explicit user approval and migration plan.
- Prefer maintained libraries already used by the project.
- Pin or constrain dependencies according to project policy.
- Review new packages for maintenance status, transitive risk, import-time side effects, and whether the standard library or existing dependency is enough.

## Security Tests

Apply `python-testing` and add focused regression tests for the boundary changed. Cover unauthorized requests, forbidden requests, tenant/object isolation, invalid input boundaries, SQL injection attempts, SSRF rejection, CORS config changes, secret redaction, file path traversal rejection, and cache scope separation when relevant.
