---
sidebar_position: 1
title: "Usage"
---

Before you can use image generation, you must ensure that the **Image Generation** toggle is enabled in the **Admin Panel** > **Settings** > **Images** menu.

## Using Image Generation

1. Toggle the `Image Generation` switch to on.
2. Enter your image generation prompt.
3. Click `Send`.

![Image Generation Tutorial](/images/tutorial_image_generation_2.png)

## Native Tool-Based Generation (Agentic)

If your model is configured with **Native Function Calling** (see the [**Central Tool Calling Guide**](/features/plugin/tools#tool-calling-modes-default-vs-native)), it can invoke image generation directly as a tool.

### How it works:
- **Requirements**: 
  - **Image Generation** must be enabled globally in **Admin Panel → Settings → Images**
  - The model must have the **Image Generation** capability enabled
- **No Chat Toggle Needed**: With Native Mode, the `generate_image` tool is automatically included when the model has the `image_generation` capability. You don't need to manually toggle it on per chat.
- **Natural Language**: You can simply ask the model: *"Generate an image of a cybernetic forest."*
- **Action**: If **Native Mode** is active and the model has the capability, it will invoke the `generate_image` tool.
- **Display**: The generated image is displayed directly in the chat interface.
- **Editing**: This also supports **Image Editing** (inpainting) via the `edit_image` tool (e.g., *"Make the sky in this image red"*).

This approach allows the model to "reason" about the prompt before generating, or even generate multiple images as part of a complex request.



:::tip

You can also edit the LLM's response and enter your image generation prompt as the message to send off for image generation instead of using the actual response provided by the LLM.


:::

:::info
**Legacy "Generate Image" Button:**
As of Open WebUI v0.7.0, the native "Generate Image" button (which allowed generating an image directly from a message's content) was removed. If you wish to restore this functionality, you can use the community-built **[Generate Image Action](https://openwebui.com/posts/3fadc3ca-c955-4c9e-9582-7438f0911b62)**.
:::

## Restoring the "Generate Image" Button

If you prefer the workflow where you can click a button on any message to generate an image from its content, you can easily restore it:

1. Visit the **[Generate Image Action](https://openwebui.com/posts/3fadc3ca-c955-4c9e-9582-7438f0911b62)** on the Open WebUI Community site.
2. Click **Get** to import it into your local instance (or copy the code and paste it into your local instance).
3. Once imported, go to **Workspace** > **Functions** and ensure the **Generate Image** action is enabled.

This action adds a "Generate Image" icon to the message action bar, allowing you to generate images directly from LLM responses - which is helpful if you want the assistant to first iterate on the image prompt and generate it once you are satisfied.


:::info
**Requirement:** To use **Image Editing** or **Image+Image Generation**, you must have an **Image Generation Model** configured in the Admin Settings that supports these features (e.g., OpenAI DALL-E, or a ComfyUI/Automatic1111 model with appropriate inpainting/img2img capabilities).
:::

## Image Editing (Inpainting)

You can edit an image by providing the image and a text prompt directly in the chat.

1. **Upload an image** to the chat.
2. **Enter a prompt** describing the change you want to make (e.g., "Change the background to a sunset" or "Add a hat").
3. The model will generate a new version of the image based on your prompt.

## Image Compositing (Multi-Image Fusion)

Seamlessly combine multiple images into a single cohesive scene—a process professionally known as **Image Compositing** or **Multi-Image Fusion**. This allows you to merge elements from different sources (e.g., placing a subject from one image into the background of another) while harmonizing lighting, perspective, and style.

1. **Upload images** to the chat (e.g., upload an image of a subject and an image of a background).
2. **Enter a prompt** describing the desired composition (e.g., "Combine these images to show the cat sitting on the park bench, ensuring consistent lighting").
3. The model will generate a new composite image that fuses the elements according to your instructions.
