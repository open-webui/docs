---
sidebar_position: 10
title: "Slimming down RAM usage"
---

# Slimming down RAM usage

If you deploy this image in a RAM constrained environment, there are a few things you can do do slim down the image.

On a Raspberry Pi 4 (arm64) with version v0.3.10 this was able to reduce idle memory consumption from >1GB to ~200MB (as observed with `docker container stats`).

## TLDR

Set the following environment variables: `RAG_EMBEDDING_ENGINE: ollama`, `AUDIO_STT_ENGINE: openai`.

## Longer explanation

A lot of the memory consumption is because of loaded ML models. Even if you use an external language model (OpenAI or un-bundled ollama) a lot of models may be loaded for additional purposes.

As of v0.3.10 this includes:
* Speach-to-text (defaults to whisper)
* RAG Embedding engine (defaults to local SentenceTransformers model)
* Image generation engine (disabled by default)

The first 2 are enabled and set to local models by default. You can change the models in the admin planel (RAG: Documents category, set it to ollama or OpenAI, Speach-to-text: Audio section, OpenAI or WebAPI work).
If you deploy via docker you can also set these with the following environment variables: `RAG_EMBEDDING_ENGINE: ollama`, `AUDIO_STT_ENGINE: openai`.
