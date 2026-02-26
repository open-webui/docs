---
sidebar_position: 1
title: "Configuration"
---

Open WebUI supports both local, browser, and remote speech to text.

![alt text](/images/tutorials/stt/image.png)

![alt text](/images/tutorials/stt/stt-providers.png)

## Cloud / Remote Speech To Text Providers

The following speech-to-text providers are supported:

| Service | API Key Required | Guide |
|---------|------------------|-------|
| Local Whisper (default) | ❌ | Built-in, see [Environment Variables](/features/media-generation/audio/speech-to-text/env-variables) |
| OpenAI (Whisper API) | ✅ | [OpenAI STT Guide](/features/media-generation/audio/speech-to-text/openai-stt-integration) |
| Mistral (Voxtral) | ✅ | [Mistral Voxtral Guide](/features/media-generation/audio/speech-to-text/mistral-voxtral-integration) |
| Gladia | ✅ | [Gladia STT Guide](/features/media-generation/audio/speech-to-text/gladia-stt-integration) |
| Deepgram | ✅ | — |
| Azure | ✅ | — |

**Web API** provides STT via the browser's built-in speech recognition (no API key needed, configured in user settings).

## Configuring Your STT Provider

To configure a speech to text provider:

- Navigate to the admin settings
- Choose Audio
- Provider an API key and choose a model from the dropdown

![alt text](/images/tutorials/stt/stt-config.png)

## User-Level Settings

In addition the instance settings provisioned in the admin panel, there are also a couple of user-level settings that can provide additional functionality.

- **STT Settings:** Contains settings related to Speech-to-Text functionality.
- **Speech-to-Text Engine:** Determines the engine used for speech recognition (Default or Web API).

![alt text](/images/tutorials/stt/user-settings.png)

## Using STT

Speech to text provides a highly efficient way of "writing" prompts using your voice and it performs robustly from both desktop and mobile devices.

To use STT, simply click on the microphone icon:

![alt text](/images/tutorials/stt/stt-operation.png)

A live audio waveform will indicate successful voice capture:

![alt text](/images/tutorials/stt/stt-in-progress.png)

## STT Mode Operation

Once your recording has begun you can:

- Click on the tick icon to save the recording (if auto send after completion is enabled it will send for completion; otherwise you can manually send)
- If you wish to abort the recording (for example, you wish to start a fresh recording) you can click on the 'x' icon to scape the recording interface

![alt text](/images/tutorials/stt/endstt.png)

## Troubleshooting

### Common Issues

#### "int8 compute type not supported" Error

If you see an error like `Error transcribing chunk: Requested int8 compute type, but the target device or backend do not support efficient int8 computation`, this usually means your GPU doesn't support the requested `int8` compute operations.

**Solutions:**
- **Upgrade to the latest version** — persistent configuration for compute type has been improved in recent updates to resolve known issues with CUDA compatibility.
- **Switch to the standard Docker image** instead of the `:cuda` image — older GPUs (Maxwell architecture, ~2014-2016) may not be supported by modern CUDA accelerated libraries.
- **Change the compute type** using the `WHISPER_COMPUTE_TYPE` environment variable:
  ```yaml
  environment:
    - WHISPER_COMPUTE_TYPE=float16  # or float32
  ```

:::tip
For smaller models like Whisper, CPU mode often provides comparable performance without GPU compatibility issues. The `:cuda` image primarily accelerates RAG embeddings and won't significantly impact STT speed for most users.
:::

#### Microphone Not Working

1. **Check browser permissions** — ensure your browser has microphone access
2. **Use HTTPS** — some browsers require secure connections for microphone access
3. **Try another browser** — Chrome typically has the best support for web audio APIs

#### Poor Recognition Accuracy

- **Set the language explicitly** using `WHISPER_LANGUAGE=en` (uses ISO 639-1 codes)
- **Toggles multilingual support** — Use `WHISPER_MULTILINGUAL=true` if you need to support languages other than English. When disabled (default), only the English-only variant of the model is used for better performance in English tasks.
- **Use a larger Whisper model** — options: `tiny`, `base`, `small`, `medium`, `large`
- Larger models are more accurate but slower

For more detailed troubleshooting, see the [Audio Troubleshooting Guide](/troubleshooting/audio).
