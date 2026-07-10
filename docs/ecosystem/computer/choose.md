---
title: "Open WebUI, Open WebUI Computer, or both?"
sidebar_position: 2
---

# Open WebUI, Open WebUI Computer, or both?

Choose the product that owns the thing you need to do—not the product with the longest feature list.

| Your starting point | Choose | Why |
| --- | --- | --- |
| “Which model, knowledge, prompt, tool, or AI workflow should I use?” | **Open WebUI** | Open WebUI is the AI interface and workflow platform, whether you use it alone or with a group. |
| “The answer is in my machine’s checkout, dirty files, terminal, local service, credentials, or agent session.” | **Open WebUI Computer** | Computer gives one owner their existing machine and workspace in a browser. AI is optional. |
| “I want Open WebUI as the familiar AI front door, but the work must happen in this particular repository.” | **Both** | This is the recommended combined workflow: the Computer gateway presents an accessible workspace as an OpenAI-compatible model to Open WebUI. |

## Jules’s choice: use both

Jules keeps her research and model selection in Open WebUI. Her Mac has the cloned docs repository, scripts, browser login, and local state that an AI must use. She connects that Computer workspace through the gateway, chooses it in Open WebUI, and asks for a narrowly scoped local task.

Use both whenever you want Open WebUI's model, knowledge, prompt, and conversation experience **and** want the answer to be grounded in a real machine. Open WebUI is the place to decide and converse; Open WebUI Computer is the place where the selected workspace, terminal, git state, and agent activity actually live.

**Verify it worked:** the workspace appears in Open WebUI's model picker; the request creates visible activity in the selected Computer workspace; a follow-up continues that same Computer chat when the documented headers are configured.

**If it did not:** verify the gateway key and `/v1` base URL, confirm the workspace is available, then add the [header template and continuity checks](./integrations/open-webui-gateway).

## Important boundary

The gateway exposes workspaces as OpenAI-compatible models. It does **not** synchronize Open WebUI chats, knowledge bases, users, or general configuration into Open WebUI Computer. The products can work together without becoming the same application.

## Shared AI space vs your personal computer

Open WebUI is built around the question, “How do I use AI well?” It is where one person or a group can work with models, knowledge, prompts, tools, and AI workflows.

Open WebUI is useful as a personal AI workspace, and its potential expands naturally when a team shares models, knowledge, and workflows. Open WebUI Computer is different by design: its full potential is personal continuity—one owner reaching the particular machine where their work is already alive.

Open WebUI Computer is built around the question, “How do I reach **my** real machine and direct work there?” It is intentionally high-trust and personal: an authenticated user can reach the host filesystem and shell. It does not provide a safe, isolated machine for each teammate.

The loose mental model is **ChatGPT versus Codex**. A chat product is where you ask, compare, and organize AI help—alone or with others. A coding-agent product works inside your project and environment. Open WebUI Computer is broader than coding, but it follows the second model: it is about doing work in the machine you already own, not moving that work into a chat surface.

**Verify the fit:** if you would be comfortable giving the person access equivalent to an SSH login on the host, Computer may fit. If you need to give many people safely separated access, choose a team-oriented, isolated platform instead.

## Choose your next guide

- Need the machine itself? [Try Open WebUI Computer locally](./getting-started/local-trial).
- Want the combined workflow? [Connect Open WebUI to a Computer workspace](./integrations/open-webui-gateway).
- Need an agent in a real repository? [Choose an AI backend](./agents/models).
