---
sidebar_position: 27
title: "Microsoft Web IQ"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the [contributing tutorial](https://docs.openwebui.com/contributing).

:::

:::tip

For a comprehensive list of all environment variables related to Web Search, please refer to the [Environment Configuration documentation](/reference/env-configuration#web-search).

:::

:::tip Troubleshooting

Having issues with web search? Check out the [Web Search Troubleshooting Guide](/troubleshooting/web-search) for solutions to common problems like proxy configuration, connection timeouts, and empty content.

:::

## Overview

**Microsoft Web IQ** is a web search API from Microsoft. Integrating it with Open WebUI lets your language model run live web searches and ground responses in current sources. This guide configures Microsoft Web IQ as a web search provider.

## Prerequisites

- **Open WebUI Installed**: A running instance of Open WebUI (local or Docker). See the [Getting Started guide](https://docs.openwebui.com/getting-started).
- **Microsoft Web IQ API Key**: Access to the Microsoft Web IQ API and a key.
- **Admin Access**: Administrative access to your Open WebUI instance.

## Step-by-Step Configuration

### 1. Obtain a Microsoft Web IQ API Key

Obtain an API key for the Microsoft Web IQ API from your Microsoft API provider portal. Keep it secure.

### 2. Configure Open WebUI

1. Log in to Open WebUI with an admin account.
2. Open **Admin Panel → Settings → Web Search**.
3. Enable **Web Search** by toggling it **On**.
4. Select **microsoft_web_iq** from the **Web Search Engine** dropdown.
5. Paste your API key into the **Microsoft Web IQ API Key** field.
6. (Optional) Adjust the **API Base URL** and **Language**.
7. Save your settings.

### 3. Test the Integration

1. Start a chat session in Open WebUI.
2. Click the **plus (+)** button in the prompt field to enable web search.
3. Enter a query (e.g., `+latest AI news`) and confirm Microsoft Web IQ returns real-time results.

## Configuration Reference

| Setting | Environment variable | Default | Notes |
|---|---|---|---|
| API key | [`MICROSOFT_WEB_IQ_API_KEY`](/reference/env-configuration#microsoft_web_iq_api_key) | (empty) | Required. |
| API base URL | [`MICROSOFT_WEB_IQ_API_BASE_URL`](/reference/env-configuration#microsoft_web_iq_api_base_url) | `https://api.microsoft.ai/v3` | Override only if pointed at a different endpoint. |
| Language | [`MICROSOFT_WEB_IQ_LANGUAGE`](/reference/env-configuration#microsoft_web_iq_language) | `en` | Result language code (e.g. `en`, `de`). |

The same fields are exposed in the Admin UI when the `microsoft_web_iq` engine is selected, so you do not need environment variables unless you prefer to manage configuration that way.

## Troubleshooting

- **Invalid API Key**: Ensure the key is copied correctly, without extra spaces.
- **No Results**: Confirm the web search toggle (`+`) is enabled and your internet is active.
- **Wrong language**: Adjust `MICROSOFT_WEB_IQ_LANGUAGE` to your target locale.

## Additional Resources

- [Open WebUI Features](https://docs.openwebui.com/features): Details on RAG and web search.
