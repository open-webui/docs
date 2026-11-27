---
sidebar_position: 4
title: "OpenAI"
---

:::warning
This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.
:::

Open WebUI supports image generation and editing through the **OpenAI APIs**, and through any server with an OpenAI compatible images API such as Azure OpenAI or LiteLLM. All of them use the **OpenAI compatible** connection type.

### Initial Setup

1. Obtain an [API key](https://platform.openai.com/api-keys) from OpenAI.

### Configuring Open WebUI

1. In Open WebUI, go to **Settings** > **Images & Videos** (admin section) and add a connection.
2. Set **Connection Type** to **OpenAI compatible**, **URL** to `https://api.openai.com/v1`, and enter your API key.
3. Leave **Model IDs** empty to use `gpt-image-2`, or add the models you want to offer, such as `gpt-image-1.5`.
4. Optionally open **Advanced** and set **Image Size**. GPT-Image models accept `auto`, `1024x1024`, `1536x1024` or `1024x1536`.
5. Click **Access**, choose who may use the connection, and click **Save**. Without a grant, only admins can use the connection.

### Azure OpenAI

Azure OpenAI uses the same connection type. Add a connection and set:

1. **URL** to `https://<instance-id>.cognitiveservices.azure.com/openai/deployments/<model>/`. Take the instance and model from the settings of the Azure AI Foundry.
2. The API key from the Azure AI Foundry.
3. **Model IDs** to the name of your deployed model.
4. **API Version** under **Advanced** to the value shown in the Azure AI Foundry.

:::tip Azure GPT-Image-1.5 configuration
For Azure OpenAI **gpt-image-1.5**, use these settings:
- **Model IDs**: `gpt-image-1.5`
- **Image Size**: `1024x1024`
- **API Version**: `2025-04-01-preview`
- **URL**: `https://<your-resource-name>.openai.azure.com/openai/deployments/<your-deployment-name>/`
:::

:::tip
You can also copy the Target URI from your deployment page, but delete everything after the model name. For example, the Target URI `https://test.openai.azure.com/openai/deployments/gpt-image-1/images/generations?api-version=2025-04-01-preview` becomes the URL `https://test.openai.azure.com/openai/deployments/gpt-image-1/`.
:::

### LiteLLM Proxy with OpenAI Endpoints

1. Add a connection of type **OpenAI compatible**.
2. Set **URL** to `https://<your-litellm-url>:<port>/v1` and enter your LiteLLM API key.
3. Leave **Model IDs** empty. The connection lists the image models of your LiteLLM server by itself. Add model IDs only to offer a subset.
4. Leave **API Version** empty.

:::tip
You can find your LiteLLM connection details under **Settings** > **Connections** (admin section), in the OpenAI API connection.
:::
