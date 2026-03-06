---
sidebar_position: 3
title: "Gladia STT Integration"
---

# Using Gladia for Speech-to-Text

This guide covers how to use [Gladia.io](https://www.gladia.io/) for Speech-to-Text with Open WebUI. Gladia provides a powerful pre-recorded transcription API with support for multiple languages and automatic language detection. Gladia offer a 10h per month for free.

## Requirements

- A Gladia API key (get one at [gladia.io](https://www.gladia.io/))
- Open WebUI installed and running

## Quick Setup (UI)

1. Click your **profile icon** (bottom-left corner)
2. Select **Admin Panel**
3. Click **Settings** → **Audio** tab
4. Configure the following:

| Setting | Value |
|---------|-------|
| **Speech-to-Text Engine** | `Gladia` |
| **API Key** | Your Gladia API key |

5. Click **Save**

## How It Works

Gladia uses an asynchronous 3-step transcription workflow:

1. **Upload** — Your audio file is uploaded to Gladia's API
2. **Transcribe** — A transcription job is initiated on the uploaded audio
3. **Poll** — Results are polled until the transcription is complete

This process is handled automatically by Open WebUI — you simply speak and receive the transcription.

## Environment Variables Setup

If you prefer to configure via environment variables:

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      - AUDIO_STT_ENGINE=gladia
      - AUDIO_STT_GLADIA_API_KEY=your-gladia-api-key
    # ... other configuration
```

### All Gladia STT Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `AUDIO_STT_ENGINE` | Set to `gladia` | empty (uses local Whisper) |
| `AUDIO_STT_GLADIA_API_KEY` | Your Gladia API key | empty |

## Language Support

Gladia supports automatic language detection by default. You can also specify a language to improve accuracy when you know the spoken language in advance. The language is passed via the recording metadata when available.

## Using STT

1. Click the **microphone icon** in the chat input
2. Speak your message
3. Click the microphone again or wait for silence detection
4. Your speech will be transcribed and appear in the input box

## Troubleshooting

### API Key Errors

If you see "Gladia API key is required for Gladia STT":
1. Verify your API key is entered correctly
2. Check the API key hasn't expired
3. Ensure your Gladia account has API access

### Transcription Timeout

Gladia transcription polls for up to 120 seconds. If it times out:
1. Check your network connectivity
2. Verify the audio file isn't too large
3. Check container logs: `docker logs open-webui -f`

### Empty Transcription

If you get an empty transcript:
- Ensure the audio contains clear speech
- Try speaking louder or reducing background noise
- Check that the correct language is detected

For more troubleshooting, see the [Audio Troubleshooting Guide](/troubleshooting/audio).

## Comparison with Other STT Options

| Feature | Gladia | OpenAI Whisper | Mistral Voxtral | Local Whisper |
|---------|--------|----------------|-----------------|---------------|
| **Cost** | Per-minute pricing | Per-minute pricing | Per-minute pricing | Free |
| **Privacy** | Audio sent to Gladia | Audio sent to OpenAI | Audio sent to Mistral | Audio stays local |
| **Language Detection** | Automatic | Automatic | Automatic | Manual or auto |
| **GPU Required** | No | No | No | Recommended |

## Cost Considerations

Gladia offers per-minute pricing for audio transcription. Check [Gladia's pricing page](https://www.gladia.io/pricing) for current rates.

:::tip
For free STT, use **Local Whisper** (the default) or the browser's **Web API** for basic transcription.
:::
