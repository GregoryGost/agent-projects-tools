# Unity CLI Review Checklist

- [ ] Executable is official `unity` CLI, not a third-party similarly named tool.
- [ ] Installed version was read and version-sensitive behavior matches it.
- [ ] Machine-readable command discovery was preferred.
- [ ] Target project, Editor, context, and account/environment are unambiguous.
- [ ] Project CLI configuration was read when relevant.
- [ ] Operation side effects were classified by target, not command name.
- [ ] `eval` was used only after structured alternatives were considered.
- [ ] Watchers/background jobs were not left running without explicit workflow.
- [ ] No incidental self-update/install/plugin/context/auth/MCP mutation occurred.
- [ ] Persistent mutations were verified.
