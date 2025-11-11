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

   ```python
   ./webui.sh --api --listen
   ```

3. For Docker installation of WebUI with the environment variables preset, use the following command:

   ```docker
   docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -e AUTOMATIC1111_BASE_URL=http://host.docker.internal:7860/ -e ENABLE_IMAGE_GENERATION=True -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
   ```

### Setting Up Open WebUI with AUTOMATIC1111

1. In Open WebUI, navigate to the **Admin Panel** > **Settings** > **Images** menu.
2. Set the `Image Generation Engine` field to `Default (Automatic1111)`.
3. In the API URL field, enter the address where AUTOMATIC1111's API is accessible:

   ```txt
   http://<your_automatic1111_address>:7860/
   ```

   If you're running a Docker installation of Open WebUI and AUTOMATIC1111 on the same host, use `http://host.docker.internal:7860/` as your address.

## ComfyUI

ComfyUI is a powerful and modular node-based GUI for Stable Diffusion. It gives users a high degree of control over the image generation process. Learn more or download it from its [GitHub page](https://github.com/comfyanonymous/ComfyUI).

### System Requirements

Before installing ComfyUI, ensure your system meets the following requirements:

- **Operating System:** Windows, Linux, or macOS (including Apple Silicon M-series).
- **Python:** Python 3.12 is recommended. Python 3.13 is supported, but some custom nodes may have compatibility issues. **(Note: Python 3.11+ is generally required for modern PyTorch setups.)**
- **GPU:**
  - NVIDIA (recommended)
  - AMD (Requires ROCm Toolkit on Linux)
  - Intel (including Arc series)
  - Apple Silicon (M1/M2)
- **CPU (can use the -`cpu` parameter, but is slower)
- **Git:** You will need [Git](https://git-scm.com/downloads) to clone the repository.

### Manual Installation

A manual installation gives you the most control and ensures you are running the latest version of ComfyUI.

#### 1. Create a Virtual Environment (Recommended)

To avoid conflicts with other Python projects, it's best to install ComfyUI in a dedicated virtual environment.

:::tip Choose Your Environment Manager
We recommend **Miniconda** for simplicity across all operating systems. If you are on Linux and prefer a lighter tool, **pyenv** is an excellent alternative.
:::

**Option A: Using Miniconda (Cross-Platform)**

- **Install Miniconda:** Download and install it from the [official website](https://docs.anaconda.com/free/miniconda/index.html#latest-miniconda-installer-links).
- **Create and activate the environment:**

    ```bash
    conda create -n comfyenv python=3.13
    conda activate comfyenv
    ```

**Option B: Using pyenv (Linux/macOS)**

- **Install Python (if needed):** Ensure Python 3.12 or 3.13 is installed via pyenv (e.g., `pyenv install 3.13.0`).
- **Create and activate the environment:**

    ```bash
    pyenv virtualenv 3.13.0 comfyenv
    pyenv activate comfyenv
    ```

#### 2. Clone the ComfyUI Repository

Use Git to clone the official ComfyUI repository:

```bash
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI
```

#### 3. Install Dependencies

Install the required Python packages, including PyTorch for your specific GPU. **Ensure your environment (`(comfyenv)` or `(conda env)`) is active.**

- **For NVIDIA GPUs (Recommended):**

    ```bash
    pip install torch torchvision torchaudio index-url https://download.pytorch.org/whl/cu130
    pip install -r requirements.txt
    ```

- **For AMD GPUs (Linux/ROCm):**
    This installation is required for GPU acceleration via the ROCm toolkit.

    ```bash
    pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm6.4
    pip install -r requirements.txt
    ```

- **For other platforms or CPU-only:** Refer to the [official PyTorch installation instructions](https://pytorch.org/get-started/locally/).

#### 4. Download Models

You need to place your Stable Diffusion models (checkpoints, VAEs, LoRAs, etc.) in the `ComfyUI/models/` subdirectories. For example, place checkpoint models (`.safetensors` or `.ckpt`) in `ComfyUI/models/checkpoints/`.

### Post-Installation Setup (Essential for Extensions)

Before running ComfyUI for the first time, it is highly recommended to install the [ComfyUI-Manager](https://github.com/Comfy-Org/ComfyUI-Manager) extension. **ComfyUI-Manager** is a an extension designed to enhance the usability of ComfyUI. It offers management functions to **install, remove, disable, and enable** various custom nodes of ComfyUI. Furthermore, this extension provides a hub feature and convenience functions to access a wide range of information within ComfyUI.

1. **Create Custom Node Directory:**

    ```bash
    cd ComfyUI
    mkdir -p custom_nodes
    ```

2. **Install ComfyUI Manager:** This provides a graphical interface to install all other extensions and manage models easily.

    ```bash
    cd custom_nodes
    git clone https://github.com/ltdrdata/ComfyUI-Manager.git
    cd ..
    ```

3. **Install Initial Custom Nodes:** After running ComfyUI for the first time, use the Manager to install necessary nodes like **ComfyUI-Custom-Scripts** and **ComfyUI-Impact-Pack**.

#### 5. Start ComfyUI

To run ComfyUI and make it accessible to Open WebUI, you must start it with the `--listen` flag to bind to `0.0.0.0`. This allows it to accept connections from other computers on your network.

**Standard Start (Sufficient VRAM):**

```bash
python main.py --listen 0.0.0.0
```

**Low VRAM Start (Recommended for 16GB VRAM or less, especially AMD/Multimodal Models):**
The `--lowvram` flag aggressively moves models to system RAM when idle.

```bash
python main.py --listen 0.0.0.0 --lowvram
```

Once running, the ComfyUI interface will be available at `http://<your_comfyui_ip>:8188`.

### Sharing Models with `extra_model_paths.yaml`

If you already have a collection of Stable Diffusion models from another UI (like AUTOMATIC1111) or want to keep your models in a central location, you can use the `extra_model_paths.yaml` file to tell ComfyUI where to find them.

1. **Locate the Example File:** In the root of your `ComfyUI` directory, you will find a file named `extra_model_paths.yaml.example`.
2. **Rename the File:** Rename or copy this file to `extra_model_paths.yaml`.
3. **Edit the Configuration:** Open `extra_model_paths.yaml` in a text editor. The file contains commented-out examples. To point to an existing AUTOMATIC1111 installation, you can uncomment the `a111:` section and set the `base_path` to your `stable-diffusion-webui` directory.

    **Example for sharing with AUTOMATIC1111:**

    ```yaml
    a111:
        base_path: D:\stable-diffusion-webui\ # Use the correct path for your system
    
        checkpoints: models/Stable-diffusion
        vae: models/VAE
        loras: |
             models/Lora
             models/LyCORIS
        upscale_models: |
                      models/ESRGAN
                      models/RealESRGAN
        embeddings: embeddings
        controlnet: models/ControlNet
    ```

You can also define custom paths for your models and even for custom nodes. After saving the file, you must **restart ComfyUI** for the changes to take effect.

### Connecting ComfyUI to Open WebUI

Since Open WebUI typically runs inside Docker, you must ensure the container can reach the host-based ComfyUI application via `host.docker.internal`.

1. **Host Binding Check:** Ensure ComfyUI is running with the `--listen 0.0.0.0` flag (Step 5).
2. **Firewall Check:** If the host firewall (UFW) is active, ensure port 8188 is allowed (`sudo ufw allow 8188/tcp`).

3. **Docker Run Command (Linux Native Docker):**
    For Linux users not running Docker Desktop, you must explicitly map the host gateway when running the Open WebUI container.

    ```docker
    docker run -d -p 3000:8080 \
      --add-host=host.docker.internal:host-gateway \
      -e COMFYUI_BASE_URL=http://host.docker.internal:8188/ \
      -e ENABLE_IMAGE_GENERATION=True \
      -v open-webui:/app/backend/data \
      --name open-webui \
      --restart always \
      ghcr.io/open-webui/open-webui:main
    ```

    :::warning Debugging Network Stalls
    If Open WebUI stalls when connecting, the issue is usually missing the `--add-host=host.docker.internal:host-gateway` flag in your Docker run command.
    :::

Once you have ComfyUI installed and running, you can connect it to Open WebUI from the admin settings.

1. **Navigate to Image Settings:** In Open WebUI, go to the **Admin Panel** > **Settings** > **Images**.

2. **Enable and Configure ComfyUI:**
    - Ensure the **Image Generation** toggle at the top of the page is enabled.
    - Under the **Create Image** section, set the **Image Generation Engine** to `ComfyUI`.
    - In the **ComfyUI Base URL** field, enter the address of your running ComfyUI instance (e.g., `http://host.docker.internal:8188/`).
    - Click the **refresh icon** (🔄) next to the URL field to verify the connection. A success message should appear.
    - If your ComfyUI instance requires an API key, enter it in the **ComfyUI API Key** field.

3. **Upload Your ComfyUI Workflow:**
    - First, you need to export a workflow from ComfyUI in the correct format. In the ComfyUI interface, click the ComfyUI logo at the top left and click **Settings**. Then toggle **"Dev Mode"** with a description that states "Enable dev mode options (API save, etc.)"**.
    - While still in ComfyUI, load the **image generation** workflow you want to use, and then click the **"Save (API Format)"** button. This will prompt you to give a name to the file. Name it something memorable and download the file.
    - Back in Open WebUI, under the **ComfyUI Workflow** section, click **Upload**. Select the JSON workflow file you just downloaded.

4. **Map Workflow Nodes:**
    - After the workflow is imported, you must map the node IDs from your workflow to the corresponding fields in Open WebUI (e.g., `Prompt`, `Model`, `Seed`). This tells Open WebUI which inputs in your ComfyUI workflow to control.
    - You can find the node ID by clicking on a node in ComfyUI and viewing its details.

    :::info
    You may need to adjust an `Input Key` within Open WebUI's `ComfyUI Workflow Nodes` section to match a node in your workflow. For example, the default `seed` key might need to be changed to `noise_seed` depending on your workflow's structure.
    :::

5. **Save Configuration:**
    - Click the **Save** button at the bottom of the page to finalize the configuration. You can now use ComfyUI for image generation in Open WebUI.

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

## Gemini

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

## Using Image Generation

### Method 1

1. Toggle the `Image Generation` switch to on.
2. Enter your image generation prompt.
3. Click `Send`.

![Image Generation Tutorial](/images/tutorial_image_generation_2.png)

### Method 2

![Image Generation Tutorial](/images/tutorial_image_generation.png)

1. First, use a text generation model to write a prompt for image generation.
2. After the response has finished, you can click the Picture icon to generate an image.
3. After the image has finished generating, it will be returned automatically in chat.

:::tip

You can also edit the LLM's response and enter your image generation prompt as the message
    to send off for image generation instead of using the actual response provided by the
    LLM.

:::
