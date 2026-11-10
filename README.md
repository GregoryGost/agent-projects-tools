# agent-projects-tools

`agent-projects-tools` — единое хранилище переносимых правил, скилов и reference-материалов для AI-агентов, используемых в разных проектах.

Текущий целевой агент: Codex.

## Назначение

Репозиторий хранит проектно-независимые материалы для AI-агентов:

1. bootstrap-инструкции агента;
2. переносимые правила поведения и работы;
3. переиспользуемые skill-пакеты;
4. шаблон проектного профиля;
5. reference-материалы и reusable skill assets для повторяемых workflow.

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
│   ├── agents/
│   │   └── <agent-name>.toml
│   └── rules/
└── .agents/
    └── skills/
        └── <skill-name>/
            ├── SKILL.md
            ├── agents/
            │   └── openai.yaml
            ├── references/
            └── scripts/
```

Назначение элементов:

- `AGENTS.md` — короткий bootstrap-файл. Он безусловно применяет `.codex/rules/request_routing.md`, использует `CODEX_PROJECT.md` в целевых проектах и передаёт подробную проверку зависимостей правилу `.codex/rules/material_dependencies.md`.
- `.codex/project.template.md` — шаблон для создания `CODEX_PROJECT.md` в корне целевого проекта. Это не активное правило.
- `.codex/rules/` — переносимые правила Codex. Шаблон проектного профиля в эту директорию не входит.
- `.codex/agents/` — переносимые TOML-конфигурации специализированных субагентов Codex, не являющиеся rules или skills.
- `.agents/skills/` — переиспользуемые skill-пакеты.
- `SKILL.md` — обязательная точка входа skill-пакета с routing description, областью применения, workflow и явными hard dependencies, когда они существуют.
- `agents/openai.yaml` — необязательная metadata для интерфейса и default prompt.
- `references/` — необязательные подробные примеры, checklists, официальные источники и специализированные workflow.
- `scripts/` — необязательные reusable executable assets skill-пакета. Если такой asset нужен target-проекту во время build/runtime, проект использует собственную явно управляемую копию или эквивалент, а не исполняет файл напрямую из `.agents/skills/`.
- `LICENSE` — лицензия MIT.

`CODEX_PROJECT.md` намеренно не хранится в этом репозитории: он создаётся отдельно в каждом целевом проекте и содержит только применимые для него profiles, rules, skills, команды и политики. При работе над самим `agent-projects-tools` действует template repository mode: rules, skills и project template рассматриваются как поддерживаемые исходные материалы, а `CODEX_PROJECT.md` не создаётся.

## Универсальная прединициализация целевого проекта (только при подключении материалов)

Этот раздел предназначен **для агента, выполняющего первоначальное внедрение agent-projects-tools** в другой репозиторий. Он относится ко всем технологиям, которые поддерживаются текущим набором материалов (Go, Python, C#, Unity, Blender, TypeScript, Vue, C++/Qt и другие), а не только к C++/Qt. После подготовки проекта обычные агенты читают выбранные параметры из CODEX_PROJECT.md и применяют активные rules/skills; повторная инвентаризация среды на каждую задачу не требуется.

Перед копированием/активацией материалов выполните ограниченное исследование **только релевантного данному проекту** стека и среды:

1. Из исходников, manifest/lock files, CMake/прочих build configs, CI, существующих тестов и документации определите языки, стандарты, фреймворки, библиотеки, версионные ограничения и реальные задачи проекта. Отличайте используемые зависимости от случайно установленных SDK и инструментов.
2. Исследуйте доступные средства разработки и проверки в том окружении, где фактически исполняется агент: компиляторы, runtime, SDK, build/test tools, анализаторы, отладчики, поддерживаемые MCP/LSP интерфейсы. Для VS Code учитывайте настройки workspace/user, связанные расширения и локальный/удалённый extension host (SSH/WSL/container) только в той мере, в какой к ним имеется реальный read-only доступ. Например, code --list-extensions --show-versions показывает установки доступного extension host, но не доказывает, какой language server активен и видит ли Codex панель Problems/несохранённые буферы.
3. Сопоставьте IDE-конфигурацию с рабочим build context: активные компилятор и preset/target, defines/includes, CMake generator, Qt SDK или иной фреймворк, диагностика и тестовая среда. Для C++/Qt учитывайте cpptools против clangd, clang-tidy/Clazy, CMake compilation database и ограничения генератора Visual Studio; не считайте инструменты взаимозаменяемыми по названию. Для остальных стеков применяйте аналогичное сопоставление их реальных runtime/IDE/CI средств (например, gopls для Go).
4. Используйте лишь разрешённые read-only проверки. Даже команда с названием configure, test, debug или lint может писать кеши, загружать пакеты, запускать процессы и менять окружение: анализируйте эффекты до запуска. Не устанавливайте расширения, компиляторы, MCP, SDK и зависимости, не меняйте IDE, генератор, глобальные настройки или исходники без отдельной авторизации.
5. Выберите минимально достаточные профили, rules/skills и их **полное замыкание hard dependencies** на основании подтверждённого стека. Не активируйте профиль просто потому, что инструмент обнаружен. Перенесите обязательные материалы, проверяя точные имена и собственные ограничения activation.
6. Заполните CODEX_PROJECT.md из .codex/project.template.md **итоговыми** версиями, путями/источниками конфигурации, активными профилями, доступными интерфейсами, проверочными командами и политиками. Не переносите в итоговый профиль процедуру предварительного поиска. Отсутствие доступа к IDE/LSP, неподтверждённые версии или несовместимость описывайте явно как неизвестные/недоступные, а не придумывайте успешную проверку.
7. Проверьте согласованность профиля с репозиторием, SDK, CI, scope команд, активацией зависимостей и текущими разрешениями. При материальной неоднозначности не назначайте произвольную технологию по умолчанию и не устанавливайте программы самостоятельно.

Эта процедура прединициализации не вводит нового режима полномочий: запрос пользователя и .codex/rules/request_routing.md по-прежнему ограничивают все изменения. Инструкции обнаружения должны оставаться в **README**, а .codex/project.template.md описывает уже выбранную рабочую конфигурацию.

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
15. Для custom/contrib nodes Node-RED используйте TypeScript-стандарт: одновременно активируйте `typescript-core`, `node-red-contrib`, exact `typescript_core.md + typescript-core` и `node_red_contrib.md + node-red-contrib-expert` pairs. Runtime source хранится в `.ts`, Node-RED загружает сгенерированный `.js`; project-owned postbuild или явно эквивалентный workflow собирает/валидирует Node-RED artifacts после компиляции, а канонический `.agents/skills/node-red-contrib-expert/scripts/node-red-postbuild.mjs` используется только как переносимый источник для проектной копии. Node-RED runtime/component tests подключаются отдельным `node-red-contrib-testing` profile, а Jest/browser/separate-process E2E остаются независимыми overlays.
16. Для Blender 5.2 используйте профильные пары `blender-core`, `blender-modeling`, `blender-materials-texturing`, `blender-rigging-animation`, `blender-mcp` и `blender-unity` только по фактической области задачи. `blender-core` является базой предметных Blender-профилей; официальный `blender-mcp` остаётся независимым automation overlay, а `blender-unity` задаёт Blender-side контракт подготовки ассетов для Unity без переноса Unity-owned importer/runtime state в Blender.

`CODEX_PROJECT.md` описывает возможности проекта, активные материалы и project-specific policy, но сам по себе не разрешает side effects. Максимальная область разрешённых действий определяется текущим сообщением пользователя через `request_routing.md`; активные rules/skills могут только сузить эту область, но не расширить её. Перед mutation каждое планируемое действие должно удовлетворять и request-routing gate, и всем применимым активным материалам.

## Специализированные субагенты Codex

В .codex/agents/ находятся десять готовых TOML-конфигураций. Для целевого проекта перенесите выбранные файлы в каталог .codex/agents/ и определите их применение в разделе Agent Roles And Model Selection файла CODEX_PROJECT.md. Наличие файла не активирует rule/skill и не разрешает выполнение действий вне запроса пользователя. Эти конфигурации отличаются от метаданных skill-пакетов .agents/skills/*/agents/openai.yaml.

| Субагент | Модель / effort | Задача |
| --- | --- | --- |
| architect_stability | gpt-6.1-sol / xhigh | Независимый проектировщик: совместимость и стабильность |
| architect_evolution | gpt-6.1-sol / xhigh | Независимый проектировщик: целостность и сопровождаемость |
| database_architect | gpt-6.1-sol / xhigh | Независимый предметный архитектор БД: целостность данных, транзакции, миграции, эксплуатация |
| code_explorer | gpt-6-luna / high | Исследование кодовой базы и реальных путей выполнения |
| docs_researcher | gpt-6-luna / high | Проверка документации и контрактов API |
| complex_implementer | gpt-6.1-sol / high | Реализация сложных изменений |
| simple_implementer | gpt-6-luna / high | Локальные исправления и шаблонный код |
| test_engineer | gpt-6.1-sol / high | Независимые позитивные и негативные проверки, воспроизведение дефектов и приёмка |
| code_reviewer | gpt-6.1-sol / high | Независимый code review |
| deep_debugger | gpt-6-astra / xhigh | Сложные баги и проверка архитектурных противоречий |

Для делегирования обязательно правило `.codex/rules/subagent_coordination.md`: каждое новое назначение выполняется в НОВОМ потоке без истории родителя (`spawn_agent` + `fork_turns: "none"` в MultiAgentV2). `followup_task` и повторное использование завершённого потока запрещены. Субагент возвращает итоговый отчёт координатору и не пишет файлы общего обмена напрямую. Для многоэтапных задач опционально включается `Subagent handoff persistence: local-ephemeral`: координатор публикует только проверенные завершённые этапы в `.agent-handoffs/<task_scope_id>/` с неизменяемыми версиями и актуальным `index.md`. Папка исключена из Git. Файлы можно создавать только при разрешении на такие записи в текущем запросе; в read-only задачах результаты передаются в текущей сессии без файлов.

Необязательный контроль вызовов приведён в `.codex/hooks.example.json` и `.codex/hooks/require_fresh_subagent.py`. Файл-пример НЕ активируется автоматически: для целевого проекта замените абсолютные пути к Python/скрипту, включая `commandWindows` для Windows, явно подключите и доверьте hook в Codex. Локальные Python-тесты: `python -m unittest discover -s .codex/hooks/tests`; они не устанавливают hook и не проверяют интеграцию с конкретной сборкой Codex. Проверяйте его на используемой версии Codex: `PreToolUse` — дополнительный ограничитель, а не абсолютная защита.

Базовая политика делегирования для целевых проектов с включёнными субагентами допускает только авторизованные изменения исполняемого кода и тестов. Запросы исключительно на документацию, комментарии и инструкции не делегируются. Для архитектурных решений оба архитектора сначала формируют независимые предложения, затем получают аргументированную критику друг друга через основного агента. Итоговое решение требует явного согласия обоих; при недоказанном противоречии привлекается deep_debugger. Основной агент отвечает за финальную проверку. Read-only в TOML — ограничение поведения: реальный sandbox и разрешения наследуются от основного агента.

Куратор и субагенты также проверяют **функциональные границы** изменений: запрошенное поведение и необходимые для корректности меры отличаются от необязательных улучшений. Для запрошенной функции достаточно связи с исходным требованием; для не запрошенного отдельно существенного поведения (например, полного сканирования БД при запуске, фонового восстановления или новых конфигурационных режимов), объявленного необходимым, требуется проверяемый контракт/инвариант, конкретный риск нарушения и оценка более простого достаточного решения. Одобрение архитектуры не расширяет запрос пользователя; необоснованные добавления откладываются до отдельного согласования. Проверка действует и при `Architecture Gate = NOT_REQUIRED`, а ревьюер фиксирует нарушения как `UNJUSTIFIED_SCOPE_EXPANSION`.

### Database Architect: предметная архитектура данных

`database_architect` подключается **явно** через `Selected role files` в `CODEX_PROJECT.md`. Это независимый read-only эксперт уровня Principal Database Architect, а не третий универсальный архитектор, исполнитель SQL-миграций или DBA с правом доступа к production. Его оценка охватывает модель данных, ключи и инварианты, транзакции и конкуренцию, индексы и планы, совместимость миграций/backfill, безопасность и изоляцию арендаторов, репликацию, восстановление, RPO/RTO и межсистемную согласованность. Конкретный стек/версия должны быть проверены по проекту; MySQL, SQLite, PostgreSQL, ClickHouse и MariaDB не считаются взаимозаменяемыми. Предметные SQLAlchemy skills применяются только по активной и совместимой конфигурации проекта.

Когда роль выбрана, куратор оценивает фактический риск изменений в хранилище. Для существенных изменений сохраняемого контракта/схемы, транзакционной целостности, миграции имеющихся данных, multi-tenancy/приватности, значимой производительности, репликации, резервирования или интеграционной согласованности предметное заключение **обязательно**. Для доказанно локальной низкорисковой SQL/ORM-правки его можно обоснованно не назначать. Значимое изменение **архитектуры данных** по-прежнему требует двух системных архитекторов. DBA предоставляет одинаковые проверенные ограничения обоим до их независимых предложений, а затем в новой чистой сессии проверяет **точную финальную редакцию** (`candidate_revision`).

`db_assessment_status` отделён от Architecture Gate: `NOT_REQUIRED` (есть обоснование), `PENDING`, `CLEAR`, `CHANGES_REQUIRED`, `BLOCKED`, `STALE`. При обязательной оценке до завершения зависимых изменений нужен `CLEAR`, относящийся к актуальной финальной редакции и базе данных; прежний отчёт после значимых изменений недействителен. `CLEAR` не утверждает всю архитектуру, не заменяет тестирование/ревью и не даёт третьего голоса. Оба системных архитектора независимо подтверждают один канонический дизайн; итоговый Architecture Gate переводит в APPROVED только куратор. Доказанные замечания DBA должны быть исправлены либо опровергнуты проверяемыми фактами и повторно рассмотрены, а не проигнорированы.

Оценка DBA передаётся координатору как `Database Architecture Assessment` с исходными данными, наблюдаемыми контрактами, фактами/гипотезами, альтернативами, рисками, `candidate_revision` и статусом. При разрешённом `local-ephemeral` координатор может сохранить версионированный результат как `architecture/database-assessment-vN.md`, не предоставляя субагенту право записи. Важное ограничение: даже `EXPLAIN ANALYZE` или SQL, называемый read-only, может выполнять реальную нагрузку; агент предлагает только безопасные способы проверки и не подключается к production самостоятельно.

### Architecture Gate и порядок выполнения

До начала зависимой работы куратор выбирает роли и устанавливает архитектурное состояние для конкретного рабочего потока. Без архитекторов — NOT_REQUIRED. При их назначении, в том числе посреди реализации, сразу действует PENDING: куратор и исполнители останавливают проектирование кода, изменения, новые тестовые сценарии и приёмку; разрешённый сбор фактов и спор двух архитекторов продолжаются.

Остановку необходимо подтвердить: запросить прерывание, дождаться подтверждения/завершения затронутых команд и проверить частичные изменения в общей рабочей области. Сообщение агенту «остановись» само по себе не гарантирует прекращения записи. До подтверждения безопасной паузы зависимая работа заблокирована.

| Architecture Gate | Значение |
| --- | --- |
| NOT_REQUIRED | Архитекторы не назначены |
| PENDING | Архитекторы назначены, общего решения нет |
| APPROVED | Оба подтвердили идентичную финальную редакцию, куратор утвердил handoff |
| REOPENED | Подтверждено, что само архитектурное решение требует пересмотра |
| BLOCKED | Архитектурные требования, доказательства или согласие недоступны |

Архитекторы независимо разрабатывают предложения, критикуют их и **оба подтверждают одну точную финальную редакцию**. Затем куратор выпускает Architecture Handoff: область задачи, версию решения, исходные требования и ревизию, неизменяемый утверждённый дизайн с двумя подтверждениями, своё утверждение, контракты, ограничения, риски и обязательные проверки. После сжатия контекста необходимо подтвердить состояние Gate: при NOT_REQUIRED — само решение куратора не назначать архитекторов; при APPROVED — актуальный Architecture Handoff и его утверждения. Если необходимое подтверждение недоступно, затронутая работа не возобновляется. Новые файлы, заметки и внешние записи автоматически не создаются.

**Ошибка реализации — не ошибка архитектуры.** Если выполнимый архитектурный контракт нарушен кодом, исправляет имплементатор, архитектура остаётся APPROVED. Если установлен дефект самого решения, затронутый поток переходит в REOPENED, оба архитектора повторно согласуют новую редакцию. При неоднозначной причине применяют read-only диагностику, а не автоматически открывают архитектуру. Статус тестов самостоятельный: APPROVED совместим с testing_status=BLOCKED при недоступной тестовой среде.

### Независимые тесты, Validation Gate и ревью

После APPROVED (или явно NOT_REQUIRED) имплементатор пишет назначенный код, а test_engineer готовит позитивные, негативные, граничные и регрессионные сценарии по исходным требованиям и актуальной архитектуре. При обнаружении ошибки тестировщик классифицирует её причину, формирует воспроизводимый отчёт и возвращает исправимую реализационную ошибку разработчику. После исправления проводит новые проверки, не ослабляя правильные ожидания. Если архитектура оказывается неверной, повторное согласование предшествует зависимым исправлениям.

Перед окончательной приёмкой куратор фиксирует **Validation Gate**: стабильный снимок исходников, тестов, фикстур и значимой конфигурации, включая незакоммиченные и новые файлы. Проверки выполняются без параллельного изменения этих входных данных (либо в отдельно разрешённом изолированном рабочем дереве). Неподтверждённая стабильность снимка не позволяет выдать ACCEPTED. Любая последующая значимая правка требует повторной проверки затронутых результатов. Создавать Git commit только ради снимка не обязательно.

Куратор заранее определяет, нужны ли независимые тестировщик и code_reviewer: на сложных и рискованных задачах оба предполагаются обязательными, а на небольших безопасных задачах отклонение объясняется явно. Обязательные проектные тесты нельзя отменить пропуском субагента. Состояния тестирования, ревью и архитектуры независимы; их не следует смешивать в одном BLOCKED.

### Потоки, параллельные сессии и обновление целевых проектов

У Codex есть ограничение на количество открытых потоков: куратор ожидает результаты или закрывает завершённые потоки; каждое новое назначение требует новой чистой сессии. Если подтверждённый режим без наследования истории недоступен, делегирование останавливается вместо запуска с унаследованным контекстом. Потоки одной сессии разделяют рабочую среду и разрешения; инструкции «read-only» не создают физическую файловую блокировку. Для нескольких параллельных сессий нужны проверенная изоляция рабочих деревьев либо согласованная политика одного пишущего процесса. Worktree не создаётся автоматически и не разрешается инструкциями субагента.

При обновлении материалов agent-projects-tools в целевом проекте синхронизируйте: `AGENTS.md`, `.codex/rules/request_routing.md`, **обязательный при включённых субагентах** `.codex/rules/subagent_coordination.md`, раздел Agent Roles And Model Selection в `CODEX_PROJECT.md` и выбранные `.codex/agents/*.toml`. Для `local-ephemeral` добавьте `.agent-handoffs/` в `.gitignore` целевого проекта; установка hook остаётся отдельной добровольной операцией. Проверьте соответствие названий ролей, моделей и текущей версии handoff. Автоматическая CI-проверка соблюдения этого контракта в целевых проектах не устанавливается вместе с шаблоном.

### Настройка главного агента и параллельности в целевом проекте

В доверенном целевом проекте можно использовать следующие настройки .codex/config.toml (пример, а не часть исходного репозитория шаблонов):

~~~toml
model = "gpt-6.1-sol"
model_reasoning_effort = "xhigh"

[agents]
enabled = true
max_concurrent_threads_per_session = 4
~~~

Значение 4 ограничивает число одновременно открытых потоков субагентов, не считая основного. Это рекомендуемое начальное значение, а не обязательное ограничение. При существующем .codex/config.toml объедините параметры с текущим конфигом, не перезаписывая остальные настройки. Параметры роли и уровня рассуждения для каждого выбранного субагента уже находятся в его TOML; отдельные объявления в [agents] не требуются. Запись в CODEX_PROJECT.md не переключает модель текущей сессии. Доступность моделей/effort зависит от версии Codex и аккаунта; недоступные комбинации следует явно диагностировать, не заменяя молча.

Документация Codex: https://learn.chatgpt.com/docs/agent-configuration/subagents, https://learn.chatgpt.com/docs/hooks и https://learn.chatgpt.com/docs/config-file/config-reference. Исходный код `fork_turns`: https://github.com/openai/codex/blob/main/codex-rs/core/src/tools/handlers/multi_agents_v2/spawn.rs.

## Фактическое покрытие

Таблица отражает реально существующие rules и skill-пакеты, а не планируемые профили.

| Область | Фактическое покрытие |
| --- | --- |
| Маршрутизация и общие правила | `request_routing.md`, `material_dependencies.md`, `subagent_coordination.md` (условная активация), `source_code_hygiene.md`, `git.md` |
| Актуальная техническая документация | `context7_documentation.md` для опционального Context7 MCP retrieval |
| Язык code-adjacent prose | `comment-language-audit` |
| C++17+ язык и стиль | `cpp_core.md` + `cpp-core`: ownership/RAII, ABI и C interop, concurrency, VS Code diagnostics, clangd/clang-tidy, debugging; `cpp_style.md` + `cpp-style`: .clang-format и безопасная область форматирования |
| C++ исходящие HTTP-клиенты | `cpp_http_client.md` + `cpp-http-client`: выбранный проектом libcurl/cpr/иной транспорт, HTTP/1.1 и HTTP/2, TLS, безопасные opt-in retries, rate limits, SSE-протокол и изолированные проверки |
| Qt 6 HTTP-клиенты | `qt_http_client.md` + `qt-http-client`: QNetworkAccessManager, QNetworkReply, Qt REST 6.7+, HTTP/2, асинхронная отмена, QTimer retries и SSE без дополнительных библиотек |
| C++ сборка и тестирование | `cpp_cmake.md` + `cpp-cmake`: CMake targets, presets и compilation database; `cpp_testing.md` + `cpp-testing`: CTest, existing test frameworks, sanitizers и coverage по настройкам проекта |
| Qt 6 Core и Widgets | `qt_core.md` + `qt-core`: QObject, signals/slots, event loop, thread affinity, Clazy; `qt_widgets.md` + `qt-widgets`: GUI и model/view contracts |
| Qt 6 Testing и Quick/QML | `qt_testing.md` + `qt-testing`: QTest, QSignalSpy, GUI/event-loop tests; `qt_quick_qml.md` + `qt-quick-qml`: QML modules, bindings, qmllint/qmlls, C++ integration |
| C# core и style | `csharp_core.md`, `csharp-core`, `csharp_style.md`, `csharp-style` для version-aware C#, `.editorconfig`-first naming/formatting и безопасных style-изменений |
| Unity 6.3 | `unity_core.md`, `unity-core`, `unity_editor.md`, `unity-editor`, `unity_testing.md`, `unity-testing` для Unity 6000.3.x runtime/Editor/test boundaries |
| Official Unity CLI | `unity_cli.md`, `unity-cli` для официального Unity CLI; priority baseline `1.0.0-beta.10`, `unity mcp`/live Editor + Pipeline command discovery, batch/CI fallback и routed side effects |
| Blender 5.2 | `blender_core.md`, `blender-core`, `blender_modeling.md`, `blender-modeling`, `blender_materials_texturing.md`, `blender-materials-texturing`, `blender_rigging_animation.md`, `blender-rigging-animation` для Blender 5.2.x data model и asset authoring |
| Official Blender Lab MCP | `blender_mcp.md`, `blender-mcp` для официального Blender Lab MCP; priority baseline `1.0.3`, live Editor first, scene/docs/screenshot inspection, bounded `bpy` execution и headless fallback |
| Blender → Unity | `blender_unity.md`, `blender-unity` для Blender 5.2.x → Unity 6000.3.x asset boundary: FBX, scale/axes, mesh/UV/normals, textures/material data, rigs/animation, blend shapes, LOD и import validation |
| Go: язык, тесты, Huma v2 | `go_core.md`, `go-core` (идиоматичный Go, API, конкурентность, жизненный цикл, модули/сборка, производительность); `go_testing.md`, `go-testing` (unit, `httptest`, race/fuzz и benchmark regression); `go_huma_v2.md`, `go-huma-v2` (типизированные HTTP API, OpenAPI 3.1) |
| Go: observability, security, outgoing HTTP | `go_observability.md` + `go-observability` (логи, метрики, трассы); `go_security.md` + `go-security` (фиксированная проектная модель риска и security review); `go_http_client.md` + `go-http-client` (стандартный `net/http`, таймауты, retries и тестирование) — независимые опциональные профили |
| Go: локальный и NATS KV кэш | `go_local_cache.md` + `go-local-cache` (Otter v2, ограниченный по размеру in-process кэш); `go_nats_kv_cache.md` + `go-nats-kv-cache` (официальный `nats.go/jetstream`, bucket TTL, CAS, watcher, изоляция окружений) — независимые опциональные профили |
| Go: GORM и SQLite/Goose | `go_gorm.md`, `go-gorm` для backend-neutral ORM; `go_gorm_sqlite_goose.md`, `go-gorm-sqlite-goose` для SQLite-драйверов, PRAGMA, блокировок и миграций Goose v3 |
| Python core и тестирование | `python-core`, `python-testing`, `python-service-e2e-testing` |
| Python backend | `python-fastapi-expert`, `python-cashews-cache`, `python-sqlalchemy-core`, `python-sqlalchemy-sqlite`, `python-sqlalchemy-mysql`, `python-httpx-client`, `python-backend-security` |
| Python distributed cache | `python_nats_kv_cache.md`, `python-nats-kv-cache` для NATS JetStream Key/Value |
| TypeScript и Node.js | `typescript-core`, `typescript-jest-testing`, `eslint-typescript`, `prettier-formatting`, `nodejs-service-e2e-testing` |
| TypeScript Node-RED contrib и runtime testing | `node_red_contrib.md`, `node-red-contrib-expert`, canonical `node-red-postbuild.mjs`, `node_red_contrib_testing.md`, `node-red-contrib-testing` поверх обязательного `typescript-core` |
| Vue 3 + TypeScript + Vite | `vue3-typescript-vite-expert`, `vue-svg-graphics-expert`, `vue-router-expert`, `pinia-expert`, `vueuse-expert` |
| Vue testing и browser E2E | `vitest-vue-testing`, `vue-router-testing`, `pinia-testing`, `vueuse-testing`, `vue-playwright-e2e-testing` |
| Styling и UI validation | `css-expert`, `css-animation-expert`, `scss-expert`, `tailwind-expert`, `ui-ux-review`, `playwright-ui-checks-mcp` |
| Jira Data Center 8.22.x | `jira_data_center.md`, `jira-data-center` |
| Obsidian | `obsidian-mcp-core`, `obsidian-llm-wiki`, `obsidian-taskbook` |

Наличие технологии в `.codex/project.template.md` само по себе не означает наличие отдельного rule или skill-пакета. Фактическим источником перечня материалов служат `.codex/rules/` и `.agents/skills/`.

## Context7 documentation

`context7_documentation.md` — опциональное cross-cutting правило для получения актуальной или version-specific технической документации через Context7 MCP.

- правило активируется через `Active Rules` и не активирует предметные skills или rules;
- Context7 дополняет активные материалы и не является их hard dependency;
- применимая версия и фактическая конфигурация определяются из project/runtime evidence, а Context7 используется только для retrieval документации;
- для version-sensitive поведения проверяются корректные library/source/version и не допускается молчаливая подмена на `latest`;
- при недоступности или недостаточном покрытии Context7 используются curated official sources или прямая официальная документация;
- security, Jira Data Center и Obsidian сохраняют собственные source-of-truth и workflow boundaries.

## C++17+ и Qt 6 — переносимые профили (VS Code)

- OBS Studio 33.0.1 служит **проверенным ориентиром** C++17/C17 (без GNU extensions), но ни OBS, ни его SDK не являются базовым таргетом/зависимостью правил. Если целевой проект использует иной подтверждённый стандарт C++, применяется именно он.
- `cpp_core.md + cpp-core` — базовый экспертный профиль; `cpp_style.md + cpp-style`, `cpp_cmake.md + cpp-cmake` и `cpp_testing.md + cpp-testing` — независимые опциональные профили, требующие активную C++-базу. Наличие CMake/CTest/clangd не активирует их автоматически.
- `qt_core.md + qt-core` — Qt 6 overlay поверх C++; `qt_widgets.md + qt-widgets` и `qt_quick_qml.md + qt-quick-qml` — независимые UI-профили. `qt_testing.md + qt-testing` требует и `cpp-testing`, и `qt-core`. Проверяйте полное замыкание hard dependencies через `material_dependencies.md`.
- VS Code — целевая IDE; активный диагностический провайдер (cpptools/clangd/другой), доступный агенту LSP или CLI, CMake target/preset, генератор и набор анализаторов выбираются **при универсальной прединициализации выше**. В готовом CODEX_PROJECT.md фиксируется результат. Отсутствие прямого доступа к VS Code Problems не заменяется заявлением об идентичной CLI-диагностике.
- Clazy, Qt Documentation MCP, QML Preview MCP, GDB/LLDB/CDB, sanitizer/profiler и сторонние линтеры остаются опциональными инструментами. Не устанавливайте и не запускайте их без соответствующего проекта, toolchain и разрешённой области действия. Дополнительные Qt minor/patch или C++20+ особенности всегда проверяются по фактическому SDK и компилятору.
- Использованы идеи из официального проекта **The Qt Company**: https://github.com/TheQtCompanyRnD/agent-skills (qt-cpp-review, qt-cmake-project, qt-qml, qt-qml-review, qt-qml-test/test-run). Они проанализированы в `.agents/skills/qt-core/references/qt-company-skill-assessment.md`. Сценарии контроля перенесены в собственные reference-материалы; внешние скрипты и субагентные протоколы не копируются, поскольку должны соблюдать наш request routing, доказательное ревью и управление субагентами. Внешние материалы можно подключать отдельно при согласовании лицензии и рабочей среды.


### Исходящие HTTP-клиенты C++ и Qt 6

- `cpp_http_client.md + cpp-http-client` — отдельный профайл исходящего C++ HTTP-клиента, с обязательной активной парой `cpp_core.md + cpp-core`. Использует уже выбранную проектом библиотеку (libcurl, cpr или другую) и фактические версии/компилятор; не добавляет сетевых зависимостей автоматически.
- `qt_http_client.md + qt-http-client` — Qt Network поверх базового C++ HTTP-контракта; требует активных пар `cpp_http_client.md + cpp-http-client` и `qt_core.md + qt-core`. Для Qt по умолчанию предпочитается существующий `QNetworkAccessManager`, а не второй libcurl/cpr-стек. `QNetworkRequestFactory` и `QRestAccessManager` доступны начиная с Qt 6.7, поэтому не требуются для старых Qt 6.
- Оба профиля покрывают HTTP/1.1/2, negotiated protocol, TLS/redirect/timeout, per-operation retries с ограничением попыток и подтверждённой идемпотентностью, размер/время ответа, потоковую обработку и тестирование. Наличие поддержки HTTP/2 не доказывает фактического использования — для Qt проверяется `Http2WasUsedAttribute` ответа.
- Для SSE **не выбирается отдельная библиотека**. `cpp-http-client/references/sse-protocol.md` описывает формат `text/event-stream`, курсор `Last-Event-ID`, `retry:` и условия остановки, а `qt-http-client/references/sse-streaming.md` — чтение `QNetworkReply::readyRead()`, bounded parsing и асинхронное переподключение `QTimer`. HTTP retry и SSE reconnect независимы; SSE активируется только при задаче на потоковые события.
- Никакого нового универсального retry/cache/rate-limit framework, самостоятельного сервера, SDK, Qt extension или фонового процесса из-за активации профиля. Параметры и разрешённые команды берутся из итогового `CODEX_PROJECT.md`; первичная идентификация доступных инструментов остаётся только в универсальном разделе прединициализации выше.

## Профили C# и Unity 6.3

Профили разделяют зоны ответственности: язык C#, стиль кода, Unity runtime, инструменты Editor, тестирование и автоматизацию.

- `csharp_core.md + csharp-core` — framework-neutral C# с обязательным определением фактической language/runtime boundary до выбора синтаксиса и API.
- `csharp_style.md + csharp-style` — `.editorconfig`-first naming/formatting/IDE style policy. Existing project configuration имеет приоритет над переносимыми defaults; Unity serialized/reflected/framework contracts нельзя ломать косметическим rename.
- `unity_core.md + unity-core` — version-bounded профиль Unity 6.3 / `6000.3.x` с priority baseline `6000.3.24f1`: serialization, `UnityEngine.Object` semantics, lifecycle, Enter Play Mode/domain reload, `Awaitable`/thread affinity, assemblies и evidence-based performance.
- `unity_editor.md + unity-editor` — Editor-only overlay: `SerializedObject`/`SerializedProperty`, Undo, prefab/scene/asset authoring, AssetDatabase/importers и Editor UI/lifecycle.
- `unity_testing.md + unity-testing` — Unity Test Framework boundary selection, EditMode/PlayMode, engine-lifecycle tests, isolated scenes/assets/state cleanup; при активном `unity-cli` открытый reachable Editor валидируется через live MCP/Pipeline, а batch `unity test` остаётся для CI/headless/no-live-Editor workflows.
- `unity_cli.md + unity-cli` — независимый automation/validation overlay для официального Unity CLI. Priority baseline — `1.0.0-beta.10`; для agent-driven работы с уже открытым Editor приоритетен встроенный `unity mcp` (или эквивалентный `unity command`), а commands/options и Editor/Pipeline schemas определяются через live machine-readable discovery, а не по памяти.

Hard dependencies существуют только между repository materials. Unity Editor/CLI/package/module/runtime versions являются runtime/tool requirements и проверяются owning profile по project/runtime evidence; они не активируют rules или skills.

`unity-cli` не является hard dependency Unity runtime/Editor/testing. Проекты без CLI остаются валидными и используют свои Editor/batch/CI workflows. Vendor skills из Unity CLI/Pipeline/plugins являются optional supplemental material.

`unity mcp` не вводит отдельную модель автоматизации: он экспортирует команды подключённого Editor/Pipeline как MCP tools. Поэтому live MCP и `unity command` используют одну политику target/schema/side effects; `unity mcp configure` рассматривается отдельно как изменение локальной конфигурации agent client.

Unity CLI может одной командой затрагивать проект, локальную development environment и remote/cloud state. Поэтому `request_routing.md` содержит отдельный `local-environment-only` gate, а операция классифицируется по реальному side effect, не по имени CLI-команды.

## Профили Blender 5.2 и Blender → Unity

Профили Blender разделяют создание ассетов и автоматизацию редактора; предметные области подключаются независимо.

- `blender_core.md + blender-core` — version-bounded база Blender 5.2.x с priority baseline `5.2.2 LTS`: data-block ownership, `bpy`, context/modes, BMesh, transforms, evaluated depsgraph, Undo, save/file state. Для обычной работы в открытом Blender отдельный `pip install bpy` не требуется: `bpy` принадлежит embedded Python Blender.
- `blender_modeling.md + blender-modeling` — mesh/topology/modifiers, normals/smoothing, UV geometry, origins/transforms, high/low и source LOD workflows. Профиль требует `blender-core`.
- `blender_materials_texturing.md + blender-materials-texturing` — Images, Shader Nodes/lookdev, texture painting, baking, color spaces, normal maps, masks и channel packing. Профиль требует `blender-core`.
- `blender_rigging_animation.md + blender-rigging-animation` — Armatures, skinning/weights, constraints, IK/FK, Shape Keys, drivers, Blender 5.2 Actions/Slots, NLA и animation baking. Профиль требует `blender-core`.
- `blender_mcp.md + blender-mcp` — независимый automation overlay для официального Blender Lab MCP. Priority baseline — `1.0.3`; для уже открытого файла используется live Editor first, dedicated summary/docs/screenshot tools применяются для inspection, а сложное authoring выполняется ограниченными `execute_blender_code` вызовами через `bpy`/BMesh. Upstream `WeakSandboxForLLM` не рассматривается как security boundary.
- `blender_unity.md + blender-unity` — Blender-side integration overlay для Blender 5.2.x → Unity 6.3 / `6000.3.x`, priority baseline `5.2.2 LTS → 6000.3.24f1`: FBX/interchange, physical scale, axis conversion, meshes/normals/UV, texture/material semantics, rigs/animation/Blend Shapes, LOD и proportional import validation. Профиль требует `blender-core`, но `unity-editor`/`unity-cli` остаются optional coordination и отвечают только за Unity-owned state.

Hard dependencies существуют между repository materials, а Blender executable, embedded Python, official MCP server/add-on и Unity Editor являются runtime/tool requirements. Они проверяются owning profile по project/runtime evidence и не активируют rules/skills автоматически.

Предметные Blender-профили не требуют друг друга без необходимости. Например, modeling-only задача может активировать `blender-core + blender-modeling`, а material/bake задача — `blender-core + blender-materials-texturing`. `blender-mcp` добавляется только когда агент действительно управляет Blender через официальный MCP.

Unity-specific данные остаются на своей стороне границы: Blender отвечает за source authoring/export preparation, Unity — за ModelImporter/TextureImporter, runtime Materials/Shaders, Avatar/AnimationClip settings, Prefabs, colliders и `LODGroup`.

## Профиль TypeScript Node-RED contrib

Пакет `node_red_contrib.md + node-red-contrib-expert` предназначен только для **TypeScript-authored custom/contrib node modules Node-RED** и всегда требует `typescript_core.md + typescript-core` как базовую языковую пару.

- runtime implementation source — `.ts`; сгенерированный `.js` является Node-RED runtime artifact и не поддерживается вручную как параллельная реализация;
- JavaScript-only Node-RED modules не активируют этот профиль и требуют отдельных project-specific материалов;
- профиль не фиксирует одну текущую версию Node-RED или Node.js: применимый support range, development/test runtime, emitted module format и build output определяются из `package.json`, lockfile, CI/runtime и других project evidence;
- `package.json -> node-red.nodes` должен указывать на JavaScript artifacts, воспроизводимо собираемые из TypeScript source; runtime/editor artifact pairing сохраняется после build/package processing;
- Node-RED framework boundaries типизируются через объявленный проектом declaration source (`@types/node-red`, project declarations или другой проверенный источник), но версия declarations не считается доказательством версии или совместимости runtime;
- generic TypeScript typing/refactoring/narrowing остаётся ответственностью `typescript-core`, а Node-RED слой добавляет framework-specific типизацию `NodeAPI`, node/config/message/credential boundaries, lifecycle, `msg`/`send`/`done`, config nodes и HTTP/editor integration;
- при отставании declaration package от подтверждённого runtime API используется минимальный project-approved augmentation/workaround вместо перевода Node-RED boundary в `any`;
- reusable domain/service logic по возможности остаётся framework-neutral TypeScript;
- build pipeline разделён на компиляцию/type-check, postbuild assembly/validation и отдельную packed-package validation; postbuild не подменяет `tsc`/другой compiler, clean, tests или package/publish lifecycle;
- активный профиль требует project-owned postbuild script или явно эквивалентный project workflow; `.agents/skills/node-red-contrib-expert/scripts/node-red-postbuild.mjs` является каноническим zero-dependency asset для копирования/адаптации, но не исполняется target-проектом напрямую;
- канонический workflow использует project-local `package.json -> node-red-build` с `sourceRoot`, `outputRoot`, `editorHtml: copy|validate-only` и явными `copy` mappings; это convention skill-пакета, а не официальный Node-RED metadata field;
- canonical `--check` проверяет существование/актуальность `.js`/`.html`, явных copy mappings и path/symlink safety без записи файлов;
- clean-before-build и packed-package validation остаются отдельными объявленными политиками, а runtime bundling не вводится без конкретной причины и compatibility evidence;
- packaged subflows и отдельный Node-RED plugin API не входят в этот профиль без самостоятельных материалов.

`node_red_contrib_testing.md + node-red-contrib-testing` — отдельный TypeScript testing overlay для поведения, зависящего от Node-RED test runtime и `node-red-node-test-helper`.

- Node-RED runtime/component tests и reusable flow fixtures пишутся на TypeScript; handwritten `.js`-копии тех же тестов не поддерживаются;
- overlay требует активный базовый TypeScript Node-RED contrib profile и использует helper для flow wiring, messages, config nodes, credentials, runtime lifecycle, registered HTTP routes и redeploy behavior;
- `@types/node-red-node-test-helper` или другой declaration source рассматривается только как static typing layer и не как helper/runtime compatibility evidence;
- Jest/Vitest/Mocha configuration, generic mocks, framework-neutral TypeScript unit tests и coverage остаются в runner/language-specific testing policy и не повторяются в Node-RED skill;
- реальные editor DOM/widgets требуют отдельного browser/UI overlay;
- packed module в отдельном Node-RED process и сценарии с реальными брокерами, БД или внешними API относятся к отдельному E2E/integration boundary;
- helper/runtime/runner API выбирается по фактически объявленным версиям, а cleanup обязан выгружать flows и останавливать helper server, если тест его запускал.

Typed runtime patterns, build/artifact workflow, canonical postbuild asset policy, Node-RED declaration policy, packaging/resources, runtime-test patterns, cleanup boundaries, review checklists и curated sources находятся в `.agents/skills/node-red-contrib-expert/` и `.agents/skills/node-red-contrib-testing/`.

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

## Go: язык, тестирование, HTTP API, БД и кэширование

Go представлен независимыми профилями, активируемыми только через `CODEX_PROJECT.md`:

- `go_core.md + go-core` — базовый экспертный профиль идиоматичного Go: структуры и методы, ООП через композицию, интерфейсы и method sets, zero-value, конструкторы, API/packages, ошибки и контекст, память и конкурентность, производительность, современные версии Go и критический code review. Предметные ссылки выбираются по задаче из `go-core/references/`, с полноценными Good/Bad-примерами, условиями применимости и критериями проверки. `memory-and-resource-leaks.md` отдельно описывает утечки goroutine и ресурсов, удержание Go heap, диагностику `pprof` и различия Go heap/RSS/CGO. `gopls-language-server.md` задаёт работу с семантическим поиском и диагностикой Go через существующие MCP/LSP/CLI-инструменты без привязки к IDE.
- `go_testing.md + go-testing` — стандартный пакет `testing`, table-driven тесты, `httptest`, интеграционное/E2E-тестирование, `-race`, контроль statement coverage (рекомендуемый минимум **85%**, задаётся в `CODEX_PROJECT.md` с явными исключениями), fuzzing, `testing/synctest` для Go 1.25+ и изоляция окружения. `leak-regression.md` описывает проверки отмены, завершения, повторных запусков и освобождения ресурсов; `go.uber.org/goleak` не устанавливается автоматически.
- `go_huma_v2.md + go-huma-v2` — Huma v2, проверка минимальной версии Go, router adapters, типизированные операции, входные/выходные контракты, обработка ошибок, OpenAPI 3.1/JSON Schema и контрактные тесты. Huma v2 не требует обязательного ORM.
- `go_gorm.md + go-gorm` — базовые правила GORM для репозиториев, транзакций, параметризованных запросов, ошибок, моделей и запросов; не привязан к SQLite.
- `go_gorm_sqlite_goose.md + go-gorm-sqlite-goose` — **условный** профиль для выбранной связки SQLite + GORM + Goose v3. Его выбор не происходит автоматически при активации Go/Huma/GORM.
- `go_observability.md + go-observability` — структурированные логи, корреляция, необязательные метрики и OpenTelemetry; размещение/экспорт телеметрии определяется проектом.
- `go_security.md + go-security` — применение проектной модели безопасности, проверка зависимостей и доказательных уязвимостей без навязывания внешних инфраструктурных мер.
- `go_http_client.md + go-http-client` — исходящие HTTP-клиенты стандартной библиотеки: соединения, контексты/таймауты, статусы, ограниченные ответы, опциональные обоснованные retries.

Рекомендации `go-core` разделяются на ошибки корректности/безопасности/совместимости и контекстно-зависимые предпочтения архитектуры/стиля. Для версии Go 1.27 учитывается поддержка generic methods конкретных типов, при этом в интерфейсах generic methods по-прежнему не разрешены. Старые материалы, включая некоторые разделы Go FAQ, не должны подменять release notes и спецификацию конкретной версии.

Контроль Go coverage описан в `go-testing/references/coverage-policy.md`. Новый целевой проект при включении `go-testing` задаёт в `CODEX_PROJECT.md` минимум 85% покрытых инструкций, полный пакетный scope, расположение профиля и команду проверки порога; исключения фиксируются решением владельца. Результаты покрытия и неисполненные проверки отражаются в отчётах агента, но сам репозиторий-шаблон не добавляет автоматически CI workflow для чужих проектов.

Профилирование применяется к доказанному или обоснованно подозреваемому росту памяти/ресурсов и к изменениям их жизненного цикла, а не механически к каждому исправлению. `go test -race` не обнаруживает утечки. Стабильный `goroutineleak`-профиль доступен с Go 1.27 и выявляет только часть блокировок; `/debug/pprof` требует защищённого диагностического доступа.

Go Core дополнительно содержит `service-lifecycle.md` (владение ресурсами, startup/shutdown, сигналы и health по выбору проекта), `performance-engineering.md` (профилирование, замеры, опциональный PGO) и `modules-and-build.md` (Go modules/workspaces/toolchain, сборка, CGO, build tags). Go Testing содержит `benchmark-regression.md` (повторяемость, оценка разброса и регрессии производительности). Никакие инструментальные зависимости не устанавливаются автоматически.

Языковой сервер Go описан в `go-core/references/gopls-language-server.md`: встроенный экспериментальный `gopls` MCP (detached или отдельно разрешённый attached), уже настроенный LSP или CLI `gopls check` могут предоставлять семантическую навигацию и диагностические замечания. При выборе в `CODEX_PROJECT.md` агент проверяет изменённые Go-файлы и затронутую область согласно закреплённым анализаторам и политике severity; для MCP `go_diagnostics` передаёт пути изменённых файлов для углублённого анализа. Проверка на окончательном состоянии исходников учитывается при приёмке, недоступная обязательная диагностика не считается успешной. Настройки, источники модулей и разрешения выбираются в целевом проекте; редактор, `gopls` и MCP не устанавливаются автоматически.

Интерактивная отладка Go в терминале описана в `go-core/references/runtime-debugging.md` и применяется только при необходимости и в пределах разрешённых побочных эффектов. Поддерживаются CLI `dlv debug`, `dlv test` и `dlv exec` с проверкой установленной версии Delve, совместимости Go и ввода в сохраняемую терминальную сессию. Отладчик не устанавливается автоматически, а при недоступном интерактивном вводе используются обычные тесты и логи. `deep_debugger` остаётся read-only и не запускает новые динамические эксперименты.

При использовании Goose **единственный источник истины для production-схемы — версионируемые миграции Goose**. `AutoMigrate` GORM не должен конкурировать с ними в startup, HTTP handlers или рабочих процессах. Для SQLite проверяются включение foreign keys на каждом соединении, busy timeout, опциональный WAL, транзакционные границы, конкуренция записи и миграции на заполненной БД. Важно учитывать, что обычный GORM SQLite-драйвер использует CGO, а актуальная документация CLI Goose описывает иной SQLite-драйвер; совместимость и доступные функции должны проверяться на конкретных версиях.

Для `go-observability` и `go-security` роль приложения, доверенные акторы, принятые риски, допустимость полного логирования токенов/пакетов и разрешённые получатели задаются **один раз** в общем разделе `Go Application Context And Data Disclosure Policy` файла `CODEX_PROJECT.md`. Агент применяет выбранную политику без пересмотра при каждой задаче. `full` допускает точные значения выбранных полей в логах самого приложения; передача этих данных в GitHub, агентские ответы или внешние экспортёры требует отдельной политики. Противоречие фактическому развёртыванию должно быть предъявлено владельцу, а не исправляться молча.

Чтобы использовать этот набор в целевом проекте, перечислите выбранные идентификаторы в `Active Stack Profiles`, точные пары в `Active Rules` и `Active Skills`, заполните соответствующие Go-профили из `.codex/project.template.md` и скопируйте `.codex/rules/material_dependencies.md` для проверки зависимостей. Неизвестные версии Go, Huma, GORM, SQLite и Goose нельзя подставлять по умолчанию. Отсутствие выбранного ORM не препятствует использованию Go или Huma.

Официальные источники: [Go](https://go.dev/doc/), [Go security](https://go.dev/doc/security/), [OpenTelemetry Go](https://opentelemetry.io/docs/languages/go/), [Go net/http](https://pkg.go.dev/net/http), [Huma](https://huma.rocks/), [GORM](https://gorm.io/docs/), [Goose](https://pressly.github.io/goose/), [SQLite](https://www.sqlite.org/docs.html).


### Кэширование Go: Otter v2 и NATS JetStream KV

Кэширование в Go представлено двумя независимыми профилями:

- `go_local_cache.md + go-local-cache` — локальный кэш только одного процесса на `github.com/maypok86/otter/v2`: `MaximumSize` или `MaximumWeight`, TTL, загрузка, опциональный refresh, память, владельцы ресурсов и `StopAllGoroutines`. Текущий upstream модуль требует Go 1.24+; фактическое требование определяется зафиксированной версией.
- `go_nats_kv_cache.md + go-nats-kv-cache` — распределённый кэш напрямую на `github.com/nats-io/nats.go/jetstream`: bucket ownership и ограничения, `Get/Put/Create/Update/Delete`, ревизии, TTL bucket, контролируемые watchers, отказоустойчивость и реальные тесты на изолированном JetStream. Требование Go зависит от закреплённой версии `nats.go` (актуальная основная ветка использует Go 1.26+).

Оба скилла требуют активный `go-core`. Применение `go-testing`, `go-huma-v2` и `go-gorm` зависит от конкретной задачи. Общие принципы ключей/версий/TTL/инвалидации хранятся в `go-core/references/cache-design.md`, без копирования API двух библиотек.

Данные кэша должны быть восстановимы из источника истины. Локальный Otter не синхронизирует записи между процессами; NATS KV не гарантирует строгий read-your-writes во всех топологиях. Автоматического объединения Otter + NATS в L1/L2 **нет**: оно потребует отдельного согласованного решения. В `CODEX_PROJECT.md` выбирается только нужный режим и конкретные настройки; сетевые bucket не создаются/не изменяются в рамках изменений документации или кода без отдельной авторизации.

Официальные источники: [Otter v2](https://github.com/maypok86/otter), [NATS Go](https://github.com/nats-io/nats.go), [JetStream KV](https://docs.nats.io/nats-concepts/jetstream/key-value-store).

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
5. **Разделение dependency types** — hard dependencies и optional coordination должны быть разнесены по отдельным разделам и не использовать одинаковую безусловную формулировку. Runtime/tool requirements (например, Editor, CLI, SDK, package или module version) не считаются material dependencies и проверяются owning profile отдельно.
6. **Минимум неявных предположений** — источник истины для конкретного проекта — его `CODEX_PROJECT.md` и repository metadata.
7. **Актуальность** — устаревшие rules, skills и references следует обновлять или удалять.
8. **Краткий routing description** — поле `description` в frontmatter кратко формулирует условия активации и отличительные ключевые слова. Полный перечень возможностей, workflow и ограничений остаётся в теле `SKILL.md`.
9. **README как справочник** — README описывает актуальный состав, назначение, активацию и ограничения материалов. Изменения структуры, путей и зависимостей отражаются в README в том же PR; история доработок и принятых промежуточных решений остаётся в PR или релизах.

## Версионирование

Репозиторий использует [Semantic Versioning](https://semver.org/) и Git tags вида `vX.Y.Z` как источник истины для версии. Базовая версия схемы — `v1.1.0`.

Каждый pull request в `master` должен иметь ровно один version label:

- `version:patch` — обратно совместимое исправление существующего rule, skill, profile или документации, влияющей на их корректное использование;
- `version:minor` — новый rule, skill, profile или обратно совместимое расширение существующего контракта;
- `version:major` — несовместимое изменение структуры, activation contract, имени или доступности существующего rule/skill/profile;
- `version:none` — изменения инфраструктуры или обслуживания репозитория, которые не меняют распространяемый контракт материалов.

Workflow `.github/workflows/version-label.yml` проверяет наличие допустимого единственного version label. Check `Validate version label` должен быть обязательным для merge в защищённую ветку `master`.

После merge PR workflow `.github/workflows/versioning.yml` создаёт следующий Git tag через `GregoryGost/version-tagger`. Текущая версия берётся из последнего Git tag; fallback `1.1.0` передаётся явно, так как репозиторий не содержит `package.json`. Для `version:none` новый tag не создаётся.

GitHub Releases автоматически не создаются: версией репозитория является Git tag.

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
