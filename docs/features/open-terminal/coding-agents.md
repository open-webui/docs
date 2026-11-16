---
sidebar_position: 9
title: "Coding Agents"
---

# Coding Agents

When the selected Open Terminal lists coding agents, they show up in the model picker next to your regular models. Pick one and the agent works in the terminal's workspace, using the files and tools of that environment.

Which agents and models appear depends on the Open Terminal you select. Agents the terminal reports as unavailable are not listed.

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

Pass the same variable through your container environment if using Docker. Restart Open Terminal to load it, then select the terminal in Open WebUI. Discovered models appear as `acp-kiro/<model>`.

The command must start an ACP v1 agent over standard input/output. It runs with the terminal user's files, environment, and credentials. This setting registers the command; it does not install the agent or complete interactive login. The agent must successfully report models during discovery to appear in the picker.

## Picking an Agent

Select a terminal in the chat, then open the model picker. Each agent model is named `<agent>/<model>`.

- **One agent per conversation.** Add only one agent model to a chat. Agents cannot be combined with other models in a multi-model chat.
- **New messages only.** Continue an agent conversation by sending a new message. Agent chats cannot be regenerated, continued or edited and resent, and you cannot branch from an earlier message; start a new chat instead.
- **Missing agents.** When the terminal or its agent model is unavailable, the agent is removed from the selection and the default model is used.
- **Saved chats only.** Agent conversations need a saved chat, so they are not available in temporary chats.

## Options

If the agent offers them for the selected model, **Reasoning effort** and **Service tier** appear in the model controls menu of the message input. Your choice is saved to your settings.

## Working With an Agent

- **Attachments.** Files you attach are uploaded to the terminal, and the agent is told their paths.
- **Workspace.** A new conversation starts in the terminal's current working directory. An existing agent conversation keeps its workspace, even if you browse to other folders in the [file browser](./file-browser.md).
- **Tool requests.** When the agent wants to run a tool, the request appears in the chat and follows the [tool permission mode](/features/extensibility/plugin/tools#tool-approval).
- **Questions.** When the agent asks you a question, it appears in the chat and the agent waits for your answer. Questions are always shown, whichever permission mode is set.
- **Voice.** Agents work in [realtime voice calls](/features/chat-conversations/chat-features/voice-mode#realtime-calls) when a terminal is selected.
- **Chat titles.** A new chat is titled with the first 50 characters of your first message. When a [task model](/features/administration/task-models) is set and automatic title generation is on, the generated title replaces it.
