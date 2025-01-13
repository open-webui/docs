---
sidebar_position: 2
title: "🗨️ Kokoro-FastAPI Using Docker"
---

:::warning
This tutorial is a community contribution and is not supported by the OpenWebUI team. It serves only as a demonstration on how to customize OpenWebUI for your specific use case. Want to contribute? Check out the contributing tutorial.
:::

# Integrating `Kokoro-FastAPI` 🗣️ with Open WebUI

## What is `Kokoro-FastAPI`?

[Kokoro-FastAPI](https://github.com/remsky/Kokoro-FastAPI) is a dockerized FastAPI wrapper for the [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) text-to-speech model that implements the OpenAI API endpoint specification. It offers high-performance text-to-speech with impressive generation speeds:

- 100x+ real-time speed via HF A100
- 35-50x+ real-time speed via 4060Ti
- 5x+ real-time speed via M3 Pro CPU

## Key Features

- OpenAI-compatible Speech endpoint with inline voice combination
- NVIDIA GPU accelerated or CPU Onnx inference
- Streaming support with variable chunking
- Multiple audio format support (`.mp3`, `.wav`, `.opus`, `.flac`, `.aac`, `.pcm`)
- Gradio Web UI interface for easy testing
- Phoneme endpoints for conversion and generation

## Voices

- af
- af_bella
- af_nicole
- af_sarah
- af_sky
- am_adam
- am_michael
- bf_emma
- bf_isabella
- bm_george
- bm_lewis

## Languages

- en_us
- en_uk

## Requirements

- Docker installed on your system
- Open WebUI running
- For GPU support: NVIDIA GPU with CUDA 12.1
- For CPU-only: No special requirements

## ⚡️ Quick start

### You can choose between GPU or CPU versions

### GPU Version (Requires NVIDIA GPU with CUDA 12.1)

```bash
docker run -d -p 8880:8880 -p 7860:7860 remsky/kokoro-fastapi:latest
```

### CPU Version (ONNX optimized inference)

```bash
docker run -d -p 8880:8880 -p 7860:7860 remsky/kokoro-fastapi:cpu-latest
```

## Setting up Open WebUI to use `Kokoro-FastAPI`

To use Kokoro-FastAPI with Open WebUI, follow these steps:

- Open the Admin Panel and go to `Settings` -> `Audio`
- Set your TTS Settings to match the following:
- - Text-to-Speech Engine: OpenAI
  - API Base URL: `http://localhost:8880/v1`
  - API Key: `not-needed`
  - TTS Model: `kokoro`
  - TTS Voice: `af_bella`

:::info
The default API key is the string `not-needed`. You do not have to change that value if you do not need the added security.
:::

## Building the Docker Container

```bash
git clone https://github.com/remsky/Kokoro-FastAPI.git
cd Kokoro-FastAPI
docker compose up --build
```

**That's it!**

## For more information on building the Docker container, including changing ports, please refer to the [Kokoro-FastAPI](https://github.com/remsky/Kokoro-FastAPI) repository
