---
sidebar_position: 1
title: "Bing"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

:::warning

Bing Search APIs will be retired on 11th August 2025. New deployments are not supported.

:::

## Bing API

### Setup

1. Navigate to the [AzurePortal](https://portal.azure.com/#create/Microsoft.BingSearch) and create a new resource. After creation, you’ll be redirected to the resource overview page. From there, select "manage keys." ![manage keys](https://github.com/user-attachments/assets/dd2a3c67-d6a7-4198-ba54-67a3c8acff6d)
2. On the key management page, locate Key1 or Key2 and copy your desired key.
3. Open the Open WebUI Admin Panel, switch to the Settings tab, and then select Web Search.
4. Enable the Web search option and set the Web Search Engine to bing.
5. Fill `SearchApi API Key` with the `API key` that you copied in step 2 from [AzurePortal](https://portal.azure.com/#create/Microsoft.BingSearch) dashboard.
6. Click `Save`.
