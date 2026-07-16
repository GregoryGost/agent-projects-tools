# Jira Data Center 8.22.x official sources

Use this reference when validating or changing claims about Jira Data Center / Jira Software `8.22.x` REST endpoints, request and response shapes, authentication, permissions, compatibility, or patch-specific behavior.

This file is a source index. It does not broaden the package version boundary beyond `8.22.x` and does not replace runtime verification through `GET /rest/api/2/serverInfo`.

Last source review: `2026-07-17`.

## Source precedence

Use sources in this order:

1. The runtime version reported by `GET /rest/api/2/serverInfo` and runtime metadata endpoints establish which Jira instance and capabilities are actually in scope.
2. The exact Atlassian versioned REST reference matching the deployed `8.22.z` patch is the primary contract for platform endpoint paths, parameters, schemas, status codes, pagination, and special headers.
3. The matching Jira Software versioned REST reference is the primary contract for `/rest/agile/1.0` resources.
4. Jira Software `8.22.x` release notes establish patch-specific changes, removals, and known release history.
5. Atlassian Data Center authentication and security guides establish supported authentication and XSRF handling.
6. Atlassian REST policy and general examples provide compatibility principles and implementation examples, but they do not override the versioned `8.22.x` references.

A reachable instance, plugin behavior, source-code observation, or a newer Jira document may explain local behavior, but none of them may be used alone to broaden this package to another Jira major or minor version.

## Versioned Jira platform REST API

- [Jira Server platform REST API reference — Jira 8.22.6](https://docs.atlassian.com/software/jira/docs/api/REST/8.22.6/)
- [Jira Server platform REST API reference — Jira 8.22.0](https://docs.atlassian.com/software/jira/docs/api/REST/8.22.0/)

Use the exact patch reference when it exists. These references cover `/rest/api/2`, including issue operations, search, fields, edit metadata, transitions, changelog expansion, attachments, permissions, `serverInfo`, error collections, pagination, and special request headers.

Do not replace these references with Jira Cloud `/rest/api/2` or `/rest/api/3` documentation. Identical path fragments do not prove identical contracts.

## Versioned Jira Software REST API

- [Jira Software REST API reference — Jira Software 8.22.6](https://docs.atlassian.com/jira-software/REST/8.22.6/)
- [Jira Software REST API reference — Jira Software 8.22.0](https://docs.atlassian.com/jira-software/REST/8.22.0/)

Use these references for `/rest/agile/1.0`, including boards, backlogs, sprints, sprint issues, epics, and rank-related operations.

If an archived versioned page is temporarily unavailable, do not substitute Jira Cloud or a later Jira major/minor reference as authoritative evidence. Verify the deployed patch, consult the nearest matching `8.22.x` archived reference and release notes, and validate the required endpoint against the target non-production instance before changing package guidance.

## Jira Software 8.22.x release history

- [Jira Software 8.22.x release notes](https://confluence.atlassian.com/display/JIRASOFTWARE/JIRA+Software+8.22.x+release+notes)
- [Issues resolved in Jira Software 8.22.6](https://confluence.atlassian.com/display/JIRASOFTWARE/Issues+resolved+in+8.22.6)

Use release notes for patch-specific behavior and compatibility review. In particular, do not treat all `8.22.z` releases as interchangeable without checking the release history; Jira Software `8.22.5` was removed and replaced by `8.22.6`.

Release notes supplement endpoint references. They are not a substitute for the versioned REST schemas and status-code documentation.

## Authentication and authorization

- [Using Personal Access Tokens in Atlassian Data Center](https://confluence.atlassian.com/enterprise/using-personal-access-tokens-1026032365.html)
- [Jira Data Center security overview](https://developer.atlassian.com/server/jira/platform/security-overview/)
- [Basic authentication for Jira Data Center](https://developer.atlassian.com/server/jira/platform/basic-authentication/)
- [Cookie-based authentication](https://developer.atlassian.com/server/jira/platform/cookie-based-authentication/)
- [OAuth authentication example](https://developer.atlassian.com/server/jira/platform/jira-rest-api-example-oauth-authentication-6291692/)

Use these sources to verify authentication availability and security characteristics. PAT support is documented for Jira Core and Jira Software `8.14` and later, which includes the supported `8.22.x` line.

Authentication does not bypass Jira authorization. REST operations remain limited by the permissions and issue-security visibility of the authenticated Jira user.

Do not use Jira Cloud email-plus-API-token instructions as a Data Center authentication contract.

## XSRF and attachment handling

- [Form token handling](https://developer.atlassian.com/server/jira/platform/form-token-handling/)
- [Cookie-based authentication — form token checking](https://developer.atlassian.com/server/jira/platform/cookie-based-authentication/)
- [Jira 8.22.6 platform REST reference](https://docs.atlassian.com/software/jira/docs/api/REST/8.22.6/)

Use these sources when reviewing multipart or form-encoded operations. The versioned REST reference documents the special `X-Atlassian-Token: no-check` header for multipart endpoints, while the form-token guides explain the XSRF purpose and remote-script behavior.

## General REST behavior and compatibility

- [About the Jira Server REST APIs](https://developer.atlassian.com/server/jira/platform/about-the-jira-server-rest-apis/)
- [Jira REST API examples](https://developer.atlassian.com/server/jira/platform/jira-rest-api-examples/)
- [Atlassian REST API policy](https://developer.atlassian.com/platform/marketplace/atlassian-rest-api-policy/)

Use these sources for URI structure, general authentication and authorization concepts, examples, and compatibility policy.

General or current Jira Data Center documentation may describe capabilities introduced after `8.22.x`. Before applying such guidance, confirm that the same behavior exists in the matching versioned `8.22.x` reference or on an approved `8.22.x` test instance.

## Update checklist

When changing this skill package:

- identify the exact claim being changed;
- cite the relevant versioned platform or Jira Software REST reference;
- check `8.22.x` release notes for patch-specific changes;
- use Data Center authentication sources rather than Cloud sources;
- verify runtime-sensitive behavior on a non-production `8.22.x` instance when documentation is incomplete;
- do not infer forward or backward compatibility from a shared endpoint name;
- update the package version boundary, profile template, rule, skill metadata, references, and README together if support moves beyond `8.22.x`;
- record the source-review date when this index is materially revised.
