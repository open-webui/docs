---
sidebar_position: 15
title: "SerpApi"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

## SerpApi API

[SerpApi](https://serpapi.com/) Scrape Google and other search engines from our fast, easy, and complete API. Any existing or upcoming SERP engine that returns `organic_results` is supported. The default web search engine is `google`, but it can be changed to `bing`, `baidu`, `google_news`, `google_scholar`, `google_patents`, and others.

### Setup

1. Go to [SerpApi](https://serpapi.com/), and log on or create a new account.
2. Go to `Dashboard` and copy the API key.
3. With `API key`, open `Open WebUI Admin panel` and click `Settings` tab, and then click `Web Search`.
4. Enable `Web search` and set `Web Search Engine` to `serpapi`.
5. Fill `SerpApi API Key` with the `API key` that you copied in step 2 from [SerpApi](https://serpapi.com/) dashboard.
6. [Optional] Enter the `SerpApi engine` name you want to query. Example, `google`, `bing`, `baidu`, `google_news`, `google_videos`, `google_scholar` and `google_patents.` By default, it is set to `google`. Find more options at [SerpApi documentation](https://serpapi.com/dashboard).
7. Click `Save`.

![Open WebUI Admin panel](/images/tutorial_serpapi_search.png)

#### Note

You have to enable `Web search` in the prompt field to search the web using [SerpApi](https://serpapi.com/) engines.

![enable Web search](/images/enable_web_search.png)
