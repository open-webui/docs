---
sidebar_position: 7
title: "Jina"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

:::tip

For a comprehensive list of all environment variables related to Web Search (including concurrency settings, result counts, and more), please refer to the [Environment Configuration documentation](/reference/env-configuration#web-search).

:::

:::tip Troubleshooting

Having issues with web search? Check out the [Web Search Troubleshooting Guide](/troubleshooting/web-search) for solutions to common problems like proxy configuration, connection timeouts, and empty content.

:::

# Jina Web Search Integration

This guide provides instructions on how to integrate [Jina AI](https://jina.ai/), a powerful AI-driven search foundation, with Open WebUI. The integration uses Jina's Search API at `s.jina.ai` to provide web search capabilities.

## Overview

Open WebUI sends each query to Jina's Search API and reads the results back as links, titles and snippets. Jina's separate DeepSearch product, an agent that searches and reasons iteratively, is not what this integration calls, so its parameters do not apply here.

## Pricing and API Key

Jina's Search API requires an API key for use with Open WebUI. Jina offers a free tier for new users, which includes **10 million tokens** to use with any of their models. You can obtain your free API key by creating an account on the Jina AI platform.

- **API Key:** A Jina API key is required. You can get a key by logging into the [Jina API Dashboard](https://jina.ai/api-dashboard).

## Configuration Steps

### 1. Obtain a Jina API Key

Follow these steps to get an API key:

1. **Visit the Jina API Dashboard:** Go to [jina.ai/api-dashboard](https://jina.ai/api-dashboard).
2. **Log In or Sign Up:** Create a new account or log in to your existing one.
3. **Get Your API Key:** Once logged in, your unique API key will be displayed on the dashboard. Copy this key.

### 2. Configure Open WebUI

To enable the Jina web search integration, follow these steps in the Open WebUI admin settings:

1. **Log in as an Administrator:** Access your Open WebUI instance and log in with an administrator account.
2. **Navigate to Web Search Settings:** Go to **Settings > Admin > Web Search**.
3. **Select Jina as the Search Engine:** In the "Web Search Engine" dropdown menu, select **Jina**.
4. **Enter Your API Key:** Paste your Jina API key into the **Jina API Key** input field.
5. **(Optional) Enter Jina API Base URL:** If you need to use a specific endpoint (e.g., for EU data processing), enter it in the **Jina API Base URL** field. Default is `https://s.jina.ai/`.
6. **Save Changes:** Scroll down and click the **Save** button to apply the changes.

### 3. Environment Variable Configuration

For Docker-based deployments, you can configure the Jina integration using an environment variable.

Set the following environment variable for your Open WebUI instance:

- `JINA_API_KEY`: Your Jina API key.
- `JINA_API_BASE_URL`: (Optional) Custom Jina API endpoint.

**Example Docker `run` command:**

```bash
docker run -d \\
  -p 3000:8080 \\
  -e JINA_API_KEY="your-jina-api-key-here" \\
  --name open-webui \\
  ghcr.io/open-webui/open-webui:main
```

## Limits

- Jina returns at most 10 results per search. A higher **Search Result Count** is capped at 10 for this engine.
- The **Domain Filter List** is not applied to Jina results.

## Verify the Integration

After configuring the settings, you can test the integration. Enable the web search feature in a chat and ask a question. Open WebUI will now use Jina's Search API to retrieve web results, and the configured web loader to read the pages.
