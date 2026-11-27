---
sidebar_position: 3
title: "构建应用"
---

# 构建应用

应用是 Open WebUI 要连接的服务器。管理员负责安装；管理员和频道创建者按照[应用](/features/channels/apps)中的说明将它添加到频道。

## 使用 oix 快速开始 {#quick-start-with-oix}

构建应用最快的方式是使用 Python SDK [oix](https://github.com/open-webui/oix#readme)（Python 3.11 或更高版本）。它实现了本页介绍的协议，因此你的代码只需处理事件：

```bash
python -m pip install oix
```

嵌入卡片和链接按钮需要 oix 0.7.0 或更高版本。提及需要 oix 0.8.0 或更高版本。

```python
from oix import App

app = App(
    manifest_id="hello",
    name="Hello",
    scopes=["channels:messages:read", "channels:messages:write"],
)


@app.on("channel.message.created")
async def hello(event):
    if event.content == "hello":
        await event.reply("Hello!")


if __name__ == "__main__":
    app.run()
```

将其保存为 `app.py`。应用从 `API_KEY` 读取 API 密钥，并从 `APP_PRIVATE_KEY_FILE` 指定的文件中读取私钥；oix README 提供了一个脚本，可将两者一次性写入 `.env`。使用 `. ./.env && python app.py` 启动应用。它监听 `8000` 端口的 `/events` 路径。将其部署在启用了 WebSocket 升级的 HTTPS 服务之后，例如其 App URL 为 `https://hello.example.com/events`。使用该 URL 和 API 密钥[安装应用](/features/channels/apps#install-an-app)，将它添加到频道，然后发送 `hello`。

要针对本地 Open WebUI 进行测试，请同时按照 oix 的[本地开发](https://github.com/open-webui/oix#local-development)步骤和[私有及明文 HTTP 应用服务器](/features/channels/apps#private-and-plain-http-app-servers)中的说明操作。

使用其他语言编写的应用可以直接实现下述协议。

## 应用需要提供的内容 {#what-an-app-provides}

1. 位于 App URL 的可选**应用清单**。
2. 位于 App URL 路径下的 **Socket.IO 服务器**，使用 `/apps` 命名空间。
3. 一个 **Ed25519 密钥对**，例如通过 `openssl genpkey -algorithm ED25519 > app-private-key.pem` 生成，并通过 `openssl pkey -in app-private-key.pem -pubout` 获取公钥。公钥写入应用清单；私钥用于对连接证明签名。
4. 一个 **API 密钥**：由你创建并交给管理员的随机机密，例如使用 `openssl rand -hex 32` 生成。Open WebUI 在清单请求和 Socket.IO 握手时，以 `Authorization: Bearer <API key>` 的形式发送它。拒绝未携带该密钥的请求。

## 应用清单 {#manifest}

Open WebUI 携带 API 密钥发送 `GET <App URL>`。应用必须在 10 秒内以 HTTP 200 和一个不超过 256 KiB 的 JSON 对象响应：

```json
{
  "id": "hello",
  "name": "Hello",
  "description": "Says hello.",
  "profile_image_url": "https://example.com/hello.png",
  "public_key": "-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----\n",
  "requested_scopes": ["channels:mentions:read", "channels:messages:write"]
}
```

| 字段 | 规则 |
|-------|-------|
| `id` | 必填，1 到 100 个字符。用于标识应用，已安装应用的该值必须保持不变。 |
| `name` | 必填，1 到 100 个字符。 |
| `description` | 可选，最多 2,000 个字符。 |
| `profile_image_url` | 可选。不含凭据且最长 2,048 个字符的 `http(s)` URL，或 base64 编码的 `data:image/png`、`jpeg`、`gif` 或 `webp` URL。总大小不超过 192 KiB。用户浏览器会直接加载它。 |
| `public_key` | 必填。PEM 格式（`-----BEGIN PUBLIC KEY-----`）的 Ed25519 公钥。Open WebUI 会在安装时固定该公钥。 |
| `requested_scopes` | 必填。由[权限范围](/features/channels/apps#scopes)组成的列表。 |

未知字段会使应用清单无效。

## 连接 {#connection}

对于 App URL `https://app.example.com/events`，Open WebUI 会作为 Socket.IO 客户端连接到 `https://app.example.com`，Socket.IO 路径为 `/events/socket.io`，仅使用 WebSocket 传输，命名空间为 `/apps`，请求头为 `Authorization: Bearer <API key>`。如果应用位于反向代理之后，代理必须在 Socket.IO 路径上传递 WebSocket 升级。随后，握手通过带确认的 Socket.IO 事件进行：

1. Open WebUI 发送 `app:connect`，内容为：

   ```json
   { "app_id": "<id Open WebUI assigned>", "challenge": "<random UUID>", "connection_token": null }
   ```

   当 Open WebUI 不持有令牌时，`connection_token` 为 `null`：包括首次连接、管理员输入新 API 密钥后、应用公钥更改后以及卸载后。否则，它是管理员上次点击**连接（Connect）**时应用返回的令牌。

2. 应用确认如下：

   ```json
   { "status": 200, "data": { "installation_id": "<UUID>", "connection_token": "<string>", "proof": "<JWT>" } }
   ```

   应用选择 `installation_id`（在此次安装期间保持不变的 UUID）和 `connection_token`（最多 8,192 个字符）。管理员点击**连接（Connect）**时，Open WebUI 会加密存储令牌，并在每次重新连接时发送。自动重新连接时，Open WebUI 会保留已存储的令牌并忽略应用返回的令牌，因此应用必须继续接受自己签发的令牌。

   **应用**使用其 **Ed25519 私钥**对 `proof` 签名（JWT 算法为 `EdDSA`，请求头 `typ` 为 `oix-connect+jwt`）。Open WebUI 使用清单中固定的公钥进行验证。必需的声明如下：

   | 声明 | 值 |
   |-------|-------|
   | `aud` | `oix:connect` |
   | `sub` | `installation_id` |
   | `app_id` | 来自 `app:connect` 的 `app_id` |
   | `manifest_id` | 应用清单的 `id` |
   | `challenge` | 来自 `app:connect` 的 `challenge` |
   | `token_hash` | 此确认中 `connection_token` 的 SHA-256 十六进制摘要 |
   | `iat`、`exp` | 整数，`exp` 最多比 `iat` 晚 60 秒 |

   Open WebUI 持有令牌期间，`installation_id` 必须保持不变。当它发送 `null` 时，应用可以返回新的 `installation_id`。

3. Open WebUI 发送内容为 `{}` 的 `app:ready`。应用必须严格以 `{"status": 200, "data": {"received": true}}` 确认。

此后连接进入活跃状态。Open WebUI 使用 API 密钥验证自身身份；应用使用签名证明验证自身身份。每个 Open WebUI 工作进程都会建立自己的连接，因此应用必须接受同一安装的多个连接。

整个连接必须在 20 秒内完成，每次确认必须在 10 秒内完成。在 Open WebUI 验证证明之前，每个 `app:request` 都会失败并返回 `App connection is not ready`。从验证完成到应用确认 `app:ready` 之前，只有 `ping` 可用。

## 事件 {#events}

Open WebUI 发送 `app:event` 并等待确认。每个事件都携带 `type`、`app_id`（Open WebUI 为应用分配的 ID）和 `installation_id`。

**交互**会发送到 `channel.mention` 和 `channel.action`：

```json
{
  "id": "<operation id>",
  "type": "channel.mention",
  "actor": { "id": "<user id>", "name": "Ada", "is_admin": false },
  "channel": { "id": "<channel id>" },
  "data": { "text": "<@A:<app_id>|Hello> hi", "message_id": "<id>", "parent_id": null },
  "execution_token": "<token>",
  "source": null,
  "app_id": "<app id>",
  "installation_id": "<installation id>"
}
```

- `channel.mention`：用户提及了应用。`data.text` 是原始消息，其中提及以 `<@A:<app_id>|<name>>` 的形式出现。如果提及发布在讨论串中，`data.parent_id` 是讨论串的根消息。需要 `channels:mentions:read` 或 `channels:messages:read`。必须在 **10 秒**内严格以 `{"status": 200, "data": {"received": true}}` 确认。这只确认送达。之后使用 `create_message` 操作发布回复，该操作需要 `channels:messages:write`；将 `data.message_id` 作为 `reply_to_id`，并将 `data.parent_id` 作为 `parent_id`，即可在原位置回复该提及。
- `channel.action`：用户点击了按钮。`data` 包含 `message_id`、`etag`、`parent_id`、`action_id` 和按钮的 `context`；`source` 包含消息的 `id` 和 `updated_at`。必须在 **3 秒**内给出[回复](#replying-to-interactions)。

**消息事件**会发送给拥有 `channels:messages:read` 的应用，涵盖其已加入频道中的每条消息，包括应用自己的消息：`channel.message.created`、`channel.message.updated` 和 `channel.message.deleted`。必须在 10 秒内以 2xx `status` 确认。

```json
{
  "id": "<event id>",
  "type": "channel.message.created",
  "channel": { "id": "<channel id>" },
  "message": {
    "id": "<id>", "channel_id": "<id>", "author": { "type": "user", "id": "<id>" },
    "content": "...", "parent_id": null, "reply_to_id": null, "files": [], "actions": [], "embeds": [],
    "created_at": "<ns>", "updated_at": "<ns>", "etag": "<ns>"
  },
  "event_token": "<token>",
  "app_id": "<app id>",
  "installation_id": "<installation id>"
}
```

`author.type` 为 `user`、`model`、`webhook` 或 `app`。`model` 和 `webhook` 遵循消息上存储的标签。该字段只能由 Open WebUI 设置：通过频道 webhook 发布的消息为 `webhook`，模型的回复为 `model`。发布或编辑消息的请求中附带的标签会被忽略。触发模型回复的提及者和管理员仍可编辑 `model` 消息的文本，`webhook` 消息的文本则可由创建该 webhook 的账户编辑。对于模型回复，只有在回复完成后才发送一次 `channel.message.updated`。消息删除事件仅携带 `id`、`channel_id`、`parent_id`、`author` 和 `updated_at`。消息事件采用尽力投递：每个事件只发送一次，发送失败或在应用断开连接期间发生的事件会被丢弃。

拥有 `channels:messages:read` 的应用会收到两次提及：一次为 `channel.mention`，另一次为 `channel.message.created`。请选择其中一个处理程序进行回复。

`execution_token` 和 `event_token` 由 Open WebUI 签名。应用通过下述 `authorize` 或 `verify_event` 操作将令牌发回以进行校验。`execution_token` 的有效期为 24 小时，`event_token` 的有效期为 5 分钟。应用的 API 密钥或公钥更改后，两者都会失效。

## 回复交互 {#replying-to-interactions}

使用 `{"status": 200, "data": <reply>}` 确认按钮点击（`channel.action`），回复大小不得超过 256 KiB：

```json
{
  "status": 200,
  "data": {
    "type": "message",
    "visibility": "channel",
    "content": "Ready to publish?",
    "actions": [{ "action_id": "publish", "label": "Publish", "context": { "draft": 42 } }]
  }
}
```

| 字段 | 含义 |
|-------|---------|
| `type` | `message`（默认）、`update`、`ack`、`download` 或 `error`。 |
| `visibility` | `private`（默认，仅点击者可见）或 `channel`。 |
| `content` | Markdown，最多 32,000 个字符。 |
| `title` | 私密回复的可选标题，最多 200 个字符。 |
| `actions` | 最多 30 个按钮。每个按钮包含一个 `label`（最多 200 个字符），以及以下两者之一：一个 `action_id`（最多 100 个字符）和可选的 `context` 对象（会在 `channel.action` 中返回），或一个 `url`（不含凭据、最长 2,048 个字符、在新标签页中打开的 `http(s)` 链接）。仅允许在 `visibility` 为 `channel` 的 `message` 或 `update` 中使用。 |
| `embeds` | 在 `message` 或 `update` 中最多 10 张卡片。每张卡片接受 `title`（最多 256 个字符）、`description`（Markdown，最多 4,096 个字符）、`url`（为标题添加链接）、`color`（用于强调色条的 `0` 到 `0xFFFFFF` 整数）、`author`（`{"name": ...}`，最多 256 个字符）、`footer`（`{"text": ...}`，最多 2,048 个字符）、`thumbnail`（`{"url": ...}`），以及最多 25 个 `fields`（`name` 最多 256 个字符，`value` 为最多 1,024 个字符的 Markdown，`inline` 可选）。一条消息中所有卡片的文本总计最多 6,000 个字符。URL 必须为不含凭据、最长 2,048 个字符的 `http(s)` 地址。用户浏览器会直接加载缩略图。 |
| `parent_id`、`reply_to_id` | 将频道回复发布到讨论串中，或作为某条消息的回复。不含 `parent_id` 的频道回复会落在频道顶层。 |
| `filename` | 用于 `download`：由字母、数字、`_`、`.` 和 `-` 组成，以 `.md` 结尾。默认为 `report.md`。 |

- `visibility` 为 `channel` 的 `message` 会发布频道消息，并需要 `channels:messages:write`。
- `update` 会替换所点击按钮所属消息的内容、按钮和卡片。它需要 `channels:messages:write`。请将 `visibility` 设置为 `channel`：使用默认的 `private` 时，按钮会被拒绝，用户还会收到内容的私密副本。
- `download` 将 `content` 作为 Markdown 文件提供给用户。
- `error` 向用户显示 `content`；当 `content` 为空时，显示 `The app could not complete this operation.`。
- `download` 应使用默认的 `visibility` 值 `private` 发送；使用 `channel` 时不会在任何位置显示。无论使用哪种可见性，`error` 都只向点击者显示。
- `ack` 不显示任何内容。以 `{"type": "ack"}` 的形式发送。

未知字段会使回复无效。

要拒绝提及或按钮点击，请以错误 `status` 和 `error` 字符串进行确认，例如 `{"status": 403, "error": "Only the on-call team can run this."}`。Open WebUI 最多显示该字符串的 2,000 个字符；如果未提供该字符串，则显示状态码对应的消息。提及后，Open WebUI 会以应用名义在频道中发布消息，作为以 `App error:` 开头的回复，因此频道中的每个人都能看到。如果应用无法在该频道发布消息，则只有提及它的用户能看到该消息。按钮点击后，只有点击者能看到。[故障排除](/features/channels/apps#troubleshooting)列出了管理员和用户会看到的消息。

## 调用 Open WebUI {#calling-open-webui}

应用在同一连接上发送 `app:request`，内容为 `{"operation": "<name>", "arguments": {...}}`。确认为 `{"status": 200, "data": ...}` 或 `{"status": <code>, "error": "<message>"}`。每个请求必须在 10 秒内完成。请求只能作用于应用作为成员加入的频道。

| 操作 | 参数 | 权限范围 | 返回值 |
|-----------|-----------|-------|---------|
| `ping` | `{}` | 无 | `{"received": true}` |
| `get_me` | 无 | 无 | 应用的记录 |
| `list_channels` | 无 | `channels:read` | 已加入的频道：`id`、`name`、`type`、`is_private` |
| `list_messages` | `channel_id`，可选的 `parent_id`、`before`、`limit`（1 到 100，默认 50） | `channels:messages:read` | 按最新在前排列的 `messages` 和 `next_cursor` |
| `create_message` | `channel_id`，可选的 `content`、`actions`、`embeds`、`parent_id`、`reply_to_id` | `channels:messages:write` | 新消息，包括其 `etag` |
| `update_message` | `message_id`、`etag`，可选的 `content`、`actions`、`embeds` | `channels:messages:write` | 更新后的消息 |
| `authorize` | `token`：一个 `execution_token` | 交互所需的权限范围 | `authorized`、`operation_id`、`actor`、`channel_id`、`type`、`data` |
| `verify_event` | `token`：一个 `event_token` | `channels:messages:read` | 经过验证的事件 |

`update_message` 只能编辑应用自己的消息。`content`、`actions` 和 `embeds` 会替换旧值，因此省略的字段会被清空。如果自读取 `etag` 后消息已发生变化，请求会失败并返回状态 412（`Message changed`）。

## 长时间运行的任务 {#long-running-work}

提及只需要送达回执，因此应用可以在之后执行任务，并通过 `create_message` 发布结果。按钮点击必须在 3 秒内回复。对于耗时更长的任务：

1. 立即回复 `{"type": "ack"}`。用户不会看到任何内容。
2. 执行任务。
3. 可选择使用事件的 `execution_token`（有效期为 24 小时）调用 `authorize`，确认用户仍可使用应用并读取频道。
4. 使用 `create_message` 操作发布结果，并使用事件中的 `data.parent_id` 以留在讨论串中。这需要 `channels:messages:write`，结果是频道中所有人都能看到的频道消息。私密回复只能作为对按钮点击的直接回复。

## 限制 {#limits}

| 限制项 | 值 |
|-------|-------|
| Socket.IO 数据包 | 16 MiB，仅限 JSON 文本。二进制数据包会被拒绝。 |
| 发送给应用的事件 | 1 MiB |
| 对事件的回复 | 256 KiB |
| 应用清单响应 | 256 KiB，须在 10 秒内返回 |
| 消息内容 | 32,000 个字符，最多 30 个按钮和 10 张卡片，卡片文本共 6,000 个字符 |
| 连接和握手 | 总计 20 秒，每次确认 10 秒 |
| 提及回执时间 | 10 秒 |
| 按钮点击回复时间 | 3 秒 |
| 消息事件回复时间 | 10 秒 |
| `app:request` 处理 | 10 秒 |
| `execution_token` 有效期 | 24 小时 |
| `event_token` 有效期 | 5 分钟 |
