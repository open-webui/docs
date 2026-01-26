---
sidebar_position: 14
title: "Yandex"
---

:::tip

For a comprehensive list of all environment variables related to Web Search (including concurrency settings, result counts, and more), please refer to the [Environment Configuration documentation](../../getting-started/env-configuration#web-search).

:::

:::tip Troubleshooting

Having issues with web search? Check out the [Web Search Troubleshooting Guide](../../troubleshooting/web-search) for solutions to common problems like proxy configuration, connection timeouts, and empty content.

:::

## Yandex Search API 

Support for Yandex Web Search is integrated via the [Yandex Cloud Search API](https://yandex.cloud/en/docs/search-api/api-ref/WebSearch/search).

### Docker Compose Setup

Add the following environment variables to your Open WebUI `docker-compose.yaml` file:

```yaml
services:
  open-webui:
    environment:
      ENABLE_RAG_WEB_SEARCH: True
      RAG_WEB_SEARCH_ENGINE: "yandex"
      YANDEX_WEB_SEARCH_API_KEY: "YOUR_YANDEX_CLOUD_API_KEY"
      # Optional: Override default search URL
      # YANDEX_WEB_SEARCH_URL: "https://searchapi.api.cloud.yandex.net/v2/web/search"
      # Optional: Custom JSON configuration for Yandex Search API
      # YANDEX_WEB_SEARCH_CONFIG: '{"query": {"searchType": "SEARCH_TYPE_RU"}}'
```

### Configuration Options

*   **YANDEX_WEB_SEARCH_URL**: The endpoint for the Yandex Search API. Defaults to `https://searchapi.api.cloud.yandex.net/v2/web/search`.
*   **YANDEX_WEB_SEARCH_API_KEY**: Your Yandex Cloud API Key.
*   **YANDEX_WEB_SEARCH_CONFIG**: An optional JSON string to customize the search request (e.g., setting `searchType`, `region`, or other parameters supported by the Yandex Search API).
