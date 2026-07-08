# full-stack-gallore Wiki: LLM Memory Vault

Mode: B (Repository / Architecture) + session memory
Purpose: Cross-session memory for the full-stack-gallore study app — design decisions, architecture, progress, and session notes.
Owner: paolo
Created: 2026-07-07

## Structure

```
wiki/
├── index.md            # master catalog of all pages
├── log.md              # append-only chronological record (newest on top)
├── hot.md              # ~500-word recent-context cache
├── overview.md         # executive summary of the project
├── decisions/          # architecture decision records (ADRs)
├── modules/            # notes on major parts (client, server, showcase, content)
├── concepts/           # frontend-interview concepts the app teaches
├── sessions/           # per-session working notes
└── meta/               # conventions, dashboards
```

## Conventions

- All notes use YAML frontmatter: `type, status, created, updated, tags` (minimum).
- Wikilinks use `[[Note Name]]` format — filenames are unique, no paths needed.
- `wiki/index.md` is the master catalog — update when adding pages.
- `wiki/log.md` is append-only — new entries at the TOP, never edit past entries.
- `wiki/hot.md` is a cache — overwrite completely each update, keep under 500 words.

## Operations

- **Save a session / decision**: use `claude-obsidian:save` or append to `sessions/` + `log.md`.
- **Recall**: read `hot.md` first, then `index.md`, then drill into the relevant page.
- **Lint**: say "lint the wiki" for a health check.

## How this vault is used by the project

The project root `../CLAUDE.md` points here for cross-session memory. Read `hot.md` at the start
of a session to recover context; update `hot.md`, `log.md`, and a `sessions/` note at the end.
