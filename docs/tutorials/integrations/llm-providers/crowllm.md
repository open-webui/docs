---
sidebar_position: 2
title: "CrowLLM"
---

**CrowLLM** is an OpenAI-compatible AI gateway: one base URL and one API key for models from several labs. Open WebUI can use it through the built-in **OpenAI API** connection type, so no plugin or proxy is required.

- API base URL: `https://crowllm.com/v1`
- Models endpoint: `https://crowllm.com/v1/models`
- API keys and usage: [https://crowllm.com](https://crowllm.com)
- Pricing: [https://crowllm.com/pricing](https://crowllm.com/pricing)

:::info

CrowLLM implements the OpenAI Chat Completions API (`POST /v1/chat/completions`, streaming, and `/v1/models`). Features such as tool calling, structured output, and reasoning traces depend on the individual model behind the gateway; models that expose reasoning return it in `reasoning_content`, which Open WebUI renders as a thinking block.

:::

---

## Step 1: Get an API Key

Create an account at [https://crowllm.com](https://crowllm.com) and generate an API key from the dashboard. The key is sent as a standard `Authorization: Bearer <key>` header.

## Step 2: Add CrowLLM as a Connection

1. Open **Admin Panel → Settings → Connections**.
2. In the **OpenAI API** section, click **+** next to *Manage OpenAI API Connections*.
3. Fill in:
   - **URL**: `https://crowllm.com/v1`
   - **Key**: your CrowLLM API key
4. Click **Save**.

If you run Open WebUI as a single user without an admin panel, open **Settings → Connections** and configure the same OpenAI API connection there.

## Step 3: Select a Model

Open a new chat and pick a model from the selector. The list comes straight from `GET https://crowllm.com/v1/models`, so every model your key can reach appears automatically. Example ids:

| Model id | Notes |
| --- | --- |
| `deepseek-v4-flash` | Low-cost chat model |
| `glm-5.3` | 200K context, chat and tools |
| `kimi-k3` | 256K context, text and image input |
| `claude-opus-4-7` | Anthropic flagship, text and image input |
| `gemini-3.7-flash` | Gemini flash tier, text and image input |
| `grok-4.7:free` | Zero-rated shelf model |

The `:free` suffix marks zero-rated models; the rest are billed per token at the rates shown on the pricing page.

## Troubleshooting

- **401 Unauthorized** – re-check the key, and make sure the URL ends with `/v1` (not just the host name).
- **Model missing from the selector** – refresh the model list in **Admin Panel → Settings → Models**, or check that your key has access to that model id at `https://crowllm.com/v1/models`.
- **Reasoning not shown** – only models that emit `reasoning_content` produce a thinking block; switch models to compare.
