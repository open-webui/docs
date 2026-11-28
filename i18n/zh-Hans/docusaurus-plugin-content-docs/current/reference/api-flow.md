---
sidebar_position: 40
title: "后端控制的 API 流程"
---

---

# 后端控制、兼容 UI 的 API 流程

:::warning

本教程为社区贡献，不受 Open WebUI 团队支持，仅用于演示如何针对特定用例定制 Open WebUI。想要贡献内容？请参阅[贡献教程](/tutorials/contributing-tutorial)。

:::

本教程演示如何在服务端编排 Open WebUI 对话，同时确保助手回复能够正确显示在前端 UI 中。这种方法无需前端参与，并允许后端完全控制聊天流程。
本教程已验证适用于 Open WebUI v0.6.15。未来版本可能会改变相关行为或 API 结构。

## 前提条件 {#prerequisites}

开始本教程前，请确保具备：

- 一个正在运行的 Open WebUI 实例
- 有效的 API 身份验证令牌
- Open WebUI 后端 API 的访问权限
- 对 REST API 和 JSON 的基本了解
- 命令行工具：`curl`、`jq`（可选，用于解析 JSON）

## 概述 {#overview}

本教程介绍一套完整的六步流程，用于在服务端编排 Open WebUI 对话，同时确保助手回复能够正确显示在前端 UI 中。

:::tip 专门查找工具调用？
如果你的目标是让模型使用工具（内置工具、工作区工具、MCP 服务器或机器），并由 Open WebUI 在服务端执行这些工具，请参阅[服务端工具调用（API）](/reference/server-side-tool-calling)。该文档以这里介绍的聊天结构为基础，并补充了启用工具执行所需的字段。
:::

### 流程 {#process-flow}

核心步骤如下：

1. **创建包含用户消息和助手消息的新聊天**：使用用户输入和一个空的助手占位消息初始化对话
2. **触发助手补全**：生成实际的 AI 响应（可选择集成知识）
3. **等待响应完成**：监控助手响应，直至完全生成
4. **获取并处理最终聊天**：检索并解析已完成的对话

这样即可在服务端进行编排，同时让回复显示在前端 UI 中，效果与通过正常用户交互生成的回复完全一致。

## 重要概念 {#important-concepts}

### 消息 ID 由调用方生成 {#message-ids-are-caller-generated}

所有消息 ID（`user-msg-id`、`assistant-msg-id`）都必须由**调用方**在发起 API 调用**之前**生成为有效的 UUID。Open WebUI 不会为你分配消息 ID。可以使用任意 UUID v4 生成器创建这些 ID。

示例（bash）：

```bash
USER_MSG_ID=$(uuidgen || python3 -c "import uuid; print(uuid.uuid4())")
ASSISTANT_MSG_ID=$(uuidgen || python3 -c "import uuid; print(uuid.uuid4())")
```

### `childrenIds` 字段 {#the-childrenids-field}

Open WebUI 前端以**树形结构**渲染消息。每条消息都必须包含 `childrenIds` 数组，列出其直接子消息的 ID。如果没有此字段，前端将无法遍历消息树，即使消息存在于数据库中，**也不会渲染**。

- **用户消息**必须在 `childrenIds` 中列出其助手回复的 ID
- **助手消息**通常使用 `childrenIds: []`（空数组），除非存在后续消息

### `currentId` 字段 {#the-currentid-field}

`history` 对象必须使用 `currentId`（**camelCase**，而不是 `current_id`）。该字段告诉前端当前活动对话线程的末尾是哪条消息。

## 实现指南 {#implementation-guide}

### 预先创建助手消息（可选） {#pre-creating-the-assistant-message-optional}

对于已有的 `chat_id`，在传入助手消息的 `id` 时，`POST /api/chat/completions` 会自行插入助手占位消息，并将其链接到通过 `user_message` 发送的用户消息下（步骤 2），因此不再需要预先创建占位消息。如果确实要预先创建，仍必须发送 `user_message`：后端会用该消息的 `id` 覆盖已存储占位消息的 `parentId`；如果缺少 `user_message`，则将 `parentId` 覆盖为 null。

预先创建的助手消息会写入 `chat.history.messages[<assistantId>]`，即前端用于渲染消息树的索引化消息历史。

**助手消息的预期结构：**

```json
{
  "id": "<uuid>",
  "role": "assistant",
  "content": "",
  "parentId": "<user-msg-id>",
  "childrenIds": [],
  "model": "gpt-5.6-sol",
  "modelName": "gpt-5.6-sol",
  "modelIdx": 0,
  "done": false,
  "timestamp": 1720000001
}
```

如果确实要预先创建，请使用此结构。

## 分步实现 {#step-by-step-implementation}

### 步骤 1：创建包含用户消息和助手消息的聊天 {#step-1-create-chat-with-user-and-assistant-messages}

此操作通过单个请求创建同时包含**用户消息**和空助手占位消息的聊天。响应会返回 `chatId`（位于 `id` 字段中），供后续请求使用。

:::tip

可以将聊天创建和助手占位消息的创建合并到这一步。关键是在初始负载中同时包含用户消息和空的助手消息，并正确设置 `parentId`、`childrenIds` 和 `currentId` 字段。

:::

```bash
USER_MSG_ID=$(uuidgen || python3 -c "import uuid; print(uuid.uuid4())")
ASSISTANT_MSG_ID=$(uuidgen || python3 -c "import uuid; print(uuid.uuid4())")
TIMESTAMP=$(date +%s)

curl -X POST https://<host>/api/v1/chats/new \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "chat": {
      "title": "New Chat",
      "models": ["gpt-5.6-sol"],
      "messages": [
        {
          "id": "'"$USER_MSG_ID"'",
          "role": "user",
          "content": "Hi, what is the capital of France?",
          "timestamp": '"$TIMESTAMP"',
          "models": ["gpt-5.6-sol"],
          "childrenIds": ["'"$ASSISTANT_MSG_ID"'"]
        },
        {
          "id": "'"$ASSISTANT_MSG_ID"'",
          "role": "assistant",
          "content": "",
          "parentId": "'"$USER_MSG_ID"'",
          "childrenIds": [],
          "model": "gpt-5.6-sol",
          "modelName": "gpt-5.6-sol",
          "modelIdx": 0,
          "done": false,
          "timestamp": '"$((TIMESTAMP + 1))"'
        }
      ],
      "history": {
        "currentId": "'"$ASSISTANT_MSG_ID"'",
        "messages": {
          "'"$USER_MSG_ID"'": {
            "id": "'"$USER_MSG_ID"'",
            "role": "user",
            "content": "Hi, what is the capital of France?",
            "timestamp": '"$TIMESTAMP"',
            "models": ["gpt-5.6-sol"],
            "childrenIds": ["'"$ASSISTANT_MSG_ID"'"]
          },
          "'"$ASSISTANT_MSG_ID"'": {
            "id": "'"$ASSISTANT_MSG_ID"'",
            "role": "assistant",
            "content": "",
            "parentId": "'"$USER_MSG_ID"'",
            "childrenIds": [],
            "model": "gpt-5.6-sol",
            "modelName": "gpt-5.6-sol",
            "modelIdx": 0,
            "done": false,
            "timestamp": '"$((TIMESTAMP + 1))"'
          }
        }
      }
    }
  }'
```

**保存响应中的 `id` 字段。** 它是后续所有步骤使用的 `chatId`。

:::note

顶层的 `messages[]` 数组是供旧客户端使用的扁平列表，仅在缺少 `history.messages{}` 时读取。`history.messages{}` 对象是权威结构。它是以消息 ID 为键的字典，前端通过 `parentId` 和 `childrenIds` 使用它构建对话树。

:::

### 步骤 2：触发助手补全 {#step-2-trigger-assistant-completion}

使用补全端点生成实际的 AI 响应。请使用步骤 1 中的 `chatId`：

```bash
curl -X POST https://<host>/api/chat/completions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": "<chatId>",
    "id": "'"$ASSISTANT_MSG_ID"'",
    "user_message": {
      "id": "'"$USER_MSG_ID"'",
      "role": "user",
      "content": "Hi, what is the capital of France?",
      "parentId": null,
      "childrenIds": ["'"$ASSISTANT_MSG_ID"'"],
      "timestamp": '"$TIMESTAMP"',
      "models": ["gpt-5.6-sol"]
    },
    "messages": [
      {
        "role": "user",
        "content": "Hi, what is the capital of France?"
      }
    ],
    "model": "gpt-5.6-sol",
    "stream": true,
    "background_tasks": {
      "title_generation": true,
      "tags_generation": false,
      "follow_up_generation": false
    },
    "features": {
      "code_interpreter": false,
      "web_search": false,
      "image_generation": false,
      "memory": false
    },
    "variables": {
      "{{USER_NAME}}": "",
      "{{USER_LANGUAGE}}": "en-US",
      "{{CURRENT_DATETIME}}": "2025-07-14T12:00:00Z",
      "{{CURRENT_TIMEZONE}}": "Europe"
    },
    "session_id": "<session-uuid>"
  }'
```

:::note

`session_id` 应是你为此会话生成的唯一 UUID。它有助于维护对话上下文；如果前端已打开，它还用于 WebSocket 事件路由。

:::

:::warning 包含 `user_message`

`user_message` 携带本次补全所回答的用户消息，即步骤 1 中存储的同一个对象。后端保存助手消息时，会将其 `parentId` 设置为该用户消息的 `id`，从而将用户消息保留在线程中。如果不发送它，助手消息将在没有父消息的情况下保存，页面重新加载后聊天中只会显示助手回复。

:::

#### 步骤 2.1：触发集成知识（RAG）的助手补全 {#step-21-trigger-assistant-completion-with-knowledge-integration-rag}

对于涉及知识库的高级用例，请在补全请求中包含知识文件：

```bash
curl -X POST https://<host>/api/chat/completions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": "<chatId>",
    "id": "'"$ASSISTANT_MSG_ID"'",
    "user_message": {
      "id": "'"$USER_MSG_ID"'",
      "role": "user",
      "content": "Hi, what is the capital of France?",
      "parentId": null,
      "childrenIds": ["'"$ASSISTANT_MSG_ID"'"],
      "timestamp": '"$TIMESTAMP"',
      "models": ["gpt-5.6-sol"]
    },
    "messages": [
      {
        "role": "user",
        "content": "Hi, what is the capital of France?"
      }
    ],
    "model": "gpt-5.6-sol",
    "stream": true,
    "files": [
      {
        "id": "knowledge-collection-id",
        "type": "collection",
        "status": "processed"
      }
    ],
    "background_tasks": {
      "title_generation": true,
      "tags_generation": false,
      "follow_up_generation": false
    },
    "features": {
      "code_interpreter": false,
      "web_search": false,
      "image_generation": false,
      "memory": false
    },
    "variables": {
      "{{USER_NAME}}": "",
      "{{USER_LANGUAGE}}": "en-US",
      "{{CURRENT_DATETIME}}": "2025-07-14T12:00:00Z",
      "{{CURRENT_TIMEZONE}}": "Europe"
    },
    "session_id": "<session-uuid>"
  }'
```

### 步骤 3：等待助手响应完成 {#step-3-wait-for-assistant-response-completion}

可以根据实现需求，通过两种方式处理助手响应：

#### 方案 A：流式处理 {#option-a-stream-processing}

只有当请求不携带 `session_id`（或不携带 `chat_id`）时，才会通过 HTTP 响应进行流式传输。像步骤 2 那样同时提供两者时，补全会作为后台任务运行，并立即返回响应体 `{"status": true, "task_ids": [...], "chat_id": "..."}`；输出会以 Socket.IO `events` 的形式发送到 `user:<id>` 房间（以该用户身份登录的每个 socket），而不是发送到 `session_id`。要通过 HTTP 进行流式传输，请省略 `session_id`；要跟踪后台任务，请轮询 `GET /api/tasks/chat/{chat_id}` 或聊天本身（方案 B）。该通道上的消息类型列于[实时事件](#real-time-events)。

#### 方案 B：轮询方式 {#option-b-polling-approach}

对于无法处理流式传输的实现，请轮询聊天端点，直到响应就绪。建议使用带指数退避的重试机制：

```bash

# 每隔几秒轮询一次，直到助手内容已填充
while true; do
  response=$(curl -s -X GET https://<host>/api/v1/chats/<chatId> \
    -H "Authorization: Bearer <token>")

  # 检查助手消息是否已有内容（响应已就绪）
  assistant_content=$(echo "$response" | jq -r ".chat.history.messages[\"$ASSISTANT_MSG_ID\"].content // empty")
  if [ -n "$assistant_content" ]; then
    echo "Assistant response is ready!"
    echo "$assistant_content"
    break
  fi

  echo "Waiting for assistant response..."
  sleep 2
done
```

### 步骤 4：获取最终聊天 {#step-4-fetch-final-chat}

检索已完成的对话：

```bash
curl -X GET https://<host>/api/v1/chats/<chatId> \
  -H "Authorization: Bearer <token>"
```

## 其他 API 端点 {#additional-api-endpoints}

### 获取知识集合 {#fetch-knowledge-collection}

检索用于 RAG 集成的知识库信息：

```bash
curl -X GET https://<host>/api/v1/knowledge/<knowledge-id> \
  -H "Authorization: Bearer <token>"
```

### 获取模型信息 {#fetch-model-information}

获取特定模型的详细信息：

```bash
curl -X GET https://<host>/api/v1/models/model?id=<model-name> \
  -H "Authorization: Bearer <token>"
```

### 向现有聊天发送其他消息 {#send-additional-messages-to-an-existing-chat}

对于多轮对话，请将新的用户消息和助手占位消息添加到现有聊天中，并分别设置正确的 `parentId`：

```bash
NEW_USER_MSG_ID=$(uuidgen || python3 -c "import uuid; print(uuid.uuid4())")
NEW_ASSISTANT_MSG_ID=$(uuidgen || python3 -c "import uuid; print(uuid.uuid4())")

# 第一步：更新聊天，添加新的用户消息和助手占位消息
# childrenIds 会根据 parentId 重新计算，因此无需重新发送上一条助手消息
curl -X POST https://<host>/api/v1/chats/<chatId> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "chat": {
      "history": {
        "currentId": "'"$NEW_ASSISTANT_MSG_ID"'",
        "messages": {
          "'"$NEW_USER_MSG_ID"'": {
            "id": "'"$NEW_USER_MSG_ID"'",
            "role": "user",
            "content": "Can you tell me more about Paris?",
            "parentId": "'"$ASSISTANT_MSG_ID"'",
            "childrenIds": ["'"$NEW_ASSISTANT_MSG_ID"'"],
            "timestamp": '"$(date +%s)"',
            "models": ["gpt-5.6-sol"]
          },
          "'"$NEW_ASSISTANT_MSG_ID"'": {
            "id": "'"$NEW_ASSISTANT_MSG_ID"'",
            "role": "assistant",
            "content": "",
            "parentId": "'"$NEW_USER_MSG_ID"'",
            "childrenIds": [],
            "model": "gpt-5.6-sol",
            "modelName": "gpt-5.6-sol",
            "modelIdx": 0,
            "done": false,
            "timestamp": '"$(($(date +%s) + 1))"'
          }
        }
      }
    }
  }'

# 第二步：触发新助手消息的补全（与步骤 2 相同）
curl -X POST https://<host>/api/chat/completions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": "<chatId>",
    "id": "'"$NEW_ASSISTANT_MSG_ID"'",
    "user_message": {
      "id": "'"$NEW_USER_MSG_ID"'",
      "role": "user",
      "content": "Can you tell me more about Paris?",
      "parentId": "'"$ASSISTANT_MSG_ID"'",
      "childrenIds": ["'"$NEW_ASSISTANT_MSG_ID"'"],
      "models": ["gpt-5.6-sol"]
    },
    "messages": [
      { "role": "user", "content": "Hi, what is the capital of France?" },
      { "role": "assistant", "content": "The capital of France is Paris." },
      { "role": "user", "content": "Can you tell me more about Paris?" }
    ],
    "model": "gpt-5.6-sol",
    "stream": true,
    "session_id": "<session-uuid>"
  }'
```

:::note

通过 `POST /api/v1/chats/<chatId>` 更新现有聊天时，负载会与现有聊天数据**合并**。你只需包含要更改的字段。对于 `history.messages`，合并按消息进行，而不是按字段进行：省略的消息会保留，但你包含的消息会整体替换已存储的消息，因此请发送完整的消息对象。`childrenIds` 会根据每条消息的 `parentId` 重新计算，因此无需在父消息上设置它。

:::

## 实时事件 {#real-time-events}

此列表适用于 Open WebUI v0.13.4。从 v0.13.4 开始，笔记、在线状态、评论、收件箱和访问权限变更的更新会以带类型的消息形式通过 `events` 通道送达。如果客户端将 `events:note` 或 `note:presence` 作为通道名称监听，将收不到任何内容；客户端必须监听 `events` 并读取 `data.type`。

### 连接 {#connecting}

- 将 Socket.IO 客户端连接到 Open WebUI 主机的根地址，路径设为 `/ws/socket.io`，并传入 `{"token": "<token>"}` 作为 `auth` 对象。
- 令牌必须是登录时返回的会话令牌。Socket 会将其解码为 JWT，因此不接受 API 密钥（`sk-...`）。仅接受具有 `user` 或 `admin` 角色的用户。
- 令牌有效时，Socket 会加入 `user:<user id>` 房间，接收发送给该用户的所有事件，无论事件来自该用户的哪个会话。
- 连接后，发送 `user-join`，负载为 `{"auth": {"token": "<token>"}}`。它会返回 `{"id", "name"}`；如果用户可以使用频道，还会让用户加入其所属的每个频道对应的 `channel:<channel id>` 房间。
- 服务器每 30 秒检查一次每个 Socket 的令牌，并断开令牌已不再有效的 Socket。

### 按请求加入的房间 {#rooms-you-join-on-request}

| 发送事件 | 负载 | 加入的房间 | 条件 |
|---|---|---|---|
| `events:chat` | `{"chat_id": "<id>", "data": {"type": "join"}}` | `chat:<chat id>` | 对已保存聊天的读取权限。确认为 `true` 或 `false`。发送 `{"type": "leave"}` 可离开 |
| `note:join` | `{"note_id": "<id>", "auth": {"token": "<token>"}}` | `note:<note id>` | 已启用笔记，用户拥有笔记功能权限，并且拥有或可读取该笔记。发送 `note:leave`，负载为 `{"note_id": "<id>"}`，即可离开 |
| `comments:join` | `{"resource_type": "<type>", "resource_id": "<id>", "subscription_id": "<name>"}` | 该资源对应的一个评论房间 | 已启用评论，且用户可以读取该资源。`resource_type` 为 `model`、`knowledge`、`prompt`、`skill`、`tool`、`note` 或 `chat`。确认为 `{"ok": true}` 或 `{"error": "..."}`。一个 Socket 最多可持有 10 个订阅。使用相同的 `subscription_id` 发送 `comments:leave` 即可离开 |

### `events` 通道上的消息 {#messages-on-the-events-channel}

`events` 上的每条消息都采用 `{"data": {"type": "<type>", "data": {...}}}` 形式。聊天消息还会在顶层携带 `chat_id` 和 `message_id`。

| `type` | 发送到 | `data` |
|---|---|---|
| 聊天输出类型，例如 `chat:completion`、`status`、`source`、`files`、`chat:message:error` | `user:<id>` | 模型或工具发出的事件。有关这些类型，请参阅[事件](/features/extensibility/plugin/development/events) |
| 已保存聊天的聊天输出副本、`chat:messages` 和 `chat:active` | `chat:<id>`，发起请求的 Socket 除外 | 顶层还携带 `"shared": true` 和发送消息者的 `user_id` |
| `chat:presence` | `chat:<id>` | `{"users": [{"id", "name"}]}`，表示已打开该聊天的人员 |
| `typing` | `chat:<id>`，发送者除外 | `{"typing": true or false}`。顶层携带包含 `id` 和 `name` 的 `user`。你也可以使用 `events:chat` 发送它，负载为 `{"chat_id": "<id>", "data": {"type": "typing", "data": {"typing": true}}}`；这需要写入权限并已加入房间 |
| `chat:access` | 当再次检查聊天访问权限时，发送到已打开他人聊天的每个 Socket | `{}`。重新获取聊天。如果访问权限已被移除，该 Socket 已经离开房间 |
| `chat:list` | `user:<id>` | 有时是 `{"chat_id", "last_read_at", "folder_unread_counts"}`，有时没有内容。刷新聊天列表 |
| `chat:reload` | `user:<id>` | 无内容。重新获取聊天 |
| `note:updated` | `note:<id>` | 笔记。在编辑器中完成编辑后，为 `{"id", "page", "updated_at"}`，其中仅包含已保存的页面 |
| `note:presence` | `note:<id>` | `{"note_id", "users": [...]}`。每个用户都有 `id` 和 `name`，并在已知时包含 `page_id`、`document_id`、`cursor`、`cursor_position` 和 `updated_at` |
| `comments:changed` | 评论房间 | `{"resource_type", "resource_id"}`，不含评论文本。重新获取 `GET /api/v1/comments/?resource_type=<type>&resource_id=<id>` |
| `comments:unavailable` | 失去访问权限的那个 Socket | `{"resource_type", "resource_id"}`。该 Socket 已经离开房间 |
| `notifications:changed` | `user:<id>` | 无内容。重新获取 `GET /api/v1/notifications/inbox` |
| `access:updated` | 发送到组发生变更的用户的每个 Socket；管理员保存默认用户权限时，发送到每个 Socket | 无内容。组变更后，服务器会在发送此消息后立即断开这些 Socket，因此请重新连接并再次获取权限 |
| `machines:changed` | `user:<id>` | 无内容。重新获取机器、模型和工具 |
| `calendar:alert` | `user:<id>` | 日历提醒的 `{"event_id", "title", "description", "start_at", "minutes_until", "calendar_id", "location"}` |
| `channel:app` | `user:<id>` | 应用无法在频道中回复时，发送 `{"app_id", "app_name", "channel_id", "message_id", "parent_id", "reply": {"type": "error", "content"}}` |
| `encryption:available` | `channel:<id>` | 该频道中的私密聊天开始时发送 `{"channel", "session"}`，结束时将 `session` 设为 `null`。其数据包使用独立的 `encryption:event` 通道 |

### 其他通道 {#other-channels}

- `events:channel` 以 `{"channel_id", "message_id", "data": {"type", "data"}}` 形式将频道消息传送到 `channel:<id>` 房间。类型包括 `message`、`message:update`、`message:reply`、`message:delete`、`message:reaction:add`、`message:reaction:remove` 和 `typing`。`channel:created` 和 `channel:mute` 会发送到 `user:<id>`。
- 自动化运行完成时，`automation:result` 会发送到 `user:<id>`，其中包含 `automation_id`、`name`、`chat_id` 和 `status`。
- 协作笔记编辑使用 `ydoc:document:*` 和 `ydoc:awareness:update`，它们携带供编辑器使用的 Yjs 更新。

## 响应处理 {#response-processing}

### 解析助手响应 {#parsing-assistant-responses}

助手响应可能包裹在 Markdown 代码块中。可以按以下方式清理：

```bash

# 助手返回的原始响应示例
raw_response='```json
{
  "result": "The capital of France is Paris.",
  "confidence": 0.99
}
```'

# 清理响应（移除 Markdown 包装）
cleaned_response=$(echo "$raw_response" | sed 's/^```json//' | sed 's/```$//' | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//')

echo "$cleaned_response" | jq '.'
```

此清理过程包括：

- 移除 ````json` 前缀
- 移除 ```` 后缀
- 修剪空白字符
- 验证 JSON

## API 参考 {#api-reference}

### DTO 结构 {#dto-structures}

#### Chat DTO（完整结构） {#chat-dto-complete-structure}

```json
{
  "id": "chat-uuid-12345",
  "title": "New Chat",
  "models": ["gpt-5.6-sol"],
  "files": [],
  "tags": [],
  "params": {
    "temperature": 0.7,
    "max_tokens": 1000
  },
  "timestamp": 1720000000,
  "messages": [
    {
      "id": "user-msg-id",
      "role": "user",
      "content": "Hi, what is the capital of France?",
      "timestamp": 1720000000,
      "models": ["gpt-5.6-sol"],
      "childrenIds": ["assistant-msg-id"]
    },
    {
      "id": "assistant-msg-id",
      "role": "assistant",
      "content": "",
      "parentId": "user-msg-id",
      "childrenIds": [],
      "model": "gpt-5.6-sol",
      "modelName": "gpt-5.6-sol",
      "modelIdx": 0,
      "done": false,
      "timestamp": 1720000001
    }
  ],
  "history": {
    "currentId": "assistant-msg-id",
    "messages": {
      "user-msg-id": {
        "id": "user-msg-id",
        "role": "user",
        "content": "Hi, what is the capital of France?",
        "timestamp": 1720000000,
        "models": ["gpt-5.6-sol"],
        "childrenIds": ["assistant-msg-id"]
      },
      "assistant-msg-id": {
        "id": "assistant-msg-id",
        "role": "assistant",
        "content": "",
        "parentId": "user-msg-id",
        "childrenIds": [],
        "model": "gpt-5.6-sol",
        "modelName": "gpt-5.6-sol",
        "modelIdx": 0,
        "done": false,
        "timestamp": 1720000001
      }
    }
  },
  "currentId": "assistant-msg-id"
}
```

#### ChatCompletionsRequest DTO {#chatcompletionsrequest-dto}

```json
{
  "chat_id": "chat-uuid-12345",
  "id": "assistant-msg-id",
  "user_message": {
    "id": "user-msg-id",
    "role": "user",
    "content": "Hi, what is the capital of France?",
    "parentId": null,
    "childrenIds": ["assistant-msg-id"],
    "timestamp": 1720000000,
    "models": ["gpt-5.6-sol"]
  },
  "messages": [
    {
      "role": "user",
      "content": "Hi, what is the capital of France?"
    }
  ],
  "model": "gpt-5.6-sol",
  "stream": true,
  "background_tasks": {
    "title_generation": true,
    "tags_generation": false,
    "follow_up_generation": false
  },
  "features": {
    "code_interpreter": false,
    "web_search": false,
    "image_generation": false,
    "memory": false
  },
  "variables": {
    "{{USER_NAME}}": "",
    "{{USER_LANGUAGE}}": "en-US",
    "{{CURRENT_DATETIME}}": "2025-07-14T12:00:00Z",
    "{{CURRENT_TIMEZONE}}": "Europe"
  },
  "session_id": "session-uuid-67890",
  "filter_ids": [],
  "files": [
    {
      "id": "knowledge-collection-id",
      "type": "collection",
      "status": "processed"
    }
  ]
}
```

#### ChatCompletionMessage DTO {#chatcompletionmessage-dto}

```json
{
  "role": "user",
  "content": "Hi, what is the capital of France?"
}
```

#### History DTO {#history-dto}

```json
{
  "currentId": "assistant-msg-id",
  "messages": {
    "user-msg-id": {
      "id": "user-msg-id",
      "role": "user",
      "content": "Hi, what is the capital of France?",
      "timestamp": 1720000000,
      "models": ["gpt-5.6-sol"],
      "childrenIds": ["assistant-msg-id"]
    },
    "assistant-msg-id": {
      "id": "assistant-msg-id",
      "role": "assistant",
      "content": "The capital of France is Paris.",
      "parentId": "user-msg-id",
      "childrenIds": [],
      "model": "gpt-5.6-sol",
      "modelName": "gpt-5.6-sol",
      "modelIdx": 0,
      "timestamp": 1720000001
    }
  }
}
```

#### Message DTO（完整结构） {#message-dto-complete-structure}

**用户消息：**

```json
{
  "id": "user-msg-id",
  "role": "user",
  "content": "Hi, what is the capital of France?",
  "timestamp": 1720000000,
  "models": ["gpt-5.6-sol"],
  "childrenIds": ["assistant-msg-id"]
}
```

**助手消息：**

```json
{
  "id": "assistant-msg-id",
  "role": "assistant",
  "content": "The capital of France is Paris.",
  "parentId": "user-msg-id",
  "childrenIds": [],
  "model": "gpt-5.6-sol",
  "modelName": "gpt-5.6-sol",
  "modelIdx": 0,
  "done": true,
  "timestamp": 1720000001
}
```

### 响应示例 {#response-examples}

#### 创建聊天响应 {#create-chat-response}

```json
{
  "id": "chat-uuid-12345",
  "user_id": "user-uuid",
  "title": "New Chat",
  "chat": {
    "title": "New Chat",
    "models": ["gpt-5.6-sol"],
    "messages": [
      {
        "id": "user-msg-id",
        "role": "user",
        "content": "Hi, what is the capital of France?",
        "timestamp": 1720000000,
        "models": ["gpt-5.6-sol"],
        "childrenIds": ["assistant-msg-id"]
      },
      {
        "id": "assistant-msg-id",
        "role": "assistant",
        "content": "",
        "parentId": "user-msg-id",
        "childrenIds": [],
        "model": "gpt-5.6-sol",
        "modelName": "gpt-5.6-sol",
        "modelIdx": 0,
        "done": false,
        "timestamp": 1720000001
      }
    ],
    "history": {
      "currentId": "assistant-msg-id",
      "messages": {
        "user-msg-id": {
          "id": "user-msg-id",
          "role": "user",
          "content": "Hi, what is the capital of France?",
          "timestamp": 1720000000,
          "models": ["gpt-5.6-sol"],
          "childrenIds": ["assistant-msg-id"]
        },
        "assistant-msg-id": {
          "id": "assistant-msg-id",
          "role": "assistant",
          "content": "",
          "parentId": "user-msg-id",
          "childrenIds": [],
          "model": "gpt-5.6-sol",
          "modelName": "gpt-5.6-sol",
          "modelIdx": 0,
          "done": false,
          "timestamp": 1720000001
        }
      }
    },
    "currentId": "assistant-msg-id"
  },
  "updated_at": 1720000000,
  "created_at": 1720000000
}
```

#### 最终聊天响应（补全后） {#final-chat-response-after-completion}

```json
{
  "id": "chat-uuid-12345",
  "title": "Capital of France Discussion",
  "chat": {
    "models": ["gpt-5.6-sol"],
    "history": {
      "currentId": "assistant-msg-id",
      "messages": {
        "user-msg-id": {
          "id": "user-msg-id",
          "role": "user",
          "content": "Hi, what is the capital of France?",
          "timestamp": 1720000000,
          "models": ["gpt-5.6-sol"],
          "childrenIds": ["assistant-msg-id"]
        },
        "assistant-msg-id": {
          "id": "assistant-msg-id",
          "role": "assistant",
          "content": "The capital of France is Paris. Paris is not only the capital but also the most populous city in France, known for its iconic landmarks such as the Eiffel Tower, the Louvre Museum, and Notre-Dame Cathedral.",
          "parentId": "user-msg-id",
          "childrenIds": [],
          "model": "gpt-5.6-sol",
          "modelName": "gpt-5.6-sol",
          "modelIdx": 0,
          "done": true,
          "timestamp": 1720000001
        }
      }
    },
    "currentId": "assistant-msg-id"
  }
}
```

#### OWUIKnowledge DTO（知识集合） {#owuiknowledge-dto-knowledge-collection}

```json
{
  "id": "knowledge-collection-id",
  "type": "collection",
  "status": "processed",
  "name": "Geography Knowledge Base",
  "description": "Contains information about world geography and capitals",
  "created_at": 1720000000,
  "updated_at": 1720000001
}
```

#### 模型信息响应 {#model-information-response}

```json
{
  "id": "gpt-5.6-sol",
  "name": "GPT-5.6 Sol",
  "model": "gpt-5.6-sol",
  "base_model_id": "gpt-5.6-sol",
  "meta": {
    "description": "OpenAI's frontier model for complex professional work",
    "capabilities": ["text", "vision", "function_calling"],
    "context_length": 128000,
    "max_output_tokens": 4096
  },
  "params": {
    "temperature": 0.7,
    "top_p": 1.0,
    "frequency_penalty": 0.0,
    "presence_penalty": 0.0
  },
  "created_at": 1720000000,
  "updated_at": 1720000001
}
```

### 字段参考指南 {#field-reference-guide}

#### 必填字段与可选字段 {#required-vs-optional-fields}

**聊天创建——必填字段：**

- `title`：聊天标题（字符串）
- `models`：模型名称数组（string[]）
- `messages`：初始消息数组
- `history`：包含 `currentId` 和 `messages` 映射的消息树

**聊天创建——可选字段：**

- `files`：用于 RAG 的知识文件（默认为空数组）
- `tags`：聊天标签（默认为空数组）
- `params`：模型参数（默认为空对象）

**消息结构——用户消息：**

- **必填：**`id`、`role`、`content`、`timestamp`、`models`、`childrenIds`
- **可选：**`parentId`（用于消息线程；聊天中的第一条消息可省略）

**消息结构——助手消息：**

- **必填：**`id`、`role`、`content`、`parentId`、`childrenIds`、`model`、`modelName`、`modelIdx`、`timestamp`
- **可选：**`done`（布尔值，默认为 false）、其他元数据字段

**ChatCompletionsRequest——必填字段：**

- `chat_id`：目标聊天 ID
- `id`：助手消息 ID
- `messages`：ChatCompletionMessage 数组
- `model`：模型标识符

**ChatCompletionsRequest——可选字段：**

- `session_id`：会话标识符（由调用方生成）。与 `chat_id` 一起提供时，补全会作为后台任务运行并返回 `task_ids`；省略它可通过 HTTP 进行流式传输。
- `stream`：启用流式传输（默认为 false）
- `background_tasks`：控制自动任务
- `features`：启用/禁用功能
- `variables`：模板变量
- `filter_ids`：管道过滤器
- `files`：用于 RAG 的知识库

#### 字段约束 {#field-constraints}

**时间戳：**

- 格式：`history.messages` 中的消息时间戳使用以**秒**为单位的 Unix 时间戳（不是毫秒）
- 顶层聊天 `timestamp` 字段使用毫秒
- 示例：`1720000000`（2024 年 7 月 3 日）

**UUID：**

- 所有 ID 字段（`id`、`parentId`、`session_id`）都应使用有效的 UUID v4 格式
- 示例：`550e8400-e29b-41d4-a716-446655440000`
- ID 由**调用方生成**，而不是由服务器分配

**模型名称：**

- 必须与 Open WebUI 实例中的可用模型匹配
- 常见示例：`gpt-5.6-sol`、`gpt-5.6-luna`、`claude-sonnet-5`

**会话 ID：**

- 可以是任何唯一的字符串标识符
- 建议：为保持一致性，使用 UUID 格式

**知识文件状态：**

- 有效值：`"processed"`、`"processing"`、`"error"`
- 补全时仅使用 `"processed"` 文件

## 重要说明 {#important-notes}

- 此工作流程兼容 Open WebUI 与后端编排场景
- **关键：在 history 对象中使用 `currentId`（camelCase）**，而不是 `current_id`（snake_case）
- **关键：每条消息都要包含 `childrenIds`**。前端使用它构建消息树
- 此方法无需更改前端代码
- 需要时，`stream: true` 参数可启用实时响应流式传输
- `outlet()` 过滤器在 `/api/chat/completions` 的流式和非流式路径中均以内联方式运行，由 [`ENABLE_API_OUTLET_FILTERS`](/reference/env-configuration#enable_api_outlet_filters)（默认 `True`）控制。请求体中既不需要 `chat_id`，也不需要消息 `id`；两者都不存在时，系统会根据你发送的 `messages` 和助手回复重建对话，并为其生成消息 ID。内联执行不会重写 HTTP 响应体，因此过滤后的负载绝不会通过 HTTP 返回给 API 调用方。独立的 `/api/chat/completed` 端点已弃用，但为向后兼容而保留；它仍是让过滤后的负载返回给你的方式。完整说明请参阅[API 请求的过滤器行为](/features/extensibility/plugin/functions/filter#filter-behavior-with-api-requests)
- 可以通过 `background_tasks` 对象控制标题生成等后台任务
- 会话 ID 有助于跨请求维护对话上下文
- **知识集成：**使用 `files` 数组包含知识库，以获得 RAG 能力
- **响应解析：**处理可能包裹在 Markdown 代码块中的 JSON 响应
- **错误处理：**为网络超时和服务器错误实现适当的重试机制

## 常见问题 {#common-pitfalls}

| 症状 | 原因 | 解决方法 |
|---|---|---|
| 聊天已创建，但消息未显示在 UI 中 | 消息缺少 `childrenIds` | 添加 `childrenIds` 数组，将父消息与子消息关联起来 |
| 聊天显示“How can I help you today?” | 使用了 `current_id` 而不是 `currentId` | 在 history 对象中使用 camelCase 形式的 `currentId` |
| 补全正常，但响应仅显示为通知 | 触发补全前，助手消息不在聊天历史中 | 在补全请求中传入助手消息的 `id` 和 `user_message`（步骤 2），或在步骤 1 中包含助手占位消息 |
| 数据库中存在消息，但前端显示空聊天 | 缺少 `parentId` 或树形关联损坏 | 确保每条消息都有正确的 `parentId`，且父消息的 `childrenIds` 包含子消息 |
| 补全运行后，用户消息在页面重新加载时消失 | `/api/chat/completions` 请求缺少 `user_message`，导致助手消息在没有父消息的情况下保存 | 在补全请求中发送包含用户消息 `id` 的 `user_message`（步骤 2） |

## 总结 {#summary}

使用 Open WebUI 后端 API 可以：

1. **发起包含消息的聊天**：使用用户输入和空助手占位消息创建对话（包括正确的 `childrenIds` 和 `currentId`）
2. **触发回复**：生成 AI 响应（可选择集成知识）
3. **监控完成情况**：通过流式传输或轮询等待助手响应
4. **获取最终聊天**：检索并解析已完成的对话

**增强能力：**

- **RAG 集成**：包含知识库，以获得上下文感知响应
- **异步处理**：通过流式传输或轮询处理长时间运行的 AI 操作
- **响应解析**：清理并验证助手返回的 JSON 响应
- **会话管理**：跨请求维护对话上下文

这使得后端控制的工作流仍能正确显示在 Web UI 前端聊天界面中，从而在程序化控制与用户体验之间实现无缝集成。

此方法的主要优势是，在允许后端完全编排对话流程（包括知识集成和异步响应处理等高级功能）的同时，保持与 Open WebUI 前端的完全兼容。

## 测试 {#testing}

你可以按照上面提供的分步 CURL 示例测试实现。请确保将占位值替换为实际的：

- 主机 URL
- 身份验证令牌
- 聊天 ID（来自创建聊天的响应）
- 消息 ID（你生成的 UUID）
- 模型名称（与已配置的模型匹配）

:::tip

从简单的用户消息开始，待基本流程正常运行后，再逐步添加知识集成和高级功能等复杂内容。

:::
