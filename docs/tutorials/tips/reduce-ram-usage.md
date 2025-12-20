---
sidebar_position: 10
title: "Reduce RAM Usage"
---

## Reduce RAM Usage

If you are deploying this image in a RAM-constrained environment, there are a few things you can do to slim down the image.

On a Raspberry Pi 4 (arm64) with version v0.3.10, this was able to reduce idle memory consumption from >1GB to ~200MB (as observed with `docker container stats`).

## TLDR

Set the following environment variables (or the respective UI settings for an existing deployment): `RAG_EMBEDDING_ENGINE: ollama`, `AUDIO_STT_ENGINE: openai`.

## Longer explanation

Much of the memory consumption is due to loaded ML models. Even if you are using an external language model (OpenAI or unbundled ollama), many models may be loaded for additional purposes.

As of v0.3.10 this includes:

- Speech-to-text (whisper by default)
- RAG embedding engine (defaults to local SentenceTransformers model)
- Image generation engine (disabled by default)

The first 2 are enabled and set to local models by default. You can change the models in the admin panel (RAG: Documents category, set it to Ollama or OpenAI, Speech-to-text: Audio section, work with OpenAI or WebAPI).
If you are deploying a fresh Docker image, you can also set them with the following environment variables: `RAG_EMBEDDING_ENGINE: ollama`, `AUDIO_STT_ENGINE: openai`. Note that these environment variables have no effect if a `config.json` already exists.
