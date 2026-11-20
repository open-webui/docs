---
sidebar_position: 9
title: "Agents"
---

# Agents

When the selected Open Terminal lists agents, they show up in the model picker next to your regular models. Pick one and the agent works in the terminal's workspace, using the files and tools of that environment.

Which agents and models appear depends on the Open Terminal you select. Agents the terminal reports as unavailable are not listed.

Ask an agent to summarize project files, prepare a report, or fix a bug and run the tests. You can follow its work, answer questions, and review tool requests in chat.

For installation, login, and connection steps, start with [Connect an Agent](/getting-started/quick-start/connect-an-agent#quick-start-with-open-terminal).

## Supported Agents

Open Terminal starts the installed CLI through the interface below. Install and authenticate the CLI as the user running the terminal; support for an agent does not mean its executable or credentials are included in every terminal image. The `:agents` Docker image includes Codex and Claude Code.

| Agent | Interface | Executable |
| :--- | :--- | :--- |
| [Codex](/getting-started/quick-start/connect-an-agent/codex-cli) | Native app-server protocol | `codex` |
| [Claude Code](/getting-started/quick-start/connect-an-agent/claude-code) | Native streaming JSON protocol | `claude` |
| [Pi](/getting-started/quick-start/connect-an-agent/pi) | Native RPC protocol | `pi` |
| [Cursor](/getting-started/quick-start/connect-an-agent/cursor-cli) | ACP | `agent` |
| [Grok](/getting-started/quick-start/connect-an-agent/grok-build) | ACP | `grok` |
| [OpenCode](/getting-started/quick-start/connect-an-agent/opencode) | ACP | `opencode` |
| [Cline](/getting-started/quick-start/connect-an-agent/cline) | ACP | `cline` |
| [Gemini CLI](/getting-started/quick-start/connect-an-agent/gemini-cli) | ACP | `gemini` |
| [Hermes](/getting-started/quick-start/connect-an-agent/hermes-agent) | ACP | `hermes` |
| [Antigravity](/getting-started/quick-start/connect-an-agent/antigravity) | ACP | `agy` |
| [GitHub Copilot](/getting-started/quick-start/connect-an-agent/github-copilot) | ACP | `copilot` |
| [Goose](/getting-started/quick-start/connect-an-agent/goose) | ACP | `goose` |
| [Qwen Code](/getting-started/quick-start/connect-an-agent/qwen-code) | ACP | `qwen` |

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
- **Regenerate, edit, or fork.** Since Open WebUI 0.13.4, you can regenerate a reply, edit an earlier message, and fork or clone an agent chat. Codex can resume at the selected turn with an up-to-date Codex CLI. Claude Code needs an up-to-date [Open Terminal](/features/open-terminal/setup/updating) to do the same. Other agents start a new session with the chat history up to that point. File changes stay in the workspace. [Version requirements](https://github.com/open-webui/open-webui/releases/tag/v0.13.4)
- **Missing agents.** When the terminal or its agent model is unavailable, the agent is removed from the selection and the default model is used.
- **Saved chats only.** Agent conversations need a saved chat, so they are not available in temporary chats.

## Reading the Steps

Agent steps and the terminal tool calls of regular models show as readable cards, such as a command with its output or a diff per edited file.

## Model IDs

An agent model ID uses only letters, digits, dashes and underscores. A model name with other characters, such as dots, has them replaced by dashes plus a short suffix. Pins, default models and [automations](/features/chat-conversations/chat-features/automations#running-a-coding-agent) store this ID.

## Options

If the agent offers them for the selected model, **Reasoning effort** and **Service tier** appear in the model controls menu of the message input. Your choice is saved to your settings.

The **Reasoning Effort** advanced parameter, set in the chat controls or the model's advanced parameters, also reaches the agent when you set it yourself. A value from a custom parameter named `reasoningEffort` or `reasoning_effort` is read the same way. Claude Code receives it as its effort level and Pi as its thinking level. Codex receives it as the effort of the turn. Every other agent receives it as the thought level the agent offers for the model. When an agent does not offer the chosen level for the selected model, the reply fails with **Agent does not support the selected reasoning effort for this model**. Pick another level or clear the parameter.

## Working With an Agent

- **Attachments.** Files you attach are uploaded to the terminal, and the agent is told their paths.
- **Workspace.** A new conversation starts in the folder selected under **Choose working directory** in the message input. An existing agent conversation keeps its workspace, even if you browse to other folders in the [file browser](./file-browser.md).
- **Tool requests.** When the agent wants to run a tool, the request appears in the chat and follows the [tool permission mode](/features/extensibility/plugin/tools#tool-approval). In **Auto** (offered when [`ENABLE_TOOL_PERMISSIONS`](/reference/env-configuration#enable_tool_permissions) and [`ENABLE_TOOL_PERMISSIONS_AUTO`](/reference/env-configuration#enable_tool_permissions_auto) are on), Codex uses its own reviewer and passes on only what it escalates. Claude Code and Grok do the same in agent versions that support it. Escalated actions still go through Open WebUI's approval checks. Other ACP agents keep asking for approval in **Auto** unless an administrator sets the **Engine** under [Auto permissions](/features/extensibility/plugin/tools#auto).
- **Questions.** When the agent asks you a question, it appears in the chat and the agent waits for your answer. Questions are always shown, whichever permission mode is set.
- **Voice.** Agents work in [realtime voice calls](/features/chat-conversations/chat-features/voice-mode#realtime-calls) when a terminal is selected.
- **Chat titles.** A new chat is titled with the first 50 characters of your first message. When a [task model](/features/administration/task-models) is set and automatic title generation is on, the generated title replaces it.
