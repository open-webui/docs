---
sidebar_position: 3
title: "BlueTTS: Multilingual TTS on CPU"
---

# BlueTTS: Multilingual TTS on CPU

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

## What is `BlueTTS`?

[BlueTTS](https://github.com/maxmelichov/BlueTTS) is an open-source (MIT) text-to-speech model that runs on ONNX Runtime. Its current model, **BlueV3**, speaks seven languages: **Hebrew, English, German, Spanish, Italian, Russian and Yiddish**. It produces 44.1 kHz audio and runs on a CPU, with no GPU required.

The repository includes an OpenAI-compatible server (`examples/openai_server.py`) that serves `POST /v1/audio/speech`, so Open WebUI can use it through its built-in `OpenAI` Text-to-Speech engine.

## Key Features

- 7 languages, with automatic Hebrew/English detection and inline `<en>…</en>` spans for mixed-language text
- 15 built-in voices: female `maya`, `noa`, `lily`, `tamar`, `shira`, `yael`, `emma`, `sara`; male `adam`, `daniel`, `david`, `jonathan`, `ethan`, `michael`, `ariel`
- OpenAI voice names work unchanged: `alloy`→`maya`, `echo`→`adam`, `fable`→`daniel`, `onyx`→`david`, `nova`→`noa`, `shimmer`→`lily`
- Output formats `mp3` (default), `wav`, `pcm`, `flac`, `opus`, `aac`
- Numbers, dates and prices are read out as words (in Yiddish, spell numbers out)
- Runs on CPU by default; a GPU build of ONNX Runtime is optional

## Try It First (Hosted Demo)

To try BlueTTS before installing anything, you can point Open WebUI at the hosted demo server at `https://notmax123-bluev3-api.hf.space/v1` (use the settings [below](#setting-up-open-webui-to-use-bluetts)). You can also listen to the voices on the [Hugging Face demo](https://huggingface.co/spaces/notmax123/BlueV3).

:::info

The hosted demo is a shared server for quick tests only. It adds queue and network time, and your text is sent to it. Run your own server for regular use.

:::

## Quick Start

Requires **Python 3.12+** and [uv](https://docs.astral.sh/uv/).

```bash
# Clone the repository
git clone https://github.com/maxmelichov/BlueTTS.git
cd BlueTTS

# Install dependencies, including the server extra (fastapi + uvicorn)
uv sync --extra server

# Download the BlueV3 model bundle (give --include once per pattern)
uv run hf download notmax123/BlueV3-onnx --include "onnx/*" --include "voices/*" --include "frontend/*" --local-dir ./bluev3_onnx

# Install the G2P package for English, German, Spanish, Italian and Russian (wheel ships in the bundle)
uv pip install --no-index --find-links ./bluev3_onnx/frontend polyg2p==0.1.0

# Start the OpenAI-compatible server on port 8000
uv run python examples/openai_server.py --bundle bluev3_onnx --host 0.0.0.0 --port 8000
```

:::note

The bundle has `polyg2p` wheels for Linux x86-64 (glibc 2.34 or newer) and macOS. There is no Windows wheel yet: on Windows, Hebrew and Yiddish work, but English, German, Spanish, Italian and Russian do not.

:::

Test the server:

```bash
curl http://localhost:8000/v1/audio/speech -H "Content-Type: application/json" \
  -d '{"model": "bluev3", "input": "Hello, this is BlueTTS.", "voice": "noa", "response_format": "wav"}' -o speech.wav
```

### Server Options

| Flag | Environment variable | Default | Description |
|------|---------------------|---------|-------------|
| `--bundle` | `BLUE_BUNDLE` | `bluev3_onnx` | Path to the downloaded bundle |
| `--host` | | `127.0.0.1` | Use `0.0.0.0` so Open WebUI in Docker or on another machine can connect |
| `--port` | | `8000` | Port to listen on |
| `--api-key` | `BLUE_API_KEY` | none | Require `Authorization: Bearer <key>`. Without it, any key is accepted |
| `--default-voice` | | `noa` | Voice used when a request leaves it out |
| `--providers` | `BLUE_PROVIDERS` | `CPUExecutionProvider` | e.g. `CUDAExecutionProvider,CPUExecutionProvider` with a GPU build of ONNX Runtime |
| `--voices-dir` | `BLUE_VOICES_DIR` | bundle's `voices/`, then the repo's `voices/` | Directory of voice JSON files |

The server loads one engine at startup and handles one synthesis at a time; concurrent requests queue.

:::tip MP3 output

Open WebUI does not send `response_format`, so the server returns its default, `mp3`. MP3 needs `ffmpeg` on the server's `PATH` (or a libsndfile build that writes MP3). At startup the server logs a `formats:` line; if `mp3` is not listed, install `ffmpeg`, or set **Additional Parameters** to `{"response_format": "wav"}` in Open WebUI.

:::

## Setting up Open WebUI to use `BlueTTS`

1. Click your **profile icon** (bottom-left corner)
2. Select **Admin Panel**
3. Click **Settings** → **Audio** tab
4. Configure the following:

| Setting | Value |
|---------|-------|
| **Text-to-Speech Engine** | `OpenAI` |
| **API Base URL** | `http://localhost:8000/v1` (Open WebUI in Docker: `http://host.docker.internal:8000/v1`; hosted demo: `https://notmax123-bluev3-api.hf.space/v1`) |
| **API Key** | Any value, e.g. `none` (or the `--api-key` value if you set one) |
| **TTS Model** | `bluev3` |
| **TTS Voice** | e.g. `noa` (any of the 15 voices, or an OpenAI voice name) |

5. Click **Save**

### Choosing the Language

Without a `language` field, the server reads text that contains Hebrew letters as Hebrew and everything else as English. For German, Spanish, Italian, Russian or Yiddish, add the language to **Additional Parameters**:

```json
{"language": "de"}
```

Supported values: `he`, `en`, `de`, `es`, `it`, `ru`, `yi`. Yiddish always needs `{"language": "yi"}`. This setting applies to every request, so leave it empty if you mostly use Hebrew and English.

### Environment Variables Setup

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      - AUDIO_TTS_ENGINE=openai
      - AUDIO_TTS_OPENAI_API_BASE_URL=http://host.docker.internal:8000/v1
      - AUDIO_TTS_OPENAI_API_KEY=none
      - AUDIO_TTS_MODEL=bluev3
      - AUDIO_TTS_VOICE=noa
      # Optional: fixed language for German, Spanish, Italian, Russian or Yiddish
      # - AUDIO_TTS_OPENAI_PARAMS={"language":"de"}
```

## Need More Help?

For voice cloning, streaming, benchmarks and the full API reference, see the [BlueTTS repository](https://github.com/maxmelichov/BlueTTS) and its [OpenAI-compatible server section](https://github.com/maxmelichov/BlueTTS#openai-compatible-server).

## Troubleshooting

### Connection Issues

If Open WebUI can't reach BlueTTS:

- Start the server with `--host 0.0.0.0`; the default `127.0.0.1` only accepts connections from the same machine, not from containers
- **Docker Desktop (Windows/Mac):** Use `http://host.docker.internal:8000/v1`
- **Linux Docker:** Use your host machine's IP address
- Check that the server is up: `curl http://localhost:8000/health`

### Voice Not Working

1. List the available voices: `curl http://localhost:8000/v1/audio/voices`
2. If you started the server with `--api-key`, make sure the same key is set in Open WebUI
3. A `400` error about `response_format` in the logs means MP3 is not available on the server (see the [MP3 output](#server-options) tip above)
4. If English or other non-Hebrew text fails and the server log shows `RuntimeError: This release bundle needs polyg2p`, run the `uv pip install ... polyg2p` step from the [Quick Start](#quick-start)

For more troubleshooting tips, see the [Audio Troubleshooting Guide](/troubleshooting/audio).
