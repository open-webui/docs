---
sidebar_position: 5
title: "🎨 Gemini Image Generation"
---

:::warning
This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.
:::

Open WebUI also supports image generation through the **Google Studio API**.

### Initial Setup

1. Obtain an [API key](https://aistudio.google.com/api-keys) from Google AI Studio.
2. You may need to create a project and enable the `Generative Language API` in addition to adding billing information.

### Configuring Open WebUI

1. In Open WebUI, navigate to the **Admin Panel** > **Settings** > **Images** menu.
2. Set the `Image Generation Engine` field to `Gemini`.
3. Set the `API Base URL` to `https://generativelanguage.googleapis.com/v1beta`.
4. Enter your Google AI Studio [API key](https://aistudio.google.com/api-keys).
5. Enter the model you wish to use from these [available models](https://ai.google.dev/gemini-api/docs/imagen#model-versions).
6. Set the image size to one of the available [image sizes](https://ai.google.dev/gemini-api/docs/image-generation#aspect_ratios).

:::info

This feature appears to only work for models supported with this endpoint: `https://generativelanguage.googleapis.com/v1beta/models/<MODEL_NAME>:predict`. 

Google Imagen models use this endpoint while Gemini models use a different endpoint ending with `:generateContent` 

Imagen model endpoint example:
- `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict`.
- [Documentation for Imagen models](https://ai.google.dev/gemini-api/docs/imagen)

Gemini model endpoint example:
- `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent`.
- [Documentation for Gemini models](https://ai.google.dev/gemini-api/docs/image-generation)

Trying to call a Gemini model, such as gemini-2.5-flash-image aka *Nano Banana* will result in an error due to the difference in supported endpoints.

`400: [ERROR: models/gemini-2.5-flash-image is not found for API version v1beta, or is not supported for predict. Call ListModels to see the list of available models and their supported methods.]`

:::
