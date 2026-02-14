---
sidebar_position: 4
title: "OpenAI"
---

:::warning
This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.
:::

Open WebUI also supports image generation through the **OpenAI APIs**. This option includes a selector for choosing between DALL·E 2, DALL·E 3, and GPT-Image-1 each supporting different image sizes.

### Initial Setup

1. Obtain an [API key](https://platform.openai.com/api-keys) from OpenAI.

### Configuring Open WebUI

1. In Open WebUI, navigate to the **Admin Panel** > **Settings** > **Images** menu.
2. Set the `Image Generation Engine` field to `Open AI`.
3. Enter your OpenAI API key.
4. Choose the model you wish to use. Note that image size options will depend on the selected model:
   - **DALL·E 2**: Supports `256x256`, `512x512`, or `1024x1024` images.
   - **DALL·E 3**: Supports `1024x1024`, `1792x1024`, or `1024x1792` images.
   - **GPT-Image-1**: Supports `auto`, `1024x1024`, `1536x1024`, or `1024x1536` images.

![Screenshot of the Open WebUI Images settings page with Open AI selected and the API key, model, and image size fields highlighted.](/images/image-generation-and-editing/openai-settings.png)

### Azure OpenAI

Image generation with Azure OpenAI (DALL·E or GPT-Image) is supported. Configure the Image Generation as follows:

1. In Open WebUI, navigate to the **Admin Panel** > **Settings** > **Images** menu.
2. Set the `Image Generation Engine` field to `Open AI` (Azure OpenAI uses the same syntax as OpenAI).
3. Change the API endpoint URL to `https://<instance-id>.cognitiveservices.azure.com/openai/deployments/<model>/`. Set the instance and model id as you find it in the settings of the Azure AI Foundry.
4. Configure the API version to the value you find in the settings of the Azure AI Foundry.
5. Enter your Azure OpenAI API key.

![Screenshot of the Open WebUI Images settings page with Open AI selected and the API endpoint URL, API version, and API key fields highlighted for Azure OpenAI configuration.](/images/image-generation-and-editing/azure-openai-settings.png)

:::tip Azure GPT-Image-1.5 Configuration
For Azure OpenAI **gpt-image-1.5**, use the following settings for successful generation:
- **Model**: `gpt-image-1.5`
- **Image Size**: `1024x1024`
- **API Version**: `2025-04-01-preview`
- **API Endpoint URL**: `https://<your-resource-name>.openai.azure.com/openai/deployments/<your-deployment-name>/` (ensure the trailing slash is included)

If you encounter the error `[ERROR: azure-openai error: Unknown parameter: 'response_format'.]`, double-check that your API Version is set to `2025-04-01-preview` or later.
:::

:::tip
Alternative API endpoint URL tutorial: `https://<endpoint name>.openai.azure.com/openai/deployments/<model name>/` - you can find your endpoint name on https://ai.azure.com/resource/overview, and model name on https://ai.azure.com/resource/deployments.
You can also copy Target URI from your deployment detailed page, but remember to delete strings after model name.
For example, if your Target URI is `https://test.openai.azure.com/openai/deployments/gpt-image-1/images/generations?api-version=2025-04-01-preview`, the API endpoint URL in Open WebUI should be `https://test.openai.azure.com/openai/deployments/gpt-image-1/`.
:::

### LiteLLM Proxy with OpenAI Endpoints

Image generation with a LiteLLM proxy using OpenAI endpoints is supported with Open WebUI. Configure the Image Generation as follows:

1. In Open WebUI, navigate to the **Admin Panel** > **Settings** > **Images** menu.
2. Set the `Image Generation Engine` field to `Open AI`.
3. Change the API endpoint URL to `https://<your-litellm-url>:<port>/v1`.
4. Enter your LiteLLM API key.
5. The API version can be left blank.
6. Enter the image model name as it appears in your LiteLLM configuration.
7. Set the image size to one of the available sizes for the selected model.

:::tip

To find your LiteLLM connection information, navigate to the **Admin Panel** > **Settings** > **Connections** menu.
Your connection information will be listed under the OpenAI API connection.

:::
