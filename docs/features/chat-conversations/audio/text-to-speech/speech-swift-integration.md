---
sidebar_position: 2
title: "Speech Swift Integration"
---

# Using Speech Swift for local text-to-speech

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

[Speech Swift](https://github.com/soniqo/speech-swift) runs speech models locally on Apple Silicon and exposes an OpenAI-compatible `POST /v1/audio/speech` endpoint. Open WebUI can use that endpoint through its existing OpenAI text-to-speech engine, without an Open WebUI plugin.

## Requirements

- An Apple Silicon Mac running macOS 15 or later
- [Homebrew](https://brew.sh/)
- Open WebUI installed and running

:::important

This integration requires Speech Swift 0.0.23 or later. If Homebrew already
installed an older version, run `brew update && brew upgrade speech` first.

:::

## Install and start Speech Swift

Install the packaged command-line tools:

```bash
brew install speech
```

If Open WebUI runs directly on the same Mac, start the server on its default loopback address:

```bash
speech-server --port 8080
```

If Open WebUI runs in Docker Desktop, allow the container to reach the host service:

```bash
speech-server --host 0.0.0.0 --port 8080
```

:::caution

Binding to `0.0.0.0` exposes the service beyond localhost. Use it only on a trusted network and restrict access with your firewall.

:::

Confirm that the server is ready:

```bash
curl http://127.0.0.1:8080/health
```

## Configure Open WebUI

1. Open your **Admin Panel**.
2. Go to **Settings** → **Audio**.
3. Configure text-to-speech with the following values:

| Setting | Open WebUI on macOS | Open WebUI in Docker Desktop |
| --- | --- | --- |
| **Text-to-Speech Engine** | `OpenAI` | `OpenAI` |
| **API Base URL** | `http://127.0.0.1:8080/v1` | `http://host.docker.internal:8080/v1` |
| **API Key** | `local` | `local` |
| **TTS Model** | `tts-1` | `tts-1` |
| **TTS Voice** | `alloy` | `alloy` |

The local server does not validate the placeholder API key. It returns WAV audio by default, which Open WebUI transcodes for browser playback.

## Select a local model

`tts-1` and `tts-1-hd` select the lightweight Kokoro Core ML engine. You can replace the **TTS Model** value with another Speech Swift model alias:

| Model alias | Local engine |
| --- | --- |
| `kokoro` | Kokoro-82M Core ML |
| `qwen3-tts` | Qwen3-TTS MLX |
| `qwen3-tts-coreml` | Qwen3-TTS Core ML |
| `cosyvoice` | CosyVoice3 MLX |
| `voxcpm2` | VoxCPM2 MLX |
| `indic-mio` | Indic-Mio MLX |
| `magpie` | Magpie TTS MLX |
| `magpie-coreml` | Magpie TTS Core ML |
| `vibevoice` | VibeVoice Realtime MLX |

The first request for a model downloads its weights and therefore takes longer. Generic OpenAI voice names such as `alloy` select the chosen engine's default voice. Kokoro and Qwen3-TTS also accept their native voice names.

## Test the endpoint directly

```bash
curl http://127.0.0.1:8080/v1/audio/speech \
  -H "Content-Type: application/json" \
  -d '{"model":"tts-1","voice":"alloy","input":"Hello from Open WebUI","response_format":"wav"}' \
  --output speech.wav
```

After this succeeds, send a message in Open WebUI and select the **speaker** button on an assistant response.

## Troubleshooting

### Open WebUI cannot connect

- For a native installation, verify that `http://127.0.0.1:8080/health` responds.
- For Docker Desktop, use `host.docker.internal`, not `localhost`, and start `speech-server` with `--host 0.0.0.0`.
- Check that macOS Firewall permits the connection from Docker Desktop.

### The first request is slow

Model weights are downloaded and loaded on first use. Keep the server running and retry after the model finishes loading if the first Open WebUI request times out.

### The server rejects an audio format

Speech Swift currently returns WAV by default and supports raw PCM when explicitly requested. Do not set Open WebUI's OpenAI TTS parameters to request MP3, Opus, AAC, or FLAC.
