---
sidebar_position: 9
title: "Coding Agents"
---

# Coding Agents

When the selected Open Terminal lists coding agents, they show up in the model picker next to your regular models. Pick one and the agent works in the terminal's workspace, using the files and tools of that environment. Open WebUI runs Claude Code, Codex, Cursor, Grok, OpenCode, Cline, Gemini CLI, Pi, Hermes, Antigravity, GitHub Copilot, Goose and Qwen Code. Hermes, Antigravity, GitHub Copilot, Goose and Qwen Code need Open Terminal 0.17.19 or later.

Which agents and models appear depends on the Open Terminal you select. Agents the terminal reports as unavailable are not listed. Install each agent and sign it in (or set up its model provider) as the user that runs Open Terminal.

Hand a whole coding task to an agent: describe a feature or a bug and it edits the project's files and runs its commands in the terminal, while you follow its work, answer its questions and approve its tool requests in the chat. Pick Claude Code, Codex or another listed agent from the model picker like any other model. Use an agent when a task needs real work on a project, and a normal model when you only want an answer.

## Adding Other Agents

Other ACP-compatible agents, for example Factory Droid or Kiro, can be added without any code change. Set `OPEN_TERMINAL_ACP_AGENTS` in Open Terminal's environment to a JSON object with a name and launch command per agent, then restart Open Terminal. The agents show up in Open WebUI as coding agents.

```bash
OPEN_TERMINAL_ACP_AGENTS='{"droid": {"name": "Factory Droid", "command": "droid exec --output-format acp-daemon"}, "kiro": {"name": "Kiro", "command": "kiro-cli acp"}}'
```

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

The **Reasoning Effort** advanced parameter, set in the chat controls or the model's advanced parameters, also reaches the agent when you set it yourself. A value from a custom parameter named `reasoningEffort` or `reasoning_effort` is read the same way. Claude Code receives it as its effort level and Pi as its thinking level. Codex receives it as the effort of the turn. Every other agent receives it as the thought level the agent offers for the model. When an agent does not offer the chosen level for the selected model, the reply fails with **Agent does not support the selected reasoning effort for this model**. Pick another level or clear the parameter.

## Working With an Agent

- **Attachments.** Files you attach are uploaded to the terminal, and the agent is told their paths.
- **Workspace.** A new conversation starts in the terminal's current working directory. An existing agent conversation keeps its workspace, even if you browse to other folders in the [file browser](./file-browser.md).
- **Tool requests.** When the agent wants to run a tool, the request appears in the chat and follows the [tool permission mode](/features/extensibility/plugin/tools#tool-approval). In **Auto** (offered when [`ENABLE_TOOL_PERMISSIONS`](/reference/env-configuration#enable_tool_permissions) and [`ENABLE_TOOL_PERMISSIONS_AUTO`](/reference/env-configuration#enable_tool_permissions_auto) are on), Codex uses its own reviewer and passes on only what it escalates. Claude Code and Grok do the same in agent versions that support it. Escalated actions still go through Open WebUI's approval checks. Other ACP agents keep asking for approval in **Auto** unless an administrator sets the **Engine** under [Auto permissions](/features/extensibility/plugin/tools#auto).
- **Questions.** When the agent asks you a question, it appears in the chat and the agent waits for your answer. Questions are always shown, whichever permission mode is set.
- **Voice.** Agents work in [realtime voice calls](/features/chat-conversations/chat-features/voice-mode#realtime-calls) when a terminal is selected.
- **Chat titles.** A new chat is titled with the first 50 characters of your first message. When a [task model](/features/administration/task-models) is set and automatic title generation is on, the generated title replaces it.
