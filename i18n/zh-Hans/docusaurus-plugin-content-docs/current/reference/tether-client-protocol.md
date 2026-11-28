---
title: "Tether 客户端协议"
---

# Tether 客户端协议

本参考介绍原生客户端登录和 Tether 连接握手。有关安装桌面应用以及通过聊天使用计算机的内容，请参阅 [Open WebUI Tether](/ecosystem/tether)。

每个已登录应用都有独立的可续期会话。退出登录或删除会话会将其撤销。未使用的会话会在 [`SESSION_EXPIRES_IN`](/reference/env-configuration#session_expires_in)（默认 `90d`）后过期。访问令牌有效期为 15 分钟；刷新时会同时更换刷新令牌。

## 会话 API {#session-api}

这些端点面向原生客户端开发者。`requests`、`exchange` 和 `refresh` 无需登录；其他所有端点都需要已登录用户的持有者令牌。创建会话以及 requests、exchange、refresh 和 authorize 调用均按 IP 地址限制为每分钟 30 次。

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| `POST` | `/api/v1/auths/sessions/requests` | 启动浏览器登录。发送应用 `name`、环回 `redirect_uri`（例如 `http://127.0.0.1:<port>/callback`，主机为 `127.0.0.1`，必须显式指定端口，不得包含查询参数或片段）、由 32 至 256 个 URL 安全字符组成的 `state`，以及 PKCE `code_challenge`（S256，43 个字符）。请求有效期为 10 分钟。返回 `session_id`，用于打开 `/auth/sessions/<id>`。 |
| `GET` | `/api/v1/auths/sessions/{id}/request` | 返回等待中请求的名称和到期时间。 |
| `POST` | `/api/v1/auths/sessions/{id}/authorize` | 以已登录用户身份批准请求，并返回带有一次性 `code` 的回调地址，该代码有效期为 60 秒。`/auth/sessions/<id>` 页面会调用此端点。 |
| `POST` | `/api/v1/auths/sessions/exchange` | 使用 `session_id`、`code`、`redirect_uri` 和 `code_verifier` 换取访问令牌和刷新令牌。 |
| `POST` | `/api/v1/auths/sessions/refresh` | 使用刷新令牌换取新令牌。可发送可选的 `request_id`，以便在响应丢失时找回新令牌：使用相同的 `request_id` 重复调用会再次返回这些令牌。 |
| `POST` | `/api/v1/auths/sessions` | 从已登录的请求直接创建会话。 |
| `GET` | `/api/v1/auths/sessions` | 列出你的会话。 |
| `DELETE` | `/api/v1/auths/sessions/{id}` | 撤销你的一个会话。 |

### 连接 {#connection}

客户端连接到 WebSocket `/api/v1/tether/connect`，并发送一条 `hello` 消息，其中包含 `version`（`1` 或 `2`）、会话的访问 `token`、`connection_id`、`name` 和 `services` 列表。将 `notifications` 设置为 `true` 可为该连接启用通知。服务器会返回 `ready`。
