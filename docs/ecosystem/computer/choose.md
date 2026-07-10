---
title: "Open WebUI, Open Terminal, Computer, or a combination?"
sidebar_position: 2
---

# Open WebUI, Open Terminal, Computer, or a combination?

These tools can work together. The useful question is not which one has the longest feature list. It is whether you want to work through a conversation, an Open WebUI terminal connection, or a workspace that is organized around your personal machine.

## Start in Open WebUI when the work begins as a conversation

Choose Open WebUI for model choice, knowledge, prompts, shared AI workflows, and conversations where the important context is already in the chat or connected knowledge sources. It works well for one person and grows naturally into shared workflows.

Stop here when the task does not need a shell, files, or another computer connection.

## Add Open Terminal when a chat needs a terminal and files

Open WebUI can connect to an Open Terminal server. The chat gets an interactive terminal, file browser, editor, uploads and downloads, running-process output, and local-port previews. The model can use the same environment as an always-on tool while you work in the chat.

That environment can take several forms:

- **Docker:** a container with its own toolchain. Its files can persist when the server uses a volume.
- **Bare metal:** the terminal runs on a real machine and can start in an existing project directory.
- **Per-user containers:** the Terminals service can provision a separate configured container for each Open WebUI user.

Choose Open Terminal when you want Open WebUI's chat and file experience to drive a configured terminal environment. It can be a long-lived project environment, not only a temporary scratch space.

[Learn about Open Terminal](/features/open-terminal)

## Start in Open WebUI Computer when you want to operate the machine as a workspace

Computer also gives you a terminal, files, previews, and agent work. Its distinct shape is the workspace itself: a chosen path on the host, with its file browser location, tabs, split layout, chats, Git status and diffs, browser tabs, terminals, and local previews kept together.

Choose Computer when you want to personally return to that workspace from another browser, inspect its real state, and direct work there. It is especially strong for a personal machine with a project, local service, Git history, browser state, or supported coding agent already in motion.

Computer saves workspace layout and chats. Live terminals, browser sessions, and running processes still depend on the host and Computer server remaining available.

[Try Computer locally](./getting-started/local-trial)

## Use Open WebUI and Computer together when a conversation needs a Computer workspace

Keep Open WebUI as the conversation interface you prefer. Connect Computer's gateway when a particular Computer workspace should receive the work.

In that request:

- Open WebUI owns the conversation and interface.
- The selected Computer workspace model selects a registered Computer workspace.
- Computer resolves its configured model or agent and runs the workspace task.

Open WebUI knowledge bases, model-agent tools, system prompts, users, and general configuration are not automatically imported into Computer.

[Connect Open WebUI to a Computer workspace](./integrations/open-webui-gateway)

## Use all three when each serves a clear role

You can use Open WebUI with an Open Terminal connection for chat-driven terminal work, and connect Open WebUI to Computer when you need Computer's personal workspace surface. They are separate services with their own chats, sessions, and stored state. Giving both access to the same host directory does not automatically merge their files, terminals, or conversations.

## A quick way to decide

- Need to think, compare models, or use shared AI knowledge? Start in Open WebUI.
- Need an Open WebUI chat to work through a terminal and file environment? Add Open Terminal.
- Need a browser workspace for personally operating a chosen machine and its project state? Start in Computer.
- Need an Open WebUI conversation to send work into a registered Computer workspace? Connect Open WebUI to Computer.

## If you already use an agent command-line tool

Computer can give an installed agent command a real terminal in the selected workspace. A command-line tool becomes a selectable native Computer backend only when it is listed in [supported coding-agent backends](./reference/agent-compatibility). The [compatibility guide](./reference/agent-compatibility) explains the current supported paths without asking you to switch tools.

## Keep the trust model in view

Docker creates a useful container boundary, but mounts and access to a host Docker socket change what that environment can reach. Bare-metal Open Terminal runs with the permissions of its host account. Computer deliberately exposes the host account's files, shell, and processes to an authenticated user. Read [Open Terminal security](/features/open-terminal/advanced/security) and [the Computer security model](./remote-access/security-model) before exposing either service or connecting unattended integrations.
