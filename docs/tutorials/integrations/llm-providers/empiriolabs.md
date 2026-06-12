---
title: "EmpirioLabs AI"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

[EmpirioLabs AI](https://empiriolabs.ai) is an OpenAI-compatible API that hosts open, proprietary, and custom models (Qwen, DeepSeek, GLM, Kimi, MiniMax, Gemma, and more) with pay-as-you-go pricing. Because the API follows the OpenAI Chat Completions format, it works with Open WebUI's built-in OpenAI connection type, and your available models load automatically.

## Prerequisites

- A running Open WebUI instance
- An EmpirioLabs API key (create one under **API Keys** in the [EmpirioLabs dashboard](https://platform.empiriolabs.ai/dashboard/api-keys))

## Option 1: Connect through the Admin Panel

1. Open the **Admin Panel** and go to **Settings** -> **Connections**.
2. Under **OpenAI API**, click **+** to add a new connection.
3. Set the **API Base URL** to:

   ```
   https://api.empiriolabs.ai/v1
   ```

4. Paste your EmpirioLabs API key into the **API Key** field.
5. Save. Open WebUI fetches the model list from the API automatically, so the EmpirioLabs catalog (for example `qwen3-7-plus`, `deepseek-v4-flash`, `glm-5-1`) appears in the model selector.

## Option 2: Configure with environment variables

For Docker deployments, set the connection at startup:

```bash
docker run -d -p 3000:8080 \
  -e OPENAI_API_BASE_URL=https://api.empiriolabs.ai/v1 \
  -e OPENAI_API_KEY=your_empiriolabs_api_key \
  -v open-webui:/app/backend/data \
  --name open-webui \
  ghcr.io/open-webui/open-webui:main
```

To use EmpirioLabs alongside other OpenAI-compatible endpoints, use the semicolon-separated forms `OPENAI_API_BASE_URLS` and `OPENAI_API_KEYS` instead.

## Verify the connection

1. Open a new chat and pick an EmpirioLabs model from the selector.
2. Send a message. If you get a response, the connection works.
3. If the model list is empty, re-check the base URL (it must include `/v1`) and that the API key is valid.

## Notes

- Model ids match the EmpirioLabs catalog at [empiriolabs.ai/models](https://empiriolabs.ai/models); each model page lists pricing, context window, and supported parameters.
- Reasoning-capable models accept the `reasoning_effort` parameter (`none`, `low`, `medium`, `high`, `max`).
- Full API reference: [docs.empiriolabs.ai](https://docs.empiriolabs.ai).
