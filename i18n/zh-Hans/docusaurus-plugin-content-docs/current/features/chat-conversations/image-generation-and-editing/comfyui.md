---
sidebar_position: 3
title: "ComfyUI"
---

:::warning
本教程由社区贡献，不受 Open WebUI 团队支持。它仅演示如何针对你的具体用例定制 Open WebUI。想要贡献内容？请查看贡献教程。
:::

ComfyUI 是一个功能强大、基于节点的模块化 Stable Diffusion 图形界面，让用户能够高度控制图像生成过程。可从其 [GitHub 页面](https://github.com/comfyanonymous/ComfyUI)了解更多信息或下载。

要运行 ComfyUI 并使其可供 Open WebUI 访问，启动时必须使用 `--listen` 参数绑定到 `0.0.0.0`。这样它才能接受来自网络中其他计算机的连接。

运行后，可通过 `http://<your_comfyui_ip>:8188` 访问 ComfyUI 界面。

![ComfyUI 服务器启动命令的屏幕截图，其中突出显示了 --listen 参数。](/images/image-generation-and-editing/comfyui-listen-flag.png)

## 将 ComfyUI 连接到 Open WebUI {#connecting-comfyui-to-open-webui}

由于 Open WebUI 通常运行在 Docker 中，容器必须通过 `host.docker.internal` 访问主机上的 ComfyUI 应用程序。

1. **主机绑定检查：**确保 ComfyUI 使用 `--listen` 参数运行，以绑定到 `0.0.0.0`。
2. **防火墙检查：**如果主机防火墙（UFW）处于活动状态，请确保允许端口 8188（`sudo ufw allow 8188/tcp`）。
3. **Linux 原生 Docker：**如果不使用 Docker Desktop，启动 Open WebUI 容器时，请在 `docker run` 命令中添加 `--add-host=host.docker.internal:host-gateway` 来映射主机网关。

一个 ComfyUI 连接包含一个用于生成图像的工作流和一个用于编辑图像的工作流。在连接的**功能**下，上传生成工作流后即可使用**生成**，上传编辑工作流后即可使用**编辑**。

## 图像提示词生成 {#image-prompt-generation}

此功能使用语言模型，根据你的初始输入自动生成更详细、更具创意的提示词，从而获得更好的图像效果。它仅适用于旧版函数调用；在默认的原生模式下，模型调用工具时会自行编写提示词。

**图像提示词生成**开关位于**设置 > 图像**（管理员区域）的**旧版**部分。

要自定义生成所用的提示词模板，请进入**设置 > 界面**（管理员区域）的**生成**部分。

## 创建图像（图像生成） {#create-image-image-generation}

1. 在 Open WebUI 中，进入**设置** > **图像**（管理员区域）并开启**图像生成**。
2. 添加一个连接，并将**连接类型**设为 **ComfyUI**。
3. 在 **URL** 中输入正在运行的 ComfyUI 实例地址（例如 `http://host.docker.internal:8188/`），然后点击旁边的验证图标。此时应显示成功消息。Open WebUI 还会打开到此地址 `/ws` 的 WebSocket，因此 ComfyUI 前的任何代理都必须传递 WebSocket 升级请求。
4. 如果你的 ComfyUI 实例需要 API 密钥，请在密钥字段中输入。
5. **从 ComfyUI 导出工作流。**在 ComfyUI 界面中，点击左上角的 ComfyUI 徽标，然后点击**设置**。搜索并开启 **“Dev Mode”**选项，其说明为 **“Enable dev mode options (API save, etc.)”**。

    ![ComfyUI 设置的屏幕截图，其中突出显示了“Dev Mode”开关。](/images/image-generation-and-editing/comfyui-dev-mode.png)

    加载你要使用的**图像生成**工作流，然后点击 ComfyUI 徽标，在 **File** 子菜单中点击 **“Export (API)”**按钮，为文件命名并下载。

    ![ComfyUI 文件菜单中“Export (API)”条目的屏幕截图。](/images/image-generation-and-editing/comfyui-save-api-format.png)

6. **上传工作流。**在 Open WebUI 中，点击**生成工作流**部分的**上传**，选择刚下载的 JSON 文件。

7. **映射工作流节点。**导入工作流后，将工作流中的节点 ID 映射到 Open WebUI 中的对应字段。每个参数有两个字段：

    - **键（左侧字段）：**工作流中的输入参数名称（例如 `text`、`ckpt_name`、`seed`）
    - **节点 ID（右侧字段）：**包含此输入的节点 ID，多个 ID 以逗号分隔

    界面显示六个可配置的图像生成参数：

    | 参数 | 默认键 | 必需 | 描述 |
    |-----------|-------------|----------|-------------|
    | 提示词* | `text` | 是 | 正向提示词文本 |
    | 模型 | `ckpt_name` | 否 | 检查点模型名称 |
    | 宽度 | `width` | 否 | 输出图像宽度 |
    | 高度 | `height` | 否 | 输出图像高度 |
    | 步数 | `steps` | 否 | 采样步数 |
    | 种子 | `seed` | 否 | 用于实现可复现性的随机种子 |

    只需填写提示词节点 ID。在 ComfyUI 中点击节点并查看其详情，即可找到节点 ID。

    Open WebUI 会返回工作流的 **Save Image**、**Save Image (Advanced)**、**Save Animated WEBP**、**Save Animated PNG** 和 **Preview Image** 节点中的图像。动画图像在聊天中仍保持动画效果。

    :::info
    你可能需要调整某个`Key`，使其与工作流中的节点匹配。例如，根据工作流结构，默认 `seed` 键可能需要改为 `noise_seed`。
    :::

    :::tip
    某些工作流（例如使用任一 Flux 模型的工作流）的一个条目需要多个节点 ID。请用逗号分隔（例如 `1` 或 `1, 2`）。
    :::

8. 将**模型 ID**留空可使用工作流中设置的模型，也可以添加模型名称以提供这些模型。建议名称来自上次验证：来自映射为“模型”的节点（其第一个名称包含 `_name` 的输入，例如 `ckpt_name` 或 `unet_name`）；如果未映射模型节点，则来自 CheckpointLoaderSimple 检查点，因此映射节点后请再次验证。在**高级**下，**图像大小**和**步数**是可选的默认值。未设置图像大小时，ComfyUI 会收到 512x512。已映射的种子节点会在每次请求时获得新的随机种子。
9. 设置**访问控制**并点击**保存**。未授予访问权限时，只有管理员可以使用此连接。

![在聊天中使用 ComfyUI 生成图像的屏幕截图。](/images/image-generation-and-editing/comfyui-create-image-in-chat.png)

:::info
消息没有“生成图像”按钮。生成直接在聊天中进行：在消息输入框的 **+** 菜单中开启**图像**，然后请求生成图像。有关必须满足的条件，以及可添加此类按钮的社区操作，请参阅[用法](/features/chat-conversations/image-generation-and-editing/usage)。
:::

## 编辑图像 {#edit-image}

Open WebUI 还支持通过 ComfyUI 编辑图像，让你能够修改现有图像。

1. 在**设置** > **图像**（管理员区域）中，开启**图像编辑**。
2. 在同一连接的**编辑工作流**部分，上传一个为图像编辑设计的工作流，导出方式与生成工作流相同。
3. 映射工作流节点。图像编辑有五个参数，其默认值与图像生成不同：

    | 参数 | 默认键 | 必需 | 描述 |
    |-----------|-------------|----------|-------------|
    | 图像* | `image` | 是 | 要编辑的输入图像 |
    | 提示词* | `prompt` | 是 | 编辑提示词文本 |
    | 模型 | `unet_name` | 否 | 扩散模型名称 |
    | 宽度 | `width` | 否 | 输出图像宽度 |
    | 高度 | `height` | 否 | 输出图像高度 |

    对于使用多张输入图像的编辑，在“图像”行中以逗号分隔列出每张图像对应的一个 LoadImage 节点 ID。每张图像按顺序进入一个节点 ID，超出 ID 数量的图像会被丢弃。

    **高级**下的**编辑图像大小**用于设置输出大小。

![在聊天中使用 ComfyUI 编辑图像的屏幕截图。](/images/image-generation-and-editing/comfyui-edit-image-in-chat.png)

### 深入了解：将 ComfyUI 节点映射到 Open WebUI {#deeper-dive-mapping-comfyui-nodes-to-open-webui}

理解节点 ID 映射通常是将 ComfyUI 与 Open WebUI 等外部服务集成时最大的难点。通过 API 集成 ComfyUI，需要将 Open WebUI 的通用控件（例如“模型”、“宽度”、“提示词”）映射到静态 ComfyUI 工作流 JSON 中的特定节点输入。

#### 将工作流节点映射到 Open WebUI {#mapping-workflow-nodes-to-open-webui}

每个工作流下的节点映射可将通用控件映射到静态 ComfyUI 工作流 JSON 中的特定节点输入。每行有两个字段：

| 字段 | 描述 | 示例 |
|-------|-------------|---------|
| **键**（左侧） | 节点 `inputs` 块中的输入参数名称 | `text`、`ckpt_name`、`seed` |
| **节点 ID**（右侧） | 以逗号分隔的目标节点 ID | `6` 或 `1, 2, 3` |

#### 在 ComfyUI 中识别节点 ID 和输入键 {#identifying-node-ids-and-input-keys-in-comfyui}

配置 Open WebUI 之前，必须直接在文本编辑器中检查导出的工作流 JSON 文件。节点 ID 是 ComfyUI 用来在 JSON 结构中标识节点的唯一编号。JSON 对象的顶级键就是节点 ID。

**识别输入键（参数名称）**

键是该节点 JSON 结构中需要更改的确切参数名称（例如 `seed`、`width`、`ckpt_name`）。

1. **检查 JSON**：查看你的 API 工作流 JSON（`workflow_api.json`）。
2. **找到节点 ID**：定位与节点 ID 对应的部分（例如 `"37"`）。
3. **识别键**：在 `"inputs"` 块中，找到要控制的变量。

**示例：CheckpointLoaderSimple 节点（ID 37）**

```json
"37": {
  "inputs": {
      "ckpt_name": "qwen_image_fp8_e4m3fn.safetensors"
  },
  "class_type": "CheckpointLoaderSimple",
  "_meta": {
    "title": "Load Checkpoint"
  }
},
```

**示例：KSampler 节点（ID 3）**

```json
"3": {
  "inputs": {
      "seed": 42,
      "steps": 20,
      "cfg": 8.0,
      "sampler_name": "euler",
      "scheduler": "normal",
      "denoise": 1.0
  },
  "class_type": "KSampler",
  "_meta": {
    "title": "KSampler"
  }
},
```

#### 按任务类型列出的默认键值 {#default-key-values-by-task-type}

**图像生成：**
- 提示词：`text`
- 模型：`ckpt_name`
- 宽度：`width`
- 高度：`height`
- 步数：`steps`
- 种子：`seed`

**图像编辑：**
- 图像：`image`
- 提示词：`prompt`
- 模型：`unet_name`
- 宽度：`width`
- 高度：`height`

#### 示例：映射 KSampler 种子 {#example-mapping-ksampler-seed}

假设你要控制 ID 为 `3` 的 KSampler 节点中的 `seed`。在节点映射的 `seed` 行中：

| 键 | 节点 ID |
|-----|----------|
| `seed` | `3` |

#### 处理多个节点 ID {#handling-multiple-node-ids}

如果多个节点需要相同的值（例如将种子应用于多个采样器），请提供以逗号分隔的 ID：

| 键 | 节点 ID |
|-----|----------|
| `seed` | `3, 15, 22` |

#### 处理复杂/多模态节点（Qwen 示例） {#handling-complexmultimodal-nodes-qwen-example}

对于专用节点，键可能不是简单的文本。

| 参数 | 键 | 节点 ID | 说明 |
|-----------|-----|----------|------|
| **提示词** | `text` 或 `prompt` | `76` | 取决于节点类型（CLIPTextEncode 或 TextEncodeQwen） |
| **模型** | `ckpt_name` | `37` | 用于 CheckpointLoaderSimple |
| **模型** | `unet_name` | 因工作流而异 | 在某些工作流中用于 UNETLoader |
| **图像输入** | `image` | `78` | 此键将文件名传递给 LoadImage 节点 |

#### 排除不匹配错误 {#troubleshooting-mismatch-errors}

如果 ComfyUI 停滞或返回验证错误，请查看日志和 JSON 结构：

| 错误类型 | 原因与调试 | 解决方案 |
|---------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Value not in list: ckpt_name: 'xyz.safetensors'` | 你映射了正确的节点 ID（例如 37），但传入的值（例如 `xyz.safetensors`）不是该节点类型的有效模型名称（例如，误将 VAE 模型发送给检查点加载器）。 | 更正在 Open WebUI 中为图像生成或编辑设置的模型名称，确保模型名称与 ComfyUI 节点期望的模型类型匹配。 |
| `Missing input <key>` | 工作流需要某个输入（例如 `cfg` 或 `sampler_name`），但由于该字段未映射，Open WebUI 没有发送值。 | 在工作流 JSON 中硬编码该值，或将所需的输入键映射到正确的节点 ID。 |

通过仔细匹配节点 ID 和特定键，可确保 Open WebUI 在向 ComfyUI 提交提示词之前，正确覆盖工作流 JSON 中的默认值。

## 配置示例：Qwen 图像生成与编辑 {#example-setup-qwen-image-generation-and-editing}

本节提供有关设置 Qwen 模型以进行图像生成和编辑的补充指南。

### Qwen 图像生成 {#qwen-image-generation}

#### 模型下载 {#model-download}

- **扩散模型**：[qwen_image_fp8_e4m3fn.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/resolve/main/split_files/diffusion_models/qwen_image_fp8_e4m3fn.safetensors)
- **文本编码器**：[qwen_2.5_vl_7b_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/resolve/main/split_files/text_encoders/qwen_2.5_vl_7b_fp8_scaled.safetensors)
- **VAE**：[qwen_image_vae.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/resolve/main/split_files/vae/qwen_image_vae.safetensors)

#### 模型存储位置 {#model-storage-location}

```
ComfyUI/
├── models/
│   ├── diffusion_models/
│   │   └── qwen_image_fp8_e4m3fn.safetensors
│   ├── vae/
│   │   └── qwen_image_vae.safetensors
│   └── text_encoders/
│       └── qwen_2.5_vl_7b_fp8_scaled.safetensors
```

#### Qwen 生成的工作流节点映射 {#workflow-node-mapping-for-qwen-generation}

| 参数 | 键 | 节点 ID |
|-----------|-----|----------|
| 提示词 | `prompt` | （取决于你的工作流） |
| 模型 | `ckpt_name` | （检查点加载器节点 ID） |

### Qwen 图像编辑 {#qwen-image-editing}

#### 模型下载 {#model-download-1}

- **扩散模型**：[qwen_image_edit_fp8_e4m3fn.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image-Edit_ComfyUI/resolve/main/split_files/diffusion_models/qwen_image_edit_fp8_e4m3fn.safetensors)
- **文本编码器**：[qwen_2.5_vl_7b_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/resolve/main/split_files/text_encoders/qwen_2.5_vl_7b_fp8_scaled.safetensors)
- **VAE**：[qwen_image_vae.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/resolve/main/split_files/vae/qwen_image_vae.safetensors)

#### 模型存储位置 {#model-storage-location-1}

```
ComfyUI/
├── models/
│   ├── diffusion_models/
│   │   └── qwen_image_edit_fp8_e4m3fn.safetensors
│   ├── vae/
│   │   └── qwen_image_vae.safetensors
│   └── text_encoders/
│       └── qwen_2.5_vl_7b_fp8_scaled.safetensors
```

#### Qwen 编辑的工作流节点映射 {#workflow-node-mapping-for-qwen-editing}

| 参数 | 键 | 节点 ID |
|-----------|-----|----------|
| 图像 | `image` | （加载图像节点 ID） |
| 提示词 | `prompt` | （文本编码器节点 ID） |
| 模型 | `unet_name` | （UNET 加载器节点 ID） |

## 配置示例：FLUX.1 图像生成 {#example-setup-flux1-image-generation}

本节提供有关设置 FLUX.1 模型以生成图像的补充指南。

### FLUX.1 Dev {#flux1-dev}

#### 模型下载 {#model-download-2}

- **扩散模型**：[flux1-dev.safetensors](https://huggingface.co/black-forest-labs/FLUX.1-dev/resolve/main/flux1-dev.safetensors)
- **文本编码器 1**：[clip_l.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/resolve/main/clip_l.safetensors?download=true)
- **文本编码器 2**：[t5xxl_fp16.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/resolve/main/t5xxl_fp16.safetensors?download=true)（显存大于 32GB 时推荐）
- **VAE**：[ae.safetensors](https://huggingface.co/black-forest-labs/FLUX.1-schnell/resolve/main/ae.safetensors?download=true)

#### 模型存储位置 {#model-storage-location-2}

```
ComfyUI/
├── models/
│   ├── diffusion_models/
│   │   └── flux1-dev.safetensors
│   ├── vae/
│   │   └── ae.safetensors
│   └── text_encoders/
│       ├── clip_l.safetensors
│       └── t5xxl_fp16.safetensors
```

### FLUX.1 Schnell {#flux1-schnell}

#### 模型下载 {#model-download-3}

- **扩散模型**：[flux1-schnell.safetensors](https://huggingface.co/black-forest-labs/FLUX.1-schnell/resolve/main/flux1-schnell.safetensors)
- **文本编码器 1**：[clip_l.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/resolve/main/clip_l.safetensors?download=true)
- **文本编码器 2**：[t5xxl_fp8_e4m3fn.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/resolve/main/t5xxl_fp8_e4m3fn.safetensors?download=true)（显存大于 32GB 时推荐）
- **VAE**：[ae.safetensors](https://huggingface.co/black-forest-labs/FLUX.1-schnell/resolve/main/ae.safetensors?download=true)

#### 模型存储位置 {#model-storage-location-3}

```
ComfyUI/
├── models/
│   ├── diffusion_models/
│   │   └── flux1-schnell.safetensors
│   ├── vae/
│   │   └── ae.safetensors
│   └── text_encoders/
│       ├── clip_l.safetensors
│       └── t5xxl_fp8_e4m3fn.safetensors
```

## 配置 SwarmUI {#configuring-with-swarmui}

SwarmUI 使用 ComfyUI 作为后端。要让 Open WebUI 与 SwarmUI 协同工作，必须在连接的 **URL** 末尾附加 `ComfyBackendDirect`。此外，还需要将 SwarmUI 设置为允许 LAN 访问。完成上述调整后，配置 SwarmUI 与 Open WebUI 协同工作的步骤与前文所述的 ComfyUI 图像生成步骤相同。
![在启用 LAN 访问的情况下安装 SwarmUI](https://github.com/user-attachments/assets/a6567e13-1ced-4743-8d8e-be526207f9f6)

### SwarmUI API URL {#swarmui-api-url}

输入为 **URL** 的地址将如下所示：`http://<your_swarmui_address>:7801/ComfyBackendDirect`
