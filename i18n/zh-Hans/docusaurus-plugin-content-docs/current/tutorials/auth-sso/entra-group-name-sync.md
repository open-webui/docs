---
sidebar_position: 40
title: "Entra ID 组名称同步"
---

# Microsoft Entra ID 组名称同步

:::warning

本教程由社区贡献，不受 Open WebUI 团队支持。它仅演示如何针对你的特定用例自定义 Open WebUI。想要贡献内容？请查看贡献教程。

:::

默认情况下，当你在 Open WebUI 中配置 Microsoft Entra ID OAuth 和自动创建组时，安全组会使用其**组 ID（GUID）**同步，而不是使用人类可读的组名称。这是 Microsoft 的一项限制：ID 令牌默认不包含组显示名称。

本教程介绍如何配置 Microsoft Entra ID 返回组**名称**而不是 ID，从而显著改善在 Open WebUI 中使用组时的体验。

## 先决条件 {#prerequisites}

- 已配置 [Microsoft OAuth](/features/authentication-access/auth/sso#microsoft) 的 Open WebUI 实例
- 具有修改应用注册权限的 Azure 账户
- 可访问 Microsoft Entra 管理中心
- 对 Microsoft Entra ID 应用程序配置有基本了解

## 概述 {#overview}

要在 Open WebUI 中获得人类可读的组名称，你需要：

1. 配置应用注册，在令牌中包含组
2. 修改应用程序清单以使用 `cloud_displayname`
3. 将 `groupMembershipClaims` 仅设置为 `ApplicationGroup`
4. 将安全组分配给企业应用程序
5. 为 [OAuth 组管理](/features/authentication-access/auth/sso#oauth-group-management)配置 Open WebUI 环境变量

:::info 关键要求

清单中的 `cloud_displayname` 属性**仅在** `groupMembershipClaims` 设置为 `ApplicationGroup` 时有效。如果包含其他选项（如 `SecurityGroup` 或 `All`），令牌会恢复为使用组 ID 而不是名称。

:::

## 第 1 步：在应用注册中配置令牌声明 {#step-1-configure-token-claims-in-app-registration}

1. 导航至 **Microsoft Entra 管理中心** > **应用注册**
2. 选择你的 Open WebUI 应用程序
3. 在左侧菜单中转到**令牌配置**
4. 点击**添加组声明**
5. 选择**安全组**（或适合你需求的组类型）
6. 在**按类型自定义令牌属性**下，确保为以下令牌添加组：
   - ID 令牌
   - 访问令牌
7. 点击**添加**

## 第 2 步：修改应用程序清单 {#step-2-modify-the-application-manifest}

这是启用组名称而非 ID 的关键步骤。

1. 在你的应用注册中，转到左侧菜单中的**清单**
2. 找到 `optionalClaims` 部分
3. 将 `cloud_displayname` 添加到每种令牌类型的 `additionalProperties` 数组中

你的清单应如下所示：

```json
"optionalClaims": {
    "idToken": [
        {
            "name": "groups",
            "source": null,
            "essential": false,
            "additionalProperties": [
                "cloud_displayname"
            ]
        }
    ],
    "accessToken": [
        {
            "name": "groups",
            "source": null,
            "essential": false,
            "additionalProperties": [
                "cloud_displayname"
            ]
        }
    ],
    "saml2Token": [
        {
            "name": "groups",
            "source": null,
            "essential": false,
            "additionalProperties": [
                "cloud_displayname"
            ]
        }
    ]
}
```

4. **关键**：将 `groupMembershipClaims` 仅设置为 `ApplicationGroup`：

```json
"groupMembershipClaims": "ApplicationGroup"
```

:::warning

如果 `groupMembershipClaims` 包含 `SecurityGroup` 或 `All` 等其他值，`cloud_displayname` 属性将被忽略，令牌会包含组 ID 而不是名称。更多详情见 [Microsoft 可选声明文档](https://learn.microsoft.com/en-us/entra/identity-platform/optional-claims)。

:::

5. 点击**保存**

## 第 3 步：将组分配给企业应用程序 {#step-3-assign-groups-to-the-enterprise-application}

使用 `ApplicationGroup` 时，只有明确分配给企业应用程序的组才会包含在令牌中。

1. 导航至 **Microsoft Entra 管理中心** > **企业应用程序**
2. 找到并选择你的 Open WebUI 应用程序
3. 在左侧菜单中转到**用户和组**
4. 点击**添加用户/组**
5. 选择要与 Open WebUI 同步的安全组
6. 点击**分配**

:::warning 分配多个组

当用户属于多个组时，请确保将所有相关组分配给企业应用程序。请注意，只有在这里明确分配的组才会出现在用户令牌中，并随后同步到 Open WebUI。

:::

## 第 4 步：配置 API 权限 {#step-4-configure-api-permissions}

确保你的应用注册具有所需的 Microsoft Graph 权限：

1. 在你的应用注册中，转到 **API 权限**
2. 点击**添加权限** > **Microsoft Graph** > **委托的权限**
3. 如果 OpenID 部分中的以下权限尚不存在，请添加：
   - `openid`
   - `email`
   - `profile`
4. 点击**代表[你的组织]授予管理员同意**

## 第 5 步：配置 Open WebUI 环境变量 {#step-5-configure-open-webui-environment-variables}

为你的 Open WebUI 部署配置以下环境变量。有关每个变量的更多详情，请参阅[环境变量文档](/reference/env-configuration)。

```bash
# 必需：你的公共 WebUI 地址
WEBUI_URL=https://your-open-webui-domain

# Microsoft OAuth 配置（必需）
MICROSOFT_CLIENT_ID=your_client_id
MICROSOFT_CLIENT_SECRET=your_client_secret
MICROSOFT_CLIENT_TENANT_ID=your_tenant_id
MICROSOFT_REDIRECT_URI=https://your-open-webui-domain/oauth/microsoft/callback

# 可选：退出登录回退项，同时消除启动时的退出警告
OPENID_PROVIDER_URL=https://login.microsoftonline.com/your_tenant_id/v2.0/.well-known/openid-configuration

# 启用 OAuth 注册
ENABLE_OAUTH_SIGNUP=true

# OAuth 组管理
OAUTH_GROUPS_CLAIM=groups
ENABLE_OAUTH_GROUP_MANAGEMENT=true
ENABLE_OAUTH_GROUP_CREATION=true

# 建议：设置一致的密钥
WEBUI_SECRET_KEY=your_secure_secret_key
```

### 环境变量参考 {#environment-variable-reference}

| 变量                        | 默认值  | 描述                                                                                                                                      |
| ------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `OAUTH_GROUPS_CLAIM`            | `groups` | ID 令牌或访问令牌中包含用户组成员身份的声明（`OAUTH_GROUP_CLAIM` 仍会作为回退项读取）。                                                                        |
| `ENABLE_OAUTH_GROUP_MANAGEMENT` | `false`  | 为 `true` 时，每次登录都会将用户组成员身份与 OAuth 声明同步。                                                          |
| `ENABLE_OAUTH_GROUP_CREATION`   | `false`  | 为 `true` 时，启用**即时（JIT）组创建**——OAuth 声明中存在但 Open WebUI 中不存在的组将自动创建。 |

:::warning 严格组同步

当 `ENABLE_OAUTH_GROUP_MANAGEMENT` 设置为 `true` 时，每次登录都会将用户在 Open WebUI 中的组成员身份与其 OAuth 声明中收到的组**严格同步**。

- 用户将被**添加**到与其 OAuth 声明匹配的 Open WebUI 组。
- 如果用户的 OAuth 声明在本次登录会话中**不**包含某些 Open WebUI 组，用户将从这些组中**移除**（包括在 Open WebUI 内手动分配的组）。如果声明缺失或为空，则不会改动任何组成员身份；与 `OAUTH_BLOCKED_GROUPS` 匹配的组永远不会被添加或移除。

:::

## 验证 {#verification}

完成配置后：

1. **测试令牌**：使用 [https://jwt.ms](https://jwt.ms) 解码 ID 令牌，验证 `groups` 声明包含显示名称而不是 GUID。
2. **以测试用户身份登录**：自 v0.8.11 起，管理员和非管理员账户的同步方式相同。
3. **检查 Open WebUI**：导航至管理员面板，验证组是否以可读名称显示。

:::info 管理员用户

自 v0.8.11 起，管理员用户的组成员身份与其他用户的同步方式完全相同，因此可以使用管理员账户进行测试。

:::


## 混合 AD 组（本地 Active Directory） {#hybrid-ad-groups-on-premises-active-directory}

上述 `cloud_displayname` 方法适用于**云原生** Entra ID 安全组。但是，如果你的组织将组从**本地 Active Directory** 同步到 Entra ID，即使按照上述步骤操作，这些同步组在 Open WebUI 中仍可能显示为 GUID。

这是因为 `cloud_displayname` 只解析源自 Entra ID 的组名称。从本地 AD 同步的组需要不同的令牌配置。

### 解决方法：对混合组使用 sAMAccountName {#fix-use-samaccountname-for-hybrid-groups}

1. 在 **Azure 门户**中，导航至你的**应用注册**
2. 转到**令牌配置**
3. 如果已有组声明，点击它进行编辑。否则，点击**添加组声明**
4. 在 **ID** 令牌类型下，将组标识符格式设置为 **sAMAccountName**
5. 点击**保存**

这会让 Entra ID 为 AD 同步组包含本地 `sAMAccountName` 属性，该属性会解析为人类可读的组名称。

:::info 混合环境

如果同时具有**云原生组和本地 AD 同步组**，使用 `sAMAccountName` 可以正确解析这两种类型的名称。

:::

## 其他资源 {#additional-resources}

- [SSO（OAuth、OIDC、可信标头）](/features/authentication-access/auth/sso) - OAuth 配置概述
- [OAuth 组管理](/features/authentication-access/auth/sso#oauth-group-management) - 组同步详情
- [组](/features/authentication-access/rbac/groups) - Open WebUI 中的组管理
- [SSO 故障排除指南](/troubleshooting/sso) - 常见 OAuth 问题及解决方法
- [环境配置](/reference/env-configuration) - 所有环境变量
- [Microsoft 可选声明文档](https://learn.microsoft.com/en-us/entra/identity-platform/optional-claims) - Microsoft 官方文档
