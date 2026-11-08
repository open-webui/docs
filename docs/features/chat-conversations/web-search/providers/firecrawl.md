---
sidebar_position: 6
title: "Firecrawl"
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

[Firecrawl](https://firecrawl.dev) is a search-and-scrape API built for AI applications. As an Open WebUI web search engine it runs your query and returns ranked results with a title and description. Page content is then fetched by whichever **Web Loader Engine** is configured, so set Firecrawl as the web loader as well if you want Firecrawl to scrape the pages. You can use the hosted service at `api.firecrawl.dev`, or point Open WebUI at a self-hosted Firecrawl instance since Firecrawl is open source, which keeps every query in-house.

## Prerequisites

- **Open WebUI Installed**: A running instance of Open WebUI (local or Docker).
- **Firecrawl API key**: From the hosted service at [firecrawl.dev](https://firecrawl.dev). A self-hosted deployment without authentication can leave it empty, in which case no `Authorization` header is sent.
- **Admin Access**: Administrative access to your Open WebUI instance.

## Configuration

1. Get an API key:
   - **Hosted**: sign up at [firecrawl.dev](https://firecrawl.dev) and copy the key from your dashboard.
   - **Self-hosted**: use the key from your own Firecrawl instance.
2. In Open WebUI, open **Settings > Admin > Web Search**.
3. Toggle **Enable Web Search** on.
4. Select **Firecrawl** from the **Web Search Engine** dropdown (engine value `firecrawl`).
5. Paste your key into the **Firecrawl API Key** field.
6. (Self-hosted only) Set the **Firecrawl API Base URL** to your instance's origin, for example `https://firecrawl.example.com`. Open WebUI appends `/v2/search` and `/v2/scrape` itself, so do not include a version path unless it is `/v2`. The default is `https://api.firecrawl.dev`.
7. Save.

Then start a chat, enable web search with the **+** button in the prompt field, and run a query to confirm Firecrawl returns results.

## Environment Variables

You can configure Firecrawl with environment variables instead of, or alongside, the Admin Panel:

| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `WEB_SEARCH_ENGINE` | (empty) | Set to `firecrawl` to select this engine. |
| `ENABLE_WEB_SEARCH` | `false` | Set to `true` to turn web search on. |
| `FIRECRAWL_API_KEY` | (empty) | Your Firecrawl API key. |
| `FIRECRAWL_API_BASE_URL` | `https://api.firecrawl.dev` | API endpoint. Point this at a self-hosted instance to keep queries in-house. |
| `FIRECRAWL_TIMEOUT` | (Firecrawl default) | Scrape timeout in seconds, used only when Firecrawl is the web loader. Open WebUI converts it to milliseconds and clamps it to 1 to 300 seconds. |

See the [Environment Configuration reference](/reference/env-configuration#web-search) for the full list of web-search variables.

## Troubleshooting

- **Invalid API Key**: Confirm the key is copied without extra spaces, and that it matches the endpoint (a hosted key for `api.firecrawl.dev`, an instance key for self-hosted).
- **No Results**: Make sure the web search toggle (`+`) is on and the instance can reach the Firecrawl endpoint.
- **Timeouts**: `FIRECRAWL_TIMEOUT` applies to the web loader only. The search call uses a fixed budget of 3 seconds per requested result, so lower **Search Result Count** if searches time out.
- **Self-hosted connection errors**: Verify `FIRECRAWL_API_BASE_URL` is reachable from the Open WebUI container or host.

## Additional Resources

- [Firecrawl documentation](https://docs.firecrawl.dev)
- [Open WebUI Web Search environment variables](/reference/env-configuration#web-search)
