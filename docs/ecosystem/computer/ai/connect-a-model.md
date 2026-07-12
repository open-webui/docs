---
title: Connect a model (API keys and Ollama)
sidebar_position: 2
---

# Connect a model (API keys and Ollama)

Go to **Settings → Admin → Connections** and add a connection. There are exactly two provider types: **OpenAI** and **Anthropic**. There is no separate "Ollama" or "OpenAI-compatible" type: anything that speaks the OpenAI API (Ollama, OpenRouter, vLLM, LM Studio, Groq, ...) is added as provider **OpenAI** with a custom Base URL.

## Connection fields

| Field | What it does |
| --- | --- |
| **Name** | Optional display name for the connection |
| **Provider** | `OpenAI` or `Anthropic` |
| **API Type** | OpenAI only: Chat Completions or Responses |
| **Base URL** | Required. E.g. `https://api.openai.com/v1`, `http://localhost:11434/v1` |
| **API Key** | Required. Ollama ignores the value, but the field must be non-empty |
| **Prefix ID** | Optional namespace prepended to model ids, e.g. `openrouter/gpt-4o` |
| **Models** | Optional comma-separated list. Leave empty to auto-discover |

## Ollama

- **Provider:** OpenAI
- **Base URL:** `http://localhost:11434/v1`
- **API Key:** any text (`ollama` works); Ollama doesn't check it, but the field can't be empty

Your pulled models are auto-discovered and appear in the model selector.

## OpenRouter

- **Provider:** OpenAI
- **Base URL:** `https://openrouter.ai/api/v1`
- **API Key:** your OpenRouter key

OpenRouter exposes many models; set a **Prefix ID** like `openrouter` so its models are namespaced (`openrouter/gpt-4o`) and don't collide with models from other connections.

## Anthropic

- **Provider:** Anthropic
- **Base URL:** `https://api.anthropic.com/v1`
- **API Key:** your Anthropic key

## Model discovery, defaults, enabling

- **Auto-discovery:** with the Models field empty, Computer queries the provider's `/models` endpoint and lists everything it returns.
- **Manual list:** enter a comma-separated list in the Models field to expose only those models. This is useful for providers with huge catalogs or endpoints without a `/models` route.
- **Enable/disable:** individual models can be toggled on or off, so the selector only shows what you actually use.
- **Default model:** set the default for new chats in settings (config key `chat.default_model`).

Prefer a subscription over an API key? See [Use your coding agent subscription](./coding-agents).
