# Tailwind CSS rules

Apply this rule only when `CODEX_PROJECT.md` declares Tailwind CSS active or when the task directly changes Tailwind configuration, utilities, or class usage.

This rule is independent from SCSS. SCSS belongs in a separate rule and skill.

## Required skills

Use together with:

- `tailwind-expert`.

## Source of truth

Before changing Tailwind usage:

1. Read `CODEX_PROJECT.md`.
2. Check Tailwind version, stylesheet/config path, build integration, Prettier plugin policy, and validation commands.
3. Inspect existing utility patterns, design tokens, CSS variables, and theme conventions.
4. Follow project-declared commands.

## Constraints

- Prefer existing tokens, theme values, and utility patterns.
- Use mobile-first responsive utilities unless the project declares another policy.
- Keep class lists readable and avoid ad-hoc values when project tokens exist.
- Use `prettier-plugin-tailwindcss` only when Tailwind class sorting is active.
- Do not add Tailwind plugins or major config changes without approval or project policy.
- Do not infer SCSS usage from Tailwind.
