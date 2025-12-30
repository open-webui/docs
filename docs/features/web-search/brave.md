---
sidebar_position: 2
title: "Brave"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

:::tip

For a comprehensive list of all environment variables related to Web Search (including concurrency settings, result counts, and more), please refer to the [Environment Configuration documentation](../../getting-started/env-configuration#web-search).

:::

## Brave API

### Docker Compose Setup

Add the following environment variables to your Open WebUI `docker-compose.yaml` file:

```yaml
services:
  open-webui:
    environment:
      ENABLE_RAG_WEB_SEARCH: True
      RAG_WEB_SEARCH_ENGINE: "brave"
      BRAVE_SEARCH_API_KEY: "YOUR_API_KEY"
      RAG_WEB_SEARCH_RESULT_COUNT: 3
      RAG_WEB_SEARCH_CONCURRENT_REQUESTS: 1
```

### Rate Limiting (Free Tier)

Brave's free tier API enforces a strict limit of **1 request per second**. If your LLM generates multiple search queries (which is common), you may encounter HTTP 429 "Too Many Requests" errors.

**Recommended configuration for free tier users:**

- Set `RAG_WEB_SEARCH_CONCURRENT_REQUESTS: 1` to ensure requests are processed sequentially rather than in parallel.

**Automatic retry behavior:**

Open WebUI automatically handles 429 rate limit responses from the Brave API. When a rate limit error is received, the system will:

1. Wait 1 second (respecting Brave's rate limit)
2. Retry the request once
3. Only fail if the retry also returns an error

This means that even if your connection is fast enough to send multiple sequential requests within a second, the automatic retry mechanism should recover gracefully without user intervention.

:::tip
If you are on Brave's paid tier with higher rate limits, you can increase `RAG_WEB_SEARCH_CONCURRENT_REQUESTS` for faster parallel searches.
:::
