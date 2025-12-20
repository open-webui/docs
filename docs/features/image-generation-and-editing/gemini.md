---
sidebar_position: 5
title: "Gemini"
---

:::warning
This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.
:::

Open WebUI also supports image generation through the **Google AI Studio API** also known as the **Gemini API**.

### Initial Setup

1. Obtain an [API key](https://aistudio.google.com/api-keys) from Google AI Studio.
2. You may need to create a project and enable the `Generative Language API` in addition to adding billing information.

:::warning
If you are utilizing a free API key, it is vital to have a payment method on file. The absence of a valid payment method is a frequent cause of errors during the setup process.
:::

:::tip
Alternatively, if you are using Vertex AI, you can create an API key in Google Cloud instead of a service account. This key will function correctly, provided it is assigned the appropriate permissions.
:::

### Configuring Open WebUI

1. In Open WebUI, navigate to the **Admin Panel** > **Settings** > **Images** menu.
2. Set the `Image Generation Engine` field to `Gemini`.
3. Set the `API Base URL` to `https://generativelanguage.googleapis.com/v1beta`.
4. Enter your Google AI Studio [API key](https://aistudio.google.com/api-keys).
5. Enter the model you wish to use from these [available models](https://ai.google.dev/gemini-api/docs/imagen#model-versions).
6. Set the image size to one of the available [image sizes](https://ai.google.dev/gemini-api/docs/image-generation#aspect_ratios).

### Example Minimal Setup

One minimalistic working setup for Gemini can look like this:

#### Create Image

- **Create Image Model**: `gemini-2.5-flash-image`
- **Image Size**: `2816x1536`
- **Image Prompt Generation**: on
- **Image Generation Engine**: `Gemini`
- **Gemini Base URL**: `https://generativelanguage.googleapis.com/v1beta`
- **Gemini API Key**: Enter your API Key
- **Gemini Endpoint Method**: `generateContent`

#### Edit Image

- **Image Edit Engine**: `Gemini`
- **Model**: `gemini-2.5-flash-image`
- **Image Size**: (can be left empty)
- **Gemini Base URL**: `https://generativelanguage.googleapis.com/v1beta`
- **Gemini API Key**: Enter your API Key

![Screenshot of the Open WebUI Images settings page with Gemini selected and the API key, model, and image size fields highlighted.](/images/image-generation-and-editing/gemini-settings.png)

:::info

This feature appears to only work for models supported with this endpoint: `https://generativelanguage.googleapis.com/v1beta/models/<MODEL_NAME>:predict`.
This is the OpenAI **BETA** endpoint, which Google provides for experimental OpenAI compatibility.

Google Imagen models use this endpoint while Gemini models use a different endpoint ending with `:generateContent`

Imagen model endpoint example:

- `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict`.
- [Documentation for Imagen models](https://ai.google.dev/gemini-api/docs/imagen)

Gemini model endpoint example:

- `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent`.
- [Documentation for Gemini models](https://ai.google.dev/gemini-api/docs/image-generation)

Trying to call a Gemini model, such as gemini-2.5-flash-image aka *Nano Banana* would result in an error due to the difference in supported endpoints for Image Generation.

`400: [ERROR: models/gemini-2.5-flash-image is not found for API version v1beta, or is not supported for predict. Call ListModels to see the list of available models and their supported methods.]`

:::

### LiteLLM Proxy with Gemini Endpoints

Image generation with a LiteLLM proxy using Gemini or Imagen endpoints is supported with Open WebUI. Configure the Image Generation as follows:

1. In Open WebUI, navigate to the **Admin Panel** > **Settings** > **Images** menu.
2. Set the `Image Generation Engine` field to `Open AI`.
3. Change the API endpoint URL to `https://<your-litellm-url>:<port>/v1`.
4. Enter your LiteLLM API key.
5. The API version can be left blank.
6. Enter the image model name as it appears in your LiteLLM configuration.
7. Set the image size to one of the available sizes for the selected model.

:::tip

To find your LiteLLM connection information, navigate to the **Admin Panel** > **Settings** > **Connections** menu.
Your connection information will be listed under the Gemini API connection.

:::
