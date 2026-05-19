---
sidebar_position: 23
title: "Linkup"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the [contributing tutorial](https://docs.openwebui.com/contributing).

:::

:::tip

For a comprehensive list of all environment variables related to Web Search (including concurrency settings, result counts, and more), please refer to the [Environment Configuration documentation](/reference/env-configuration#web-search).

:::

:::tip Troubleshooting

Having issues with web search? Check out the [Web Search Troubleshooting Guide](/troubleshooting/web-search) for solutions to common problems like proxy configuration, connection timeouts, and empty content.

:::

## Overview

[Linkup](https://www.linkup.so/) is a search API built for AI applications. Integrating it with Open WebUI lets your language model perform real-time web searches and ground responses in current sources. This tutorial guides you through configuring Linkup as a web search provider.

Linkup support was added in Open WebUI v0.9.6.

## Prerequisites

Ensure you have:

- **Open WebUI Installed**: A running instance of Open WebUI (local or Docker). See the [Getting Started guide](https://docs.openwebui.com/getting-started).
- **Linkup Account**: An account with an API key from [Linkup](https://www.linkup.so/).
- **Admin Access**: Administrative access to your Open WebUI instance.
- **Internet Connection**: Required for Linkup API requests.

## Step-by-Step Configuration

### 1. Obtain a Linkup API Key

1. Log in or sign up at [Linkup](https://www.linkup.so/).
2. Open the API keys section of your dashboard.
3. Copy or generate a new API key. Keep it secure.

### 2. Configure Open WebUI

1. Log in to Open WebUI with an admin account.
2. Open **Admin Panel → Settings → Web Search**.
3. Enable **Web Search** by toggling it **On**.
4. Select **linkup** from the **Web Search Engine** dropdown.
5. Paste your Linkup API key into the **Linkup API Key** field.
6. (Optional) Set the **Search Depth** and **Output Type** (see below).
7. Save your settings.

### 3. Test the Integration

1. Start a chat session in Open WebUI.
2. Click the **plus (+)** button in the prompt field to enable web search.
3. Enter a query (e.g., `+latest AI news`) and confirm Linkup returns real-time results.

## Search Parameters

Linkup requests are built from a small set of defaults that you can override. The query (`q`) and result count (`maxResults`) are injected automatically and cannot be overridden.

| Parameter | Default | Notes |
|-----------|---------|-------|
| `depth` | `standard` | `standard` is faster and cheaper; `deep` runs a more thorough multi-step search. |
| `outputType` | `sourcedAnswer` | `sourcedAnswer` returns an answer plus its source pages; `searchResults` returns raw result entries. |
| `url` | `https://api.linkup.so/v1/search` | Override only if you need to point at a different endpoint. |

These map to the [`LINKUP_SEARCH_PARAMS`](/reference/env-configuration#linkup_search_params) environment variable, supplied as a JSON object. For example:

```bash
-e LINKUP_API_KEY="your_linkup_api_key"
-e LINKUP_SEARCH_PARAMS='{"depth": "deep", "outputType": "searchResults"}'
```

The same fields are exposed in the Admin UI when the `linkup` engine is selected, so you do not need environment variables unless you prefer to manage configuration that way. See [Environment Variable Configuration](https://docs.openwebui.com/environment) for details and the [`ENABLE_PERSISTENT_CONFIG`](/reference/env-configuration#enable_persistent_config) behavior.

## Troubleshooting

- **Invalid API Key**: Ensure the key is copied correctly, without extra spaces.
- **No Results**: Confirm the web search toggle (`+`) is enabled and your internet is active. Try `depth: deep` for sparse topics.
- **Quota Exceeded**: Check your plan and usage on the Linkup dashboard.
- **Settings Not Saved**: Verify admin privileges and that `webui.db` is writable.

## Additional Resources

- [Linkup Documentation](https://docs.linkup.so/): API reference and advanced options.
- [Open WebUI Features](https://docs.openwebui.com/features): Details on RAG and web search.
- [Contributing to Open WebUI](https://docs.openwebui.com/contributing): Share improvements or report issues.
