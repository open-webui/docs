---
sidebar_position: 2
title: "Lokutor STT"
---

# Using Lokutor for Speech-to-Text

This guide covers how to use [Lokutor](https://lokutor.com) (own speech models: Versa TTS and Conv STT, API, agents) for Speech-to-Text with Open WebUI. Lokutor serves an OpenAI-compatible [`/audio/transcriptions`](https://docs.lokutor.com/integrations/openai-compatible) endpoint, so it works with the `OpenAI` engine.

:::tip Looking for TTS?
See the companion guide: [Using Lokutor for Text-to-Speech](/features/chat-conversations/audio/text-to-speech/lokutor-tts-integration)
:::

:::caution WAV only
Lokutor transcribes **WAV** audio (PCM, 8 or 16 bit, mono or stereo) and answers other formats with a `400`. Open WebUI's microphone button records WebM, so use Lokutor for WAV file uploads, or keep another engine for dictation.
:::

## Requirements

- A Lokutor API key ([lokutor.com](https://lokutor.com))
- Open WebUI installed and running

## Quick Setup (UI)

1. Click your **profile icon** (bottom-left corner)
2. Select **Admin Panel**
3. Click **Settings** → **Audio** tab
4. Configure the following:

| Setting | Value |
|---------|-------|
| **Speech-to-Text Engine** | `OpenAI` |
| **API Base URL** | `https://api.lokutor.com/v1` |
| **API Key** | Your Lokutor API key |
| **STT Model** | `whisper-1` (accepted and ignored) |
| **Supported Content Types** | `audio/wav` |

5. Click **Save**

Lokutor transcribes `en`, `es`, `ca`, `gl`, `eu`, `pt`, `fr`, `it` and `de`. Open WebUI sends a `language` only when one is set; without it Lokutor works it out from the audio.

## Environment Variables Setup

If you prefer to configure via environment variables:

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      - AUDIO_STT_ENGINE=openai
      - AUDIO_STT_OPENAI_API_BASE_URL=https://api.lokutor.com/v1
      - AUDIO_STT_OPENAI_API_KEY=your-lokutor-api-key
      - AUDIO_STT_MODEL=whisper-1
      - AUDIO_STT_SUPPORTED_CONTENT_TYPES=audio/wav
    # ... other configuration
```

Billing, limits and errors are those of Lokutor's own API, at the [published rates](https://api.lokutor.com/v1/pricing).
