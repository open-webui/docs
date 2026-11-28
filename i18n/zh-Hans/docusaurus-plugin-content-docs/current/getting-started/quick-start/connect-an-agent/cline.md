---
sidebar_position: 3
sidebar_label: "Cline CLI"
title: "通过 Open Terminal 连接 Cline CLI"
description: "通过 Open Terminal 将 Cline CLI 连接到 Open WebUI。使用 cline auth 配置模型服务提供方，并在聊天中选择 Cline 模型。"
---

# 在 Open WebUI 中使用 Cline CLI

## 在终端中设置 Cline CLI {#set-up-cline-cli-in-the-terminal}

在终端工作区中安装 Cline CLI。如果使用 npm，请以终端用户身份运行以下命令。

```bash
npm install -g cline
cline auth
```

在身份验证流程中选择你的提供方，然后从项目文件夹运行 `cline` 并发送一个简短提示词。如果已经在编辑器中配置 Cline，仍要检查此终端用户的 CLI 能否访问该提供方。[Cline CLI 设置指南](https://docs.cline.bot/usage/cli-overview)

## 在 Open WebUI 中选择 Cline {#select-cline-in-open-webui}

在一个新创建的已保存聊天中，选择你的**终端（Terminal）**，然后通过**选择工作目录（Choose working directory）**选择项目。打开模型选择器，选择以 `cline/` 开头的模型。如果尚未连接工作区，请按照 [Open Terminal 快速开始](/getting-started/quick-start/connect-an-agent#quick-start-with-open-terminal)操作。

Open Terminal 会运行 `cline --acp`，通过 Agent Client Protocol（ACP）启动会话。让 Cline 查找项目的测试命令，并说明它在哪里找到了该命令。你可以在同一对话中检查所有工具请求。
