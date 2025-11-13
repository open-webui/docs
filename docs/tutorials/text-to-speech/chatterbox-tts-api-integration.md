---
sidebar_position: 3
title: "Chatterbox TTS — Voice Cloning"
---

# Chatterbox TTS — Voice Cloning

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

## What is `Chatterbox TTS API`?

[Chatterbox TTS API](https://github.com/travisvn/chatterbox-tts-api) is an API wrapper that allows for voice cloning and text-to-speech, serving as a direct substitute for the OpenAI Speech API endpoint.

[![Link to Resemble AI voice samples](https://img.shields.io/badge/listen-demo_samples-blue)](https://resemble-ai.github.io/chatterbox_demopage/)

## Key Features

- Zero-shot voice cloning — only ~10 seconds of any voice sample needed
- [Outperforms ElevenLabs](https://podonos.com/resembleai/chatterbox)
- Watermarked outputs for responsible voice cloning
- 0.5B Llama backbone
- Custom Voice Library management
- Streaming support for fast generation
- Advanced memory management and automatic cleanup
- Optional frontend for easy management and usage

### Hardware Recommendations

- Memory: 4GB minimum, 8GB+ recommended
- GPU: CUDA (Nvidia), Apple M-series (MPS)
- CPU: Works but slower — GPU recommended for production

:::info

Chatterbox can use a good deal of memory and has hardware requirements that might be higher than you're used to with other local TTS solutions. If you have trouble meeting the requirements, you might find [OpenAI Edge TTS](https://docs.openwebui.com/tutorials/text-to-speech/openai-edge-tts-integration) or [Kokoro-FastAPI](https://docs.openwebui.com/tutorials/text-to-speech/Kokoro-FastAPI-integration) to be suitable replacements.

:::

## ⚡️ Quick start

### 🐍 Using Python

#### Option A: Using uv (Recommended - Faster & Better Dependencies)

```bash

# Clone the repository
git clone https://github.com/travisvn/chatterbox-tts-api
cd chatterbox-tts-api

# Install uv if you haven't already
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install dependencies with uv (automatically creates venv)
uv sync

# Copy and customize environment variables
cp .env.example .env

# Start the API with FastAPI
uv run uvicorn app.main:app --host 0.0.0.0 --port 4123

# Or use the main script
uv run main.py
```

> 💡 **Why uv?** Users report better compatibility with `chatterbox-tts`, 25-40% faster installs, and superior dependency resolution. [See migration guide →](https://github.com/travisvn/chatterbox-tts-api/blob/main/docs/UV_MIGRATION.md)

#### Option B: Using pip (Traditional)

```bash

# Clone the repository
git clone https://github.com/travisvn/chatterbox-tts-api
cd chatterbox-tts-api

# Setup environment — using Python 3.11
python -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy and customize environment variables
cp .env.example .env

# Add your voice sample (or use the provided one)

# cp your-voice.mp3 voice-sample.mp3

# Start the API with FastAPI
uvicorn app.main:app --host 0.0.0.0 --port 4123

# Or use the main script
python main.py
```

> Ran into issues? Check the [troubleshooting section](https://github.com/travisvn/chatterbox-tts-api?tab=readme-ov-file#common-issues)

### 🐳 Docker (Recommended)

```bash

# Clone and start with Docker Compose
git clone https://github.com/travisvn/chatterbox-tts-api
cd chatterbox-tts-api

# Use Docker-optimized environment variables
cp .env.example.docker .env  # Docker-specific paths, ready to use

# Or: cp .env.example .env    # Local development paths, needs customization

# Choose your deployment method:

# API Only (default)
docker compose -f docker/docker-compose.yml up -d             # Standard (pip-based)
docker compose -f docker/docker-compose.uv.yml up -d          # uv-optimized (faster builds)
docker compose -f docker/docker-compose.gpu.yml up -d         # Standard + GPU
docker compose -f docker/docker-compose.uv.gpu.yml up -d      # uv + GPU (recommended for GPU users)
docker compose -f docker/docker-compose.cpu.yml up -d         # CPU-only

# API + Frontend (add --profile frontend to any of the above)
docker compose -f docker/docker-compose.yml --profile frontend up -d             # Standard + Frontend
docker compose -f docker/docker-compose.gpu.yml --profile frontend up -d         # GPU + Frontend
docker compose -f docker/docker-compose.uv.gpu.yml --profile frontend up -d      # uv + GPU + Frontend

# Watch the logs as it initializes (the first use of TTS takes the longest)
docker logs chatterbox-tts-api -f

# Test the API
curl -X POST http://localhost:4123/v1/audio/speech \
  -H "Content-Type: application/json" \
  -d '{"input": "Hello from Chatterbox TTS!"}' \
  --output test.wav
```

<!-- markdownlint-disable-next-line MD033 -->
<details>
<!-- markdownlint-disable-next-line MD033 -->
<summary>**🚀 Running with the Frontend Interface**</summary>

This project includes an optional React-based web UI. Use Docker Compose profiles to easily opt in or out of the frontend:

### With Docker Compose Profiles

```bash

# API only (default behavior)
docker compose -f docker/docker-compose.yml up -d

# API + Frontend + Web UI (with --profile frontend)
docker compose -f docker/docker-compose.yml --profile frontend up -d

# Or use the convenient helper script for fullstack:
python start.py fullstack

# Same pattern works with all deployment variants:
docker compose -f docker/docker-compose.gpu.yml --profile frontend up -d    # GPU + Frontend
docker compose -f docker/docker-compose.uv.yml --profile frontend up -d     # uv + Frontend
docker compose -f docker/docker-compose.cpu.yml --profile frontend up -d    # CPU + Frontend
```

### Local Development

For local development, you can run the API and frontend separately:

```bash

# Start the API first (follow earlier instructions)

# Then run the frontend:
cd frontend && npm install && npm run dev
```

Click the link provided from Vite to access the web UI.

### Build for Production

Build the frontend for production deployment:

```bash
cd frontend && npm install && npm run build
```

You can then access it directly from your local file system at `/dist/index.html`.

### Port Configuration

- **API Only**: Accessible at `http://localhost:4123` (direct API access)
- **With Frontend**: Web UI at `http://localhost:4321`, API requests routed via proxy

The frontend uses a reverse proxy to route requests, so when running with `--profile frontend`, the web interface will be available at `http://localhost:4321` while the API runs behind the proxy.

</details>

## Setting up Open WebUI to use `Chatterbox TTS API`

We recommend running with the frontend interface so you can upload the audio files for the voices you'd like to use before configuring Open WebUI's settings. If started correctly (see guide above), you can visit `http://localhost:4321` to access the frontend.

To use Chatterbox TTS API with Open WebUI, follow these steps:

- Open the Admin Panel and go to `Settings` -> `Audio`
- Set your TTS Settings to match the following:
- - Text-to-Speech Engine: OpenAI
  - API Base URL: `http://localhost:4123/v1` # alternatively, try `http://host.docker.internal:4123/v1`
  - API Key: `none`
  - TTS Model: `tts-1` or `tts-1-hd`
  - TTS Voice: Name of the voice you've cloned (can also include aliases, defined in the frontend)
  - Response splitting: `Paragraphs`

:::info

The default API key is the string `none` (no API key required)

:::

![Screenshot of Open WebUI Admin Settings for Audio adding the correct endpoints for this project](https://lm17s1uz51.ufs.sh/f/EsgO8cDHBTOUjUe3QjHytHQ0xqn2CishmXgGfeJ4o983TUMO)

## Please ⭐️ star the [repo on GitHub](https://github.com/travisvn/chatterbox-tts-api) to support development

## Need help?

Chatterbox can be challenging to get running the first time, and you may want to try different install options if you run into issues with a particular one.

For more information on `chatterbox-tts-api`, you can visit the [GitHub repo](https://github.com/travisvn/chatterbox-tts-api)

- 📖 **Documentation**: See [API Documentation](https://github.com/travisvn/chatterbox-tts-api/blob/main/docs/API_README.md) and [Docker Guide](https://github.com/travisvn/chatterbox-tts-api/blob/main/docs/DOCKER_README.md)
- 💬 **Discord**: [Join the Discord for this project](http://chatterboxtts.com/discord)
