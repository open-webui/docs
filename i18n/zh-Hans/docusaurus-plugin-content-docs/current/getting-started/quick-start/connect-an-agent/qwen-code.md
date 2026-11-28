---
sidebar_position: 13
sidebar_label: "Qwen Code"
title: "通过 Open Terminal 连接 Qwen Code"
description: "通过 Open Terminal 将 Qwen Code 连接到 Open WebUI。安装 qwen CLI、配置其模型服务提供方，并在聊天选择器中查找其模型。"
---

# 在 Open WebUI 中使用 Qwen Code

## 在终端中设置 Qwen Code {#set-up-qwen-code-in-the-terminal}

在终端环境中安装 Qwen Code。使用受支持的 Node.js 版本，运行以下命令。

```bash
npm install -g @qwen-code/qwen-code
qwen
```

在 Qwen Code 中使用 `/auth`，为你的账户或模型服务提供方选择身份验证方法。发送一个提示词并确认模型能够响应，然后再返回 Open WebUI。[Qwen Code 安装](https://github.com/QwenLM/qwen-code) · [身份验证选项](https://qwenlm.github.io/qwen-code-docs/en/users/configuration/auth/)

## 在 Open WebUI 中选择 Qwen Code {#select-qwen-code-in-open-webui}

在一个新的已保存聊天中，选择你的 **Terminal**，然后使用 **Choose working directory** 选择项目。打开模型选择器，选择一个以 `qwen/` 开头的模型。如果仍需连接工作区，请按照 [Open Terminal 快速开始](/getting-started/quick-start/connect-an-agent#quick-start-with-open-terminal)中的说明操作。

Open Terminal 会启动 `qwen --acp`。通过 Ollama 或 OpenAI 兼容端点连接到 Open WebUI 的 Qwen 模型也可以作为普通模型使用。当你希望 Qwen Code 本身在终端中读取文件并运行工具时，请选择 `qwen/` 条目。
