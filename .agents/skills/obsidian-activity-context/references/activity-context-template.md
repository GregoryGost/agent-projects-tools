# Activity Context Template Reference

Use this reference as the canonical schema for the Templater template declared by `CODEX_PROJECT.md`.

The working template lives in the Obsidian vault and is managed only through Semantic Notes Vault MCP. This repository reference defines its required semantic structure. It is not a second working context note.

## Canonical Templater Template

Use project-configured section language. The following English headings define the canonical semantic roles and may be localized consistently.

```markdown
---
type: activity-context
schema_version: 1
activity_id:
project:
status: active
created_at:
updated_at:
completed_at:
tasks: []
---

# <% tp.file.title %>

## Initial request

## Clarifications and requirement changes

## Current scope

## Decisions and work progress

## Related tasks

## Result

## Open questions
```

## Required Frontmatter Roles

- `type`: exact value `activity-context`;
- `schema_version`: project-declared supported schema version;
- `activity_id`: stable identifier assigned by the agent workflow;
- `project`: project key or project identifier;
- `status`: lifecycle status such as `active`, `completed`, or `reopened` according to project policy;
- `created_at`: creation timestamp;
- `updated_at`: last material update timestamp;
- `completed_at`: completion timestamp or empty value;
- `tasks`: links or identifiers for related task notes.

## Required Section Roles

- initial request: the original user goal without later replacement;
- clarifications and requirement changes: chronological material follow-ups and corrections;
- current scope: the consolidated latest requirement;
- decisions and work progress: durable decisions and meaningful activity-level progress;
- related tasks: links to task notes when taskbook tracking is active;
- result: aggregate outcome, partial completion, limitations, and relevant deliverables;
- open questions: unresolved items that may affect continuation.

Section titles may be localized or renamed only when `CODEX_PROJECT.md` explicitly maps every required semantic role to the project-specific heading.

## Safe Project-Specific Additions

These additions do not make an existing template outdated by themselves:

- additional frontmatter fields;
- additional Markdown sections;
- aliases and tags;
- Dataview-compatible fields;
- visual formatting;
- safe Templater expressions that do not create extra context notes, move files, call system commands, or overwrite existing notes.

## Drift Requiring User Decision

Treat an existing template as outdated or incompatible when it has any of these conditions:

- a required frontmatter role or section role is absent and no explicit mapping exists;
- `schema_version` is older than the project-supported version;
- the template changes the meaning of a required role;
- automation creates multiple context notes for one activity;
- automation moves or renames context notes outside the declared policy;
- shell, system-command, or other unsafe executable behavior is present;
- creation logic can overwrite or reinitialize an existing activity context;
- required Templater behavior cannot be verified through MCP read-back.

When drift is detected, show the differences and ask the user to choose whether to update the existing template while preserving custom content, declare a project-specific semantic mapping, or cancel context creation.

## Creation And Rendering Rules

- Create the vault template from this reference only when the configured template path is absent.
- Do not create an alternative template at an inferred path.
- Do not overwrite an existing template automatically.
- Do not reapply this template to an existing activity-context note.
- Do not assume that MCP note creation executes Templater expressions.
- Follow the project-declared application mode and re-read the resulting note to verify that required roles were rendered.
- Values that establish identity or lifecycle should be supplied by the activity-context workflow rather than interactive Templater prompts.
