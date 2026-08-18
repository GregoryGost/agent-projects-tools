# Context7 documentation retrieval rules

Apply this rule only when `CODEX_PROJECT.md` lists `context7_documentation.md`
in `Active Rules` or an enabled Context7 Documentation Profile names this exact
rule.

Context7 is an optional read-only documentation retrieval integration. It is not
a hard dependency of language, framework, database, cache, HTTP, testing,
styling, UI, or security materials. Do not make another rule or skill invalid
only because Context7 is unavailable.

## Scope

Use Context7 to retrieve current or version-specific library, framework, SDK,
tooling, and API documentation when the active project task depends on external
technical behavior that may differ by version.

Typical high-value areas include:

- Python and its testing ecosystem;
- FastAPI, Pydantic, SQLAlchemy, HTTPX, `httpx-retries`, `cashews`, and
  `nats-py`;
- TypeScript, Jest, ESLint, and Prettier;
- Vue, Vite, Vue Router, Pinia, VueUse, Vitest, and Playwright;
- Tailwind CSS, Sass, browser APIs, CSS, and SVG behavior when Context7 resolves
  an appropriate authoritative source.

Do not use Context7 as the source of truth for:

- repository governance, request routing, Git policy, activation semantics, or
  other project-defined rules;
- project-local configuration, dependency versions, lockfile state, or source
  code that can be inspected directly;
- deployed runtime state such as an actual database, Jira, NATS, or service
  version and configuration;
- project-specific Obsidian workflows and vault policies;
- normative security requirements when a primary security standard or vendor
  security source is required;
- Jira Data Center version-specific behavior unless Context7 resolves the exact
  applicable Data Center documentation source with sufficient confidence.

## Source precedence

Use this precedence instead of treating Context7 itself as an authority:

1. Project evidence determines what actually applies: manifests, lockfiles,
   project configuration, runtime diagnostics, deployment configuration, and
   explicit `CODEX_PROJECT.md` declarations.
2. Context7 is the preferred retrieval path for documentation matching the
   identified library/product and applicable version when it resolves the
   correct source.
3. Curated official-source references shipped with an active skill remain valid
   and should be used when they are more specific, deliberately version-locked,
   or cover vendor/server guarantees that Context7 does not establish.
4. If Context7 cannot resolve the correct source, exact version, or requested
   topic, use the primary official documentation directly when network access is
   allowed.
5. Model knowledge must not override verified project evidence or retrieved
   primary documentation.

Runtime observations describe the configured/deployed system; documentation
describes expected behavior for a product/version. Do not silently substitute
one for the other.

## Retrieval workflow

Before querying Context7:

1. Identify the exact library, framework, SDK, tool, or product involved.
2. Determine the applicable version from project evidence whenever version can
   change the answer. Prefer a lockfile or exact installed/runtime version over a
   broad manifest constraint when both are available.
3. Formulate a narrow documentation question containing only the technical
   information required to retrieve the relevant documentation.

For Context7 retrieval:

1. Resolve the library ID before querying documentation unless the project or an
   active curated reference already provides a previously verified Context7 ID
   for the same library/source and that mapping is still unambiguous.
2. Verify that the resolved result represents the intended project rather than
   a namesake or unrelated package.
3. Prefer official, verified, or otherwise high-confidence source entries when
   Context7 exposes source-quality metadata.
4. Include the applicable version in the lookup or documentation query when the
   task is version-sensitive.
5. Query only the topic required for the current implementation, review, or
   answer; do not retrieve broad documentation dumps without need.
6. Cross-check another primary source when the retrieved result is ambiguous,
   internally inconsistent, unexpectedly stale, or consequential to security,
   persistence, concurrency, protocol guarantees, destructive operations, or
   compatibility boundaries.

If the exact project version is unavailable in Context7, do not silently answer
from `latest` for version-sensitive behavior. Use the nearest applicable primary
source only when compatibility is established; otherwise report the
verification gap.

## Coordination with existing materials

Context7 supplements active rules and skills; it does not activate them and does
not replace their project-specific policies.

Use Context7 especially when an active material requires current external API or
configuration facts, including:

- `python-core`, `python-testing`, `python-fastapi-expert`,
  `python-cashews-cache`, `python-nats-kv-cache`, `python-sqlalchemy-core`,
  `python-sqlalchemy-sqlite`, `python-sqlalchemy-mysql`, and
  `python-httpx-client`;
- `typescript-core`, `typescript-jest-testing`, `eslint-typescript`, and
  `prettier-formatting`;
- `vue3-typescript-vite-expert`, `vue-router-expert`, `pinia-expert`,
  `vueuse-expert`, their testing overlays, `vitest-vue-testing`, and
  `vue-playwright-e2e-testing`;
- `css-expert`, `css-animation-expert`, `tailwind-expert`, `scss-expert`, and
  `vue-svg-graphics-expert` when the question is about documented platform or
  library behavior;
- `playwright-ui-checks-mcp` for current Playwright MCP capabilities and
  configuration.

For `python-backend-security` and `ui-ux-review`, Context7 is supplementary only:
use it for concrete dependency/browser API behavior, not as the sole basis for
security or UX policy.

For `jira-data-center`, preserve the declared Jira Data Center version boundary,
runtime `/rest/api/2/serverInfo` verification, and curated Jira sources. Do not
replace those controls with Jira Cloud or generic Jira documentation returned by
a fuzzy match.

For Obsidian skills, Context7 may explain a documented dependency API when an
appropriate source exists, but it does not replace the configured Semantic Notes
Vault MCP boundary, Templater policy, or project-defined wiki/taskbook workflow.

## Availability and fallback

When Context7 is enabled but unavailable, rate-limited, cannot resolve the
correct library, or lacks the required version/topic:

- do not invent a result;
- do not disable or invalidate otherwise active subject-matter skills;
- fall back to curated primary sources or direct official documentation when the
  current request mode permits network access;
- state the unresolved documentation gap when no reliable fallback establishes
  the required fact.

If the user explicitly requires Context7 itself as the verification mechanism,
report its unavailability instead of silently replacing it with another source.

## Privacy and credentials

- Never place Context7 API keys, OAuth tokens, passwords, secrets, private source
  code, personal data, or proprietary payloads into documentation queries.
- Keep Context7 credentials in the configured MCP/authentication boundary, not
  in `CODEX_PROJECT.md`, rules, skills, prompts, examples, or repository files.
- Formulate the smallest technical query that retrieves the required public or
  approved private documentation.

## Request-routing interaction

Read-only Context7 documentation retrieval inherits the current request mode.
It does not require `external-system-only` merely because the source is accessed
through MCP. The current surface gate must still permit MCP/external-network
access.

Changing Context7 account state, credentials, indexed private sources, or other
remote administrative state is outside this rule and requires the appropriate
external-system authorization.

## Official Context7 references

Use the current official Context7 documentation when validating Context7 itself:

- overview: `https://context7.com/docs/overview`;
- MCP client configuration: `https://context7.com/docs/resources/all-clients`;
- retrieval/version guidance: `https://context7.com/docs/tips`;
- query privacy: `https://context7.com/docs/security/data-privacy`.
