---
sidebar_position: 4
title: "加固 Open WebUI"
---

# 加固 Open WebUI

Open WebUI 是一个自托管应用程序，允许经过身份验证的用户使用模型推理、工具执行、代码管道等功能。与其他自托管基础设施（数据库、容器镜像仓库、CI 服务器）一样，部署组织负责管理自己的环境、网络暴露和配置。Open WebUI 提供本文所述的控制项；如何配置取决于你的环境和威胁模型。

本文介绍可用于加固部署的配置选项。每节都会说明设置的作用、默认值和更改方法。它不是一份详尽无遗的安全指南，部署安全最终由你负责。你的环境、合规要求和威胁模型将决定其中哪些内容与你相关。

## 网络位置 {#network-placement}

Open WebUI 专为私有、可信的网络而构建，与数据库、容器镜像仓库和 CI 服务器等其他自托管基础设施类似。大多数部署运行在企业防火墙、VPN 或其他网络边界之后，仅限已知用户访问。

对于重视安全的组织，建议将 Open WebUI 部署在以下一项或多项机制之后：

- VPN（WireGuard、Tailscale）
- 零信任访问代理（Cloudflare Access、Pomerium）
- 具有身份验证和 IP 允许列表功能的反向代理

自动化 Webhook URL 无需登录即可访问，因为 URL 中的机密就是凭据。如果前置代理要求对每个路径进行身份验证，则需要为这些调用设置例外。如果不使用自动化 Webhook，请将 [`ENABLE_AUTOMATION_WEBHOOKS`](/reference/env-configuration#enable_automation_webhooks) 设置为 `false`。

DDoS 防护和暴力破解防范（速率限制、连接节流、fail2ban）应在代理或网络层处理。

Open WebUI 默认监听所有网络接口（`0.0.0.0`）。当同一台机器上的反向代理为其提供前端服务时，让 Open WebUI 保持在回环地址上，防止客户端绕过代理：在 Docker 中使用 `-p 127.0.0.1:3000:8080` 发布端口，或运行 `open-webui serve --host 127.0.0.1`。请参阅 [`HOST`](/reference/env-configuration#host)。Open WebUI 还会从其后端访问 Ollama，因此无需向用户开放 Ollama 的 `11434` 端口；请参阅[不要向网络开放端口 11434](/troubleshooting/connection-error#accessing-ollama-from-open-webui)。

### 对不存在路径的请求 {#requests-for-paths-that-do-not-exist}

Open WebUI 提供的是单页应用程序，因此请求应用程序无法识别的路径时，会返回状态码为 200 的应用程序外壳，而不是 404。JavaScript 文件请求是例外，会返回 404，因为缺失的脚本必须失败，不能向其返回 HTML 页面。

其直观影响体现在访问日志中。自动扫描器会探测它们发现的每台主机上的少数相同路径，例如 `/wp-admin/`、`/phpmyadmin`、`.env` 等，而每个探测请求都会得到 200 响应。实际上没有发现或暴露任何内容，因为响应与每位访问者收到的外壳相同，但日志会让人以为这些请求成功了。

应在反向代理上过滤此类流量，与上述速率限制和暴力破解防护放在一起。代理可以在这些路径到达应用程序之前作出响应或将其丢弃，使其完全不出现在日志中，也不会消耗应用程序资源。在 Open WebUI 内部阻止它们意味着要维护一份扫描器当前使用的路径清单，而且这份清单需要永远更新。

如果你是首次部署 Open WebUI，请先阅读本页底部的[快速参考](#quick-reference)，了解按优先级排列的摘要，然后阅读与你的部署相关的章节。

---

## 密钥 {#secret-key}

`WEBUI_SECRET_KEY` 用于签署 JWT（登录令牌），并派生用于 OAuth 会话数据的加密密钥。

**需要显式设置的情况：**

如果你在负载均衡器后运行多个 Open WebUI 实例，每个实例必须共享相同的密钥。否则，一个实例签署的令牌会被另一个实例拒绝，导致登录失败。使用 `openssl rand -base64 32` 生成密钥，并将其作为环境变量传递给所有副本。

**轮换：**更改密钥会使所有现有会话失效。用户需要重新登录。如果启用了[双因素登录验证](#two-factor-sign-in)，用户的验证器机密会使用从 `WEBUI_SECRET_KEY` 派生的密钥加密，而用户完成 MFA 注册后，Open WebUI 会拒绝在轮换后启动。请在用户注册验证器前设置 [`MFA_ENCRYPTION_KEY`](/reference/env-configuration#mfa_encryption_key)，以便自由轮换 `WEBUI_SECRET_KEY`。已安装的[应用](/features/channels/apps)会在轮换后停止连接；请卸载每个应用，使用其 API 密钥重新连接，并将其添加回所属频道（请参阅[更改 WEBUI_SECRET_KEY 后应用停止连接](/features/channels/apps#apps-stop-connecting-after-webui_secret_key-changed)）。

---

## 身份验证与注册 {#authentication-and-signup}

### 注册 {#registration}

注册仅在第一位用户注册前开放，该用户会成为管理员。此后，注册会自动禁用。此行为无需手动配置。

新账户的默认角色为 `pending`，需要管理员批准后用户才能使用任何功能。如果管理员选择重新启用注册（`ENABLE_SIGNUP=true`），`pending` 默认值可确保新账户在获得明确批准前仍无法访问系统。

```bash
# 新用户处于“pending”状态，直到管理员批准（这是默认行为）
DEFAULT_USER_ROLE=pending
```

### 密码验证 {#password-validation}

Open WebUI 默认不强制要求密码复杂度。启用方法：

```bash
ENABLE_PASSWORD_VALIDATION=true
PASSWORD_VALIDATION_REGEX_PATTERN='^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$'
PASSWORD_VALIDATION_HINT='Minimum 8 characters with uppercase, lowercase, number, and special character.'
```

密码在存储前会使用 bcrypt 进行哈希处理。Bcrypt 会将输入截断为 72 字节，Open WebUI 会强制执行此限制。

### 通过环境变量创建管理员账户 {#admin-account-from-environment-variables}

对于自动化部署，可以在启动时创建管理员账户：

```bash
WEBUI_ADMIN_EMAIL=admin@yourcompany.com
WEBUI_ADMIN_PASSWORD=your-strong-password
WEBUI_ADMIN_NAME=Admin
```

这仅在数据库中没有用户时生效。创建管理员后，注册会自动禁用。

### 仅使用 SSO 的环境 {#sso-only-environments}

如果所有身份验证都由 OAuth/OIDC 提供方处理，可以完全隐藏本地登录表单：

```bash
ENABLE_LOGIN_FORM=false
```

这会从界面中移除电子邮件/密码表单并拒绝本地注册，引导所有用户通过你的 SSO 流程登录。同一开关位于**设置 > 身份验证**（管理员部分）中的 **Login Form（登录表单）**，因此 SSO 正常工作后，无需重启即可将其关闭。你还可以在后端层面禁用本地密码身份验证：

```bash
ENABLE_PASSWORD_AUTH=false
```

如果希望将登录表单行为与账户页面的密码更新分开，可以在**设置 > 账户**中隐藏密码更改表单：

```bash
ENABLE_PASSWORD_CHANGE_FORM=false
```

这适用于以 SSO 为主、不应向用户提供本地密码更改功能的部署。

### 双因素登录验证 {#two-factor-sign-in}

Open WebUI 可以要求所有用户在每次登录后提供来自验证器应用的验证码：

```bash
ENABLE_MFA=true
```

同一开关位于**设置 > 身份验证**（管理员部分）的**多重身份验证**部分，名称为 **Require an authenticator for all users（要求所有用户使用验证器）**。如果身份提供方或代理已强制执行第二重验证，可以让 OAuth 和受信任标头登录免于验证（`MFA_ALLOW_OAUTH_BYPASS`、`MFA_ALLOW_TRUSTED_HEADER_BYPASS`）。更改其中任何设置都会使所有用户退出登录。启用 MFA 期间，登录尝试还会按账户和客户端地址受到限制。有关注册、恢复和限制，请参阅[双因素登录验证（MFA）](/features/authentication-access/mfa)。

---

## 会话和 Cookie 安全 {#session-and-cookie-security}

### Cookie 设置 {#cookie-settings}

通过 HTTPS 提供 Open WebUI 服务时（请参阅 [HTTPS 配置](/reference/https)），请相应地配置 Cookie：

```bash
WEBUI_SESSION_COOKIE_SECURE=true
WEBUI_SESSION_COOKIE_SAME_SITE=strict
```

| 变量 | 默认值 | 作用 |
|---|---|---|
| `WEBUI_SESSION_COOKIE_SECURE` | `false` | 为 `true` 时，Cookie 仅通过 HTTPS 连接发送。 |
| `WEBUI_SESSION_COOKIE_SAME_SITE` | `lax` | 控制是否随跨站请求发送 Cookie。`strict` 提供最强的保护。 |

除非使用 `WEBUI_AUTH_COOKIE_SECURE` 和 `WEBUI_AUTH_COOKIE_SAME_SITE` 覆盖，否则这些设置也适用于 OAuth Cookie。

### 令牌过期 {#token-expiry}

JWT 控制用户保持登录状态的时长。默认值为 `4w`（4 周）。你可以缩短该时长：

```bash
JWT_EXPIRES_IN=24h
```

设置 `JWT_EXPIRES_IN=-1` 会完全禁用令牌过期。设置此值时，Open WebUI 会记录警告。

[Tether](/ecosystem/tether) 等原生应用使用可续期会话，如果超过 [`SESSION_EXPIRES_IN`](/reference/env-configuration#session_expires_in) 未使用，会话就会结束（默认 `90d`）。退出应用、通过[会话 API](/reference/tether-client-protocol#session-api) 删除会话，以及下述每种账户级退出登录操作都会立即撤销此类会话，无论是否使用 Redis。

### 令牌撤销 {#token-revocation}

让账户退出所有设备的操作会记录在数据库中，无论是否使用 Redis 都有效。以下情况会触发该操作：

- 用户更改自己的密码，或管理员为其设置新密码。
- 管理员在用户编辑对话框中点击**退出所有设备**（请参阅[让用户退出所有设备](/features/authentication-access/rbac/roles#signing-a-user-out-of-every-device)）。
- 用户设置或更换验证器、生成新的恢复代码，或者运维人员重置其 MFA。
- 管理员更改[双因素登录验证](#two-factor-sign-in)设置，使所有账户退出登录。

此后，该账户在此刻之前签发的每个令牌都会被拒绝。账户的活动连接会关闭，该用户正在进行的自动化和子代理运行也会失去访问权限。每个打开的活动连接还会每 30 秒重新检查一次，并在会话被撤销或过期后关闭。API 密钥仍然有效；请删除或重新生成密钥以切断访问。此检查会在每个请求上读取数据库，无法访问数据库时请求会被拒绝。

停用账户会保留已向其签发的令牌，并在每个请求上重新检查账户角色。还要使用**退出所有设备**来结束其会话。

:::warning 退出单个会话需要 Redis

没有 Redis 时，**退出登录不会使该会话的令牌失效**。令牌在自然过期之前（默认：4 周）仍然有效且可用。这意味着：

- 被盗或泄露的令牌无法通过退出登录撤销；**退出所有设备**或更改密码才能使其失效
- OIDC 后端通道退出无法撤销令牌

配置 Redis 后，退出登录会将令牌添加到自动过期的撤销列表中，OIDC 后端通道退出则会使受影响用户退出所有设备。这是预期的生产行为。

**撤销检查采用失败开放策略。**无法连接 Redis 的撤销检查会接受令牌，并且每个工作进程每分钟最多记录一次 `Revocation check failed; accepting token`。因此，Redis 中断期间，实例会恢复为上述无 Redis 行为，退出登录不生效；请将 Redis 可用性视为身份验证攻击面的一部分，并为该日志行配置告警。

**如果无法部署 Redis**，请缩短 `JWT_EXPIRES_IN`（例如 `1h` 或 `4h`），以限制暴露窗口。有关设置说明，请参阅 [Redis 教程](/tutorials/integrations/redis)。

:::

---

## CORS {#cors}

跨域资源共享（CORS）控制哪些网站可以从浏览器向你的 Open WebUI API 发出请求。例如，如果你的 Open WebUI 实例位于 `https://chat.yourcompany.com`，CORS 会决定在其他域上运行的脚本能否与它交互。

默认 `CORS_ALLOW_ORIGIN` 为 `*`，允许任何来源。在这种情况下，Open WebUI 会在启动时记录警告。

将其限制为你的域：

```bash
CORS_ALLOW_ORIGIN=https://chat.yourcompany.com
```

多个来源使用分号分隔：

```bash
CORS_ALLOW_ORIGIN=https://chat.yourcompany.com;https://internal.yourcompany.com
```

如果要完全禁用 CORS，请将其设置为一个[无效域](https://en.wikipedia.org/wiki/.invalid)：

```bash
CORS_ALLOW_ORIGIN=http://cors.invalid
```

如果使用采用自定义 URL 方案的桌面应用，请通过以下方式添加：

```bash
CORS_ALLOW_CUSTOM_SCHEME=app
```

---

## 安全标头 {#security-headers}

Open WebUI 包含一个 `SecurityHeadersMiddleware`，用于向响应中注入 HTTP 安全标头。默认不设置任何标头，因此需要通过环境变量逐项选择启用。环境变量参考中的[安全标头](/reference/env-configuration#security-headers)列出了每项可接受的值和回退值。

以下是生产部署的推荐初始配置：

```bash
# HTTP 严格传输安全：指示浏览器仅使用 HTTPS
HSTS=max-age=31536000;includeSubDomains

# 防止页面嵌入其他网站的 iframe
XFRAME_OPTIONS=DENY

# 防止浏览器进行 MIME 类型嗅探
XCONTENT_TYPE=nosniff

# 控制随请求发送多少引用来源信息
REFERRER_POLICY=strict-origin-when-cross-origin

# 限制对浏览器功能的访问
PERMISSIONS_POLICY=camera=(),microphone=(),geolocation=()

# 内容安全策略
CONTENT_SECURITY_POLICY=default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'

# 仅报告模式的内容安全策略（记录违规但不强制执行）
CONTENT_SECURITY_POLICY_REPORT_ONLY=default-src 'self'; report-uri /csp-report

# 跨域隔离标头
CROSS_ORIGIN_EMBEDDER_POLICY=require-corp    # 选项：unsafe-none、require-corp、credentialless
CROSS_ORIGIN_OPENER_POLICY=same-origin       # 选项：unsafe-none、same-origin-allow-popups、same-origin
CROSS_ORIGIN_RESOURCE_POLICY=same-origin     # 选项：same-site、same-origin、cross-origin

# Reporting API 端点配置
REPORTING_ENDPOINTS=default="https://your-report-collector.example/reports"
```

:::tip

如果设置内容安全策略，请从宽松策略开始，逐步收紧。过于严格的 CSP 会破坏前端。使用 `CONTENT_SECURITY_POLICY_REPORT_ONLY` 在强制执行前测试策略。浏览器开发者工具会显示哪些资源被阻止。

:::

:::warning 跨域隔离

同时设置 `CROSS_ORIGIN_EMBEDDER_POLICY=require-corp` 和 `CROSS_ORIGIN_OPENER_POLICY=same-origin` 会启用跨域隔离。除非从第三方来源加载的资源（例如外部图像、脚本或 iframe）显式设置适当的 CORS 标头，否则这可能会破坏这些资源。部署前请充分测试。

:::

---

## HTTPS 和 TLS {#https-and-tls}

Open WebUI 自身不终止 TLS。请将其置于处理 HTTPS 的反向代理（Nginx、Caddy、HAProxy）之后。有关分步代理配置，请参阅 [HTTPS 参考](/reference/https)。

配置好 HTTPS 后：

```bash
WEBUI_SESSION_COOKIE_SECURE=true
HSTS=max-age=31536000;includeSubDomains
```

### 受信任的代理 IP {#trusted-proxy-ips}

[`FORWARDED_ALLOW_IPS`](/reference/env-configuration#forwarded_allow_ips) 决定信任哪些代理发送 `X-Forwarded-For` 标头。Docker 镜像、`open-webui serve` 和 `open-webui dev` 都会读取它。默认值为 `*`（信任所有），只有在前置反向代理会覆盖这些标头且其他来源无法访问后端时才适用。否则，任何客户端都可以声明任意地址，使按地址实施的登录限制失效，并伪造审计日志中的地址。请将其限制为代理的 IP：

```bash
FORWARDED_ALLOW_IPS=192.168.1.100
```

---

## OAuth 和 SSO {#oauth-and-sso}

如果使用 OAuth/OIDC 提供方进行身份验证，可以通过多个选项控制访问。

### 域和组限制 {#domain-and-group-restrictions}

```bash
# 仅允许使用特定域电子邮件地址的用户
OAUTH_ALLOWED_DOMAINS=yourcompany.com

# 让特定 IdP 组不参与组同步：绝不创建、加入或退出
OAUTH_BLOCKED_GROUPS='["contractors-external", "temp-accounts"]'
```

### 角色映射 {#role-mapping}

将 IdP 角色映射到 Open WebUI 角色，以便在身份提供方管理访问权限：

```bash
ENABLE_OAUTH_ROLE_MANAGEMENT=true
OAUTH_ROLES_CLAIM=roles
OAUTH_ADMIN_ROLES=admin,superadmin
OAUTH_ALLOWED_ROLES=user,admin,superadmin
```

### 账户合并 {#account-merging}

```bash
OAUTH_MERGE_ACCOUNTS_BY_EMAIL=false
```

启用后，如果 OAuth 登录的电子邮件与现有本地账户匹配，两者会合并。**不建议这样做。**它依赖 OAuth 提供方可靠地验证电子邮件地址。如果提供方不能保证电子邮件验证，控制匹配电子邮件的用户可能会获得现有账户的访问权限，实际上相当于账户接管。除非已确认提供方强制执行电子邮件验证，否则请保持为 `false`。

### 会话限制 {#session-limits}

```bash
# 每个用户在每个提供方的最大并发 OAuth 会话数（默认：10）
OAUTH_MAX_SESSIONS_PER_USER=5

# 启用 IdP 发起的后端通道退出（需要 Redis）
ENABLE_OAUTH_BACKCHANNEL_LOGOUT=true
```

---

## 受信任标头身份验证 {#trusted-header-authentication}

如果反向代理处理身份验证（Authelia、Authentik、oauth2-proxy），可以通过 HTTP 标头将经过身份验证的身份传递给 Open WebUI。**这是可行的，但根据部署方式可能存在风险。**配置不正确会让任何客户端通过伪造标头冒充任何用户进行身份验证：

```bash
WEBUI_AUTH_TRUSTED_EMAIL_HEADER=X-Forwarded-Email
WEBUI_AUTH_TRUSTED_NAME_HEADER=X-Forwarded-Name
```

:::warning

使用受信任标头时，代理必须先从传入的客户端请求中剥离这些标头，再注入自己的值。如果代理不剥离它们，任何客户端都可以发送伪造标头并冒充任何用户进行身份验证。这是受信任标头身份验证最常见的错误配置。有关如何剥离上游标头，请查阅代理文档。

:::

---

## LDAP {#ldap}

使用 LDAP 进行身份验证时，请启用 TLS 以保护传输中的凭据：

```bash
ENABLE_LDAP=true
LDAP_USE_TLS=true
LDAP_VALIDATE_CERT=true
LDAP_CA_CERT_FILE=/path/to/ca-cert.pem
```

没有 TLS 时，LDAP 凭据会以明文传输。如有需要，可以使用 `LDAP_CIPHERS` 限制密码套件。

---

## 数据库 {#database}

### PostgreSQL {#postgresql}

对于生产部署，与默认 SQLite 相比，PostgreSQL 提供更好的并发性和可靠性：

```bash
DATABASE_URL=postgresql://user:password@db-host:5432/openwebui
```

有关迁移详情，请参阅[扩展指南](/getting-started/advanced-topics/scaling#step-1-switch-to-postgresql)。使用强而唯一的凭据，并将数据库保留在内部网络中。

### SQLCipher {#sqlcipher}

Open WebUI 不支持 SQLCipher，并会拒绝在 `DATABASE_TYPE=sqlite+sqlcipher` 下启动。对于需要静态加密的 SQLite 部署，请将数据目录放在加密文件系统上（Linux 上的 LUKS、Windows 上的 BitLocker、macOS 上的 FileVault）。如需保留现有 SQLCipher 数据库中的数据，请先按照[升级现有 SQLCipher 数据库](/reference/database-schema#upgrading-an-existing-sqlcipher-database)中的说明将其解密。

### 连接池调优 {#connection-pool-tuning}

对于 PostgreSQL，请根据使用情况调整连接池：

```bash
DATABASE_POOL_SIZE=15
DATABASE_POOL_MAX_OVERFLOW=20
DATABASE_POOL_TIMEOUT=30
DATABASE_POOL_RECYCLE=3600
```

整个部署的总连接数 = 连接池大小 × 实例数。请将其保持在 PostgreSQL `max_connections` 限制（默认 100）以下。

---

## API 密钥 {#api-keys}

API 密钥以创建它的用户所具有的相同权限，提供对 Open WebUI 的编程访问。

```bash
# 启用 API 密钥创建（默认：非管理员用户禁用）
ENABLE_API_KEYS=true
```

### 端点限制 {#endpoint-restrictions}

你可以限制密钥允许调用哪些 API 路由：

```bash
ENABLE_API_KEYS_ENDPOINT_RESTRICTIONS=true
API_KEYS_ALLOWED_ENDPOINTS=/api/chat/completions,/api/v1/models
```

向外部服务或自动化分发密钥时，这可以限制已泄露密钥能够访问的内容，非常有用。

### 用户权限 {#user-permissions}

默认情况下，只有管理员可以创建 API 密钥。允许普通用户创建的方法：

```bash
USER_PERMISSIONS_FEATURES_API_KEYS=true
```

---

## 访问控制 {#access-control}

Open WebUI 使用由角色、组和按资源授予访问权限组成的分层权限系统。

### 角色 {#roles}

| 角色 | 能力 |
|---|---|
| `admin` | 完整系统访问、用户管理、所有配置 |
| `user` | 聊天访问、获准使用的模型和资源 |
| `pending` | 经管理员批准前无访问权限 |

### 关键设置 {#key-settings}

```bash
# 新用户的默认角色（默认：pending）
DEFAULT_USER_ROLE=pending

# 管理员是否绕过资源级访问控制（默认：true）
BYPASS_ADMIN_ACCESS_CONTROL=true

# 管理员是否可以查看所有用户聊天（默认：true）
ENABLE_ADMIN_CHAT_ACCESS=true

# 是否允许所有用户访问所有模型而不受组限制（默认：false）
BYPASS_MODEL_ACCESS_CONTROL=false
```

### OpenAI API 透传 {#openai-api-passthrough}

```bash
ENABLE_OPENAI_API_PASSTHROUGH=false
```

OpenAI 路由器包含一个通配代理端点（`/{path:path}`），使用管理员配置的 API 密钥将任何请求转发到上游 OpenAI 兼容 API。**此功能默认禁用，并应保持禁用。**启用后，任何经过身份验证的用户都可以使用管理员凭据访问任何上游端点（包括 Open WebUI 本身未处理的端点），且不受模型级访问控制。仅在明确需要直接透传到上游 API 端点并了解其安全影响时才启用。

### 数据共享和导出 {#data-sharing-and-export}

多个功能控制数据的共享或导出方式：

```bash
# 显示 Open WebUI Community 的共享和发现选项（默认：true）
ENABLE_COMMUNITY_SHARING=true

# 允许管理员从数据库批量导出所有用户聊天（默认：true）
ENABLE_ADMIN_EXPORT=true
```

`ENABLE_COMMUNITY_SHARING` 控制是否显示将聊天、模型、提示词、工具、函数、技能和使用统计发送到 Open WebUI Community 的选项，以及发现社区内容的链接。将其设置为 `false` 可将所有内容保留在你的实例中。聊天分享链接是独立功能：新链接保持私密，直到其所有者选择可以查看的人；请参阅[聊天分享](/features/chat-conversations/chat-features/chatshare)。

### 工作区权限 {#workspace-permissions}

这些设置控制普通用户可以在共享工作区中执行哪些操作：

```bash
USER_PERMISSIONS_WORKSPACE_MODELS_ACCESS=false
USER_PERMISSIONS_WORKSPACE_KNOWLEDGE_ACCESS=false
USER_PERMISSIONS_WORKSPACE_TOOLS_ACCESS=false
USER_PERMISSIONS_WORKSPACE_PROMPTS_ACCESS=false
```

所有设置默认均为 `false`。组级覆盖可以为特定用户组启用特定权限。

---

## 审计日志 {#audit-logging}

审计日志记录 API 活动，用于合规、调试和使用情况分析。默认禁用。

```bash
AUDIT_LOG_LEVEL=METADATA
```

| 级别 | 记录内容 |
|---|---|
| `NONE` | 不记录任何内容（默认） |
| `METADATA` | 用户、IP、用户代理、方法、URL、时间戳、请求的模型、响应状态码 |
| `REQUEST` | 元数据加上请求正文 |
| `REQUEST_RESPONSE` | 元数据加上请求和响应正文 |

### 输出配置 {#output-configuration}

```bash
# 写入文件（默认路径：/app/backend/data/audit.log）
ENABLE_AUDIT_LOGS_FILE=true
AUDIT_LOGS_FILE_PATH=/app/backend/data/audit.log
AUDIT_LOG_FILE_ROTATION_SIZE=10MB
# 无法打开审计日志文件时拒绝启动
ENABLE_AUDIT_LOGS_FILE_STARTUP_CHECK=true

# 同时发送到 stdout，便于日志聚合系统收集
ENABLE_AUDIT_STDOUT=true

# 每个请求/响应正文捕获的最大字节数（默认：2048）
MAX_BODY_LOG_SIZE=2048
```

### 路径过滤 {#path-filtering}

```bash
# 仅审计特定路径（白名单模式，列出 openai 或 ollama 可审计这些路由）
AUDIT_INCLUDED_PATHS=auths,users,configs

# 排除特定路径（黑名单模式，默认）
AUDIT_EXCLUDED_PATHS=/chats,/chat,/folders
```

无论路径排除如何设置，登录、退出登录、注册和 MFA 端点始终会被审计。LDAP 登录端点不携带凭据，因此仅在 [`ENABLE_AUDIT_ANONYMOUS_REQUESTS`](/reference/env-configuration#enable_audit_anonymous_requests) 为 `true` 时才会被审计。`/api/v1/auths` 和 `/oauth/` 下的请求在每个级别都只记录元数据，使密码、MFA 验证码和会话令牌不会进入日志。在其他位置，请求和响应正文中，名称以 `password`、`secret`、`token`、`key` 或 `authorization`（或复数形式，例如 `tokens`）结尾的每个字段，无论字母大小写，都会被屏蔽。这包括值列表以及因正文大小限制而被截断的值。

每个条目都有一个 `model_id` 字段，记录客户端请求的模型。聊天、补全和嵌入请求会填充此字段，包括 `/api/chat/completions`（也通过 `/api/v1/chat/completions` 提供）、`/api/embeddings`（也通过 `/api/v1/embeddings` 提供）、Anthropic 兼容的 `/api/v1/messages`（也通过 `/api/message` 提供）、`/openai/chat/completions`、`/openai/responses`，以及 `/ollama` 下的聊天、补全、嵌入、Messages 和 Responses 请求。图像生成和编辑（`/api/v1/images/generations` 和 `/api/v1/images/edit`）以及视频生成（`/api/v1/videos/generations`）将模型记录为 `<connection id>:<model>`。启用 [`ENABLE_OPENAI_API_PASSTHROUGH`](/reference/env-configuration#enable_openai_api_passthrough) 后，转发到 `/openai` 下服务提供方的每个请求，只要其 JSON 正文包含 `model`，就会记录该值。让 Open WebUI 进一步调用模型的请求（例如 `/api/v1/tasks` 下的任务端点）可以记录被调用的模型。其他请求记录 `null`。无论 `MAX_BODY_LOG_SIZE` 是多少，该字段都会在每个级别完整写入，因此 `METADATA` 足以查看谁使用了哪个模型。默认排除项会跳过聊天界面使用的 `/api/chat/completions` 端点。要记录这些请求，请从列表中移除 `/chat`。

```bash
AUDIT_EXCLUDED_PATHS=/chats,/folders
```

记录聊天请求后，对 `/api/chat/completions` 请求的每个模型回复都会在请求条目旁写入自己的审计条目。当回复调用工具时，模型在两次工具调用之间的每一轮回答都会写入一个条目。此类条目的 `model_id` 是作出回答的模型，`usage` 则包含服务提供方报告的令牌计数（`input_tokens`、`output_tokens` 和 `total_tokens`）。其 `extra.request_id` 保存请求条目的 `id`，将两者关联起来。服务提供方未报告令牌计数的回复不会写入此类条目。标题和标签生成等后台任务也以相同方式写入条目，任务名称保存在 `extra.task` 中。

在这些过滤规则范围内，审计日志涵盖携带凭据的 `POST`、`PUT`、`PATCH` 和 `DELETE` 请求（通过 [`ENABLE_AUDIT_GET_REQUESTS`](/reference/env-configuration#enable_audit_get_requests) 添加 `GET`），以及上述身份验证端点。凭据可以是 `Authorization` 标头（通常为 `Bearer`）、会话 Cookie 或 `x-api-key` 标头中的 API 密钥（可通过 [`CUSTOM_API_KEY_HEADER`](/reference/env-configuration#custom_api_key_header) 重命名）。使用 API 密钥登录的请求会记录在密钥所有者名下。使用错误密钥的请求会记录为没有用户。启动会话的登录或注册会记录在登录账户名下。启用双因素登录验证时，验证码步骤的条目会携带账户信息。没有凭据的请求会被跳过，除非 [`ENABLE_AUDIT_ANONYMOUS_REQUESTS`](/reference/env-configuration#enable_audit_anonymous_requests) 为 `true`；当 `AUDIT_LOG_LEVEL` 为 `NONE` 时，该设置无效。Socket.IO 流量在两种传输方式下都不属于审计范围，包括关闭 [`ENABLE_WEBSOCKET_SUPPORT`](/reference/env-configuration#enable_websocket_support) 时浏览器使用的 `/ws/socket.io` 下长轮询请求。

---

## 网络和出站请求 {#network-and-outbound-requests}

### 出站 TLS {#outbound-tls}

Open WebUI 会向模型 API、嵌入服务提供方、工具服务器和网络搜索服务发出出站 HTTPS 请求。证书验证默认启用：

```bash
REQUESTS_VERIFY=true
AIOHTTP_CLIENT_SESSION_SSL=true
AIOHTTP_CLIENT_SESSION_TOOL_SERVER_SSL=true
ENABLE_WEB_LOADER_SSL_VERIFICATION=true
```

### 离线模式 {#offline-mode}

适用于物理隔离环境：

```bash
OFFLINE_MODE=true
```

这会禁用 HuggingFace Hub 下载、版本更新检查，以及嵌入、重排序和 Whisper 模型的自动更新。模型和嵌入必须在本地可用。

离线模式管理 Open WebUI 代表自身发起的连接。它不会阻止你配置的连接，例如外部模型 API、OAuth 提供方、网络搜索、工具服务器或对象存储。要关闭这些连接，需要在网络层面隔离实例。有关仍可正常使用的完整功能列表，请参阅 [`OFFLINE_MODE`](/reference/env-configuration#offline_mode)。

### SSRF 防护 {#ssrf-prevention}

RAG 网络加载器可以从 URL 获取内容。默认情况下，它无法访问本地网络地址：

```bash
ENABLE_RAG_LOCAL_WEB_FETCH=false
```

将其设置为 `true` 会允许网络加载器从私有 IP 范围获取内容，这在某些环境中可能是必要的，但会引入 SSRF 风险。

私有地址检查不仅检查 IPv6 本身，还会检查其内部。`::ffff:169.254.169.254` 这样的地址，或者封装了 RFC 1918 或回环目标的 6to4、Teredo 或 NAT64 地址，在 IPv6 层面可全局路由，但仍会解析到内部位置；Open WebUI 会提取嵌入的 IPv4 地址，并以此阻止获取。URL 验证时和建立连接时都会应用此检查，因此 DNS 应答返回这些形式之一也会被拒绝。

Open WebUI 默认还会阻止云服务提供方的元数据端点（AWS `169.254.169.254`、GCP `metadata.google.internal`、Azure `metadata.azure.com` 和 Alibaba Cloud `100.100.100.200`）。你可以使用其他域或 IP 扩展此阻止列表：

```bash
WEB_FETCH_FILTER_LIST=!internal.yourcompany.com,!10.0.0.0/8
```

在条目前加上 `!` 可将其阻止。

出站 HTTP 请求默认也不跟随 `3xx` 重定向。如果没有这项限制，攻击者提供的 URL 可以让最初提交的主机通过允许列表检查，然后通过 `302` 重定向到内部地址（RFC 1918、`127.0.0.1`、云元数据 IP），在不重新验证的情况下访问该地址。默认设置会在 RAG 网络加载器、图像加载、OAuth 预检、代码解释器登录和工具服务器执行中关闭此绕过路径。除非有特定需求（例如短链接 URL）且已实施其他 SSRF 防护，否则请保留默认值：

```bash
AIOHTTP_CLIENT_ALLOW_REDIRECTS=false
```

[应用](/features/channels/apps)有自己的限制：应用 URL 必须使用 HTTPS 并解析到公共地址。Open WebUI 会拒绝来自应用的重定向，并始终验证其证书。[`APP_ALLOWED_PRIVATE_ORIGINS`](/reference/env-configuration#app_allowed_private_origins) 列出允许使用私有地址或纯 HTTP 的应用来源。

### 头像 URL 转发 {#profile-image-url-forwarding}

用户和模型头像端点可以发出 `302 Found` 重定向，指向 `profile_image_url` 中存储的任何来源，以便在界面中显示外部托管的头像（例如通过上游身份提供方使用 Gravatar）。该重定向会使用户浏览器直接向外部来源发出请求，泄露客户端 IP、User-Agent 和 Referer 标头。`profile_image_url` 被设置为攻击者控制主机的账户，可以利用这一点对任何显示其头像的人进行去匿名化。

要完全抑制重定向并提供内置的默认图像：

```bash
ENABLE_PROFILE_IMAGE_URL_FORWARDING=false
```

默认值为 `true`，使依赖外部头像的现有部署继续工作。Data URI 和同源/静态图像不受此标志影响：它们会继续正常显示。

存储为 base64 `data:` URI 的头像还受 MIME 类型允许列表约束。默认值为 `image/png,image/jpeg,image/gif,image/webp`；SVG 被有意排除，因为它可以携带内联 `<script>`。响应还会设置 `X-Content-Type-Options: nosniff`，防止浏览器将非图像负载嗅探为可执行类型。要进一步缩小范围（例如仅允许 PNG/JPEG），请设置：

```bash
PROFILE_IMAGE_ALLOWED_MIME_TYPES=image/png,image/jpeg
```

### iframe 内容安全策略 {#iframe-content-security-policy}

Open WebUI 在 `srcdoc` iframe 中渲染 LLM 生成和用户上传的 HTML，用于 Artifacts、代码/HTML 预览、文件预览、引用模态框和可视化。这些 iframe 的 `sandbox` 属性提供基线隔离。对于希望进一步限制渲染 HTML 行为（特别是出站网络请求）的部署，可以设置注入每个 iframe 文档的 CSP：

```bash
IFRAME_CSP=default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; connect-src 'none'
```

上例允许内联脚本在沙箱内运行（大多数 Artifact 需要此能力），但会阻止所有 `fetch`/`XMLHttpRequest`/`WebSocket` 流量；当你不希望模型能够通过生成的 Artifact 外泄会话数据时，这很有用。请根据需要收紧或放宽；过于严格的策略会破坏正常 Artifact。

### 文件上传限制 {#file-upload-limits}

默认情况下，上传文件没有大小或数量限制。为防止存储耗尽：

```bash
# 最大文件大小（MB，默认无限制）
RAG_FILE_MAX_SIZE=50

# 每次上传操作的最大文件数（默认无限制）
RAG_FILE_MAX_COUNT=10

# 限制允许的文件扩展名（空 = 全部允许）
RAG_ALLOWED_FILE_EXTENSIONS=pdf,txt,md,docx,csv
```

---

## 工具、函数与管道 {#tools-functions-and-pipelines}

工具和函数在服务器上运行任意 Python 代码，拥有与 Open WebUI 进程相同的访问权限。这是其工作方式的基础，意味着它们可以读取文件、发出网络请求、访问环境变量以及与数据库交互。

有关安全模型的详情，请参阅[安全策略](/security/security-policy#tools-functions-and-pipelines-security)。

由于工具和函数执行服务器端代码，任何有权创建或导入它们的用户实际上都拥有与 Open WebUI 进程本身相同的访问级别。这是可扩展性工作方式的固有属性。默认情况下，只有管理员可以创建和导入工具与函数。以下设置控制这些权限。

### 完全禁用此功能 {#disabling-the-feature-entirely}

如果部署完全不使用工具或函数，可以彻底移除相关攻击面：

```bash
# 总开关：工具、函数、工具服务器和 Open Terminal
ENABLE_PLUGINS=false

# 或者只关闭其中一部分
ENABLE_TOOLS=false
ENABLE_FUNCTIONS=false
ENABLE_TOOL_SERVERS=false
```

这比[安全模式](#safe-mode)更彻底。安全模式会停用所有函数，但保留该功能；`ENABLE_PLUGINS=false` 会隐藏工作区**工具**页面和管理员**函数**页面，并阻止工具、函数、OpenAPI 和 MCP 工具服务器、Open Terminal 机器、Tether 机器及 Tether 工具服务器加载或运行。[`ENABLE_TOOLS`](/reference/env-configuration#enable_tools)、[`ENABLE_FUNCTIONS`](/reference/env-configuration#enable_functions) 和 [`ENABLE_TOOL_SERVERS`](/reference/env-configuration#enable_tool_servers) 各关闭其中一部分。这四项设置都需要重启。

### 代码执行 {#code-execution}

Open WebUI 默认启用了两项代码执行功能：

```bash
# 允许执行聊天响应中的代码块（默认：true；引擎 pyodide，旧版）
ENABLE_CODE_EXECUTION=true
CODE_EXECUTION_ENGINE=pyodide

# 允许模型在推理过程中运行代码（默认：true；引擎 pyodide，旧版）
ENABLE_CODE_INTERPRETER=true
CODE_INTERPRETER_ENGINE=pyodide
```

`pyodide`（浏览器/WebAssembly）和 `jupyter`（服务器）是**旧版**代码执行引擎。**如果不需要聊天内代码执行，请通过设置 `ENABLE_CODE_EXECUTION=false` 和 `ENABLE_CODE_INTERPRETER=false` 禁用这两项功能。**如果确实需要，请将其隔离：优先使用 **[Open Terminal](/features/open-terminal)**，它在单独的 Docker 容器中运行代码；多租户部署则可使用 **[Terminals](/enterprise)** 实现按用户隔离。不要将基于浏览器的 `pyodide` 引擎视为安全边界；`jupyter` 引擎可直接访问服务器端，绝不能在未保护 Jupyter 实例的情况下公开该引擎。

### 安全模式 {#safe-mode}

如果某个函数在启动时引发问题，可以以安全模式启动来停用所有函数：

```bash
SAFE_MODE=true
```

这样你就可以访问管理员面板并禁用有问题的函数。安全模式会在数据库中将每个函数设置为非活动状态，因此移除 `SAFE_MODE` 并重启后，需要在**管理员面板 > 函数**中重新启用所需的每个函数。

### 依赖项安装 {#dependency-installation}

工具和函数可以在其 frontmatter 中声明 Python 依赖项。默认情况下，这些依赖项会通过 pip 自动安装：

```bash
# 设置为 false，防止根据工具/函数 frontmatter 自动执行 pip 安装
ENABLE_PIP_INSTALL_FRONTMATTER_REQUIREMENTS=false
```

禁用此设置可防止上传的工具在运行时拉取任意软件包。在生产部署中，特别是非管理员用户可以创建工具时，应将其设置为 `false`。

### 工作区访问 {#workspace-access}

控制谁可以创建、导入和共享工具与函数：

```bash
USER_PERMISSIONS_WORKSPACE_TOOLS_ACCESS=false
USER_PERMISSIONS_WORKSPACE_TOOLS_IMPORT=false
USER_PERMISSIONS_WORKSPACE_SKILLS_ACCESS=false
```

所有设置默认均为 `false`，意味着只有管理员可以管理工具和函数。除非有特定需求并且信任被授予访问权限的用户，否则请保持这些限制。

---

## 容器加固 {#container-hardening}

### 基础镜像 {#base-image}

默认 Dockerfile 使用 `python:3.12-slim-trixie`（Debian 13 上的 Python 3.12）。如果组织要求使用经过加固或批准的基础镜像，可以通过修改 Dockerfile 中的 `FROM` 行进行替换。这在强制要求使用经过漏洞扫描的最小基础镜像的企业环境中很常见。

### 固定依赖项 {#pinned-dependencies}

标准和 Slim 镜像从哈希固定的锁定文件安装 Python 软件包，因此构建会安装精确的固定版本。有关自定义镜像，请参阅[自行构建](/getting-started/quick-start#building-it-yourself)。

### 以非 root 用户运行 {#non-root-execution}

Dockerfile 支持以非 root 用户运行：

```bash
docker build --build-arg UID=1000 --build-arg GID=1000 .
```

### OpenShift 兼容性 {#openshift-compatibility}

对于使用任意 UID 运行容器的环境（OpenShift）：

```bash
docker build --build-arg USE_PERMISSION_HARDENING=true .
```

### 数据目录 {#data-directory}

数据目录（`/app/backend/data`）包含数据库、上传的文件和缓存的插件。自动生成的密钥写入此目录之外的 `/app/backend/.webui_secret_key`，因此请设置 [`WEBUI_SECRET_KEY`](/reference/env-configuration#webui_secret_key)，或将 [`WEBUI_SECRET_KEY_FILE`](/reference/env-configuration#webui_secret_key_file) 指向数据目录，以便在重新创建容器后保留密钥。使用适当的文件系统权限保护此目录，并将其纳入备份策略。

### 开发功能 {#development-features}

Docker 镜像默认设置 `ENV=prod`，这会禁用 `/docs` 下的 Swagger/OpenAPI 文档界面。如果手动运行，请设置 `ENV=prod`，确保不暴露这些端点。

---

## 可观测性 {#observability}

### 结构化日志 {#structured-logging}

```bash
LOG_FORMAT=json
GLOBAL_LOG_LEVEL=INFO
```

JSON 日志专为 ELK、Datadog 或 Splunk 等日志聚合系统设计。

### OpenTelemetry {#opentelemetry}

```bash
ENABLE_OTEL=true
ENABLE_OTEL_TRACES=true
ENABLE_OTEL_METRICS=true
OTEL_EXPORTER_OTLP_ENDPOINT=http://your-collector:4317
OTEL_SERVICE_NAME=open-webui
```

有关完整设置，请参阅[监控](/reference/monitoring)和 [Open WebUI 日志](/getting-started/advanced-topics/logging)。

---

## SCIM 预配 {#scim-provisioning}

SCIM 2.0 允许身份提供方自动管理用户账户：

```bash
ENABLE_SCIM=true
SCIM_TOKEN=your-bearer-token
SCIM_AUTH_PROVIDER=oidc
```

SCIM 令牌是一个静态持有者令牌，授予完整的用户管理访问权限。请像管理员凭据一样谨慎保护它，定期轮换，并仅通过 HTTPS 传输。

---

## 保持 Open WebUI 更新 {#keeping-open-webui-updated}

运行最新版本的 Open WebUI 有助于让部署及时获得最新的安全补丁和修复。查看[更新日志](https://github.com/open-webui/open-webui/releases)中的安全相关更新，并及时应用。

对于 Docker 部署，拉取最新镜像并重新创建容器：

```bash
docker pull ghcr.io/open-webui/open-webui:main
```

对于多副本部署，请同时更新每个实例：停止所有副本，让一个实例运行迁移，然后以新版本启动其余实例。请参阅[更新与迁移](/troubleshooting/multi-replica#updates-and-migrations)。

---

## 快速参考 {#quick-reference}

下表总结了本文涵盖的关键加固操作。每行都链接到相关章节以了解详情。

| 操作 | 默认 | 生产环境建议 |
|---|---|---|
| [保持在私有网络中](#network-placement) | 无限制 | VPN、防火墙或零信任代理 |
| [通过 HTTPS 提供服务](#https-and-tls) | HTTP | 通过反向代理使用 HTTPS |
| [设置 `WEBUI_SECRET_KEY`](#secret-key)（多副本） | 自动生成 | 显式共享密钥 |
| [检查注册策略](#registration) | 第一位用户后禁用 | 保持禁用或使用 `pending` 角色 |
| [启用密码验证](#password-validation) | 已禁用 | `ENABLE_PASSWORD_VALIDATION=true` |
| [保护 Cookie](#cookie-settings) | `Secure=false`、`SameSite=lax` | `Secure=true`、`SameSite=strict` |
| [要求双因素登录验证](#two-factor-sign-in) | 已禁用 | `ENABLE_MFA=true` |
| [启用令牌撤销](#token-revocation) | 退出单个会话需要 Redis | 配置 Redis 或缩短 `JWT_EXPIRES_IN` |
| [限制 CORS](#cors) | `*` | 你的特定域 |
| [设置安全标头](#security-headers) | 无 | HSTS、X-Frame-Options、CSP、跨域策略 |
| [限制 OAuth 域](#domain-and-group-restrictions) | 全部允许 | `OAUTH_ALLOWED_DOMAINS=yourdomain.com` |
| [启用审计日志](#audit-logging) | `NONE` | `METADATA` 或更高级别 |
| [限制 API 密钥端点](#endpoint-restrictions) | 所有端点 | `ENABLE_API_KEYS_ENDPOINT_RESTRICTIONS=true` |
| [保持 API 透传禁用](#openai-api-passthrough) | 已禁用 | 保持 `ENABLE_OPENAI_API_PASSTHROUGH=false` |
| [未使用时禁用工具和函数](#disabling-the-feature-entirely) | 已启用 | `ENABLE_PLUGINS=false` |
| [禁用自动 pip 安装](#dependency-installation) | 已启用 | `ENABLE_PIP_INSTALL_FRONTMATTER_REQUIREMENTS=false` |
| [检查社区共享](#data-sharing-and-export) | `true` | 涉及敏感数据时禁用 |
| [使用 PostgreSQL](#postgresql) | SQLite | PostgreSQL |
| [验证出站 TLS](#outbound-tls) | 已启用 | 保持启用 |
| [启用离线模式](#offline-mode) | 已禁用 | 物理隔离环境使用 `OFFLINE_MODE=true` |
| [结构化日志](#structured-logging) | 文本 | `LOG_FORMAT=json` |
| [保持更新](#keeping-open-webui-updated) | 不适用 | 最新稳定版本 |

---

## 安全优先部署 {#security-first-deployment}

对于重视安全的组织，以下实践定义了推荐的部署基线。每项对应部署的一个独立层面，共同构成纵深防御。每项均链接到上文相关章节，了解详细配置。

### 网络和传输 {#network-and-transport}

1. **将 Open WebUI 置于具有速率限制和 IP 允许列表的 VPN、反向代理或零信任访问层之后。**Open WebUI 专为私有、可信的网络而构建。不要在没有额外访问控制层的情况下将其直接暴露到公共互联网。配置代理以限制连接速率、限制重复身份验证尝试、仅允许已知 IP 范围访问，并使用 fail2ban 等工具阻止滥用来源。将 `FORWARDED_ALLOW_IPS` 限制为代理的 IP，防止标头欺骗。[详情](#network-placement)

2. **所有流量均通过 HTTPS 传输，并启用所有安全标头。**使用终止 TLS 的反向代理。使用 `Secure=true` 和 `SameSite=strict` 配置会话 Cookie。切勿在生产环境通过纯 HTTP 提供 Open WebUI。启用 HSTS、内容安全策略、X-Frame-Options、X-Content-Type-Options、Referrer-Policy 和 Permissions-Policy。不要将 CORS 保留为 `*`；仅将其限制为确实需要访问的精确域。[详情](#https-and-tls)

### 身份验证和访问控制 {#authentication-and-access-control}

3. **保持注册禁用。**Open WebUI 会在第一位用户注册后自动禁用注册。任何新账户的默认角色均为 `pending`，需要管理员明确批准后才能使用任何功能。不要在可信网络之外可访问的实例上重新启用开放注册。[详情](#registration)

4. **使用身份提供方的 SSO 并禁用本地身份验证。**与组织的 OAuth/OIDC 或 LDAP 提供方集成。将访问限制为特定电子邮件域和 IdP 组，将 IdP 角色映射到 Open WebUI 角色，并完全禁用本地登录表单和密码身份验证。限制每个用户的并发会话数，结合 Redis 启用后端通道退出，使用户预配被取消时会话立即失效；除非提供方保证电子邮件验证，否则不要启用 OAuth 账户合并。[详情](#oauth-and-sso)

5. **强制要求密码复杂度并缩短会话生命周期。**如果使用本地账户，请启用密码验证和双因素登录验证。将默认的 4 周 JWT 过期时间缩短为适合环境的时长（例如 8 到 24 小时）。不要在生产环境禁用令牌过期。[详情](#password-validation)

6. **定期审查用户账户和权限。**移除非活动账户，审计组成员身份，并验证工作区权限仍然适当。使用 SCIM 预配通过身份提供方自动管理账户生命周期。[详情](#access-control)

### 工具、函数和扩展 {#tools-functions-and-extensions}

7. **将工具和函数的创建权限限制给管理员，并在导入前审查所有代码。**默认情况下，只有管理员可以创建、导入和管理工具与函数。不要向不受信任的用户授予工作区权限。像审查在基础设施上运行的任何代码一样严格审查第三方工具。切勿在未先审查源代码的情况下导入工具。[详情](#tools-functions-and-pipelines)

8. **禁用自动依赖项安装，并在不需要时禁用代码执行。**设置 `ENABLE_PIP_INSTALL_FRONTMATTER_REQUIREMENTS=false`，防止工具在运行时拉取任意软件包。如果部署不需要聊天内代码执行，请完全禁用（`ENABLE_CODE_EXECUTION=false`、`ENABLE_CODE_INTERPRETER=false`）。如果需要，请使用 **Open Terminal**（容器隔离）隔离代码执行，避免使用旧版 `pyodide` 和 `jupyter` 引擎；`jupyter` 引擎可直接访问服务器端，绝不能在未保护 Jupyter 实例的情况下公开它。[详情](#dependency-installation)

### 数据保护 {#data-protection}

9. **限制数据共享、文件上传和 API 密钥访问。**设置最大文件大小、文件数量限制，并限制允许的文件扩展名。如果运维上不需要，请禁用社区共享（`ENABLE_COMMUNITY_SHARING=false`）和管理员批量导出（`ENABLE_ADMIN_EXPORT=false`）。将 API 密钥创建权限限制给管理员，并启用端点限制，以限定每个密钥可以访问的路由。[详情](#data-sharing-and-export)

10. **加密静态数据并定期备份。**对于 SQLite，使用加密文件系统。对于 PostgreSQL，使用磁盘级加密或透明数据加密。定期备份，将备份存储在独立的安全域中，并定期测试恢复流程。[详情](#sqlcipher)

### 出站网络控制 {#outbound-network-controls}

11. **保持 SSRF 防护、出站 TLS 验证和网络限制启用。**不要启用本地网络内容获取。默认配置会阻止访问私有 IP 范围和云服务提供方元数据端点；请扩展阻止列表，纳入环境特定的内部域。不要禁用出站连接的证书验证。对于物理隔离环境，请启用离线模式，使 Open WebUI 停止发起自己的出站调用，并在网络层面隔离实例，以关闭不受其控制的连接。[详情](#ssrf-prevention)

### 供应链和变更管理 {#supply-chain-and-change-management}

12. **使用官方容器镜像，或从源代码构建。**从 `ghcr.io/open-webui/open-webui` 或 Docker Hub 上的 `openwebui/open-webui` 拉取镜像。要完全控制供应链，请使用提供的 Dockerfile 直接从[源代码](https://github.com/open-webui/open-webui)构建。不要使用非官方或第三方镜像。[详情](#container-hardening)

13. **固定到特定发布版本，并在部署前验证更新。**使用带标签的发布版本，而不是 `:main` 或 `:latest`。升级前查看更新日志。在推广到生产环境之前，先在预发布环境验证新版本，并保留回滚能力。不要自动更新生产部署。[详情](#keeping-open-webui-updated)

### 容器和基础设施 {#container-and-infrastructure}

14. **以非 root 用户和最小权限在分段网络上运行。**使用非 root UID/GID，尽可能使用只读文件系统挂载，移除所有不必要的 Linux 能力，并设置 `--security-opt=no-new-privileges`。对数据目录应用限制性权限（例如 `0700`）。在独立网段中使用具有强凭据的 PostgreSQL，不要使其可从公共互联网访问。[详情](#non-root-execution)

### 可观测性和事件响应 {#observability-and-incident-response}

15. **启用 METADATA 或更高级别的审计日志，并转发到 SIEM。**始终审计身份验证端点。配置保留策略，并将日志转发到组织的日志聚合基础设施。使用 JSON 日志格式，并在支持时启用 OpenTelemetry 进行分布式追踪。[详情](#audit-logging)

16. **监控异常情况。**跟踪 CPU、内存、网络和磁盘使用情况。与告警基础设施集成，尽早发现异常计算资源使用、出站网络活动或存储消耗。[详情](#observability)

17. **维护事件响应计划。**针对账户泄露、未经授权访问和异常资源消耗制定处理流程。了解如何禁用用户账户、让用户退出所有设备、重置用户的双因素登录验证、轮换密钥和审查审计日志。
