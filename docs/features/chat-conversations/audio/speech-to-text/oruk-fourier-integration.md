---
sidebar_position: 4
title: "Oruk Fourier 2B STT"
description: "Configure English speech-to-text in Open WebUI with Oruk Fourier 2B via the hosted Oruk Speech API or a self-hosted vLLM server."
---

# Using Oruk Fourier 2B for Speech-to-Text

This guide covers how to use [Oruk Fourier 2B](https://huggingface.co/oruk/oruk-fourier-2b) (`oruk-fourier-2b`), a 2.04B-parameter English speech-to-text model, with Open WebUI. Because Oruk exposes an OpenAI-compatible `/v1/audio/transcriptions` endpoint, you can connect it through Open WebUI's built-in **OpenAI** speech-to-text engine with no custom plugins.

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the [contributing tutorial](/tutorials/contributing-tutorial).

:::

## Choosing Hosted vs. Self-Hosted

| Option | Endpoint | License / Use | Hardware Required |
|--------|----------|---------------|-------------------|
| **Hosted Oruk Speech API** | `https://speech-api.oruk.ai/v1` | Commercial API (`$0.0080 / audio min`, no NC restriction) | None |
| **Self-hosted vLLM (`oruk/oruk-fourier-2b`)** | `http://127.0.0.1:8000/v1` | Open weights under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) (non-commercial; commercial self-hosting requires a license from Oruk or Apache-2.0 [`oruk/orukqwen-asr-1.7b`](https://huggingface.co/oruk/orukqwen-asr-1.7b)) | CUDA GPU (e.g., 24 GB VRAM for BF16) |

:::info English-only model
`oruk-fourier-2b` is an English speech recognition model (`en`, `en-US`, `en-GB`). If your deployment needs multilingual dictation, use [Local Whisper](/features/chat-conversations/audio/speech-to-text/stt-config), [OpenAI STT](/features/chat-conversations/audio/speech-to-text/openai-stt-integration), or [Mistral Voxtral](/features/chat-conversations/audio/speech-to-text/mistral-voxtral-integration).
:::

## Option 1: Hosted Oruk Speech API (Quickest)

### Requirements

- An Oruk API key ([sign up](https://oruk.ai/auth/signup) and create a key at [oruk.ai/account/api-keys](https://oruk.ai/account/api-keys))
- Open WebUI installed and running

### Configure in the UI

1. Click your **profile icon** (bottom-left corner)
2. Select **Admin Panel**
3. Click **Settings** → **Audio**
4. Configure the following fields:

| Setting | Value |
|---------|-------|
| **Speech-to-Text Engine** | `OpenAI` |
| **API Base URL** | `https://speech-api.oruk.ai/v1` |
| **API Key** | Your Oruk API key |
| **Request Format** | `Multipart Upload` |
| **STT Model** | `oruk-fourier-2b` |

5. Click **Save**. In your user audio settings, leave **Speech-to-Text Engine** set to **Default** so recordings use the administrator configuration.

### Environment Variables Setup

For a fresh Open WebUI deployment, you can configure the same settings via Docker Compose environment variables:

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      - AUDIO_STT_ENGINE=openai
      - AUDIO_STT_OPENAI_API_BASE_URL=https://speech-api.oruk.ai/v1
      - AUDIO_STT_OPENAI_API_KEY=your-oruk-api-key
      - AUDIO_STT_MODEL=oruk-fourier-2b
```

Existing settings saved in Open WebUI's database override these initial environment defaults; verify them under **Admin Panel → Settings → Audio** after restarting.

### Verify with `curl`

Test your API key directly before recording from the browser:

```bash
curl --fail-with-body https://speech-api.oruk.ai/v1/audio/transcriptions \
  -H "Authorization: Bearer $ORUK_API_KEY" \
  -F model=oruk-fourier-2b \
  -F language=en \
  -F response_format=json \
  -F file=@recording.wav
```

The response returns a JSON object with a `text` field containing the transcript.

## Option 2: Self-Hosted Open Weights (vLLM)

For non-commercial self-hosting (or licensed commercial operators), you can serve the pinned BF16 checkpoint directly from Hugging Face with vLLM (`vllm>=0.34.0`, `transformers>=5.22.2`):

```bash
hf download oruk/oruk-fourier-2b model.safetensors config.json generation_config.json \
  processor_config.json tokenizer_config.json tokenizer.json chat_template.jinja \
  --revision 8c2a8871f1304aa2f634da4fb95e24438c4945b9

export ORUK_LOCAL_API_KEY='replace-with-your-own-secret'

HF_HUB_OFFLINE=1 vllm serve oruk/oruk-fourier-2b \
  --revision 8c2a8871f1304aa2f634da4fb95e24438c4945b9 \
  --tokenizer-revision 8c2a8871f1304aa2f634da4fb95e24438c4945b9 \
  --served-model-name oruk-fourier-2b \
  --host 127.0.0.1 --port 8000 \
  --api-key "$ORUK_LOCAL_API_KEY" \
  --dtype bfloat16 --enforce-eager --max-model-len 1024 \
  --max-num-seqs 2 --gpu-memory-utilization 0.7
```

Then configure Open WebUI's **Admin Panel → Settings → Audio** with:

- **Speech-to-Text Engine:** `OpenAI`
- **API Base URL:** `http://127.0.0.1:8000/v1` (or the container-reachable hostname — see [Server address](/features/chat-conversations/audio/speech-to-text/self-hosted-stt#configure-open-webui))
- **API Key:** The value of `ORUK_LOCAL_API_KEY`
- **Request Format:** `Multipart Upload`
- **STT Model:** `oruk-fourier-2b`

For CPU-only LocalAI Q8 serving or local `llama.cpp` GGUF usage, see the [Oruk Fourier 2B serving recipes](https://huggingface.co/oruk/oruk-fourier-2b/blob/main/examples/licensed-serving/README.md) and [llama.cpp GGUF guide](https://huggingface.co/oruk/oruk-fourier-2b/blob/main/examples/llama-cpp/README.md).

## Supported Audio Formats and Limits

- **Hosted API formats:** WAV, FLAC, MP3, M4A, OGG, and WebM (Open WebUI's browser recorder submits WebM by default, which is accepted directly).
- **Hosted API limits:** Up to **30 MiB** and **60 minutes (3,600 s)** per request.
- **Language codes:** `en`, `en-US`, and `en-GB`.

## Troubleshooting

- **401 or 403 Unauthorized:** Confirm the API key in **Settings → Audio** matches your active Oruk key (or `ORUK_LOCAL_API_KEY` for self-hosted vLLM) with no trailing whitespace.
- **404 Not Found:** Make sure **API Base URL** ends in `/v1`, not `/v1/audio/transcriptions` — Open WebUI appends `/audio/transcriptions` automatically.
- **Unsupported language error:** Ensure **Language** in **Settings → Audio** (and `WHISPER_LANGUAGE` if set) is either empty or an English code (`en`, `en-US`, or `en-GB`).
- **Connection refused in Docker:** When running Open WebUI in Docker against a local vLLM server on the host, use `http://host.docker.internal:8000/v1` (or a shared Docker network service name) instead of `127.0.0.1`. See [Self-Hosted Speech-to-Text](/features/chat-conversations/audio/speech-to-text/self-hosted-stt) for container networking details.

For general audio and microphone issues, see the [Audio Troubleshooting Guide](/troubleshooting/audio).
