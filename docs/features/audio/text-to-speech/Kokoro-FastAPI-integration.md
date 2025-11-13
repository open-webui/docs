---
sidebar_position: 2
title: "Kokoro-FastAPI Using Docker"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

## What is `Kokoro-FastAPI`?

[Kokoro-FastAPI](https://github.com/remsky/Kokoro-FastAPI) is a dockerized FastAPI wrapper for the [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) text-to-speech model that implements the OpenAI API endpoint specification. It offers high-performance text-to-speech with impressive generation speeds.

## Key Features

- OpenAI-compatible Speech endpoint with inline voice combination
- NVIDIA GPU accelerated or CPU Onnx inference
- Streaming support with variable chunking
- Multiple audio format support (`.mp3`, `.wav`, `.opus`, `.flac`, `.aac`, `.pcm`)
- Integrated web interface on localhost:8880/web (or additional container in repo for gradio)
- Phoneme endpoints for conversion and generation

## Voices

- af
- af_bella
- af_irulan
- af_nicole
- af_sarah
- af_sky
- am_adam
- am_michael
- am_gurney
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
- For GPU support: NVIDIA GPU with CUDA 12.3
- For CPU-only: No special requirements

## ⚡️ Quick start

### You can choose between GPU or CPU versions

### GPU Version (Requires NVIDIA GPU with CUDA 12.8)

Using docker run:

```bash
docker run --gpus all -p 8880:8880 ghcr.io/remsky/kokoro-fastapi-gpu
```

Or docker compose, by creating a `docker-compose.yml` file and running `docker compose up`. For example:

```yaml
name: kokoro
services:
    kokoro-fastapi-gpu:
        ports:
            - 8880:8880
        image: ghcr.io/remsky/kokoro-fastapi-gpu:v0.2.1
        restart: always
        deploy:
            resources:
                reservations:
                    devices:
                        - driver: nvidia
                          count: all
                          capabilities:
                              - gpu
```

:::info

You may need to install and configure [the NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)

:::

### CPU Version (ONNX optimized inference)

With docker run:

```bash
docker run -p 8880:8880 ghcr.io/remsky/kokoro-fastapi-cpu
```

With docker compose:

```yaml
name: kokoro
services:
    kokoro-fastapi-cpu:
        ports:
            - 8880:8880
        image: ghcr.io/remsky/kokoro-fastapi-cpu
        restart: always
```

## Setting up Open WebUI to use `Kokoro-FastAPI`

To use Kokoro-FastAPI with Open WebUI, follow these steps:

- Open the Admin Panel and go to `Settings` -> `Audio`
- Set your TTS Settings to match the following:
- - Text-to-Speech Engine: OpenAI
  - API Base URL: `http://localhost:8880/v1` # you may need to use `host.docker.internal` instead of `localhost`
  - API Key: `not-needed`
  - TTS Model: `kokoro`
  - TTS Voice: `af_bella` # also accepts mapping of existing OAI voices for compatibility

:::info

The default API key is the string `not-needed`. You do not have to change that value if you do not need the added security.

:::

## Building the Docker Container

```bash
git clone https://github.com/remsky/Kokoro-FastAPI.git
cd Kokoro-FastAPI
cd docker/cpu # or docker/gpu
docker compose up --build
```

**That's it!**

For more information on building the Docker container, including changing ports, please refer to the [Kokoro-FastAPI](https://github.com/remsky/Kokoro-FastAPI) repository
