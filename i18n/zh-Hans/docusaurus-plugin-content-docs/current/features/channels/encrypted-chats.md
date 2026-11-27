---
sidebar_position: 4
title: "加密聊天"
---

# 加密聊天

加密聊天是在[私信](/features/channels#direct-messages)或私有群组频道内进行的临时端到端加密对话。消息在每位参与者的浏览器中加密和解密。Open WebUI 服务器仅在参与者之间中继加密数据包，不存储任何消息。加密聊天中的任何内容都不会保存，无法搜索，也不会出现在频道的普通历史记录中。

加密使用 MLS 协议（Messaging Layer Security，消息层安全），通过编译为 WebAssembly 并在浏览器中运行的 openmls 库实现。

:::warning 按设计为临时聊天
加密聊天仅在参与者位于其中时存在。离开或重新加载页面会清除该设备上的聊天，且无法找回消息。发起者离开后，聊天会对所有人结束。
:::

---

## 使用加密聊天 {#using-encrypted-chats}

### 发起加密聊天 {#start-an-encrypted-chat}

1. 打开私信或私有群组频道。
2. 在侧边栏或标题栏中打开对话的 **...** 菜单。
3. 点击**加密聊天（Encrypted Chat）**。

加密聊天会在独立页面中打开，并标有**已加密（Encrypted）**。你是该聊天的发起者。每个对话同一时间最多只能有一个加密聊天。

### 加入加密聊天 {#join-an-encrypted-chat}

加密聊天进行期间，其他成员会在对话名称下方看到**加密聊天进行中 · 加入（Encrypted chat in progress · Join）**。点击**加入（Join）**即可进入。发起者的浏览器会将你添加到加密群组，你可以看到此后发送的消息。一个加密聊天最多容纳 128 名参与者，每人同一时间只能从一个标签页或设备参与。

### 消息 {#messages}

- 一条消息最多包含 16 KiB 文本。消息过长时会显示**消息超过 16 KiB 限制（Message exceeds the 16 KiB limit.）**，且不会发送。
- 其他所有参与者都收到你的消息后，将鼠标悬停在该消息上或使其获得焦点时，消息下方会显示**已送达（Delivered）**。
- 输入状态指示器会显示谁正在输入。
- 每台设备最多保留当前聊天最近的 500 条消息，更早的消息会被移除。

### 验证参与者 {#verify-participants}

每位参与者都有一个根据其加密密钥生成的代码。打开**参与者（Participants）**（标题栏中的参与者人数），点击某位参与者即可查看其代码。通过其他渠道与本人核对该代码，例如当面或通话时核对。代码一致时，点击**代码一致（Codes match）**，该参与者就会显示为**已验证（Verified）**。验证结果仅针对当前聊天保存在你的设备上。

同一面板中的**刷新加密密钥（Refresh encryption keys）**会在群组中为你的设备生成新的加密密钥。长时间聊天期间需要更换密钥时，可使用此功能。

### 聊天结束时 {#when-a-chat-ends}

发生以下情况时，会显示**加密聊天已结束（Encrypted chat ended）**，消息也会从你的屏幕上消失：

- 你点击**离开（Leave）**、重新加载页面、关闭标签页或失去连接；
- 发起者离开；
- 有成员被移出频道、频道被编辑或删除，或私信通过**隐藏对话（Hide conversation）**被隐藏；
- 参与者失去访问权限，例如角色或权限发生变化；或
- 服务器无法协调会话。

如果参与者的浏览器约 45 秒没有响应，该参与者会被移出聊天。向频道添加新成员不会中断聊天；新成员可以加入。

---

## 设置加密聊天 {#setting-up-encrypted-chats}

### 启用加密聊天 {#enable-encrypted-chats}

1. 前往**设置 > 通用（Settings > General）**（管理员区域）。
2. 开启**频道（Channels）**。其下方会出现**加密频道（Encrypted channels）**开关。
3. 开启**加密频道（Encrypted channels）**并保存。

同一开关也可通过 [`ENABLE_ENCRYPTED_CHANNELS`](/reference/env-configuration#enable_encrypted_channels) 配置。该功能默认关闭。

### 谁可以使用 {#who-can-use-it}

管理员始终可以发起和加入加密聊天。普通用户需要同时拥有**频道（Channels）**和**加密频道（Encrypted Channels）**权限（[`USER_PERMISSIONS_FEATURES_CHANNELS`](/reference/env-configuration#user_permissions_features_channels) 和 [`USER_PERMISSIONS_FEATURES_ENCRYPTED_CHANNELS`](/reference/env-configuration#user_permissions_features_encrypted_channels)）。**加密频道（Encrypted Channels）**默认关闭；请在默认权限中或按[用户组](/features/authentication-access/rbac/groups)授予。请参阅[权限](/features/authentication-access/rbac/permissions#4-features-permissions)。

加密聊天仅在私信和私有群组频道中可用，且仅向该对话的成员开放。

### 前提条件 {#requirements}

只有满足以下所有条件，Open WebUI 才允许发起或加入加密聊天：

| 要求 | 设置 |
|-------------|---------|
| 浏览器通过 WebSocket 连接。拒绝使用 HTTP 长轮询。 | 开启 [`ENABLE_WEBSOCKET_SUPPORT`](/reference/env-configuration#enable_websocket_support)（默认开启），并使用可传递 WebSocket 升级的反向代理 |
| 关闭 WebSocket 服务器日志，确保数据包绝不会写入日志 | 关闭 [`WEBSOCKET_SERVER_LOGGING`](/reference/env-configuration#websocket_server_logging) 和 [`WEBSOCKET_SERVER_ENGINEIO_LOGGING`](/reference/env-configuration#websocket_server_engineio_logging)（默认关闭） |
| 当 [`ENV`](/reference/env-configuration#env) 为 `prod`（Docker 默认值）时使用 HTTPS | 通过 HTTPS 提供 Open WebUI。在终止 TLS 的反向代理之后部署时，代理必须发送 `X-Forwarded-Proto`，且 [`FORWARDED_ALLOW_IPS`](/reference/env-configuration#forwarded_allow_ips) 必须信任该代理 |

浏览器还需要安全上下文：HTTPS，或本地测试期间使用 `localhost`。

缺少任何一项要求时，加密聊天都会在打开后立即结束。

### 多实例 {#multiple-instances}

多个工作进程或实例共享 Redis（`WEBSOCKET_MANAGER=redis`）时，会话元数据（谁位于哪个聊天中及其公钥）通过 Redis 协调。每个条目会在最后一次活动 90 秒后过期。加密数据包在实例之间传输时会经过 Redis Pub/Sub，但绝不会存储在其中。请参阅[扩展 Open WebUI](/getting-started/advanced-topics/scaling)。

### 速率限制 {#rate-limits}

每位用户每分钟最多可以发起或加入 10 个加密聊天。所有其他加密聊天流量（消息、输入状态指示器、回执和保活）限制为每位用户每秒 100 个请求和 4 MiB。使用 Redis 时，这些限制跨所有实例生效；未使用 Redis 时，则按工作进程分别生效。
