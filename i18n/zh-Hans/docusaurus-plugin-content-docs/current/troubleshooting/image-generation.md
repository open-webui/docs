---
sidebar_position: 100
title: "图片生成"
---

## 图片生成故障排除 {#image-generation-troubleshooting}

### 一般问题 {#general-issues}

- **图片未生成**（请求生成图片后没有得到图片，或聊天中出现错误）：
    - 检查管理员区域的**设置** > **图片**中的**图片**设置。确保“图片生成”（Image Generation）开关已**开启**。
    - 确保消息输入框的 **+** 菜单中的**图片**开关已开启。无论使用哪种函数调用模式，不开启此开关都不会执行任何与图片相关的操作。
    - 确保模型在**工作区** > **模型** > **编辑**中具有**图片生成**能力，并且你的角色具有**图片生成**功能权限。
    - 在管理员区域的**设置** > **图片**中打开连接，检查其 **URL** 和密钥，然后点击 URL 旁的验证图标。
    - 确保连接已启用、已开启**生成**能力，并且**访问控制**包含该用户。不在连接访问列表中的非管理员用户永远看不到其模型。
    - 确保所选模型在后端服务中可用且已加载（例如，检查 ComfyUI 或 Automatic1111 控制台中的活动）。
    - **Azure OpenAI**：如果看到 `[ERROR: azure-openai error: Unknown parameter: 'response_format'.]`，请确保使用 API 版本 `2025-04-01-preview` 或更高版本。

- **连接无法保存**（保存时显示 `URL is required` 等错误）：
    - 填写 **URL**，然后再次保存。
    - **附加参数**或**请求头**中的无效 JSON 会被拒绝，并显示 `Invalid JSON format for Parameters` 或 `Headers must be a valid JSON object`。修正或清空相应内容，然后再次保存。

- **连接缺失**（管理员区域的**设置** > **图片**只显示**图片生成**和**图片编辑**开关）：
    - 只有开启**图片生成**或**图片编辑**后，才会显示**管理图片连接**和**默认模型**。

- **只提供一个图片模型，或使用了错误的模型**：
    - 对于 **Model IDs** 为空的连接，如果 OpenAI 兼容服务器将某些模型标记为图片模型（LiteLLM 会这样做），该连接会提供所有这些图片模型；对于其他服务，则只提供一个默认模型：OpenAI 使用 `gpt-image-2`，AUTOMATIC1111 使用已加载的检查点，ComfyUI 使用工作流中的模型，Gemini 使用 `imagen-3.0-generate-002`。请添加你想提供的模型 ID。
    - **默认模型**用于确定聊天未选择模型时使用哪个模型。用户可从 **+** 菜单中的**图片**条目选择模型。

- **图片位置显示“Image unavailable”**（原图片所在位置出现一个带照片图标的虚线小框）：
    - 浏览器无法从消息中保存的地址加载图片。这适用于聊天中的任何图片，无论是上传的还是生成的。
    - 常见原因是对应文件已被删除，例如通过**设置** > **数据控制** > **管理文件**删除，或随数据目录一起被清除。已删除的文件无法恢复，因此该消息会一直显示此占位符。
    - 占位符不可点击，因此无法为无法显示的图片打开全屏预览。如果消息随后指向另一个图片地址，系统会重新加载图片。
    - 如果你运行多个副本，并且占位符时有时无，请检查 `/app/backend/data` 是否确实在副本之间共享。请参阅[扩展与高可用 → 上传的文件或 RAG 知识无法访问](/troubleshooting/multi-replica#5-uploaded-files-or-rag-knowledge-inaccessible)。

### OpenAI 兼容的图片编辑 {#openai-compatible-image-edits}

- **只有一张输入图片会到达编辑模型。** 在 Open WebUI v0.13.4 中，服务器会以 multipart 表单数据形式将图片列表发送到连接的 `/images/edits` 端点，每个文件对应一个 `image[]` 部分。以字符串形式提供单张图片时，则使用 `image` 字段。
- 测试自定义提供方或代理时，请使用两张小型测试图片，并检查端点收到的字段名和部分数量。将 multipart 解析器配置为收集所有 `image[]` 值。手动上传重复的 `image` 字段所测试的是另一种请求结构。

### ComfyUI 问题 {#comfyui-issues}

- **工作流不兼容 / JSON 错误**（上传工作流后看到 `Invalid JSON format for ComfyUI Workflow.`）：
    - **必须使用 API 格式**：Open WebUI 要求工作流采用 **API 格式**。
    - 在 ComfyUI 中：
        1. 点击“Settings”（齿轮图标）。
        2. 启用“Enable Dev mode Options”。
        3. 点击菜单中的“Save (API Format)”。
    - **不要**使用标准的“Save”按钮或标准 JSON 导出。

- **生成或编辑时显示错误**（工作流在 ComfyUI 内部执行失败）：
    - Open WebUI 服务器日志会以 `ComfyUI <node type> failed: <message>` 的形式指出失败的节点及其错误。请修复工作流中的该节点。

- **图片编辑 / 图片变体失败**（文本生成图片正常，但编辑或图生图静默失败）：
    - 如果使用图片编辑或图片+图片生成，自定义工作流**必须**包含配置为接受输入图片的节点（通常需要有效替换或连接一个 `LoadImage` 节点）。
    - 检查连接是否已上传**编辑工作流**，并已映射**图片**和**提示词**节点，同时**能力**下的**编辑**已开启。

- **ComfyUI 位于私有/内部地址时生成或编辑失败**（例如 `10.x`、`192.168.x`、`172.16–31.x` 或 `localhost`），通常只有工作流运行后才会失败：
    - Open WebUI 会对出站请求应用 SSRF 防护，并且仅当图片 URL 与连接的 **URL** 同源时才信任它们（协议、主机和端口必须严格一致）。
    - 将连接的 **URL** 设置为 ComfyUI 提供图片时使用的**确切**源。如果 ComfyUI 返回的图片 URL 使用不同的主机或端口，这些请求仍会经过 SSRF 验证，并可能被阻止。

### Automatic1111 问题 {#automatic1111-issues}

- **连接被拒绝 /“Api Not Found”**（Automatic1111 正在运行，但 Open WebUI 报告连接错误）：
    - 确保命令行参数中包含 `--api` 标志来运行 Automatic1111。

- **Docker 连接问题**（Open WebUI 无法通过 `localhost` 访问 Automatic1111）：
    - 如果 Open WebUI 在 Docker 中运行，而 Automatic1111 在宿主机上运行：
        - 使用 `http://host.docker.internal:7860` 作为连接的 **URL**。
        - 确保 `host.docker.internal` 可以解析（在 Docker run 命令中通过 `--add-host=host.docker.internal:host-gateway` 添加）。

### 环境变量与配置 {#environment-variables--configuration}

图片连接在管理员区域的**设置** > **图片**中管理。

#### 常规图片生成 {#general-image-generation}

- `ENABLE_IMAGE_GENERATION`：设置为 `true` 以启用图片生成。
- `ENABLE_IMAGE_EDIT`：设置为 `true` 以启用图片编辑。两者均列于[环境变量配置指南](/reference/env-configuration)中。

#### 引擎特定说明 {#engine-specifics}

每个引擎都是其对应类型的一个独立连接，请参阅[图片生成与编辑](/features/chat-conversations/image-generation-and-editing#set-up-a-connection)。
