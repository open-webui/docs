---
sidebar_position: 100
title: "Image Generation"
---

## Image Generation Troubleshooting

### General Issues

- **Image Not Generating** (asking for an image produces no image, or an error appears in the chat):
    - Check the **Images** settings in **Settings** > **Images** (admin section). Ensure "Image Generation" is toggled **ON**.
    - Ensure the **Image** toggle is on in the **+** menu of the message input. Nothing image-related happens without it, in any function calling mode.
    - Ensure the model has the **Image Generation** capability in **Workspace** > **Models** > **Edit**, and that your role has the **Image Generation** feature permission.
    - Open the connection in **Settings** > **Images** (admin section), check its **URL** and key, and click the verify icon next to the URL.
    - Ensure the connection is enabled, has the **Generate** capability on and that **Access Control** includes the user. Non-admin users outside the connection's access list never see its models.
    - Ensure the selected model is available and loaded in your backend service (e.g., check the ComfyUI or Automatic1111 console for activity).
    - **Azure OpenAI**: If you see `[ERROR: azure-openai error: Unknown parameter: 'response_format'.]`, ensure you are using API version `2025-04-01-preview` or later.

- **A connection refuses to save** (saving it shows an error such as `URL is required`):
    - Fill in the **URL**, then save again.
    - Invalid JSON in **Additional Parameters** or **Headers** is refused with `Invalid JSON format for Parameters` or `Headers must be a valid JSON object`. Fix or clear it and save again.

- **Connections are missing** (**Settings** > **Images** (admin section) shows only the **Image Generation** and **Image Edit** switches):
    - **Manage Image Connections** and **Default Models** show while **Image Generation** or **Image Edit** is on.

- **Only one image model is offered, or the wrong one is used**:
    - A connection with empty **Model IDs** offers every image model that an OpenAI compatible server labels as one (LiteLLM does), and a single default model for everything else: `gpt-image-2` on OpenAI, the loaded checkpoint on AUTOMATIC1111, the workflow's model on ComfyUI and `imagen-3.0-generate-002` on Gemini. Add the model IDs you want to offer.
    - **Default Models** sets which model is used when the chat does not pick one. Users pick a model from the **Image** entry in the **+** menu.

- **"Image unavailable" in place of a picture** (a small dashed box with a photo icon where the image used to be):
    - The browser could not load the image from the address stored on the message. This covers any image in a chat, uploaded or generated.
    - The usual cause is that the file behind it is gone, deleted through **Settings** > **Data Controls** > **Manage Files** or wiped along with the data directory. A deleted file cannot be brought back, so the placeholder stays on that message.
    - The placeholder is not clickable, so the full-screen preview does not open on an image that cannot be shown. If the message later points at a different image address, the image is loaded again.
    - If you run more than one replica and the placeholder comes and goes, check that `/app/backend/data` really is shared between them. See [Scaling & HA → Uploaded Files or RAG Knowledge Inaccessible](/troubleshooting/multi-replica#5-uploaded-files-or-rag-knowledge-inaccessible).

### OpenAI-compatible image edits

- **Only one input image reaches the edit model.** On Open WebUI v0.13.4, the server sends an image list to the connection's `/images/edits` endpoint as multipart form data with one `image[]` part per file. A single image supplied as a string uses the `image` field.
- When testing a custom provider or proxy, use two small test images and check the field names and part count at the endpoint. Configure the multipart parser to collect all `image[]` values. A manual test that uploads repeated `image` fields exercises a different request shape.

### ComfyUI Issues

- **Incompatible Workflow / JSON Errors** (you see `Invalid JSON format for ComfyUI Workflow.` after uploading a workflow):
    - **API Format Required**: Open WebUI requires workflows to be in the **API Format**. 
    - In ComfyUI:
        1. Click the "Settings" (gear icon).
        2. Enable "Enable Dev mode Options".
        3. Click "Save (API Format)" in the menu.
    - **Do not** use the standard "Save" button or standard JSON export.

- **Generation or editing shows an error** (the workflow failed inside ComfyUI):
    - The Open WebUI server log names the failed node and its error as `ComfyUI <node type> failed: <message>`. Fix that node in the workflow.

- **Image Editing / Image Variation Fails** (generating from text works, but editing or image-to-image fails silently):
    - If you are using Image Editing or Image+Image generation, your custom workflow **must** have nodes configured to accept an input image (usually a `LoadImage` node replaced/linked effectively).
    - Check that the connection has an **Edit Workflow** uploaded with the **Image** and **Prompt** nodes mapped, and that **Edit** is on under **Capabilities**.

- **Generation/editing fails when ComfyUI is on a private/internal address** (e.g. `10.x`, `192.168.x`, `172.16–31.x`, or `localhost`), often only after the workflow runs:
    - Open WebUI applies SSRF protection to outbound fetches and trusts image URLs only when they are same-origin with the connection's **URL** (a strict scheme + host + port match).
    - Set the connection's **URL** to the **exact** origin ComfyUI serves images from. If ComfyUI returns image URLs on a different host or port, those fetches are still SSRF-validated and may be blocked.

### Automatic1111 Issues

- **Connection Refused / "Api Not Found"** (Automatic1111 is running, but Open WebUI reports connection errors):
    - Ensure you are running Automatic1111 with the `--api` flag enabled in your command line arguments.
    
- **Docker Connectivity** (Open WebUI can't reach Automatic1111 on `localhost`):
    - If Open WebUI is running in Docker and Automatic1111 is on your host machine:
        - Use `http://host.docker.internal:7860` as the connection's **URL**.
        - Ensure `host.docker.internal` is resolvable (added via `--add-host=host.docker.internal:host-gateway` in your Docker run command).

### Environment Variables & Configuration

The image connections are managed in **Settings** > **Images** (admin section).

#### General Image Generation

- `ENABLE_IMAGE_GENERATION`: Set to `true` to enable image generation.
- `ENABLE_IMAGE_EDIT`: Set to `true` to enable image editing. Both are listed in the [Environment Configuration Guide](/reference/env-configuration).

#### Engine Specifics

Each engine is a connection of its own type, see [Image Generation and Editing](/features/chat-conversations/image-generation-and-editing#set-up-a-connection).
