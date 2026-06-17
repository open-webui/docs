---
sidebar_position: 8
title: "Kagi"
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

## Kagi Search API

[Kagi](https://kagi.com) is a premium search engine that aggregates results from multiple sources, including its own indexes, and re-ranks them for accuracy and relevance. The Kagi Search API gives programmatic access to these results.

### Prerequisites

- A [Kagi account](https://kagi.com) (any plan)
- **Separate API billing:** API access is billed independently from your Kagi subscription. Set up billing and generate an API key at [kagi.com/api](https://kagi.com/api)
- Search API pricing: **$12 per 1,000 requests** (pay-as-you-go, invoiced every 30 days or when usage reaches $100)

### Setup

1. Go to [kagi.com/api](https://kagi.com/api) and set up API billing.
2. Go to [kagi.com/api/keys](https://kagi.com/api/keys) and create an API key. Copy the key.
3. Open the **Open WebUI Admin Panel** and click **Settings**, then **Web Search**.
4. Enable **Web search** and set **Web Search Engine** to `kagi`.
5. Paste your API key into the **Kagi Search API Key** field.
6. Click **Save**.

### Docker Compose Setup

Add the following environment variables to your Open WebUI `docker-compose.yaml` file:

```yaml
services:
  open-webui:
    environment:
      ENABLE_WEB_SEARCH: True
      WEB_SEARCH_ENGINE: "kagi"
      KAGI_SEARCH_API_KEY: "YOUR_API_KEY"
      WEB_SEARCH_RESULT_COUNT: 3
      WEB_SEARCH_CONCURRENT_REQUESTS: 1
```

### Account Settings Inheritance

The Kagi Search API inherits settings from your Kagi account, including:

- **Blocked or promoted websites:** your [personalization rules](https://help.kagi.com/kagi/getting-started/index.html) apply to API results
- **Snippet length:** configured in [Settings → Search](https://help.kagi.com/kagi/settings/search.html)

This means you can customize your API search results the same way you customize the Kagi web interface.

### Kagi MCP Server (Alternative)

If you prefer not to use the built-in web search integration, Kagi also provides a hosted [MCP (Model Context Protocol) server](https://kagi.com/api/docs/openapi/section/mcp) that can be connected to Open WebUI as an MCP tool. This gives your models direct access to Kagi search and extract capabilities outside of the web search pipeline.

**MCP endpoint:** `https://mcp.kagi.com/mcp`

**Authentication:** Bearer token using your Kagi API key.

### Additional Resources

- [Kagi API Documentation](https://kagi.com/api/docs)
- [Kagi API Pricing](https://kagi.com/api/pricing)
- [Kagi Search API Help](https://help.kagi.com/kagi/api/search.html)
- [Kagi MCP Server](https://kagi.com/api/docs/openapi/section/mcp)
