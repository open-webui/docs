# Image Generation

Open WebUI now supports image generation through the **AUTOMATIC1111** [API](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/API). To set this up, follow these steps:

## Initial Setup

1. Ensure that you have [AUTOMATIC1111](https://github.com/AUTOMATIC1111/stable-diffusion-webui) installed.
2. Launch AUTOMATIC1111 with additional flags to enable API access:
   ```
   ./webui.sh --api --listen
   ```
   For Docker installations of Open WebUI, use the `--listen` flag to allow connections outside of localhost.

## Configuring Open WebUI

1. In Open WebUI, navigate to Settings > Images.
2. In the API URL field, enter the address where AUTOMATIC1111's API is accessible, following this format:
   ```
   http://<your_automatic1111_address>:7860
   ```
   If you're running a Docker installation of Open WebUI and AUTOMATIC1111 on the same host, replace `<your_automatic1111_address>` with `host.docker.internal`.

## Using Image Generation

![Image Generation Tutorial](/img/tutorial_image_generation.png)

1. First, use a text generation model to write a prompt for image generation.
2. After the response has finished, you can click the Picture icon to generate an image.

Please note that, as of now, only AUTOMATIC1111's API is supported for image generation within Open WebUI.
