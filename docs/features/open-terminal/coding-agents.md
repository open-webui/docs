---
sidebar_position: 9
title: "Coding Agents"
---

# Coding Agents

When the selected Open Terminal lists coding agents, they show up in the model picker next to your regular models. Pick one and the agent works in the machine's workspace, using the files and tools of that environment.

Which agents and models appear depends on the Open Terminal you select. Agents the machine reports as unavailable are not listed.

Hand a whole coding task to an agent: describe a feature or a bug and it edits the project's files and runs its commands in the terminal, while you follow its work, answer its questions and approve its tool requests in the chat. Pick Claude Code, Codex or another listed agent from the model picker like any other model. Use an agent when a task needs real work on a project, and a normal model when you only want an answer.

For installation, login, and connection steps, start with [Connect an Agent](/getting-started/quick-start/connect-an-agent#quick-start-with-open-terminal).

## Supported Agents

Open Terminal starts the installed CLI through the interface below. Install and authenticate the CLI as the user running the terminal; support for an agent does not mean its executable or credentials are included in every terminal image. The `:agents` Docker image includes Codex and Claude Code.

| Agent | Interface | Executable |
| :--- | :--- | :--- |
| **Codex** | Native app-server protocol | `codex` |
| **Claude Code** | Native streaming JSON protocol | `claude` |
| **Pi** | Native RPC protocol | `pi` |
| **Cursor** | ACP | `agent` |
| **Grok** | ACP | `grok` |
| **OpenCode** | ACP | `opencode` |
| **Cline** | ACP | `cline` |
| **Gemini CLI** | ACP | `gemini` |
| **Hermes** | ACP | `hermes` |
| **Antigravity** | ACP | `agy` |
| **GitHub Copilot** | ACP | `copilot` |
| **Goose** | ACP | `goose` |
| **Qwen Code** | ACP | `qwen` |

[Agent Client Protocol (ACP)](https://agentclientprotocol.com/get-started/introduction) standardizes communication between an agent and its client. These integrations use ACP v1. Open Terminal launches the agent process, while Open WebUI handles its protocol messages for chat output, tool approvals, and session continuation. The other three agents have dedicated protocol adapters.

The available models come from each CLI's discovery response. Features such as reasoning controls and session restoration depend on the agent and its version. Use versions of Open WebUI, Open Terminal, and the CLI that support the desired integration. The [Open Terminal agent reference](https://github.com/open-webui/open-terminal#coding-agents-in-chat) lists launch commands and executable overrides.

## Add Another ACP Agent

Install and configure the agent in the terminal environment first. Then set `OPEN_TERMINAL_ACP_AGENTS` on the **Open Terminal server** to a JSON object containing an ID, display name, and launch command. For example, for an installed Kiro CLI:

```bash
export OPEN_TERMINAL_ACP_AGENTS='{"kiro":{"name":"Kiro","command":"kiro-cli acp"}}'
```

Pass the same variable through your container environment if using Docker. Restart Open Terminal to load it, then select the machine in Open WebUI. Discovered models appear as `acp-kiro/<model>`.

The command must start an ACP v1 agent over standard input/output. It runs with the terminal user's files, environment, and credentials. This setting registers the command; it does not install the agent or complete interactive login. The agent must successfully report models during discovery to appear in the picker.

## Picking an Agent

Select a machine in the chat, then open the model picker. Each agent model is named `<agent>/<model>`.

- **One agent per conversation.** Add only one agent model to a chat. Agents cannot be combined with other models in a multi-model chat.
- **Regenerate, edit and fork.** You can regenerate a reply, edit an earlier message, and fork or clone the chat. Codex and Claude Code continue their own conversation from that point. Claude Code needs an up-to-date [Open Terminal](/features/open-terminal/setup/updating) for it and Codex needs an up-to-date Codex CLI on the terminal. Other agents start over from the chat so far. File changes the agent already made stay in the terminal.
- **Missing agents.** When the machine or its agent model is unavailable, the agent is removed from the selection and the default model is used.
- **Saved chats only.** Agent conversations need a saved chat, so they are not available in temporary chats.

## Reading the Steps

Agent steps and the terminal tool calls of regular models show as readable cards, such as a command with its output or a diff per edited file.

## Model IDs

An agent model ID uses only letters, digits, dashes and underscores. A model name with other characters, such as dots, has them replaced by dashes plus a short suffix. Pins, default models and [automations](/features/chat-conversations/chat-features/automations#running-a-coding-agent) store this ID.

## Options

If the agent offers them for the selected model, **Reasoning effort** and **Service tier** appear in the model controls menu of the message input. Your choice is saved to your settings.

The **Reasoning Effort** advanced parameter, set in the chat controls or the model's advanced parameters, also reaches the agent when you set it yourself. A value from a custom parameter named `reasoningEffort` or `reasoning_effort` is read the same way. Claude Code receives it as its effort level and Pi as its thinking level. Codex receives it as the effort of the turn. Every other agent receives it as the thought level the agent offers for the model. When an agent does not offer the chosen level for the selected model, the reply fails with **Agent does not support the selected reasoning effort for this model**. Pick another level or clear the parameter.

## Working With an Agent

- **Attachments.** Files you attach are uploaded to the machine, and the agent is told their paths. Images (PNG, JPEG, GIF and WebP) are also sent to the agent itself, up to 10 MB per message in total.
- **Workspace.** A new conversation starts in the machine's current working directory. An existing agent conversation keeps its workspace, even if you browse to other folders in the [file browser](./file-browser.md).
- **Tool requests.** When the agent wants to run a tool, the request appears in the chat and follows the [tool permission mode](/features/extensibility/plugin/tools#tool-approval). In **Auto** (offered when [`ENABLE_TOOL_PERMISSIONS`](/reference/env-configuration#enable_tool_permissions) and [`ENABLE_TOOL_PERMISSIONS_AUTO`](/reference/env-configuration#enable_tool_permissions_auto) are on), Codex uses its own reviewer and passes on only what it escalates. Claude Code and Grok do the same in agent versions that support it. Escalated actions still go through Open WebUI's approval checks. Other ACP agents keep asking for approval in **Auto** unless an administrator sets the **Engine** under [Auto permissions](/features/extensibility/plugin/tools#auto).
- **Questions.** When the agent asks you a question, it appears in the chat and the agent waits for your answer. Questions are always shown, whichever permission mode is set.
- **Voice.** Agents work in [realtime voice calls](/features/chat-conversations/chat-features/voice-mode#realtime-calls) when a machine is selected.
- **Chat titles.** A new chat is titled with the first 50 characters of your first message. When a [task model](/features/administration/task-models) is set and automatic title generation is on, the generated title replaces it.
