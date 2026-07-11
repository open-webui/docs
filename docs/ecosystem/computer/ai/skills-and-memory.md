---
title: Skills and memory
sidebar_position: 6
---

# Skills and memory

A **skill** is a folder with a `SKILL.md` file: a reusable instruction set the AI can pull in on demand ([agentskills.io](https://agentskills.io) spec). **Memory** stores durable per-user facts across chats. And if you already keep skills or a `CLAUDE.md`/`AGENTS.md` for another tool, Computer picks them up automatically.

## Skill format

```markdown
---
name: release-checklist
description: How we cut a release in this repo
---

1. Run the full test suite...
```

Frontmatter needs `name` and `description`; the body is the instructions. Optional subdirectories: `references/`, `templates/`, `scripts/`, `assets/`. Skills load progressively: the catalog is always visible to the model, the full `SKILL.md` loads on activation, and resources load on demand.

## Where skills are discovered

| Scope | Paths |
| --- | --- |
| Workspace | `.cptr/skills`, `.agents/skills`, `.claude/skills`, `.codex/skills` |
| Global | `~/.cptr/skills`, `~/.agents/skills` |

Skills you already have for Claude Code or Codex are picked up automatically, with no copying.

## Using and managing skills

- Type **`$`** in the chat input to mention a skill; **`/`** also finds skills.
- Skills created in the UI are written to `.cptr/skills` (workspace) or `~/.cptr/skills` (global).
- The admin **Skills** page controls which skills are enabled.
- Optional **background skill review**: every N turns (default 10), the AI can propose updates to your skills based on how the work actually went.

## Memory

Memory is per-user: toggle it in **Settings**. Recalled facts are included in later chat context. Entries live under `<data-dir>/memory/users/<id>/` and can be reviewed, edited, or deleted from the Memory view. Don't put secrets in skills or memory; both end up in model context.

## System prompts

The system prompt resolves in order; the first match wins:

1. Workspace file `<workspace>/.cptr/system.md`
2. Per-model system prompt (model settings)
3. Global (the `*` model)
4. Built-in default

Prompts support `{{VAR}}` template variables: `WORKSPACE_NAME`, `WORKSPACE_PATH`, `FILE_TREE`, `INSTRUCTIONS`, `MEMORY`, `SKILLS`, `CPTR_CONTEXT`, `RUNTIME_ENV`, `HOSTNAME`, `OS`, `PLATFORM`, `ARCH`, `SHELL`, `HOME`, `CPTR_VERSION`, `DATE`, `MODEL`.

## Auto-loaded instruction files

Computer reads instruction files from the workspace root in this order (up to 32KB): **`MEMORY.md`, `AGENTS.md`, `AGENT.md`, `CLAUDE.md`**. An existing `CLAUDE.md` or `AGENTS.md` just works: the AI sees it on every turn, alongside a compact file tree (which skips `.git`, `node_modules`, `.venv`, `dist`, ...), memory, and the skills catalog.
