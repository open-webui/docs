---
sidebar_position: 3
title: "Brave"
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

## Brave API

Open WebUI ships with two Brave-backed search engines that share the same API key (`BRAVE_SEARCH_API_KEY`) and the same rate limits, but hit different endpoints:

| Engine | Endpoint | Behavior |
| :--- | :--- | :--- |
| `brave` | `/res/v1/web/search` | Classic web search. Returns short snippets; Open WebUI then scrapes each result URL to build the LLM context. |
| `brave_llm_context` | `/res/v1/llm/context` | LLM-optimized search. Returns full pre-extracted, relevance-scored page passages directly as each result's snippet. The page fetch that follows a search is governed by **Bypass Web Loader** for every engine, so turn that on to skip the scrape and use the passages as they are. Pull size is bounded by [`BRAVE_SEARCH_CONTEXT_TOKENS`](/reference/env-configuration#brave_search_context_tokens) (default `8192`, range `1024` to `32768`). |

Pick `brave_llm_context` when you want fewer round-trips and higher-fidelity passages without the scraping step; pick `brave` when you need the classic snippet-then-scrape flow (e.g. when scraping is doing useful normalization in your pipeline). Both engines automatically retry once after HTTP 429 with a 1-second backoff.

### Docker Compose Setup

Add the following environment variables to your Open WebUI `docker-compose.yaml` file:

```yaml
services:
  open-webui:
    environment:
      ENABLE_WEB_SEARCH: True
      WEB_SEARCH_ENGINE: "brave"             # or "brave_llm_context"
      BRAVE_SEARCH_API_KEY: "YOUR_API_KEY"
      # BRAVE_SEARCH_CONTEXT_TOKENS: 8192    # only for brave_llm_context
      WEB_SEARCH_RESULT_COUNT: 3
      WEB_SEARCH_CONCURRENT_REQUESTS: 1
```

### Rate Limiting (Free Tier)

Brave's free tier API enforces a strict limit of **1 request per second**. If your LLM generates multiple search queries (which is common), you may encounter HTTP 429 "Too Many Requests" errors.

**Recommended configuration for free tier users:**

- Set "Concurrent Requests" in Settings > Web Search (admin section) to `1`. Alternatively use environment variables:
- Set `WEB_SEARCH_CONCURRENT_REQUESTS: 1` to ensure requests are processed sequentially rather than in parallel.

**Automatic retry behavior:**

Open WebUI retries a rate-limited Brave request once after one second.

:::tip
If you are on Brave's paid tier with higher rate limits, you can increase `WEB_SEARCH_CONCURRENT_REQUESTS` for faster parallel searches.
:::

