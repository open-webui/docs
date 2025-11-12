---
sidebar_position: 2
title: "🔀 ComfyUI"
---

:::warning
This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.
:::

ComfyUI is a powerful and modular node-based GUI for Stable Diffusion. It gives users a high degree of control over the image generation process. Learn more or download it from its [GitHub page](https://github.com/comfyanonymous/ComfyUI).

### System Requirements

Before installing ComfyUI, ensure your system meets the following requirements:

- **Operating System:** Windows, Linux, or macOS (including Apple Silicon M-series).
- **Python:** Python 3.12 is recommended. Python 3.13 is supported, but some custom nodes may have compatibility issues. **(Note: Python 3.11+ is generally required for modern PyTorch setups.)**
- **GPU:**
  - NVIDIA (recommended)
  - AMD (Requires ROCm Toolkit on Linux)
  - Intel  (includes Arc series, supports IPEX)
  - Apple Silicon (M1/M2)
  - Ascend NPU
  - Cambricon MLU
- **CPU:** (can use the `-cpu` parameter, but will be slower)
- **Git:** You will need [Git](https://git-scm.com/downloads) to clone the repository.

### Manual Installation

A manual installation gives you the most control and ensures you are running the latest version of ComfyUI.

#### 1. Create a Virtual Environment (Recommended)

To avoid conflicts with other Python projects, it's best to install ComfyUI in a dedicated virtual environment.

:::tip
**Choose Your Environment Manager**
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

:::warning
**Debugging Network Stalls**
If Open WebUI stalls when connecting, the issue is usually missing the `--add-host=host.docker.internal:host-gateway` flag in your Docker run command.
:::

Once you have ComfyUI installed and running, you can connect it to Open WebUI from the admin settings.

### ComfyUI Image Generation

1. **Navigate to Image Settings:** In Open WebUI, go to the **Admin Panel** > **Settings** > **Images**.

2. **Enable and Configure ComfyUI:**

- Ensure the **Image Generation** toggle at the top of the page is enabled.
- Under the **Create Image** section, set the **Image Generation Engine** to `ComfyUI`.
- **Model**: Select the base model to be used for generating the image.
- **Image Size**: Defines the resolution of the generated image (e.g., 512x512, 1024x1024).
- **Steps**: The number of sampling steps; higher values can improve image quality but take longer to process.
- **Image Prompt Generation**: When enabled, this feature uses a language model to automatically generate a more detailed and creative prompt based on your initial input, which can lead to better image results.
- In the **ComfyUI Base URL** field, enter the address of your running ComfyUI instance (e.g., `http://host.docker.internal:8188/`).
- Click the **refresh icon** (🔄) next to the URL field to verify the connection. A success message should appear.
- If your ComfyUI instance requires an API key, enter it in the **ComfyUI API Key** field.

![Screenshot of the Open WebUI Images settings page with ComfyUI selected for image generation.](/images/image-generation-and-editing/comfyui-generation-settings.png)

1. **Upload Your ComfyUI Workflow:**

- First, you need to export a workflow from ComfyUI in the correct format. In the ComfyUI interface, click the ComfyUI logo at the top left and click **Settings**. Then toggle **"Dev Mode"** with a description that states "Enable dev mode options (API save, etc.)"**.
- While still in ComfyUI, load the **image generation** workflow you want to use, and then click the **"Save (API Format)"** button. This will prompt you to give a name to the file. Name it something memorable and download the file.
- Back in Open WebUI, under the **ComfyUI Workflow** section, click **Upload**. Select the JSON workflow file you just downloaded.

![Screenshot of the ComfyUI Workflow section in Open WebUI, showing the upload button.](/images/image-generation-and-editing/comfyui-workflow-upload.png)

1. **Map Workflow Nodes:**

- After the workflow is imported, you must map the node IDs from your workflow to the corresponding fields in Open WebUI (e.g., `Prompt`, `Model`, `Seed`). This tells Open WebUI which inputs in your ComfyUI workflow to control.
- You can find the node ID by clicking on a node in ComfyUI and viewing its details.

![Screenshot of the ComfyUI Workflow Nodes section in Open WebUI, showing the mapping fields.](/images/image-generation-and-editing/comfyui-node-mapping.png)

:::info
You may need to adjust an `Input Key` within Open WebUI's `ComfyUI Workflow Nodes` section to match a node in your workflow. For example, the default `seed` key might need to be changed to `noise_seed` depending on your workflow's structure.
:::

:::tip
Some workflows, such as ones that use any of the Flux models, may utilize multiple nodes IDs that is necessary to fill in for their node entry fields within Open WebUI. If a node entry field requires multiple IDs, the node IDs should be comma separated (e.g., `1` or `1, 2`).
:::

1. **Save Configuration:**

- Click the **Save** button at the bottom of the page to finalize the configuration. You can now use ComfyUI for image generation in Open WebUI.

### ComfyUI Image Editing

Open WebUI also supports image editing through ComfyUI, allowing you to modify existing images.

1. **Navigate to Image Settings:** In Open WebUI, go to the **Admin Panel** > **Settings** > **Images**.

2. **Configure Image Editing:**

- Under the **Edit Image** section, set the **Image Edit Engine** to `ComfyUI`.
- **Model**: Select the model to be used for the editing task.
- **Image Size**: Specify the desired resolution for the output image.
- **ComfyUI Base URL** and **API Key**: These fields are shared with the image generation settings.
- **ComfyUI Workflow**: Upload a separate workflow file specifically designed for image editing tasks. The process is the same as for image generation.
- **Map Workflow Nodes**: Just as with image generation, you must map the node IDs from your editing workflow to the corresponding fields in Open WebUI. Common fields for editing workflows include `Image`, `Prompt`, and `Model`.

![Screenshot of the Open WebUI Images settings page with ComfyUI selected for image editing.](/images/image-generation-and-editing/comfyui-editing-settings.png)

### Deeper Dive: Mapping ComfyUI Nodes to Open WebUI

Understanding the node ID mapping is often the biggest hurdle in integrating ComfyUI with an external service like Open WebUI. Integrating ComfyUI via API requires mapping Open WebUI's generic controls (e.g., "Model," "Width," "Prompt") to specific node inputs within your static ComfyUI workflow JSON.

#### 1. Identifying Node IDs and Input Keys in ComfyUI

Before configuring Open WebUI, you must examine your exported workflow JSON files directly in a text editor. The Node ID is the unique number ComfyUI uses to identify the node in the JSON structure. The top-level keys in the JSON object are the node IDs.

**Identify the Input Key (The Parameter Name)**

The Input Key is the exact parameter name within that node's JSON structure that you need to change (e.g., `seed`, `width`, `unet_name`).

1. **Examine the JSON**: Look at your API workflow JSON (`workflow_api.json`).
2. **Find the Node ID**: Locate the section corresponding to the node's ID (e.g., `"37"`).
3. **Identify the Key**: Within the `"inputs"` block, find the variable you want to control.

**Example: unet_name Node (ID 37)**

```json
"37": {
  "inputs": {
      "unet_name": "qwen_image_fp8_e4m3fn.safetensors",
      "weight_dtype": "default"
  },
  "class_type": "UNETLoader",
  "_meta": {
    "title": "Load Diffusion Model"
  }
},
```

![Screenshot of the ComfyUI interface with the UNETLoader node selected, highlighting the node ID and the 'seed' and 'steps' input fields.](/images/image-generation-and-editing/comfyui-unet-name-node.png)

In this example, the Input Keys are `seed` and `steps`.

#### 2. Mapping in Open WebUI

In the Open WebUI settings under **ComfyUI Workflow Nodes**, you will see a list of hard-coded parameters (e.g., `Prompt`, `Model`, `Seed`). For each parameter, you must provide two pieces of information from your workflow:

- **Input Key (Left Field)**: The specific parameter name from the node's `inputs` block in your workflow JSON (e.g., `text`, `unet_name`, `seed`).
- **Node ID (Right Field)**: The corresponding ID of the node you want to control (e.g., `6`, `39`, `3`).

This tells Open WebUI to find the node with the given ID and modify the value of the specified input key.

**Example: Mapping KSampler Seed**

Let's say you want to control the `seed` in your KSampler node, which has an ID of `3`. In the `Seed` section of the Open WebUI settings:

| Open WebUI Parameter | Input Key (Left Field) | Node ID (Right Field) |
|----------------------|------------------------|-----------------------|
| `Seed`               | `seed`                 | `3`                   |

#### 3. Handling Complex/Multimodal Nodes (Qwen Example)

For specialized nodes, the Input Key may not be a simple text.

| Parameter   | Input Key (Left Field) | Node ID (Right Field) | Note                                                                                             |
|-------------|------------------------|-----------------------|--------------------------------------------------------------------------------------------------|
| **Prompt**  | `prompt`               | `76`                  | The key is still `prompt`, but it targets the specialized TextEncodeQwenImageEdit node (76).     |
| **Model**   | `unet_name`            | `37`                  | You must use the exact input key `unet_name` to control the model file name in the UNETLoader.   |
| **Image Input** | `image`            | `78`                  | The key is `image`. This passes the filename of the source image to the LoadImage node.          |

#### 4. Troubleshooting Mismatch Errors

If ComfyUI stalls or gives a validation error, consult the log and the JSON structure:

| Error Type | Cause & Debugging | Solution |
|---------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Value not in list: unet_name: 'xyz.safetensors'` | You mapped the correct node ID (e.g., 37), but the value being passed (e.g., `xyz.safetensors`) is not a valid model name for that node type (e.g., accidentally sending a VAE model to a UNET loader). | Correct the model name set in Open WebUI for either image generation or editing, ensuring both model names matche the type of model the ComfyUI node is expecting. |
| `Missing input <key>` | Your workflow requires an input (e.g., `cfg` or `sampler_name`), but Open WebUI did not send a value because the field was not mapped. | Either hardcode the value in the workflow JSON, or map the required input key to the correct node ID. |

By meticulously matching the Node ID and the specific Input Key, you ensure Open WebUI correctly overwrites the default values in your workflow JSON before submitting the prompt to ComfyUI.

## Example Setup: Qwen Image Generation and Editing

This section provides a supplementary guide on setting up the Qwen models for both image generation and editing.

### Qwen Image Generation

#### Model Download

- **Diffusion Model**: [qwen_image_fp8_e4m3fn.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/resolve/main/split_files/diffusion_models/qwen_image_fp8_e4m3fn.safetensors)
- **Text Encoder**: [qwen_2.5_vl_7b_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/resolve/main/split_files/text_encoders/qwen_2.5_vl_7b_fp8_scaled.safetensors)
- **VAE**: [qwen_image_vae.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/resolve/main/split_files/vae/qwen_image_vae.safetensors)

#### Model Storage Location

```
📂 ComfyUI/
├── 📂 models/
│   ├── 📂 diffusion_models/
│   │   └── qwen_image_fp8_e4m3fn.safetensors
│   ├── 📂 vae/
│   │   └── qwen_image_vae.safetensors
│   └── 📂 text_encoders/
│       └── qwen_2.5_vl_7b_fp8_scaled.safetensors
```

### Qwen Image Editing

#### Model Download

- **Diffusion Model**: [qwen_image_edit_fp8_e4m3fn.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image-Edit_ComfyUI/resolve/main/split_files/diffusion_models/qwen_image_edit_fp8_e4m3fn.safetensors)
- **Text Encoder**: [qwen_2.5_vl_7b_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/resolve/main/split_files/text_encoders/qwen_2.5_vl_7b_fp8_scaled.safetensors)
- **VAE**: [qwen_image_vae.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/resolve/main/split_files/vae/qwen_image_vae.safetensors)

#### Model Storage Location

```
📂 ComfyUI/
├── 📂 models/
│   ├── 📂 diffusion_models/
│   │   └── qwen_image_edit_fp8_e4m3fn.safetensors
│   ├── 📂 vae/
│   │   └── qwen_image_vae.safetensors
│   └── 📂 text_encoders/
│       └── qwen_2.5_vl_7b_fp8_scaled.safetensors
```

## Example Setup: FLUX.1 Image Generation

This section provides a supplementary guide on setting up the FLUX.1 models for image generation.

### FLUX.1 Dev

#### Model Download

- **Diffusion Model**: [flux1-dev.safetensors](https://huggingface.co/black-forest-labs/FLUX.1-dev/resolve/main/flux1-dev.safetensors)
- **Text Encoder 1**: [clip_l.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/resolve/main/clip_l.safetensors?download=true)
- **Text Encoder 2**: [t5xxl_fp16.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/resolve/main/t5xxl_fp16.safetensors?download=true) (Recommended when your VRAM is greater than 32GB)
- **VAE**: [ae.safetensors](https://huggingface.co/black-forest-labs/FLUX.1-schnell/resolve/main/ae.safetensors?download=true)

#### Model Storage Location

```
📂 ComfyUI/
├── 📂 models/
│   ├── 📂 diffusion_models/
│   │   └── flux1-dev.safetensors
│   ├── 📂 vae/
│   │   └── ae.safetensors
│   └── 📂 text_encoders/
│       ├── clip_l.safetensors
│       └── t5xxl_fp16.safetensors
```

### FLUX.1 Schnell

#### Model Download

- **Diffusion Model**: [flux1-schnell.safetensors](https://huggingface.co/black-forest-labs/FLUX.1-schnell/resolve/main/flux1-schnell.safetensors)
- **Text Encoder 1**: [clip_l.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/resolve/main/clip_l.safetensors?download=true)
- **Text Encoder 2**: [t5xxl_fp8_e4m3fn.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/resolve/main/t5xxl_fp8_e4m3fn.safetensors?download=true) (Recommended when your VRAM is greater than 32GB)
- **VAE**: [ae.safetensors](https://huggingface.co/black-forest-labs/FLUX.1-schnell/resolve/main/ae.safetensors?download=true)

#### Model Storage Location

```
📂 ComfyUI/
├── 📂 models/
│   ├── 📂 diffusion_models/
│   │   └── flux1-schnell.safetensors
│   ├── 📂 vae/
│   │   └── ae.safetensors
│   └── 📂 text_encoders/
│       ├── clip_l.safetensors
│       └── t5xxl_fp8_e4m3fn.safetensors
```

## Configuring with SwarmUI

SwarmUI utilizes ComfyUI as its backend. In order to get Open WebUI to work with SwarmUI you will have to append `ComfyBackendDirect` to the `ComfyUI Base URL`. Additionally, you will want to setup SwarmUI with LAN access. After aforementioned adjustments, setting up SwarmUI to work with Open WebUI will be the same as the steps for [ComfyUI Image Generation](#comfyui-image-generation) outlined above.
![Install SwarmUI with LAN Access](https://github.com/user-attachments/assets/a6567e13-1ced-4743-8d8e-be526207f9f6)

### SwarmUI API URL

The address you will input as the ComfyUI Base URL will look like: `http://<your_swarmui_address>:7801/ComfyBackendDirect`
