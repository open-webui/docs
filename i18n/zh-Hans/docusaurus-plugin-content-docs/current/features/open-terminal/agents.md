---
sidebar_position: 9
title: "智能体"
---

# 智能体

当所选的 Open Terminal 列出智能体时，它们会显示在模型选择器中，与常规模型并列。选择一个后，智能体会在机器的工作区中工作，使用该环境的文件和工具。

显示哪些智能体和模型取决于所选的 Open Terminal。机器报告为不可用的智能体不会列出。

你可以让智能体总结项目文件、准备报告，或修复错误并运行测试。你可以在聊天中跟进其工作、回答问题并审查工具请求。

有关安装、登录和连接步骤，请从[连接智能体](/getting-started/quick-start/connect-an-agent#quick-start-with-open-terminal)开始。

## 支持的智能体 {#supported-agents}

Open Terminal 通过下列接口启动已安装的 CLI。请以运行终端的用户身份安装 CLI 并完成身份验证；支持某个智能体并不意味着每个终端镜像都包含其可执行文件或凭据。`:agents` Docker 镜像包含 Codex 和 Claude Code。

| 智能体 | 接口 | 可执行文件 |
| :--- | :--- | :--- |
| [Codex](/getting-started/quick-start/connect-an-agent/codex-cli) | 原生 app-server 协议 | `codex` |
| [Claude Code](/getting-started/quick-start/connect-an-agent/claude-code) | 原生流式 JSON 协议 | `claude` |
| [Pi](/getting-started/quick-start/connect-an-agent/pi) | 原生 RPC 协议 | `pi` |
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

[Agent Client Protocol（ACP）](https://agentclientprotocol.com/get-started/introduction)对智能体与其客户端之间的通信进行了标准化。这些集成使用 ACP v1。Open Terminal 启动智能体进程，Open WebUI 则处理其协议消息，用于聊天输出、工具审批和会话延续。另外三个智能体使用专用协议适配器。

可用模型来自每个 CLI 的发现响应。推理控制和会话恢复等功能取决于智能体及其版本。请使用支持所需集成的 Open WebUI、Open Terminal 和 CLI 版本。[Open Terminal 智能体参考](https://github.com/open-webui/open-terminal#coding-agents-in-chat)列出了启动命令和可执行文件覆盖项。

## 添加另一个 ACP 智能体 {#add-another-acp-agent}

先在终端环境中安装并配置智能体。然后，在 **Open Terminal 服务器**上将 `OPEN_TERMINAL_ACP_AGENTS` 设置为一个 JSON 对象，其中包含 ID、显示名称和启动命令。例如，对于已安装的 Kiro CLI：

```bash
export OPEN_TERMINAL_ACP_AGENTS='{"kiro":{"name":"Kiro","command":"kiro-cli acp"}}'
```

如果使用 Docker，请通过容器环境传递相同的变量。重启 Open Terminal 以加载该变量，然后在 Open WebUI 中选择机器。发现的模型将显示为 `acp-kiro/<model>`。

该命令必须通过标准输入/输出启动 ACP v1 智能体。它使用终端用户的文件、环境和凭据运行。此设置只注册命令，不会安装智能体或完成交互式登录。智能体必须在发现过程中成功报告模型，才会显示在选择器中。

## 选择智能体 {#picking-an-agent}

在聊天中选择一台机器，然后打开模型选择器。每个智能体模型的名称均为 `<agent>/<model>`。

- **每次对话使用一个智能体。**一个聊天中只添加一个智能体模型。智能体不能在多模型聊天中与其他模型组合。
- **重新生成、编辑或分叉。**自 Open WebUI 0.13.4 起，可以重新生成回复、编辑较早的消息，以及分叉或克隆智能体聊天。使用最新的 Codex CLI 时，Codex 可以从所选轮次继续。Claude Code 需要最新的 [Open Terminal](/features/open-terminal/setup/updating) 才能执行相同操作。其他智能体会使用该时间点之前的聊天历史开始新会话。文件更改会保留在工作区中。[版本要求](https://github.com/open-webui/open-webui/releases/tag/v0.13.4)
- **缺少智能体。**当机器或其智能体模型不可用时，该智能体会从选择中移除，并使用默认模型。
- **仅限已保存的聊天。**智能体对话需要已保存的聊天，因此无法在临时聊天中使用。

## 阅读步骤 {#reading-the-steps}

智能体步骤和常规模型的终端工具调用会显示为易读的卡片，例如带输出的命令或每个已编辑文件的差异。

## 模型 ID {#model-ids}

智能体模型 ID 的模型部分只使用字母、数字、连字符和下划线。模型名称中的其他字符（例如点）会替换为连字符，并附加一个短后缀。置顶、默认模型和[自动化](/features/chat-conversations/chat-features/automations#running-a-coding-agent)会存储此 ID。

## 选项 {#options}

如果智能体为所选模型提供相应选项，消息输入框的模型控制菜单中会显示**推理强度**和**服务层级**。你的选择会保存到设置中。

在聊天控制或模型高级参数中设置的**推理强度**高级参数，在你亲自设置后也会传递给智能体。名为 `reasoningEffort` 或 `reasoning_effort` 的自定义参数值也会以相同方式读取。Claude Code 将其作为 effort 级别接收，Pi 将其作为 thinking 级别接收，Codex 将其作为本轮的 effort 接收。其他所有智能体则将其作为该智能体为模型提供的 thought 级别接收。当智能体不为所选模型提供所选级别时，回复会失败并显示 **Agent does not support the selected reasoning effort for this model**（智能体不支持为此模型选择的推理强度）。请选择另一个级别或清除该参数。

## 与智能体协作 {#working-with-an-agent}

- **附件。**你附加的文件会上传到机器，并将其路径告知智能体。图像（PNG、JPEG、GIF 和 WebP）也会直接发送给智能体，每条消息的总大小上限为 10 MB。
- **工作区。**新对话从消息输入框中**选择工作目录**下选择的文件夹开始。现有智能体对话会保留其工作区，即使你在[文件浏览器](./file-browser.md)中浏览到其他文件夹也是如此。
- **工具请求。**智能体要运行工具时，请求会显示在聊天中，并遵循[工具权限模式](/features/extensibility/plugin/tools#tool-approval)。在**自动**模式下（启用 [`ENABLE_TOOL_PERMISSIONS`](/reference/env-configuration#enable_tool_permissions) 和 [`ENABLE_TOOL_PERMISSIONS_AUTO`](/reference/env-configuration#enable_tool_permissions_auto) 时提供），Codex 使用自己的审查器，仅转发其上报的请求。支持此功能的 Claude Code 和 Grok 智能体版本也会这样做。上报的操作仍会通过 Open WebUI 的审批检查。除非管理员在[自动权限](/features/extensibility/plugin/tools#auto)下设置**引擎**，否则其他 ACP 智能体在**自动**模式下会继续请求审批。
- **工作期间发送消息。**开启[消息队列](/features/chat-conversations/chat-features/message-queue)后，在 Claude Code 或 Codex 工作时发送的消息会在其下一个工具步骤送达智能体，后续操作则成为对该消息的回复。带附件的消息会等到智能体本轮结束。其他智能体和较早版本的 Claude Code 会在本轮结束后回复排队消息。
- **问题。**智能体向你提问时，问题会显示在聊天中，智能体会等待你的回答。无论设置哪种权限模式，问题都会始终显示。
- **语音。**选择机器后，智能体可在[实时语音通话](/features/chat-conversations/chat-features/voice-mode#realtime-calls)中工作。
- **聊天标题。**新聊天使用第一条消息的前 50 个字符作为标题。设置[任务模型](/features/administration/task-models)并开启自动标题生成后，生成的标题会将其替换。
