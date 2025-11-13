---
sidebar_position: 4
title: "Image Router"
---

:::warning
This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.
:::

Open WebUI also supports image generation through the **Image Router APIs**. Image Router is an [open source](https://github.com/DaWe35/image-router) image generation proxy that unifies most popular models into a single API.

### Initial Setup

1. Obtain an [API key](https://imagerouter.io/api-keys) from Image Router.

### Configuring Open WebUI

1. In Open WebUI, navigate to the **Admin Panel** > **Settings** > **Images** menu.
2. Set the `Image Generation Engine` field to `Open AI` (Image Router uses the same syntax as OpenAI).
3. Change the API endpoint URL to `https://api.imagerouter.io/v1/openai`
4. Enter your Image Router API key.
5. Enter the model you wish to use. Do not use the dropdown to select models, enter the model name instead. For more information, [see all models](https://imagerouter.io/models).

![Screenshot of the Open WebUI Images settings page with Open AI selected and the API endpoint URL, API key, and model fields highlighted for Image Router configuration.](/images/image-generation-and-editing/image-router-settings.png)
