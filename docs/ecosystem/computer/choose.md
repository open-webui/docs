---
title: "Computer, Open WebUI, or Open Terminal?"
sidebar_position: 14
---

# Computer, Open WebUI, or Open Terminal?

Three tools, three different centers of gravity. Pick by where the work lives, and combine them freely; they're built to.

| | **Open WebUI** | **Open Terminal** | **Open WebUI Computer** |
| --- | --- | --- | --- |
| Center of gravity | The conversation and control layer | The action layer that completes the harness | Your actual machine |
| Best for | Model choice, knowledge, prompts, users, permissions, shared AI workflows | Self-contained agent work: analyze an upload, build a prototype, run a script, return an artifact | The project, terminal, services, and logins already on one computer |
| Environment | n/a | Fresh, isolated (Docker) or host | The real host: existing files, state, tools |
| Users | One to many | Follows Open WebUI | One trusted owner |
| AI required | Yes | Yes | No; files, terminal, and git work without it |

**Start in Open WebUI** when the important context is the conversation or connected knowledge, with no particular machine required.

**Add [Open Terminal](/features/open-terminal)** when Open WebUI needs to become a full agent harness: write files, install packages, run code, observe output, verify work, and return the result. Fresh environment per job unless you configure persistence.

**Start in Computer** when the answer begins with "let me check my computer": the branch you left dirty, the dev server that's running, the folder of PDFs, the agent mid-task. Computer opens that same machine from any browser instead of recreating the work somewhere else.

## Using them together

- **Open WebUI plus Open Terminal as the full harness.** Open WebUI provides the control layer; Open Terminal provides the computer substrate where actions run and evidence comes back.
- **Open WebUI as the front door, Computer as the real machine.** Connect the [gateway](/ecosystem/computer/automate/open-webui) and each Computer workspace shows up in Open WebUI's model picker as `cptr/<workspace>`. The chat happens in Open WebUI; the file edits, commands, and tools happen on the Computer host. Knowledge bases, prompts, and users don't transfer between the two, so configure what the workspace needs on the Computer side.
- **All three at once** is normal: Open WebUI to govern the workflow, Open Terminal for disposable harness execution, Computer for the machine where ongoing work must stay continuous.

## Already using a coding-agent CLI?

Computer doesn't replace it. Run any agent CLI in a [terminal tab](/ecosystem/computer/workspace/terminals) exactly as you do today. Or, for Codex, Claude Code, Cursor, Grok, OpenCode, Cline, and Pi, [add it as a native backend](/ecosystem/computer/ai/coding-agents) so it becomes a chat model with streaming, approvals, and session resume, using the subscription and login you already have.

One trust note: Open Terminal gives Open WebUI agents a disposable or policy-managed action workspace. Computer serves a machine you own, and you choose its boundary: run it bare for the whole workstation, or [in Docker](/ecosystem/computer/install/docker) so it sees only the folders you mount. Either way, everyone you let sign in shares that boundary; see the [security model](/ecosystem/computer/phone-and-remote/security).
