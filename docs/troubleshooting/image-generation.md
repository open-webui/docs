---
sidebar_position: 100
title: "Image Generation"
---

## 🎨 Image Generation Troubleshooting

### General Issues

- **Image Not Generating**:
    - Check the **Images** settings in the **Admin Panel** > **Settings** > **Images**. Ensure "Image Generation" is toggled **ON**.
    - Verify your **API Key** and **Base URL** (for OpenAI, ComfyUI, Automatic1111) are correct.
    - Ensure the selected model is available and loaded in your backend service (e.g., check the ComfyUI or Automatic1111 console for activity).

### ComfyUI Issues

- **Incompatible Workflow / JSON Errors**:
    - **API Format Required**: Open WebUI requires workflows to be in the **API Format**. 
    - In ComfyUI:
        1. Click the "Settings" (gear icon).
        2. Enable "Enable Dev mode Options".
        3. Click "Save (API Format)" in the menu.
    - **Do not** use the standard "Save" button or standard JSON export.

- **Image Editing / Image Variation Fails**:
    - If you are using Image Editing or Image+Image generation, your custom workflow **must** have nodes configured to accept an input image (usually a `LoadImage` node replaced/linked effectively).
    - Check the default "Image Editing" workflow in the Open WebUI settings for the required node structure to ensure compatibility.

### Automatic1111 Issues

- **Connection Refused / "Api Not Found"**:
    - Ensure you are running Automatic1111 with the `--api` flag enabled in your command line arguments.
    
- **Docker Connectivity**:
    - If Open WebUI is running in Docker and Automatic1111 is on your host machine:
        - Use `http://host.docker.internal:7860` as the Base URL.
        - Ensure `host.docker.internal` is resolvable (added via `--add-host=host.docker.internal:host-gateway` in your Docker run command).

### Environment Variables & Configuration

For advanced configuration, you can set the following environment variables.

#### General Image Generation
- `ENABLE_IMAGE_GENERATION`: Set to `true` to enable image generation.
- `IMAGE_GENERATION_ENGINE`: The engine to use (e.g., `openai`, `comfyui`, `automatic1111`, `gemini`).
- `IMAGE_GENERATION_MODEL`: The model ID to use for generation.
- `IMAGE_SIZE`: Default image size (e.g., `512x512`).

#### Engine Specifics

**OpenAI / Compatible**
- `IMAGES_OPENAI_API_BASE_URL`: Base URL for OpenAI-compatible image generation API.
- `IMAGES_OPENAI_API_KEY`: API Key for the image generation service.

**ComfyUI**
- `COMFYUI_BASE_URL`: Base URL for your ComfyUI instance.
- `COMFYUI_API_KEY`: API Key (if authentication is enabled).
- `COMFYUI_WORKFLOW`: Custom workflow JSON (must be API format).

**Automatic1111**
- `AUTOMATIC1111_BASE_URL`: Base URL for your Automatic1111 instance.
- `AUTOMATIC1111_API_AUTH`: Authentication credentials (username:password).

**Gemini**
- `IMAGES_GEMINI_API_KEY`: API Key for Gemini.
- [View Gemini Configuration Guide](/features/image-generation-and-editing/gemini)

:::tip
For a complete list of environment variables and detailed configuration options, please refer to the [Environment Configuration Guide](/getting-started/env-configuration).
:::
