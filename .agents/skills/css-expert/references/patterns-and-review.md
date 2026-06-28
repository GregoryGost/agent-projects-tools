# CSS Patterns And Review

Use this reference when designing or reviewing standalone CSS.

## Core Principles

- Treat CSS as a standalone styling layer activated by `CODEX_PROJECT.md`.
- Keep stylesheet ownership explicit: tokens, base, layout, components, utilities, and overrides.
- Use CSS custom properties for runtime theme values and shared design tokens.
- Keep selectors low-specificity and predictable.
- Check browser support before relying on modern CSS.
- Use progressive enhancement when a feature needs a fallback.

## Review Questions

- Is plain CSS active for this project or directly touched by the task?
- Which style layer owns this change?
- Are CSS entry points and browser support policy known?
- Are selectors maintainable?
- Does a modern feature need a fallback?
- If Vue is active, is the style placed in the correct SFC or shared CSS layer?
