---
sidebar_position: 2
title: "Lokutor TTS Integration"
---

# Using Lokutor for Text-to-Speech

This guide covers how to use [Lokutor](https://lokutor.com) (own speech models: Versa TTS and Conv STT, API, agents) as the Text-to-Speech engine in Open WebUI. Lokutor serves an OpenAI-compatible [`/audio/speech`](https://docs.lokutor.com/integrations/openai-compatible) endpoint, so it works with the `OpenAI` engine.

:::tip Looking for STT?
See the companion guide: [Using Lokutor for Speech-to-Text](/features/chat-conversations/audio/speech-to-text/lokutor-stt-integration)
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
| **Text-to-Speech Engine** | `OpenAI` |
| **API Base URL** | `https://api.lokutor.com/v1` |
| **API Key** | Your Lokutor API key |
| **TTS Model** | `tts-1` (accepted and ignored, every request uses Versa 2.0) |
| **TTS Voice** | `alloy`, or any voice from the table below |

5. Click **Save**

## Available Voices

`TTS Voice` takes OpenAI's voice names, which map to Lokutor voices, or a Lokutor voice name directly (`F1`-`F5`, `M1`-`M5`, or an id from your Lokutor account).

| OpenAI name | Lokutor voice | OpenAI name | Lokutor voice |
|-------------|---------------|-------------|---------------|
| `alloy` | `F1` | `echo` | `M1` |
| `nova` | `F2` | `onyx` | `M2` |
| `shimmer` | `F3` | `fable` | `M3` |
| `coral` | `F4` | `ash` | `M4` |
| `sage` | `F5` | `ballad` | `M5` |

## Language and Speed

Without a language, Lokutor chooses it from the text. To force one of `en`, `es`, `ca`, `gl`, `eu`, `pt`, `fr`, `it` or `de`, or to change the speaking rate, put them in the **OpenAI Params** field (Open WebUI adds these fields to the request as they are):

```json
{"language": "es", "speed": 1.0}
```

## Environment Variables Setup

If you prefer to configure via environment variables:

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      - AUDIO_TTS_ENGINE=openai
      - AUDIO_TTS_OPENAI_API_BASE_URL=https://api.lokutor.com/v1
      - AUDIO_TTS_OPENAI_API_KEY=your-lokutor-api-key
      - AUDIO_TTS_MODEL=tts-1
      - AUDIO_TTS_VOICE=alloy
      # Optional
      # - AUDIO_TTS_OPENAI_PARAMS={"language":"es","speed":1.0}
    # ... other configuration
```

## Notes

- Lokutor always answers with WAV audio, whatever `response_format` asks for. Open WebUI plays it like any other engine's output.
- Billing, limits and errors are those of Lokutor's own API, at the [published rates](https://api.lokutor.com/v1/pricing).

For more troubleshooting, see the [Audio Troubleshooting Guide](/troubleshooting/audio).
