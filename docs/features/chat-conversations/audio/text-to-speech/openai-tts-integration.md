---
sidebar_position: 0
title: "OpenAI TTS Integration"
---

# Using OpenAI for Text-to-Speech

This guide covers how to use OpenAI's official Text-to-Speech API with Open WebUI. This is the simplest setup if you already have an OpenAI API key.

:::tip Looking for STT?
See the companion guide: [Using OpenAI for Speech-to-Text](/features/chat-conversations/audio/speech-to-text/openai-stt-integration)
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
| **Text-to-Speech Engine** | `OpenAI` |
| **API Base URL** | `https://api.openai.com/v1` |
| **API Key** | Your OpenAI API key |
| **TTS Model** | `tts-1` or `tts-1-hd` |
| **TTS Voice** | Choose from available voices |

5. Click **Save**

## Available Models

| Model | Description | Best For |
|-------|-------------|----------|
| `tts-1` | Standard quality, lower latency | Real-time applications, faster responses |
| `tts-1-hd` | Higher quality audio | Pre-recorded content, premium audio quality |

## Available Voices

OpenAI provides 6 built-in voices:

| Voice | Description |
|-------|-------------|
| `alloy` | Neutral, balanced |
| `echo` | Warm, conversational |
| `fable` | Expressive, British accent |
| `onyx` | Deep, authoritative |
| `nova` | Friendly, upbeat |
| `shimmer` | Soft, gentle |

:::tip
Try different voices to find the one that best suits your use case. You can preview voices in OpenAI's documentation.
:::

## Per-Model TTS Voice

You can assign a specific TTS voice to individual models, allowing different AI personas to have distinct voices. This is configured in the Model Editor.

### Setting a Model-Specific Voice

1. Go to **Workspace > Models**
2. Click the **Edit** (pencil) icon on the model you want to configure
3. Scroll down to find the **TTS Voice** field
4. Enter the voice name (e.g., `alloy`, `echo`, `shimmer`, `onyx`, `nova`, `fable`)
5. Click **Save**

### Voice Priority

When playing TTS audio, Open WebUI uses the following priority:

1. **Model-specific TTS voice** (if set in Model Editor)
2. **User's personal voice setting** (if configured in user settings)
3. **System default voice** (configured by admin)

This allows admins to give each AI persona a consistent voice while still letting users override with their personal preference when no model-specific voice is set.

### Use Cases

- **Character personas**: Give a "British Butler" model the `fable` voice, while an "Energetic Assistant" uses `nova`
- **Language learning**: Assign appropriate voices for different language tutors
- **Accessibility**: Set clearer voices for models designed for accessibility use cases

## Environment Variables Setup

If you prefer to configure via environment variables:

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      - AUDIO_TTS_ENGINE=openai
      - AUDIO_TTS_OPENAI_API_BASE_URL=https://api.openai.com/v1
      - AUDIO_TTS_OPENAI_API_KEY=sk-...
      - AUDIO_TTS_MODEL=tts-1
      - AUDIO_TTS_VOICE=alloy
    # ... other configuration
```

### All TTS Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `AUDIO_TTS_ENGINE` | Set to `openai` | empty |
| `AUDIO_TTS_OPENAI_API_BASE_URL` | OpenAI API base URL | `https://api.openai.com/v1` |
| `AUDIO_TTS_OPENAI_API_KEY` | Your OpenAI API key | empty |
| `AUDIO_TTS_MODEL` | TTS model (`tts-1` or `tts-1-hd`) | `tts-1` |
| `AUDIO_TTS_VOICE` | Voice to use | `alloy` |

## Using the OpenAI Realtime Engine

The **OpenAI Realtime** Text-to-Speech engine produces speech with OpenAI's realtime voice models, the same models used for [Realtime calls](/features/chat-conversations/chat-features/voice-mode#realtime-calls). For each piece of text, Open WebUI opens a short WebSocket session to `<API Base URL>/realtime`, asks the model to read the text aloud and saves the result as a finished WAV clip. It serves Read Aloud and Standard voice calls like any other Text-to-Speech engine.

1. Go to **Admin Panel > Settings > Audio**.
2. Set **Text-to-Speech Engine** to **OpenAI Realtime**. The model and voice switch to `gpt-realtime-2.1-mini` and `marin`.
3. Fill in the **API Base URL** and **API Key**. These are the same fields the `OpenAI` engine uses.
4. Optionally change the **TTS Model**, **TTS Voice** or **Prompt Template**, then click **Save**.

| Setting | Options |
|---------|---------|
| **TTS Model** | `gpt-realtime-2.1-mini` (default) or `gpt-realtime-2.1` |
| **TTS Voice** | `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`, `marin` (default) or `cedar` |
| **Prompt Template** | Instructions for the model. Leave it empty to use the built-in prompt, which tells the model to read the text aloud word for word, in its original language, without answering, summarizing or adding commentary |

The **Prompt Template** field takes the place of **Additional Parameters** for this engine. The same voice priority applies as above: a model's **TTS Voice**, then the user's own voice, then the admin default. Each finished clip is cached, so the same text with the same model, voice and prompt plays from the cache the next time.

The API Base URL must start with `http://` or `https://` and contain no query string, user name or password. With environment variables:

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      - AUDIO_TTS_ENGINE=openai-realtime
      - AUDIO_TTS_OPENAI_API_BASE_URL=https://api.openai.com/v1
      - AUDIO_TTS_OPENAI_API_KEY=sk-...
      - AUDIO_TTS_MODEL=gpt-realtime-2.1-mini
      - AUDIO_TTS_VOICE=marin
      # Optional: replaces the built-in read-aloud instructions
      # - REALTIME_TTS_PROMPT_TEMPLATE=...
```

See [`REALTIME_TTS_PROMPT_TEMPLATE`](/reference/env-configuration#realtime_tts_prompt_template) in the environment variable reference.

## Using OpenRouter as a Text-to-Speech Provider

Open WebUI's `OpenAI` TTS engine is compatible with any service that implements the OpenAI Audio API, including [OpenRouter](https://openrouter.ai). This section explains how to configure OpenRouter as your TTS provider and how to avoid a common `400 Bad Request` error.

### Why the 400 Error Happens

OpenRouter's [`/audio/speech` endpoint](https://openrouter.ai/docs/guides/overview/multimodal/tts) defaults `response_format` to `pcm` when the field is omitted. Open WebUI does not send `response_format` in its request payload, so OpenRouter returns raw PCM audio, which Open WebUI cannot play back, resulting in a `400 Bad Request`.

The fix is to explicitly request MP3 by adding `{"response_format": "mp3"}` to the **OpenAI Params** field (extra parameters) in the TTS settings.

### Quick Setup (UI)

1. Click your **profile icon** (bottom-left corner)
2. Select **Admin Panel**
3. Click **Settings** → **Audio** tab → **Text-to-Speech Settings**
4. Configure the following:

| Setting | Value |
|---------|-------|
| **Text-to-Speech Engine** | `OpenAI` |
| **API Base URL** | `https://openrouter.ai/api/v1` |
| **API Key** | Your OpenRouter API key (`sk-or-...`) |
| **TTS Model** | Any OpenRouter TTS model, e.g. `openai/tts-1` |
| **TTS Voice** | Choose from available voices |
| **OpenAI Params** | `{"response_format": "mp3"}` |

:::important

The **OpenAI Params** field must contain `{"response_format": "mp3"}`. Without it, OpenRouter defaults to `pcm`, and speech requests fail with a `400 Bad Request` error.
:::

5. Click **Save**

### Environment Variables Setup

If you prefer to configure via environment variables, add the parameters JSON via `AUDIO_TTS_OPENAI_PARAMS`:

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      - AUDIO_TTS_ENGINE=openai
      - AUDIO_TTS_OPENAI_API_BASE_URL=https://openrouter.ai/api/v1
      - AUDIO_TTS_OPENAI_API_KEY=sk-or-...
      - AUDIO_TTS_MODEL=openai/tts-1
      - AUDIO_TTS_VOICE=alloy
      - AUDIO_TTS_OPENAI_PARAMS={"response_format":"mp3"}
    # ... other configuration
```

:::info

OpenRouter supports `mp3` and `pcm` output formats. Always select `mp3` in Open WebUI, PCM output is intended for real-time streaming pipelines and cannot be played back by Open WebUI.
:::

## Testing TTS

1. Start a new chat
2. Send a message to any model
3. Click the **speaker icon** on the AI response to hear it read aloud

## Response Splitting

When reading long responses, Open WebUI can split text into chunks before sending them to the TTS engine. This is configured in **Settings > Admin > Audio** under **Response Splitting**.

| Option | Description |
|--------|-------------|
| **Punctuation** (default) | Splits at sentence boundaries: periods (`.`), exclamation marks (`!`), question marks (`?`), and newlines. Best for natural pacing. |
| **Paragraphs** | Splits only at paragraph breaks (double newlines). Results in longer audio chunks. |
| **None** | Sends the entire response as one chunk. May cause delays before audio starts on long responses. |

:::tip
**Punctuation** mode is recommended for most use cases. It provides the best balance of streaming performance (audio starts quickly) and natural speech pacing.
:::

## Troubleshooting

### No Audio Plays

1. Check your OpenAI API key is valid and has Audio API access
2. Verify the API Base URL is correct (`https://api.openai.com/v1`)
3. Check browser console (F12) for errors

### Audio Quality Issues

- Switch from `tts-1` to `tts-1-hd` for higher quality
- Note: `tts-1-hd` has slightly higher latency

### Rate Limits

OpenAI has rate limits on the Audio API. If you're hitting limits:
- Consider caching common phrases
- Use `tts-1` instead of `tts-1-hd` (uses fewer tokens)

For more troubleshooting, see the [Audio Troubleshooting Guide](/troubleshooting/audio).

## Cost Considerations

OpenAI charges per character for TTS. See [OpenAI Pricing](https://platform.openai.com/docs/pricing) for current rates. Note that `tts-1-hd` costs more than `tts-1`.

:::info
For a free alternative, consider [OpenAI Edge TTS](/features/chat-conversations/audio/text-to-speech/openai-edge-tts-integration) which uses Microsoft's free Edge browser TTS.
:::
