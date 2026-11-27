---
sidebar_position: 2
title: "环境变量"
---

## 环境变量列表 {#environment-variables-list}

:::info

有关所有 Open WebUI 环境变量的完整列表，请参阅[环境变量配置](/reference/env-configuration)页面。

:::

以下是语音转文字（STT）和文字转语音（TTS）环境变量的摘要。

:::tip 界面配置
其中大多数设置也可以在**设置 → 音频（Settings → Audio）**（管理员区域）标签页中配置。环境变量仅设置初始值：Open WebUI 会在首次启动时存储这些值，此后将使用存储的值（包括在界面中保存的任何值），并忽略对变量的更改，除非设置 `ENABLE_PERSISTENT_CONFIG=false`。
:::

## 语音转文字（STT）环境变量 {#speech-to-text-stt-environment-variables}

### 预处理 {#preprocessing}

| 变量 | 说明 | 默认值 |
|----------|-------------|---------|
| `BYPASS_PYDUB_PREPROCESSING` | 在将音频发送到 STT 引擎之前，跳过基于 pydub 的预处理（MP3 转换、压缩、分块拆分）。适用于所有引擎。当上游提供方已经处理这些步骤，或主机上没有 ffmpeg 时很有用。 | `false`（在精简镜像上始终为 `true`） |

### 本地 Whisper {#local-whisper}

| 变量 | 说明 | 默认值 |
|----------|-------------|---------|
| `WHISPER_MODEL` | Whisper 模型大小 | `base` |
| `WHISPER_MODEL_DIR` | 存储 Whisper 模型文件的目录 | `{CACHE_DIR}/whisper/models` |
| `WHISPER_COMPUTE_TYPE` | 推理计算类型（请参阅下方说明） | `int8` |
| `WHISPER_LANGUAGE` | 强制用于本地 Whisper、OpenAI 和 Deepgram 引擎的 ISO 639-1 语言代码（为空时使用用户的“设置 > 音频”语言，未设置则自动检测） | 空 |
| `WHISPER_MULTILINGUAL` | 使用多语言 Whisper 模型 | `false` |
| `WHISPER_MODEL_AUTO_UPDATE` | 自动下载模型更新 | `false` |
| `WHISPER_VAD_FILTER` | 启用语音活动检测过滤器 | `false` |

:::info WHISPER_COMPUTE_TYPE 选项
- `int8`：CPU 默认值，速度最快，但可能无法在较旧的 GPU 上工作
- `float16`：**建议用于 CUDA/GPU**
- `int8_float16`：混合模式（int8 权重，float16 计算）
- `float32`：兼容性最好，速度最慢

如果将 `:cuda` Docker 镜像与较旧的 GPU 一起使用，请设置 `WHISPER_COMPUTE_TYPE=float16` 以避免错误。
:::

### OpenAI 兼容 STT {#openai-compatible-stt}

| 变量 | 说明 | 默认值 |
|----------|-------------|---------|
| `AUDIO_STT_ENGINE` | STT 引擎：空（本地 Whisper）、`openai`、`web`（在浏览器中识别语音，不调用服务器）、`azure`、`deepgram`、`mistral` | 空 |
| `AUDIO_STT_MODEL` | 外部提供方的 STT 模型 | 空 |
| `AUDIO_STT_OPENAI_API_BASE_URL` | OpenAI 兼容 API 基础 URL | `https://api.openai.com/v1` |
| `AUDIO_STT_OPENAI_API_KEY` | OpenAI API 密钥 | 与 `https://api.openai.com/v1` 配套的 `OPENAI_API_KEY`，否则为空 |
| `AUDIO_STT_OPENAI_API_REQUEST_FORMAT` | `multipart`（文件上传）或 `json`（JSON 正文中的 base64 音频）；管理员界面字段为“请求格式（Request Format）” | `multipart` |
| `AUDIO_STT_SUPPORTED_CONTENT_TYPES` | 支持的音频 MIME 类型列表，以逗号分隔 | 空 |

### Azure STT {#azure-stt}

有关设置方法，请参阅 [Azure AI Speech STT 指南](/features/chat-conversations/audio/speech-to-text/azure-stt-integration)。

| 变量 | 说明 | 默认值 |
|----------|-------------|---------|
| `AUDIO_STT_AZURE_API_KEY` | Azure Cognitive Services API 密钥 | 空 |
| `AUDIO_STT_AZURE_REGION` | Azure 区域 | 空，即使用 `eastus` |
| `AUDIO_STT_AZURE_LOCALES` | 以逗号分隔的区域设置，不带空格（例如 `en-US,de-DE`） | 空，即发送内置的 13 个区域设置列表 |
| `AUDIO_STT_AZURE_BASE_URL` | 自定义 Azure 基础 URL（可选） | 空 |
| `AUDIO_STT_AZURE_MAX_SPEAKERS` | 说话人分离的最大说话人数 | 空，即使用 `3` |

### Deepgram STT {#deepgram-stt}

| 变量 | 说明 | 默认值 |
|----------|-------------|---------|
| `DEEPGRAM_API_KEY` | Deepgram API 密钥 | 空 |

### Mistral STT {#mistral-stt}

| 变量 | 说明 | 默认值 |
|----------|-------------|---------|
| `AUDIO_STT_MISTRAL_API_KEY` | Mistral API 密钥 | 空 |
| `AUDIO_STT_MISTRAL_API_BASE_URL` | Mistral API 基础 URL | `https://api.mistral.ai/v1` |
| `AUDIO_STT_MISTRAL_USE_CHAT_COMPLETIONS` | 使用聊天补全终结点 | `false` |

## 文字转语音（TTS）环境变量 {#text-to-speech-tts-environment-variables}

### 通用 TTS {#general-tts}

| 变量 | 说明 | 默认值 |
|----------|-------------|---------|
| `AUDIO_TTS_ENGINE` | TTS 引擎：空（通过 Web Speech API 在浏览器中合成语音）、`openai`、`openai-realtime`、`mistral`、`elevenlabs`、`azure`、`transformers` | 空 |
| `AUDIO_TTS_MODEL` | TTS 模型 | `tts-1` |
| `AUDIO_TTS_VOICE` | 默认声音 | `alloy` |
| `AUDIO_TTS_SPLIT_ON` | 文本拆分方式：`punctuation`、`paragraphs` 或 `none` | `punctuation` |
| `AUDIO_TTS_API_KEY` | ElevenLabs 或 Azure TTS 的 API 密钥 | 空 |

### OpenAI 兼容 TTS {#openai-compatible-tts}

| 变量 | 说明 | 默认值 |
|----------|-------------|---------|
| `AUDIO_TTS_OPENAI_API_BASE_URL` | OpenAI 兼容 TTS API 基础 URL | `https://api.openai.com/v1` |
| `AUDIO_TTS_OPENAI_API_KEY` | OpenAI TTS API 密钥 | 与 `https://api.openai.com/v1` 配套的 `OPENAI_API_KEY`，否则为空 |
| `AUDIO_TTS_OPENAI_PARAMS` | OpenAI TTS 的附加 JSON 参数 | 空 |
| `REALTIME_TTS_PROMPT_TEMPLATE` | 当 `AUDIO_TTS_ENGINE` 为 `openai-realtime` 时提供给模型的指令 | 空（内置提示词） |

### Mistral TTS {#mistral-tts}

| 变量 | 说明 | 默认值 |
|----------|-------------|---------|
| `AUDIO_TTS_MISTRAL_API_KEY` | Mistral TTS API 密钥 | 空 |
| `AUDIO_TTS_MISTRAL_API_BASE_URL` | Mistral API 基础 URL | `https://api.mistral.ai/v1` |

:::info
当 `AUDIO_TTS_ENGINE=mistral` 且 `AUDIO_TTS_MODEL` 为空时，Open WebUI 使用 `voxtral-mini-tts-2603`。
:::

### Azure TTS {#azure-tts}

有关设置方法，请参阅 [Azure AI Speech TTS 指南](/features/chat-conversations/audio/text-to-speech/azure-tts-integration)。

| 变量 | 说明 | 默认值 |
|----------|-------------|---------|
| `AUDIO_TTS_AZURE_SPEECH_REGION` | Azure Speech 区域 | 空（语音使用 `eastus`；未设置基础 URL 时，不会加载声音列表） |
| `AUDIO_TTS_AZURE_SPEECH_BASE_URL` | 自定义 Azure Speech 基础 URL（可选） | 空 |
| `AUDIO_TTS_AZURE_SPEECH_OUTPUT_FORMAT` | 音频输出格式 | `audio-24khz-160kbitrate-mono-mp3` |

## 实时语音通话环境变量 {#realtime-voice-calls-environment-variables}

这些变量用于配置[语音模式](/features/chat-conversations/chat-features/voice-mode#realtime-calls)的**实时（Realtime）**通话模式。有关详细信息，请参阅环境变量参考中的[实时语音通话](/reference/env-configuration#realtime-voice-calls)。

| 变量 | 说明 | 默认值 |
|----------|-------------|---------|
| [`AUDIO_REALTIME_ENABLED`](/reference/env-configuration#audio_realtime_enabled) | 通话模式：`true` 表示**实时（Realtime）**，`false` 表示**标准（Standard）** | `false` |
| [`AUDIO_REALTIME_PROVIDER`](/reference/env-configuration#audio_realtime_provider) | 提供方：`openai` 表示 OpenAI 或兼容服务器，`azure` 表示 Azure OpenAI | `openai` |
| [`AUDIO_REALTIME_AUTH_TYPE`](/reference/env-configuration#audio_realtime_auth_type) | 身份验证：`api_key`，或 Azure 提供方使用的 `microsoft_entra_id` | `api_key` |
| [`AUDIO_REALTIME_OPENAI_API_BASE_URL`](/reference/env-configuration#audio_realtime_openai_api_base_url) | Realtime API 基础 URL，或后接 `/openai/v1` 的 Azure 终结点 | `https://api.openai.com/v1` |
| [`AUDIO_REALTIME_OPENAI_API_KEY`](/reference/env-configuration#audio_realtime_openai_api_key) | Realtime API 密钥 | 空 |
| [`AUDIO_REALTIME_MODEL`](/reference/env-configuration#audio_realtime_model) | 实时语音模型，或 Azure 上的部署名称 | `gpt-realtime-2.1-mini` |
| [`AUDIO_REALTIME_VOICE`](/reference/env-configuration#audio_realtime_voice) | 语音模型的默认声音 | `marin` |
| [`AUDIO_REALTIME_TRANSCRIPTION_MODEL`](/reference/env-configuration#audio_realtime_transcription_model) | 转录用户语音的模型 | `gpt-transcribe` |
| [`AUDIO_REALTIME_INPUT_PARAMS`](/reference/env-configuration#audio_realtime_input_params) | 作为 JSON 对象的额外音频输入设置，例如降噪 | 空 |
| [`REALTIME_CALL_PROMPT_TEMPLATE`](/reference/env-configuration#realtime_call_prompt_template) | 提供给语音模型的指令 | 空（内置提示词） |

## 音频配置提示 {#tips-for-configuring-audio}

### 使用本地 Whisper STT {#using-local-whisper-stt}

对于 GPU 加速问题或较旧的 GPU，请尝试设置：
```yaml
environment:
  - WHISPER_COMPUTE_TYPE=float16
```

### 使用外部 TTS 服务 {#using-external-tts-services}

在 Docker 中运行 Open WebUI 并使用外部 TTS 服务时：

```yaml
environment:
  - AUDIO_TTS_ENGINE=openai
  - AUDIO_TTS_OPENAI_API_BASE_URL=http://host.docker.internal:5050/v1
  - AUDIO_TTS_OPENAI_API_KEY=your-api-key
```

:::tip
在 Docker Desktop（Windows/Mac）上，使用 `host.docker.internal` 访问主机上的服务。在 Linux 上，使用主机 IP 或容器网络。
:::

有关音频问题的故障排除，请参阅[音频故障排除指南](/troubleshooting/audio)。
