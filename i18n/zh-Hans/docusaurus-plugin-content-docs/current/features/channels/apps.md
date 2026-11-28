---
sidebar_position: 2
title: "应用"
---

# 应用

应用是以成员身份加入[频道](/features/channels)的外部服务。提及应用后，它会在频道中回复。应用可以发布带卡片和按钮的消息、私密回复你的按钮点击、更新自己发布的消息；经管理员允许后，还可以跟进其所在频道中的每一条消息。

应用运行在自己的服务器上。Open WebUI 会主动建立到应用的连接，因此 Open WebUI 本身可以留在私有网络中，无需公开回调地址。如果只是向频道发布消息而不需要回复任何人，使用[频道 webhook](/features/administration/webhooks#3-channel-webhooks-external-message-integration) 会更简单。

:::info
应用功能目前处于实验阶段。**设置 > 集成（Settings > Integrations）**（管理员区域）中的**应用（Apps）**部分会显示**实验性（Experimental）**标记。
:::

---

## 在频道中使用应用 {#using-apps-in-a-channel}

### 将应用添加到频道 {#add-an-app-to-a-channel}

1. 打开频道，点击标题栏中人物图标旁的成员数量。
2. 点击**添加成员（Add Member）**。
3. 在**应用（Apps）**下选择应用，然后点击**添加（Add）**。

应用现在会显示在成员列表中，并带有**应用（App）**标记。要将其移出频道，请使用同一列表中该应用旁的移除按钮。

只有频道创建者和管理员可以添加及移除应用。添加应用时，你还需要拥有该应用的访问权限，并且应用必须已启用。你只能看到获准使用的应用。应用可以加入标准频道和群组频道；私信仍仅在人与人之间进行。

获得**读取已加入频道中的消息和历史记录（Read messages and history in joined channels）**权限范围的应用，会收到频道中发布的每条消息，并可读取频道历史记录。将应用添加到包含敏感内容的频道之前，请向管理员确认该应用拥有哪些权限范围。

### 提及应用 {#mention-an-app}

在应用已加入的频道中输入 `@`，然后从建议列表的**应用（Apps）**分组中选择它。你也可以输入 `@` 和应用的完整名称；请参阅[标记人员和链接频道](/features/channels#tagging-people-and-linking-channels)。发送消息后，应用就会收到它。一条消息最多只会送达其中提及的前 10 个应用。应用会确认已收到消息，并在准备好后将回复发布到频道中。

### 私密回复与频道回复 {#private-and-channel-replies}

应用会通过频道消息回复提及。按钮点击则可以通过两种方式回复：

- **私密回复**显示在你点击按钮的应用消息下方，标有**仅你可见（Only visible to you）**，并带有**关闭（Dismiss）**链接。只有你能看到这些回复，而且它们只会保留到你关闭它们、重新加载页面或切换到其他频道或讨论串为止。只有私密回复到达时你仍位于该频道或讨论串中，它才会显示。文件下载也始终仅向你显示。
- **频道回复**以应用名称作为普通频道消息发布，并带有**应用（App）**标签。频道中的每个人都能看到，且回复会保留在历史记录中。

点击按钮后，应用还可以发送 Markdown 文件作为私密回复。该文件显示为带文件名的**下载（Download）**按钮，例如**下载 report.md（Download report.md）**，点击后会将文件保存到你的设备。

如果提及失败，Open WebUI 会以应用名义在你的消息下回复失败原因，并以 `App error:` 开头。频道中的每个人都能看到。如果应用无法在频道中发布消息，例如因为它已禁用或缺少发布消息的权限范围，失败原因会显示在你的消息下方，且仅你可见。如果按钮点击失败，失败原因会显示在应用消息下方，且仅你可见。请让管理员在**设置 > 集成（Settings > Integrations）**（管理员区域）的**应用（Apps）**下检查该应用。[故障排除](#troubleshooting)列出了你最可能看到的消息。

### 按钮 {#buttons}

应用发布的频道消息可以包含按钮和卡片。链接按钮会在新标签页中打开网页。其他按钮会将点击事件发送给应用，应用可以私密回复、发布新消息，或更新按钮所属的消息。

---

## 设置应用 {#setting-up-apps}

### 启用应用 {#enable-apps}

1. 前往**设置 > 通用（Settings > General）**（管理员区域）。
2. 开启**应用（Apps）**和**频道（Channels）**，然后保存。应用仅在频道中运行，因此两项都需要开启。
3. **设置 > 集成（Settings > Integrations）**（管理员区域）底部会出现**应用（Apps）**部分。

同一开关也可通过 [`ENABLE_APPS`](/reference/env-configuration#enable_apps) 配置。关闭它会断开所有应用连接。

### 安装应用 {#install-an-app}

你需要从应用运营方获取两项信息：应用的 **App URL**，例如 `https://app.example.com/events`，以及它的 **API 密钥**。

对于位于你自己的网络、Docker 主机上或使用明文 HTTP 的应用，请先按照[私有及明文 HTTP 应用服务器](#private-and-plain-http-app-servers)进行设置。

1. 前往**设置 > 集成（Settings > Integrations）**（管理员区域），滚动到**应用（Apps）**，点击**添加应用（Add app）**（加号按钮）。
2. 输入 **App URL** 和 **API Key**，然后点击**继续（Continue）**。Open WebUI 会从该 URL 加载应用详细信息。
3. 检查应用请求的权限范围。关闭任何你不愿授予的权限范围，然后点击**继续（Continue）**。
4. 检查**名称（Name）**、**应用句柄（App handle）**和**访问权限（Access）**。句柄是显示在**应用（Apps）**列表中名称旁的简短唯一 ID。它由小写字母、数字和连字符组成，以字母开头，最多 40 个字符。应用保存后，句柄和 App URL 即固定；要将应用移到新地址，必须使用新句柄重新安装。
5. 点击**连接（Connect）**。

如果**连接（Connect）**失败，应用仍会以禁用状态及其句柄保存。解决原因后，再次点击**连接（Connect）**。

如果应用不发布其详细信息，请填写 **App URL** 和 **API Key**，然后点击**手动输入详细信息（Enter details manually）**。输入**名称（Name）**和应用的 Ed25519 **公钥（Public key）**。点击**请求的权限范围（Requested scopes）**，开启应用请求的权限范围，然后点击**继续（Continue）**。接着点击**权限范围（Scopes）**旁的**检查（Review）**，开启你要授予的权限范围。将**应用句柄（App handle）**设置为与应用 ID（oix 中的 `manifest_id`）完全一致：对于手动输入的应用，Open WebUI 会将句柄用作该 ID，如果两者不同，连接就会失败。这要求应用 ID 同时也是有效句柄。使用其他任何 ID 的应用必须发布其详细信息。

App URL 不能包含凭据、查询部分（`?`）或片段（`#`），并且必须直接响应而不能重定向。Open WebUI 直接连接应用，并忽略 `HTTP_PROXY`、`HTTPS_PROXY` 和 `NO_PROXY`，因此 Open WebUI 服务器需要具备到每个应用的直接网络路径。

API 密钥和应用的连接凭据使用从 [`WEBUI_SECRET_KEY`](/reference/env-configuration#webui_secret_key) 派生的密钥加密存储。请保持该值稳定，并在每个 Open WebUI 实例上保持一致；如果它发生变化，请按照[更改 WEBUI_SECRET_KEY 后应用停止连接](#apps-stop-connecting-after-webui_secret_key-changed)中的步骤处理。

### 私有及明文 HTTP 应用服务器 {#private-and-plain-http-app-servers}

默认情况下，每个应用 URL 都必须使用 HTTPS，且其主机名解析到的每个地址都必须是公网地址。要允许 localhost、私有网络或明文 HTTP 上的应用，请在 Open WebUI 服务器上将其源（origin）列入 [`APP_ALLOWED_PRIVATE_ORIGINS`](/reference/env-configuration#app_allowed_private_origins)，然后重启：

```bash
APP_ALLOWED_PRIVATE_ORIGINS=http://127.0.0.1:8000
```

匹配时，协议、主机和端口必须完全一致。列出的 `http://` 源可以使用明文 HTTP；任一协议的已列出源都可以解析到私有、环回或保留地址。每个条目都要写明协议，例如 `http://host.docker.internal:8000`。没有协议或包含凭据、片段的条目会导致所有应用（包括公网应用）失效：加载应用详细信息会失败并显示 `Invalid app URL`，已安装应用会一直停留在**连接中（Connecting）**状态。

在 Docker 内部，`127.0.0.1` 指 Open WebUI 容器本身。对于运行在 Docker 主机上的应用，请使用 `http://host.docker.internal:8000` 作为源（在 Linux 上，启动容器时添加 `--add-host=host.docker.internal:host-gateway`）。对于同一 Docker 网络中另一个容器内的应用，请使用其服务名或容器名，例如 `http://hello-app:8000`。对于网络中另一台机器上的应用，请使用其局域网地址，例如 `http://192.168.1.50:8000`。随后，App URL 必须恰好以该源开头，例如 `http://192.168.1.50:8000/events`。

应用连接始终会验证应用证书。对于你的网络中使用自签名证书的应用，请列出其 `http://` 源并使用明文 HTTP，或者为应用配置 Open WebUI 服务器信任的证书。

### 权限范围 {#scopes}

权限范围用于限制应用可以执行的操作。安装应用时可以选择授予哪些权限范围，之后也可以在**配置（Configure）**中点击**权限范围（Scopes）**旁的**编辑（Edit）**来更改选择。两个列表都只提供应用请求的权限范围。

请求的权限范围来自应用详细信息。对于手动输入详细信息的应用，请在**配置（Configure）**中更改：点击**手动编辑详细信息（Edit details manually）**，然后点击**请求的权限范围（Requested scopes）**。关闭某个请求的权限范围也会将其从已授予的权限范围中移除。

| 权限范围 | 界面显示 | 允许的操作 |
|-------|----------|----------------|
| `channels:mentions:read` | 读取已加入频道中对应用的提及（Read app mentions in joined channels） | 接收提及该应用的消息 |
| `channels:messages:read` | 读取已加入频道中的消息和历史记录（Read messages and history in joined channels） | 接收提及，以及已加入频道中每一条新增、编辑和删除的消息；读取消息历史记录和讨论串 |
| `channels:messages:write` | 在已加入频道中发送消息并编辑自己的消息（Send messages and edit own messages in joined channels） | 发布频道消息并编辑应用自己发布的消息 |
| `channels:read` | 读取已加入频道的详细信息（Read joined channel details） | 列出应用被添加到的频道，包括名称、类型以及是否为私有频道 |

接收提及需要 `channels:mentions:read` 或 `channels:messages:read`。回复提及还需要 `channels:messages:write`，因为回复是一条频道消息。无论拥有哪些权限范围，按钮点击都会送达应用。频道回复和按钮更新需要 `channels:messages:write`；对按钮点击进行私密回复不需要其他权限范围。每个权限范围仅适用于应用被添加到的频道。

### 访问权限 {#access}

**访问权限（Access）**决定谁可以使用应用：提及它、点击它的按钮以及将它添加到频道。在频道中使用应用还需要拥有该频道的读取权限。

- **所有人（Everyone）**（新应用的默认值）：每位用户。
- **受限（Restricted）**：管理员以及你添加的用户和[用户组](/features/authentication-access/rbac/groups)。如果未添加任何人，则只有管理员可以使用该应用。

### 连接状态 {#connection-status}

Open WebUI 会与每个已启用的应用保持实时连接，并自动重新连接，两次尝试之间最多等待 30 秒。每个 Open WebUI 工作进程都会建立自己的连接；有关工作进程和 Redis 的信息，请参阅[扩展 Open WebUI](/getting-started/advanced-topics/scaling)。**应用（Apps）**部分会显示每个已启用应用的状态，并每隔几秒刷新：

| 状态 | 含义 |
|--------|---------|
| **已连接（Connected）** | 已建立经过验证的连接。多个工作进程共享 Redis 时，表示其中至少一个已连接。 |
| **连接中（Connecting）** | Open WebUI 正在尝试连接应用，并会持续重试。 |
| **已断开（Disconnected）** | 当前没有打开的连接。 |

如果应用一直停留在**连接中（Connecting）**或**已断开（Disconnected）**，请将其开关关闭后再打开，然后在弹出的对话框中点击**连接（Connect）**。对话框会显示连接失败的原因；[故障排除](#troubleshooting)对每条消息进行了说明。

### 更新、禁用和卸载 {#update-disable-and-uninstall}

- **配置（Configure）**（齿轮图标）用于打开应用设置。**更新应用（Update app）**（URL 旁的刷新按钮）会重新加载应用详细信息，例如运营方添加了权限范围或更改了头像后。保存会批准更新后的详细信息和所选权限范围，并重新连接应用。公钥或 API 密钥发生变化时，保存会像首次安装一样从头重新连接应用。
- **手动编辑详细信息（Edit details manually）**（位于 URL 下方）用于编辑应用的**公钥（Public key）**和**请求的权限范围（Requested scopes）**。它适用于不发布详细信息的应用。保存会批准编辑后的详细信息，并以相同方式重新连接应用。
- 开关会立即禁用已启用的应用。重新打开开关会显示设置，在其中点击**连接（Connect）**即可再次连接。
- **配置（Configure）**对话框底部的**卸载（Uninstall）**会删除 API 密钥、连接凭据以及应用的频道成员关系。应用已经发布的消息会保留在频道中。应用仍以**已卸载（Uninstalled）**状态留在列表中，并保留其句柄、权限范围和访问权限。要再次使用它，请打开其开关、输入 API 密钥、点击**连接（Connect）**，然后重新将它添加到频道。

只要仍存在由应用发布的消息，就拒绝将数据库回滚到应用功能迁移（`c92da83b017f`）之前；请参阅[降级（回滚）](/troubleshooting/manual-database-migration#downgrade-rollback)。

---

## 故障排除 {#troubleshooting}

### 应用设置中 {#in-the-app-settings}

安装、更新或连接应用时，应用设置对话框中会出现以下消息。

| 消息 | 检查内容 |
|---------|---------------|
| `App endpoints require HTTPS. For local HTTP, configure APP_ALLOWED_PRIVATE_ORIGINS.` | 使用 HTTPS URL，或将源列入 `APP_ALLOWED_PRIVATE_ORIGINS`。 |
| `App resolves to a private or reserved address. For local development, configure APP_ALLOWED_PRIVATE_ORIGINS.` | 主机名指向私有地址。将源列入 `APP_ALLOWED_PRIVATE_ORIGINS`。 |
| `Invalid app URL. Use an HTTP(S) URL without credentials or a fragment.` | 从 URL 中删除凭据和 `#fragment`。如果每个应用 URL 都因此失败，说明某个 `APP_ALLOWED_PRIVATE_ORIGINS` 条目缺少协议。 |
| `Invalid app URL` | 手动输入详细信息后，在**连接（Connect）**时显示。URL 使用明文 HTTP 但未配置 `APP_ALLOWED_PRIVATE_ORIGINS` 条目，或者包含凭据、查询部分或片段。 |
| `App returned an invalid response. Expected JSON.` | App URL 包含查询部分（`?...`），或者应用返回了非 JSON 内容。删除查询部分，或检查 App URL 返回的内容。 |
| `App response exceeds the allowed size.` | 应用详细信息超过 256 KiB。 |
| `App rejected the API key. Check the API key configured on the app server.` | 密钥与应用的密钥不匹配。 |
| `App manifest endpoint returned HTTP <code>. Check the URL or enter details manually.` | URL 错误，或应用发生重定向。使用最终 URL，或手动输入详细信息。 |
| `App returned an invalid manifest. Check its app details or enter them manually.` | 应用详细信息格式错误（请参阅[应用清单](/features/channels/building-apps#manifest)）。 |
| `App request timed out. Check that the app server is running and reachable.` | 加载应用详细信息时，应用在 10 秒内没有响应。 |
| `The app connection failed before a complete response was received.` | 加载应用详细信息时，应用关闭了连接或发送了损坏的 HTTP 响应。检查应用服务器日志。 |
| `App TLS verification failed. Check its certificate and hostname.` | 应用证书无效或与主机名不匹配。 |
| `App hostname could not be resolved. Check DNS from the WebUI server.` | Open WebUI 服务器上的 DNS 查询失败。 |
| `Could not reach the app server. Check its address, port and network access.` | 检查网络路径、防火墙或端口。 |
| `App connection failed. Check the API key, pinned public key and Socket.IO endpoint.` | Open WebUI 无法完成连接：应用拒绝了 API 密钥、Socket.IO 路径错误、代理阻止了 WebSocket、证书/DNS/网络发生故障、应用耗时超过 20 秒，或应用的证明未能根据存储的公钥通过验证。对于手动输入的应用，句柄可能与应用 ID 不同，或者地址是私有地址且未列入 `APP_ALLOWED_PRIVATE_ORIGINS`。如果应用密钥发生变化，请点击**更新应用（Update app）**。如果 `WEBUI_SECRET_KEY` 发生变化，请参阅[更改 WEBUI_SECRET_KEY 后应用停止连接](#apps-stop-connecting-after-webui_secret_key-changed)。 |
| `App rejected its connection credential. Review credentials before reconnecting.` | 应用不再接受上次**连接（Connect）**时签发的凭据，通常是因为其签名密钥已被替换。在**配置（Configure）**中点击**更新应用（Update app）**并保存；有了新公钥后，Open WebUI 会从头连接，应用也会保留其频道。如果应用的 API 密钥发生变化，请输入新密钥并点击**连接（Connect）**。如果两者都未变化，请卸载应用，使用其 API 密钥重新连接，然后将它重新添加到频道。 |
| `App could not complete its bidirectional connection check` | 应用未正确确认最后的连接步骤（请参阅[连接](/features/channels/building-apps#connection)）。 |
| `App slug is already registered` | 另一个应用（可能是已卸载的应用）正在使用此句柄。选择其他句柄，或重新启用已卸载的应用。 |
| `App identity cannot change` | 应用 ID 已发生变化。请将其作为新应用安装。 |

TLS、DNS 和可达性消息来自应用详细信息的加载过程。在**连接（Connect）**时，同样的问题会显示为 `App connection failed`。

### 频道中 {#in-a-channel}

提及应用后，这些消息会出现在以 `App error:` 开头的应用回复中；如果应用无法在频道中发布消息，则会显示在你的消息下方。点击按钮后，它们会显示在应用消息下方。当应用以错误状态和它自己的错误文本回复时，你会看到该文本，最多 2,000 个字符。应用发送不带文本的状态时，则会显示以下状态消息。

| 消息 | 检查内容 |
|---------|---------------|
| `App is disconnected; event was not sent` | 检查**设置 > 集成（Settings > Integrations）**中**应用（Apps）**下的状态。 |
| `App response timed out; execution outcome may be unknown` | 应用未在 10 秒内确认提及、未在 3 秒内回复按钮点击，或在 Open WebUI 等待期间断开了连接。它可能仍已执行相应操作。提及后还会显示第二行：`Delivery was not confirmed. The app may have accepted the message; check before retrying.` |
| `App returned an invalid delivery receipt` | 在提及后显示。应用返回的内容不是送达确认。使用 oix 构建的应用需要 oix 0.8.0 或更高版本。 |
| `App is inactive` | 应用已禁用或已卸载。 |
| `App invocation denied` | 你无权使用此应用。检查其**访问权限（Access）**。 |
| `Channel access denied` | 你已不再拥有该频道的访问权限。 |
| `Invite the app into this channel first` | 应用不是该频道的成员。 |
| `App scope was not granted` | 提及后，表示应用既没有 `channels:mentions:read`，也没有 `channels:messages:read`。点击按钮后，表示应用尝试在没有 `channels:messages:write` 的情况下发布或更新频道消息。检查其权限范围。 |
| `App rejected the API key. Update the key in app settings.` | 应用因 API 密钥而拒绝了事件。将**配置（Configure）**中的密钥与应用服务器上的密钥进行比较。 |
| `App rejected event authorization. Check the app server logs for the verification failure.` | 应用无法通过 Open WebUI 确认提及或点击事件。应用日志会注明原因。 |
| `App returned HTTP <code>. Check the app server logs.` | 应用返回了错误状态，例如其处理程序崩溃后。 |
| `App processing timed out; execution outcome may be unknown.` | 应用处理程序运行超时。它可能仍已执行相应操作。 |
| `App is busy or shutting down. The event was not accepted.` | 应用已达到容量上限或正在重启。请稍后重试。 |
| `App returned an invalid response` | 在点击按钮后显示。应用回复包含未知字段或超出字段限制（请参阅[回复交互](/features/channels/building-apps#replying-to-interactions)）。 |
| `App returned an invalid or oversized response` | 应用的回复不是 JSON 对象，或大小超过 256 KiB。 |
| `Buttons require a channel message` | 在点击按钮后显示。应用在私密回复中发送了按钮，或在 `message`、`update` 以外的回复中发送了按钮。按钮需要将 `visibility` 设为 `channel`。 |
| `App event could not be delivered. Check the WebUI server logs.` | 发送给应用的事件超过 1 MiB，例如消息过长。 |

### 更改 WEBUI_SECRET_KEY 后应用停止连接 {#apps-stop-connecting-after-webui_secret_key-changed}

Open WebUI 使用从 `WEBUI_SECRET_KEY` 派生的密钥加密每个应用的 API 密钥和连接凭据。该值更改后，Open WebUI 将无法再读取它们：所有应用都会停留在**连接中（Connecting）**，在**配置（Configure）**中重新输入 API 密钥也会失败。要恢复，请对每个应用执行以下操作：

1. 打开**配置（Configure）**，点击**卸载（Uninstall）**。这会清除旧凭据。
2. 打开应用开关，输入其 API 密钥，然后点击**连接（Connect）**。
3. 将应用重新添加到其频道。

---

## 构建应用 {#building-an-app}

应用是 Open WebUI 要连接的服务器。可以使用 Python SDK [oix](https://github.com/open-webui/oix#readme) 构建，也可以实现[构建应用](/features/channels/building-apps)中介绍的协议。
