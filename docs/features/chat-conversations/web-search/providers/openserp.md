---
sidebar_position: 27
title: "OpenSERP"
---

:::tip

For a comprehensive list of all environment variables related to Web Search (including concurrency settings, result counts, and more), please refer to the [Environment Configuration documentation](/reference/env-configuration#web-search).

:::

:::tip Troubleshooting

Having issues with web search? Check out the [Web Search Troubleshooting Guide](/troubleshooting/web-search) for solutions to common problems like proxy configuration, connection timeouts, and empty content.

:::

[OpenSERP](https://github.com/karust/openserp) is a self-hosted scraper that returns results from several major search engines. Like [SearXNG](./searxng.md) and [YaCy](./yacy.md), it runs on your own infrastructure and needs **no API key**, so the only setting Open WebUI requires is a reachable base URL.

Open WebUI calls its `/mega/search` endpoint, which queries Google, Bing, Yandex, Baidu, DuckDuckGo and Ecosia together and returns the combined results.

## 1. Run OpenSERP

```bash
docker run -d --name openserp -p 7000:7000 karust/openserp serve -a 0.0.0.0 -p 7000
```

Check that it answers:

```bash
curl "http://localhost:7000/mega/search?text=open+webui&limit=3"
```

If Open WebUI itself runs in Docker, `localhost` points at the Open WebUI container rather than your host. Use `http://host.docker.internal:7000` instead, or put both containers on the same Docker network and use the service name.

## 2. Point Open WebUI at it

1. Go to **Settings > Admin > Web Search**.
2. Enable **Web Search**.
3. Set **Web Search Engine** to `openserp`.
4. Set **OpenSERP URL** to your instance, for example `http://localhost:7000`. The field only appears once `openserp` is selected.
5. Save.

The base URL can also be set with [`OPENSERP_BASE_URL`](/reference/env-configuration#openserp_base_url), which defaults to `http://localhost:7000`. A trailing slash is fine, it is stripped before the request.

## 3. Use it

Open a new chat, turn on **Web Search** from the **+** menu in the message input, and send a query.

:::warning Scraping engines can be rate limited

OpenSERP works by scraping search engine result pages rather than using official APIs. Those engines may throttle, present a CAPTCHA, or block the requesting address under load, which surfaces in Open WebUI as a failed search. This is a property of how it obtains results, not a fault in the configuration, and it is the trade-off for needing no API key.

:::
