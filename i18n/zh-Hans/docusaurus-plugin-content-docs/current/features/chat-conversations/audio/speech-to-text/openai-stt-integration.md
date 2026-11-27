---
sidebar_position: 0
title: "OpenAI STT 集成"
---

# 使用 OpenAI 进行语音转文字

本指南介绍如何在 Open WebUI 中使用 OpenAI 的 Whisper API 进行语音转文字。它提供基于云的转录，无需本地 GPU 资源。

:::tip 正在寻找 TTS？
请参阅配套指南：[使用 OpenAI 进行文字转语音](/features/chat-conversations/audio/text-to-speech/openai-tts-integration)
:::

## 前提条件 {#requirements}

- 一个拥有 Audio API 访问权限的 OpenAI API 密钥
- 已安装并运行 Open WebUI

## 快速设置（界面） {#quick-setup-ui}

1. 点击你的**个人资料图标**（左下角）
2. 选择**管理员面板（Admin Panel）**
3. 点击**设置（Settings）** → **音频（Audio）**标签页
4. 配置以下内容：

| 设置 | 值 |
|---------|-------|
| **语音转文字引擎（Speech-to-Text Engine）** | `OpenAI` |
| **API 基础 URL（API Base URL）** | `https://api.openai.com/v1` |
| **API 密钥（API Key）** | 你的 OpenAI API 密钥 |
| **STT 模型（STT Model）** | `gpt-transcribe` |
| **支持的 MIME 类型（Supported MIME Types）** | 留空以使用运行时默认值 `audio/*,video/webm`，或设为 `audio/wav,audio/mpeg,audio/webm` |

5. 点击**保存（Save）**

## 可用模型 {#available-models}

| 模型 | 说明 |
|-------|-------------|
| `gpt-transcribe` | 当前 OpenAI 转录模型（推荐）——词错误率约为 `whisper-1` 的一半 |
| `gpt-live-transcribe` | 低延迟流式转录 |
| `whisper-1` | 旧版 Whisper large-v2 模型，将于 2027-02-26 停用 |

:::info
OpenAI 建议新部署使用 `gpt-transcribe`。`AUDIO_STT_MODEL` 默认为空，因此请明确设置模型。如需完全在本地转录，请使用本地 Whisper（内置于 Open WebUI）或 Deepgram 等其他提供方。
:::

:::caution OpenAI 正在停用旧版转录模型
OpenAI 将于 2027-02-26 从其 API 中移除 `whisper-1`、`gpt-4o-transcribe`、`gpt-4o-mini-transcribe` 和 `gpt-4o-transcribe-diarize`。如果 **STT 模型（STT Model）**设为其中之一，请在截止日期前切换到 `gpt-transcribe`。有关详细信息，请参阅 [OpenAI 弃用页面](https://developers.openai.com/api/docs/deprecations#2026-08-26-transcription-models)。
:::

## 通过环境变量设置 {#environment-variables-setup}

如果你更喜欢通过环境变量进行配置：

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      - AUDIO_STT_ENGINE=openai
      - AUDIO_STT_OPENAI_API_BASE_URL=https://api.openai.com/v1
      - AUDIO_STT_OPENAI_API_KEY=sk-...
      - AUDIO_STT_MODEL=gpt-transcribe
    # ... 其他配置
```

### 所有 STT 环境变量（OpenAI） {#all-stt-environment-variables-openai}

| 变量 | 说明 | 默认值 |
|----------|-------------|---------|
| `AUDIO_STT_ENGINE` | 设为 `openai` | 空（使用本地 Whisper） |
| `AUDIO_STT_OPENAI_API_BASE_URL` | OpenAI API 基础 URL | `https://api.openai.com/v1` |
| `AUDIO_STT_OPENAI_API_KEY` | 你的 OpenAI API 密钥 | 空 |
| `AUDIO_STT_MODEL` | STT 模型 | 空 |
| `AUDIO_STT_SUPPORTED_CONTENT_TYPES` | 允许的音频 MIME 类型 | `audio/*,video/webm` |

### 支持的音频格式 {#supported-audio-formats}

默认情况下，Open WebUI 接受 `audio/*` 和 `video/webm` 用于转录。如果需要限制或扩展支持的格式，请设置 `AUDIO_STT_SUPPORTED_CONTENT_TYPES`：

```yaml
environment:
  - AUDIO_STT_SUPPORTED_CONTENT_TYPES=audio/wav,audio/mpeg,audio/webm
```

OpenAI 的 Whisper API 支持：`mp3`、`mp4`、`mpeg`、`mpga`、`m4a`、`wav`、`webm`

## 使用语音转文字 {#using-stt}

1. 点击聊天输入框中的**麦克风图标**
2. 说出你的消息
3. 再次点击麦克风，或等待系统检测到静默
4. 你的语音将被转录并显示在输入框中

## OpenAI 与本地 Whisper {#openai-vs-local-whisper}

| 功能 | OpenAI Whisper API | 本地 Whisper |
|---------|-------------------|---------------|
| **延迟** | 取决于网络 | 处理短音频时更快 |
| **费用** | 按分钟计费 | 免费（使用你的硬件） |
| **隐私** | 音频发送到 OpenAI | 音频保留在本地 |
| **需要 GPU** | 否 | 建议使用以提高速度 |
| **模型选项** | `gpt-transcribe`、`gpt-live-transcribe`、`whisper-1` | tiny、base、small、medium、large |

在以下情况下选择 **OpenAI**：
- 你没有 GPU
- 你希望获得一致的性能
- 隐私不是主要顾虑

在以下情况下选择**本地 Whisper（Local Whisper）**：
- 你希望免费转录
- 你需要让音频保持私密
- 你拥有用于加速的 GPU

## 故障排除 {#troubleshooting}

### 麦克风不工作 {#microphone-not-working}

1. 确保使用 HTTPS 或 localhost
2. 检查浏览器麦克风权限
3. 请参阅[麦克风访问问题](/troubleshooting/audio#microphone-access-issues)

### 转录错误 {#transcription-errors}

1. 检查 OpenAI API 密钥是否有效
2. 验证 API 基础 URL 是否正确
3. 检查容器日志中的错误消息
4. 如果 API 基础 URL 指向另一个 OpenAI 兼容服务，请将 **STT 模型（STT Model）**设为该服务支持的模型 ID
5. 如果错误提到 `response_format`，请参阅[代理后的 OpenAI 兼容 STT 失败](/troubleshooting/audio#openai-compatible-stt-fails-behind-a-proxy)

### 语言问题 {#language-issues}

Open WebUI 会发送“设置 > 音频 > 语言（Settings > Audio > Language）”中的语言；如果设置了 `WHISPER_LANGUAGE`，则使用该变量的值（它也适用于本地 Whisper 和 Deepgram）。请求失败时，Open WebUI 会不携带语言参数重试。将两者都留空可让 OpenAI 检测语言。

更多故障排除信息，请参阅[音频故障排除指南](/troubleshooting/audio)。

## 费用注意事项 {#cost-considerations}

OpenAI 按音频分钟数收取 STT 费用。有关当前费率，请参阅 [OpenAI 定价](https://platform.openai.com/docs/pricing)。

:::tip
如需免费语音转文字，请使用**本地 Whisper（Local Whisper）**（默认）或浏览器的 **Web API** 进行基本转录。
:::
