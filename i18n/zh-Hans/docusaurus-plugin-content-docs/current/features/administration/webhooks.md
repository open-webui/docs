---
sidebar_position: 17
title: "Webhook 集成"
---

## 概述 {#overview}

Open WebUI 提供三种不同的 webhook 集成，帮助你及时了解实例中发生的事件并实现外部集成。通过这些 webhook，你可以在 Discord、Slack 或任何其他支持传入 webhook 的外部服务中接收自动通知，也可以将外部服务的消息发布到 Open WebUI 频道。

共有三种 webhook：

1.  **事件 Webhooks：**由管理员配置的 webhook，接收目录中的事件（注册、用户变更、聊天、频道、文件、模型、配置、启动和关闭），每个 webhook 都有名称、URL、事件过滤器和受众。
2.  **用户 Webhook：**一种个人 webhook，在用户的聊天回答就绪时通知相应用户，尤其适用于长时间运行的任务。
3.  **频道 Webhooks：**允许外部服务将消息发布到特定频道的传入 webhook。

## 1. 管理员 Webhook：新用户通知 {#1-admin-webhook-new-user-notifications}

此 webhook 供管理员监控 Open WebUI 实例上的新用户注册。

### 使用场景 {#use-case}

- **用户注册跟踪：**每当新用户创建账户时，在专用的 Slack 或 Discord 频道中接收实时通知。这有助于你跟踪用户群并欢迎新成员。

### 配置 {#configuration}

可以通过两种方式配置管理员 webhook：

#### 方式 1：通过管理员面板 {#option-1-through-the-admin-panel}

1.  以管理员身份登录。
2.  导航到**设置 > 常规**（管理区域）。
3.  滚动到**事件** > **Webhooks** 并点击 **+**。为 webhook 设置名称和 URL，选择**发送事件的对象**和**事件**，然后保存。现有条目提供**配置**和**删除**操作。
4.  输入外部服务（例如 Discord、Slack）提供的 webhook URL。
5.  点击**“保存”**。

**发送事件的对象**用于设置受众。**所有用户和系统事件**会发送与事件过滤器匹配的所有内容。**仅系统事件**仅发送不与用户关联的事件，例如启动和关闭。**特定用户或组**会发送涉及所选用户或组成员的事件，例如他们拥有的自动化运行失败。

#### 方式 2：通过环境变量 {#option-2-through-environment-variables}

`WEBHOOK_URL` 环境变量会在启动时迁移一次，成为订阅所有事件的**默认 webhook**。如果只需要注册事件，请将其范围缩小到 `auth.signup` 或 `user.created`。更多详细信息，请参阅[环境变量配置](/reference/env-configuration/#webhook_url)文档。

### 负载格式 {#payload-format}

匹配的事件触发时，Open WebUI 会向配置的 URL 发送 `POST` 请求。表单注册会先触发 `user.created`，再触发 `auth.signup`，因此订阅所有事件的 webhook 会发布两次。通过 OAuth、LDAP、SCIM 创建的用户或由管理员创建的用户仅触发 `user.created`，并相应设置 `source`。通用 URL 接收事件外层结构；Slack 和 Google Chat 接收 `{"text": ...}`，Discord 接收 `{"content": ...}`，Teams 接收 MessageCard。

**负载示例：**

```json
{
  "schema": "0.11.3",
  "id": "8b1f...",
  "event": "auth.signup",
  "resource": "auth",
  "operation": "signup",
  "created_at": 1758150000,
  "source": "api",
  "actor": {"type": "user", "id": "...", "name": "Tim", "email": "tim@example.com", "role": "pending"},
  "subject": {"type": "user", "id": "..."},
  "data": {"email": "tim@example.com"}
}
```

## 2. 用户 Webhook：通知目标 {#2-user-webhook-notification-targets}

此 webhook 让用户在自己关心的事件发生时收到通知，例如模型完成较长的回答、收到频道消息或触发日历提醒。当你已经离开 Open WebUI 标签页时，它非常有用。

每个用户都可以在**设置 > 通知**中配置一个或多个**通知目标**，并针对每个目标选择它接收哪些事件，以及仅在离开时触发还是始终触发。模型也可以通过 `notify` 工具自行发送通知。

有关完整功能，请参阅 **[通知](/features/chat-conversations/chat-features/notifications)**，其中介绍目标、可订阅的事件、投递模式、URL 掩码和 `notify` 工具。

### 使用场景 {#use-case-1}

- **长时间运行任务提醒：**如果提交的复杂提示词需要几分钟才能处理完成，你可以关闭浏览器标签页，并在回答就绪的那一刻收到通知。这样，你就可以处理其他任务，而无需不断查看 Open WebUI 界面。

### 工作方式 {#how-it-works}

使用默认的**离开**投递模式时，只有当你**未在使用 WebUI** 时才会发送通知，因此不会因为你正在查看的内容而打扰你。将目标设置为**始终**则无论是否离开都会发送。频道消息会忽略投递模式，在群组频道和私信中也是如此，仅在你没有打开任何 Open WebUI 标签页时发送。这些通知针对人们发布的消息发送，包括机器人账户通过 API 发布的消息。在标准频道中，你打开该频道或在其中发布过消息后，就会收到通知。设置为[**仅提及**](/features/channels#muting-a-channel)的频道只发送 @提及你的消息。

### 启用 / 禁用用户 Webhooks {#enablingdisabling-user-webhooks}

用户 webhook 默认禁用。管理员可以在需要时为所有用户启用此功能，也可以保持禁用，以阻止外部请求。

可以通过两种方式完成：

1.  **直接在管理员面板中：**
    - 转到**设置 > 常规 > 功能**（管理区域）。
    - 切换**“用户 Webhooks”**的开关。

2.  **使用环境变量：**
    - 此功能默认关闭。`ENABLE_USER_WEBHOOKS` 默认为 `False`，**用户 Webhooks** 权限也是如此。因此要提供此功能，请设置 `ENABLE_USER_WEBHOOKS=True`（或使用开关）并授予权限。将其设置为 `False` 会重新关闭此功能，并从用户个人资料中隐藏该设置。

用户还需要 `features.webhooks` 权限（[`USER_PERMISSIONS_FEATURES_USER_WEBHOOKS`](/reference/env-configuration#user_permissions_features_user_webhooks)）；管理员始终拥有此权限。

### 配置 {#configuration-1}

1.  点击左下角的个人资料图片，打开设置菜单。
2.  导航到**设置 > 通知**。
3.  使用你的 webhook URL 添加一个目标，并选择它应接收的事件。
4.  使用**发送测试**确认其正常工作。

:::info 从旧的“通知 Webhook”字段升级
**设置 > 账户**下原来的单个**通知 Webhook** 字段已由通知目标取代。现有 URL 会自动迁移为一个订阅所有事件的目标，因此无需任何操作即可继续接收通知。
:::

## 3. 频道 Webhooks：外部消息集成 {#3-channel-webhooks-external-message-integration}

频道 Webhooks 允许外部服务、自动化工具或脚本将消息直接发布到 Open WebUI 频道，例如来自监控系统、CI/CD 流水线、通知服务或任何自定义自动化的消息。一个 webhook 只能向一个频道发布消息。还需要回答 `@mentions` 或发布按钮的服务应构建为[应用](/features/channels/apps)。

### 使用场景 {#use-cases}

- **系统监控：**将监控工具（Prometheus、Grafana、Nagios）的警报直接发布到团队频道。
- **CI/CD 集成：**将 GitHub Actions、GitLab CI 或 Jenkins 的构建状态通知发送到开发频道。
- **自定义自动化：**与 n8n、Zapier 或自定义脚本集成，自动发布消息。
- **外部通知：**将外部服务的通知转发到你的 Open WebUI 工作区。

### 工作方式 {#how-it-works-1}

每个频道可以有多个 webhook。每个 webhook 都有：
- 一个唯一的 **webhook URL**，供外部服务发送 POST 请求
- 一个显示为消息作者的**显示名称**
- 一张可选的**个人资料图片**，用于直观标识 webhook 来源
- 一个**上次使用时间戳**，用于跟踪 webhook 活动

通过 webhook 发布的消息会连同 webhook 的名称和图片一起显示在频道中，以标明其来自外部来源。

### 管理频道 Webhooks {#managing-channel-webhooks}

只有频道创建者和**管理员**可以为频道创建和管理 webhook。

#### 创建 Webhook {#creating-a-webhook}

1.  导航到要添加 webhook 的频道。
2.  在侧边栏中打开频道的 **...** 菜单，然后选择**编辑频道**。
3.  在频道设置弹窗中找到 **Webhooks** 部分。
4.  点击**管理**，打开 Webhooks 弹窗。
5.  点击**新建 Webhook**。这会立即创建一个名为“New Webhook”的可用 webhook。**保存**仅应用于之后对名称和图片的编辑。
6.  配置 webhook：
    - **名称：**将显示为消息作者的显示名称
    - **个人资料图片：**（可选）上传一张代表此 webhook 的图片
7.  点击**保存**应用名称和图片。
8.  使用**复制 URL** 按钮复制生成的 webhook URL。

#### Webhook URL 格式 {#webhook-url-format}

```
{WEBUI_API_BASE_URL}/channels/webhooks/{webhook_id}/{token}
```

此 URL 是唯一的，并包含身份验证令牌。任何拥有此 URL 的人都可以向频道发布消息，因此请妥善保管。

#### 更新 Webhook {#updating-a-webhook}

1.  从频道设置中打开 **Webhooks** 弹窗。
2.  点击要编辑的 webhook 以将其展开。
3.  根据需要修改**名称**或**个人资料图片**。
4.  点击**保存**应用更改。

更新名称或图片后，webhook URL 保持不变。该 webhook 发布的所有消息（包括较早的消息）都会显示其当前名称和图片。

#### 删除 Webhook {#deleting-a-webhook}

1.  从频道设置中打开 **Webhooks** 弹窗。
2.  点击要删除的 webhook 以将其展开。
3.  点击**删除**（垃圾桶）图标。
4.  确认删除。

删除后，webhook URL 会立即停止工作。该 webhook 之前发布的消息会保留在频道中，但作者会显示为“已删除的 Webhook”。

### 通过 Webhook 发布消息 {#posting-messages-via-webhook}

要从外部服务发布消息，请携带 JSON 负载向 webhook URL 发送 `POST` 请求。

#### 请求格式 {#request-format}

**端点：**`POST {webhook_url}`
**请求头：**`Content-Type: application/json`
**请求体：**

```json
{
  "content": "Your message content here"
}
```

#### 示例：使用 cURL {#example-using-curl}

```bash
curl -X POST "https://your-instance.com/api/v1/channels/webhooks/{webhook_id}/{token}" \
  -H "Content-Type: application/json" \
  -d '{"content": "Deployment to production completed successfully!"}'
```

#### 示例：使用 Python {#example-using-python}

```python
import requests

webhook_url = "https://your-instance.com/api/v1/channels/webhooks/{webhook_id}/{token}"
message = {
    "content": "Build #1234 failed: Unit tests did not pass."
}

response = requests.post(webhook_url, json=message)
print(response.json())
```

#### 响应格式 {#response-format}

成功时，webhook 会返回：

```json
{
  "success": true,
  "message_id": "abc-123-def-456"
}
```

### 安全注意事项 {#security-considerations}

-   **URL 保护：**Webhook URL 包含身份验证令牌。请妥善保管，不要将其暴露在公共仓库或日志中。
-   **频道访问：**任何拥有 webhook URL 的人都可以向频道发布消息。请仅与受信任的服务共享 URL。
-   **消息内容：**在发送端验证和清理消息内容，以防注入攻击。
-   **重新生成：**如果 webhook URL 已泄露，请删除该 webhook 并创建一个新的 webhook。

### Webhook 身份 {#webhook-identity}

通过 webhook 发布的消息使用特殊的身份系统：
- 消息会显示 webhook 的**名称**和**个人资料图片**
- 用户角色标记为 **“webhook”**，以区别于普通用户
- 如果 webhook 被删除，其消息仍然可见，但会显示“已删除的 Webhook”和默认头像
- 每条消息都在元数据中存储 webhook ID，即使之后修改或删除 webhook，也能正确追溯来源
- 只有 Open WebUI 会写入该元数据。通过普通发布或编辑消息请求发送的元数据会被忽略，因此账户发布的消息始终显示该账户

## 故障排除 {#troubleshooting}

如果没有收到 webhook 通知，请检查以下几点：

-   **验证 URL：**确保 webhook URL 正确，并已完整粘贴到设置字段中。
-   **服务配置：**再次确认 webhook 已在外部服务（例如 Discord、Slack）中正确设置。
-   **防火墙 / 代理：**确保网络或防火墙没有阻止 Open WebUI 服务器发出的请求。
-   **Open WebUI 日志：**检查 Open WebUI 服务器日志中与 webhook 失败有关的错误消息。

:::note

Open WebUI 的 webhook 功能正在持续改进。敬请期待未来更新中的更多事件类型和自定义选项。

:::
