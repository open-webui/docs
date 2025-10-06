---
sidebar_position: 6
title: "🎨 Image Generation"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

# 🎨 Image Generation

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

### Setting Up Open WebUI with AUTOMATIC1111

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

### Setting Up Open WebUI with ComfyUI

#### Setting Up FLUX.1 Models

1. **Model Checkpoints**:

- Download either the `FLUX.1-schnell` or `FLUX.1-dev` model from the [black-forest-labs HuggingFace page](https://huggingface.co/black-forest-labs).
- Place the model checkpoint(s) in both the `models/checkpoints` and `models/unet` directories of ComfyUI. Alternatively, you can create a symbolic link between `models/checkpoints` and `models/unet` to ensure both directories contain the same model checkpoints.

2. **VAE Model**:

- Download `ae.safetensors` VAE from [here](https://huggingface.co/black-forest-labs/FLUX.1-schnell/blob/main/ae.safetensors).
- Place it in the `models/vae` ComfyUI directory.

3. **CLIP Model**:

- Download `clip_l.safetensors` from [here](https://huggingface.co/comfyanonymous/flux_text_encoders/tree/main).
- Place it in the `models/clip` ComfyUI directory.

4. **T5XXL Model**:

- Download either the `t5xxl_fp16.safetensors` or `t5xxl_fp8_e4m3fn.safetensors` model from [here](https://huggingface.co/comfyanonymous/flux_text_encoders/tree/main).
- Place it in the `models/clip` ComfyUI directory.

To integrate ComfyUI into Open WebUI, follow these steps:

#### Step 1: Configure Open WebUI Settings

1. Navigate to the **Admin Panel** in Open WebUI.
2. Click on **Settings** and then select the **Images** tab.
3. In the `Image Generation Engine` field, choose `ComfyUI`.
4. In the **API URL** field, enter the address where ComfyUI's API is accessible, following this format: `http://<your_comfyui_address>:8188/`.
   - Set the environment variable `COMFYUI_BASE_URL` to this address to ensure it persists within the WebUI.

#### Step 2: Verify the Connection and Enable Image Generation

1. Ensure ComfyUI is running and that you've successfully verified the connection to Open WebUI. You won't be able to proceed without a successful connection.
2. Once the connection is verified, toggle on **Image Generation (Experimental)**. More options will be presented to you.
3. Continue to step 3 for the final configuration steps.

#### Step 3: Configure ComfyUI Settings and Import Workflow

1. Enable developer mode within ComfyUI. To do this, look for the gear icon above the **Queue Prompt** button within ComfyUI and enable the `Dev Mode` toggle.
2. Export the desired workflow from ComfyUI in `API format` using the `Save (API Format)` button. The file will be downloaded as `workflow_api.json` if done correctly.
3. Return to Open WebUI and click the **Click here to upload a workflow.json file** button.
4. Select the `workflow_api.json` file to import the exported workflow from ComfyUI into Open WebUI.
5. After importing the workflow, you must map the `ComfyUI Workflow Nodes` according to the imported workflow node IDs.
6. Set `Set Default Model` to the name of the model file being used, such as `flux1-dev.safetensors`

:::info

You may need to adjust an `Input Key` or two within Open WebUI's `ComfyUI Workflow Nodes` section to match a node within your workflow.
For example, `seed` may need to be renamed to `noise_seed` to match a node ID within your imported workflow.

:::

:::tip

Some workflows, such as ones that use any of the Flux models, may utilize multiple nodes IDs that is necessary to fill in for their node entry fields within Open WebUI. If a node entry field requires multiple IDs, the node IDs should be comma separated (e.g. `1` or `1, 2`).

:::

6. Click `Save` to apply the settings and enjoy image generation with ComfyUI integrated into Open WebUI!

After completing these steps, your ComfyUI setup should be integrated with Open WebUI, and you can use the Flux.1 models for image generation.

### Configuring with SwarmUI

SwarmUI utilizes ComfyUI as its backend. In order to get Open WebUI to work with SwarmUI you will have to append `ComfyBackendDirect` to the `ComfyUI Base URL`. Additionally, you will want to setup SwarmUI with LAN access. After aforementioned adjustments, setting up SwarmUI to work with Open WebUI will be the same as [Step one: Configure Open WebUI Settings](https://github.com/open-webui/docs/edit/main/docs/features/images.md#step-1-configure-open-webui-settings) as outlined above.
![Install SwarmUI with LAN Access](https://github.com/user-attachments/assets/a6567e13-1ced-4743-8d8e-be526207f9f6)

#### SwarmUI API URL

The address you will input as the ComfyUI Base URL will look like: `http://<your_swarmui_address>:7801/ComfyBackendDirect`

## OpenAI

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

### Azure OpenAI

Image generation with Azure OpenAI Dall-E or GPT-Image is supported with Open WebUI. Configure the Image Generation as follows:

1. In Open WebUI, navigate to the **Admin Panel** > **Settings** > **Images** menu.
2. Set the `Image Generation Engine` field to `Open AI` (Azure OpenAI uses the same syntax as OpenAI).
3. Change the API endpoint URL to `https://<instance-id>.cognitiveservices.azure.com/openai/deployments/<model>/`. Set the instance and model id as you find it in the settings of the Azure AI Foundry.
4. Configure the API version to the value you find in the settings of the Azure AI Fountry.
5. Enter your Azure OpenAI API key.

:::tip

Alternative API endpoint URL tutorial: `https://<endpoint name>.openai.azure.com/openai/deployments/<model name>/` - you can find your endpoint name on https://ai.azure.com/resource/overview, and model name on https://ai.azure.com/resource/deployments.
You can also copy Target URI from your deployment detailed page, but remember to delete strings after model name.
For example, if your Target URI is `https://test.openai.azure.com/openai/deployments/gpt-image-1/images/generations?api-version=2025-04-01-preview`, the API endpoint URL in Open WebUI should be `https://test.openai.azure.com/openai/deployments/gpt-image-1/`.

:::

=======

## Image Router

Open WebUI also supports image generation through the **Image Router APIs**. Image Router is an [open source](https://github.com/DaWe35/image-router) image generation proxy that unifies most popular models into a single API.

### Initial Setup

1. Obtain an [API key](https://imagerouter.io/api-keys) from Image Router.

### Configuring Open WebUI

1. In Open WebUI, navigate to the **Admin Panel** > **Settings** > **Images** menu.
2. Set the `Image Generation Engine` field to `Open AI` (Image Router uses the same syntax as OpenAI).
3. Change the API endpoint URL to `https://api.imagerouter.io/v1/openai`
4. Enter your Image Router API key.
5. Enter the model you wish to use. Do not use the dropdown to select models, enter the model name instead. For more information, [see all models](https://imagerouter.io/models).

## Using Image Generation

#### Method 1

1. Toggle the `Image Generation` switch to on.
2. Enter your image generation prompt.
3. Click `Send`.

![Image Generation Tutorial](/images/tutorial_image_generation_2.png)

#### Method 2

![Image Generation Tutorial](/images/tutorial_image_generation.png)

1. First, use a text generation model to write a prompt for image generation.
2. After the response has finished, you can click the Picture icon to generate an image.
3. After the image has finished generating, it will be returned automatically in chat.

:::tip

You can also edit the LLM's response and enter your image generation prompt as the message
    to send off for image generation instead of using the actual response provided by the
    LLM.

:::
