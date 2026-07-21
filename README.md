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

- `AGENTS.md` — короткий bootstrap-файл. Он безусловно применяет `.codex/rules/request_routing.md`, использует `CODEX_PROJECT.md` в целевых проектах и передаёт подробную проверку зависимостей правилу `.codex/rules/material_dependencies.md`.
- `.codex/project.template.md` — шаблон для создания `CODEX_PROJECT.md` в корне целевого проекта. Это не активное правило.
- `.codex/rules/` — переносимые правила Codex. Шаблон проектного профиля в эту директорию не входит.
- `.agents/skills/` — переиспользуемые skill-пакеты.
- `SKILL.md` — обязательная точка входа skill-пакета с routing description, областью применения, workflow и явными hard dependencies, когда они существуют.
- `agents/openai.yaml` — необязательная metadata для интерфейса и default prompt.
- `references/` — необязательные подробные примеры, checklists, официальные источники и специализированные workflow.
- `LICENSE` — лицензия MIT.

`CODEX_PROJECT.md` намеренно не хранится в этом репозитории: он создаётся отдельно в каждом целевом проекте и содержит только применимые для него profiles, rules, skills, команды и политики. При работе над самим `agent-projects-tools` действует template repository mode: rules, skills и project template рассматриваются как поддерживаемые исходные материалы, а `CODEX_PROJECT.md` не создаётся.

## Как использовать в другом проекте

1. Скопируйте или подключите `AGENTS.md` в целевой проект.
2. Скопируйте `.codex/project.template.md` в корень целевого проекта под именем `CODEX_PROJECT.md`.
3. Всегда перенесите `.codex/rules/request_routing.md`. Это обязательное bootstrap-правило, которое нельзя удалить, отключить, заменить или установить в `none`.
4. Удалите из созданного профиля неиспользуемые опциональные разделы и оставьте только активные stack profiles, rules, skills, команды проверки, integrations и project-specific policies.
5. Если выбранный rule или skill объявляет hard dependencies, перенесите `.codex/rules/material_dependencies.md` и сами обязательные материалы. Validator применяется bootstrap-файлом независимо от `Active Rules`; отдельная запись активации для него не требуется.
6. Явно активируйте каждую обязательную зависимость через `Active Rules`, `Active Skills`, stack profile или специализированный profile section. Отсутствие validator rule или обязательного материала считается ошибкой профиля.
7. Перенесите только остальные нужные файлы из `.codex/rules/` и целиком соответствующие пакеты из `.agents/skills/`.
8. Не подключайте `.codex/project.template.md` как rule после создания проектного `CODEX_PROJECT.md`.
9. Не активируйте language-, framework-, database-, cache-, HTTP-client-, styling-, testing- или external-system-материалы без activation signal, разрешённого их entrypoint и `AGENTS.md`. Прямое упоминание технологии не является активацией, если entrypoint требует project profile.
10. Для `cashews` используйте `python_cashews_cache.md + python-cashews-cache` и специализированный Python cashews cache profile.
11. Для `python-nats-kv-cache` сохраните специализированный NATS KV cache profile: версии `nats-py` и `nats-server`, JetStream/account/domain, bucket ownership/configuration, key/codec/CAS/invalidation/outage/batch policies и exact `python_nats_kv_cache.md + python-nats-kv-cache` pair.
12. Для `jira-data-center` сохраните специализированный Jira Data Center profile: exact rule/skill pair, declared `8.22.x` или точную `8.22.z`, instance/environment и источники configuration. Runtime version проверяется через `/rest/api/2/serverInfo`; другая major/minor версия требует отдельных проверенных материалов.

## Фактическое покрытие

Таблица отражает реально существующие rules и skill-пакеты, а не планируемые профили.

| Область | Фактическое покрытие |
| --- | --- |
| Маршрутизация и общие правила | `request_routing.md`, `material_dependencies.md`, `source_code_hygiene.md`, `git.md` |
| Язык code-adjacent prose | `comment-language-audit` |
| Python core и тестирование | `python-core`, `python-testing`, `python-service-e2e-testing` |
| Python backend | `python-fastapi-expert`, `python-cashews-cache`, `python-sqlalchemy-core`, `python-sqlalchemy-sqlite`, `python-httpx-client`, `python-backend-security` |
| Python distributed cache | `python_nats_kv_cache.md`, `python-nats-kv-cache` для NATS JetStream Key/Value |
| TypeScript и Node.js | `typescript-core`, `typescript-jest-testing`, `eslint-typescript`, `prettier-formatting`, `nodejs-service-e2e-testing` |
| Vue 3 + TypeScript + Vite | `vue3-typescript-vite-expert`, `vue-router-expert`, `pinia-expert`, `vueuse-expert` |
| Vue testing и browser E2E | `vitest-vue-testing`, `vue-router-testing`, `pinia-testing`, `vueuse-testing`, `vue-playwright-e2e-testing` |
| Styling и UI validation | `css-expert`, `css-animation-expert`, `scss-expert`, `tailwind-expert`, `ui-ux-review`, `playwright-ui-checks-mcp` |
| Jira Data Center 8.22.x | `jira_data_center.md`, `jira-data-center` |
| Obsidian | `obsidian-mcp-core`, `obsidian-llm-wiki`, `obsidian-taskbook` |

Наличие технологии в `.codex/project.template.md` само по себе не означает наличие отдельного rule или skill-пакета. Фактическим источником перечня материалов служат `.codex/rules/` и `.agents/skills/`.

## Профиль Python cashews cache

Пакет `python_cashews_cache.md + python-cashews-cache` предназначен только для Python cache на базе библиотеки `cashews`.

- пакет активируется через exact `Active Rules`, `Active Skills`, stack profile или специализированный profile section;
- Redis или memory могут быть backend библиотеки `cashews`, но direct Redis clients и NATS JetStream KV требуют отдельных материалов;
- FastAPI wiring остаётся в `python-fastapi-expert`, а cache keys, TTL, tags, invalidation, lifecycle и tests — в `python-cashews-cache`.

## Профиль Python NATS JetStream KV cache

Пакет `python_nats_kv_cache.md + python-nats-kv-cache` предназначен для распределённого Python cache, реализованного напрямую через `nats-py` и NATS JetStream Key/Value.

- профиль отделён от `python_cashews_cache.md + python-cashews-cache`, который остаётся `cashews`-specific;
- активация требует exact `Active Rules`, `Active Skills`, stack profile или включённый специализированный profile section;
- профиль фиксирует версии клиента и сервера, JetStream/account/domain, connection/auth/TLS sources, bucket ownership, TTL, limits, storage, replicas, key namespace, codec, lifecycle, invalidation и outage policy;
- bucket рассматривается как восстанавливаемый cache, а не как единственный system of record;
- mutable read-modify-write операции используют revision-based CAS и не выполняются через `get -> modify -> put`;
- bounded bulk operations допустимы только для независимых ключей с per-key результатами и partial-completion policy;
- базовый профиль не обещает multi-key transaction, не публикует напрямую в `$KV.*` и не трактует stream-level `AllowAtomicPublish` как стандартный KV batch API;
- live bucket create/reconfigure/purge/delete operations требуют отдельного `external-system-only` gate;
- unit tests дополняются integration tests с реальным JetStream-enabled NATS и изолированными buckets.

Официальные NATS и `nats.py` источники, version/feature precedence и границы stream-level возможностей перечислены в `.agents/skills/python-nats-kv-cache/references/official-sources.md`.

## Профиль Jira Data Center

Пакет `jira_data_center.md + jira-data-center` version-locked к Jira Data Center / Jira Software `8.22.x`.

- отдельный rule или skill выбирается через точный `Active Rules` или `Active Skills`, а весь пакет также может быть выбран через `jira-data-center` stack profile или включённый специализированный Jira section;
- применение пакета дополнительно требует включённый и полный специализированный Jira section с exact rule/skill pair и `8.22.x` либо точной `8.22.z` версией;
- runtime version проверяется через `/rest/api/2/serverInfo`;
- упоминание Jira в задаче само по себе не активирует пакет;
- runtime вне `8.22.x` останавливает применение пакета после version diagnostic;
- другая major/minor версия требует отдельного проверенного profile/rule/skill package либо явного обновления version boundary этого пакета.

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
4. **Явные зависимости между материалами** — зависимый entrypoint содержит точные имена обязательных skills и пути обязательных rules; подробная методика проверки хранится в `material_dependencies.md`.
5. **Разделение dependency types** — hard dependencies и optional coordination должны быть разнесены по отдельным разделам и не использовать одинаковую безусловную формулировку.
6. **Минимум неявных предположений** — источник истины для конкретного проекта — его `CODEX_PROJECT.md` и repository metadata.
7. **Актуальность** — устаревшие rules, skills и references следует обновлять или удалять.
8. **Краткий routing description** — поле `description` в frontmatter кратко формулирует условия активации и отличительные ключевые слова. Полный перечень возможностей, workflow и ограничений остаётся в теле `SKILL.md`.
9. **Синхронизация README** — изменения структуры, путей, dependency graph и фактического покрытия должны отражаться в README в том же PR.

## Участие в разработке

Для изменения репозитория:

1. создайте ветку от актуальной `master`;
2. добавьте или обновите rules, skills либо documentation;
3. проверьте согласованность README, `AGENTS.md`, project template, rules, skills и их явных зависимостей;
4. явно опишите изменения внешних зависимостей;
5. откройте pull request с кратким описанием назначения изменений.

Прямые изменения `master` не используются.

## Лицензия

Проект распространяется по лицензии MIT. См. файл `LICENSE`.
