---
sidebar_position: 6
title: "Image Router"
---

:::warning
This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.
:::

Open WebUI also supports image generation through the **Image Router APIs**. Image Router is an [open source](https://github.com/DaWe35/image-router) image generation proxy that unifies most popular models into a single API.

### Initial Setup

1. Obtain an [API key](https://imagerouter.io/api-keys) from Image Router.

### Configuring Open WebUI

1. In Open WebUI, go to **Settings** > **Images** (admin section) and add a connection.
2. Set **Connection Type** to **OpenAI compatible** (Image Router uses the same syntax as OpenAI).
3. Set **URL** to `https://api.imagerouter.io/v1/openai` and enter your Image Router API key.
4. Under **Model IDs**, add the model you wish to use by typing its name. For more information, [see all models](https://imagerouter.io/models).
5. Set **Access Control** and click **Save**. Without a grant, only admins can use the connection.
