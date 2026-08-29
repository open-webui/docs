---
sidebar_position: 4
title: "Gandr TTS Integration"
---

# Using Gandr for Text-to-Speech

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

This guide covers how to use [Gandr](https://gandr.ai) as the Text-to-Speech engine in Open WebUI. Gandr serves an OpenAI-compatible Audio API, so Open WebUI's built-in `OpenAI` engine connects to it with no extra components to run.

## What is Gandr?

Gandr is a hosted text-to-speech API:

- OpenAI-compatible `POST /v1/audio/speech` endpoint, responses in `mp3` by default (`wav` and `pcm` also supported)
- 23 languages
- Six stock voices, plus voice cloning from roughly ten seconds of reference audio through the API
- A streaming WebSocket endpoint for realtime agents ([docs](https://gandr.ai/docs))
- Free tier: 50,000 tokens to start. One token is one character.

## Requirements

- A Gandr API key. Create one at [gandr.ai](https://gandr.ai); the free tier covers your first 50,000 tokens.
- Open WebUI installed and running

## Quick Setup (UI)

1. Click your **profile icon** (bottom-left corner)
2. Select **Admin Panel**
3. Click **Settings** → **Audio** tab → **Text-to-Speech Settings**
4. Configure the following:

| Setting | Value |
|---------|-------|
| **Text-to-Speech Engine** | `OpenAI` |
| **API Base URL** | `https://tts.gandr.ai/v1` |
| **API Key** | Your Gandr API key (`gnd_...`) |
| **TTS Model** | `gandr` |
| **TTS Voice** | `gandr-mia` |

5. Click **Save**

:::tip

Gandr returns `mp3` by default, which Open WebUI plays natively. Unlike some providers, you do not need to add anything to the **OpenAI Params** field.

:::

## Available Voices

Six stock voices are available out of the box:

| Voice ID |
|----------|
| `gandr-mia` |
| `gandr-ava` |
| `gandr-jenny` |
| `gandr-dane` |
| `gandr-leo` |
| `gandr-lewis` |

Set any of these as the **TTS Voice** in the settings above, or per model in the Model Editor, or per user in user settings. You can hear samples of each voice at [gandr.ai](https://gandr.ai).

## Language

Open WebUI sends the text and this route renders it in English; for the other languages, use Gandr's WebSocket API, which takes an explicit language parameter. To pin a language explicitly (for example `en`, `es`, `fr`, `de`, `pt`, `ar`, `zh`, `ja`), use the streaming WebSocket API described at [gandr.ai/docs](https://gandr.ai/docs); the OpenAI-compatible endpoint above needs no language configuration.

## Environment Variables Setup

If you prefer to configure via environment variables:

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      - AUDIO_TTS_ENGINE=openai
      - AUDIO_TTS_OPENAI_API_BASE_URL=https://tts.gandr.ai/v1
      - AUDIO_TTS_OPENAI_API_KEY=gnd_...
      - AUDIO_TTS_MODEL=gandr
      - AUDIO_TTS_VOICE=gandr-mia
    # ... other configuration
```

### All TTS Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `AUDIO_TTS_ENGINE` | Set to `openai` | empty |
| `AUDIO_TTS_OPENAI_API_BASE_URL` | Gandr base URL | `https://api.openai.com/v1` |
| `AUDIO_TTS_OPENAI_API_KEY` | Your Gandr API key | empty |
| `AUDIO_TTS_MODEL` | Any value; `gandr` is conventional | engine default |
| `AUDIO_TTS_VOICE` | A Gandr voice ID, e.g. `gandr-mia` | `alloy` |

## Testing TTS

1. Start a new chat
2. Send a message to any model
3. Click the **speaker icon** on the AI response to hear it read aloud

## Troubleshooting

### 401 Unauthorized

The API key is missing or malformed. Gandr keys start with `gnd_`. Generate a fresh key at [gandr.ai](https://gandr.ai) and paste it again.

### No Audio Plays

1. Verify the API Base URL is exactly `https://tts.gandr.ai/v1`
2. Check the browser console (F12) for errors
3. Test the key outside Open WebUI:

```bash
curl -X POST https://tts.gandr.ai/v1/audio/speech \
  -H "Authorization: Bearer gnd_YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "gandr", "input": "Hello from Gandr.", "voice": "gandr-mia"}' \
  --output test.mp3
```

### Out of Tokens

Each character of text is one token. Top up or check usage from your account at [gandr.ai](https://gandr.ai).
