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
12. Для SQLAlchemy с MySQL через `aiomysql` активируйте `python-sqlalchemy-core + python-sqlalchemy-mysql` и объявите точные server family/version, driver/version sources, pool, timeout, isolation, SQL mode, charset/collation, migration и integration-test policies.
13. Для `jira-data-center` сохраните специализированный Jira Data Center profile: exact rule/skill pair, declared `8.22.x` или точную `8.22.z`, instance/environment и источники configuration. Runtime version проверяется через `/rest/api/2/serverInfo`; другая major/minor версия требует отдельных проверенных материалов.
14. Для параметризуемой SVG-графики во Vue активируйте `vue3-typescript-vite`, профиль `vue-svg-graphics` и exact `vue_svg_graphics.md + vue-svg-graphics-expert` pair. CSS, CSS animation, Tailwind, UI validation и testing остаются отдельными опциональными overlays.
15. Для единого контекста пользовательской активности активируйте `obsidian-activity-context`, exact `obsidian_activity_context.md + obsidian-activity-context` pair и обязательный `obsidian-mcp-core`; шаблон Templater проверяется через MCP, отсутствующий создаётся из reference, а существующий неактуальный изменяется только после решения пользователя.

## Фактическое покрытие

Таблица отражает реально существующие rules и skill-пакеты, а не планируемые профили.

| Область | Фактическое покрытие |
| --- | --- |
| Маршрутизация и общие правила | `request_routing.md`, `material_dependencies.md`, `source_code_hygiene.md`, `git.md` |
| Актуальная техническая документация | `context7_documentation.md` для опционального Context7 MCP retrieval |
| Язык code-adjacent prose | `comment-language-audit` |
| Python core и тестирование | `python-core`, `python-testing`, `python-service-e2e-testing` |
| Python backend | `python-fastapi-expert`, `python-cashews-cache`, `python-sqlalchemy-core`, `python-sqlalchemy-sqlite`, `python-sqlalchemy-mysql`, `python-httpx-client`, `python-backend-security` |
| Python distributed cache | `python_nats_kv_cache.md`, `python-nats-kv-cache` для NATS JetStream Key/Value |
| TypeScript и Node.js | `typescript-core`, `typescript-jest-testing`, `eslint-typescript`, `prettier-formatting`, `nodejs-service-e2e-testing` |
| Vue 3 + TypeScript + Vite | `vue3-typescript-vite-expert`, `vue-svg-graphics-expert`, `vue-router-expert`, `pinia-expert`, `vueuse-expert` |
| Vue testing и browser E2E | `vitest-vue-testing`, `vue-router-testing`, `pinia-testing`, `vueuse-testing`, `vue-playwright-e2e-testing` |
| Styling и UI validation | `css-expert`, `css-animation-expert`, `scss-expert`, `tailwind-expert`, `ui-ux-review`, `playwright-ui-checks-mcp` |
| Jira Data Center 8.22.x | `jira_data_center.md`, `jira-data-center` |
| Obsidian | `obsidian-mcp-core`, `obsidian-activity-context`, `obsidian-llm-wiki`, `obsidian-taskbook` |

Наличие технологии в `.codex/project.template.md` само по себе не означает наличие отдельного rule или skill-пакета. Фактическим источником перечня материалов служат `.codex/rules/` и `.agents/skills/`.

## Context7 documentation

`context7_documentation.md` — опциональное cross-cutting правило для получения актуальной или version-specific технической документации через Context7 MCP.

- правило активируется через `Active Rules` и не активирует предметные skills или rules;
- Context7 дополняет активные материалы и не является их hard dependency;
- применимая версия и фактическая конфигурация определяются из project/runtime evidence, а Context7 используется только для retrieval документации;
- для version-sensitive поведения проверяются корректные library/source/version и не допускается молчаливая подмена на `latest`;
- при недоступности или недостаточном покрытии Context7 используются curated official sources или прямая официальная документация;
- security, Jira Data Center и Obsidian сохраняют собственные source-of-truth и workflow boundaries.

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

## Профиль Python SQLAlchemy MySQL

Skill `python-sqlalchemy-mysql` предназначен для SQLAlchemy 2.x с MySQL через async driver `aiomysql` и всегда требует базовый skill `python-sqlalchemy-core`.

- профиль отделён от `python-sqlalchemy-sqlite`; SQLite-specific PRAGMA, WAL и single-writer queue не применяются к MySQL;
- активация требует `Database toolkit/ORM: SQLAlchemy`, `Active database: MySQL`, `Database driver: aiomysql` и exact `python-sqlalchemy-core + python-sqlalchemy-mysql` pair;
- runtime server family и точная версия проверяются до применения version-specific DDL, DML, locking и type behavior;
- MariaDB не считается молчаливой заменой MySQL и требует отдельно проверенной политики;
- профиль фиксирует SQLAlchemy pool budget, distinct timeout categories, InnoDB, isolation, charset/collation, SQL mode, transaction retry, migration и real-MySQL integration-test policies;
- direct `aiomysql.create_pool()` и legacy `aiomysql.sa` не смешиваются с SQLAlchemy engine ownership;
- Python runtime, отсутствующий в upstream classifiers или CI `aiomysql`, требует project-level compatibility tests вместо неподтверждённого утверждения о совместимости.

Good/bad patterns, review checklist и официальные SQLAlchemy, `aiomysql` и MySQL sources находятся в `.agents/skills/python-sqlalchemy-mysql/references/`.

## Профиль Vue SVG graphics

Пакет `vue_svg_graphics.md + vue-svg-graphics-expert` предназначен для переиспользуемой параметризуемой SVG-графики, которую Vue 3 формирует или изменяет на уровне geometry, paint, semantics либо motion.

- профиль требует активный `vue3-typescript-vite` и exact Vue SVG rule/skill pair;
- статичная графика без внутренней параметризации остаётся Vite-managed asset, а inline SVG используется только при необходимости реактивной геометрии, внутренних токенов, definitions, анимации или semantics;
- профиль фиксирует назначение SVG, rendering mode, browser targets, SSR и ID strategy, geometry source, `viewBox`/aspect-ratio policy, color token source, accessibility classification, motion, optimization и validation matrix;
- gradients, masks, clip paths, filters, markers, titles и descriptions используют уникальные детерминированные IDs, совместимые с несколькими экземплярами и SSR/hydration;
- untrusted SVG не вставляется через `v-html`;
- visual references преобразуются в переносимые решения по композиции, слоям, negative space, silhouette language, lighting и semantic color roles, а не копируются как конкретные защищённые assets;
- CSS, CSS animation, Tailwind CSS, UI/UX validation и тестирование подключаются только как отдельные активные overlays;
- Vite target, CSS target, Tailwind compatibility и native SVG/browser behavior проверяются как разные границы совместимости.

Архитектура компонентов, browser/accessibility/motion, art direction/color, good/bad patterns и официальные источники находятся в `.agents/skills/vue-svg-graphics-expert/references/`.

## Профиль Jira Data Center

Пакет `jira_data_center.md + jira-data-center` version-locked к Jira Data Center / Jira Software `8.22.x`.

- отдельный rule или skill выбирается через точный `Active Rules` или `Active Skills`, а весь пакет также может быть выбран через `jira-data-center` stack profile или включённый специализированный Jira section;
- применение пакета дополнительно требует включённый и полный специализированный Jira section с exact rule/skill pair и `8.22.x` либо точной `8.22.z` версией;
- runtime version проверяется через `/rest/api/2/serverInfo`;
- упоминание Jira в задаче само по себе не активирует пакет;
- runtime вне `8.22.x` останавливает применение пакета после version diagnostic;
- другая major/minor версия требует отдельного проверенного profile/rule/skill package либо явного обновления version boundary этого пакета.

## Профиль Obsidian Activity Context

Пакет `obsidian_activity_context.md + obsidian-activity-context` предназначен для ведения одного канонического контекстного файла на полный жизненный цикл одной пользовательской активности.

- пакет требует `obsidian-mcp-core`, но не активирует `obsidian-taskbook` или `obsidian-llm-wiki`;
- новый context автоматически создаётся для `implementation`, `documentation-only`, `analysis-only`, `review-only` и изменяющего `external-system-only`;
- `taskbook-only`, `wiki-only`, `question-only`, `status-only` и `commit-text-only` могут продолжать существующий context, но не создают новый автоматически;
- исходная постановка, все существенные уточнения, консолидированный актуальный объём, решения, ссылки на задачи и общий результат хранятся в одной context note;
- отдельные start/result/final/per-task context notes для одной активности запрещены;
- структура Templater-шаблона хранится в reference skill-пакета, а рабочий шаблон проверяется и при отсутствии создаётся в vault только через MCP;
- безопасные пользовательские дополнения к шаблону сохраняются, а устаревший или несовместимый существующий шаблон изменяется только после выбора пользователя;
- временный fallback outbox не является второй context note и удаляется только после успешной синхронизации и MCP read-back verification.

## Правила работы с Obsidian-материалами

Obsidian-related rules и skills требуют MCP-only подхода:

- операции чтения, поиска, создания, обновления, перемещения, архивирования и проверки Obsidian vault выполняются через Semantic Notes Vault MCP;
- `contexts/`, `raw/`, `wiki/`, `tasks/` и `archive/` считаются логическими путями vault, а не путями файловой системы репозитория;
- запрещено обходить MCP через shell-команды, скрипты, прямое чтение файлов, editor search или Git-операции по vault-содержимому;
- перед изменением существующей заметки её нужно прочитать через MCP, изменить минимально безопасной операцией и затем перечитать для проверки результата;
- whole-note replacement допустим только для явно запрошенной полной замены или осознанной регенерации заметки;
- `obsidian-mcp-core` определяет безопасный доступ, а `obsidian-activity-context`, `obsidian-llm-wiki` и `obsidian-taskbook` активируются как независимые overlays.
- `obsidian-activity-context` ведёт одну каноническую context note на пользовательскую активность: исходная постановка, все существенные уточнения, актуальный объём, связанные задачи и итог остаются в одном файле.
- отсутствующий Templater-шаблон activity context создаётся через MCP из canonical reference; существующий неактуальный шаблон автоматически не переписывается, а расхождения передаются пользователю для выбора.
- при недоступном MCP используется только временный fallback outbox, который позднее синхронизируется в одну каноническую context note и удаляется после read-back verification.

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
