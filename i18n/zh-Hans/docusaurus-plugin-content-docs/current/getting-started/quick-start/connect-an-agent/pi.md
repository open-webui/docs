---
sidebar_position: 12
sidebar_label: "Pi"
title: "通过 Open Terminal 连接 Pi"
description: "通过 Open Terminal，使用 Pi 的原生 RPC 模式将 Pi Agent 连接到 Open WebUI。登录模型服务提供方，并在聊天中选择 Pi 模型。"
---

# 在 Open WebUI 中使用 Pi

## 在终端中设置 Pi {#set-up-pi-in-the-terminal}

在工作区中安装 Pi 的终端应用程序，然后从项目目录运行 `pi`。输入 `/login` 连接受支持的模型服务提供方，或者在 Open Terminal 使用的环境中配置该服务提供方的 API 密钥。使用 `/model` 选择模型并发送一条测试消息。[Pi 安装](https://pi.dev/) · [Pi 命令](https://docs.pi.dev/latest/usage)

## 在 Open WebUI 中选择 Pi {#select-pi-in-open-webui}

在一个新的已保存聊天中，选择你的 **Terminal**，然后使用 **Choose working directory** 选择项目。打开模型选择器，选择一个以 `pi/` 开头的模型。如果仍需连接工作区，请按照 [Open Terminal 快速开始](/getting-started/quick-start/connect-an-agent#quick-start-with-open-terminal)中的说明操作。

Open Terminal 会启动 `pi --mode rpc` 来发现模型并交换消息。Pi 具有原生集成，因此无需 ACP 注册步骤。对于第一个任务，可以让 Pi 读取两个文件，并找出一项你能在工作区中核实的差异。
