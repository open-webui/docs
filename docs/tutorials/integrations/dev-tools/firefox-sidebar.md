---
sidebar_position: 40
title: "Firefox Sidebar"
---

## Firefox AI Chatbot Sidebar

# Integrating Open WebUI as a Local AI Chatbot Browser Assistant in Mozilla Firefox

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

## Prerequisites

Before integrating Open WebUI as a AI chatbot browser assistant in Mozilla Firefox, ensure you have:

- Open WebUI instance URL (local or domain)
- Firefox browser installed

## Enabling AI Chatbot in Firefox

1. Click on the hamburger button (three horizontal lines button at the top right corner, just below the `X` button)
2. Open up Firefox settings
3. Click on the `Firefox Labs` section
4. Toggle on `AI Chatbot`

Alternatively, you can enable AI Chatbot through the `about:config` page (described in the next section).

## Configuring about:config Settings

1. Type `about:config` in the Firefox address bar
2. Click `Accept the Risk and Continue`
3. Search for `browser.ml.chat.enabled` and toggle it to `true` if it's not already enabled through Firefox Labs
4. Search for `browser.ml.chat.hideLocalhost` and toggle it to `false`

### browser.ml.chat.prompts.{#}

To add custom prompts, follow these steps:

1. Search for `browser.ml.chat.prompts.{#}` (replace `{#}` with a number, e.g., `0`, `1`, `2`, etc.)
2. Click the `+` button to add a new prompt
3. Enter the prompt label, value, and ID (e.g., `{"id":"My Prompt", "value": "This is my custom prompt.", "label": "My Prompt"}`)
4. Repeat the process to add more prompts as desired

### browser.ml.chat.provider

1. Search for `browser.ml.chat.provider`
2. Enter your Open WebUI instance URL, including any optional parameters (e.g., `https://my-open-webui-instance.com/?model=browser-productivity-assistant&temporary-chat=true&tools=jina_web_scrape`)

## URL Parameters for Open WebUI

Open WebUI accepts URL parameters such as `model`, `tools`, `web-search` and `temporary-chat` to customize the chat session, for example `/?model=model1&temporary-chat=true`. See [URL Parameters](/features/chat-conversations/chat-features/url-params) for the full list.

## Accessing the AI Chatbot Sidebar

To access the AI chatbot sidebar, use one of the following methods:

- Press `CTRL+B` to open the bookmarks sidebar and switch to AI Chatbot
- Press `CTRL+Alt+X` to open the AI chatbot sidebar directly
