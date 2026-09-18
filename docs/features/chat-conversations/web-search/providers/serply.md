---
sidebar_position: 15
title: "Serply"
description: "Connect Serply web search to Open WebUI, configure its API key, and check that a conversation can retrieve search results."
---

Use Serply to retrieve web search results for Open WebUI conversations. Open WebUI sends search queries to Serply’s hosted API using your account’s API key.

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the [contributing tutorial](/contributing).

:::

## Requirements

- A running Open WebUI instance and an administrator account.
- Outbound access from the Open WebUI server to the search provider and, for full-page retrieval, the sites returned by the search.
- A chat model with reliable native tool calling and the Web Search capability enabled.

Create a Serply account and copy the API key from **Dashboard → Settings → API Key**, following the [official quickstart](https://serply.io/docs/guides/quickstart). Your account must have an available search allowance.

## Configure in Open WebUI

1. Open **Settings → Admin → Web Search** and enable web search.
2. Set **Web Search Engine** to `serply`.
3. Paste your key into **Serply API Key** and save the settings.
4. Enable the model’s **Web Search** capability and its **Web Search** default feature, or turn on Web Search for the conversation. Follow the [native search setup](/features/chat-conversations/web-search/agentic-search#how-to-enable-agentic-behavior) for the model settings.

## Environment example

For a deployment configured through environment variables:

```bash
ENABLE_WEB_SEARCH=true
WEB_SEARCH_ENGINE=serply
SERPLY_API_KEY=your-api-key
```

Restart Open WebUI after changing the environment. Previously saved admin settings can take precedence over these startup values; if the selected engine or key has not changed, update it in the Admin Panel. See the [web search configuration reference](/reference/env-configuration#web-search) for persistence behavior and additional options.

## Verify

Start a new conversation with the configured model and turn on **Web Search** in the chat’s integrations menu if it is not already enabled. Ask: “Search the web for the official Python documentation and give me a link to it.”

Confirm that the conversation shows a web search tool call and returned sources, then open a source to check it. A plausible answer without a search tool call does not demonstrate that the provider is connected.

## Troubleshooting

- **Authentication or quota error:** check that the saved API key is correct and the provider account has an available search allowance.
- **Authentication fails:** copy the key from the Serply dashboard again. Enter the key itself in Open WebUI; do not add the `X-Api-Key:` header name shown in Serply’s direct API examples.
- **No search tool call:** check the model’s Web Search capability, the chat toggle or default feature, and Native function calling using the [native search setup](/features/chat-conversations/web-search/agentic-search#how-to-enable-agentic-behavior).
- **Search succeeds but page content is empty:** check outbound connectivity, proxy settings, and web loader errors using [Web Search troubleshooting](/troubleshooting/web-search). Search results and full-page fetching are separate steps.
