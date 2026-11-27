---
sidebar_position: 7
title: "URL 参数"
---

在 Open WebUI 中，可以通过各种 URL 参数自定义聊天会话。这些参数允许你设置具体配置、启用功能，并按聊天定义模型设置。通过这种方式，可以直接从 URL 灵活控制各个聊天会话。

## URL 参数概述 {#url-parameter-overview}

下表列出了可用的 URL 参数、其功能和用法示例。

| **参数** | **说明** | **示例** |
|-----------------------|-----------------------------------------------------------------------------------|----------------------------------|
| `models` | 指定要使用的模型，多个模型以逗号分隔。 | `/?models=model1,model2` |
| `model` | 指定聊天会话使用的单个模型。 | `/?model=model1` |
| `youtube` | 指定要在聊天中转写的 YouTube 视频 ID，需经用户确认。 | `/?youtube=VIDEO_ID` |
| `load-url` | 指定要抓取的网站 URL，并在用户确认后作为文档上传到聊天中。 | `/?load-url=https://google.com` |
| `web-search` | 设置为 `true` 时启用网络搜索功能。 | `/?web-search=true` |
| `tools` 或 `tool-ids` | 指定要在聊天中激活的工具 ID 列表，多个 ID 以逗号分隔。工具服务器连接使用带前缀的 ID。 | `/?tools=tool1,tool2` |
| `call` 或 `voice` | 设置为 `true` 时，在用户确认后启动语音模式。 | `/?call=true` |
| `q` | 将提示词放入消息输入框，供用户检查并发送。 | `/?q=Hello%20there` |
| `temporary-chat` | 设置为 `true` 时将聊天标记为临时聊天，用于一次性会话。 | `/?temporary-chat=true` |
| `code-interpreter` | 设置为 `true` 时启用代码解释器功能。 | `/?code-interpreter=true` |
| `image-generation` | 设置为 `true` 时启用图像生成功能。 | `/?image-generation=true` |
| `settings` | 在指定标签页打开设置对话框，`admin:` 标签页仅限管理员使用。 | `/?settings=admin:documents` |

### 1. **模型与模型选择** {#1-models-and-model-selection}

- **说明**：`models` 和 `model` 参数允许你指定特定聊天会话应使用哪些[语言模型](/features/workspace/models)。
- **设置方法**：多个模型使用 `models`，单个模型使用 `model`。
- **示例**：
  - `/?models=model1,model2`：使用 `model1` 和 `model2` 初始化聊天。
  - `/?model=model1`：将 `model1` 设置为聊天的唯一模型。
- **注意**：当没有有效选择时（例如上次使用的模型已被删除或隐藏），不带这两个参数的新聊天会回退到[用户组的默认模型](/features/authentication-access/rbac/groups#default-models-per-group)；如果没有组设置默认模型，则回退到实例的[已选模型](/features/workspace/models#selected-and-pinned-models-admin)（[`DEFAULT_MODELS`](/reference/env-configuration#default_models)）。传入其中一个参数会阻止这种回退，因此聊天会等待你指定的模型。

### 2. **YouTube 转写** {#2-youtube-transcription}

- **说明**：`youtube` 参数接受 YouTube 视频 ID，使聊天能够转写指定视频。
- **设置方法**：使用 YouTube 视频 ID 作为此参数的值。
- **示例**：`/?youtube=VIDEO_ID`
- **行为**：**打开链接**对话框会列出视频 URL 并询问是否加载。用户确认后，视频转写文本会添加到聊天中。取消则不会加载任何内容。

### 3. **网站内容导入** {#3-website-insertion}

- **说明**：`load-url` 参数下载指定网站并提取内容，然后将其作为文档上传到聊天中。
- **设置方法**：使用完整的网站 URL 作为此参数的值。
- **示例**：`/?load-url=https://google.com`
- **行为**：**打开链接**对话框会列出 URL 并询问是否加载。用户确认后，页面内容会作为文档添加到聊天中。取消则不会加载任何内容。同时提供 `youtube` 和 `load-url` 时，一个对话框会列出这两个 URL。

### 4. **网络搜索** {#4-web-search}

- **说明**：启用 `web-search` 允许聊天会话使用[网络搜索](/features/chat-conversations/web-search)功能。
- **设置方法**：将此参数设置为 `true` 以启用网络搜索。
- **示例**：`/?web-search=true`
- **行为**：启用后，聊天可以检索网络搜索结果，并将其作为回复的一部分。

### 5. **工具选择** {#5-tool-selection}

- **说明**：`tools` 或 `tool-ids` 参数指定要在聊天中激活哪些[工具](/features/extensibility/plugin/tools)。
- **设置方法**：提供以逗号分隔的工具 ID 列表作为参数值。
- **示例**：`/?tools=tool1,tool2` 或 `/?tool-ids=tool1,tool2`
- **行为**：系统会匹配并激活会话中的每个工具 ID，供用户交互使用。
- **注意**：该值必须是 Open WebUI 内部使用的 ID，它不一定与你在 **+** 菜单中看到的名称相同。工作区工具使用其普通 ID，例如 `/?tools=my_workspace_tool`。工具服务器连接会在连接上设置的 ID 前添加前缀。MCP 连接使用 `server:mcp:<server-id>`，OpenAPI 连接使用 `server:<server-id>`，例如 `/?tool-ids=server:mcp:my_mcp_server`。未设置 ID 的 OpenAPI 连接使用其在连接列表中的位置，从 `0` 开始。无法匹配的 ID 不会被激活。工具列表端点会返回准确的 ID，请参阅[通过 API 使用 Open WebUI 工具（包括 MCP）](/reference/api-endpoints#using-open-webui-tools-including-mcp-from-the-api)。

### 6. **通话浮层** {#6-call-overlay}

- **说明**：`call` 参数启动[语音模式](/features/chat-conversations/chat-features/voice-mode)，即聊天界面中的通话浮层。`voice` 是其别名，工作方式相同。
- **设置方法**：将参数设置为 `true` 以启动通话浮层。
- **示例**：`/?call=true` 或 `/?voice=true`
- **行为**：**打开链接**对话框会询问是否使用麦克风开始语音通话。用户确认后，通话浮层会打开，可使用实时转写和视频输入等功能。取消则保持麦克风关闭。当链接还包含 `youtube` 或 `load-url` 时，同一对话框会列出这些 URL，确认后会同时执行两项操作。通话会执行与**语音模式**按钮相同的检查：用户需要具有[**允许通话**](/features/authentication-access/rbac/permissions#3-chat-permissions)权限，并且只能选择一个模型。在标准通话模式下，语音转文本引擎还不能是 **Web API**。

### 7. **初始查询提示词** {#7-initial-query-prompt}

- **说明**：`q` 参数允许为聊天设置初始查询或提示词。
- **设置方法**：将查询或提示词文本指定为参数值。
- **示例**：`/?q=Hello%20there`
- **行为**：文本会进入消息输入框，由用户决定何时发送。

### 8. **临时聊天会话** {#8-temporary-chat-sessions}

- **说明**：`temporary-chat` 参数将聊天标记为临时会话。这可能会限制保存聊天历史或应用持久设置等功能。
- **设置方法**：对于临时聊天会话，将此参数设置为 `true`。
- **示例**：`/?temporary-chat=true`
- **行为**：这会启动一次性聊天会话，不保存历史记录，也不应用高级配置。
  - **注意**：临时聊天会在重新连接后恢复正在生成的回复。
  - 有关浏览器提取哪些内容以及哪些内容会发送到后端，请参阅[临时聊天中的文档附件](/features/chat-conversations/rag/document-extraction#document-attachments-in-temporary-chats)。
  - **注意**：临时聊天使用按会话划分的 ID，不存储聊天记录，因此运行产生的任何内容（消息、生成的图像、状态更新、标题或标签）都不会写入数据库。需要已保存聊天的功能在临时聊天中不可用，例如[任务列表](/features/chat-conversations/chat-features/task-management)、[每个聊天使用一个实例的终端](/features/open-terminal/terminals/orchestration/creating-terminals#machine-scope)、[子代理](/features/chat-conversations/chat-features/subagents)、[定时器](/features/chat-conversations/chat-features/timers)和分叉。临时聊天在回复下方不显示**分叉聊天**操作，`/` 菜单中也没有 `/fork`；手动输入 `/fork` 会返回**没有可分叉的聊天**。[频道](/features/channels)中的聊天采用相同的处理方式，[询问用户工具](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode)在频道中同样不可用。
  - **注意**：在临时聊天中，来自[询问用户工具](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode)的问题，或者在[**请求批准**](/features/extensibility/plugin/tools#tool-approval)下等待的工具调用，会在已打开的浏览器标签页中显示为对话框。大约两分钟内无人回答、离开聊天或标签页断开连接，都会被视为拒绝。在已保存的聊天中，重新加载或连接断开并非最终结果：如果你在 60 秒内且回答时限到期前打开该聊天，问题会再次发送。临时聊天必须是该标签页中打开的聊天，否则请求会立即取消。
  - **注意**：上述不可用功能列表是完整列表。任何未列出的功能或工具在临时聊天中的工作方式都与普通聊天完全相同。这包括会自行存储或发送数据的工具，例如记忆、笔记和网络搜索。如果你不希望临时聊天使用某个工具，请在模型上禁用它。

### 9. **代码解释器** {#9-code-interpreter}

- **说明**：`code-interpreter` 参数启用代码解释器功能。
- **设置方法**：将此参数设置为 `true`，为此新聊天会话启用代码解释器功能。
- **示例**：`/?code-interpreter=true`
- **行为**：激活代码解释器按钮，使代码解释器随发送给 LLM 的下一个提示词执行。

### 10. **图像生成** {#10-image-generation}

- **说明**：`image-generation` 参数为所提供的提示词启用图像生成。
- **设置方法**：将此参数设置为 `true`，为聊天启用图像生成。
- **示例**：`/?image-generation=true`
- **行为**：激活图像生成按钮以生成图像。

### 11. **设置深层链接** {#11-settings-deep-link}

- **说明**：`settings` 参数在指定标签页打开设置对话框，随后从 URL 中移除自身。
- **设置方法**：使用用户标签页 ID（`general`、`interface`、`notifications`、`shortcuts`、`personalization`、`audio`、`data_controls`、`usage`、`archived_chats`、`account`、`about`），或使用 `admin:<tab>` 形式的管理员标签页（`general`、`authentication`、`interface`、`connections`、`models`、`subagents`、`integrations`、`apps`、`documents`、`audio`、`images`、`videos`、`web`、`code-execution`、`pipelines`、`analytics`、`evaluations`、`db`）。
- **示例**：`/?settings=admin:documents`
- **行为**：对话框会在该标签页打开。非管理员访问 `admin:` 链接时，会改为打开常规标签页。

### 12. **新建笔记** {#12-new-note}

- **说明**：在[笔记页面](/features/notes#quick-creation)上，`title` 和 `content` 会预填新笔记。
- **设置方法**：打开 `/notes/new`（或 `/notes`）并传入任一参数。
- **示例**：`/notes/new?title=Meeting&content=Agenda%3A`
- **行为**：**创建新笔记**对话框会显示标题和正文，并在创建前请求确认。用户确认后，笔记会被创建并在编辑器中打开。只提供 `content` 时，标题默认为当天日期。在 `/notes/new` 上取消会返回笔记列表。

<!-- markdownlint-disable-next-line MD033 -->
<details>
<!-- markdownlint-disable-next-line MD033 -->
<summary>示例使用场景</summary>

:::tip

**临时聊天会话**
假设用户希望发起一个快速聊天会话而不保存历史记录，可以在 URL 中设置 `temporary-chat=true`。这会提供适合一次性交互的一次性聊天环境。

:::
</details>

## 组合使用多个参数 {#using-multiple-parameters-together}

这些 URL 参数可以组合使用，创建高度自定义的聊天会话。例如：

```bash
/?models=model1&youtube=VIDEO_ID&web-search=true&tools=tool1,tool2&call=true&q=Hello%20there&temporary-chat=true
```

此 URL 将：

- 使用 `model1` 初始化聊天。
- 启用网络搜索和指定工具。
- 显示一个**打开链接**对话框，列出 YouTube 视频并询问是否开始语音通话。确认后会加载转写文本并打开通话浮层。
- 将“Hello there”放入消息输入框，等待发送。
- 将聊天标记为临时聊天，避免保存任何历史记录。
