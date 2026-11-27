---
sidebar_position: 400
title: "API 端点"
---

本指南提供有效调用 API 端点所需的基本信息，帮助你使用我们的模型实现顺畅集成和自动化。请注意，这是一项实验性设置，未来可能会更新以增强功能。

:::note 端点不再提供文档
API 经常变化，为其编写文档意义不大。要查找最新端点和规范，请将 AI Agent 指向 Open WebUI 后端，让它读取相关代码。以下端点保留供参考。
:::

## 身份验证 {#authentication}

为确保 API 访问安全，必须进行身份验证。你可以使用 Bearer Token 机制对 API 请求进行身份验证。从 Open WebUI 的 **Settings > Account** 获取 API 密钥，也可以使用 JWT（JSON Web Token）进行身份验证。有关启用和生成 API 密钥的完整说明（包括管理员开关和非管理员用户所需的组权限），请参阅 [API 密钥](/features/authentication-access/api-keys)。

:::tip 使用反向代理时的备用凭据请求头
当 Open WebUI 位于已将 `Authorization` 请求头用于自身身份验证的反向代理之后时，可以改为通过自定义请求头传递 API 密钥（默认为 `x-api-key`）。管理员可以通过 [`CUSTOM_API_KEY_HEADER`](/reference/env-configuration#custom_api_key_header) 环境变量重命名该请求头，以避免冲突。完整配置方式请参阅[反向代理会消耗 `Authorization` 请求头？](/features/authentication-access/api-keys#behind-a-reverse-proxy-that-consumes-authorization)。
:::

## Swagger 文档链接 {#swagger-documentation-links}

后端以 `ENV=dev` 启动时，Open WebUI 会在 `/docs` 提供 Swagger UI，并在 `/openapi.json` 提供机器可读的 OpenAPI 架构。未设置 `ENV` 时，后端默认使用 `dev`，但 Docker 镜像会设置 `ENV=prod`，从而禁用这两个路由。

如果本地 Docker 测试实例无法访问这些 URL，请在容器环境中设置 `ENV=dev` 并重新创建容器。使用访问 Open WebUI 时所用的同一主机和端口。生产部署请保持 `ENV=prod`。

## 主要 API 端点 {#notable-api-endpoints}

### 获取所有模型 {#retrieve-all-models}

- **端点**：`GET /api/models`
- **说明**：获取通过 Open WebUI 创建或添加的所有模型。
- **示例**：

  ```bash
  curl -H "Authorization: Bearer YOUR_API_KEY" http://localhost:3000/api/models
  ```

**隐藏模型仍会列出。**在 **Admin Panel > Settings > Models** 或 **Workspace > Models** 中使用 **Hide** 隐藏模型，只会将 `info.meta.hidden` 设置为 `true`。聊天模型选择器不会显示这些模型，但 `GET /api/models` 仍会向每个具有访问权限的调用方返回它们，`/api/chat/completions` 也仍会响应针对它们的请求。若要阻止 API 用户使用某个模型，请改为移除其访问权限。需要跳过隐藏模型的脚本可以丢弃 `info.meta.hidden` 为 `true` 的条目。

### 以编程方式管理模型（导出 / 导入 / 同步） {#programmatic-model-management-export--import--sync}

自定义模型采用纯 JSON 格式，因此无需使用 UI，即可通过声明式方式管理它们（使用 git、脚本或 AI Agent）。这些端点位于 `/api/v1/models` 下：

| 端点 | 说明 |
| :--- | :--- |
| `GET /api/v1/models/all` | **（管理员）**在一个未分页列表中返回每条已保存的模型记录，包括当前没有任何连接提供的模型。为管理员模型页面提供数据。 |
| `GET /api/v1/models/export` | 将**所有**自定义模型导出为 JSON 数组，或通过重复的 `ids` 查询参数（`?ids=a&ids=b`）导出指定模型。请求导出你无权写入的模型时会返回 `403`，而不是悄悄将其省略。 |
| `POST /api/v1/models/import` | 批量**插入或更新**：创建新模型并更新现有模型（按 `id` 匹配）。只增不删。 |
| `POST /api/v1/models/sync` | **（管理员）**声明式**协调**：使实例与发送的列表完全一致，创建、更新并**删除**负载中未包含的任何模型。 |
| `POST /api/v1/models/create` | 创建单个模型。 |
| `POST /api/v1/models/model/update` | 更新单个模型。 |
| `POST /api/v1/models/model/delete` | 按 ID 删除已保存的自定义模型。 |

**批量操作。**`sync` 仅限管理员使用。非管理员执行 `import` 需要 `workspace.models_import` 权限，执行 `export` 需要 `workspace.models_export` 权限。`import` 和 `sync` 的请求体均采用 `{"models": [ ... ]}` 形式，其中数组正是 `export` 返回的内容。

**删除自定义模型。**发送一个 JSON 请求体，其中已保存自定义模型的 ID 为字符串。管理员、模型所有者或对模型具有写权限的用户可以删除它。成功时，响应体为 JSON 布尔值 `true`。

```bash
curl -X POST https://open-webui.example.com/api/v1/models/model/delete \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"id": "my-custom-model"}'
```

**背景图像以数据形式传输。**模型背景作为文件存储在实例上，因此 `export` 会读取该文件，并以 `background_image_data` 字段将其放入记录中，格式为 `data:image/...;base64,...` URI，同时将 `meta.background_image_url` 保留为 null。`import` 执行反向操作：解码数据 URI，将其作为文件重新上传到目标实例，再将新的文件 URL 写回 `meta`。这使导出的模型可以在实例之间移植。编写脚本时需要注意两个结果：如果导出的模型背景文件已丢失，整个请求会因 `400` 失败；如果图像超出限制（5 MiB、2500 万像素、PNG/JPEG/WebP/GIF），导入时会被拒绝。

**语音头像以引用形式传输。**[语音头像](/features/chat-conversations/chat-features/voice-mode#voice-avatars)及其动画仍以文件形式保留在源实例上，导出内容仅携带其文件 ID。如果目标实例上的头像或动画文件缺失或无法访问，导入或同步模型会失败并返回 `403`（`Avatar or animation file is not accessible. Upload it again.`）。请先在目标实例上上传头像。

**版本控制、代码驱动的工作流：**

```bash
# 1. 将当前在线模型快照保存到可提交至 git 的文件
curl -H "Authorization: Bearer YOUR_API_KEY" \
  http://localhost:3000/api/v1/models/export > models.json

# 2. 使用脚本或 Agent 编辑或生成 models.json 并提交，然后
#    协调实例，使其与文件完全一致（创建、更新、清理）
curl -X POST -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"models\": $(cat models.json)}" \
  http://localhost:3000/api/v1/models/sync
```

这样可以得到可复现且受版本控制的模型定义。对于只新增或更新、从不删除现有模型的操作，请使用 `/import` 而不是 `/sync`。在部署、CI 或容器启动时运行同步步骤，即可自动加载模型。

### 聊天补全 {#chat-completions}

- **端点**：`POST /api/chat/completions`
- **说明**：作为 OpenAI API 兼容的聊天补全端点，服务于 Open WebUI 上的模型，包括 Ollama 模型、OpenAI 模型和 Open WebUI Function 模型。Responses API 连接上的模型也会以 Chat Completions 格式响应（流式或非流式）；当回复被截断时，`finish_reason` 会设置为 `length` 或 `content_filter`。

**连接 OpenAI 兼容聊天客户端。**如果客户端会将 `/models` 和 `/chat/completions` 追加到其基础 URL，请将基础 URL 设置为你的 Open WebUI URL 加 `/api/v1`，例如 `http://localhost:3000/api/v1`。使用 **Settings > Account > API keys > Secrets > Show** 中的密钥，并从 `GET /api/v1/models` 的响应中复制模型 ID。API 密钥默认禁用。管理员必须启用 **API Keys**，非管理员账户还需要 **API Keys** 功能权限。设置方法请参阅 [API 密钥](/features/authentication-access/api-keys)。

如果在 **Settings > Authentication**（管理员区域）下启用了 **API Key Endpoint Restrictions**，对于同时调用这两个端点的客户端，请将 `/api/v1/models` 和 `/api/v1/chat/completions` 都加入 **Allowed Endpoints**。检查使用客户端实际调用的路径，因此仅有 `/api/chat/completions` 条目并不能涵盖其别名 `/api/v1/chat/completions`。

**使用此端点调用工作区模型。**只有 `/api/chat/completions`（及其别名 `/api/v1/chat/completions`）会应用工作区模型设置。对于普通 API 调用，它会应用基础模型、系统提示词、参数和过滤器，但不会应用模型的工具、知识或默认功能；这些需要额外字段，详见表格下方。`/openai` 下的代理路由会跳过更多内容：

| 路由 | 工作区模型处理方式 |
| :--- | :--- |
| `POST /api/chat/completions` | 应用基础模型、系统提示词、参数和过滤器。仅当请求明确要求时，才应用工具、知识和默认功能。 |
| `POST /openai/chat/completions` | 替换为基础模型，并应用工作区模型的系统提示词和参数。不运行知识、工具和过滤器。 |
| `POST /openai/responses` | 不应用任何设置。你发送的 `model` 会原样转发给服务提供方；如果工作区模型 ID 没有任何连接提供，它会转到第一个 OpenAI 连接，而该连接通常会拒绝它。 |

要使用 `/openai/responses`，请发送服务提供方自己的模型 ID。在两条 `/openai` 路由上，非管理员请求没有已保存模型记录的模型时，会收到 `403` 和 `Model not found`，除非启用了 [`BYPASS_MODEL_ACCESS_CONTROL`](/reference/env-configuration#bypass_model_access_control)。

**普通 API 调用不会包含的内容。**Web UI 在构建请求时会自行填入部分模型设置，因此 API 调用方必须自行发送：

- **工具。**模型编辑器中 **Tools** 下选择的工具由 Web UI 而不是服务器添加到请求中。请在 `tool_ids` 中发送其 ID。`GET /api/v1/models/model?id=<model-id>` 会将它们列在 `meta.toolIds` 下。
- **默认功能。**在 **Default Features** 下选择的功能仅由 Web UI 启用。请自行在 `features` 中发送。
- **知识和网页搜索。**除非请求发送 `params.function_calling`，或者模型的 **Function Calling** 参数（或 **Model Defaults** 下的参数）设置为 `legacy`，否则函数调用以原生模式运行。在原生模式下，只有携带 `session_id` 的请求才能使用内置工具，包括知识搜索和网页搜索。未提供时，不会搜索模型的 **Knowledge**，`features.web_search` 和 `features.image_generation` 也不起作用。发送 `"params": {"function_calling": "legacy"}` 后，Open WebUI 会在模型回答之前搜索模型知识，并执行 `features` 请求的网页搜索或图像生成。若要保持原生模式并使用内置工具，请参阅[服务器端工具调用（API）](/reference/server-side-tool-calling)。无论采用哪种方式，都会搜索你在 `files` 中列出的文件和知识库，除非模型关闭了 **Preload files**（请参阅[在聊天补全中使用知识集合](#using-a-knowledge-collection-in-chat-completions)）。
- **过滤器。**全局过滤器和附加到模型的过滤器会运行。带开关的过滤器仅在其 ID 包含于 `filter_ids` 时运行，而标记为 **Start enabled in new chats** 的过滤器仅由 Web UI 发送。`filter_ids` 不能添加既非全局、也未附加到模型的过滤器。

:::warning 从使用过工具的回复中读取 `usage`

一次回复可能涉及多次模型调用，每轮工具使用对应一次调用。`input_tokens`、`output_tokens`、`total_tokens` 和 `cost` 会累加所有调用。`prompt_tokens` 和 `completion_tokens` 仅保存最近一次调用的值，上下文压缩读取的也是这两个值。

:::

**请求中的参数会被保留。**工作区模型带有自己的高级参数，管理员也可以在 **Settings > Models**（管理员区域）的 **Model Defaults** 下设置实例范围的参数。两者只填充请求中未提供的值，因此 `temperature`、`max_tokens`、`top_p`、`seed`、`stop`、`reasoning_effort`、`response_format`、`logit_bias`，以及 Ollama 模型的 `options` 对象，都会保留你发送的值。对于 Ollama 模型，`max_tokens` 会以 `num_predict` 传递给 Ollama。与之前一样，省略某项时会应用模型保存的值。例外是 **Stream Chat Response**，无论请求携带什么 `stream` 值，它仍决定回复是否采用流式传输。下方的 [Anthropic Messages API](#anthropic-messages-api) 也通过此端点运行，因此同样适用这些规则，SDK 的 `max_tokens` 会原样传递给服务提供方。

**模型控件。**具有[模型控件](/features/workspace/models#model-controls)的模型也会将每个控件的默认选项应用于 API 请求，这些参数同样只填充请求中未提供的值。要选择其他选项，请在 `params.model_controls` 下按模型 ID 发送控件和选项 ID。`GET /api/models` 会在 `info.params.model_controls` 下列出模型控件，包括每个控件的 ID、标签、默认值，以及其选项的 ID 和标签：

```json
{
  "model": "gpt-5",
  "messages": [{ "role": "user", "content": "Plan a three-day trip to Lisbon." }],
  "params": { "model_controls": { "gpt-5": { "thinking": "high" } } }
}
```

任何有权访问模型的调用方都可以选择选项，无论其 **Allow Chat Controls** 和 **Allow Chat Params** [权限](/features/authentication-access/rbac/permissions#3-chat-permissions)如何设置。为模型已不再具有的控件选择选项会被忽略；选择控件已不再具有的选项则返回 `400`。

**如何获得 `usage` 块。**大多数 OpenAI 兼容服务提供方不会主动在流式回复中包含用量信息，除非收到明确请求。模型启用 **Usage** 能力时，Open WebUI 会自行添加 `stream_options: {"include_usage": true}`，因此你无需发送它。非流式请求保持不变；你发送的 `stream_options` 会保留其他键，但 `include_usage` 会被强制设为 `true`，因此启用该能力后，无法按请求关闭用量信息。

**服务提供方错误。**当模型服务提供方拒绝请求时，端点会返回服务提供方自己的状态码和错误，例如达到其速率限制时返回 `429`，并透传其 `Retry-After` 和 `retry-after-ms` 请求头，以便客户端退避。OpenAI、Ollama 和 Anthropic 代理路由也会转发这些重试请求头。

#### 通过 API 使用 Open WebUI 工具（包括 MCP） {#using-open-webui-tools-including-mcp-from-the-api}

在请求体中传递 Open WebUI 工具 ID 时，聊天补全端点可以运行服务器端工具。这包括已在 Open WebUI 中配置并启用的原生 Python 工具、OpenAPI 工具服务器和 MCP 工具服务器。

1. 先在 Open WebUI 中配置工具服务器。MCP 的配置请参阅[模型上下文协议（MCP）](/features/extensibility/mcp)。
2. 从工具列表端点，或在聊天中启用工具时从浏览器网络请求中获取工具 ID。MCP 工具服务器 ID 采用 `server:mcp:<server-id>` 形式。
3. 调用 `/api/chat/completions` 时，在 `tool_ids` 中包含该 ID：

```bash
curl -X POST http://localhost:3000/api/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen3.6:27b",
    "messages": [
      {"role": "user", "content": "Use the configured MCP tool if it helps."}
    ],
    "tool_ids": ["server:mcp:YOUR_MCP_SERVER_ID"]
  }'
```

Open WebUI 在解析工具之前，会检查调用方对每个所选工具服务器的访问权限。对于受 OAuth 保护的 MCP 服务器，与 API 密钥关联的用户必须已在 Web UI 中完成 OAuth 授权流程，否则工具连接可能在 API 请求期间失败。

如果外部客户端发送自己的 OpenAI 风格 `tools` 数组，Open WebUI 会将这些由调用方提供的工具定义转发给模型，而不会在服务器端解析 `tool_ids`。

要查看 MCP 连接提供哪些工具，请使用 `server:mcp:<server-id>` ID 调用 `GET /api/v1/tools/id/{id}/specs`。该端点会连接服务器并返回 `{"specs": [{"name": ..., "description": ...}]}`。使用任何其他 ID，或请求你无法访问的服务器，会返回 `404`。尚未登录的 OAuth 服务器返回 `401`，15 秒内未响应的服务器返回 `504`，任何其他失败返回 `502`。

:::tip 希望模型通过循环实际运行这些工具，并同时使用内置工具？
发送哪些字段决定了 Open WebUI 会替你执行工具调用，还是将调用交还客户端运行，也决定答案通过 HTTP 响应体还是聊天记录返回。[服务器端工具调用（API）](/reference/server-side-tool-calling)逐步介绍了两种方法的所有调用，涵盖流式和非流式、保存和不保存聊天，最后提供一个可复用脚本。
:::

- **Curl 示例**：

  ```bash
  curl -X POST http://localhost:3000/api/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "model": "qwen3.6:27b",
        "messages": [
          {
            "role": "user",
            "content": "Why is the sky blue?"
          }
        ]
      }'
  ```

- **Python 示例**：

  ```python
  import requests

  def chat_with_model(token):
      url = 'http://localhost:3000/api/chat/completions'
      headers = {
          'Authorization': f'Bearer {token}',
          'Content-Type': 'application/json'
      }
      data = {
        "model": "granite3.1-dense:8b",
        "messages": [
          {
            "role": "user",
            "content": "Why is the sky blue?"
          }
        ]
      }
      response = requests.post(url, headers=headers, json=data)
      return response.json()
  ```

### Anthropic Messages API {#anthropic-messages-api}

Open WebUI 提供与 Anthropic Messages API 兼容的端点。这使为 Anthropic API 构建的工具、SDK 和应用程序可以直接调用 Open WebUI，并通过所有已配置的模型、过滤器和管道路由请求。

在内部，端点会将 Anthropic 请求格式转换为 OpenAI Chat Completions 格式，通过现有聊天补全管道进行路由，再将响应转换回 Anthropic 格式。支持流式和非流式请求。

:::info 原生 Anthropic 连接会跳过转换

当目标连接本身已使用 Anthropic Messages API 时，请求会原样转发，而不会先转换为 OpenAI 格式再转换回来。转换过程中不会丢失任何内容，因此服务提供方特有的字段无需 `passthrough_params` 即可在往返过程中保留。

当连接的基础 URL 是 Anthropic URL，或连接设置中 **Advanced** 下的 **Provider** 设置为 **LiteLLM** 时，会应用此行为，因为 LiteLLM 自身提供 Anthropic 兼容路由。转发的请求会直接发送到服务提供方，因此不会对其运行过滤器、工具和知识。其他所有连接仍保持上述转换行为；下拉列表中的其余选项请参阅 [Provider 设置](/getting-started/quick-start/connect-a-provider/starting-with-openai-compatible#the-provider-setting)。

:::

- **端点**：`POST /api/message`、`POST /api/v1/messages`
- **身份验证**：同时支持 `Authorization: Bearer YOUR_API_KEY` 和 Anthropic 的 `x-api-key: YOUR_API_KEY` 请求头
- **扩展思考**：底层模型的推理输出会作为 Anthropic `thinking` 内容块返回，流式和非流式响应均支持。
- **推理强度**：`reasoning_effort` 和 `output_config.effort` 会映射到底层模型的推理强度设置。
- **结构化输出**：`output_config.format`（`json_schema` 或 `json_object`）会映射到模型的响应格式设置。
- **传递额外参数**：标准转换之外的参数默认会被丢弃。在连接上设置 **Passthrough params**（`passthrough_params`，参数名称的逗号分隔列表，或表示每个非标准参数的 `*`），即可将这些参数原样转发给上游服务提供方。

- **Curl 示例**（非流式）：

  ```bash
  curl -X POST http://localhost:3000/api/v1/messages \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "model": "gpt-5.6-sol",
        "max_tokens": 1024,
        "messages": [
          {
            "role": "user",
            "content": "Why is the sky blue?"
          }
        ]
      }'
  ```

- **Curl 示例**（流式）：

  ```bash
  curl -X POST http://localhost:3000/api/v1/messages \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "model": "gpt-5.6-sol",
        "max_tokens": 1024,
        "stream": true,
        "messages": [
          {
            "role": "user",
            "content": "Why is the sky blue?"
          }
        ]
      }'
  ```

- **Python 示例**（使用 Anthropic SDK）：

  ```python
  from anthropic import Anthropic

  client = Anthropic(
      api_key="YOUR_OPEN_WEBUI_API_KEY",
      base_url="http://localhost:3000/api",
  )

  message = client.messages.create(
      model="gpt-5.6-sol",
      max_tokens=1024,
      messages=[
          {"role": "user", "content": "Why is the sky blue?"}
      ],
  )
  print(message.content[0].text)
  ```

  :::warning
  `base_url` 必须为 `http://localhost:3000/api`（不是 `/api/v1`）。Anthropic SDK 会自动将 `/v1/messages` 追加到基础 URL。
  :::

- **Claude Code 配置**：

  要将 [Claude Code](https://docs.anthropic.com/en/docs/claude-code) 与作为代理的 Open WebUI 一起使用，请将其配置为指向你的 Open WebUI 实例：

  ```bash
  # 为 Claude Code 设置环境变量
  export ANTHROPIC_BASE_URL="http://localhost:3000/api"
  export ANTHROPIC_API_KEY="YOUR_OPEN_WEBUI_API_KEY"

  # 然后照常运行 Claude Code
  claude
  ```

  也可以创建或编辑 `~/.claude/settings.json`：

  ```json
  {
    "env": {
      "ANTHROPIC_BASE_URL": "http://localhost:3000/api",
      "ANTHROPIC_AUTH_TOKEN": "YOUR_OPEN_WEBUI_API_KEY"
    }
  }
  ```

  这会让所有 Claude Code 请求经过 Open WebUI 的身份验证和访问控制层，从而可以通过 Claude Code 界面使用任何已配置的模型（包括通过 Ollama 或 vLLM 提供的本地模型）。

:::info
通过此端点可以访问 Open WebUI 中配置的所有模型，包括 Ollama 模型、OpenAI 模型和任何自定义 Function 模型。`model` 字段应使用模型在 Open WebUI 中显示的模型 ID。过滤器（inlet/stream）会像在 OpenAI 兼容端点上一样应用于这些请求。

**工具使用：**Anthropic Messages 端点支持工具使用（`tools` 和 `tool_choice` 参数）。在流式和非流式响应中，上游模型的工具调用都会转换为 Anthropic 格式的 `tool_use` 内容块。

**用量报告：**响应会携带上游模型报告的用量；流式响应将其放在结束的 `message_delta` 中，非流式响应则放在 `usage` 中。服务提供方发送的提示词缓存计数器（`cache_creation_input_tokens`、`cache_read_input_tokens`）、`output_tokens_details`、`server_tool_use` 和 `service_tier` 会被透传，因此跟踪缓存命中或推理 token 的客户端可以看到实际数值，而不会在转换中丢失。如果 OpenAI 风格的服务提供方通过 `prompt_tokens_details.cached_tokens` 报告缓存 token，这些值会映射到 `cache_read_input_tokens`；`input_tokens` 也会按 Anthropic 客户端预期的方式报告：只计算未缓存的提示词 token，缓存创建和缓存读取分别计数，不会再次计入。在流式请求中，仅在实际已知时报告 `input_tokens`；如果服务提供方从不报告该值，则会省略该字段，而不是显示虚构的零。

只有模型在其编辑器中启用了 **Usage** 能力时，才会向上游服务提供方请求用量。未启用时，不会要求服务提供方在流中包含用量，客户端收到的 token 计数会回退到 Open WebUI 自行确定的值。
:::

#### 计算 Token 数量 {#counting-tokens}

这是 Messages API 的配套端点，用于报告请求将使用多少输入 token，而不实际运行请求。它与 Anthropic 自己的 token 计数端点一致，因此，为预算或上下文容量检查而预先计算请求的 SDK 无需更改即可使用。

- **端点**：`POST /api/v1/messages/count_tokens`、`POST /api/message/count_tokens`
- **身份验证**：与 Messages API 相同
- **返回值**：`{"input_tokens": <int>}`

```bash
curl -X POST http://localhost:3000/api/v1/messages/count_tokens \
-H "x-api-key: YOUR_API_KEY" \
-H "Content-Type: application/json" \
-d '{
      "model": "gpt-5.6-sol",
      "messages": [
        {
          "role": "user",
          "content": "Why is the sky blue?"
        }
      ]
    }'
```

计数由解析后的连接背后的上游服务提供方获取，因此该服务提供方必须实现 token 计数。如果它不支持计数或返回意外响应，请求会失败并返回 `502`。

:::info 现在报告的 `input_tokens` 是真实值
Messages API 过去总是在流式 `message_start` 块中报告 `input_tokens: 0`。现在会预先计算输入 token，并在流式和非流式响应中报告。如果计数失败，请求仍会成功，因此客户端应将该值视为尽力提供的结果，而不是有保证的准确值。
:::

### 语音转文字转录 {#speech-to-text-transcription}

将录制的音频发送到 `POST /api/v1/audio/transcriptions`，使用 Bearer 身份验证和 `multipart/form-data` 请求体。在必需的 `file` 字段中包含录音。可选的 `language` 字段为使用该信息的转录引擎提供语言提示。非管理员调用方需要语音转文字权限（`chat.stt`）。端点会将原始上传文件保存在服务器上。请参阅[服务器端录音存储](/features/chat-conversations/audio/speech-to-text/stt-config#server-side-recording-storage)。

```bash
curl https://open-webui.example.com/api/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPEN_WEBUI_TOKEN" \
  -F "file=@recording.wav" \
  -F "language=en"
```

从 JSON 响应的 `text` 中读取转录文本。要向模型询问录音内容，请在单独的[聊天补全请求](#chat-completions)中将该转录文本作为用户消息发送。

### 图像生成和编辑 {#image-generation-and-editing}

- **端点**：`POST /api/v1/images/generations`（请求体：`prompt`，可选 `model`、`size`、`n`、`steps`、`negative_prompt`）和 `POST /api/v1/images/edit`（请求体：`image` 为一个或多个 base64 编码图像或 URL，`prompt`，可选 `model`、`size`、`n`、`negative_prompt`、`background`）。
- **列出图像模型**：`GET /api/v1/images/models` 返回你可以使用的图像模型。每个条目都有 `<connection-id>:<model-id>` 形式的 `id`、不含前缀的 `model` ID，以及表示其能力的 `image_generation` 和 `image_edit` 标志。

你发送的 `model` 必须是这些图像模型之一，通过其 `id` 或不含前缀的 `model` ID 指定，并且必须能够完成相应任务：编辑需要设置了 `image_edit` 的模型。这些路由不会回退到其他模型。无法使用的模型或没有连接提供的模型会返回 `400` 和 `Image model "<model>" was not found`。不能完成相应任务的模型会返回 `400` 和 `Image model "<model>" cannot be used for image generation` 或 `Image model "<model>" cannot be used for image edit`。省略 `model` 时，会运行管理员为该任务设置的默认图像模型；若未设置，则使用第一个可用模型。完全没有任何可用模型时，请求会因 `400` 失败并返回 `[ERROR: No image model is available]`（编辑时返回 `[ERROR: No image model that can edit images is available]`）。

管理员关闭图像生成或图像编辑，或非管理员没有图像生成权限时，会返回 `403` 和 `You do not have permission to access this resource. Please contact your administrator for assistance.`

```bash
curl -X POST http://localhost:3000/api/v1/images/generations \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "gpt-image-2", "prompt": "A lighthouse at dusk"}'
```

### `POST /api/v1/users/user/settings/update` 执行补丁更新，而非替换 {#post-apiv1usersusersettingsupdate-patches-it-does-not-replace}

此请求中的 `ui` 对象会逐字段应用。省略的字段保留其当前值，发送为 `null` 的字段会被清除，使该用户的该字段回退到实例默认值。因此，发送部分对象是更改单项设置的常规方式。

读取设置、编辑一个键再回传整个对象的脚本仍然有效。但如果脚本发送手写的对象，并期望清除其他所有设置，则无法达到预期，因为省略的内容不再被移除。

### 已移除：`POST /api/v1/utils/pdf` {#removed-post-apiv1utilspdf}

在服务器端将聊天渲染为 PDF 的端点及其背后的字体和 PDF 库均已移除。对于使用 Open WebUI 的人没有任何变化：**Chat > Download > PDF** 仍然可用，并始终在浏览器中渲染。只有直接调用该端点的脚本会受到影响，而且没有替代端点。

### API 请求中的过滤器和 Function 行为 {#filter-and-function-behavior-with-api-requests}

直接使用 API 端点时，过滤器（Function）的行为与来自 Web 界面的请求不同。

:::info 身份验证说明
Open WebUI 同时接受 **API 密钥**（以 `sk-` 为前缀）和 **JWT 令牌**进行 API 身份验证。这是有意设计的：Web 界面内部使用 JWT 令牌访问相同的 API 端点。两种身份验证方法提供同等的 API 访问能力。
:::

#### 过滤器执行 {#filter-execution}

| 过滤器函数 | WebUI 请求 | 直接 API |
|----------------|--------------|------------|
| `inlet()` | 运行 | 运行 |
| `stream()` | 运行 | 运行 |
| `outlet()` | 运行 | 默认内联运行，由 `ENABLE_API_OUTLET_FILTERS` 控制（见下文） |

`inlet()` 函数始终执行，因此非常适合：
- **速率限制**：跟踪并限制每个用户的请求
- **请求日志**：记录所有 API 使用情况以供监控
- **输入验证**：在请求到达模型之前拒绝无效请求

:::danger 直接 API 调用的 Outlet 行为，请仔细阅读
默认情况下，`outlet()` 会在 `/api/chat/completions` 之后**内联运行**，同时适用于**流式和非流式**路径，由 [`ENABLE_API_OUTLET_FILTERS`](/reference/env-configuration#enable_api_outlet_filters)（默认 `True`）控制。**不需要** `chat_id` 和消息 `id`：当请求体中二者均不存在时，系统会根据你发送的 `messages` 和助手回复重建对话，并为其生成消息 ID。将 `ENABLE_API_OUTLET_FILTERS=False` 可关闭直接 API 流量的内联执行。

`chat_id` 和 `id` 决定响应的去向。同时发送二者时，请求会采用为 WebUI 构建的路径：服务器自行消耗上游流并将内容路由到用户的 WebSocket，因此对流式调用方的 HTTP 响应实际上为空。省略它们时，上游流会照常通过 HTTP 中继给你，`outlet()` 会在流结束后运行。

无论哪种情况，**`outlet()` 都不会重写 HTTP 响应体**。它会更新持久化的聊天消息并发出 `chat:outlet` WebSocket 事件，但客户端收到的 JSON 是 outlet 之前的内容。如果需要经过 outlet 过滤的文本，请从聊天记录中读回、订阅 WebSocket，或继续使用 `/api/chat/completed`。

**实用建议：**如果你是纯 API 使用方（Continue.dev、Claude Code、自定义脚本等），并且需要通过 HTTP 接收 `outlet()` 的输出，请在补全后调用 `/api/chat/completed`。内联执行仍会运行 outlet 过滤器及其副作用，只是不会将过滤后的负载交给你。
:::

#### 旧版 / API 支持端点：`/api/chat/completed` {#legacy--supported-for-api-endpoint-apichatcompleted}

`POST /api/chat/completed` 是能可靠地为直接 API 集成运行 `outlet()` 的端点。它已标记为弃用，但如上所述，内联执行目前不会将过滤后的负载返回给纯 API 调用方，因此实践中，如今 `/api/chat/completed` 仍是大多数 API 集成的正确选择。

- **端点**：`POST /api/chat/completed`
- **说明**：无条件对完整聊天负载运行 `outlet()` 过滤器（以及管道 outlet 过滤器）。返回过滤后的负载。

- **Curl 示例**：

  ```bash
  curl -X POST http://localhost:3000/api/chat/completed \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "model": "qwen3.6:27b",
        "messages": [
          {"role": "user", "content": "Hello"},
          {"role": "assistant", "content": "Hi! How can I help you today?"}
        ],
        "chat_id": "optional-uuid",
        "session_id": "optional-session-id"
      }'
  ```

- **Python 示例**：

  ```python
  import requests

  def complete_chat_with_outlet(token, model, messages, chat_id=None):
      """
      第二步调用，将 outlet() 的输出返回给直接 API 调用方。
      /api/chat/completions 默认内联运行 outlet，但不会重写
      HTTP 响应体，因此对于希望通过 HTTP 获取 outlet 输出的 API
      集成，此端点仍是正确选择。
      """
      url = 'http://localhost:3000/api/chat/completed'
      headers = {
          'Authorization': f'Bearer {token}',
          'Content-Type': 'application/json'
      }
      payload = {
          'model': model,
          'messages': messages  # 包含带助手响应的完整对话
      }
      if chat_id:
          payload['chat_id'] = chat_id

      response = requests.post(url, headers=headers, json=payload)
      return response.json()
  ```

:::tip
如果需要通过 HTTP 获取 `outlet()` 输出，请调用 `/api/chat/completions`，然后调用 `/api/chat/completed`。`dev` 上的内联执行会运行 outlet 过滤器，其副作用（持久化消息、`chat:outlet` WebSocket 事件、日志记录或跟踪调用）也都会发生，但过滤后的文本不会通过 HTTP 响应返回。有关过滤器行为的更多信息，请参阅[过滤器函数文档](/features/extensibility/plugin/functions/filter#filter-behavior-with-api-requests)。
:::

### OpenAI 兼容嵌入 {#openai-compatible-embeddings}

在 Open WebUI v0.13.4 上，发送 `POST /api/embeddings`（也可通过 `/api/v1/embeddings` 访问），并提供模型 ID 和要嵌入的文本。选择你的账户可以通过 Ollama 或 OpenAI 兼容连接使用的嵌入模型。使用 [`GET /api/models`](#retrieve-all-models) 返回的 ID，包括已配置的连接前缀。

端点根据请求的 `model` 字段进行路由。**Admin Panel > Settings > Documents** 下的嵌入引擎和模型单独配置 RAG。如果你只在 **Documents** 下配置了嵌入模型，请先通过模型连接提供它，再将其用于此端点。

```bash
curl https://open-webui.example.com/api/v1/embeddings \
  -H "Authorization: Bearer $OPEN_WEBUI_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"model": "YOUR_EMBEDDING_MODEL_ID", "input": ["First text", "Second text"]}'
```

从 JSON 响应的 `data[].embedding` 中读取向量。如需原生 Ollama 请求和响应格式，请使用 [Ollama 嵌入代理](#generate-embeddings)。

### Ollama API 代理支持 {#ollama-api-proxy-support}

如果希望直接与 Ollama 模型交互（包括生成嵌入或原始提示词流），Open WebUI 通过代理路由提供到原生 Ollama API 的透明透传。

- **基础 URL**：`/ollama/<api>`
- **参考**：[Ollama API 文档](https://github.com/ollama/ollama/blob/main/docs/api.md)

#### 生成补全（流式） {#generate-completion-streaming}

```bash
curl http://localhost:3000/ollama/api/generate \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "model": "qwen3.6:27b",
  "prompt": "Why is the sky blue?"
}'
```

#### 列出可用模型 {#list-available-models}

```bash
curl http://localhost:3000/ollama/api/tags \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### 生成嵌入 {#generate-embeddings}

```bash
curl -X POST http://localhost:3000/ollama/api/embed \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "model": "qwen3.6:27b",
  "input": ["Open WebUI is great!", "Let'\''s generate embeddings."]
}'
```

:::info
使用 Ollama Proxy 端点时，POST 请求**必须**包含 `Content-Type: application/json` 请求头，否则 API 可能无法解析请求体。如果实例已启用安全保护，还必须提供 Authorization 请求头。
:::

#### Responses API（OpenAI 兼容） {#responses-api-openai-compatible}

Ollama 支持 OpenAI Responses API 格式。Open WebUI 通过 Ollama 路由器代理该 API，并使用与聊天补全相同的模型解析、访问控制和前缀处理。

```bash
curl -X POST http://localhost:3000/ollama/v1/responses \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "model": "qwen3.6:27b",
  "input": "Why is the sky blue?"
}'
```

这使 API 使用方（Codex、Claude Code 等）可以直接将 Responses API 用于 Ollama 托管的模型，而无需配置单独的 OpenAI 兼容连接。

它非常适合使用 Open WebUI 背后的 Ollama 模型构建搜索索引、检索系统或自定义管道。

#### 嵌入（OpenAI 兼容） {#embeddings-openai-compatible}

除上述原生 `/ollama/api/embed` 路由外，Open WebUI 还代理 OpenAI 兼容嵌入端点，因此已经使用 OpenAI 嵌入格式的客户端可以使用 Ollama 托管的嵌入模型，而无需配置单独连接。它采用与其他代理路由相同的模型解析、访问控制和前缀处理。

```bash
curl -X POST http://localhost:3000/ollama/v1/embeddings \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "model": "qwen3.6:27b",
  "input": "Open WebUI is great!"
}'
```

可以使用 `/ollama/v1/embeddings/{url_idx}` 指定特定后端。如果 Ollama 集成被禁用，端点返回 `503`。

#### 聊天补全、补全、消息和模型（OpenAI 兼容） {#chat-completions-completions-messages-and-models-openai-compatible}

Open WebUI 还代理 Ollama 的其他 `/v1` 路由。每条路由都可以带 `/{url_idx}` 后缀以指定一个 Ollama 连接，例如 `/ollama/v1/chat/completions/0`。在 `POST` 路由上，非管理员需要具有所指定工作区模型的读取权限；请求发送到 Ollama 之前，会从模型 ID 中移除连接的 **Prefix ID**。

| 路由 | Open WebUI 应用的处理 |
| :--- | :--- |
| `POST /ollama/v1/chat/completions` | 将工作区模型 ID 替换为其基础模型，并应用工作区模型的系统提示词和参数。不运行知识、工具和过滤器。 |
| `POST /ollama/v1/completions` | 替换为基础模型，并应用工作区模型的参数。不添加系统提示词。 |
| `POST /ollama/v1/messages` | 接受 Anthropic Messages 格式。替换为基础模型，并原样转发请求的其余部分。如果 Ollama 集成被禁用，则返回 `503`。 |
| `GET /ollama/v1/models` | 以 OpenAI 格式列出每个已启用 Ollama 连接中的模型。除非启用了 [`BYPASS_MODEL_ACCESS_CONTROL`](/reference/env-configuration#bypass_model_access_control)，否则具有 `user` 角色的用户只能看到具有可读取的已保存模型记录的模型。带 `/{url_idx}` 时，列出该连接的模型且仅限管理员使用。其他用户会收到 `401`。 |

```bash
curl -X POST http://localhost:3000/ollama/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "model": "qwen3.6:27b",
  "messages": [{"role": "user", "content": "Why is the sky blue?"}]
}'
```

如需过滤器、工具和知识，请改用 [`/api/chat/completions`](#chat-completions)。

### 检索增强生成（RAG） {#retrieval-augmented-generation-rag}

检索增强生成（RAG）功能允许结合外部来源的数据来增强响应。下面介绍通过 API 管理文件和知识库的方法，以及如何在聊天补全中有效使用它们。

#### 上传文件 {#uploading-files}

要在 RAG 响应中使用外部数据，首先需要上传文件。上传文件的内容会自动提取并存储在向量数据库中。

- **端点**：`POST /api/v1/files/`
- **查询参数**：
  - `process`（布尔值，默认：`true`）：是否提取内容并计算嵌入
  - `process_in_background`（布尔值，默认：`true`）：是否异步处理
- **Curl 示例**：

  ```bash
  curl -X POST -H "Authorization: Bearer YOUR_API_KEY" -H "Accept: application/json" \
  -F "file=@/path/to/your/file" http://localhost:3000/api/v1/files/
  ```

- **Python 示例**：

  ```python
  import requests

  def upload_file(token, file_path):
      url = 'http://localhost:3000/api/v1/files/'
      headers = {
          'Authorization': f'Bearer {token}',
          'Accept': 'application/json'
      }
      files = {'file': open(file_path, 'rb')}
      response = requests.post(url, headers=headers, files=files)
      return response.json()
  ```

:::warning 异步处理与竞态条件

默认情况下，文件上传采用**异步**处理。上传端点会立即返回文件 ID，但内容提取和嵌入计算会继续在后台进行。

如果在处理完成前尝试将文件添加到知识库，会收到 `400` 错误：

```
The content provided is empty. Please ensure that there is text or data present before proceeding.
```

**必须等待文件处理完成，才能将文件添加到知识库。**请参阅下面的[检查文件处理状态](#checking-file-processing-status)部分。

:::

#### 检查文件处理状态 {#checking-file-processing-status}

将文件添加到知识库之前，请使用状态端点验证处理已完成。

- **端点**：`GET /api/v1/files/{id}/process/status`
- **查询参数**：
  - `stream`（布尔值，默认：`false`）：如果为 `true`，返回 Server-Sent Events（SSE）流

**状态值：**
| 状态 | 说明 |
|--------|-------------|
| `pending` | 文件仍在处理中 |
| `completed` | 处理成功完成 |
| `failed` | 处理失败（检查 `error` 字段了解详情） |

- **Python 示例**（轮询）：

  ```python
  import requests
  import time

  def wait_for_file_processing(token, file_id, timeout=300, poll_interval=2):
      """
      等待文件处理完成。

      返回：
          dict: 包含 'status' 键（'completed' 或 'failed'）的最终状态

      抛出：
          TimeoutError: 如果处理未能在超时时间内完成
      """
      url = f'http://localhost:3000/api/v1/files/{file_id}/process/status'
      headers = {'Authorization': f'Bearer {token}'}

      start_time = time.time()
      while time.time() - start_time < timeout:
          response = requests.get(url, headers=headers)
          result = response.json()
          status = result.get('status')

          if status == 'completed':
              return result
          elif status == 'failed':
              raise Exception(f"File processing failed: {result.get('error')}")

          time.sleep(poll_interval)

      raise TimeoutError(f"File processing did not complete within {timeout} seconds")
  ```

- **Python 示例**（SSE 流式传输）：

  ```python
  import requests
  import json

  def wait_for_file_processing_stream(token, file_id):
      """
      使用 Server-Sent Events 流等待文件处理完成。
      对于长时间运行的操作，比轮询更高效。
      """
      url = f'http://localhost:3000/api/v1/files/{file_id}/process/status?stream=true'
      headers = {'Authorization': f'Bearer {token}'}

      with requests.get(url, headers=headers, stream=True) as response:
          for line in response.iter_lines():
              if line:
                  line = line.decode('utf-8')
                  if line.startswith('data: '):
                      data = json.loads(line[6:])
                      status = data.get('status')

                      if status == 'completed':
                          return data
                      elif status == 'failed':
                          raise Exception(f"File processing failed: {data.get('error')}")

      raise Exception("Stream ended unexpectedly")
  ```

#### 将文件添加到知识集合 {#adding-files-to-knowledge-collections}

上传后，你可以将文件分组到知识库中，或在聊天中单独引用它们。将文件添加到现有本地知识库，需要拥有该知识库、对其具有 **Write** 授权，或使用管理员账户。非管理员还需要对自己不拥有的文件具有读取权限。

:::important
**务必等待文件处理完成，再将其添加到知识库。**仍在处理的文件内容为空，会导致 `400` 错误。使用上述状态端点验证文件状态为 `completed`。
:::

- **端点**：`POST /api/v1/knowledge/{id}/file/add`
- **Curl 示例**：

  ```bash
  curl -X POST http://localhost:3000/api/v1/knowledge/{knowledge_id}/file/add \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"file_id": "your-file-id-here"}'
  ```

- **Python 示例**：

  ```python
  import requests

  def add_file_to_knowledge(token, knowledge_id, file_id):
      url = f'http://localhost:3000/api/v1/knowledge/{knowledge_id}/file/add'
      headers = {
          'Authorization': f'Bearer {token}',
          'Content-Type': 'application/json'
      }
      data = {'file_id': file_id}
      response = requests.post(url, headers=headers, json=data)
      return response.json()
  ```

如果知识库中已存在文件的提取文本，该文件会被拒绝并返回 `400`，错误详情为 `400: Duplicate content detected. Please provide unique content to proceed.`。`POST /api/v1/knowledge/{id}/files/batch/add` 也会执行同样的检查，它接受 `{"file_id": ...}` 对象列表：在该端点中，重复文件会作为失败文件报告在响应警告中，批次中的其他文件仍会被添加。两次调用都受知识库[文件限制](/features/workspace/knowledge#file-limits)约束。


#### 将 Web URL 处理到知识集合中 {#processing-web-urls-into-knowledge-collections}

使用此端点可以抓取网页、提取内容，并将生成的内容块存储在向量集合中。

- **端点**：`POST /api/v1/retrieval/process/web`
- **查询参数**：
  - `process`（布尔值，默认：`true`）：如果为 `false`，仅抓取并返回提取的内容，不保存向量
  - `overwrite`（布尔值，默认：`true`）：保存新内容块之前，是否替换目标集合中的现有向量；实际上会清空指定集合，并将其替换为指定 URL 的内容
- **请求体**：
  - `url`（字符串，必需）：要抓取和解析的 Web URL
  - `collection_name`（字符串，可选）：目标集合名称。如果省略，Open WebUI 会根据 URL 生成一个名称
- **错误**：无法抓取或未产生内容的链接（例如主机拒绝连接）会返回 `400`，详情为 `[ERROR: Could not read content from <url>]`；`process=false` 时也是如此。

**`overwrite` 行为：**
| 值 | 结果 |
|-------|--------|
| `true`（默认） | 插入新的 URL 内容块之前，替换目标集合中的现有向量 |
| `false` | 保留现有向量，并将新的 URL 内容块添加到同一集合 |

- **Curl 示例**（保留现有向量）：

  ```bash
  curl -X POST 'http://localhost:3000/api/v1/retrieval/process/web?process=true&overwrite=false' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
        "url": "https://example.com/docs",
        "collection_name": "testkb"
      }'
  ```

- **Python 示例**：

  ```python
  import requests

  def process_web_url(token, url, collection_name="testkb", overwrite=False):
      response = requests.post(
          'http://localhost:3000/api/v1/retrieval/process/web',
          headers={
              'Authorization': f'Bearer {token}',
              'Content-Type': 'application/json'
          },
          params={
              'process': 'true',
              'overwrite': str(overwrite).lower()
          },
          json={
              'url': url,
              'collection_name': collection_name
          }
      )
      return response.json()
  ```

:::tip
如果启用了 `ENV=dev`，此端点架构（包括 `overwrite` 等查询参数）也会显示在 `/docs` 的 Swagger 中。
:::

#### 完整工作流示例 {#complete-workflow-example}

下面是一个完整示例，用于上传文件、等待处理完成，然后将其添加到知识库：

```python
import requests
import time

WEBUI_URL = 'http://localhost:3000'
TOKEN = 'your-api-key-here'

def upload_and_add_to_knowledge(file_path, knowledge_id, timeout=300):
    """
    上传文件并将其添加到知识库。
    正确等待处理完成后再添加。
    """
    headers = {
        'Authorization': f'Bearer {TOKEN}',
        'Accept': 'application/json'
    }

    # 第 1 步：上传文件
    with open(file_path, 'rb') as f:
        response = requests.post(
            f'{WEBUI_URL}/api/v1/files/',
            headers=headers,
            files={'file': f}
        )

    if response.status_code != 200:
        raise Exception(f"Upload failed: {response.text}")

    file_data = response.json()
    file_id = file_data['id']
    print(f"File uploaded with ID: {file_id}")

    # 第 2 步：等待处理完成
    print("Waiting for file processing...")
    start_time = time.time()

    while time.time() - start_time < timeout:
        status_response = requests.get(
            f'{WEBUI_URL}/api/v1/files/{file_id}/process/status',
            headers=headers
        )
        status_data = status_response.json()
        status = status_data.get('status')

        if status == 'completed':
            print("File processing completed!")
            break
        elif status == 'failed':
            raise Exception(f"Processing failed: {status_data.get('error')}")

        time.sleep(2)  # 每 2 秒轮询一次
    else:
        raise TimeoutError("File processing timed out")

    # 第 3 步：添加到知识库
    add_response = requests.post(
        f'{WEBUI_URL}/api/v1/knowledge/{knowledge_id}/file/add',
        headers={**headers, 'Content-Type': 'application/json'},
        json={'file_id': file_id}
    )

    if add_response.status_code != 200:
        raise Exception(f"Failed to add to knowledge: {add_response.text}")

    print(f"File successfully added to knowledge base!")
    return add_response.json()

# 用法
result = upload_and_add_to_knowledge('/path/to/document.pdf', 'your-knowledge-id')
```

#### 在聊天补全中使用文件和集合 {#using-files-and-collections-in-chat-completions}

在 RAG 查询中，可以同时引用单个文件或整个知识库，以丰富响应内容。

##### 在聊天补全中使用单个文件 {#using-an-individual-file-in-chat-completions}

当希望聊天模型专注于特定文件的响应内容时，此方法很有用。

- **端点**：`POST /api/chat/completions`
- **Curl 示例**：

  ```bash
  curl -X POST http://localhost:3000/api/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "model": "gpt-5.6-terra",
        "messages": [
          {"role": "user", "content": "Explain the concepts in this document."}
        ],
        "files": [
          {"type": "file", "id": "your-file-id-here"}
        ]
      }'
  ```

- **Python 示例**：

  ```python
  import requests

  def chat_with_file(token, model, query, file_id):
      url = 'http://localhost:3000/api/chat/completions'
      headers = {
          'Authorization': f'Bearer {token}',
          'Content-Type': 'application/json'
      }
      payload = {
          'model': model,
          'messages': [{'role': 'user', 'content': query}],
          'files': [{'type': 'file', 'id': file_id}]
      }
      response = requests.post(url, headers=headers, json=payload)
      return response.json()
  ```

##### 在聊天补全中使用知识集合 {#using-a-knowledge-collection-in-chat-completions}

当问题可能受益于更广泛的上下文或多份文档时，可以利用知识库增强响应。

- **端点**：`POST /api/chat/completions`
- **Curl 示例**：

  ```bash
  curl -X POST http://localhost:3000/api/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "model": "gpt-5.6-terra",
        "messages": [
          {"role": "user", "content": "Provide insights on the historical perspectives covered in the knowledge base."}
        ],
        "files": [
          {"type": "collection", "id": "your-collection-id-here"}
        ]
      }'
  ```

- **Python 示例**：

  ```python
  import requests

  def chat_with_collection(token, model, query, collection_id):
      url = 'http://localhost:3000/api/chat/completions'
      headers = {
          'Authorization': f'Bearer {token}',
          'Content-Type': 'application/json'
      }
      payload = {
          'model': model,
          'messages': [{'role': 'user', 'content': query}],
          'files': [{'type': 'collection', 'id': collection_id}]
      }
      response = requests.post(url, headers=headers, json=payload)
      return response.json()
  ```

##### 读取响应中的引用 {#reading-the-citations-in-the-response}

当检索找到内容时，响应会携带检索到的来源，以便显示引用。这适用于未发送 `session_id` 和 `chat_id` 的普通 API 请求。

- **非流式**（`"stream": false`）：JSON 响应在 `choices` 旁有一个顶级 `sources` 键。
- **流式**（`"stream": true`）：第一个事件是 `data: {"sources": [...]}`，在模型的第一个内容块之前发送。它没有 `choices` 键，因此从每个事件读取 `choices[0].delta.content` 的客户端必须跳过它。

`sources` 中的每个条目包含 `source`（来源文件或集合）、`document`（检索到的文本块）、`metadata`（每个内容块对应一个对象），以及在向量数据库返回时包含的 `distances`。未检索到任何内容时，会省略该键。

这些方法可以通过上传的文件和精心整理的知识库有效利用外部知识，使用 Open WebUI API 增强聊天应用的能力。无论单独使用文件还是通过知识库使用文件，都可以根据具体需求定制集成。

## 将 Open WebUI 用作统一 LLM 服务提供方的优势 {#advantages-of-using-open-webui-as-a-unified-llm-provider}

Open WebUI 提供众多优势，使其成为开发者和企业的重要工具：

- **统一界面**：通过单一的集成平台，简化与不同 LLM 的交互。
- **易于实施**：借助全面的文档和社区支持，快速开始集成。

遵循这些指南，你可以迅速完成集成并开始使用 Open WebUI API。如果遇到任何问题或有疑问，欢迎通过 Discord 社区联系我们或查阅常见问题。祝你编程愉快！
