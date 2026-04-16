---
sidebar_position: 0
title: "Connect a Provider"
---

# 🔌 Connect a Provider

**Connect Open WebUI to your model provider and start chatting in minutes.**

Open WebUI supports multiple connection protocols, including **Ollama**, **OpenAI-compatible APIs**, and **Open Responses**. Any cloud API or local server that speaks one of these protocols works out of the box. Just add a URL and API key, and your models appear in the dropdown.

---

## How It Works

```
┌──────────────┐         ┌──────────────────┐         ┌──────────────┐
│              │  HTTP    │                  │  Inference│             │
│  Open WebUI  │────────▶│  Provider API    │────────▶ │    Model     │
│  (frontend)  │◀────────│  (cloud/local)   │◀──────── │  (LLM/VLM)  │
│              │  Stream  │                  │  Tokens  │             │
└──────────────┘         └──────────────────┘         └──────────────┘
```

1. **You type a message** in Open WebUI
2. Open WebUI sends it to your provider's API endpoint
3. The provider runs inference on the selected model
4. Tokens **stream back** to Open WebUI in real time
5. You see the response in the chat interface

:::tip
Adding a provider is as simple as entering a URL and API key in **Admin Settings → Connections**. Open WebUI auto-detects available models from most providers.
:::

---

## Cloud Providers

Hosted APIs that require an account and API key. No hardware needed.

| Provider | Models | Guide |
|----------|--------|-------|
| **Ollama** | Llama, Mistral, Gemma, Phi, and thousands more (local) | [Starting with Ollama →](./starting-with-ollama) |
| **OpenAI** | GPT-4o, GPT-4.1, o3, o4-mini | [Starting with OpenAI →](./starting-with-openai) |
| **Anthropic** | Claude Opus, Sonnet, Haiku | [Starting with Anthropic →](./starting-with-anthropic) |
| **OpenAI-Compatible** | Google Gemini, DeepSeek, Mistral, Groq, OpenRouter, Amazon Bedrock, Azure, and more | [OpenAI-Compatible Providers →](./starting-with-openai-compatible) |

---

## Local Servers

Run models on your own hardware. No API keys, no cloud dependency.

| Server | Description | Guide |
|--------|-------------|-------|
| **llama.cpp** | Efficient GGUF model inference with OpenAI-compatible API | [Starting with llama.cpp →](./starting-with-llama-cpp) |
| **vLLM** | High-throughput inference engine for production workloads | [Starting with vLLM →](./starting-with-vllm) |

More local servers (LM Studio, LocalAI, Docker Model Runner, Lemonade) are covered in the [OpenAI-Compatible Providers](./starting-with-openai-compatible#local-servers) guide.

---

## Other Connection Methods

| Feature | Description | Guide |
|---------|-------------|-------|
| **Open Responses** | Connect providers using the Open Responses specification | [Starting with Open Responses →](./starting-with-open-responses) |
| **Functions** | Extend Open WebUI with custom pipe functions for any backend | [Starting with Functions →](./starting-with-functions) |

---

## Looking for Agents?

If you want to connect an autonomous AI agent (with terminal access, file operations, web search, and more) instead of a plain model provider, see [**Connect an Agent**](/getting-started/quick-start/connect-an-agent).
