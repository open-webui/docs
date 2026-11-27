---
sidebar_position: 2
title: "Mistral Voxtral 语音转文字"
---

# 使用 Mistral Voxtral 进行语音转文字

本指南介绍如何在 Open WebUI 中使用 Mistral 的 Voxtral 模型进行语音转文字。Voxtral 是 Mistral 的语音转文字模型，可提供准确的转录。

:::tip 正在寻找 TTS？
请参阅配套指南：[使用 Mistral 进行文字转语音](/features/chat-conversations/audio/text-to-speech/mistral-tts-integration)
:::

## 前提条件 {#requirements}

- 一个 Mistral API 密钥
- 已安装并运行 Open WebUI

## 快速设置（界面） {#quick-setup-ui}

1. 点击你的**个人资料图标**（左下角）
2. 选择**管理员面板（Admin Panel）**
3. 点击**设置（Settings）** → **音频（Audio）**标签页
4. 配置以下内容：

| 设置 | 值 |
|---------|-------|
| **语音转文字引擎（Speech-to-Text Engine）** | `MistralAI` |
| **API 密钥（API Key）** | 你的 Mistral API 密钥 |
| **STT 模型（STT Model）** | `voxtral-mini-2602`（留空会回退到 `voxtral-mini-latest`，Mistral 可能已不再提供此别名，因此请明确设置模型） |

5. 点击**保存（Save）**

## 可用模型 {#available-models}

| 模型 | 说明 |
|-------|-------------|
| `voxtral-mini-2602` | Voxtral Mini Transcribe 2——当前转录模型（推荐） |

:::caution 明确设置模型
Mistral 不再发布 `voxtral-mini-latest` 等 `-latest` 别名。请使用 [Mistral 模型概览](https://docs.mistral.ai/getting-started/models/models_overview/)中的带日期 ID。
:::

## 通过环境变量设置 {#environment-variables-setup}

如果你更喜欢通过环境变量进行配置：

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      - AUDIO_STT_ENGINE=mistral
      - AUDIO_STT_MISTRAL_API_KEY=your-mistral-api-key
      - AUDIO_STT_MODEL=voxtral-mini-2602
    # ... 其他配置
```

### 所有 Mistral STT 环境变量 {#all-mistral-stt-environment-variables}

| 变量 | 说明 | 默认值 |
|----------|-------------|---------|
| `AUDIO_STT_ENGINE` | 设为 `mistral` | 空（使用本地 Whisper） |
| `AUDIO_STT_MISTRAL_API_KEY` | 你的 Mistral API 密钥 | 空 |
| `AUDIO_STT_MISTRAL_API_BASE_URL` | Mistral API 基础 URL | `https://api.mistral.ai/v1` |
| `AUDIO_STT_MISTRAL_USE_CHAT_COMPLETIONS` | 使用聊天补全终结点 | `false` |
| `AUDIO_STT_MODEL` | STT 模型 | 空（请求时使用 `voxtral-mini-latest`） |

## 转录方式 {#transcription-methods}

Mistral 支持两种转录方式：

### 标准转录（默认） {#standard-transcription-default}
使用专用转录终结点。这是推荐方式。

### 聊天补全方式 {#chat-completions-method}
在管理员**音频（Audio）**设置中开启**使用聊天补全 API（Use Chat Completions API）**，或设置 `AUDIO_STT_MISTRAL_USE_CHAT_COMPLETIONS=true`，即可使用 Mistral 的聊天补全 API 进行转录。仅当**语音转文字引擎（Speech-to-Text Engine）**为 `MistralAI` 时才显示此开关。

随后，Open WebUI 会向 `<API Base URL>/chat/completions` 发送 POST 请求，而不是 `<API Base URL>/audio/transcriptions`。请求将 **STT 模型（STT Model）**作为 `model` 发送，并发送一条由两部分组成的用户消息：base64 编码的 `input_audio` 音频，以及指令 `Transcribe this audio exactly as spoken in its original language. Do not translate it to another language.`。如果在你的**设置 > 音频（Settings > Audio）**中设置了**语言（Language）**，指令会变为 `Transcribe this audio exactly as spoken in <language>. Do not translate it.`。Open WebUI 使用回复的消息内容作为转录文本，因此请将 **STT 模型（STT Model）**设为在聊天补全终结点上接受音频输入的 Mistral 模型。

此方式：
- 原样发送 FLAC、M4A、MP3、MP4、MPEG、WAV 和 WebM 音频；其他格式以及 MP4 容器中的 AAC 音频会先转换为 MP3。启用 [`BYPASS_PYDUB_PREPROCESSING`](/reference/env-configuration#bypass_pydub_preprocessing) 时不进行任何转换，精简镜像始终启用该变量
- 可能提供与标准终结点不同的结果

## 使用语音转文字 {#using-stt}

1. 点击聊天输入框中的**麦克风图标**
2. 说出你的消息
3. 再次点击麦克风，或等待系统检测到静默
4. 你的语音将被转录并显示在输入框中

## 支持的音频格式 {#supported-audio-formats}

Voxtral 接受常见的音频格式。系统默认接受 `audio/*` 和 `video/webm`。

使用聊天补全方式时，音频会自动转换为 mp3。

## 故障排除 {#troubleshooting}

### API 密钥错误 {#api-key-errors}

如果看到“Mistral API key is required”：
1. 验证 API 密钥是否输入正确
2. 检查 API 密钥是否已过期
3. 确保你的 Mistral 账户拥有 API 访问权限

### 转录不工作 {#transcription-not-working}

1. 检查容器日志：`docker logs open-webui -f`
2. 验证 STT 引擎是否设为 `MistralAI`
3. 尝试标准转录方式（禁用聊天补全）
4. 如果错误为 `Failed to parse Mistral response: Empty transcript in response`，表示回复中没有文本。开启**使用聊天补全 API（Use Chat Completions API）**时，请尝试其他 **STT 模型（STT Model）**或关闭该开关

### 音频格式问题 {#audio-format-issues}

如果使用聊天补全方式时音频转换失败，错误为 `Audio conversion failed. Chat completions API requires mp3 or wav format.`。在设置了 `USE_SLIM_DOCKER=true` 的镜像上，Open WebUI 不会为这种方式转换音频；如果音频到达时不是 `.mp3` 或 `.wav` 文件，则会失败并显示 `Mistral chat transcription requires MP3 or WAV in slim; local conversion is unavailable.`。要解决任一错误：
- 确保容器中提供了 FFmpeg
- 尝试以其他格式（wav 或 mp3）录音
- 切换到标准转录方式

更多故障排除信息，请参阅[音频故障排除指南](/troubleshooting/audio)。

## 与其他 STT 选项的比较 {#comparison-with-other-stt-options}

| 功能 | Mistral Voxtral | OpenAI Whisper | 本地 Whisper |
|---------|-----------------|----------------|---------------|
| **费用** | 按分钟计费 | 按分钟计费 | 免费 |
| **隐私** | 音频发送到 Mistral | 音频发送到 OpenAI | 音频保留在本地 |
| **模型选项** | `voxtral-mini-2602` | `gpt-transcribe`、`whisper-1` | tiny → large |
| **需要 GPU** | 否 | 否 | 建议 |

## 费用注意事项 {#cost-considerations}

Mistral 按音频分钟数收取 STT 费用。请查看 [Mistral 定价页](https://mistral.ai/products/la-plateforme#pricing)了解当前费率。

:::tip
如需免费语音转文字，请使用**本地 Whisper（Local Whisper）**（默认）或浏览器的 **Web API** 进行基本转录。
:::
