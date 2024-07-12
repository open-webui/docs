---
sidebar_position: 3
title: "Image Generation"
---

# Image Generation

Open WebUI supports image generation through three backends: **AUTOMATIC1111**, **ComfyUI**, and **OpenAI DALL·E**. This guide will help you set up and use either of these options.

## AUTOMATIC1111

Open WebUI supports image generation through the **AUTOMATIC1111** [API](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/API). Here are the steps to get started:

### Initial Setup

1. Ensure that you have [AUTOMATIC1111](https://github.com/AUTOMATIC1111/stable-diffusion-webui) installed.
2. Launch AUTOMATIC1111 with additional flags to enable API access:
   ```
   ./webui.sh --api --listen
   ```
3. For Docker installation of WebUI with the environment variables preset, use the following command:
   ```
   docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -e AUTOMATIC1111_BASE_URL=http://host.docker.internal:7860/ -e ENABLE_IMAGE_GENERATION=True -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
   ```

### Configuring Open WebUI

1. In Open WebUI, navigate to the **Admin Panel** > **Settings** > **Images** menu.
2. Set the `Image Generation Engine` field to `Default (Automatic1111)`.
3. In the API URL field, enter the address where AUTOMATIC1111's API is accessible:
   ```
   http://<your_automatic1111_address>:7860/
   ```
   If you're running a Docker installation of Open WebUI and AUTOMATIC1111 on the same host, use `http://host.docker.internal:7860/` as your address.

## ComfyUI

ComfyUI provides an alternative interface for managing and interacting with image generation models. Learn more or download it from its [GitHub page](https://github.com/comfyanonymous/ComfyUI). Below are the setup instructions to get ComfyUI running alongside your other tools.

### Initial Setup

1. Download and extract the ComfyUI software package from [GitHub](https://github.com/comfyanonymous/ComfyUI) to your desired directory.
2. To start ComfyUI, run the following command:
   ```
   python main.py
   ```
   For systems with low VRAM, launch ComfyUI with additional flags to reduce memory usage:
   ```
   python main.py --lowvram
   ```
3. For Docker installation of WebUI with the environment variables preset, use the following command:
   ```
   docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -e COMFYUI_BASE_URL=http://host.docker.internal:7860/ -e ENABLE_IMAGE_GENERATION=True -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
   ```

### Configuring Open WebUI

1. In Open WebUI, navigate to the **Admin Panel** > **Settings** > **Images** menu.
2. Set the `Image Generation Engine` field to `ComfyUI`.
3. In the API URL field, enter the address where ComfyUI's API is accessible:
   ```
   http://<your_comfyui_address>:8188/
   ```
   Set the environment variable `COMFYUI_BASE_URL` to this address to ensure proper integration.

## OpenAI DALL·E

Open WebUI also supports image generation through the **OpenAI DALL·E APIs**. This option includes a selector for choosing between DALL·E 2 and DALL·E 3, each supporting different image sizes.

### Initial Setup

1. Obtain an [API key](https://platform.openai.com/api-keys) from OpenAI.

### Configuring Open WebUI

1. In Open WebUI, navigate to the **Admin Panel** > **Settings** > **Images** menu.
2. Set the `Image Generation Engine` field to `Open AI (Dall-E)`.
3. Enter your OpenAI API key.
4. Choose the DALL·E model you wish to use. Note that image size options will depend on the selected model:
   - **DALL·E 2**: Supports `256x256`, `512x512`, or `1024x1024` images.
   - **DALL·E 3**: Supports `1024x1024`, `1792x1024`, or `1024x1792` images.

### Azure OpenAI

Using Azure OpenAI Dall-E directly is unsupported, but you can [set up a LiteLLM proxy](https://litellm.vercel.app/docs/image_generation) which is compatible with the `Open AI (Dall-E)` Image Generation Engine.

## Using Image Generation

![Image Generation Tutorial](/img/tutorial_image_generation.png)

1. First, use a text generation model to write a prompt for image generation.
2. After the response has finished, you can click the Picture icon to generate an image.
