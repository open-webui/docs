---
sidebar_position: 8
title: "Generate Videos"
description: "Turn on video generation, connect a video provider such as OpenAI, LiteLLM, OpenRouter or ComfyUI, and let users create videos from a prompt in chat."
---

Create short videos from a text prompt, or from a starting image, without leaving the chat. The finished video plays in the conversation. Video models take minutes per clip, so video generation is off for regular users until an administrator allows it.

## Set up video generation (admin)

1. Open **Settings** > **Images** (admin section), find the **Videos** section and switch **Video Generation** on.
2. Add a connection with the **+** button under **Manage Video Connections**, fill it in and save.
3. Optionally pick a **Default Video Model**. It is used when neither the chat nor the model picks one.
4. Give people access. In **Users** > **Groups** (or the default permissions), turn on the **Video Generation** permission under **Features**. It is off by default, see [Permissions](/features/authentication-access/rbac/permissions). Admins always have it.
5. On each model that should create videos, open **Workspace** > **Models** > **Edit**, then switch on **Video Generation** under **Features** and keep the **Video Generation** category on under **Builtin Tools**. See [Models](/features/workspace/models).

### Video connections

A connection is one provider with a video API. Three kinds work:

- **OpenAI compatible** servers, such as OpenAI itself or LiteLLM.
- **OpenRouter**, which offers Veo, Kling, Seedance and other video models. Open WebUI picks this automatically for `openrouter.ai` URLs; otherwise set **Provider** to **OpenRouter** under **Advanced**.
- **ComfyUI**, which runs a video workflow of your own on a ComfyUI server. See [ComfyUI video connections](#comfyui-video-connections).

| Field | What it does |
| :--- | :--- |
| **URL** and **Auth** | The provider's base URL and how to authenticate (API key, session or OAuth forwarding, Entra ID or none), with optional extra **Headers**. Use **Verify Connection** to test them. |
| **Model IDs** | The video models users can pick. Leave it empty to list the provider's video models live. With ComfyUI, empty means the model the workflow loads. |
| **Video Size** and **Video Length** | Defaults sent with each request, for example `1280x720` and `8` seconds. |
| **API Version** | An API version query for the provider. Not used with OpenRouter. |
| **Additional Parameters** | Extra JSON passed through to the provider with every request. |
| **Access Control** | Which users and groups may use the models of this connection. |

Open WebUI waits up to 15 minutes for a video and checks its progress every 5 seconds. Both can be changed with [`VIDEO_GENERATION_TIMEOUT`](/reference/env-configuration#video_generation_timeout) and [`VIDEO_GENERATION_POLL_INTERVAL`](/reference/env-configuration#video_generation_poll_interval).

### ComfyUI video connections

Choose **ComfyUI** as the **Connection Type** to generate videos with your own workflow, for example Wan, LTX-Video or HunyuanVideo. Set up the ComfyUI server as described in [ComfyUI](/features/chat-conversations/image-generation-and-editing/comfyui) and enter its address as the **URL**.

1. In ComfyUI, export your video workflow in **API format**. The workflow must save a video, for example with a **Save Video**, **SaveWEBM** or **Video Combine** node.
2. In the connection, use **Upload** (or **Edit** to paste it) under **Video Workflow**.
3. Map the workflow's nodes. Each row takes the input **Key** and the **Node Ids** it belongs to, as explained in [Mapping Workflow Nodes to Open WebUI](/features/chat-conversations/image-generation-and-editing/comfyui#mapping-workflow-nodes-to-open-webui). Only **Prompt** is required.
4. Save the connection.

Each request fills the mapped nodes. Anything you leave unmapped keeps the value saved in the workflow.

| Node | Default key | Receives |
| :--- | :--- | :--- |
| **Prompt** | `text` | The prompt from the chat. |
| **Image** | `image` | The image attached in the chat, as the first frame. |
| **Width** and **Height** | `width`, `height` | The video size. |
| **Length** | `length` | The number of frames, when **Video Length** is set. |
| **Fps** | `fps` | The **Frame Rate** of the connection, when you set one. |

Length is a frame count, the seconds of **Video Length** times the frame rate. The frame rate is the **Frame Rate** of the connection if you set one, else the value of the workflow's mapped **Fps** node, else 24. Leave **Model IDs** empty to use the model the workflow already loads. To pick from the models on the ComfyUI server, click **Verify Connection**, add the models to **Model IDs** and map a **Model** node.

## Create a video in chat

1. Switch **Video** on in the **+** menu of the message input. Pick the video model there too if the connections offer several.
2. Describe the video and send. Attach an image first to use it as the first frame.
3. The video appears in the reply when the provider has finished it.

Videos are created through a built-in tool, so the chat model needs **Native** [function calling](/features/extensibility/plugin/tools#tool-calling-modes-default-vs-native). Keep your normal chat model selected, as described for [images](/features/chat-conversations/image-generation-and-editing/usage).

If **Video** is missing from the **+** menu, check that video generation is on in **Settings** > **Images** (admin section), that your role has the **Video Generation** permission and that the model has the **Video Generation** feature on.
