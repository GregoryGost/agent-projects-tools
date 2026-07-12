# agent-projects-tools

`agent-projects-tools` — единое хранилище переносимых правил, скилов и reference-материалов для AI-агентов, используемых в разных проектах.

Текущий целевой агент: Codex.

## Назначение

Репозиторий хранит проектно-независимые материалы для AI-агентов:

1. bootstrap-инструкции агента;
2. переносимые правила поведения и работы;
3. переиспользуемые skill-пакеты;
4. шаблон проектного профиля;
5. reference-материалы для повторяемых workflow.

Материалы можно копировать, подключать или адаптировать в других проектах без привязки к исходному коду конкретного приложения.

## Состав репозитория

Основные элементы:

```text
.
├── AGENTS.md
├── LICENSE
├── README.md
├── .codex/
│   ├── project.template.md
│   └── rules/
└── .agents/
    └── skills/
        └── <skill-name>/
            ├── SKILL.md
            ├── agents/
            │   └── openai.yaml
            └── references/
```

Назначение элементов:

- `AGENTS.md` — короткий bootstrap-файл. Он требует сначала прочитать проектный `CODEX_PROJECT.md`, затем применять только релевантные rules и skills.
- `.codex/project.template.md` — шаблон для создания `CODEX_PROJECT.md` в корне целевого проекта. Это не активное правило.
- `.codex/rules/` — переносимые правила Codex. Шаблон проектного профиля в эту директорию не входит.
- `.agents/skills/` — переиспользуемые skill-пакеты.
- `SKILL.md` — обязательная точка входа skill-пакета с routing description, областью применения и workflow.
- `agents/openai.yaml` — необязательная metadata для интерфейса и default prompt.
- `references/` — необязательные подробные примеры, checklists, официальные источники и специализированные workflow.
- `LICENSE` — лицензия MIT.

`CODEX_PROJECT.md` намеренно не хранится в этом репозитории: он создаётся отдельно в каждом целевом проекте и содержит только применимые для него profiles, rules, skills, команды и политики.

## Как использовать в другом проекте

1. Скопируйте или подключите `AGENTS.md` в целевой проект.
2. Скопируйте `.codex/project.template.md` в корень целевого проекта под именем `CODEX_PROJECT.md`.
3. Удалите из созданного профиля неиспользуемые разделы и оставьте только активные stack profiles, rules, skills, команды проверки, integrations и project-specific policies.
4. Перенесите только нужные файлы из `.codex/rules/` и целиком соответствующие пакеты из `.agents/skills/`.
5. Не подключайте `.codex/project.template.md` как rule после создания проектного `CODEX_PROJECT.md`.
6. Не активируйте language-, framework-, database-, cache-, HTTP-client-, styling-, testing- или external-system-материалы без соответствующего профиля либо прямой необходимости по задаче.

## Фактическое покрытие

Таблица отражает реально существующие rules и skill-пакеты, а не планируемые профили.

| Область | Фактическое покрытие |
| --- | --- |
| Маршрутизация и общие правила | `request_routing.md`, `source_code_hygiene.md`, `git.md` |
| Язык code-adjacent prose | `comment-language-audit` |
| Python core и тестирование | `python-core`, `python-testing`, `python-service-e2e-testing` |
| Python backend | `python-fastapi-expert`, `python-cache`, `python-sqlalchemy-core`, `python-sqlalchemy-sqlite`, `python-httpx-client`, `python-backend-security` |
| TypeScript и Node.js | `typescript-core`, `typescript-jest-testing`, `eslint-typescript`, `prettier-formatting`, `nodejs-service-e2e-testing` |
| Vue 3 + TypeScript + Vite | `vue3-typescript-vite-expert`, `vue-router-expert`, `pinia-expert`, `vueuse-expert` |
| Vue testing и browser E2E | `vitest-vue-testing`, `vue-router-testing`, `pinia-testing`, `vueuse-testing`, `vue-playwright-e2e-testing` |
| Styling и UI validation | `css-expert`, `css-animation-expert`, `scss-expert`, `tailwind-expert`, `ui-ux-review`, `playwright-ui-checks-mcp` |
| Obsidian | `obsidian-mcp-core`, `obsidian-llm-wiki`, `obsidian-taskbook` |

Наличие технологии в `.codex/project.template.md` само по себе не означает наличие отдельного rule или skill-пакета. Фактическим источником перечня материалов служат `.codex/rules/` и `.agents/skills/`.

## Правила работы с Obsidian-материалами

Obsidian-related rules и skills требуют MCP-only подхода:

- операции чтения, поиска, создания, обновления, перемещения, архивирования и проверки Obsidian vault выполняются через Semantic Notes Vault MCP;
- `raw/`, `wiki/`, `tasks/` и `archive/` считаются логическими путями vault, а не путями файловой системы репозитория;
- запрещено обходить MCP через shell-команды, скрипты, прямое чтение файлов, editor search или Git-операции по vault-содержимому;
- перед изменением существующей заметки её нужно прочитать через MCP, изменить минимально безопасной операцией и затем перечитать для проверки результата;
- whole-note replacement допустим только для явно запрошенной полной замены или осознанной регенерации заметки;
- `obsidian-mcp-core` определяет безопасный доступ, а `obsidian-llm-wiki` и `obsidian-taskbook` активируются как независимые overlays.

## Принципы ведения материалов

При добавлении новых rules и skills соблюдайте следующие принципы:

1. **Переносимость** — материал не должен зависеть от внутренней структуры одного конкретного проекта, если это не указано явно.
2. **Ясная область применения** — должно быть понятно, для какого агента, языка, framework, external system и сценария предназначен материал.
3. **Явные внешние зависимости** — требования к приложениям, плагинам, MCP-серверам, языкам, frameworks и библиотекам описываются рядом с rule или skill.
4. **Минимум неявных предположений** — источник истины для конкретного проекта — его `CODEX_PROJECT.md` и repository metadata.
5. **Актуальность** — устаревшие rules, skills и references следует обновлять или удалять.
6. **Краткий routing description** — поле `description` в frontmatter кратко формулирует условия активации и отличительные ключевые слова. Полный перечень возможностей, workflow и ограничений остаётся в теле `SKILL.md`.
7. **Синхронизация README** — изменения структуры, путей и фактического покрытия должны отражаться в README в том же PR.

## Участие в разработке

Для изменения репозитория:

1. создайте ветку от актуальной `master`;
2. добавьте или обновите rules, skills либо documentation;
3. проверьте согласованность README, `AGENTS.md`, project template, rules и skills;
4. явно опишите изменения внешних зависимостей;
5. откройте pull request с кратким описанием назначения изменений.

Прямые изменения `master` не используются.

## Лицензия

Проект распространяется по лицензии MIT. См. файл `LICENSE`.
