---
sidebar_position: 2
title: "Mistral TTS Integration"
---

# Using Mistral for Text-to-Speech

This guide covers how to use Mistral's Text-to-Speech API with Open WebUI.

:::tip Looking for STT?
See the companion guide: [Using Mistral Voxtral for Speech-to-Text](/features/chat-conversations/audio/speech-to-text/mistral-voxtral-integration)
:::

## Requirements

- A Mistral API key
- Open WebUI installed and running

## Quick Setup (UI)

1. Click your **profile icon** (bottom-left corner)
2. Select **Admin Panel**
3. Click **Settings** -> **Audio** tab
4. Configure the following:

| Setting | Value |
|---------|-------|
| **Text-to-Speech Engine** | `MistralAI` |
| **API Base URL** | `https://api.mistral.ai/v1` |
| **API Key** | Your Mistral API key |
| **TTS Model** | `voxtral-tts-26-03` (or leave empty for the built-in default) |
| **TTS Voice** | Choose from available voices |

5. Click **Save**

## Available Models

| Model | Description |
|-------|-------------|
| `voxtral-tts-26-03` | Voxtral TTS — current Mistral text-to-speech model, with zero-shot voice cloning |

:::info
If `AUDIO_TTS_MODEL` is empty, Open WebUI falls back to `mistral-tts-latest`.
:::

:::caution Set the model explicitly
Mistral no longer publishes `-latest` alias names, so the built-in `mistral-tts-latest` fallback may be rejected. Set **TTS Model** to a current ID such as `voxtral-tts-26-03` rather than leaving the field empty. See the [Mistral models overview](https://docs.mistral.ai/getting-started/models/models_overview/) for the current list.
:::

## Environment Variables Setup

If you prefer to configure via environment variables:

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
    # ... other configuration
```

### All Mistral TTS Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `AUDIO_TTS_ENGINE` | Set to `mistral` | empty (uses browser-only TTS) |
| `AUDIO_TTS_MISTRAL_API_KEY` | Your Mistral API key | empty |
| `AUDIO_TTS_MISTRAL_API_BASE_URL` | Mistral API base URL | `https://api.mistral.ai/v1` |
| `AUDIO_TTS_MODEL` | TTS model | `mistral-tts-latest` (built-in fallback; set `voxtral-tts-26-03` explicitly) |
| `AUDIO_TTS_VOICE` | Voice ID | empty |

## Choosing Voices

Open WebUI queries the configured Mistral endpoint for available voices and shows them in the **TTS Voice** selector.

If voices are not listed:
- Confirm your API key is valid
- Verify the API base URL is reachable from the Open WebUI server/container
- Check logs for `/audio/voices` request errors

## Testing TTS

1. Start a new chat
2. Send a message to any model
3. Click the **speaker icon** on the AI response to hear it read aloud

## Troubleshooting

### "Mistral API key is required for Mistral TTS"

1. Confirm `AUDIO_TTS_MISTRAL_API_KEY` is set (or entered in Admin Audio settings)
2. Save settings and retry

### No voices shown in the dropdown

1. Verify network access from Open WebUI to `AUDIO_TTS_MISTRAL_API_BASE_URL`
2. Check Open WebUI logs for Mistral voice list errors
3. Confirm your key has permission to access Mistral audio APIs

### TTS request fails

1. Verify `AUDIO_TTS_ENGINE=mistral`
2. Set the model explicitly to a current ID such as `voxtral-tts-26-03`
3. Try another voice ID from the fetched list

For broader audio debugging, see the [Audio Troubleshooting Guide](/troubleshooting/audio).
