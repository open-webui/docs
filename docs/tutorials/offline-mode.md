---
sidebar_position: 24
title: "🔌 Offline Mode"
---

:::warning
This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the [contributing tutorial](../contributing.mdx).
:::

# Running Open WebUI in offline mode 🔌

If you want to run Open WebUI in offline mode, you have to consider your installation approach and adjust your desired features accordingly. In this guide, we will go over the different ways of achieving a mostly similar setup to the online version.

## What means offline mode?

The offline mode of Open WebUI lets you run the application without the need for an active internet connection. This allows you to create an 'air-gapped' environment for your LLMs and tools (a fully 'air-gapped' environment requires isolating the instance from the internet).

:::info

**Disabled functionality when offline mode is enabled:**

- Automatic version update checks
- Downloads of embedding models from Hugging Face Hub
  - If you did not download an embedding model prior to activating `OFFLINE_MODE` any RAG, web search and document analysis functionality may not work properly
- Update notifications in the UI

**Still functional:**

- External LLM API connections (OpenAI, etc.)
- OAuth authentication providers
- Web search and RAG with external APIs

:::

## How to enable offline mode?

The offline mode has to be enabled via the [environment variable](https://docs.openwebui.com/getting-started/env-configuration#offline_mode) `OFFLINE_MODE`.
Apply the environment variable depending on your way of deploying Open WebUI.

:::tip

Consider if you need to start the application offline from the beginning of your deployment. If your use case does not require immediate offline capability, follow **approach II** for an easier setup.

:::

## Approach I

### I: Speech-To-Text

The local `whisper` installation does not include the model by default. In this regard, you can follow the [guide](/docs/tutorials/speech-to-text/stt-config.md) only partially if you want to use an external model/provider. To use the local `whisper` application, you must first download the model of your choice (e.g. [Huggingface - Systran](https://huggingface.co/Systran)).

```python
from faster_whisper import WhisperModel

faster_whisper_kwargs = {
    "model_size_or_path": "Systran/faster-whisper-large-v3",
    "device": "cuda", # set this to download the cuda adjusted model
    "compute_type": "int8",
    "download_root": "/path/of/your/choice"
}

WhisperModel(**faster_whisper_kwargs)
```

The contents of the download directory must be copied to `/app/backend/data/cache/whisper/models/` within your Open WebUI deployment. It makes sense to directly declare your `whisper` model via the [environment variable](https://docs.openwebui.com/getting-started/env-configuration#whisper_model), like this: `WHISPER_MODEL=Systran/faster-whisper-large-v3`.

### I: Text-To-Speech

The default local transformer can already handle the text-to-speech function. If you prefer a different approach, follow one of the [guides](https://docs.openwebui.com/category/%EF%B8%8F-text-to-speech).

### I: Embedding Model

For various purposes, you will need an embedding model (e.g. [RAG](/docs/features/rag.md)). You will first have to download such a model of your choice (e.g. [Huggingface - sentence-transformers](https://huggingface.co/sentence-transformers)).

```python
from huggingface_hub import snapshot_download

snapshot_download(repo_id="sentence-transformers/all-MiniLM-L6-v2", cache_dir="/path/of/your/choice")
```

The contents of the download directory must be copied to `/app/backend/data/cache/embedding/models/` within your Open WebUI deployment. It makes sense to directly declare your embedding model via the [environment variable](https://docs.openwebui.com/getting-started/env-configuration#rag_embedding_model), like this: `RAG_EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2`.

## Approach II

### Running Open WebUI with internet connection during setup

This is the easiest approach to achieving the offline setup with almost all features available in the online version. Apply only the features you want to use for your deployment.

### II: Speech-To-Text

Follow the [guide](./speech-to-text/stt-config.md).

### II: Text-To-Speech

Follow one of the [guides](https://docs.openwebui.com/category/%EF%B8%8F-text-to-speech).

### II: Embedding Model

In your Open WebUI installation, navigate to `Admin Settings` > `Settings` > `Documents` and select the embedding model you would like to use (e.g. [sentence-transformer/all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)). After the selection, click the download button next to it.

---

After you have installed all your desired features, set the environment variable `OFFLINE_MODE=True` depending on your type of Open WebUI deployment.

## Sidenote

As previously mentioned, to achieve a fully offline experience with Open WebUI, you must disconnect your instance from the internet. The offline mode only prevents errors within Open WebUI when there is no internet connection.

How you disconnect your instance is your choice. Here is an example via `docker-compose`:

```yaml
services:
  # requires a reverse-proxy
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    restart: unless-stopped
    environment:
      - OFFLINE_MODE=True
      - RAG_EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
      - WHISPER_MODEL=Systran/faster-whisper-large-v3
    volume:
      - ./open-webui-data:/app/backend/data
      - ./models/sentence-transformers/all-MiniLM-L6-v2:/app/backend/data/cache/embedding/models/
      - ./models/Systran/faster-whisper-large-v3:/app/backend/data/cache/whisper/models/
    networks:
      - open-webui-internal

networks:
  open-webui-internal:
    name: open-webui-internal-network
    driver: bridge
    internal: true
```
