---
sidebar_position: 6
title: "Usage"
---

Before you can use image generation, you must ensure that the **Image Generation** toggle is enabled in the **Admin Panel** > **Settings** > **Images** menu.

## Using Image Generation

1. Toggle the `Image Generation` switch to on.
2. Enter your image generation prompt.
3. Click `Send`.

![Image Generation Tutorial](/images/tutorial_image_generation_2.png)



:::tip

You can also edit the LLM's response and enter your image generation prompt as the message to send off for image generation instead of using the actual response provided by the LLM.


:::


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
