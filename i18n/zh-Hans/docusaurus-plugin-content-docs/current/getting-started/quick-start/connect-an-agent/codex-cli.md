---
sidebar_position: 2
sidebar_label: "OpenAI Codex CLI"
title: "通过 Open Terminal 连接 OpenAI Codex CLI"
description: "通过 Open Terminal 在 Open WebUI 中使用 OpenAI Codex CLI。设置设备登录，选择 Codex 模型，并验证项目中的 Shell 访问。"
---

# 在 Open WebUI 中使用 OpenAI Codex CLI

## 在终端中设置 OpenAI Codex CLI {#set-up-openai-codex-cli-in-the-terminal}

Open Terminal 的 `:agents` 镜像包含 `codex`。对于主机安装或其他镜像，请在存放项目的终端中安装 Codex CLI。[Codex CLI 安装指南](https://developers.openai.com/codex/cli/)

对于远程终端，请运行 `codex login --device-auth`，并在浏览器中完成登录。你的账户或工作区必须启用设备登录。以终端用户身份运行 `codex login status`，检查 CLI 将使用哪个登录凭据。[Codex 身份验证选项](https://developers.openai.com/codex/auth)

## 在 Open WebUI 中选择 Codex {#select-codex-in-open-webui}

在一个新创建的已保存聊天中，选择你的**终端（Terminal）**，然后通过**选择工作目录（Choose working directory）**选择项目。打开模型选择器，选择以 `codex/` 开头的模型。如果尚未连接工作区，请按照 [Open Terminal 快速开始](/getting-started/quick-start/connect-an-agent#quick-start-with-open-terminal)操作。

Open Terminal 会通过标准输入输出启动 Codex 应用服务器。让 Codex 运行 `pwd` 并读取 README。如果出现 `bwrap` 命名空间错误，说明 CLI 已启动，但其 Linux 沙箱无法在该容器中运行命令。[排查终端运行时问题](/getting-started/quick-start/connect-an-agent#why-is-my-agent-missing-from-the-model-picker)
