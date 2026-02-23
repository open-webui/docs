---
sidebar_position: 22
title: "You.com"
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

## You.com YDC Index API

[You.com](https://you.com/) provides the YDC Index API, a web search API that returns structured search results including titles, URLs, descriptions, and snippets.

### Prerequisites

- A You.com API key from [You.com API](https://you.com/api)

### Docker Compose Setup

Add the following environment variables to your Open WebUI `docker-compose.yaml` file:

```yaml
services:
  open-webui:
    environment:
      ENABLE_RAG_WEB_SEARCH: True
      RAG_WEB_SEARCH_ENGINE: "youcom"
      YOUCOM_API_KEY: "YOUR_API_KEY"
      RAG_WEB_SEARCH_RESULT_COUNT: 3
      RAG_WEB_SEARCH_CONCURRENT_REQUESTS: 10
```

### Admin Panel Setup

1. Log in to Open WebUI with an admin account.
2. Navigate to **Admin Panel** → **Settings** → **Web Search**.
3. Enable **Web Search** by toggling it **On**.
4. Select **youcom** from the **Web Search Engine** dropdown.
5. Paste your You.com API key into the **You.com API Key** field.
6. (Optional) Adjust the result count and concurrency settings as needed.
