---
sidebar_position: 6
title: "Google PSE"
---

:::warning

**New Google PSE projects are no longer supported.** Google has restricted the legacy JSON API to existing customers only. New users attempting to use Google PSE will receive a `403 Forbidden` error.

Existing projects have an end date too. Google's [Custom Search JSON API overview](https://developers.google.com/custom-search/v1/overview) says: "Existing Custom Search JSON API customers have until January 1, 2027 to transition to an alternative solution." The `google_pse` engine in Open WebUI sends its searches to this API, so if you use it, choose another engine from the [Web Search](/features/chat-conversations/web-search) page before that date.

:::

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

:::tip

For a comprehensive list of all environment variables related to Web Search (including concurrency settings, result counts, and more), please refer to the [Environment Configuration documentation](/reference/env-configuration#web-search).

:::

:::tip Troubleshooting

Having issues with web search? Check out the [Web Search Troubleshooting Guide](/troubleshooting/web-search) for solutions to common problems like proxy configuration, connection timeouts, and empty content.

:::

## Google PSE API

### Setup

1. Go to Google Developers, use [Programmable Search Engine](https://developers.google.com/custom-search), and log on or create account.
2. Go to [control panel](https://programmablesearchengine.google.com/controlpanel/all) and click `Add` button
3. Enter a search engine name, set the other properties to suit your needs, verify you're not a robot and click `Create` button.
4. Generate `API key` and get the `Search engine ID`. (Available after the engine is created)
5. With `API key` and `Search engine ID`, open `Open WebUI Admin panel` and click `Settings` tab, and then click `Web Search`
6. Enable `Web search` and Set `Web Search Engine` to `google_pse`
7. Fill `Google PSE API Key` with the `API key` and `Google PSE Engine Id` (# 4)
8. Click `Save`

![Open WebUI Admin panel](/images/tutorial_google_pse1.png)

#### Note

To search the web in a chat, open the **+** menu in the message input and turn on **Web Search**.

![enable Web search](/images/tutorial_google_pse2.png)
