---
sidebar_position: 2
title: "Anthropic (Claude)"
---

## Native Anthropic Integration

Open WebUI includes a native Anthropic provider that communicates directly with the [Anthropic Messages API](https://docs.anthropic.com/en/api/messages) via the official Python SDK. This provides direct access to Anthropic-specific features that are unavailable through OpenAI-compatible proxies, including extended thinking (reasoning blocks), accurate token usage reporting, and native tool use formatting.

:::info

This integration is a first-class connection type alongside OpenAI and Ollama. It supports multiple connections, per-connection configuration, model discovery, streaming, and tool/function calling — all managed through the Admin Settings UI.

:::

## Prerequisites

- An [Anthropic API key](https://console.anthropic.com/settings/keys)
- Open WebUI installed and running

## Quick Setup via Admin UI

1. Navigate to **Admin Settings > Connections**.
2. Find the **Anthropic API** section.
3. Ensure the toggle is **enabled**.
4. Click the **+** button to add a new connection.
5. Enter:
   - **URL**: `https://api.anthropic.com` (default, pre-filled)
   - **API Key**: Your Anthropic API key (starts with `sk-ant-`)
6. Click **Save**.
7. Click the **refresh** button to verify the connection and load models.

Once saved, Anthropic models (Claude Opus 4, Sonnet 4, Haiku 3.5, etc.) will appear in the model selector and are ready to use.

## Environment Variable Setup

You can also configure the Anthropic connection via environment variables, which is useful for Docker or Kubernetes deployments.

```bash
ENABLE_ANTHROPIC_API=true
ANTHROPIC_API_KEY=sk-ant-your-key-here
ANTHROPIC_API_BASE_URL=https://api.anthropic.com
```

For multiple connections, use semicolon-separated values:

```bash
ANTHROPIC_API_KEYS=sk-ant-key-one;sk-ant-key-two
ANTHROPIC_API_BASE_URLS=https://api.anthropic.com;https://custom-anthropic-proxy.example.com
```

### Docker Compose Example

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      - ENABLE_ANTHROPIC_API=true
      - ANTHROPIC_API_KEY=sk-ant-your-key-here
    ports:
      - "3000:8080"
```

## Per-Connection Configuration

Each Anthropic connection can be individually configured by clicking the **gear icon** next to the connection in the Admin UI. Available options:

| Option | Description |
|--------|-------------|
| **Enable** | Enable or disable this specific connection |
| **Model IDs** | Restrict which models are exposed (leave empty for all available models) |
| **Prefix ID** | Custom prefix for model IDs and names (e.g., `work` produces `work.claude-sonnet-4-20250514`) |
| **Tags** | Custom tags displayed in the model selector for easy identification |
| **Connection Type** | Mark as `external` or `internal` for organizational purposes |

:::tip

**Prefix IDs** are useful when you have multiple Anthropic connections (e.g., separate keys for work and personal use). The prefix is automatically added as a tag in the model selector, making it easy to distinguish between connections.

:::

## Supported Features

| Feature | Status |
|---------|--------|
| Chat completions (streaming) | Supported |
| Chat completions (non-streaming) | Supported |
| System prompts | Supported |
| Image input (vision) | Supported |
| Tool/function calling | Supported |
| Extended thinking (reasoning) | Supported |
| Token usage reporting | Supported |
| Multiple connections | Supported |
| Model discovery | Supported (with fallback to known models) |

## Model Discovery

Models are automatically fetched from the Anthropic API. If model listing is unavailable (e.g., some proxy configurations), the integration falls back to a built-in list of known models with accurate context window and max output token metadata.

## Token Usage

Token usage (input tokens, output tokens, total tokens) is included in both streaming and non-streaming responses. Usage data appears in the info tooltip on each assistant message.

## Environment Variables Reference

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `ENABLE_ANTHROPIC_API` | `bool` | `true` | Enables the Anthropic provider |
| `ANTHROPIC_API_KEY` | `str` | — | Anthropic API key |
| `ANTHROPIC_API_KEYS` | `str` | — | Multiple API keys, semicolon-separated |
| `ANTHROPIC_API_BASE_URL` | `str` | `https://api.anthropic.com` | Anthropic API base URL |
| `ANTHROPIC_API_BASE_URLS` | `str` | — | Multiple base URLs, semicolon-separated |

All connection-related environment variables are `PersistentConfig` variables — once set, their values are saved in the database and persist across restarts. Changes made in the Admin UI take precedence over the initial environment variable values.
