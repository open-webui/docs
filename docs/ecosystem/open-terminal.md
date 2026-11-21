---
title: "Open Terminal & Terminals"
description: "Build apps, produce reports, and run coding agents in Open WebUI. Open Terminal gives your AI a computer; Terminals gives each person or project a workspace."
sidebar_position: 2
---

# Open Terminal & Terminals

**Give your AI a computer. Get work done in chat.**

Ask for a dashboard and open a working app beside your conversation. Give your AI a spreadsheet and get back a report you can send. Bring a codebase and have it make changes, run tests, and fix what fails.

**Open Terminal** gives your AI the files, software, browser, and command line to do that work. **Terminals** makes those environments available on demand, with separate workspaces for people and projects or shared ones for collaboration. Both connect directly to Open WebUI.

**[Install Open Terminal](/features/open-terminal/setup/installation)** · **[Deploy Terminals](https://github.com/open-webui/terminals#quick-start)**

## From an Idea to Something You Can Open

> Build a small dashboard from this CSV. Let me filter by date and category, then start it so I can preview it here.

Your AI can install dependencies, write the app, start its server, and inspect the output. Open WebUI puts the files, terminal, and preview beside the conversation, so you can try the result and ask for changes where you're already working.

The same loop works for a presentation, a batch of edited images, or an analysis of thousands of rows. The scripts and deliverables are real files: inspect them, download them, and build on them. A persistent workspace lets the next task start with the work you've already done.

![Open WebUI with an Open Terminal workspace and its file browser beside the chat](/images/open-terminal-file-browser.png)

## Use the AI You Want to Work With

Connect a capable local or cloud model through Open WebUI and enable [native tool calling](/features/open-terminal/setup/connecting#8-enable-native-function-calling). Open Terminal gives it somewhere to act on your request, check its work, and try again.

Prefer **Claude Code, Codex, Cursor, or Gemini CLI**? Install and authenticate the agent in the terminal environment, then select it in Open WebUI's model picker. Its own agent software runs against your project, with streaming responses, approvals, and conversation continuation in chat. [Connect an Agent](/getting-started/quick-start/connect-an-agent) covers the supported agents and adding others through ACP.

Host the workspace on your own machine or a server and use it through your browser.

## Give Every Project a Place to Work

**Terminals** lets you create and share configured workspaces from Open WebUI. Choose the software, starting folder, and setup script once; Terminals starts the Open Terminal containers as they're needed, on Docker or Kubernetes.

For your own work, keep a personal environment across conversations, or give each saved chat its own environment so separate projects have separate files and processes.

For collaborative work, a chat-scoped environment gives authorized collaborators the same files and running environment. Someone can ask for a change and another can inspect the result, with the work and its discussion together.

For a team, prepare an analysis environment with your packages and reporting scripts, then share its template with a group. With user scope, each person gets a separate container and persistent files from that setup. Pair the terminal with a model preset's **Default terminal**, and people can select a reporting assistant that already has a place to work. You can also dedicate an environment to a model preset or share one across everyone granted access.

People get to work through Open WebUI; operators maintain the templates, access, and resource limits centrally. You can offer a useful assistant to a whole team without setting up a development environment on every laptop.

## Make Useful Work Repeatable

Build a reporting script in a personal or shared workspace, then give an Open WebUI [automation](/features/chat-conversations/chat-features/automations) that terminal and working folder. Schedule a prompt to run it against new data and summarize the results. The workspace can serve both interactive work and recurring jobs, using a model or a supported coding agent.

Terminals can stop idle environments while retaining their persisted files, then start them again on demand. Set CPU and memory limits for each template. A workspace can stay available for the next task without keeping its container running all day.

## Start with One Real Task

1. **[Install Open Terminal](/features/open-terminal/setup/installation).** Docker gives it a separate container environment; a host installation works with that machine's files and software under the operating-system user's permissions.
2. **[Connect it to Open WebUI](/features/open-terminal/setup/connecting).** Add its address and API key in the **Machines** section of **Settings > Integrations** (admin section).
3. **Select the terminal in chat and put it to work.** Choose a capable model or installed agent, bring a file or project, and ask for a result you can use.

For workspaces created on demand, **[deploy Terminals](https://github.com/open-webui/terminals#quick-start)** and create your first template from Open WebUI's **New terminal** menu. For a desktop app that connects your own computer, use [Open WebUI Tether](/ecosystem/tether).

Open Terminal is [MIT licensed](https://github.com/open-webui/open-terminal/blob/main/LICENSE) and also works with your own applications through its REST API. [Terminals](https://github.com/open-webui/terminals/blob/main/LICENSE) is free for personal, non-commercial use; commercial or organizational production use requires an [Open WebUI Enterprise License](/enterprise) with Terminals access.
