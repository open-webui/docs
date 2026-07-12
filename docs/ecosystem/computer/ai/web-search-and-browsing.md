---
title: Web search and browsing
sidebar_position: 8
---

# Web search and browsing

Web search works out of the box: with no configuration at all, the AI searches via DuckDuckGo. Browsing (a real browser the AI can navigate and click) is off by default and enabled per instance.

## Web search

Configure in **Settings → Admin → Web**: a master toggle, plus a provider set to **auto** or a specific one.

| Provider | Needs |
| --- | --- |
| DuckDuckGo | Nothing; always available |
| Exa, Perplexity, Tavily, Brave, Firecrawl | API key |
| SearXNG | Base URL of your instance, no key |
| Chat Completions endpoint | Key + URL + model (any search-capable chat API) |

In **auto** mode, Computer uses the first configured provider in this priority order: Exa → Perplexity → Tavily → Brave → Firecrawl → SearXNG → DuckDuckGo. Keys go in the UI or environment variables (`EXA_API_KEY` and friends; see [environment variables](/ecosystem/computer/reference/environment-variables)).

## Browsing

Off by default; master toggle in the same **Settings → Admin → Web** page. Three providers:

- **local**: drives a browser already installed on the machine (Chrome, Chromium, Brave, or Edge) headless over the Chrome DevTools Protocol. The browser is auto-discovered and auto-launched; the CDP URL defaults to `http://localhost:9222`. This is not Playwright: no browser download, no heavy dependency, just the `websockets` package.
- **firecrawl**: Firecrawl's cloud API (key required).
- **browser_use**: Browser-Use's cloud API (key required).

With browsing enabled the AI can navigate pages, click elements, fill forms, and take screenshots. Browser sessions idle out after **10 minutes** by default.

Browser tabs in the UI have a **tab source** setting: a managed browser, or your personal Chrome profile with its logins and extensions.

:::warning
A browser signed in to your accounts can act as you: post, buy, delete. Keep the AI on the managed browser unless a task genuinely needs your logged-in profile, and watch those tasks closely.
:::
