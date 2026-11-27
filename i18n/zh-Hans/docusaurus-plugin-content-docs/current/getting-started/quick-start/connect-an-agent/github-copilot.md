---
sidebar_position: 6
sidebar_label: "GitHub Copilot CLI"
title: "通过 Open Terminal 连接 GitHub Copilot CLI"
description: "在 Open Terminal 中安装 GitHub Copilot CLI，使用 GitHub 登录，并在 Open WebUI 中选择 Copilot 模型来处理仓库文件。"
---

# 在 Open WebUI 中使用 GitHub Copilot CLI

## 在终端中设置 GitHub Copilot CLI {#set-up-github-copilot-cli-in-the-terminal}

在终端中安装独立的 `copilot` 可执行文件。使用受支持的 Node.js 版本时，可以通过 npm 安装并打开它。

```bash
npm install -g @github/copilot
copilot
```

如果出现提示，请输入 `/login`，并授权具有 Copilot 访问权限的 GitHub 账户。检查 CLI 能否在仓库中回答提示词。`gh` 命令可用只能证明 GitHub CLI 已安装。此集成需要 Open Terminal 能够使用 `copilot`。[安装 GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli)

## 在 Open WebUI 中选择 GitHub Copilot {#select-github-copilot-in-open-webui}

在一个新创建的已保存聊天中，选择你的**终端（Terminal）**，然后通过**选择工作目录（Choose working directory）**选择项目。打开模型选择器，选择以 `copilot/` 开头的模型。如果尚未连接工作区，请按照 [Open Terminal 快速开始](/getting-started/quick-start/connect-an-agent#quick-start-with-open-terminal)操作。

Open Terminal 会在所选工作区中启动 `copilot --acp`。作为第一个任务，可以让它说明哪些文件定义了仓库的 CI 检查，并要求 Copilot 引用相关行。将其回答与**文件（Files）**中的工作流文件进行对比。
