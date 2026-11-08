---
title: AI in your workspace
sidebar_position: 1
---

# AI in your workspace

There are two ways to put AI in an Open WebUI Computer chat:

1. **Connect a model by API**: OpenAI, Anthropic, Ollama, OpenRouter, or any OpenAI-compatible endpoint. Add it in **Settings → Admin → Connections**. See [Connect a model](/ecosystem/computer/ai/connect-a-model).
2. **Plug in a coding agent you already subscribe to**: Codex, Claude Code, Cursor, Grok, OpenCode, Cline, or Pi run as native chat backends using the CLI login already on your machine. No API key needed. See [Use your coding agent subscription](/ecosystem/computer/ai/coding-agents).

Both show up in the same model selector and work in the same workspace chat. You can mix them: an Ollama model for quick questions, your Claude Code subscription for real work.

| | API connection | Coding agent backend |
| --- | --- | --- |
| Credentials | API key (Ollama accepts any text) | The CLI's existing login on the host (your subscription) |
| Who executes tools | Computer's built-in tools (files, commands, browser, search) | The agent's own CLI, running on your machine |
| Session resume | Chats persist per workspace and reopen anywhere | Same, plus the backend's own session is resumed automatically each turn |

## What the AI can do on your machine

Whichever route you pick, the AI works where your files actually live. It can:

- **Read and edit files** in the workspace, and search across the codebase
- **Run shell commands** and read the output, foreground or background
- **Browse the web** (navigate, click, fill forms, take screenshots) and run [web searches](/ecosystem/computer/ai/web-search-and-browsing)
- **Spin up [sub-agents](/ecosystem/computer/ai/subagents)** for parallel work
- **Run on a schedule**: recurring tasks like "run tests every morning" (see [scheduled tasks](/ecosystem/computer/automate/scheduled-tasks))

You control how much of that happens without you: see [Approvals, plan mode, and review](/ecosystem/computer/ai/approvals-and-plan-mode).

## AI is optional

Everything else in Computer (files, editor, terminal, git, remote access) works with no model configured. Add AI when you want it, not before.

## In this section

- [Connect a model (API keys and Ollama)](/ecosystem/computer/ai/connect-a-model)
- [Use your coding agent subscription](/ecosystem/computer/ai/coding-agents)
- [Approvals, plan mode, and review](/ecosystem/computer/ai/approvals-and-plan-mode)
- [Chat features](/ecosystem/computer/ai/chat-features)
- [Skills and memory](/ecosystem/computer/ai/skills-and-memory)
- [Sub-agents](/ecosystem/computer/ai/subagents)
- [Web search and browsing](/ecosystem/computer/ai/web-search-and-browsing)
- [Voice, speech, and audio](/ecosystem/computer/ai/voice-and-audio)
