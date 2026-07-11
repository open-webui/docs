---
title: "Computer, Open WebUI, or Open Terminal?"
sidebar_position: 14
---

# Computer, Open WebUI, or Open Terminal?

Three tools, three different centers of gravity. Pick by where the work lives, and combine them freely; they're built to.

| | **Open WebUI** | **Open Terminal** | **Open WebUI Computer** |
| --- | --- | --- | --- |
| Center of gravity | The conversation | A clean execution environment | Your actual machine |
| Best for | Model choice, knowledge, prompts, shared AI workflows | Self-contained jobs: analyze an upload, build a prototype, run a script | The project, terminal, services, and logins already on one computer |
| Environment | n/a | Fresh, isolated (Docker) or host | The real host: existing files, state, tools |
| Users | One to many | Follows Open WebUI | One trusted owner |
| AI required | Yes | Yes | No; files, terminal, and git work without it |

**Start in Open WebUI** when the important context is the conversation or connected knowledge, with no particular machine required.

**Add [Open Terminal](/features/open-terminal)** when a chat needs a place to execute: write files, install packages, run code, return the result. Fresh environment per job; nothing to keep.

**Start in Computer** when the answer begins with "let me check my computer": the branch you left dirty, the dev server that's running, the folder of PDFs, the agent mid-task. Computer opens that same machine from any browser instead of recreating the work somewhere else.

## Using them together

- **Open WebUI as the front door, Computer as the hands.** Connect the [gateway](/ecosystem/computer/automate/open-webui) and each Computer workspace shows up in Open WebUI's model picker as `cptr/<workspace>`. The chat happens in Open WebUI; the file edits, commands, and tools happen on the Computer host. Knowledge bases, prompts, and users don't transfer between the two, so configure what the workspace needs on the Computer side.
- **All three at once** is normal: Open WebUI to think and organize, Open Terminal for disposable execution, Computer for the machine where your ongoing work must stay continuous.

## Already using a coding-agent CLI?

Computer doesn't replace it. Run any agent CLI in a [terminal tab](/ecosystem/computer/workspace/terminals) exactly as you do today. Or, for Codex, Claude Code, Cursor, Grok, OpenCode, Cline, and Pi, [add it as a native backend](/ecosystem/computer/ai/coding-agents) so it becomes a chat model with streaming, approvals, and session resume, using the subscription and login you already have.

One trust note: Open Terminal can be an isolated sandbox; Computer deliberately is not. It's your real machine, and that's the point. See the [security model](/ecosystem/computer/phone-and-remote/security).
