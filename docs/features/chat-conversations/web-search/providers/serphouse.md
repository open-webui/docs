---
sidebar_position: 26
title: "SERPHouse"
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

[SERPHouse](https://www.serphouse.com/) is a real-time SERP (search engine results page) API. Integrating it with Open WebUI lets your language model run live web searches and ground responses in current sources. This guide configures SERPHouse as a web search provider.

## Prerequisites

- **Open WebUI Installed**: A running instance of Open WebUI (local or Docker). See the [Getting Started guide](https://docs.openwebui.com/getting-started).
- **SERPHouse Account**: An account with an API key from [SERPHouse](https://www.serphouse.com/).
- **Admin Access**: Administrative access to your Open WebUI instance.

## Step-by-Step Configuration

### 1. Obtain a SERPHouse API Key

1. Log in or sign up at [SERPHouse](https://www.serphouse.com/).
2. Open the API section of your dashboard and copy or generate an API key. Keep it secure.

### 2. Configure Open WebUI

1. Log in to Open WebUI with an admin account.
2. Open **Admin Panel → Settings → Web Search**.
3. Enable **Web Search** by toggling it **On**.
4. Select **serphouse** from the **Web Search Engine** dropdown.
5. Paste your SERPHouse API key into the **SERPHouse API Key** field.
6. (Optional) Set the **SERPHouse Domain** (the Google domain to query, e.g. `google.com`, `google.co.uk`).
7. Save your settings.

### 3. Test the Integration

1. Start a chat session in Open WebUI.
2. Click the **plus (+)** button in the prompt field to enable web search.
3. Enter a query (e.g., `+latest AI news`) and confirm SERPHouse returns real-time results.

## Configuration Reference

| Setting | Environment variable | Default | Notes |
|---|---|---|---|
| API key | [`SERPHOUSE_API_KEY`](/reference/env-configuration#serphouse_api_key) | (empty) | Required. |
| Google domain | [`SERPHOUSE_DOMAIN`](/reference/env-configuration#serphouse_domain) | `google.com` | The Google domain SERPHouse queries against. |

The same fields are exposed in the Admin UI when the `serphouse` engine is selected, so you do not need environment variables unless you prefer to manage configuration that way.

## Troubleshooting

- **Invalid API Key**: Ensure the key is copied correctly, without extra spaces.
- **No Results**: Confirm the web search toggle (`+`) is enabled and your internet is active.
- **Wrong region**: Adjust `SERPHOUSE_DOMAIN` to the Google domain for your target locale.

## Additional Resources

- [SERPHouse Documentation](https://www.serphouse.com/docs): API reference and advanced options.
- [Open WebUI Features](https://docs.openwebui.com/features): Details on RAG and web search.
