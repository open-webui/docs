---
sidebar_position: 4
sidebar_label: "Cursor CLI"
title: "通过 Open Terminal 连接 Cursor CLI"
description: "从 Open WebUI 运行 Cursor CLI。在本地或远程 Open Terminal 中对智能体可执行文件进行身份验证，并在聊天选择器中查找 Cursor 模型。"
---

# 在 Open WebUI 中使用 Cursor CLI

## 在终端中设置 Cursor CLI {#set-up-cursor-cli-in-the-terminal}

在运行 Open Terminal 的环境中安装 Cursor CLI。其可执行文件名为 `agent`。在远程计算机上，打印登录 URL 并在自己的浏览器中打开它。

```bash
NO_OPEN_BROWSER=1 agent login
agent status
```

在有浏览器的计算机上，直接使用 `agent login`。检查 `agent status` 是否显示预期账户。[Cursor CLI 安装指南](https://cursor.com/docs/cli/installation) · [Cursor 身份验证](https://cursor.com/docs/cli/reference/authentication)

## 在 Open WebUI 中选择 Cursor {#select-cursor-in-open-webui}

在一个新创建的已保存聊天中，选择你的**终端（Terminal）**，然后通过**选择工作目录（Choose working directory）**选择项目。打开模型选择器，选择以 `cursor/` 开头的模型。如果尚未连接工作区，请按照 [Open Terminal 快速开始](/getting-started/quick-start/connect-an-agent#quick-start-with-open-terminal)操作。

Open Terminal 会使用 Cursor 登录凭据启动 `agent acp`。如果选择器中没有 Cursor 条目，请在项目所在的终端中运行 `command -v agent`。在另一台计算机上安装桌面编辑器，并不会将 CLI 安装到该工作区。
