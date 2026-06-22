---
sidebar_position: 24
title: "SERPHouse"
---

::::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.
::::

:::tip
For a comprehensive list of all environment variables related to Web Search (including concurrency settings, result counts, and more), please refer to the [Environment Configuration documentation](/reference/env-configuration#web-search).
:::

:::tip Troubleshooting
Having issues with web search? Check out the [Web Search Troubleshooting Guide](/troubleshooting/web-search) for solutions to common problems like proxy configuration, connection timeouts, and empty content.
:::

## SERPHouse API

[SERPHouse](https://docs.serphouse.com/) provides a SERP API that can return structured web search results from major search engines.

### Setup

1. Go to the [SERPHouse API documentation](https://docs.serphouse.com/), sign up, and create/get your API token.
2. Copy your `api_token`.
3. With your `api_token`, open `Open WebUI Admin panel` and click `Settings` tab, and then click `Web Search`.
4. Enable `Web search` and set `Web Search Engine` to `serphouse` (if available in your dropdown).
5. Fill `SERPHouse API Key` with the `api_token` you copied in step 2.
6. [Optional] Enter the `SERPHouse engine`/domain you want to query. SERPHouse supports domains like `google`, `bing`, and `yahoo`.
7. Click `Save`.

#### Note

You have to enable `Web search` in the prompt field to search the web using SERPHouse.