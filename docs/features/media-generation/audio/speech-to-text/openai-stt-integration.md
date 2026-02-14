---
sidebar_position: 0
title: "OpenAI STT Integration"
---

# Using OpenAI for Speech-to-Text

This guide covers how to use OpenAI's Whisper API for Speech-to-Text with Open WebUI. This provides cloud-based transcription without needing local GPU resources.

:::tip Looking for TTS?
See the companion guide: [Using OpenAI for Text-to-Speech](/features/media-generation/audio/text-to-speech/openai-tts-integration)
:::

## Requirements

- An OpenAI API key with access to the Audio API
- Open WebUI installed and running

## Quick Setup (UI)

1. Click your **profile icon** (bottom-left corner)
2. Select **Admin Panel**
3. Click **Settings** → **Audio** tab
4. Configure the following:

| Setting | Value |
|---------|-------|
| **Speech-to-Text Engine** | `OpenAI` |
| **API Base URL** | `https://api.openai.com/v1` |
| **API Key** | Your OpenAI API key |
| **STT Model** | `whisper-1` |
| **Supported Content Types** | Leave empty for defaults, or set `audio/wav,audio/mpeg,audio/webm` |

5. Click **Save**

## Available Models

| Model | Description |
|-------|-------------|
| `whisper-1` | OpenAI's Whisper large-v2 model, hosted in the cloud |

:::info
OpenAI currently only offers `whisper-1`. For more model options, use Local Whisper (built into Open WebUI) or other providers like Deepgram.
:::

## Environment Variables Setup

If you prefer to configure via environment variables:

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      - AUDIO_STT_ENGINE=openai
      - AUDIO_STT_OPENAI_API_BASE_URL=https://api.openai.com/v1
      - AUDIO_STT_OPENAI_API_KEY=sk-...
      - AUDIO_STT_MODEL=whisper-1
    # ... other configuration
```

### All STT Environment Variables (OpenAI)

| Variable | Description | Default |
|----------|-------------|---------|
| `AUDIO_STT_ENGINE` | Set to `openai` | empty (uses local Whisper) |
| `AUDIO_STT_OPENAI_API_BASE_URL` | OpenAI API base URL | `https://api.openai.com/v1` |
| `AUDIO_STT_OPENAI_API_KEY` | Your OpenAI API key | empty |
| `AUDIO_STT_MODEL` | STT model | `whisper-1` |
| `AUDIO_STT_SUPPORTED_CONTENT_TYPES` | Allowed audio MIME types | `audio/*,video/webm` |

### Supported Audio Formats

By default, Open WebUI accepts `audio/*` and `video/webm` for transcription. If you need to restrict or expand supported formats, set `AUDIO_STT_SUPPORTED_CONTENT_TYPES`:

```yaml
environment:
  - AUDIO_STT_SUPPORTED_CONTENT_TYPES=audio/wav,audio/mpeg,audio/webm
```

OpenAI's Whisper API supports: `mp3`, `mp4`, `mpeg`, `mpga`, `m4a`, `wav`, `webm`

## Using STT

1. Click the **microphone icon** in the chat input
2. Speak your message
3. Click the microphone again or wait for silence detection
4. Your speech will be transcribed and appear in the input box

## OpenAI vs Local Whisper

| Feature | OpenAI Whisper API | Local Whisper |
|---------|-------------------|---------------|
| **Latency** | Network dependent | Faster for short clips |
| **Cost** | Per-minute pricing | Free (uses your hardware) |
| **Privacy** | Audio sent to OpenAI | Audio stays local |
| **GPU Required** | No | Recommended for speed |
| **Model Options** | `whisper-1` only | tiny, base, small, medium, large |

Choose **OpenAI** if:
- You don't have a GPU
- You want consistent performance
- Privacy isn't a concern

Choose **Local Whisper** if:
- You want free transcription
- You need audio to stay private
- You have a GPU for acceleration

## Troubleshooting

### Microphone Not Working

1. Ensure you're using HTTPS or localhost
2. Check browser microphone permissions
3. See [Microphone Access Issues](/troubleshooting/audio#microphone-access-issues)

### Transcription Errors

1. Check your OpenAI API key is valid
2. Verify the API Base URL is correct
3. Check container logs for error messages

### Language Issues

OpenAI's Whisper API automatically detects language. If you need to force a specific language, consider using Local Whisper with the `WHISPER_LANGUAGE` environment variable.

For more troubleshooting, see the [Audio Troubleshooting Guide](/troubleshooting/audio).

## Cost Considerations

OpenAI charges per minute of audio for STT. See [OpenAI Pricing](https://platform.openai.com/docs/pricing) for current rates.

:::tip
For free STT, use **Local Whisper** (the default) or the browser's **Web API** for basic transcription.
:::
