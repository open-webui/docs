---
sidebar_position: 9
title: "Coding Agents"
---

# Coding Agents

When the selected Open Terminal lists coding agents, they show up in the model picker next to your regular models. Pick one and the agent works in the terminal's workspace, using the files and tools of that environment. Open WebUI runs Claude Code, Codex, Cursor, Grok, OpenCode, Cline, Gemini CLI and Pi.

Which agents and models appear depends on the Open Terminal you select. Agents the terminal reports as unavailable are not listed.

## What You Can Do With It

- **Hand over a whole coding task.** Describe a feature or a bug and let the agent edit the project's files and run its commands in the terminal.
- **Stay in one place.** Follow the agent's work, answer its questions and approve its tool requests in the chat.
- **Use the agent you prefer.** Pick Claude Code, Codex or another listed agent from the model picker like any other model.

Use an agent when a task needs real work on a project, and a normal model when you only want an answer. It is for anyone who has a terminal selected that lists agents.

## Picking an Agent

Select a terminal in the chat, then open the model picker. Each agent model is named `<agent>/<model>`.

- **One agent per conversation.** Add only one agent model to a chat. Agents cannot be combined with other models in a multi-model chat.
- **New messages only.** Continue an agent conversation by sending a new message. Agent chats cannot be regenerated, continued or edited and resent, and you cannot branch from an earlier message; start a new chat instead.
- **Missing agents.** When the terminal or its agent model is unavailable, the agent is removed from the selection and the default model is used.
- **Saved chats only.** Agent conversations need a saved chat, so they are not available in temporary chats.

## Model IDs

An agent model ID uses only letters, digits, dashes and underscores. A model name with other characters, such as dots, has them replaced by dashes plus a short suffix. Pins, default models and [automations](/features/chat-conversations/chat-features/automations#running-a-coding-agent) store this ID.

## Options

If the agent offers them for the selected model, **Reasoning effort** and **Service tier** appear in the model controls menu of the message input. Your choice is saved to your settings.

## Working With an Agent

- **Attachments.** Files you attach are uploaded to the terminal, and the agent is told their paths.
- **Workspace.** A new conversation starts in the terminal's current working directory. An existing agent conversation keeps its workspace, even if you browse to other folders in the [file browser](./file-browser.md).
- **Tool requests.** When the agent wants to run a tool, the request appears in the chat and follows the [tool permission mode](/features/extensibility/plugin/tools#tool-approval).
- **Questions.** When the agent asks you a question, it appears in the chat and the agent waits for your answer. Questions are always shown, whichever permission mode is set.
- **Voice.** Agents work in [realtime voice calls](/features/chat-conversations/chat-features/voice-mode#realtime-calls) when a terminal is selected.
- **Chat titles.** A new chat is titled with the first 50 characters of your first message. When a [task model](/features/administration/task-models) is set and automatic title generation is on, the generated title replaces it.
