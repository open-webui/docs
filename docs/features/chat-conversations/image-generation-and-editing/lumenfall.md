---
sidebar_position: 7
title: "Lumenfall"
---

:::warning
This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.
:::

Open WebUI also supports image generation through [Lumenfall](https://lumenfall.ai), an AI media gateway that unifies all popular image models on many different providers into an OpenAI-compatible API. Free models are available.

### Initial Setup

1. Create a free account at [lumenfall.ai](https://lumenfall.ai).
2. Generate an API key from your [dashboard](https://lumenfall.ai/app/api_keys).

### Configuring Image Generation

1. In Open WebUI, navigate to the **Admin Panel** > **Settings** > **Images** menu.
2. Set the `Image Generation Engine` field to `Open AI` (Lumenfall uses the same syntax as OpenAI).
3. Change the API endpoint URL to `https://api.lumenfall.ai/openai/v1`.
4. Enter your Lumenfall API key.
5. The API version can be left blank.
6. Enter the model you wish to use. For example: `gemini-3-pro-image`, `gpt-image-1.5`, or `flux.2-max`. See all available models at [lumenfall.ai/models](https://lumenfall.ai/models).
7. Set the image size (e.g. `1024x1024`). Supported sizes depend on the model - if unsure, `1024x1024` works with most models.

![Screenshot of the Open WebUI Images settings page configured with Lumenfall.](/images/image-generation-and-editing/lumenfall-settings.png)

### Configuring Image Editing

Lumenfall also supports image editing through the same API:

1. On the same **Images** settings page, scroll to the **Edit Image** section.
2. Toggle **Image Edit** to on.
3. Set the `Image Edit Engine` to `Open AI`.
4. Enter the same API endpoint URL: `https://api.lumenfall.ai/openai/v1`.
5. Enter your Lumenfall API key.
6. Choose a model that supports editing (e.g. `gpt-image-1.5`).

For more details, see the [Lumenfall documentation](https://docs.lumenfall.ai/integrations/openwebui).
