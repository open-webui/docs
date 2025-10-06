---
sidebar_position: 8
title: "Mojeek"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

## Mojeek Search API

### Setup

1. Please visit [Mojeek Search API page](https://www.mojeek.com/services/search/web-search-api/) to obtain an `API key`
2. With `API key`, open `Open WebUI Admin panel` and click `Settings` tab, and then click `Web Search`
3. Enable `Web search` and Set `Web Search Engine` to `mojeek`
4. Fill `Mojeek Search API Key` with the `API key`
5. Click `Save`

### Docker Compose Setup

Add the following environment variables to your Open WebUI `docker-compose.yaml` file:

```yaml
services:
  open-webui:
    environment:
      ENABLE_RAG_WEB_SEARCH: True
      RAG_WEB_SEARCH_ENGINE: "mojeek"
      BRAVE_SEARCH_API_KEY: "YOUR_MOJEEK_API_KEY"
      RAG_WEB_SEARCH_RESULT_COUNT: 3
      RAG_WEB_SEARCH_CONCURRENT_REQUESTS: 10
```
