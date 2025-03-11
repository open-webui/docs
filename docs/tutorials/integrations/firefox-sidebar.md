---
sidebar_position: 4100
title: "🦊 Firefox AI Chatbot Sidebar"
---

:::warning
This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.
:::

## 🦊 Firefox AI Chatbot Sidebar

# Integrating Open WebUI as a Local AI Chatbot Browser Assistant in Mozilla Firefox

## Prerequisites

Before integrating Open WebUI as a AI chatbot browser assistant in Mozilla Firefox, ensure you have:

* Open WebUI instance URL (local or domain)
* Firefox browser installed

## Enabling AI Chatbot in Firefox

1. Click on the hamburger button (three horizontal lines button at the top right corner, just below the `X` button)
2. Open up Firefox settings
2. Click on the `Firefox Labs` section
3. Toggle on `AI Chatbot`

Alternatively, you can enable AI Chatbot through the `about:config` page (described in the next section).

## Configuring about:config Settings

1. Type `about:config` in the Firefox address bar
2. Click `Accept the Risk and Continue`
3. Search for `browser.ml.chat.enabled` and toggle it to `true` if it's not already enabled through Firefox Labs
4. Search for `browser.ml.chat.hideLocalhost` and toggle it to `false`

### browser.ml.chat.prompts.#

To add custom prompts, follow these steps:

1. Search for `browser.ml.chat.prompts.#` (replace `#` with a number, e.g., `0`, `1`, `2`, etc.)
2. Click the `+` button to add a new prompt
3. Enter the prompt label, value, and ID (e.g., `{"id":"My Prompt", "value": "This is my custom prompt.", "label": "My Prompt"}`)
4. Repeat the process to add more prompts as desired

### browser.ml.chat.provider

1. Search for `browser.ml.chat.provider`
2. Enter your Open WebUI instance URL, including any optional parameters (e.g., `https://my-open-webui-instance.com/?model=browser-productivity-assistant&temporary-chat=true&tools=jina_web_scrape`)

## URL Parameters for Open WebUI

The following URL parameters can be used to customize your Open WebUI instance:

### Models and Model Selection

* `models`: Specify multiple models (comma-separated list) for the chat session (e.g., `/?models=model1,model2`)
* `model`: Specify a single model for the chat session (e.g., `/?model=model1`)

### YouTube Transcription

* `youtube`: Provide a YouTube video ID to transcribe the video in the chat (e.g., `/?youtube=VIDEO_ID`)

### Web Search

* `web-search`: Enable web search functionality by setting this parameter to `true` (e.g., `/?web-search=true`)

### Tool Selection

* `tools` or `tool-ids`: Specify a comma-separated list of tool IDs to activate in the chat (e.g., `/?tools=tool1,tool2` or `/?tool-ids=tool1,tool2`)

### Call Overlay

* `call`: Enable a video or call overlay in the chat interface by setting this parameter to `true` (e.g., `/?call=true`)

### Initial Query Prompt

* `q`: Set an initial query or prompt for the chat (e.g., `/?q=Hello%20there`)

### Temporary Chat Sessions

* `temporary-chat`: Mark the chat as a temporary session by setting this parameter to `true` (e.g., `/?temporary-chat=true`)

See https://docs.openwebui.com/features/chat-features/url-params for more info on URL parameters and how to use them.

## Additional about:config Settings

The following `about:config` settings can be adjusted for further customization:

* `browser.ml.chat.shortcuts`: Enable custom shortcuts for the AI chatbot sidebar
* `browser.ml.chat.shortcuts.custom`: Enable custom shortcut keys for the AI chatbot sidebar
* `browser.ml.chat.shortcuts.longPress`: Set the long press delay for shortcut keys
* `browser.ml.chat.sidebar`: Enable the AI chatbot sidebar
* `browser.ml.checkForMemory`: Check for available memory before loading models
* `browser.ml.defaultModelMemoryUsage`: Set the default memory usage for models
* `browser.ml.enable`: Enable the machine learning features in Firefox
* `browser.ml.logLevel`: Set the log level for machine learning features
* `browser.ml.maximumMemoryPressure`: Set the maximum memory pressure threshold
* `browser.ml.minimumPhysicalMemory`: Set the minimum physical memory required
* `browser.ml.modelCacheMaxSize`: Set the maximum size of the model cache
* `browser.ml.modelCacheTimeout`: Set the timeout for model cache
* `browser.ml.modelHubRootUrl`: Set the root URL for the model hub
* `browser.ml.modelHubUrlTemplate`: Set the URL template for the model hub
* `browser.ml.queueWaitInterval`: Set the interval for queue wait
* `browser.ml.queueWaitTimeout`: Set the timeout for queue wait

## Accessing the AI Chatbot Sidebar

To access the AI chatbot sidebar, use one of the following methods:

* Press `CTRL+B` to open the bookmarks sidebar and switch to AI Chatbot
* Press `CTRL+Alt+X` to open the AI chatbot sidebar directly