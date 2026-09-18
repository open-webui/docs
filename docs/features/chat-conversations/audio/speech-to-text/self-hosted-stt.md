---
sidebar_position: 3
title: "Self-Hosted Speech-to-Text"
description: "Connect Open WebUI to a self-hosted OpenAI-compatible transcription server."
---

# Self-Hosted Speech-to-Text

Open WebUI can send recordings to a self-hosted server that implements the OpenAI-compatible `/v1/audio/transcriptions` endpoint. This guide uses LocalAI with the stock Whisper base model. The server transcribes audio; Open WebUI handles recording and inserts the returned text into the chat input.

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the [contributing tutorial](/tutorials/contributing-tutorial).

:::

## Configure Open WebUI

With your transcription server running, open **Settings > Admin > Audio** and set:

| Setting | Value for the LocalAI example below |
|---------|------------------------------------|
| **Speech-to-Text Engine** | `OpenAI` |
| **API Base URL** | `http://127.0.0.1:8081/v1` when both applications run directly on the same host |
| **API Key** | The key you set in `LOCALAI_API_KEY` |
| **Request Format** | `Multipart Upload` |
| **STT Model** | `whisper-1` |

Click **Save**. In your user audio settings, leave **Speech-to-Text Engine** set to **Default** so recordings use the server configured by the administrator.

The `OpenAI` engine selects the API protocol. With this base URL, requests go to your LocalAI server. You do not need an OpenAI account or an OpenAI API key. The model name must match the name served by your transcription server.

:::important Server address

Open WebUI's backend makes the transcription request. Use an address reachable from that backend, which may differ from the address in your browser. In a container, `127.0.0.1` refers to that container.

| Deployment | Example API Base URL |
|------------|----------------------|
| Both applications run directly on the same host | `http://127.0.0.1:8081/v1` |
| Both containers share a Docker network, with LocalAI listening on port 8080 under service name `localai` | `http://localai:8080/v1` |
| Open WebUI runs in Docker Desktop and LocalAI listens on a reachable host interface at port 8081 | `http://host.docker.internal:8081/v1` |

A host service bound only to `127.0.0.1` may not be reachable from a container. Consult your container platform's networking documentation before changing the bind address, and retain authentication when making LocalAI reachable from other hosts.

:::

## Start a LocalAI Transcription Server

Install [LocalAI](https://localai.io/docs/installation/) and FFmpeg on the server. For a native installation, the following commands install the Whisper backend and the `whisper-1` gallery model, then start an authenticated server on port 8081:

```bash
mkdir -p models backends
local-ai backends install whisper --backends-path ./backends
local-ai models install whisper-1 --models-path ./models --backends-path ./backends

export LOCALAI_API_KEY='replace-with-your-own-secret'
local-ai run --address 127.0.0.1:8081 --models-path ./models --backends-path ./backends
```

LocalAI's [`whisper-1` gallery entry](https://github.com/mudler/LocalAI/blob/master/gallery/index.yaml) uses the Whisper base model through `whisper.cpp`. Its name is a local API identifier. Other self-hosted servers may use a different name or require different installation steps.

From a machine that can reach LocalAI, test a short recording before configuring Open WebUI:

```bash
curl --fail-with-body http://127.0.0.1:8081/v1/audio/transcriptions \
  -H "Authorization: Bearer $LOCALAI_API_KEY" \
  -F model=whisper-1 \
  -F file=@recording.wav \
  -F response_format=json
```

The response should contain a `text` field with your transcript. LocalAI also accepts formats supported by FFmpeg, including browser recordings in WebM. See [LocalAI's transcription documentation](https://localai.io/docs/features/audio-to-text/) for backend-specific options.

## Environment Variables

For a fresh Open WebUI configuration, you can set the same values through environment variables:

```bash
AUDIO_STT_ENGINE=openai
AUDIO_STT_OPENAI_API_BASE_URL=http://127.0.0.1:8081/v1
AUDIO_STT_OPENAI_API_KEY=replace-with-your-own-secret
AUDIO_STT_MODEL=whisper-1
```

Use the reachable base URL for your deployment and the same key as LocalAI. Existing settings saved in Open WebUI's database can override these initial values; check **Settings > Admin > Audio** after restarting.

## Test and Troubleshoot

Click the microphone in the chat input, record a short sentence, and finish the recording. The transcript should appear in the input box. Browser recording requires microphone permission and a secure context such as HTTPS or localhost.

- **Connection refused or timeout:** Check the address from the Open WebUI backend's host or container. Confirm that LocalAI is listening on a reachable interface and port.
- **401 or 403:** Check that the saved STT API key matches LocalAI's key.
- **Model not found:** Check the installed model name with `GET /v1/models`, using the same authorization header.
- **404:** Set the API base URL to end in `/v1`, not `/v1/audio/transcriptions`; Open WebUI appends the endpoint path.
- **Audio decoding error:** Verify FFmpeg is available to LocalAI and try a WAV file directly with the `curl` command. For browser recordings, also check that Open WebUI's allowed extensions and content types include the format your browser sends.

This configures recorded speech-to-text. It does not configure text-to-speech or a realtime voice API.
