# agent-projects-tools

`agent-projects-tools` — единое хранилище переносимых правил, скилов и reference-материалов для AI-агентов, используемых в разных проектах.

Текущий целевой агент: Codex.

## Назначение

Репозиторий нужен, чтобы хранить в одном месте проектно-независимые материалы для AI-агентов:

1. правила поведения и работы агента;
2. скилы, которые можно переиспользовать между проектами;
3. шаблоны проектного профиля;
4. reference-материалы для повторяемых workflow.

Материалы из этого репозитория должны быть переносимыми: их можно копировать, подключать или адаптировать в других проектах без привязки к исходному коду конкретного проекта.

## Состав репозитория

Основные элементы:

```text
.
├── AGENTS.md
├── LICENSE
├── README.md
├── .codex/
│   └── rules/
└── .agents/
    └── skills/
```

Назначение основных элементов:

- `AGENTS.md` — короткий bootstrap-файл для агента. Он указывает, что перед работой нужно читать `CODEX_PROJECT.md`, затем применять только релевантные правила из `.codex/rules/` и скилы из `.agents/skills/`.
- `LICENSE` — текст лицензии MIT.
- `.codex/rules/` — переносимые правила Codex и шаблоны проектной конфигурации, включая шаблон `CODEX_PROJECT.md`.
- `.agents/skills/` — переиспользуемые skill-пакеты для AI-агентов. Состав этой директории может расширяться по мере добавления новых переносимых скилов.

## Как использовать в другом проекте

Базовый сценарий:

1. Скопируйте или подключите `AGENTS.md` в целевой проект.
2. Создайте в целевом проекте `CODEX_PROJECT.md` на основе шаблона из `.codex/rules/`.
3. В `CODEX_PROJECT.md` явно укажите активные stack profiles, правила, скилы, команды проверки, dependency policy и внешние системы.
4. Перенесите только те файлы из `.codex/rules/` и `.agents/skills/`, которые соответствуют активным профилям целевого проекта.
5. Не активируйте языковые, framework-, database-, cache-, HTTP-client- или external-system-правила без явного указания в `CODEX_PROJECT.md` либо без прямой необходимости по задаче.

## Покрытие языков, фреймворков и внешних систем

Покрытие в этом разделе означает, что для области есть правила, скилы или специальные ограничения в `.codex/rules/` и `.agents/skills/`. Если область не указана в таблице, README не утверждает, что она покрыта.

| Область | Что покрыто | Официальные источники |
| --- | --- | --- |
| Python backend/API | Python, FastAPI, Pydantic, SQLAlchemy | [Python](https://docs.python.org/3/), [FastAPI](https://fastapi.tiangolo.com/), [Pydantic](https://docs.pydantic.dev/), [SQLAlchemy](https://docs.sqlalchemy.org/) |
| TypeScript core | TypeScript, TypeScript ESLint workflows | [TypeScript](https://www.typescriptlang.org/docs/), [typescript-eslint](https://typescript-eslint.io/getting-started/) |
| Vue frontend | Vue 3, SFC, Composition API, TypeScript in Vue, Vite | [Vue](https://vuejs.org/guide/introduction.html), [Vue TypeScript](https://vuejs.org/guide/typescript/overview.html), [Vite](https://vite.dev/guide/) |
| Vue ecosystem overlays | Vue Router, Pinia, VueUse | [Vue Router](https://router.vuejs.org/), [Pinia](https://pinia.vuejs.org/), [VueUse](https://vueuse.org/guide/) |
| Frontend styling | Tailwind CSS, Sass/SCSS | [Tailwind CSS](https://tailwindcss.com/docs), [Sass](https://sass-lang.com/documentation/) |
| Frontend code quality | ESLint, eslint-plugin-vue, Prettier, Tailwind class sorting, Vue SFC type checking | [ESLint](https://eslint.org/docs/latest/use/getting-started), [eslint-plugin-vue](https://eslint.vuejs.org/user-guide/), [Prettier](https://prettier.io/docs/install), [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss), [Vue TypeScript](https://vuejs.org/guide/typescript/overview.html) |
| Playwright UI validation | Playwright MCP/browser UI checks | [Playwright](https://playwright.dev/docs/intro), [MCP](https://modelcontextprotocol.io/) |
| Obsidian knowledge/task workflows | Obsidian, Model Context Protocol, Context7, Obsidian Tasks, Templater, Dataview, Bases | [Obsidian](https://obsidian.md/), [MCP](https://modelcontextprotocol.io/), [Context7](https://context7.com/), [Obsidian Tasks](https://publish.obsidian.md/tasks/Introduction), [Templater](https://silentvoid13.github.io/Templater/), [Dataview](https://blacksmithgu.github.io/obsidian-dataview/), [Bases](https://help.obsidian.md/bases) |

Новые языки, фреймворки, внешние приложения, плагины и системы должны добавляться в эту таблицу вместе с правилами или скилами, которые их покрывают.

## Правила работы с Obsidian-материалами

Obsidian-related правила и скилы требуют MCP-only подхода:

- операции чтения, поиска, создания, обновления, перемещения, архивирования и проверки Obsidian vault выполняются через подключённый MCP;
- `raw/`, `wiki/`, `tasks/` и `archive/` считаются логическими путями Obsidian vault, а не путями файловой системы репозитория;
- запрещено обходить MCP через shell-команды, скрипты, прямое чтение файлов, editor search или Git-операции по vault-содержимому;
- перед изменением существующей заметки её нужно прочитать через MCP, изменить минимально безопасной операцией и затем перечитать для проверки результата;
- full-file replacement допустим только для явной замены всего файла или осознанной регенерации всего содержимого.

## Принципы ведения материалов

При добавлении новых правил и скилов рекомендуется соблюдать следующие принципы:

1. **Переносимость** — материал не должен зависеть от внутренней структуры одного конкретного проекта, если это не указано явно.
2. **Ясная область применения** — должно быть понятно, для какого агента, языка, фреймворка, внешней системы и сценария предназначен материал.
3. **Явные внешние зависимости** — требования к внешним приложениям, плагинам, MCP-серверам, языкам, фреймворкам и библиотекам нужно описывать рядом с правилом или скилом.
4. **Минимум неявных предположений** — нельзя выводить активный стек или внешнюю систему из названий файлов; источник истины для целевого проекта — `CODEX_PROJECT.md`.
5. **Актуальность** — устаревшие правила, скилы и reference-материалы следует обновлять или удалять.

## Участие в разработке

Для изменения репозитория:

1. создайте ветку от актуальной `master`;
2. добавьте или обновите правила, скилы либо документацию;
3. проверьте, что README, `AGENTS.md`, правила и скилы не противоречат друг другу;
4. явно опишите новые внешние зависимости или изменения в существующих внешних зависимостях;
5. откройте pull request с кратким описанием назначения изменений.

## Лицензия

Проект распространяется по лицензии MIT. См. файл `LICENSE`.
