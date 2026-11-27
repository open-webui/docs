---
sidebar_position: 3
title: "角色"
---


Open WebUI 定义了三种主要**系统角色**，它们决定用户账户的基本访问级别。这些角色不同于[组](./groups.md)和[权限](./permissions.md)。

| 角色 | 关键字 | 描述 |
| :--- | :--- | :--- |
| **管理员** | `admin` | **超级用户**。拥有系统的完整控制权。 |
| **用户** | `user` | **标准用户**。受 RBAC 权限约束。 |
| **待审核** | `pending` | **受限**。获得批准前没有访问权限。 |

## 角色详情 {#role-details}

### 管理员（`admin`） {#administrator-admin}
管理员角色面向系统维护人员。
*   **完整访问权限**：默认可以访问所有资源和设置。
*   **管理**：可以管理用户、组和全局配置。
*   **绕过**：默认绕过大多数权限检查。

:::warning 管理员限制与最佳实践
虽然管理员通常拥有不受限制的访问权限，但出于安全和隐私考虑，某些系统配置可以限制其能力：
*   **隐私控制**：[`ENABLE_ADMIN_CHAT_ACCESS=False`](/reference/env-configuration#enable_admin_chat_access) 会在界面中向管理员隐藏用户聊天。它并不能阻止管理员接触数据；请参阅[聊天数据隐私](/security/chat-data-privacy-and-encryption#admin-users)。
*   **可能存在功能专属例外**：某些功能可以在标准管理员绕过行为之外执行额外检查。具体到 API 密钥，只要启用了 `ENABLE_API_KEYS`，管理员就可以生成密钥。
*   **访问控制例外**：如果禁用 `BYPASS_ADMIN_ACCESS_CONTROL`，管理员也会像其他人一样接受访问授权检查。私有工作区项目（模型、知识库、提示词、工具、技能、笔记）仅对其所有者和共享对象可见。没有授权的管理员配置连接仍仅限管理员使用。请参阅[“私有”对每种资源类型的含义](/features/authentication-access/rbac/groups#what-private-means-for-each-resource-type)。

为了获得稳健的安全态势，建议通过组将管理员纳入权限方案，而不是仅依赖角色的隐式绕过能力。这样，即使启用绕过限制，也能确保访问权限保持一致。
:::

### 标准用户（`user`） {#standard-user-user}
这是团队成员的默认功能角色。
*   **受权限约束**：没有隐式访问权限。所有能力都必须通过**全局默认权限**或**组成员关系**授予。
*   **累加权限**：如[权限](./permissions.md)部分所述，其有效权限是所有授权的总和。

### 待审核用户（`pending`） {#pending-user-pending}
这是新注册用户（如果如此配置）或已停用用户的默认状态。
*   **零访问权限**：无法执行任何操作或查看任何内容。
*   **需要批准**：必须由现有管理员提升为 `user` 或 `admin`。

:::note
系统会跳过对 `admin` 角色的权限检查：代码会先检查角色，再查找权限。精细权限（例如禁用“网络搜索”）通常**不**适用于管理员。
:::

## 角色分配 {#role-assignment}

### 初始设置 {#initial-setup}
*   **首位用户：**在全新安装中创建的第一个账户会自动分配**管理员**角色。首次注册会忽略 `ENABLE_SIGNUP`，但在登录表单禁用时仍会被拒绝，除非 `ENABLE_INITIAL_ADMIN_SIGNUP=true`；注册成功后会关闭注册功能。
*   **无界面创建管理员：**对于自动化/容器化部署，可以使用环境变量自动创建管理员账户（见下文）。
*   **后续用户：**新注册用户会被分配**默认用户角色**。

### 配置 {#configuration}
可以通过 `DEFAULT_USER_ROLE` 环境变量控制新用户的默认角色：

```bash
DEFAULT_USER_ROLE=pending
# 选项：'pending'（默认）、'user'、'admin'
```
*   **pending（推荐用于公共/共享实例）：**新用户可以登录，但只能看到待审核界面；在管理员更改其角色前，每个 API 请求和 WebSocket 握手都会拒绝他们。
*   **user：**新用户立即获得默认权限的访问能力。
*   **admin：**（谨慎使用）新用户会成为拥有完整权限的管理员。

## 更改角色 {#changing-roles}

管理员可以随时通过**管理员面板 > 用户**更改用户角色，但有三个例外：其他管理员不能编辑或降级主管理员，主管理员也不能降级自己；任何管理员都不能在界面中更改自己的角色；任何管理员也都不能删除自己的账户。
*   将用户提升为 `admin` 会授予其完整控制权。
*   将管理员降级为 `user` 会使其再次受到权限系统约束。

### 角色更改何时生效 {#when-a-role-change-takes-effect}

无论通过哪种途径更改角色，该账户的活动 WebSocket 连接都会立即终止：

*   **管理员面板 > 用户**，或其背后的用户更新 API。
*   SCIM 目录同步，包括 `active` 标志，该标志映射到 `user` 和 `pending` 角色（请参阅 [SCIM 2.0](/features/authentication-access/auth/scim)）。
*   启用 [OAuth 角色管理](/features/authentication-access/auth/sso#oauth-role-management)后的 OAuth 或 OIDC 登录。
*   携带[受信任角色标头](/features/authentication-access/auth/sso#role-management)的登录。

删除账户也会以相同方式终止其活动连接。

在使用 [`WEBSOCKET_MANAGER=redis`](/reference/env-configuration#websocket_manager) 的多副本部署中，系统会通过共享会话池查找连接，并在持有这些连接的任意副本上将其断开，而不只是在处理更改的副本上断开。

浏览器会自动重新连接并重新进行身份验证，因此通过该连接运行的功能（频道、协作笔记编辑）会使用新角色，而不是连接建立时缓存的角色。REST API 调用会在每次请求时从数据库读取账户，因此被降级的管理员无论如何都会在下一次调用时立即失去对仅管理员端点的访问权限。

:::note 角色更改不会吊销用户的令牌
用户会保持登录状态，并以新角色继续浏览。降级为 `pending` 确实会将其锁定在外，因为每个 API 请求和 WebSocket 握手都会拒绝 `pending` 账户。如果还要终止其会话，请使用[退出所有设备](#signing-a-user-out-of-every-device)。
:::

## 使用户退出所有设备 {#signing-a-user-out-of-every-device}

在**管理员面板 > 用户**中打开用户，点击编辑对话框底部的**退出所有设备**，然后确认。该用户的每个会话都会结束：使用该账户登录的浏览器标签页和应用会在下一次请求时被拒绝，必须重新登录，其活动连接也会关闭。该用户正在进行的自动化和子代理运行同样会失去访问权限。设备丢失、账户可能遭到入侵或人员离开时，可使用此功能。

![“退出所有设备？”确认对话框，其中说明用户需要在每台设备上重新登录，而 API 密钥会保持有效](/images/features/auth/sign-out-all-devices.webp)

- **API 密钥保持有效。**[删除或轮换用户密钥](/features/authentication-access/api-keys#managing-a-users-key-admin)，以切断脚本和集成的访问。
- **无需 Redis 即可工作。**退出登录状态会存储在数据库中，因此适用于每个工作进程和副本。
- **主管理员**只能由自己通过此方式退出登录。

在同一对话框中为用户设置新密码，也会使其退出所有设备。此操作会记录为 `auth.sessions_revoked` [事件](/features/extensibility/plugin/functions/event)。脚本可以使用管理员的 API 密钥，通过 `POST /api/v1/users/{user_id}/sessions/revoke` 触发此操作。有关会使账户退出登录的所有操作，请参阅[令牌吊销](/getting-started/advanced-topics/hardening#token-revocation)。

## 主管理员 {#the-primary-administrator}

实例上创建的第一个账户（请参阅[初始设置](#initial-setup)）是**主管理员**。它没有特殊标志：在内部，它就是根据创建时间戳确定的最早创建账户。

主管理员拥有一项额外的小保护。界面会隐藏每个管理员账户的删除控件，后端会拒绝通过用户 API 删除主管理员；它还会拒绝其他管理员对该账户进行任何更改（角色、姓名、电子邮件或密码），并拒绝该账户降级自己。这项保护纯粹是为了防止初始引导账户被意外移除，否则可能导致实例失去创始管理员，或触发非预期的角色重新分配。要更改主管理员的电子邮件，请以该账户登录，在**管理员面板 > 用户**中对其使用**编辑用户**，这会同时更新 `user` 和 `auth` 表中的地址；只更改其中一个表会导致无法登录，因为密码登录在 `user` 中查找地址，而 LDAP 和受信任标头登录在 `auth` 中查找。

这是一种便利性保护措施，而不是安全边界。所有管理员都共享系统的完整控制权，因此任何管理员仍可在数据层更改或移除任何账户，包括主管理员。

### 更换主管理员 {#swapping-the-primary-administrator}

有时确实需要更换主管理员，例如最初设置部署的人离开组织。由于该角色完全由创建时间戳决定，主管理员就是最早创建的账户，无论其当前角色是什么；因此，在数据库层重组或移除账户会改变被视为主管理员的账户。

这里刻意将其设计为数据层操作，而不是一键按钮，以确保更改创始账户始终是经过慎重考虑的有意操作。请在更改前备份数据库，并在实例空闲时执行。此处不列出具体查询，因为数据库架构会随版本变化；请基于当前架构操作，如果需要针对所用版本的指导，请通过我们的社区渠道寻求帮助。

## 无界面创建管理员账户 {#headless-admin-account-creation}

对于不便手动交互的**自动化部署**（Docker、Kubernetes、云平台），Open WebUI 支持使用环境变量在首次启动时自动创建管理员账户。

### 工作方式 {#how-it-works}

配置以下环境变量后：
- `WEBUI_ADMIN_EMAIL`：管理员账户的电子邮件地址
- `WEBUI_ADMIN_PASSWORD`：管理员账户的密码
- `WEBUI_ADMIN_NAME`：（可选）管理员显示名称（默认为“Admin”）

Open WebUI 会自动：
1. 在启动时检查数据库中是否存在任何用户
2. 如果数据库为空（全新安装），使用提供的凭据创建管理员账户
3. 安全地对密码进行哈希处理并存储
4. 自动禁用注册（`ENABLE_SIGNUP=False`），以防止未经授权的账户创建

### 用例 {#use-cases}

此功能特别适用于：
- **CI/CD 流水线**：使用密钥管理中的管理员凭据自动预配 Open WebUI 实例
- **Docker/Kubernetes 部署**：消除容器启动与手动创建管理员之间的时间间隔
- **自动化测试**：使用预配置的管理员账户创建可复现的测试环境
- **无界面服务器**：部署不便通过访问界面手动创建账户的实例

### 示例配置 {#example-configuration}

#### Docker Compose {#docker-compose}
```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      - WEBUI_ADMIN_EMAIL=admin@example.com
      - WEBUI_ADMIN_PASSWORD=${ADMIN_PASSWORD}  # 使用密钥管理
      - WEBUI_ADMIN_NAME=System Administrator
    # ... 其他配置
```

#### Kubernetes Secret {#kubernetes-secret}
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: openwebui-admin
type: Opaque
stringData:
  admin-email: admin@example.com
  admin-password: your-secure-password
  admin-name: System Administrator
---
apiVersion: v1
kind: Pod
metadata:
  name: open-webui
spec:
  containers:
  - name: open-webui
    image: ghcr.io/open-webui/open-webui:main
    env:
    - name: WEBUI_ADMIN_EMAIL
      valueFrom:
        secretKeyRef:
          name: openwebui-admin
          key: admin-email
    - name: WEBUI_ADMIN_PASSWORD
      valueFrom:
        secretKeyRef:
          name: openwebui-admin
          key: admin-password
    - name: WEBUI_ADMIN_NAME
      valueFrom:
        secretKeyRef:
          name: openwebui-admin
          key: admin-name
```

### 重要注意事项 {#important-notes}

:::warning 安全注意事项
- **使用密钥管理**：切勿在 Docker Compose 文件或 Dockerfile 中硬编码 `WEBUI_ADMIN_PASSWORD`。请使用 Docker secrets、Kubernetes secrets 或环境变量注入。
- **强密码**：生产部署请使用强大且唯一的密码。
- **设置后更改**：初始部署后，可考虑通过界面更改管理员密码，以增强安全性。
- **自动禁用注册**：创建管理员后，注册会自动禁用。如有需要，之后可通过**设置 > 通用**（管理员区域）重新启用。
:::

:::info 行为详情
- **仅限全新安装**：**只有**数据库中不存在用户时，才会创建管理员账户。如果用户已存在，这些环境变量会被忽略。
- **密码哈希**：使用与手动创建账户相同的机制对密码进行安全哈希处理，以确保安全性。
- **一次性操作**：这是首次启动时执行的一次性操作。之后即使使用相同的环境变量重启，也不会修改现有管理员账户。
:::

有关这些环境变量的完整文档，请参阅[环境配置指南](/reference/env-configuration#webui_admin_email)。
