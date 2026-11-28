---
sidebar_position: 11
sidebar_label: "OpenCode"
title: "通过 Open Terminal 连接 OpenCode"
description: "通过 ACP 将 OpenCode 连接到 Open WebUI。在 Open Terminal 中配置其服务提供方，并在模型选择器中查找带服务提供方前缀的模型。"
---

# 在 Open WebUI 中使用 OpenCode

## 在终端中设置 OpenCode {#set-up-opencode-in-the-terminal}

在终端工作区中安装 OpenCode。运行 `opencode`，使用 `/connect` 配置模型服务提供方，然后使用 `/models` 选择模型。对于本地模型服务器，请配置一个终端可以访问的地址。让模型读取一个文件，以同时验证服务提供方和工作区是否正常。[OpenCode 安装](https://opencode.ai/docs/) · [OpenCode 服务提供方](https://opencode.ai/docs/providers/)

## 在 Open WebUI 中选择 OpenCode {#select-opencode-in-open-webui}

在一个新的已保存聊天中，选择你的 **Terminal**，然后使用 **Choose working directory** 选择项目。打开模型选择器，选择一个以 `opencode/` 开头的模型。如果仍需连接工作区，请按照 [Open Terminal 快速开始](/getting-started/quick-start/connect-an-agent#quick-start-with-open-terminal)中的说明操作。

OpenCode 可以在模型名称中包含服务提供方，因此选择器中的完整条目可能形如 `opencode/<provider>/<model>`。Open Terminal 会自动启动 `opencode acp`。手动运行该命令会让进程等待协议消息。请使用交互式 `opencode` 命令测试登录。[OpenCode ACP 指南](https://opencode.ai/docs/cli/acp/)
