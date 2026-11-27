---
sidebar_position: 3
title: "自托管语音转文字"
description: "将 Open WebUI 连接到自托管的 OpenAI 兼容转录服务器。"
---

# 自托管语音转文字

Open WebUI 可以将录音发送到实现 OpenAI 兼容 `/v1/audio/transcriptions` 终结点的自托管服务器。本指南使用 LocalAI 和原版 Whisper base 模型。服务器负责转录音频；Open WebUI 负责录音，并将返回的文本插入聊天输入框。

:::warning

本教程由社区贡献，不受 Open WebUI 团队支持。它仅用于演示如何针对你的特定用例自定义 Open WebUI。想要贡献内容？请查看[贡献教程](/tutorials/contributing-tutorial)。

:::

## 配置 Open WebUI {#configure-open-webui}

转录服务器运行后，打开**设置 > 音频（Settings > Audio）**（管理员区域）并设置：

| 设置 | 下方 LocalAI 示例所用的值 |
|---------|------------------------------------|
| **语音转文字引擎（Speech-to-Text Engine）** | `OpenAI` |
| **API 基础 URL（API Base URL）** | 两个应用直接运行在同一主机上时为 `http://127.0.0.1:8081/v1` |
| **API 密钥（API Key）** | 你在 `LOCALAI_API_KEY` 中设置的密钥 |
| **请求格式（Request Format）** | `Multipart Upload` |
| **STT 模型（STT Model）** | `whisper-1` |

点击**保存（Save）**。在你的用户音频设置中，将**语音转文字引擎（Speech-to-Text Engine）**保持为**默认（Default）**，以便录音使用管理员配置的服务器。

`OpenAI` 引擎用于选择 API 协议。使用此基础 URL 时，请求会发送到你的 LocalAI 服务器。你不需要 OpenAI 账户或 OpenAI API 密钥。模型名称必须与转录服务器提供的名称一致。

:::important 服务器地址

Open WebUI 的后端会发出转录请求。请使用该后端可以访问的地址，它可能不同于浏览器中的地址。在容器中，`127.0.0.1` 指该容器本身。

| 部署方式 | API 基础 URL 示例 |
|------------|----------------------|
| 两个应用直接运行在同一主机上 | `http://127.0.0.1:8081/v1` |
| 两个容器共享一个 Docker 网络，LocalAI 使用服务名 `localai` 并监听 8080 端口 | `http://localai:8080/v1` |
| Open WebUI 在 Docker Desktop 中运行，LocalAI 在可访问的主机接口上监听 8081 端口 | `http://host.docker.internal:8081/v1` |

容器可能无法访问仅绑定到 `127.0.0.1` 的主机服务。更改绑定地址之前，请查阅容器平台的网络文档；允许其他主机访问 LocalAI 时，请保留身份验证。

:::

## 启动 LocalAI 转录服务器 {#start-a-localai-transcription-server}

在服务器上安装 [LocalAI](https://localai.io/docs/installation/) 和 FFmpeg。对于原生安装，以下命令会安装 Whisper 后端和 `whisper-1` 模型库模型，然后在 8081 端口启动一台需要身份验证的服务器：

```bash
mkdir -p models backends
local-ai backends install whisper --backends-path ./backends
local-ai models install whisper-1 --models-path ./models --backends-path ./backends

export LOCALAI_API_KEY='replace-with-your-own-secret'
local-ai run --address 127.0.0.1:8081 --models-path ./models --backends-path ./backends
```

LocalAI 的 [`whisper-1` 模型库条目](https://github.com/mudler/LocalAI/blob/master/gallery/index.yaml)通过 `whisper.cpp` 使用 Whisper base 模型。该名称是本地 API 标识符。其他自托管服务器可能使用不同名称，或需要不同的安装步骤。

配置 Open WebUI 之前，请从可以访问 LocalAI 的机器测试一段短录音：

```bash
curl --fail-with-body http://127.0.0.1:8081/v1/audio/transcriptions \
  -H "Authorization: Bearer $LOCALAI_API_KEY" \
  -F model=whisper-1 \
  -F file=@recording.wav \
  -F response_format=json
```

响应应包含带有转录文本的 `text` 字段。LocalAI 也接受 FFmpeg 支持的格式，包括浏览器录制的 WebM。有关后端专属选项，请参阅 [LocalAI 转录文档](https://localai.io/docs/features/audio-to-text/)。

## 环境变量 {#environment-variables}

对于全新的 Open WebUI 配置，可以通过环境变量设置相同的值：

```bash
AUDIO_STT_ENGINE=openai
AUDIO_STT_OPENAI_API_BASE_URL=http://127.0.0.1:8081/v1
AUDIO_STT_OPENAI_API_KEY=replace-with-your-own-secret
AUDIO_STT_MODEL=whisper-1
```

请使用你的部署可访问的基础 URL，并采用与 LocalAI 相同的密钥。Open WebUI 数据库中已保存的现有设置可能会覆盖这些初始值；重启后请检查**设置 > 音频（Settings > Audio）**（管理员区域）。

## 测试与故障排除 {#test-and-troubleshoot}

点击聊天输入框中的麦克风，录制一个短句，然后结束录音。转录文本应显示在输入框中。浏览器录音需要麦克风权限和安全上下文，例如 HTTPS 或 localhost。

- **连接被拒绝或超时：** 从 Open WebUI 后端所在的主机或容器检查地址。确认 LocalAI 正在可访问的接口和端口上监听。
- **401 或 403：** 检查已保存的 STT API 密钥是否与 LocalAI 的密钥匹配。
- **未找到模型：** 使用相同的授权请求头，通过 `GET /v1/models` 检查已安装的模型名称。
- **404：** 将 API 基础 URL 设为以 `/v1` 结尾，而不是 `/v1/audio/transcriptions`；Open WebUI 会追加终结点路径。
- **音频解码错误：** 验证 LocalAI 是否可以使用 FFmpeg，并尝试通过 `curl` 命令直接发送 WAV 文件。对于浏览器录音，还要检查 Open WebUI 允许的扩展名和内容类型是否包含浏览器发送的格式。

以上配置针对录音语音转文字，不会配置文字转语音或实时语音 API。
