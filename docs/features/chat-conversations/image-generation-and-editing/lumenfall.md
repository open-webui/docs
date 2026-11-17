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

1. In Open WebUI, go to **Settings** > **Images** (admin section) and add a connection.
2. Set **Connection Type** to **OpenAI compatible** (Lumenfall uses the same syntax as OpenAI).
3. Set **URL** to `https://api.lumenfall.ai/openai/v1` and enter your Lumenfall API key.
4. Under **Model IDs**, add the models you wish to use. For example: `gemini-3.1-flash-image`, `gpt-image-2` or `flux.2-max`. See all available models at [lumenfall.ai/models](https://lumenfall.ai/models).
5. Optionally open **Advanced** and set **Image Size** (for example `1024x1024`). Supported sizes depend on the model.
6. Set **Access Control** and click **Save**. Without a grant, only admins can use the connection.

### Configuring Image Editing

Lumenfall also supports image editing through the same connection. Add a model that supports editing to **Model IDs**, such as `gpt-image-2`.

For more details, see the [Lumenfall documentation](https://docs.lumenfall.ai/integrations/openwebui).
