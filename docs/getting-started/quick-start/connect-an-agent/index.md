---
sidebar_position: 0
sidebar_label: "Connect an Agent"
title: "Run Claude Code, Codex, and More with Open Terminal"
description: "Connect Claude Code, Codex, Gemini CLI, or another agent to Open WebUI with Open Terminal. Find your agent, sign in, and run a task in your project."
---

# Run Claude Code, Codex, and Other Agents in Open WebUI

To use a agent in Open WebUI, select the **terminal where its CLI is installed**, then select the **agent in the model picker**. You send messages and review its work in chat. The agent reads files, runs commands, and makes edits in the terminal's workspace using its own tools and model provider.

Already have a connected terminal and a working agent CLI? [Start your first agent chat](#start-your-first-agent-chat). If you already run a Hermes or OpenClaw gateway, you can also [connect its API directly](#connect-an-existing-agent-gateway).

## Which agents does Open Terminal support?

Open Terminal has built-in integrations for the 13 agents below. The `:agents` Docker image comes with **Claude Code and Codex**. Install any other CLI you want in the same terminal environment. Each agent's name links to its setup instructions.

| Agent | CLI executable | Model picker prefix |
| :--- | :--- | :--- |
| [Claude Code](https://code.claude.com/docs/en/quickstart) | `claude` | `claude-code/` |
| [OpenAI Codex CLI](https://developers.openai.com/codex/cli/) | `codex` | `codex/` |
| [Cline CLI](https://docs.cline.bot/usage/cli-overview) | `cline` | `cline/` |
| [Cursor CLI](https://cursor.com/docs/cli/installation) | `agent` | `cursor/` |
| [Gemini CLI](https://geminicli.com/docs/get-started/installation/) | `gemini` | `gemini/` |
| [GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli) | `copilot` | `copilot/` |
| [Google Antigravity CLI](https://antigravity.google/docs/overview?tab=cli) | `agy` | `antigravity/` |
| [Goose](https://github.com/aaif-goose/goose/blob/main/documentation/docs/getting-started/installation.md) | `goose` | `goose/` |
| [Grok Build](https://docs.x.ai/build/overview) | `grok` | `grok/` |
| [Hermes Agent](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart) | `hermes` | `hermes/` |
| [OpenCode](https://opencode.ai/docs/) | `opencode` | `opencode/` |
| [Pi](https://pi.dev/) | `pi` | `pi/` |
| [Qwen Code](https://github.com/QwenLM/qwen-code) | `qwen` | `qwen/` |

Open Terminal starts each CLI when needed. Codex uses its app server, Claude Code uses streaming JSON, and Pi uses RPC. The other built-in agents use the **Agent Client Protocol (ACP)**. For another ACP v1 agent, such as **Kiro CLI** or **Factory Droid**, install and configure the CLI, register its launch command in `OPEN_TERMINAL_ACP_AGENTS`, and restart Open Terminal. [Custom ACP agent setup](/features/open-terminal/agents#add-another-acp-agent) · [Agent launch commands](https://github.com/open-webui/open-terminal#coding-agents-in-chat)

## Quick Start with Open Terminal

### 1. Choose where the agent will work

- **On your own computer.** Connect your computer with Open WebUI Tether. Install and sign in to the CLI on that computer. In chat, select it under **Terminal > Your devices**, then continue to [Start your first agent chat](#start-your-first-agent-chat). [Tether setup](/ecosystem/tether#get-started)
- **On an existing Open Terminal.** Use a shell in that environment and continue to step 2. If you change an existing container to the `:agents` image, keep its home volume. [Update Open Terminal](/features/open-terminal/setup/updating)
- **In a new Docker workspace.** For Open WebUI running directly on the same host, start the container below. If Open WebUI itself runs in Docker Compose, add the `open-terminal` service to the same Compose network using the `:agents` image. [Docker Compose and bare-metal installation](/features/open-terminal/setup/installation)

Replace `your-secret-key` with a key of your own. The volume keeps the single user's workspace, CLI settings, and file-based credentials when you replace the container. For separate users and credentials, see [team deployment](/features/open-terminal/advanced/multi-user).

```bash
docker run -d \
  --name open-terminal \
  --restart unless-stopped \
  -p 127.0.0.1:8000:8000 \
  -v open-terminal:/home/user \
  -e OPEN_TERMINAL_API_KEY=your-secret-key \
  ghcr.io/open-webui/open-terminal:agents
```

### 2. Sign in to the agent inside the terminal

For the Docker example, open a shell as the terminal user.

```bash
docker exec -it open-terminal bash
```

For **Codex**, run `codex login --device-auth` if your account allows device login, then start `codex`. For **Claude Code**, run `claude` and follow its login prompts. For another agent, follow its setup link above. Ask the CLI a short question and confirm it answers in this shell. Exit the interactive CLI when you're done. [Agent authentication and API-key options](https://github.com/open-webui/open-terminal/blob/main/docs/deployment.md#coding-agents)

### 3. Connect the terminal to Open WebUI

As an admin, open **Settings > Admin > Integrations**. Under **Open Terminal**, click **+**, give the connection a name, and enter the URL the **Open WebUI server** can reach. Use `http://127.0.0.1:8000` for the host setup above, or `http://open-terminal:8000` for a Compose service named `open-terminal` on the same network.

Choose **Bearer** and enter your **Open Terminal API key**. Save and enable the connection. This key gives Open WebUI access to the workspace. The CLI uses the provider login from step 2 to generate replies. [Connection settings and access grants](/features/open-terminal/setup/connecting)

### Start your first agent chat

Use a project that already exists in the terminal workspace. If you started with an empty container, run these commands in its shell to make a small project you can check from chat.

```bash
mkdir -p ~/agent-demo
printf '%s\n' '# Field Notes' 'Run the project with: python -m http.server 8080' > ~/agent-demo/README.md
```

1. Open **New Chat** with **Temporary Chat** off. In the message input, open **Terminal** and select your connected workspace.
2. Open **Choose working directory** beside the terminal selector and select your project folder (`/home/user/agent-demo` for the Docker example). A new agent conversation starts there. Browsing another folder in the **Files** tab leaves the chat's working directory in place.
3. Open the **model picker** and search for your agent's prefix, such as `claude-code/` or `codex/`. Choose one of the models the CLI reports. Use a single agent model for this chat.
4. Send the prompt below. Expand the agent's read or command step in chat and compare its reply with the README in **Files**. For the example project, the answer should include `python -m http.server 8080`.

   > Read the README in this folder. What command does it give for running the project? Quote the relevant line.

Continue in the same chat to ask the agent to run the command or edit a file. You can attach a file, answer the agent's questions, and review tool requests according to your [tool permission mode](/features/extensibility/plugin/tools#tool-approval). Regenerating a reply or forking the chat preserves file changes the agent already made. How the agent resumes the conversation depends on the CLI and its version. [Agent chat behavior](/features/open-terminal/agents#picking-an-agent)

## Why is my agent missing from the model picker?

| What you see | What to check |
| :--- | :--- |
| The terminal itself is missing | Check the connection URL from the Open WebUI server, the Bearer key, the enabled toggle, and your account's access to the terminal. For Tether, check that your device is online and connected to the same account. |
| The terminal works, but the agent is missing | In that terminal's shell, run `command -v` with the executable from the table (for example, `command -v agent` for Cursor). Complete the CLI's provider setup as the terminal user. Use versions of Open WebUI, Open Terminal, and the CLI that support the integration, then reselect the terminal to refresh discovery. |
| The agent appears, but its first reply fails | Try the same model in the CLI inside that workspace. A CLI can report model names before it has a working provider login. Check its credentials and connectivity to the provider. |
| Codex replies, but a shell step reports `bwrap: No permissions to create a new namespace` | The container runtime is blocking the Linux sandbox Codex uses for commands. Use a terminal environment that supports the Codex sandbox, such as Open Terminal running directly on a supported host, then retry the same file read. |
| The agent sees the wrong files | Check the terminal and working directory you selected before the first message. For a different project, start a new chat and select that project's directory. |

## Use a regular model with terminal tools

To give an existing model shell and file access, select the terminal and keep your regular model selected. Open WebUI manages its tool calls and Open Terminal executes them. This route requires a model with native tool calling and the **Terminal** capability. You can skip the agent CLI installation and login. [Model capabilities and bindings](/features/workspace/models#capabilities-and-bindings)

## Connect an Existing Agent Gateway

If your agent already runs as a service with an OpenAI-compatible API, add its endpoint under **Settings > Admin > Connections > OpenAI**. The gateway manages its own workspace, tools, and conversation handling.

- **Hermes Agent** supports both routes. Choose the terminal integration above to use Hermes in a selected project folder, or connect the API of a running Hermes gateway. [Hermes gateway setup](/getting-started/quick-start/connect-an-agent/hermes-agent)
- **OpenClaw** exposes a gateway that you can select as a model in chat. [OpenClaw gateway setup](/getting-started/quick-start/connect-an-agent/openclaw)
