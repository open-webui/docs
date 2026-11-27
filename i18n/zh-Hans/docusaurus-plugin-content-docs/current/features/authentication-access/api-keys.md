---
sidebar_position: 500
title: "API 密钥"
---

# API 密钥

**以编程方式访问 Open WebUI，适用于脚本、机器人和集成。**

API 密钥是一种个人访问令牌，允许外部代码调用 Web 界面所使用的相同端点。你能在浏览器中执行的任何操作——聊天补全、模型列表、文件上传、RAG 查询——脚本只需一个 `Authorization: Bearer` 请求头即可完成，但[需要已登录会话的端点](#endpoints-that-need-a-signed-in-session)中列出的少数账户安全端点除外。密钥以创建它的用户身份执行操作，因此无需学习单独的权限模型。

每个账户恰好有**一个** API 密钥。已有密钥时创建新密钥会替换旧密钥，旧密钥会立即停止工作。

---

## 为什么使用 API 密钥？ {#why-api-keys}

### 无需浏览器的自动化 {#automation-without-a-browser}

脚本、CI/CD 流水线、监控机器人和第三方工具都需要以编程方式访问。API 密钥为它们提供稳定的凭据，不会随浏览器会话而过期。

### 相同权限，不同界面 {#same-permissions-different-interface}

API 密钥以你的身份执行操作。它继承你的角色和组权限，并且每次请求都会重新检查这些权限，而不是将其固定在密钥创建时。

### 可撤销、可审计 {#revocable-and-auditable}

密钥可以被替换或直接移除。创建新密钥会覆盖旧密钥，删除密钥则会让账户不再拥有密钥，因此无论采用哪种方式，都可以一步停用泄露的凭据，且更改立即生效。这不涉及密码重置或会话失效。管理员还可以通过关闭全局 **API 密钥**开关一次性禁用所有密钥，或通过移除非管理员用户的功能权限（管理员的密钥不受此权限影响）或[代其删除密钥](#managing-a-users-key-admin)来禁用该用户的密钥。密钥的创建和删除会记录为身份验证事件。密钥以纯文本形式存储在数据库中，更改密码或退出登录均不会影响它们。启用[审计日志](/getting-started/advanced-topics/hardening#audit-logging)后，无论密钥以 Bearer 令牌形式传入，还是通过 `x-api-key` 请求头传入（可使用 [`CUSTOM_API_KEY_HEADER`](/reference/env-configuration#custom_api_key_header) 重命名），使用密钥发出的请求都会以其所有者身份显示在审计日志中。

---

## 主要功能 {#key-features}

| | |
| :--- | :--- |
| **Bearer 令牌身份验证** | 标准 `Authorization: Bearer` 请求头，适用于任何 HTTP 客户端或 SDK |
| **限定于用户** | 密钥继承创建用户的角色和组权限 |
| **端点限制** | 可选择限制 API 密钥能够访问的 API 路由 |
| **权限控制** | 需要全局管理员开关，非管理员还需要按组授予的功能权限 |

---

## 快速上手 {#getting-started}

### 第 1 步：全局启用 API 密钥（管理员） {#step-1-enable-api-keys-globally-admin}

1. 以**管理员**身份登录
2. 打开**设置 > 身份验证**（管理区域）
3. 打开 **API 密钥**开关
4. 点击**保存**

:::info
这是全局总开关。关闭时，任何人都无法创建或使用密钥，管理员也不例外，已有密钥也会停止通过身份验证。开启时：
- **管理员**用户可以立即创建密钥
- **非管理员**用户仍需要 API 密钥功能权限（第 2 步）
:::

*（可选）*启用 **API 密钥端点限制**，以限制 API 密钥可以调用的路由，然后将允许的路径列为逗号分隔列表（例如 `/api/v1/models,/api/v1/chat/completions`）。该限制应用于实例上的每个 API 密钥，而不是单个密钥。

### 第 2 步：向非管理员用户授予权限（管理员） {#step-2-grant-permission-to-non-admin-users-admin}

非管理员用户需要 **API 密钥**功能权限。使用以下任一方式授予：

#### 方式 A：默认权限（所有用户） {#option-a-default-permissions-all-users}

1. **管理员面板 > 用户 > 组 > 默认权限**
2. 在**功能权限**下，打开 **API 密钥**开关
3. 点击**保存**

:::warning
这会授予每个具有“user”角色的用户创建 API 密钥的能力。如需更严格的控制，请使用方式 B。
:::

#### 方式 B：用户组（特定用户） {#option-b-user-groups-specific-users}

1. **管理员面板 > 用户 > 组**
2. 选择或创建一个组（例如“API Users”）
3. 在**权限 > 功能权限**下，打开 **API 密钥**开关
4. 点击**保存**

:::tip
创建专用的“API Users”或“Monitoring”组，只添加需要编程访问的账户。这遵循最小权限原则。
:::

### 第 3 步：生成密钥 {#step-3-generate-a-key}

1. 点击你的**个人资料图标**（侧边栏左下角）
2. 选择**设置 > 账户**
3. 滚动到 **API 密钥**部分，点击**机密信息**旁的**显示**
4. 点击**创建新密钥**
5. 使用字段旁的复制按钮复制密钥

密钥存在后，其旁边的菜单提供**创建新密钥**（用于替换现有密钥）和**删除**（确认后移除密钥）。删除后，账户将不再拥有密钥，直到你再次创建；从删除那一刻起，任何仍出示旧密钥的请求都会被拒绝。

:::info
管理员会在同一块区域看到自己的当前 **JWT 令牌**。这是浏览器会话令牌，不是 API 密钥，会随会话过期。
:::

:::warning
像对待密码一样对待 API 密钥。将其存储在机密管理器中，切勿提交到版本控制，也切勿在公共频道中分享。如果密钥泄露，请立即创建新密钥，这会覆盖已泄露的密钥。
:::

### 管理用户的密钥（管理员） {#managing-a-users-key-admin}

管理员可以替换或移除任何用户的密钥。在**管理员面板 > 用户**中打开用户，使用编辑对话框中 **API 密钥**旁的**轮换**或**删除**。

- **轮换**会签发新密钥且仅显示一次，因此请在关闭对话框前复制。此操作需要打开全局 **API 密钥**开关，并要求用户获准拥有密钥。
- **删除**会移除密钥，即使 API 密钥已关闭也可执行。
- 只有[主管理员](/features/authentication-access/rbac/roles#the-primary-administrator)可以更改主管理员的密钥。

脚本也可以使用管理员的 API 密钥执行相同操作：`POST /api/v1/users/{user_id}/api_key/rotate` 返回新密钥，`DELETE /api/v1/users/{user_id}/api_key` 移除密钥。

---

## 使用 API 密钥 {#using-your-api-key}

在 `Authorization` 请求头中以 Bearer 令牌形式传递密钥：

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  http://localhost:8080/api/models
```

```python
import requests

response = requests.get(
    "http://localhost:8080/api/models",
    headers={"Authorization": "Bearer YOUR_API_KEY"}
)
print(response.json())
```

签发的密钥由 `sk-` 后接 32 个十六进制字符组成。

有关完整的端点参考——聊天补全、Ollama 代理、RAG、文件管理等——请参阅 [API 端点](/reference/api-endpoints)。

### 反向代理会消耗 `Authorization` 请求头？ {#behind-a-reverse-proxy-that-consumes-authorization}

如果 Open WebUI 位于使用 `Authorization` 请求头进行自身身份验证的网关之后（基本身份验证、SSO sidecar、企业 API 网关、双向 TLS 适配器等），客户端可以改用专用请求头传递 API 密钥。中间件按以下顺序检查：`Authorization: Bearer`、`token` Cookie 和可配置的自定义请求头。

自定义请求头默认为 `x-api-key`，管理员可以通过 [`CUSTOM_API_KEY_HEADER`](/reference/env-configuration#custom_api_key_header) 环境变量重命名，以避免与请求链中的其他内容冲突。

```bash
curl -H "X-OpenWebUI-Key: YOUR_API_KEY" \
  http://openwebui.internal/api/models
```

```
# Open WebUI 容器环境变量
CUSTOM_API_KEY_HEADER=X-OpenWebUI-Key
```

---

## 最佳实践 {#best-practices}

### 专用服务账户 {#dedicated-service-accounts}

由于一个账户始终只能持有一个密钥，请为每个集成提供自己的**非管理员用户**（例如 `monitoring-bot`、`ci-pipeline`），并从该账户创建密钥。每个账户一个密钥，让你可以轮换或撤销单个集成而不影响其他集成；密钥泄露时也只会暴露该用户的权限，而不会暴露管理员访问权限。

### 端点限制 {#endpoint-restrictions}

启用 **API 密钥端点限制**，仅列出集成实际需要的路由。当请求路径与某个条目完全匹配，或位于该条目下的某个路径段时，请求就会获准，因此 `/api/v1/models` 也涵盖 `/api/v1/models/anything`。监控机器人只需要 `/api/models` 和 `/api/chat/completions`，因此不要开放 `/api/v1/files/` 或管理端点。允许列表是实例级的，必须包含每个集成所需路由的并集。

### 密钥轮换 {#key-rotation}

对于长期存在的集成，请定期从集成账户选择**创建新密钥**进行轮换，这会直接替换旧密钥。每次轮换一个账户并立即更新使用方，因为新密钥一经签发，旧密钥就会被拒绝。

永久停用集成时，应执行**删除**而不是轮换，因为删除会终止该账户的访问，而不是向其发放新凭据。

---

## 故障排除 {#troubleshooting}

**“设置 > 账户”中的 API 密钥部分看起来是空的？**

- **点击显示：**该部分折叠在**机密信息**旁的**显示**按钮后面。只有展开后，才会显示密钥字段和**创建新密钥**按钮。

**“设置 > 账户”中完全没有 API 密钥部分？**

- **检查全局开关：**确认管理员已在**设置 > 身份验证**（管理区域）中启用 API 密钥。请参阅 [`ENABLE_API_KEYS`](/reference/env-configuration#enable_api_keys)。
- **检查你的权限（非管理员用户）：**确认你的账户或组在**功能权限**下拥有 **API 密钥**功能权限。请参阅 [`USER_PERMISSIONS_FEATURES_API_KEYS`](/reference/env-configuration#user_permissions_features_api_keys)。

**收到 `401 Unauthorized` 响应？**

- 确认密钥格式正确：`Authorization: Bearer sk-...`
- 检查同一账户上的密钥是否已被较新的密钥替换
- 确认账户仍然存在且不处于待审核状态

**收到 `403 Forbidden` 响应？**

- 全局 **API 密钥**开关可能已关闭，这会使现有密钥失效
- 密钥的所有者可能已失去 **API 密钥**功能权限
- 如果启用了端点限制，请确认所调用的路由在允许列表中
- 如果响应正文为 `A human session is required.`，则该路由完全不接受 API 密钥。请参阅[需要已登录会话的端点](#endpoints-that-need-a-signed-in-session)

---

## 限制 {#limitations}

### 每个账户一个密钥 {#one-key-per-account}

一个账户持有一个没有名称的密钥。无法为同一用户同时运行两个密钥，创建密钥始终会覆盖现有密钥。请为每个集成使用单独的账户。

### 没有密钥级权限 {#no-per-key-permissions}

密钥继承创建它的用户的完整权限。无法将密钥限制为其所有者权限的子集，端点限制也应用于整个实例，而非单个密钥。

### 需要已登录会话的端点 {#endpoints-that-need-a-signed-in-session}

以下路由仅接受浏览器登录的令牌。无论所有者的角色或权限如何，API 密钥都会收到 `403`，并显示 `A human session is required.`：

| 路由 | 作用 |
|-------|--------------|
| `GET /api/v1/auths/` | 返回已登录用户及其令牌，并设置 `token` Cookie |
| `GET /api/v1/auths/mfa/status` | 双因素身份验证状态 |
| `POST /api/v1/auths/mfa/replace` | 开始替换双因素身份验证方式 |
| `POST /api/v1/auths/mfa/recovery/codes` | 创建新的恢复代码 |
| `GET /api/v1/auths/sessions` | 列出你的原生客户端持久会话 |
| `POST /api/v1/auths/sessions` | 为原生客户端创建持久会话 |
| `GET /api/v1/auths/sessions/{session_id}/request` | 读取来自原生客户端的待处理登录请求 |
| `POST /api/v1/auths/sessions/{session_id}/authorize` | 批准该登录请求 |
| `DELETE /api/v1/auths/sessions/{session_id}` | 撤销持久会话 |

要使用 API 密钥读取密钥所有者自己的账户，请调用 `GET /api/v1/users/user/status`。它返回用户记录，包括 `id`、`name`、`email` 和 `role`；当通过 [`ENABLE_USER_STATUS`](/reference/env-configuration#enable_user_status) 关闭用户状态功能时，返回 `403`。`GET /api/v1/users/permissions` 返回所有者的权限。

### 不会自动过期 {#no-automatic-expiration}

API 密钥不会过期。轮换密钥需要手动操作，没有可作为后备的计划过期或基于时间的过期机制。
