---
sidebar_position: 2
title: "Bing"
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

:::warning

Bing Search APIs will be retired on 11th August 2025. New deployments are not supported.

:::

## Bing API

### Setup

1. Navigate to the [AzurePortal](https://portal.azure.com/#create/Microsoft.BingSearch) and create a new resource. After creation, you’ll be redirected to the resource overview page. From there, select "manage keys." ![manage keys](https://github.com/user-attachments/assets/dd2a3c67-d6a7-4198-ba54-67a3c8acff6d)
2. On the key management page, locate Key1 or Key2 and copy your desired key.
3. Open **Settings > Admin > Web Search**.
4. Enable the Web search option and set the Web Search Engine to bing.
5. Fill **Bing Search V7 Subscription Key** (`BING_SEARCH_V7_SUBSCRIPTION_KEY`) with the key that you copied in step 2 from the [Azure Portal](https://portal.azure.com/#create/Microsoft.BingSearch) dashboard. **Bing Search V7 Endpoint** (`BING_SEARCH_V7_ENDPOINT`) defaults to `https://api.bing.microsoft.com/v7.0/search` and only needs changing for a custom endpoint. Open WebUI does not check that the key is set, so an empty key fails at Bing rather than in Open WebUI.
6. Click `Save`.
