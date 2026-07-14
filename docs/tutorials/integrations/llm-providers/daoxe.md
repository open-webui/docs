---
sidebar_position: 40
title: "DaoXE"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the [contributing tutorial](/contributing).

:::

# Connect Open WebUI to DaoXE

**DaoXE** is a multi-model multi-protocol AI API gateway. For Open WebUI, use the **OpenAI-compatible** Chat Completions path: set the connection URL to `https://daoxe.com/v1`, add your API key, and select a model ID from your account.

:::note
DaoXE is **not available in mainland China**. Model availability is account-scoped (there is no fixed public model list). Setup examples: [DaoXE-AI](https://github.com/seven7763/DaoXE-AI).
:::

## Prerequisites

- An Open WebUI deployment with admin access to **Admin Settings → Connections**
- A DaoXE account and API key from [daoxe.com](https://daoxe.com)
- At least one model enabled for that key (check the DaoXE dashboard or `GET /v1/models`)

## Admin connection (recommended)

1. Open Open WebUI and go to **Admin Settings → Connections → OpenAI**.
2. Click **Add Connection** (or the **+** icon under OpenAI API connections).
3. Fill in:

| Setting | Value |
|---|---|
| **URL** | `https://daoxe.com/v1` |
| **API Key** | Your DaoXE API key |
| **Model IDs (Filter)** | Optional. Leave empty to use authenticated `/models` discovery, or add specific model IDs from your account |

4. Save the connection. If verification succeeds, models for that key appear in the model selector.
5. Start a chat and pick a DaoXE model from the dropdown.

:::tip
Open WebUI verifies connections with `GET /models` using a Bearer token. DaoXE supports authenticated model listing for the key you provide. If your catalog is large, add a short allowlist under **Model IDs (Filter)** so the selector stays manageable.
:::

:::warning No trailing slash
Use exactly `https://daoxe.com/v1` (no trailing slash). A trailing slash can break the `/models` path Open WebUI appends.
:::

## Direct Connections (optional)

If the admin has enabled [Direct Connections](/features/chat-conversations/direct-connections) (`ENABLE_DIRECT_CONNECTIONS=true`):

1. Go to **User Settings → Connections**.
2. Add a connection with the same **Base URL** (`https://daoxe.com/v1`) and your personal API key.
3. Save. Requests then go from the browser to DaoXE (CORS must allow your Open WebUI origin).

## Notes

- This path is OpenAI-compatible **Chat Completions** (`/v1/chat/completions`). DaoXE also exposes other protocols (for example OpenAI Responses and Anthropic Messages) outside this Open WebUI connection type.
- Use model IDs from **your** DaoXE account only; do not hard-code a static third-party price/model list.
- Prefer least-privilege keys for multi-user deployments.

## Learn more

- DaoXE: [https://daoxe.com](https://daoxe.com)
- Examples: [https://github.com/seven7763/DaoXE-AI](https://github.com/seven7763/DaoXE-AI)
- Open WebUI OpenAI-compatible guide: [OpenAI-Compatible Providers](/getting-started/quick-start/connect-a-provider/starting-with-openai-compatible)
