---
sidebar_position: 2
title: "Environment Variables"
---

## Environment Variables List

:::info

For a complete list of all Open WebUI environment variables, see the [Environment Variable Configuration](https://docs.openwebui.com/reference/env-configuration) page.

:::

The following is a summary of the environment variables for speech to text (STT) and text to speech (TTS).

:::tip UI Configuration
Most of these settings can also be configured in the **Admin Panel → Settings → Audio** tab. Environment variables take precedence on startup but can be overridden in the UI.
:::

## Speech To Text (STT) Environment Variables

### Local Whisper

| Variable | Description | Default |
|----------|-------------|---------|
| `WHISPER_MODEL` | Whisper model size | `base` |
| `WHISPER_MODEL_DIR` | Directory to store Whisper model files | `{CACHE_DIR}/whisper/models` |
| `WHISPER_COMPUTE_TYPE` | Compute type for inference (see note below) | `int8` |
| `WHISPER_LANGUAGE` | ISO 639-1 language code (empty = auto-detect) | empty |
| `WHISPER_MULTILINGUAL` | Use the multilingual Whisper model | `false` |
| `WHISPER_MODEL_AUTO_UPDATE` | Auto-download model updates | `false` |
| `WHISPER_VAD_FILTER` | Enable Voice Activity Detection filter | `false` |

:::info WHISPER_COMPUTE_TYPE Options
- `int8` — CPU default, fastest but may not work on older GPUs
- `float16` — **Recommended for CUDA/GPU**
- `int8_float16` — Hybrid mode (int8 weights, float16 computation)
- `float32` — Maximum compatibility, slowest

If using the `:cuda` Docker image with an older GPU, set `WHISPER_COMPUTE_TYPE=float16` to avoid errors.
:::

### OpenAI-Compatible STT

| Variable | Description | Default |
|----------|-------------|---------|
| `AUDIO_STT_ENGINE` | STT engine: empty (local Whisper), `openai`, `azure`, `deepgram`, `mistral`, `gladia` | empty |
| `AUDIO_STT_MODEL` | STT model for external providers | empty |
| `AUDIO_STT_OPENAI_API_BASE_URL` | OpenAI-compatible API base URL | `https://api.openai.com/v1` |
| `AUDIO_STT_OPENAI_API_KEY` | OpenAI API key | empty |
| `AUDIO_STT_SUPPORTED_CONTENT_TYPES` | Comma-separated list of supported audio MIME types | empty |

### Azure STT

| Variable | Description | Default |
|----------|-------------|---------|
| `AUDIO_STT_AZURE_API_KEY` | Azure Cognitive Services API key | empty |
| `AUDIO_STT_AZURE_REGION` | Azure region | `eastus` |
| `AUDIO_STT_AZURE_LOCALES` | Comma-separated locales (e.g., `en-US,de-DE`) | auto |
| `AUDIO_STT_AZURE_BASE_URL` | Custom Azure base URL (optional) | empty |
| `AUDIO_STT_AZURE_MAX_SPEAKERS` | Max speakers for diarization | `3` |

### Deepgram STT

| Variable | Description | Default |
|----------|-------------|---------|
| `DEEPGRAM_API_KEY` | Deepgram API key | empty |

### Gladia STT

| Variable | Description | Default |
|----------|-------------|---------|
| `AUDIO_STT_GLADIA_API_KEY` | Gladia API key | empty |

### Mistral STT

| Variable | Description | Default |
|----------|-------------|---------|
| `AUDIO_STT_MISTRAL_API_KEY` | Mistral API key | empty |
| `AUDIO_STT_MISTRAL_API_BASE_URL` | Mistral API base URL | `https://api.mistral.ai/v1` |
| `AUDIO_STT_MISTRAL_USE_CHAT_COMPLETIONS` | Use chat completions endpoint | `false` |

## Text To Speech (TTS) Environment Variables

### General TTS

| Variable | Description | Default |
|----------|-------------|---------|
| `AUDIO_TTS_ENGINE` | TTS engine: empty (disabled), `openai`, `elevenlabs`, `azure`, `transformers` | empty |
| `AUDIO_TTS_MODEL` | TTS model | `tts-1` |
| `AUDIO_TTS_VOICE` | Default voice | `alloy` |
| `AUDIO_TTS_SPLIT_ON` | Split text on: `punctuation` or `none` | `punctuation` |
| `AUDIO_TTS_API_KEY` | API key for ElevenLabs or Azure TTS | empty |

### OpenAI-Compatible TTS

| Variable | Description | Default |
|----------|-------------|---------|
| `AUDIO_TTS_OPENAI_API_BASE_URL` | OpenAI-compatible TTS API base URL | `https://api.openai.com/v1` |
| `AUDIO_TTS_OPENAI_API_KEY` | OpenAI TTS API key | empty |
| `AUDIO_TTS_OPENAI_PARAMS` | Additional JSON params for OpenAI TTS | empty |

### Azure TTS

| Variable | Description | Default |
|----------|-------------|---------|
| `AUDIO_TTS_AZURE_SPEECH_REGION` | Azure Speech region | `eastus` |
| `AUDIO_TTS_AZURE_SPEECH_BASE_URL` | Custom Azure Speech base URL (optional) | empty |
| `AUDIO_TTS_AZURE_SPEECH_OUTPUT_FORMAT` | Audio output format | `audio-24khz-160kbitrate-mono-mp3` |

## Tips for Configuring Audio

### Using Local Whisper STT

For GPU acceleration issues or older GPUs, try setting:
```yaml
environment:
  - WHISPER_COMPUTE_TYPE=float16
```

### Using External TTS Services

When running Open WebUI in Docker with an external TTS service:

```yaml
environment:
  - AUDIO_TTS_ENGINE=openai
  - AUDIO_TTS_OPENAI_API_BASE_URL=http://host.docker.internal:5050/v1
  - AUDIO_TTS_OPENAI_API_KEY=your-api-key
```

:::tip
Use `host.docker.internal` on Docker Desktop (Windows/Mac) to access services on the host. On Linux, use the host IP or container networking.
:::

For troubleshooting audio issues, see the [Audio Troubleshooting Guide](/troubleshooting/audio).
