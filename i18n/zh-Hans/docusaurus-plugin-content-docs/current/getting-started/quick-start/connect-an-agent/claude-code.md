---
sidebar_position: 1
sidebar_label: "Claude Code"
title: "通过 Open Terminal 连接 Claude Code"
description: "在 Open Terminal 工作区中登录 Claude Code，在 Open WebUI 中选择 Claude 模型，并检查它读取和编辑的文件。"
---

# 在 Open WebUI 中使用 Claude Code

## 在终端中设置 Claude Code {#set-up-claude-code-in-the-terminal}

Open Terminal 的 `:agents` Docker 镜像包含 `claude`。如果使用其他镜像或主机终端，请以运行 Open Terminal 的用户身份在其中安装 Claude Code。[Claude Code 快速开始](https://code.claude.com/docs/en/quickstart)

在项目文件夹中启动 `claude`。按照提示登录，或在 Claude Code 中使用 `/login` 选择账户。让它读取项目的 README，并引用其中的第一个标题。收到回答后，退出 CLI。

## 在 Open WebUI 中选择 Claude Code {#select-claude-code-in-open-webui}

在一个新创建的已保存聊天中，选择你的**终端（Terminal）**，然后通过**选择工作目录（Choose working directory）**选择项目。打开模型选择器，选择以 `claude-code/` 开头的模型。如果尚未连接工作区，请按照 [Open Terminal 快速开始](/getting-started/quick-start/connect-an-agent#quick-start-with-open-terminal)操作。

Open Terminal 会以流式 JSON 模式启动 Claude Code。文件读取和编辑会显示为聊天中的步骤。可以尝试让 Claude 更新文档中的一句话，然后在**文件（Files）**中打开该文件，检查更改。
