# Material dependency rules

Apply this rule when an active rule or skill declares another rule or skill as required, or when maintaining dependency declarations in the template repository.

This rule does not activate unrelated materials. It validates only explicitly declared hard dependencies.

## Hard dependency declarations

Treat a referenced rule or skill as a hard dependency when the entrypoint declares it unambiguously through one of these forms:

- a `Required Dependencies` section;
- a `Required skills` section;
- `Use together with` when the wording is unconditional;
- an explicit `requires` statement;
- an unconditional `Apply <artifact> together with this ...` statement.

Do not treat conditional coordination as a hard dependency, including wording such as:

- `combine with ... when active`;
- `apply ... when the task touches that area`;
- `use the active ... skill` when that area is optional for the current task;
- examples, related-material lists, or references that do not state a requirement.

For new or substantially updated skills, prefer a `Required Dependencies` section containing exact skill names and full rule paths. Rules should use `Required skills` and exact skill names; required rule paths must be stated explicitly.

## Validation workflow

Before applying a dependent artifact:

1. Confirm that the artifact itself is active through `CODEX_PROJECT.md`, an active stack profile, a specialized profile section, or a task-scoped activation allowed by the current request mode.
2. Read the artifact entrypoint and collect only its explicit hard dependencies.
3. Resolve each dependency to an exact rule path or skill name.
4. Confirm that each dependency exists in the target project.
5. Confirm that each dependency is active through an allowed activation signal and is not disabled or set to `none`.
6. Repeat the same validation for every dependency until the complete transitive closure is checked.
7. Track visited artifacts so mutual `rule ↔ skill` dependencies and other fully declared cycles do not recurse indefinitely.
8. A cycle is valid only when every member exists, is active, and all dependencies leaving the cycle are satisfied.

A dependency cycle never activates its members. Every member must be active independently through the project profile or an authorized task-scoped activation.

## Failure handling

When a dependency is missing, inactive, disabled, or ambiguous:

- do not apply the dependent artifact;
- do not silently activate or copy the missing dependency;
- report the dependent artifact, the missing dependency, and the full dependency chain;
- distinguish a missing file/package from a present but inactive dependency;
- change `CODEX_PROJECT.md` only when the current request and `request_routing.md` authorize a profile change;
- after an authorized correction, run dependency validation again from the original artifact.

If dependency wording is ambiguous, treat the profile as unresolved rather than guessing whether the dependency is mandatory.

## Template repository maintenance

When adding or changing a rule or skill:

- keep hard dependencies in the entrypoint, not only in references;
- use exact identifiers that match `.codex/rules/` paths and `.agents/skills/` names;
- keep optional coordination separate from hard dependencies;
- verify reverse references and transitive dependencies;
- preserve valid mutual rule/skill pairs without relying on them for implicit activation;
- update `README.md` and `.codex/project.template.md` when dependency handling or required profile entries change.

## Review checklist

- [ ] Every hard dependency is declared explicitly in the entrypoint.
- [ ] Optional coordination is not misclassified as required.
- [ ] Exact rule paths and skill names resolve to existing artifacts.
- [ ] Every required artifact is active and not set to `none`.
- [ ] The full transitive closure was validated.
- [ ] Cycles were handled with visited-node tracking and did not imply activation.
- [ ] Missing dependencies were reported instead of activated silently.
