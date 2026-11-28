---
sidebar_position: 10
title: "Okta SSO（OIDC）"
---

# Okta OIDC SSO 集成

:::warning

本教程由社区贡献，不受 Open WebUI 团队支持。它仅用于演示如何针对你的特定用例自定义 Open WebUI。想要贡献内容？请查看贡献教程。

:::

## 概述 {#overview}

本文档介绍将 Okta OIDC 单点登录（SSO）与 Open WebUI 集成所需的步骤，还介绍了根据 Okta 组成员身份管理 Open WebUI 用户组的**可选**功能，包括**即时（JIT）组创建**。按照这些步骤操作后，用户将能够使用其 Okta 凭据登录 Open WebUI。如果选择启用组同步（`ENABLE_OAUTH_GROUP_MANAGEMENT`），用户登录时会根据其 Okta 组自动分配到 Open WebUI 中的相关组。如果*还*启用了 JIT 组创建（`ENABLE_OAUTH_GROUP_CREATION`），Okta 声明中存在但 Open WebUI 中缺少的组将在登录期间自动创建。

### 前提条件 {#prerequisites}

*   一个新的或现有的 Open WebUI 实例。
*   具有创建和配置应用程序管理权限的 Okta 账户。
*   对 OIDC、Okta 应用程序配置和 Open WebUI 环境变量有基本了解。

## 设置 Okta {#setting-up-okta}

首先，需要在 Okta 组织中配置一个 OIDC 应用程序，并设置组声明，以便将组信息传递给 Open WebUI。

### 1. 在 Okta 中创建/配置 OIDC 应用程序 {#1-createconfigure-oidc-application-in-okta}

1.  登录 Okta 管理控制台。
2.  导航至 **Applications > Applications**。
3.  创建一个新的 **OIDC - OpenID Connect** 应用程序（类型选择 **Web Application**），或选择要用于 Open WebUI 的现有应用程序。

    ![Okta 创建应用程序](/images/tutorials/okta/okta-auth-create-app.png)

4.  在设置过程中或应用程序的 **General** 设置选项卡中，配置 **Sign-in redirect URIs**。添加 Open WebUI 实例的 URI，并在末尾加上 `/oauth/oidc/callback`。例如：`https://your-open-webui.com/oauth/oidc/callback`。
5.  记下应用程序 **General** 选项卡中提供的 **Client ID** 和 **Client secret**。配置 Open WebUI 时需要用到它们。

    ![Okta 客户端密钥](/images/tutorials/okta/okta-auth-clientkey.png)

6.  确保在 **Assignments** 选项卡下将正确的用户或组分配给此应用程序。

### 2. 向 ID 令牌添加组声明 {#2-add-a-groups-claim-to-the-id-token}

**（可选）**要根据 Okta 组在 Open WebUI 中启用自动组管理，需要配置 Okta，使其在 ID 令牌中发送用户的组成员身份。如果只需要 SSO 登录，并且希望直接在 Open WebUI 中手动管理组，可以跳过本节。

1.  在管理控制台中，前往 **Applications > Applications**，然后选择你的 OIDC 客户端应用程序。
2.  前往 **Sign On** 选项卡，在 **OpenID Connect ID Token** 部分点击 **Edit**。
3.  在 **Group claim type** 部分选择 **Filter**。
4.  在 **Group claims filter** 部分：
    *   输入 `groups` 作为声明名称（如果已有默认值，也可以使用默认值）。
    *   从下拉菜单中选择 **Matches regex**。
    *   在正则表达式字段中输入 `.*`。这将包含用户所属的所有组。如有需要，可以使用更具体的正则表达式。
5.  点击 **Save**。
6.  点击 **Back to applications** 链接。
7.  在应用程序的 **More** 按钮下拉菜单中，点击 **Refresh Application Data**。

*有关更高级的组声明配置，请参阅 Okta 关于[自定义令牌](https://developer.okta.com/docs/guides/customize-tokens-returned-from-okta/main/)和[组函数](https://developer.okta.com/docs/reference/okta-expression-language/#group-functions)的文档。*

### 3. 应用 MFA（例如 Google Authenticator） {#3-applying-mfa-eg-google-authenticator}

为了增强安全性，可以对通过 Okta 登录 Open WebUI 的用户强制执行多因素身份验证（MFA）。此示例演示如何将 Google Authenticator 设置为附加验证因素。

1.  **配置身份验证器**：
    *   在 Okta 管理控制台中，导航至 **Security > Authenticators**。
    *   点击 **Add Authenticator**，然后添加 **Google Authenticator**。
    *   在设置过程中，可以将 **"User verification"** 设置为 **"Required"** 以增强安全性。

2.  **创建并应用登录策略**：
    *   前往 **Security > Authenticators**，然后点击 **Sign On** 选项卡。
    *   点击 **Add a policy** 创建新策略（例如“WebUI MFA Policy”）。
    *   在刚刚创建的策略中，点击 **Add rule**。
    *   配置规则：
        *   将 **"IF User's IP is"** 设置为 **"Anywhere"**。
        *   将 **"THEN Access is"** 设置为 **"Allowed after successful authentication"**。
        *   在 **"AND User must authenticate with"** 下，选择 **"Password + Another factor"**。
        *   确保 **"AND Possession factor constraints are"** 下包含所需的验证因素（例如 Google Authenticator）。
    *   最后，将此策略分配给你的 Open WebUI 应用程序。前往 **Applications > Applications**，选择你的 OIDC 应用程序，然后在 **Sign On** 选项卡下选择你创建的策略。

现在，用户登录 Open WebUI 时，需要提供其 Okta 密码以及 Google Authenticator 生成的附加验证码。

如果还启用了 Open WebUI 自己的[双因素登录](/features/authentication-access/mfa)，Okta 用户还需要输入 Open WebUI 要求的第二个验证码。开启 **Allow OAuth sign-in without an authenticator**（[`MFA_ALLOW_OAUTH_BYPASS`](/reference/env-configuration#mfa_allow_oauth_bypass)）即可仅依赖 Okta 的验证因素。

:::note

重新身份验证频率
默认情况下，为了改善用户体验，Okta 的登录策略可能不会要求同一设备或浏览器每次登录时都进行 MFA。如果要求每个会话都进行 MFA，可以在创建的策略规则中调整此设置。找到 **"Prompt for re-authentication"** 设置，并将其设为 **"Every sign-in attempt"**。

:::

## 配置 Open WebUI {#configuring-open-webui}

要在 Open WebUI 中启用 Okta OIDC SSO，需要设置以下核心环境变量。如果希望启用可选的组管理功能，还需要设置其他变量。

```bash

# --- OIDC 核心设置 ---

# 如果希望用户能够通过 Okta 创建账户，请启用 OAuth 注册

# ENABLE_OAUTH_SIGNUP="true"

# Okta 应用程序的客户端 ID
OAUTH_CLIENT_ID="YOUR_OKTA_CLIENT_ID"

# Okta 应用程序的客户端密钥
OAUTH_CLIENT_SECRET="YOUR_OKTA_CLIENT_SECRET"

# Okta 组织的 OIDC 发现 URL

# 格式：https://<your-okta-domain>/.well-known/openid-configuration

# 或特定授权服务器：https://<your-okta-domain>/oauth2/<auth-server-id>/.well-known/openid-configuration
OPENID_PROVIDER_URL="YOUR_OKTA_OIDC_DISCOVERY_URL"

# 登录按钮上显示的名称（例如“Login with Okta”）
OAUTH_PROVIDER_NAME="Okta"

# 要请求的作用域（通常默认值即可）

# OAUTH_SCOPES="openid email profile groups" # 如果默认作用域未包含 groups，请确保将其包含在内

# --- OAuth 组管理（可选）---

# 仅当已在 Okta 中配置组声明（第 2 步）

# 并且希望登录时根据 Okta 组管理 Open WebUI 组时，才设置为 "true"。

# 这会同步现有组。系统会在 Open WebUI 组中添加或移除用户，

# 以匹配其 Okta 组声明。

# ENABLE_OAUTH_GROUP_MANAGEMENT="true"

# 仅当 ENABLE_OAUTH_GROUP_MANAGEMENT 为 true 时才需要。

# ID 令牌中包含组信息的声明名称（必须与 Okta 配置匹配）

# OAUTH_GROUPS_CLAIM="groups"

# 可选：如果组存在于 Okta 声明中但不存在于 Open WebUI 中，则启用组的即时（JIT）创建。

# 需要 ENABLE_OAUTH_GROUP_MANAGEMENT="true"。

# 如果设置为 false（默认值），则仅同步现有组。

# ENABLE_OAUTH_GROUP_CREATION="false"
```

将 `YOUR_OKTA_CLIENT_ID`、`YOUR_OKTA_CLIENT_SECRET` 和 `YOUR_OKTA_OIDC_DISCOVERY_URL` 替换为 Okta 应用程序配置中的实际值。

要启用基于 Okta 声明的组同步，请设置 `ENABLE_OAUTH_GROUP_MANAGEMENT="true"`，并确保 `OAUTH_GROUPS_CLAIM`（旧版 `OAUTH_GROUP_CLAIM` 仍会作为回退读取）与 Okta 中配置的声明名称匹配（默认为 `groups`）。

要*同时*为存在于 Okta 中但尚未存在于 Open WebUI 中的组启用自动即时（JIT）创建，请设置 `ENABLE_OAUTH_GROUP_CREATION="true"`。如果只想管理 Open WebUI 中已有组的成员关系，可以将此值保持为 `false`。

:::warning

组成员关系管理
当 `ENABLE_OAUTH_GROUP_MANAGEMENT` 设置为 `true` 时，用户每次登录时，其在 Open WebUI 中的组成员关系都会与 Okta 声明中收到的组**严格同步**。这意味着：
*   用户将被**添加**到与其 Okta 声明匹配的 Open WebUI 组。
*   如果用户此次登录会话的 Okta 声明中**不**包含某些 Open WebUI 组，用户将从这些组中被**移除**（包括在 Open WebUI 中手动创建或分配的组）。如果声明缺失或为空，则不会更改任何成员关系；与 `OAUTH_BLOCKED_GROUPS` 匹配的组绝不会被添加或移除。

确保所有必要的组都已在 Okta 中正确配置和分配，并包含在组声明中。

:::

:::info

多节点部署中的会话持久性

在多个节点上部署 Open WebUI 时（例如在 Kubernetes 集群中或负载均衡器后面），确保会话持久性对于提供无缝的用户体验至关重要，使用 SSO 时尤其如此。请在**所有** Open WebUI 实例上将 `WEBUI_SECRET_KEY` 环境变量设置为**相同且安全的唯一值**。

:::

```bash

# 示例：生成强密钥（例如使用 openssl rand -hex 32）
WEBUI_SECRET_KEY="YOUR_UNIQUE_AND_SECURE_SECRET_KEY"
```

如果此密钥在所有节点上不一致，当用户的会话被路由到不同节点时，用户可能会被迫重新登录，因为一个节点签名的会话令牌在另一个节点上无效。默认情况下，Docker 镜像会在首次启动时生成随机密钥，这不适用于多节点部署。

:::tip

禁用标准登录表单

如果打算*仅*允许通过 Okta（以及可能配置的其他 OAuth 提供方）登录，可以通过设置以下环境变量来禁用标准电子邮件/密码登录表单：

:::


```bash
ENABLE_LOGIN_FORM="false"
```

:::danger

重要前提条件
设置 `ENABLE_LOGIN_FORM="false"` 时，**必须**同时设置 `ENABLE_OAUTH_SIGNUP="true"`。如果在未启用 OAuth 注册的情况下禁用登录表单，**用户（包括管理员）将无法登录。**在禁用标准登录表单之前，请确保至少配置了一个 OAuth 提供方，并已启用 `ENABLE_OAUTH_SIGNUP`。

:::

设置这些环境变量后，重启 Open WebUI 实例。

## 验证 {#verification}

1.  导航到 Open WebUI 登录页面。你应该会看到一个标有“Login with Okta”的按钮（或你在 `OAUTH_PROVIDER_NAME` 中设置的名称）。
2.  点击该按钮，通过 Okta 登录流程进行身份验证。
3.  身份验证成功后，你应该会被重定向回 Open WebUI 并登录。
4.  如果 `ENABLE_OAUTH_GROUP_MANAGEMENT` 为 true，请以测试用户身份登录。此时，该用户在 Open WebUI 中的组应严格反映其当前在 Okta 中的组成员关系（*不在* Okta 声明中的任何组成员关系都将被移除）。如果 `ENABLE_OAUTH_GROUP_CREATION` 也为 true，则用户的 Okta 声明中存在、但此前不存在于 Open WebUI 中的任何组现在都应已自动创建。自 v0.8.11 起，管理员用户的组也会以相同方式同步。
5.  如果遇到问题，请检查 Open WebUI 服务器日志中是否存在 OIDC 或组相关错误。

## 故障排除 {#troubleshooting}

*   **400 Bad Request/重定向 URI 不匹配：**仔细检查 Okta 应用程序中的 **Sign-in redirect URI** 是否与 `<your-open-webui-url>/oauth/oidc/callback` 完全一致。
*   **组未同步：**验证 `OAUTH_GROUPS_CLAIM` 环境变量是否与 Okta ID 令牌设置中配置的声明名称匹配。确保用户在组更改后已注销并重新登录——更新 OIDC 需要经过登录流程。自 v0.8.11 起，管理员组也会同步。
*   **配置错误：**查看 Open WebUI 服务器日志，获取与 OIDC 配置相关的详细错误消息。

*   请参阅官方 [Open WebUI SSO 文档](/features/authentication-access/auth/sso)。
*   查阅 [Okta 开发者文档](https://developer.okta.com/docs/)。
