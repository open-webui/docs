---
sidebar_position: 12
title: "Brainiall LLM Gateway"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the [contributing tutorial](/contributing).

:::

# Connect Brainiall LLM Gateway

[Brainiall](https://brainiall.com) is an OpenAI-compatible LLM gateway that provides access to **113+ models from 17 providers** through a single API endpoint. It routes requests to AWS Bedrock, giving you access to models from Anthropic, DeepSeek, Meta, Mistral, Amazon, Google, and more — all through the standard OpenAI API format.

## Prerequisites

- **Open WebUI** installed and running
- **Brainiall API key** — sign up at [brainiall.com](https://brainiall.com)

## Setup via Admin Panel

1. Open **Admin Panel** > **Settings** > **Connections**
2. Under **OpenAI API**, click **"+ Add Connection"**
3. Fill in the connection details:
   - **URL**: `https://apim-ai-apis.azure-api.net/v1`
   - **API Key**: your Brainiall API key
4. Click the **checkmark** button to verify and save the connection
5. Once saved, all available models will auto-populate in the model selector

:::tip

After saving the connection, go to the chat interface and click the model selector dropdown. You should see models prefixed with their provider names (e.g., `claude-opus-4-6`, `deepseek-r1`, `llama-3.3-70b`).

:::

## Setup via Docker Compose

You can also configure the connection through environment variables in your `docker-compose.yml`:

```yaml title="docker-compose.yml"
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    container_name: open-webui
    volumes:
      - open-webui:/app/backend/data
    ports:
      - "3000:8080"
    environment:
      - OPENAI_API_BASE_URLS=https://apim-ai-apis.azure-api.net/v1
      - OPENAI_API_KEYS=your-brainiall-api-key
    restart: unless-stopped

volumes:
  open-webui: {}
```

:::tip

To use Brainiall alongside other OpenAI-compatible providers (such as a local Ollama instance), separate each URL and key with a semicolon:

```
OPENAI_API_BASE_URLS=https://apim-ai-apis.azure-api.net/v1;http://host.docker.internal:11434/v1
OPENAI_API_KEYS=your-brainiall-api-key;ollama-key
```

:::

## Available Models

Brainiall provides access to 113+ models. Here is a selection of popular models available through the gateway:

| Provider | Model | Context Window |
|----------|-------|----------------|
| Anthropic | `claude-opus-4-6` | 200K |
| Anthropic | `claude-sonnet-4-6` | 200K |
| Anthropic | `claude-haiku-4-5` | 200K |
| DeepSeek | `deepseek-r1` | 128K |
| DeepSeek | `deepseek-v3` | 128K |
| Meta | `llama-3.3-70b` | 128K |
| Meta | `llama-4-scout-17b` | 128K |
| Mistral | `mistral-large-3` | 128K |
| Amazon | `nova-pro` | 300K |
| Amazon | `nova-micro` | 128K |
| Qwen | `qwen3-235b` | 128K |

For the full list of available models, use the models endpoint:

```bash
curl https://apim-ai-apis.azure-api.net/v1/models \
  -H "Authorization: Bearer your-brainiall-api-key"
```

## Features

- **OpenAI-compatible API**: works with any tool or framework that supports the OpenAI API format
- **Streaming support**: real-time token streaming for all chat models
- **Function calling**: tool use and structured outputs where supported by the underlying model
- **Single API key**: one key provides access to all 113+ models across 17 providers

## Troubleshooting

- **Connection verification fails**: double-check that the URL ends with `/v1` and that your API key is valid.
- **No models appear**: click the refresh button next to the connection. If models still do not load, verify your API key has not expired.
- **Slow responses**: Brainiall routes to AWS Bedrock. Latency depends on the model selected and the size of your request. Smaller models like `nova-micro` or `claude-haiku-4-5` will respond faster.

## Learn More

- [Brainiall website](https://brainiall.com)
