---
sidebar_position: 9
sidebar_label: "Grok Build"
title: "通过 Open Terminal 连接 Grok Build"
description: "将 Grok Build CLI 连接到 Open WebUI，在远程 Open Terminal 上使用设备登录，并为项目聊天选择 Grok 模型。"
---

# 在 Open WebUI 中使用 Grok Build

## 在终端中设置 Grok Build {#set-up-grok-build-in-the-terminal}

在终端环境中安装 Grok Build，并运行 `grok` 登录。如果工作区位于远程环境，请从该工作区启动设备登录。

```bash
grok login --device-auth
```

完成浏览器中的步骤，然后返回终端，在 `grok` 中验证提示词能否成功执行。如果改用 API 密钥，请确保运行 Open Terminal 的进程可以访问 `XAI_API_KEY`。[Grok Build 安装与身份验证](https://docs.x.ai/build/overview)

## 在 Open WebUI 中选择 Grok {#select-grok-in-open-webui}

在一个新创建的已保存聊天中，选择你的**终端（Terminal）**，然后通过**选择工作目录（Choose working directory）**选择项目。打开模型选择器，选择以 `grok/` 开头的模型。如果尚未连接工作区，请按照 [Open Terminal 快速开始](/getting-started/quick-start/connect-an-agent#quick-start-with-open-terminal)操作。

Open Terminal 会以 `agent stdio` 模式启动 Grok。让它检查一个项目文件，并在聊天中展开其执行步骤。在支持自动工具审核的版本中，Grok 可以处理常规请求，并将需要升级处理的操作转交 Open WebUI。[工具批准模式](/features/extensibility/plugin/tools#tool-approval)
