---
sidebar_position: 7
sidebar_label: "Google Antigravity CLI"
title: "通过 Open Terminal 连接 Google Antigravity CLI"
description: "在 Open WebUI 中使用 Google Antigravity CLI。在运行 Open Terminal 的计算机上安装 agy 并登录，然后选择 Antigravity 模型。"
---

# 在 Open WebUI 中使用 Google Antigravity CLI

## 在终端中设置 Google Antigravity CLI {#set-up-google-antigravity-cli-in-the-terminal}

在运行 Open Terminal 的计算机或容器中安装 Antigravity CLI。在该环境中运行 `agy --version`，然后在项目文件夹中启动 `agy`。[Antigravity CLI 安装指南](https://antigravity.google/docs/cli-getting-started)

在本地计算机上，如果 CLI 没有已保存的凭据，请按照浏览器登录流程操作。通过 SSH 连接时，`agy` 可以打印授权 URL。在自己的计算机上打开该 URL，并将生成的代码输入远程终端。在 CLI 中提一个简短问题，确认账户可在该环境中正常使用。[Antigravity 身份验证](https://antigravity.google/docs/install?tab=cli)

## 在 Open WebUI 中选择 Antigravity {#select-antigravity-in-open-webui}

在一个新创建的已保存聊天中，选择你的**终端（Terminal）**，然后通过**选择工作目录（Choose working directory）**选择项目。打开模型选择器，选择以 `antigravity/` 开头的模型。如果尚未连接工作区，请按照 [Open Terminal 快速开始](/getting-started/quick-start/connect-an-agent#quick-start-with-open-terminal)操作。

Open Terminal 会为对话启动 `agy acp`。如果模型选择器仅显示 `gemini/` 条目，请检查所选终端是否提供 `agy` 可执行文件。Gemini CLI 使用独立的集成。
