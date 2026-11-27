---
sidebar_position: 5
sidebar_label: "Gemini CLI"
title: "通过 Open Terminal 连接 Gemini CLI"
description: "在 Open Terminal 中设置 Google Gemini CLI，为项目完成身份验证，并在 Open WebUI 聊天中选择相应的 Gemini 模型。"
---

# 在 Open WebUI 中使用 Gemini CLI

## 在终端中设置 Gemini CLI {#set-up-gemini-cli-in-the-terminal}

在存放项目的终端中安装 CLI。如果环境中已有 Node.js 和 npm，请运行以下命令。

```bash
npm install -g @google/gemini-cli
gemini
```

选择账户可用的身份验证方法，例如 Gemini API 密钥或 Vertex AI。如果该方法使用环境变量，请将其提供给 Open Terminal 进程，以便它启动的 CLI 可以使用这些变量。使用相同的项目和凭据验证提示词能否成功执行。[Gemini CLI 安装指南](https://geminicli.com/docs/get-started/installation/) · [身份验证方法](https://geminicli.com/docs/get-started/authentication/)

## 在 Open WebUI 中选择 Gemini CLI {#select-gemini-cli-in-open-webui}

在一个新创建的已保存聊天中，选择你的**终端（Terminal）**，然后通过**选择工作目录（Choose working directory）**选择项目。打开模型选择器，选择以 `gemini/` 开头的模型。如果尚未连接工作区，请按照 [Open Terminal 快速开始](/getting-started/quick-start/connect-an-agent#quick-start-with-open-terminal)操作。

Open Terminal 会运行 `gemini --acp`。如果同时安装了 Gemini CLI 和 Google Antigravity，它们在选择器中各有自己的前缀。选择 `gemini/` 使用此 CLI，或按照 [Antigravity 指南](./antigravity.md)使用 `agy`。
