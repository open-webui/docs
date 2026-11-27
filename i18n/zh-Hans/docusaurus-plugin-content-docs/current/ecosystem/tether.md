---
title: "Open WebUI Tether"
description: "让 AI 在你的计算机上工作，通过手机检查结果，并使用你自己的模型和工具。下载适用于 macOS、Windows 和 Linux 的 Tether。"
sidebar_position: 3
---

# Open WebUI Tether

**让你的 AI 在你的计算机上工作，即使你不在旁边。**

让它把一个存放导出文件的文件夹变成报告、修复项目中的缺陷或整理文件。通过手机检查结果。回到计算机时，就能看到它创建的文件。

Tether 是将你的计算机连接到 Open WebUI 的桌面应用。它将你的文件、工具和本地模型带入聊天，并提供可选的工作区沙盒，让你选择 AI 可以工作的位置。

**[下载适用于 macOS、Windows 和 Linux 的版本](https://github.com/open-webui/tether/releases/latest)** · **[开始使用](#get-started)**

## 工作区触手可及 {#your-workspace-within-reach}

你的项目已经安装了依赖，文档已存放在各自的文件夹中，工具也已就绪。Tether 让你的 AI 通过 **Open Terminal** 在该环境中工作。你可以跟随命令执行过程、检查文件，并在 Open WebUI 中要求修改。在终端环境中安装并登录 [Claude Code 和 Codex 等受支持的代理](/getting-started/quick-start/connect-an-agent)后，也可以使用它们。

在另一台设备上打开同一个 Open WebUI 实例，使用同一账户登录，然后在终端菜单的**你的设备（Your devices）**下选择你的计算机。工作会在已连接的计算机上运行。对于团队，每位成员的设备都连接到其在共享 Open WebUI 实例上的各自账户。

Tether 主动向外建立连接，因此无需入站端口或路由器转发。请保持计算机唤醒、联网并运行 Tether。启用**在后台运行（Run in background）**，即可在关闭窗口后保持连接；在 Open WebUI 中启用**浏览器通知（Browser Notifications）**，即可在聊天完成或失败时收到提醒。还需要在操作系统中允许通知。

## 询问屏幕上的内容 {#ask-about-whats-on-your-screen}

遇到不认识的错误、希望获得解释的图表，或其他原本需要从头描述的内容时：

在 macOS 上按 **Cmd+Shift+I**，在 Windows 和 Linux 上按 **Ctrl+Shift+I**，即可在当前应用上方打开 **Spotlight**。截取屏幕区域或附加剪贴板图片，提出问题，然后发送到 Open WebUI。截图需要使用支持图片的模型；可在 **Tether 设置 > 通用**中自定义快捷键。

## 为它指定工作文件夹 {#give-it-a-folder-to-work-in}

Tether 的可选**工作区沙盒**让你从一组明确的文件开始。操作系统限制会将 Open Terminal 及其命令约束在所选工作区、临时存储和必需的程序文件范围内。沙盒命令默认关闭网络访问；任务需要时可启用。

沙盒在 **macOS 和受支持的 Windows 设备**上原生运行，无需 Docker 或虚拟机。**Linux 上不可用。** 在 **Tether 设置 > Open Terminal > 沙盒**下，选择**限制文件访问（Restrict file access）**，选择一个文件夹，然后点击**应用并重启（Apply and restart）**。Tether 会在启动前检查限制；请等待显示**沙盒已激活（Sandbox active）**。

<details>
<summary>沙盒范围</summary>

工作区内的文件仍可被修改或删除。该 Tether 安装中的所有 WebUI 连接共享所选文件夹。沙盒激活期间，浏览器控制、桌面控制和直接 HTTP 访问会被禁用。

本地 MCP 命令、单独连接的终端和**主机 shell（不受限）（Host shell (unrestricted)）**不在此沙盒范围内。仅设置文件浏览器的起始文件夹并不会限制访问。平台和进程生命周期详情，请参阅[沙盒指南](https://github.com/open-webui/tether/blob/main/docs/sandbox.md)。

</details>

## 使用你自己的模型和工具 {#bring-your-own-models-and-tools}

在 Open WebUI 中使用 Ollama 或 LM Studio 里运行的模型。将已安装 MCP 服务器的工具带入聊天，或通过 OpenAPI 连接内部服务。在 **Tether 设置 > 集成**中添加它们；Tether 会通过现有连接，从你的计算机访问这些服务。本地 MCP 命令无需单独的 HTTP 桥接。请参阅 [MCP 设置](https://github.com/open-webui/tether/blob/main/docs/mcp.md)。

对于浏览器工作，Open Terminal 可以使用独立的 Chrome 配置文件；也可以在启用远程调试并经你批准后，使用正在运行的 Chrome 会话。受支持的系统可使用桌面控制。这两项都要求关闭工作区沙盒。

集成密钥保留在运行 Tether 的计算机上。聊天中使用的提示词、文件内容和工具结果仍会经过 Open WebUI 及涉及的模型服务。

## 开始使用 {#get-started}

你需要一个现有的 Open WebUI 实例和一个账户。

1. 在要使用的计算机上**[安装 Tether](https://github.com/open-webui/tether/releases/latest)**。
2. **输入你的 Open WebUI 地址**并登录。
3. **选择安装并连接（Install and connect）**，启用本地文件和命令。Tether 会为你安装 Open Terminal。选择**暂不（Not now）**可使用桌面聊天而不执行本地操作。
4. **设置你的访问偏好**，然后在聊天中**你的设备（Your devices）**下选择计算机。选择支持工具调用且能力出色的模型，并在[文件浏览器](/features/open-terminal/file-browser)中打开你的文件夹。

![包含 Open WebUI 地址和可选连接名称的 Tether 连接界面](/images/tether-connect.png)

在工作区中放入几份文本文档，试试下面的提示：

> 阅读这些文件并创建 summary.md，为每份文件写一段简短摘要。附上来源文件名，并保持原文件不变。

打开结果进行检查，然后要求下一项修改。

根据[个人使用例外条款](https://github.com/open-webui/tether/blob/main/LICENSE)，个人非商业使用免费。商业或组织生产用途需要 [Open WebUI 企业许可证](/enterprise)。

## 要求与帮助 {#requirements}

<details>
<summary>连接要求与故障排除</summary>

请使用相互兼容的 Tether、Open WebUI 和 Open Terminal 版本。实例需要启用 [`ENABLE_WEBSOCKET_SUPPORT`](/reference/env-configuration#enable_websocket_support)；终端访问还需要 [`ENABLE_TOOL_SERVERS`](/reference/env-configuration#enable_tool_servers)。配置多个 [`UVICORN_WORKERS`](/reference/env-configuration#uvicorn_workers) worker 时，需要 [Redis](/reference/env-configuration#redis_url)。

如果看不到你的计算机，请检查 Tether 和 Open Terminal 是否正在运行并已连接，以及两台设备是否使用同一实例和账户。如果模型未使用该计算机，请检查其[终端能力](/features/workspace/models#capabilities-and-bindings)和[原生工具调用模式](/features/open-terminal/setup/connecting#8-enable-native-function-calling)。

如果模型或工具缺失，请在 Tether 中启用相应连接，并确认该计算机可以访问这些服务。MCP 需要匹配的 relay 支持，并在 Open WebUI 中启用外部工具。

</details>

[GitHub](https://github.com/open-webui/tether) · [客户端协议参考](/reference/tether-client-protocol) · [报告问题](https://github.com/open-webui/tether/issues)
