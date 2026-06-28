# UI/UX validation rules

Apply this rule when `CODEX_PROJECT.md` declares UI/UX validation active or when the task changes visible UI, user flow, navigation, accessibility-sensitive markup, or responsive behavior.

This rule is framework-agnostic. Framework, styling, and browser automation details are handled by active overlays.

## Required skills

Use together with:

- `ui-ux-review`.

Use related skills only when active:

- `playwright-ui-checks-mcp` for browser validation.
- `tailwind-expert` when Tailwind classes affect UI/UX.
- `scss-expert` when SCSS affects UI/UX.

## Source of truth

Before validating UI/UX:

1. Read `CODEX_PROJECT.md`.
2. Check active frontend framework, styling tools, UI validation tools, routes, target browsers, and artifact policy.
3. Inspect changed UI code and related style/config files.
4. Use project-declared validation commands or MCP workflows.

## General checks

- Layout remains stable across declared breakpoints.
- Focus, hover, active, disabled, loading, empty, and error states are handled when relevant.
- UI text and accessible names follow project language policy.
- Interactive elements are keyboard reachable where applicable.
- Color, spacing, and hierarchy use active project tokens or styling conventions.
- Tailwind and SCSS-specific checks apply only when those tools are active.
