---
sidebar_position: 30
title: "Intel GPU（IPEX-LLM）"
---

:::warning

本教程由社区贡献，Open WebUI 团队不提供支持。它仅用于演示如何针对特定用例自定义 Open WebUI。想要贡献内容？请查看[贡献教程](/contributing)。

:::

:::note

本指南已在通过[手动安装](/getting-started/)设置的 Open WebUI 上验证。

:::

## 使用 IPEX-LLM 在 Intel GPU 上设置本地 LLM {#local-llm-setup-with-ipex-llm-on-intel-gpu}

:::info

[**IPEX-LLM**](https://github.com/intel-analytics/ipex-llm) 是一个 PyTorch 库，可在 Intel CPU 和 GPU（例如配备 iGPU 的本地 PC，以及 Arc A 系列、Flex 和 Max 等独立 GPU）上以极低延迟运行 LLM。

:::

本教程演示如何设置 Open WebUI，使其使用**由 Intel GPU 托管并经 IPEX-LLM 加速的 Ollama 后端**。按照本指南操作，即使在低成本 PC（即仅配备集成 GPU）上，也能流畅地使用 Open WebUI。

## 在 Intel GPU 上启动 Ollama Serve {#start-ollama-serve-on-intel-gpu}

有关如何在 Intel GPU 上安装和运行由 IPEX-LLM 加速的 Ollama serve，请参阅 IPEX-LLM 官方文档中的[本指南](https://ipex-llm.readthedocs.io/en/latest/doc/LLM/Quickstart/ollama_quickstart.html)。

:::tip

如果要从另一台计算机访问 Ollama 服务，请确保在执行 `ollama serve` 命令之前设置或导出环境变量 `OLLAMA_HOST=0.0.0.0`。

:::

## 配置 Open WebUI {#configure-open-webui}

通过**管理员面板 > 设置 > 连接**访问 Ollama 设置。默认情况下，**Ollama API** 连接 URL 为 `http://localhost:11434`（标准 Docker 镜像中为 `http://host.docker.internal:11434`），如下面的快照所示。要验证 Ollama 服务连接的状态，请点击 Ollama 连接上的**配置（Configure）**（齿轮图标），然后点击 URL 旁边的**验证连接（Verify Connection）**。如果 WebUI 无法与 Ollama 服务器建立连接，你会看到一条错误消息。

![Open WebUI Ollama 设置失败](https://llm-assets.readthedocs.io/en/latest/_images/open_webui_settings_0.png)

如果连接成功，你会看到 `Server connection verified` 消息，如下所示。

![Open WebUI Ollama 设置成功](https://llm-assets.readthedocs.io/en/latest/_images/open_webui_settings.png)

:::tip

如果要使用托管在其他 URL 上的 Ollama 服务器，请点击 Ollama 连接上的**配置（Configure）**，更改 **URL**，点击**验证连接（Verify Connection）**，然后点击**保存（Save）**。

:::
