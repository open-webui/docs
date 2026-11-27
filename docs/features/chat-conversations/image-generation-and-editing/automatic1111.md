---
sidebar_position: 2
title: "AUTOMATIC1111"
---

:::warning
This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.
:::

Open WebUI supports image generation through the **AUTOMATIC1111** [API](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/API). Here are the steps to get started:

### Initial Setup

1. Ensure that you have [AUTOMATIC1111](https://github.com/AUTOMATIC1111/stable-diffusion-webui) installed.
2. Launch AUTOMATIC1111 with additional flags to enable API access:

```python
/webui.sh --api --listen
```

### Setting Up Open WebUI with AUTOMATIC1111

1. In Open WebUI, go to **Settings** > **Images & Videos** (admin section), switch on **Image Generation** and add a connection.
2. Set **Connection Type** to **AUTOMATIC1111**.
3. In **URL**, enter the address where AUTOMATIC1111's API is accessible:

```txt
http://<your_automatic1111_address>:7860/
```

If you run Open WebUI in Docker and AUTOMATIC1111 on the same host, use `http://host.docker.internal:7860/` as the address.

4. If AUTOMATIC1111 requires authentication, choose the **Basic** auth type and enter `username:password`.
5. Leave **Model IDs** empty to use the checkpoint that is loaded, or add checkpoint names to offer them. Picking another listed model switches the loaded checkpoint for everyone using that server.
6. Optionally open **Advanced** to add extra parameters such as `{"cfg_scale": 7, "sampler_name": "Euler a"}`.
7. Click **Access**, choose who may use the connection, and click **Save**. Without a grant, only admins can use the connection.

AUTOMATIC1111 connections handle image generation. For editing, add a ComfyUI or OpenAI compatible connection.
