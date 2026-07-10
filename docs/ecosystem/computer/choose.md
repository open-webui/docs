---
title: "Open WebUI, Open Terminal, Computer, or a combination?"
sidebar_position: 2
---

# Open WebUI, Open Terminal, Computer, or a combination?

Start with where the useful context lives and what kind of computer should do the work. These are complementary ways to work, not competing feature checklists.

## Start in Open WebUI when the work begins as a conversation

Choose Open WebUI for model choice, knowledge, prompts, shared AI workflows, and conversations where the important context is already in the chat or connected knowledge sources. It works well for one person and grows naturally into shared workflows.

You can stop here when the task does not need a shell, a project folder, or a particular machine.

## Add Open Terminal when a chat needs a fresh place to execute

Open Terminal is an Open WebUI feature. It gives an Open WebUI chat a computing environment where the model can write files, run commands, install packages, and return the result in the conversation.

Use it for a self-contained job: analyze an uploaded dataset, build a small prototype, run a script, or give an agent a clean environment for a task. It is especially useful when the work does not depend on an existing machine's long-lived state. Run it in Docker for an isolated execution environment. Use bare-metal access only when direct host access is intentional.

[Learn about Open Terminal](/features/open-terminal)

## Start in Open WebUI Computer when the real machine is the point

Choose Computer when the useful context is already alive on one machine: its existing project folders, documents, terminal, local service, browser session, installed tools, git state, or agent work.

Computer is a private control surface for that machine. It lets you open the same workspace from another browser, see what is actually there, and continue or direct the work without recreating it somewhere else. AI is optional.

Use it for the moments when the right answer starts with, “Let me check my computer.”

[Try Computer locally](./getting-started/local-trial)

## Use Open WebUI and Computer together when the conversation needs a real workspace

Keep Open WebUI as the conversation interface you prefer. Connect Computer's gateway when a particular workspace must be the place where a configured model or agent works.

In that request:

- Open WebUI owns the conversation and interface.
- The selected Computer workspace model identifies the real workspace.
- Computer's configured model or agent performs the workspace work.

Open WebUI knowledge bases, model-agent tools, system prompts, users, and general configuration are not forwarded into Computer automatically. Configure an equivalent capability in Computer when the workspace task needs it.

[Connect Open WebUI to a Computer workspace](./integrations/open-webui-gateway)

## Use all three when your work has more than one kind of context

This is common. Keep Open WebUI as the place to ask, compare, and organize. Use Open Terminal for a disposable or isolated execution task. Use Computer for the existing machine where your personal project, local service, or ongoing agent work must remain continuous.

The value is not forcing every job through one product. It is choosing the environment that matches the work in front of you.

## A quick way to decide

- Need to think, compare models, or use shared AI knowledge? Start in Open WebUI.
- Need an AI to run a self-contained task in an isolated environment? Add Open Terminal in Docker.
- Need the files, process, login, project, or agent that already exists on your machine? Start in Computer.
- Need an Open WebUI conversation to direct work in one existing workspace? Connect Open WebUI to Computer.

## If you already use an agent command-line tool

Computer can give an installed agent command a real terminal in the selected workspace. A command-line tool becomes a selectable native Computer backend only when it is listed in [supported coding-agent backends](./reference/agent-compatibility). The [compatibility guide](./reference/agent-compatibility) explains the current supported paths without asking you to switch tools.

## Keep the trust model in view

Open Terminal can run in an isolated Docker environment or, when you choose it, on a host. Computer deliberately reaches the real host account and its files, shell, and processes. That is what makes it useful for a trusted owner and why it should stay private. Read [the security model](./remote-access/security-model) before exposing it remotely or connecting unattended integrations.
