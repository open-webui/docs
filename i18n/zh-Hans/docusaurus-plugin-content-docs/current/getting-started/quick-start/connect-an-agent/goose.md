---
sidebar_position: 8
sidebar_label: "Goose"
title: "通过 Open Terminal 连接 Goose"
description: "在 Open Terminal 工作区中配置 Goose 提供方和模型，并通过 Open WebUI 聊天使用该 Goose 会话。"
---

# 在 Open WebUI 中使用 Goose

## 在终端中设置 Goose {#set-up-goose-in-the-terminal}

安装适用于终端操作系统的 Goose CLI，然后以终端用户身份配置提供方和模型。

```bash
goose configure
goose session
```

在新会话中，让 Goose 总结一个你熟悉的文件。这可以同时检查提供方配置以及 Goose 对工作区的访问权限。收到回答后退出会话。[Goose CLI 安装与提供方设置](https://github.com/aaif-goose/goose/blob/main/documentation/docs/getting-started/installation.md)

## 在 Open WebUI 中选择 Goose {#select-goose-in-open-webui}

在一个新创建的已保存聊天中，选择你的**终端（Terminal）**，然后通过**选择工作目录（Choose working directory）**选择项目。打开模型选择器，选择以 `goose/` 开头的模型。如果尚未连接工作区，请按照 [Open Terminal 快速开始](/getting-started/quick-start/connect-an-agent#quick-start-with-open-terminal)操作。

Open Terminal 会启动 `goose acp`，并向 Goose 查询可用模型。如果提供方在你的笔记本电脑上可用，但聊天在容器中运行，请在该容器内运行 `goose configure`，并使用容器自己的提供方凭据。
