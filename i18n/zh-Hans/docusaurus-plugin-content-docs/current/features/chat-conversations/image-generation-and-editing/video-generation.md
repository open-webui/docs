---
sidebar_position: 8
title: "生成视频"
description: "开启视频生成，连接 OpenAI、LiteLLM、OpenRouter 或 ComfyUI 等视频服务提供方，让用户在聊天中根据提示词创建视频。"
---

无需离开聊天，即可根据文本提示词或起始图像创建短视频。完成的视频会在对话中播放。视频模型生成每个片段需要数分钟，因此在管理员允许之前，普通用户无法使用视频生成功能。

## 设置视频生成（管理员） {#set-up-video-generation-admin}

1. 打开**设置（Settings）** > **图像与视频（Images & Videos）**（管理员区域），滚动到**视频（Videos）**，开启**视频生成（Video Generation）**。
2. 在**管理视频连接（Manage Video Connections）**下点击 **+** 按钮添加连接，填写信息并保存。
3. 可选：选择一个**默认视频模型（Default Video Model）**。当聊天和模型均未指定视频模型时，将使用该模型。
4. 向用户授予访问权限。在**用户（Users）** > **用户组（Groups）**（或默认权限）中，开启**功能（Features）**下的**视频生成（Video Generation）**权限。该权限默认关闭，请参阅[权限](/features/authentication-access/rbac/permissions)。管理员始终拥有此权限。
5. 对于每个需要创建视频的模型，打开**工作区（Workspace）** > **模型（Models）** > **编辑（Edit）**，然后开启**功能（Features）**下的**视频生成（Video Generation）**，并保持**内置工具（Builtin Tools）**下的**视频生成（Video Generation）**类别处于开启状态。请参阅[模型](/features/workspace/models)。

### 视频连接 {#video-connections}

一个连接对应一个提供视频 API 的服务提供方。支持以下三种类型：

- **OpenAI 兼容**服务器，例如 OpenAI 本身或 LiteLLM。
- **OpenRouter**，提供 Veo、Kling、Seedance 等视频模型。对于 `openrouter.ai` URL，Open WebUI 会自动选择此类型；否则，请在**高级（Advanced）**下将**提供方（Provider）**设为 **OpenRouter**。
- **ComfyUI**，在 ComfyUI 服务器上运行你自己的视频工作流。请参阅 [ComfyUI 视频连接](#comfyui-video-connections)。

| 字段 | 作用 |
| :--- | :--- |
| **URL** 和**身份验证（Auth）** | 服务提供方的基础 URL 和身份验证方式（API 密钥、会话或 OAuth 转发、Entra ID，或不进行身份验证），还可选填额外的**请求头（Headers）**。使用**验证连接（Verify Connection）**测试这些设置。 |
| **模型 ID（Model IDs）** | 用户可选择的视频模型。留空则实时列出服务提供方的视频模型。对于 ComfyUI，留空表示使用工作流加载的模型。 |
| **视频尺寸（Video Size）**和**视频时长（Video Length）** | 随每个请求发送的默认值，例如 `1280x720` 和 `8` 秒。 |
| **API 版本（API Version）** | 发送给服务提供方的 API 版本查询参数。OpenRouter 不使用此字段。 |
| **附加参数（Additional Parameters）** | 随每个请求原样传递给服务提供方的额外 JSON。 |
| **访问控制（Access Control）** | 哪些用户和用户组可以使用此连接中的模型。 |

Open WebUI 最长等待视频生成 15 分钟，并每 5 秒检查一次进度。两者分别可通过 [`VIDEO_GENERATION_TIMEOUT`](/reference/env-configuration#video_generation_timeout) 和 [`VIDEO_GENERATION_POLL_INTERVAL`](/reference/env-configuration#video_generation_poll_interval) 修改。

### ComfyUI 视频连接 {#comfyui-video-connections}

将**连接类型（Connection Type）**选为 **ComfyUI**，即可使用你自己的工作流生成视频，例如 Wan、LTX-Video 或 HunyuanVideo。按照 [ComfyUI](/features/chat-conversations/image-generation-and-editing/comfyui) 中的说明设置 ComfyUI 服务器，并将其地址填入 **URL**。

1. 在 ComfyUI 中，以 **API 格式（API format）**导出你的视频工作流。该工作流必须保存视频，例如使用 **Save Video**、**SaveWEBM** 或 **Video Combine** 节点。
2. 在连接的**视频工作流（Video Workflow）**下，使用**上传（Upload）**（或使用**编辑（Edit）**粘贴工作流）。
3. 映射工作流节点。每行填写输入的**键（Key）**及其所属的**节点 ID（Node Ids）**，具体说明请参阅[将工作流节点映射到 Open WebUI](/features/chat-conversations/image-generation-and-editing/comfyui#mapping-workflow-nodes-to-open-webui)。只有**提示词（Prompt）**为必填项。
4. 保存连接。

每个请求都会填充已映射的节点。未映射的内容保留工作流中保存的值。

| 节点 | 默认键 | 接收的内容 |
| :--- | :--- | :--- |
| **提示词（Prompt）** | `text` | 聊天中的提示词。 |
| **图像（Image）** | `image` | 聊天中附加的图像，用作第一帧。 |
| **宽度（Width）**和**高度（Height）** | `width`、`height` | 视频尺寸。 |
| **长度（Length）** | `length` | 设置**视频时长（Video Length）**时的帧数。 |
| **帧率（Fps）** | `fps` | 设置连接**帧率（Frame Rate）**时的值。 |

长度是帧数，即**视频时长（Video Length）**的秒数乘以帧率。如果设置了连接的**帧率（Frame Rate）**，则使用该值；否则使用工作流中已映射**帧率（Fps）**节点的值；再否则使用 24。将**模型 ID（Model IDs）**留空可使用工作流已经加载的模型。若要从 ComfyUI 服务器上的模型中进行选择，请点击**验证连接（Verify Connection）**，将模型添加到**模型 ID（Model IDs）**，并映射一个**模型（Model）**节点。

## 在聊天中创建视频 {#create-a-video-in-chat}

1. 在消息输入框的 **+** 菜单中开启**视频（Video）**。如果连接提供了多个视频模型，也在此处选择视频模型。
2. 描述视频内容并发送。如需将某张图像用作第一帧，请先附加该图像。
3. 服务提供方完成生成后，视频会显示在回复中。

视频通过内置工具创建，因此聊天模型需要**原生（Native）**[函数调用](/features/extensibility/plugin/tools#tool-calling-modes-default-vs-native)。请保持选中正常的聊天模型，具体说明与[图像](/features/chat-conversations/image-generation-and-editing/usage)相同。

如果 **+** 菜单中没有**视频（Video）**，请检查**设置（Settings）** > **图像与视频（Images & Videos）**中的**视频（Videos）**下是否已开启视频生成、你的角色是否拥有**视频生成（Video Generation）**权限，以及模型是否已开启**视频生成（Video Generation）**功能。
