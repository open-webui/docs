---
sidebar_position: 3
title: "📝 Tutorial"
---

# 📝 Tutorial

:::info

# **Seeking Contributors!**

:::

## How to Add a New Model to LiteLLM

LiteLLM supports a variety of APIs, both OpenAI-compatible and others. To integrate a new API model, follow these instructions:

1. Go to the Settings > Models > LiteLLM model management interface.
2. In 'Simple' mode, you will only see the option to enter a **Model**.
3. For additional configuration options, click on the 'Simple' toggle to switch to 'Advanced' mode. Here you can enter:
   - **Model Name**: The name of the model as you want it to appear in the models list.
   - **API Base URL**: The base URL for your API provider. This field can usually be left blank unless your provider specifies a custom endpoint URL.
   - **API Key**: Your unique API key. Replace with the key provided by your API provider.
   - **API RPM**: The allowed requests per minute for your API. Replace with the appropriate value for your API plan.

4. After entering all the required information, click the '+' button to add the new model to LiteLLM.

For more information on the specific providers and advanced settings, consult the [LiteLLM Providers Documentation](https://litellm.vercel.app/docs/providers).

## Image Generation with AUTOMATIC1111 API

Open WebUI now supports image generation through the AUTOMATIC1111 API. To set this up, follow these steps:

### Initial Setup

1. Ensure that you have AUTOMATIC1111 installed.
2. Launch the WebUI with additional flags to enable API access:
   ```
   ./webui.sh --api --listen
   ```
   For Docker installations, use the `--listen` flag to allow connections outside of localhost.

### Configuring Open WebUI

1. In Open WebUI, navigate to Settings > Images.
2. In the API URL field, enter the address where AUTOMATIC1111's API is accessible, following this format:
   ```
   http://<your_automatic1111_address>:7860
   ```
   If you're running a Docker installation of Open WebUI and AUTOMATIC1111 on the same host, replace `<your_automatic1111_address>` with `host.docker.internal`.

Please note that, as of now, only the AUTOMATIC1111 API is supported for image generation within Open WebUI.