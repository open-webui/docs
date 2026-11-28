---
sidebar_position: 2
title: "Mistral TTS 集成"
---

# 使用 Mistral 进行文本转语音

本指南介绍如何在 Open WebUI 中使用 Mistral 的文本转语音 API。

:::tip 需要 STT？
请参阅配套指南：[使用 Mistral Voxtral 进行语音转文本](/features/chat-conversations/audio/speech-to-text/mistral-voxtral-integration)
:::

## 前提条件 {#requirements}

- 一个 Mistral API 密钥
- 已安装并运行 Open WebUI

## 快速设置（界面） {#quick-setup-ui}

1. 点击你的**个人资料图标**（左下角）
2. 选择**管理员面板（Admin Panel）**
3. 点击**设置（Settings）** -> **音频（Audio）**选项卡
4. 配置以下内容：

| 设置 | 值 |
|---------|-------|
| **文本转语音引擎（Text-to-Speech Engine）** | `MistralAI` |
| **API 基础 URL（API Base URL）** | `https://api.mistral.ai/v1` |
| **API 密钥（API Key）** | 你的 Mistral API 密钥 |
| **TTS 模型（TTS Model）** | `voxtral-tts-26-03`（或留空以使用内置默认值） |
| **TTS 语音（TTS Voice）** | 从可用语音中选择 |

5. 点击**保存（Save）**

## 可用模型 {#available-models}

| 模型 | 说明 |
|-------|-------------|
| `voxtral-tts-26-03` | Voxtral TTS——Mistral 当前的文本转语音模型，支持零样本语音克隆 |

:::info
如果 `AUDIO_TTS_MODEL` 为空，Open WebUI 会回退到 `voxtral-mini-tts-2603`。选择 **MistralAI** 作为引擎时会自动填入该模型。
:::

## 环境变量设置 {#environment-variables-setup}

如果希望通过环境变量进行配置：

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      - AUDIO_TTS_ENGINE=mistral
      - AUDIO_TTS_MISTRAL_API_KEY=your-mistral-api-key
      - AUDIO_TTS_MISTRAL_API_BASE_URL=https://api.mistral.ai/v1
      - AUDIO_TTS_MODEL=voxtral-tts-26-03
      - AUDIO_TTS_VOICE=<voice-id>
    # ... 其他配置
```

### 所有 Mistral TTS 环境变量 {#all-mistral-tts-environment-variables}

| 变量 | 说明 | 默认值 |
|----------|-------------|---------|
| `AUDIO_TTS_ENGINE` | 设置为 `mistral` | 空（仅使用浏览器 TTS） |
| `AUDIO_TTS_MISTRAL_API_KEY` | 你的 Mistral API 密钥 | 空 |
| `AUDIO_TTS_MISTRAL_API_BASE_URL` | Mistral API 基础 URL | `https://api.mistral.ai/v1` |
| `AUDIO_TTS_MODEL` | TTS 模型 | `tts-1`（与 OpenAI 引擎共用，因此应设置 Mistral 模型；仅当该值为空时才使用 `voxtral-mini-tts-2603`） |
| `AUDIO_TTS_VOICE` | 语音 ID | `alloy`（请设置 Mistral 语音 ID，否则请求会携带 `alloy` 发出） |

## 选择语音 {#choosing-voices}

Open WebUI 会查询配置的 Mistral 终结点以获取可用语音，并将其显示在 **TTS 语音**选择器中。

如果未列出语音：
- 确认 API 密钥有效
- 确认 Open WebUI 服务器或容器可以访问 API 基础 URL
- 检查日志中的 `/audio/voices` 请求错误

## 测试 TTS {#testing-tts}

1. 开始新聊天
2. 向任意模型发送一条消息
3. 点击 AI 回复上的**扬声器图标**，即可听其朗读

## 故障排除 {#troubleshooting}

### “Mistral API key is required for Mistral TTS” {#mistral-api-key-is-required-for-mistral-tts}

1. 确认已设置 `AUDIO_TTS_MISTRAL_API_KEY`（或已在管理员音频设置中输入）
2. 保存设置后重试

### 下拉列表中未显示语音 {#no-voices-shown-in-the-dropdown}

1. 确认 Open WebUI 可以通过网络访问 `AUDIO_TTS_MISTRAL_API_BASE_URL`
2. 检查 Open WebUI 日志中的 Mistral 语音列表错误
3. 确认你的密钥具有访问 Mistral 音频 API 的权限

### TTS 请求失败 {#tts-request-fails}

1. 确认 `AUDIO_TTS_ENGINE=mistral`
2. 将模型显式设置为当前 ID，例如 `voxtral-tts-26-03`
3. 尝试使用获取到的列表中的另一个语音 ID

如需更全面的音频调试，请参阅[音频故障排除指南](/troubleshooting/audio)。
