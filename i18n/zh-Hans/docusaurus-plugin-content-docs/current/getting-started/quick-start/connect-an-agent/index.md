---
sidebar_position: 0
sidebar_label: "连接智能体"
title: "通过 Open Terminal 运行 Claude Code、Codex 等智能体"
description: "通过 Open Terminal 将 Claude Code、Codex、Gemini CLI 或其他智能体连接到 Open WebUI。查找智能体、登录并在项目中运行任务。"
---

# 在 Open WebUI 中运行 Claude Code、Codex 和其他智能体

要在 Open WebUI 中使用智能体，请先选择**安装了其 CLI 的计算机**，然后**在模型选择器中选择智能体**。你可以在聊天中发送消息并检查它的工作。智能体使用自己的工具和模型服务提供方，在计算机的工作区中读取文件、运行命令并进行编辑。

已有连接的计算机和可用的智能体 CLI？[开始你的第一次智能体聊天](#start-your-first-agent-chat)。如果你已经运行 Hermes 或 OpenClaw 网关，也可以[直接连接其 API](#connect-an-existing-agent-gateway)。

## Open Terminal 支持哪些智能体？ {#which-agents-does-open-terminal-support}

Open Terminal 内置了对以下 13 个智能体的集成。`:agents` Docker 镜像附带 **Claude Code 和 Codex**。在同一终端环境中安装你想要使用的任何其他 CLI。在下方选择你的智能体，查看安装、登录和模型选择方法。

| 智能体 | CLI 可执行文件 | 模型选择器前缀 |
| :--- | :--- | :--- |
| [Claude Code](/getting-started/quick-start/connect-an-agent/claude-code) | `claude` | `claude-code/` |
| [OpenAI Codex CLI](/getting-started/quick-start/connect-an-agent/codex-cli) | `codex` | `codex/` |
| [Cline CLI](/getting-started/quick-start/connect-an-agent/cline) | `cline` | `cline/` |
| [Cursor CLI](/getting-started/quick-start/connect-an-agent/cursor-cli) | `agent` | `cursor/` |
| [Gemini CLI](/getting-started/quick-start/connect-an-agent/gemini-cli) | `gemini` | `gemini/` |
| [GitHub Copilot CLI](/getting-started/quick-start/connect-an-agent/github-copilot) | `copilot` | `copilot/` |
| [Google Antigravity CLI](/getting-started/quick-start/connect-an-agent/antigravity) | `agy` | `antigravity/` |
| [Goose](/getting-started/quick-start/connect-an-agent/goose) | `goose` | `goose/` |
| [Grok Build](/getting-started/quick-start/connect-an-agent/grok-build) | `grok` | `grok/` |
| [Hermes Agent](/getting-started/quick-start/connect-an-agent/hermes-agent) | `hermes` | `hermes/` |
| [OpenCode](/getting-started/quick-start/connect-an-agent/opencode) | `opencode` | `opencode/` |
| [Pi](/getting-started/quick-start/connect-an-agent/pi) | `pi` | `pi/` |
| [Qwen Code](/getting-started/quick-start/connect-an-agent/qwen-code) | `qwen` | `qwen/` |

Open Terminal 会在需要时启动各个 CLI。Codex 使用其应用服务器，Claude Code 使用流式 JSON，Pi 使用 RPC。其他内置智能体使用 **Agent Client Protocol（ACP）**。对于其他 ACP v1 智能体，例如 **Kiro CLI** 或 **Factory Droid**，请安装并配置 CLI，在 `OPEN_TERMINAL_ACP_AGENTS` 中注册其启动命令，然后重启 Open Terminal。[自定义 ACP 智能体设置](/features/open-terminal/agents#add-another-acp-agent) · [智能体启动命令](https://github.com/open-webui/open-terminal#coding-agents-in-chat)

## Open Terminal 快速开始 {#quick-start-with-open-terminal}

### 1. 选择智能体的工作位置 {#1-choose-where-the-agent-will-work}

- **在你自己的计算机上。** 使用 Open WebUI Tether 连接你的计算机。在该计算机上安装并登录 CLI。在聊天中，通过计算机菜单的**你的设备（Your devices）**选择它，然后继续[开始你的第一次智能体聊天](#start-your-first-agent-chat)。[Tether 设置](/ecosystem/tether#get-started)
- **在现有 Open Terminal 上。** 在该环境中使用 Shell，然后继续第 2 步。如果将现有容器切换到 `:agents` 镜像，请保留其主目录卷。[更新 Open Terminal](/features/open-terminal/setup/updating)
- **在新的 Docker 工作区中。** 对于直接运行在同一主机上的 Open WebUI，请启动下方容器。如果 Open WebUI 本身在 Docker Compose 中运行，请使用 `:agents` 镜像将 `open-terminal` 服务添加到同一个 Compose 网络。[Docker Compose 与裸机安装](/features/open-terminal/setup/installation)

将 `your-secret-key` 替换为你自己的密钥。替换容器时，该卷会保留单用户的工作区、CLI 设置和基于文件的凭据。如需为不同用户使用独立凭据，请参阅[团队部署](/features/open-terminal/advanced/multi-user)。

```bash
docker run -d \
  --name open-terminal \
  --restart unless-stopped \
  -p 127.0.0.1:8000:8000 \
  -v open-terminal:/home/user \
  -e OPEN_TERMINAL_API_KEY=your-secret-key \
  ghcr.io/open-webui/open-terminal:agents
```

### 2. 在终端中登录智能体 {#2-sign-in-to-the-agent-inside-the-terminal}

对于 Docker 示例，请以终端用户身份打开 Shell。

```bash
docker exec -it open-terminal bash
```

对于 **Codex**，如果账户允许设备登录，请运行 `codex login --device-auth`，然后启动 `codex`。对于 **Claude Code**，请运行 `claude` 并按照其登录提示操作。对于其他智能体，请按照上方对应的设置链接操作。向 CLI 提一个简短问题，确认它能在此 Shell 中回答。完成后退出交互式 CLI。[智能体身份验证与 API 密钥选项](https://github.com/open-webui/open-terminal/blob/main/docs/deployment.md#coding-agents)

### 3. 将计算机连接到 Open WebUI {#3-connect-the-machine-to-open-webui}

以管理员身份打开**设置 > 集成（Settings > Integrations）**（管理员区域）。在**计算机（Machines）**部分，点击 **+**，为连接命名，并输入 **Open WebUI 服务器**可以访问的 URL。对于上述主机设置，请使用 `http://127.0.0.1:8000`；对于同一网络中名为 `open-terminal` 的 Compose 服务，请使用 `http://open-terminal:8000`。

选择 **Bearer** 并输入你的 **Open Terminal API 密钥**。保存并启用连接。此密钥授予 Open WebUI 访问工作区的权限。CLI 使用第 2 步中的提供方登录凭据生成回复。[连接设置与访问授权](/features/open-terminal/setup/connecting)

### 开始你的第一次智能体聊天 {#start-your-first-agent-chat}

使用计算机工作区中已有的项目。如果启动的是空容器，请在其 Shell 中运行以下命令，创建一个可以在聊天中检查的小项目。

```bash
mkdir -p ~/agent-demo
printf '%s\n' '# Field Notes' 'Run the project with: python -m http.server 8080' > ~/agent-demo/README.md
```

1. 打开**新聊天（New Chat）**，并关闭**临时聊天（Temporary Chat）**。在消息输入框中，点击云图标；在选择计算机之前，该图标显示为**计算机（Machine）**。选择你的计算机。
2. 打开计算机选择器旁边的**选择工作目录（Choose working directory）**，选择项目文件夹（Docker 示例中为 `/home/user/agent-demo`）。新的智能体对话会在此目录中启动。在**文件（Files）**标签页中浏览其他文件夹，不会改变聊天的工作目录。
3. 打开**模型选择器**，搜索智能体的前缀，例如 `claude-code/` 或 `codex/`。选择 CLI 报告的模型之一。此聊天只使用一个智能体模型。
4. 发送下方提示词。在聊天中展开智能体的读取或命令步骤，并将其回答与**文件（Files）**中的 README 进行对比。对于示例项目，回答应包含 `python -m http.server 8080`。

   > 读取此文件夹中的 README。其中给出了什么项目运行命令？请引用相关行。

在同一聊天中继续要求智能体运行命令或编辑文件。你可以附加文件、回答智能体的问题，并根据自己的[工具权限模式](/features/extensibility/plugin/tools#tool-approval)审核工具请求。重新生成回复或分叉聊天，会保留智能体已经做出的文件更改。智能体如何恢复对话取决于 CLI 及其版本。[智能体聊天行为](/features/open-terminal/agents#picking-an-agent)

## 为什么模型选择器中缺少我的智能体？ {#why-is-my-agent-missing-from-the-model-picker}

| 你看到的情况 | 需要检查的内容 |
| :--- | :--- |
| 计算机本身未显示 | 检查 Open WebUI 服务器使用的连接 URL、Bearer 密钥、启用开关，以及你的账户对该计算机的访问权限。对于 Tether，检查设备是否在线，以及是否连接到同一账户。 |
| 计算机可用，但智能体未显示 | 在该终端的 Shell 中，对表格中的可执行文件运行 `command -v`（例如，Cursor 使用 `command -v agent`）。以终端用户身份完成 CLI 的提供方设置。使用支持此集成的 Open WebUI、Open Terminal 和 CLI 版本，然后重新选择计算机以刷新发现结果。 |
| 智能体已显示，但首次回复失败 | 在该工作区的 CLI 中尝试同一模型。CLI 可能在提供方登录尚不可用时就能报告模型名称。检查其凭据以及与提供方的网络连接。 |
| Codex 能回复，但 Shell 步骤报告 `bwrap: No permissions to create a new namespace` | 容器运行时正在阻止 Codex 用于执行命令的 Linux 沙箱。使用支持 Codex 沙箱的终端环境，例如直接在受支持主机上运行的 Open Terminal，然后重试同一文件读取操作。 |
| 智能体看到错误的文件 | 检查发送第一条消息前选择的计算机和工作目录。如需处理其他项目，请开始新聊天并选择该项目的目录。 |

## 将常规模型与终端工具结合使用 {#use-a-regular-model-with-terminal-tools}

要为现有模型提供 Shell 和文件访问权限，请选择计算机，并保持常规模型处于选中状态。Open WebUI 管理其工具调用，Open Terminal 负责执行。此方式要求模型支持原生工具调用，并具备**终端（Terminal）**能力。你可以跳过智能体 CLI 的安装和登录。[模型能力与绑定](/features/workspace/models#capabilities-and-bindings)

## 连接现有智能体网关 {#connect-an-existing-agent-gateway}

如果智能体已经作为具有 OpenAI 兼容 API 的服务运行，请在**设置 > 连接 > OpenAI（Settings > Connections > OpenAI）**（管理员区域）下添加其端点。网关管理自己的工作区、工具和对话处理。

- **Hermes Agent** 同时支持这两种方式。选择上述终端集成，可在所选项目文件夹中使用 Hermes；也可以连接正在运行的 Hermes 网关的 API。[Hermes 网关设置](/getting-started/quick-start/connect-an-agent/hermes-agent#connect-the-hermes-gateway)
- **OpenClaw** 提供的网关可以在聊天中作为模型选择。[OpenClaw 网关设置](/getting-started/quick-start/connect-an-agent/openclaw)
