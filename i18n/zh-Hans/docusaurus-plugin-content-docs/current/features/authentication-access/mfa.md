---
sidebar_position: 200
title: "双重验证登录（MFA）"
---

# 双重验证登录（MFA）

**要求每位用户在每次登录时输入身份验证器应用生成的验证码。**

启用多因素身份验证（MFA）后，登录需要两个步骤：先输入通常的密码（或使用 LDAP、SSO、受信任标头登录），再输入用户手机或电脑上身份验证器应用生成的六位验证码。任何支持基于时间的一次性验证码的应用均可使用，例如 Proton Authenticator、Aegis、Bitwarden、Bitwarden Authenticator、Microsoft Authenticator、1Password 或 Google Authenticator。这样，仅窃取密码就不足以进入账户。

此设置覆盖实例中的每位用户。尚未设置身份验证器的用户，会在下次登录时按照引导完成设置。

---

## 要求 {#requirements}

- **启用身份验证。**[`WEBUI_AUTH`](/reference/env-configuration#webui_auth) 必须保持默认值 `True`。
- **启用持久化配置。**[`ENABLE_PERSISTENT_CONFIG`](/reference/env-configuration#enable_persistent_config) 必须保持默认值 `True`。
- **稳定的加密密钥。**每位用户身份验证器的密钥都会加密后存入数据库。加密密钥派生自 [`WEBUI_SECRET_KEY`](/reference/env-configuration#webui_secret_key)，或者在设置了 [`MFA_ENCRYPTION_KEY`](/reference/env-configuration#mfa_encryption_key) 时使用后者。如果用户完成注册后密钥发生更改，系统将无法再读取其身份验证器。

MFA 启用期间，Open WebUI 会在启动时检查上述所有条件；如果身份验证或持久化配置已关闭、`MFA_ENCRYPTION_KEY` 不是有效密钥，或无法使用当前密钥解密存储的身份验证器密钥，Open WebUI 将拒绝启动。在最后一种情况下，日志会显示 `ValueError: Stored MFA secrets cannot be decrypted. Restore the WEBUI_SECRET_KEY or MFA_ENCRYPTION_KEY they were encrypted with.` 请恢复之前的密钥，使实例重新运行。

---

## 启用 MFA {#turning-it-on}

1. 打开**设置 > 身份验证**（管理员区域）。
2. 在**多因素身份验证**（Multi-factor authentication）部分，开启**要求所有用户使用身份验证器**（Require an authenticator for all users）。
3. 可选择开启下方显示的一项或两项豁免：
   - **允许 OAuth 登录时不使用身份验证器**（Allow OAuth sign-in without an authenticator）：通过 OAuth 或 OIDC 提供方登录的用户会跳过验证码步骤。如果提供方已经强制执行自己的第二重验证，可使用此选项。
   - **允许受信任标头登录时不使用身份验证器**（Allow trusted-header sign-in without an authenticator）：通过[受信任标头身份验证](/features/authentication-access/auth/sso#trusted-header)访问的用户会跳过验证码步骤。如果身份验证代理已经强制执行第二重验证，可使用此选项。
4. 点击**保存**（Save）。

![设置 > 身份验证（管理员区域）中的多因素身份验证部分，其中“要求所有用户使用身份验证器”已开启，下方显示 OAuth 和受信任标头豁免选项](/images/features/auth/mfa-admin-setting.webp)

:::warning 保存更改会使所有人退出登录
对这三个开关的任何更改，都会使每位用户退出所有设备，包括你自己，随后你会进入登录页面。已设置身份验证器的用户需要输入验证码；尚未设置的用户则需要当场完成设置。
:::

只有管理员的登录会话可以更改这些开关；使用 API 密钥发出的请求会被拒绝。

这些开关也有对应的环境变量：[`ENABLE_MFA`](/reference/env-configuration#enable_mfa)、[`MFA_ALLOW_OAUTH_BYPASS`](/reference/env-configuration#mfa_allow_oauth_bypass) 和 [`MFA_ALLOW_TRUSTED_HEADER_BYPASS`](/reference/env-configuration#mfa_allow_trusted_header_bypass)。它们用于设置首次启动时的初始值；此后，以管理员面板中保存的值为准。

---

## 登录 {#signing-in}

MFA 启用期间，仍在等待管理员批准的账户不会获得会话：每次登录该账户都会回到登录页面，并显示固定消息 **Your account is awaiting administrator approval.**（你的账户正在等待管理员批准。）通过 [`PENDING_USER_OVERLAY_TITLE`](/reference/env-configuration#pending_user_overlay_title) 和 [`PENDING_USER_OVERLAY_CONTENT`](/reference/env-configuration#pending_user_overlay_content) 设置的自定义待审核覆盖层需要会话，因此只会在 MFA 关闭时显示。

### 设置身份验证器 {#setting-up-an-authenticator}

启用 MFA 后，用户首次登录时：

1. 像往常一样使用密码登录。
2. Open WebUI 会显示**设置你的身份验证器**（Set up your authenticator）和二维码。用户使用身份验证器应用扫描二维码，或打开**手动输入密钥**（Enter the key manually）并将密钥输入应用。该条目会在应用中显示为 **Open WebUI**，并附带用户的电子邮件地址。
3. 用户输入应用显示的六位验证码。
4. Open WebUI 会显示十个**恢复代码**，且仅显示一次。用户可以下载这些代码，必须确认已保存，随后才会登录。

![“设置你的身份验证器”界面，其中包含二维码、“手动输入密钥”和“身份验证器验证码”字段](/images/features/auth/mfa-setup-qr.webp)

![“保存你的恢复代码”界面，其中列出十个恢复代码，并提供“下载恢复代码”按钮和确认复选框](/images/features/auth/mfa-recovery-codes.webp)

每个恢复代码只能使用一次，可代替身份验证器验证码。手机丢失时，恢复代码是重新进入账户的方式，因此用户应将其妥善保存在安全且与手机分开的位置。

### 之后的每次登录 {#every-later-sign-in}

输入密码后，Open WebUI 会要求输入当前的六位验证码。点击**使用恢复代码**（Use a recovery code）可将输入字段切换为接收已保存的恢复代码。

验证码每 30 秒更改一次。为容忍微小的时钟差异，Open WebUI 也接受当前验证码的前一个和后一个验证码，但每个验证码只能成功使用一次。第二步必须在输入密码后的五分钟内完成；超时后，用户需要从输入密码开始重新登录。

---

## 管理你的身份验证器 {#managing-your-authenticator}

用户可在**设置 > 账户 > 多因素身份验证**（Settings > Account > Multi-factor authentication）下找到自己的身份验证器。这里会显示是否已设置身份验证器以及剩余多少恢复代码。只有当前登录方式要求使用身份验证器时，才会显示此部分：MFA 已启用，且其登录方法不在豁免范围内。此处的**管理**（Manage）提供两项操作：

- **更换身份验证器**（Replace authenticator）：将账户迁移到新的应用或手机。确认新身份验证器后，会显示一组新的十个恢复代码。
- **生成恢复代码**（Generate recovery codes）：签发十个新的恢复代码。旧代码将失效。

这两项操作都需要当前的身份验证器验证码（或恢复代码），并且要求过去五分钟内完成过登录。如果登录时间超过五分钟，Open WebUI 会先要求用户**重新登录**（Sign in again）。两项操作都会使该账户退出所有设备，包括执行更改的设备。

---

## 恢复丢失的身份验证器 {#recovering-a-lost-authenticator}

当用户同时丢失身份验证器和恢复代码时，拥有服务器 shell 访问权限的人员可以重置其 MFA。请先核实该用户的身份，然后运行：

```bash
open-webui mfa reset user@example.com --reason "Lost phone, identity confirmed by video call"
```

对于 Docker 镜像，请在容器内通过 Python 运行同一命令：

```bash
docker exec -it open-webui python -c "from open_webui import app; app()" mfa reset user@example.com --reason "Lost phone, identity confirmed by video call"
```

该命令会：

1. 移除用户的身份验证器和恢复代码，并使其退出所有设备。
2. 打印一个只能使用一次、30 分钟后过期的**恢复令牌**。

请通过你信任的渠道将令牌发送给用户。下次登录时，用户先输入密码，再在**操作员恢复令牌**（Operator recovery token）字段中输入该令牌，然后按照首次设置时的相同流程设置新的身份验证器并接收新的恢复代码。如果令牌未使用便已过期，请再次运行命令以获取新令牌。

必须提供原因。该命令必须针对与服务器相同的数据库运行，并且需要相同的 `WEBUI_SECRET_KEY`：它会从环境变量中读取密钥，或从当前目录的 `.webui_secret_key` 文件中读取。

---

## 尝试次数限制 {#attempt-limits}

MFA 启用期间，Open WebUI 会限制登录尝试的频率：

| 限制 | 适用范围 |
| --- | --- |
| 每账户每 15 分钟 10 次 | 密码和 LDAP 登录。成功登录也计入次数。 |
| 每账户每 15 分钟 10 次 | 为该账户输入的身份验证器验证码和恢复代码。 |
| 每次登录 5 次 | 单次登录过程中输入的验证码。超过后，用户需要从输入密码开始重新登录。 |
| 每 IP 地址每 15 分钟 100 次 | 会更改身份验证 API 数据的请求：登录、注册、MFA 步骤、密码更改以及 `/api/v1/auths` 下的其他账户操作。 |

配置 Redis 后，每个地址的限制会通过 Redis 在工作进程和副本之间共享；否则按进程分别计数。此限制依赖真实的客户端地址，因此请将 [`FORWARDED_ALLOW_IPS`](/reference/env-configuration#forwarded_allow_ips) 设置为你的反向代理地址。

---

## API 访问与自动化 {#api-access-and-automation}

- **API 密钥不受影响。**它们无需验证码即可继续工作，因此脚本和集成应使用 [API 密钥](/features/authentication-access/api-keys)。
- **通过 API 登录**：只要登录需要验证码，就会返回 MFA 步骤，而不是会话令牌。[OAuth 令牌交换](/reference/env-configuration#enable_oauth_token_exchange)端点也是如此，除非 OAuth 登录已获豁免。
- **管理员通过 API 添加用户**：MFA 启用期间，会返回新账户，但不返回会话令牌。

---

## 事件与日志 {#events-and-logs}

Open WebUI 会发出以下事件。当其中一个事件触发时，[事件函数](/features/extensibility/plugin/functions/event)可以运行你自己的 Python 代码，例如：某账户持续收到错误验证码时向安全团队发出警报、有人更改 MFA 开关时通知管理员，或将注册和恢复代码使用情况记录到外部系统：

| 事件 | 触发时机 |
| --- | --- |
| `auth.mfa.enrolled` | 用户设置了身份验证器。 |
| `auth.mfa.replaced` | 用户更换了身份验证器。 |
| `auth.mfa.failed` | 输入了错误或已使用的验证码。 |
| `auth.mfa.recovery_used` | 使用了恢复代码。 |
| `auth.mfa.recovery_codes_regenerated` | 用户生成了新的恢复代码。 |
| `auth.mfa.policy_changed` | 管理员更改了 MFA 开关。 |

上述每个事件，以及因达到账户级限制而被拒绝的登录，都会作为一条 `MFA security event` 记录写入服务器日志；启用审计日志后，还会写入[审计日志](/getting-started/advanced-topics/hardening#audit-logging)。
