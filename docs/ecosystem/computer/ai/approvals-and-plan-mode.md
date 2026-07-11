---
title: Approvals, plan mode, and review
sidebar_position: 4
---

# Approvals, plan mode, and review

Every chat has a tool approval mode, set from the **+** menu in the chat input:

| Mode | What runs without asking | What still asks |
| --- | --- | --- |
| **ask** | Nothing | Every tool call |
| **auto** | Read-only tools: `read_file`, `list_directory`, `search_files`, `web_search`, `read_url`, `search_chats`, ... | Writes and commands: `write_file`, `edit_file`, `run_command`, `send_input`, `create_automation`, ... |
| **full** | Everything | Nothing |

When a call needs approval, the tool card in the chat shows inline **Allow** / **Deny** buttons. **auto** is the everyday setting: the AI can explore freely, but nothing changes on disk and no command runs until you say so.

## How native agents map the mode

Coding agent backends translate the chat mode into their own permission systems:

- **Claude Code:** full → `bypassPermissions`, auto → `acceptEdits`, ask → `default`
- **Codex:** mapped to its approval policy and sandbox
- **Cursor, Grok, Cline:** surface (or auto-answer) their own permission requests, which appear in the chat like Computer's

## Plan mode

Toggle it from the **+** menu or type `/plan`. Plan mode strips write tools: the agent researches read-only, produces a plan (it can create plan artifacts), and implementation only starts after you approve. Use it for anything unfamiliar or high-impact: you see the approach before a single file changes.

## Output editing

You can review and edit AI-generated output before it's applied: fix a path or trim a change instead of re-prompting.

## Reviewing what changed

Supervision is mostly reading the diff. After (or during) a task:

1. Open the [git panel](/ecosystem/computer/workspace/git) and read the changed paths and diff. The agent works in the real repository, so the panel shows exactly what it did.
2. If a change or a proposed command is unclear, ask in the same chat: "Don't create the migration yet. Show me the affected callers first." The agent keeps its context.
3. Approve only what you understand. Decline a destructive command and ask for an explanation or a dry run instead.
4. Commit when the diff matches what you asked for; a focused test run is cheaper than trusting the summary.

This works the same from a phone: tool cards, task progress, and the git panel are all in the same workspace view.

:::info
Unattended paths (the gateway API, messaging bots, and scheduled tasks) always run in **full** approval. Only wire them to work you'd accept without a prompt. See [scheduled tasks](/ecosystem/computer/automate/scheduled-tasks).
:::
