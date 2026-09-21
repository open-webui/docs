---
sidebar_position: 28
title: "Staan"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

:::tip

For a comprehensive list of all environment variables related to Web Search (including concurrency settings, result counts, and more), please refer to the [Environment Configuration documentation](/reference/env-configuration#web-search).

:::

# Staan Web Search Integration

[Staan](https://staan.ai/) is a web search API whose data stays in the EU, which is the reason to pick it over the other hosted search APIs when your deployment has to keep processing inside that boundary.

## Configuration Steps

1. Sign up at [staan.ai](https://staan.ai/) and create an API key.
2. In Open WebUI, open **Settings > Admin > Web Search**.
3. Turn **Web Search** on and select **Staan** as the **Web Search Engine**.
4. Paste the key into **Staan API Key**.
5. Press **Save**.

The same settings are available as environment variables:

```bash
ENABLE_WEB_SEARCH=true
WEB_SEARCH_ENGINE=staan
STAAN_API_KEY=your-staan-api-key
```

## Market

**Staan Market** (`STAAN_MARKET`, default `en-us`) picks the region and language the results come from, written as a language and country pair. Set it to the audience you serve, `de-de` for German results from Germany for example.

## Page content in the results

**Staan Max Snippets** (`STAAN_MAX_SNIPPETS`) decides how much of each page Open WebUI gets back.

At `0`, the default, Staan answers with the plain search result: a title, a URL and the snippet it already has. Above `0`, Staan fetches each result page, scores its passages against the query and returns up to that many chunks. Open WebUI joins them onto that result's snippet, so the model reads the relevant parts of the page rather than a one-line summary of it.

Raise it when answers need detail from inside pages, and keep in mind that asking for page content is more work per search, so a higher value costs more time and, on a metered plan, more money.

## Domain filtering

The **Domain Filter List** applies to Staan as it does to Tavily and Exa: results whose domain is filtered out are dropped after they come back.
