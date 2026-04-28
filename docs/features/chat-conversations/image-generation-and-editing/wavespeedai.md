---
sidebar_position: 8
title: "WaveSpeedAI"
---

:::warning
This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.
:::

Open WebUI can use [WaveSpeedAI](https://wavespeed.ai) through [ComfyUI](https://github.com/comfyanonymous/ComfyUI) by installing the [WaveSpeedAI ComfyUI custom node](https://github.com/WaveSpeedAI/wavespeed-comfyui). This lets you run WaveSpeedAI workflows from Open WebUI while keeping ComfyUI as the image generation engine.

### Initial Setup

1. Install and run ComfyUI. If Open WebUI runs in Docker, start ComfyUI with the `--listen 0.0.0.0` flag so the Open WebUI container can reach it.
2. Install the WaveSpeedAI custom node:

   ```bash
   cd ComfyUI/custom_nodes
   git clone https://github.com/WaveSpeedAI/wavespeed-comfyui.git
   cd wavespeed-comfyui
   <ComfyUI python> -m pip install -r requirements.txt
   ```

3. Restart ComfyUI.
4. Create a WaveSpeedAI API key from your WaveSpeedAI account.

### Configuring the WaveSpeedAI API Key

After installing the custom node, configure your WaveSpeedAI API key using one of the following methods:

- In ComfyUI, open **Settings** > **WaveSpeed** and enter your API key.
- Create a `config.json` file in the `wavespeed-comfyui` directory:

  ```json
  {
    "api_key": "your_api_key_here"
  }
  ```

- Set the `WAVESPEED_API_KEY` environment variable before starting ComfyUI.

### Connecting ComfyUI to Open WebUI

1. In Open WebUI, navigate to **Admin Panel** > **Settings** > **Images**.
2. Enable **Image Generation**.
3. Set the `Image Generation Engine` field to `ComfyUI`.
4. Set `ComfyUI Base URL` to your ComfyUI server, for example `http://host.docker.internal:8188/` when Open WebUI runs in Docker Desktop.
5. Click the refresh icon next to the URL field to verify the connection.

For more details on ComfyUI connectivity, workflow upload, and Docker networking, see the [ComfyUI image generation guide](./comfyui.md).

### Preparing a WaveSpeedAI Workflow

WaveSpeedAI provides example ComfyUI workflows in the `examples` directory of the custom node repository. You can start from one of these examples:

- [Text to image](https://github.com/WaveSpeedAI/wavespeed-comfyui/blob/master/examples/case1-text-to-image/case1-t2i.json)
- [Text to video](https://github.com/WaveSpeedAI/wavespeed-comfyui/blob/master/examples/case2-text-to-video/case2-t2v.json)
- [Multi-stage pipeline](https://github.com/WaveSpeedAI/wavespeed-comfyui/blob/master/examples/case8-complex-pipeline/case8-combination.json)

Before uploading a workflow to Open WebUI, export it from ComfyUI in API format:

1. Load the WaveSpeedAI workflow in ComfyUI.
2. Run the workflow once in ComfyUI to verify that the WaveSpeedAI node, API key, and model parameters work.
3. Open ComfyUI **Settings** and enable **Dev Mode**.
4. Use **Export (API)** from the ComfyUI file menu to save the workflow in API format.
5. In Open WebUI, upload the exported API workflow under the **ComfyUI Workflow** section.

:::caution
Do not upload the normal ComfyUI UI workflow JSON directly unless you have confirmed it is also in API format. Open WebUI expects a ComfyUI API workflow when submitting jobs to ComfyUI.
:::

### Mapping Workflow Nodes

After uploading the API workflow, map Open WebUI fields to the relevant WaveSpeedAI node inputs.

For a simple WaveSpeedAI text-to-image workflow, map the prompt field to the `prompt` input on the `WaveSpeedAIPredictor` node. You can find the node ID by opening the exported API workflow JSON and locating the node whose `class_type` is `WaveSpeedAIPredictor`.

Example API workflow node structure:

```json
"4": {
  "inputs": {
    "prompt": "a cinematic photo of a futuristic city",
    "aspect_ratio": "1:1",
    "resolution": "2k",
    "output_format": "png"
  },
  "class_type": "WaveSpeedAIPredictor"
}
```

In this example, the Open WebUI prompt mapping would use:

| Field | Key | Node Ids |
|-------|-----|----------|
| Prompt | `prompt` | `4` |

Some WaveSpeedAI workflows use model-specific size values, such as `size`, `resolution`, or `aspect_ratio`, instead of separate `width` and `height` inputs. If the workflow does not expose separate width and height inputs, keep the size fixed in the ComfyUI workflow or map only the exact input key used by that workflow.

### Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| WaveSpeedAI nodes do not appear in ComfyUI | The custom node was not installed or ComfyUI was not restarted | Confirm the repository is in `ComfyUI/custom_nodes/wavespeed-comfyui`, install the requirements, and restart ComfyUI |
| WaveSpeedAI requests fail with an authentication error | Missing or invalid API key | Configure the key in **Settings** > **WaveSpeed**, `config.json`, or `WAVESPEED_API_KEY` |
| Open WebUI cannot connect to ComfyUI | Open WebUI cannot reach the ComfyUI host or port | Start ComfyUI with `--listen 0.0.0.0` and use a reachable URL such as `http://host.docker.internal:8188/` |
| Workflow upload succeeds but generation fails | The uploaded file is not an API workflow, or node mappings do not match the workflow JSON | Export the workflow using **Export (API)** and verify each mapped key and node ID in the JSON |
| Video workflows take a long time | Video generation jobs can require longer processing time than image jobs | Wait for the WaveSpeedAI job to finish and check the ComfyUI logs if the request times out |

For more information, see the [WaveSpeedAI ComfyUI custom node documentation](https://github.com/WaveSpeedAI/wavespeed-comfyui).
