---
sidebar_position: 3
title: "Image Generation"
---

# Image Generation

Open WebUI now supports image generation through two backends: **AUTOMATIC1111** and **OpenAI DALL·E**. This guide will help you set up and use both options.

## AUTOMATIC1111

Open WebUI supports image generation through the **AUTOMATIC1111** [API](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/API). Follow these steps to get started:

### Initial Setup

1. Ensure that you have [AUTOMATIC1111](https://github.com/AUTOMATIC1111/stable-diffusion-webui) installed.
2. Launch AUTOMATIC1111 with additional flags to enable API access:
   ```
   ./webui.sh --api --listen
   ```
   For Docker installations of Open WebUI, use the `--listen` flag to allow connections outside of localhost.

### Configuring Open WebUI

1. In Open WebUI, navigate to **Settings > Images**.
2. In the API URL field, enter the address where AUTOMATIC1111's API is accessible:
   ```
   http://<your_automatic1111_address>:7860
   ```
   If you're running a Docker installation of Open WebUI and AUTOMATIC1111 on the same host, use `host.docker.internal` as your address.

## OpenAI DALL·E

Open WebUI also supports image generation through the **OpenAI DALL·E APIs**. This option now includes a selector for choosing between DALL·E 2 and DALL·E 3, each supporting different image sizes.

### Initial Setup

1. Obtain an [API key](https://platform.openai.com/api-keys) from OpenAI.

### Configuring Open WebUI

1. In Open WebUI, navigate to **Settings > Images**.
2. Select **OpenAI** as your image generation backend.
3. Enter your OpenAI API key.
4. Choose the DALL·E model you wish to use. Note that image size options will depend on the selected model:
   - **DALL·E 2**: Supports `256x256`, `512x512`, or `1024x1024` images.
   - **DALL·E 3**: Supports `1024x1024`, `1792x1024`, or `1024x1792` images.

## Using Image Generation

![Image Generation Tutorial](/img/tutorial_image_generation.png)

1. First, use a text generation model to write a prompt for image generation.
2. After the response has finished, you can click the Picture icon to generate an image.
