---
sidebar_position: 2
title: "Mistral Voxtral STT"
---

# Using Mistral Voxtral for Speech-to-Text

This guide covers how to use Mistral's Voxtral model for Speech-to-Text with Open WebUI. Voxtral is Mistral's speech-to-text model that provides accurate transcription.

## Requirements

- A Mistral API key
- Open WebUI installed and running

## Quick Setup (UI)

1. Click your **profile icon** (bottom-left corner)
2. Select **Admin Panel**
3. Click **Settings** → **Audio** tab
4. Configure the following:

| Setting | Value |
|---------|-------|
| **Speech-to-Text Engine** | `MistralAI` |
| **API Key** | Your Mistral API key |
| **STT Model** | `voxtral-mini-latest` (or leave empty for default) |

5. Click **Save**

## Available Models

| Model | Description |
|-------|-------------|
| `voxtral-mini-latest` | Default transcription model (recommended) |

## Environment Variables Setup

If you prefer to configure via environment variables:

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      - AUDIO_STT_ENGINE=mistral
      - AUDIO_STT_MISTRAL_API_KEY=your-mistral-api-key
      - AUDIO_STT_MODEL=voxtral-mini-latest
    # ... other configuration
```

### All Mistral STT Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `AUDIO_STT_ENGINE` | Set to `mistral` | empty (uses local Whisper) |
| `AUDIO_STT_MISTRAL_API_KEY` | Your Mistral API key | empty |
| `AUDIO_STT_MISTRAL_API_BASE_URL` | Mistral API base URL | `https://api.mistral.ai/v1` |
| `AUDIO_STT_MISTRAL_USE_CHAT_COMPLETIONS` | Use chat completions endpoint | `false` |
| `AUDIO_STT_MODEL` | STT model | `voxtral-mini-latest` |

## Transcription Methods

Mistral supports two transcription methods:

### Standard Transcription (Default)
Uses the dedicated transcription endpoint. This is the recommended method.

### Chat Completions Method
Set `AUDIO_STT_MISTRAL_USE_CHAT_COMPLETIONS=true` to use Mistral's chat completions API for transcription. This method:
- Requires audio in mp3 or wav format (automatic conversion is attempted)
- May provide different results than the standard endpoint

## Using STT

1. Click the **microphone icon** in the chat input
2. Speak your message
3. Click the microphone again or wait for silence detection
4. Your speech will be transcribed and appear in the input box

## Supported Audio Formats

Voxtral accepts common audio formats. The system defaults to accepting `audio/*` and `video/webm`.

If using the chat completions method, audio is automatically converted to mp3.

## Troubleshooting

### API Key Errors

If you see "Mistral API key is required":
1. Verify your API key is entered correctly
2. Check the API key hasn't expired
3. Ensure your Mistral account has API access

### Transcription Not Working

1. Check container logs: `docker logs open-webui -f`
2. Verify the STT Engine is set to `MistralAI`
3. Try the standard transcription method (disable chat completions)

### Audio Format Issues

If using chat completions method and audio conversion fails:
- Ensure FFmpeg is available in the container
- Try recording in a different format (wav or mp3)
- Switch to the standard transcription method

For more troubleshooting, see the [Audio Troubleshooting Guide](/troubleshooting/audio).

## Comparison with Other STT Options

| Feature | Mistral Voxtral | OpenAI Whisper | Local Whisper |
|---------|-----------------|----------------|---------------|
| **Cost** | Per-minute pricing | Per-minute pricing | Free |
| **Privacy** | Audio sent to Mistral | Audio sent to OpenAI | Audio stays local |
| **Model Options** | voxtral-mini-latest | whisper-1 | tiny → large |
| **GPU Required** | No | No | Recommended |

## Cost Considerations

Mistral charges per minute of audio for STT. Check [Mistral's pricing page](https://mistral.ai/products/la-plateforme#pricing) for current rates.

:::tip
For free STT, use **Local Whisper** (the default) or the browser's **Web API** for basic transcription.
:::
