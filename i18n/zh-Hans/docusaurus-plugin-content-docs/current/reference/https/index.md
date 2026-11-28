---
sidebar_position: 6
title: "HTTPS 与反向代理"
---

# HTTPS 与反向代理

**使用 TLS 加密、反向代理或托管隧道保护你的 Open WebUI 部署。**

HTTPS 会加密用户与 Open WebUI 之间的所有流量，保护聊天历史记录、凭据和上传的文件。语音通话等浏览器功能也**必须**使用 HTTPS，因为它们需要安全上下文才能访问麦克风。

:::warning 语音通话需要 HTTPS
现代浏览器会阻止非 HTTPS 来源访问麦克风。除非使用 `localhost`，否则**语音通话无法**通过普通 `http://` 工作。
:::

`{{CLIPBOARD}}` 和 `{{USER_LOCATION}}` [提示词变量](/features/workspace/prompts#system-variables)同样需要安全上下文。在 `localhost` 以外的任何地址上使用普通 `http://` 时，Open WebUI 会显示 `Failed to read clipboard contents` 或 `Location access not allowed`。此时，`{{CLIPBOARD}}` 会按原样保留在提示词中，而 `{{USER_LOCATION}}` 会变为 `LOCATION_UNKNOWN`。当浏览器的剪贴板 API 不可用时，复制按钮会切换到回退方案，因此没有 HTTPS 也能复制。

---

## 选择你的方案 {#choose-your-approach}

| 方法 | 最适用的场景 | TLS 管理 |
| :--- | :--- | :--- |
| [**Cloudflare Tunnel**](/reference/https/cloudflare-tunnel) | 不开放端口的生产环境 | 自动（Cloudflare 边缘网络） |
| [**ngrok**](/reference/https/ngrok) | 开发与测试 | 自动（ngrok 边缘网络） |
| [**Tailscale**](/reference/https/tailscale) | 跨设备私有访问 | 自动（tailscale serve） |
| [**Nginx**](/reference/https/nginx) | 需要完全控制的自托管生产环境 | 手动或 Let's Encrypt |
| [**Caddy**](/reference/https/caddy) | 自托管生产环境，极简配置 | 自动（Let's Encrypt） |
| [**HAProxy**](/reference/https/haproxy) | 高可用性 / 负载均衡 | 手动或 Let's Encrypt |
| [**Apache、Synology DSM、IIS**](/reference/https/apache) | 你已在运行的 Web 服务器或 NAS | 手动 |
| **云负载均衡器** | AWS ALB、GCP LB、Azure App Gateway | 由云服务提供方管理 |

---

## 快速建议 {#quick-recommendations}

- **只想快速启用 HTTPS？** 使用 [Cloudflare Tunnel](/reference/https/cloudflare-tunnel)（生产环境）或 [ngrok](/reference/https/ngrok)（开发环境）。无需管理证书，也无需开放端口。
- **已经在运行反向代理？** 添加 [Caddy](/reference/https/caddy) 以自动管理证书，或使用 [Nginx](/reference/https/nginx) 获得最大程度的控制。
- **需要负载均衡？** 使用 [HAProxy](/reference/https/haproxy) 或云服务提供方的负载均衡器。

---

## 关键配置说明 {#key-configuration-notes}

无论选择哪种方案，都请记住以下几点：

| 设置 | 重要性 |
| :--- | :--- |
| `WEBUI_URL` | 将其设置为你的公共 HTTPS URL。该值为空时，SSO 登录后重定向回 Open WebUI 的地址会回退到请求自身的 URL，但通知和 Webhook 事件中的链接会丢失主机部分。它不会设置发送给身份提供方的 SSO 回调 URL；除非设置了 `OPENID_REDIRECT_URI` 或提供方自己的重定向 URI 变量，否则该回调 URL 根据请求构建。它属于[持久化配置](/reference/env-configuration#important-note-on-configvar-environment-variables)：首次启动后，请在“管理员设置 > 通用”中更改 |
| `CORS_ALLOW_ORIGIN` | 默认为 `*`，因此不设置它绝不会导致 WebSocket 失效。如果设置，则必须包含你的确切公共来源（协议、主机、端口），否则 Socket.IO 连接（以及任何跨源浏览器请求）都会失败 |
| 代理缓冲**关闭** | 让 API 客户端持续接收流式响应。Web 界面通过 `/ws/socket.io` 流式传输聊天令牌，因此 WebSocket 正常工作时，缓冲不会影响它 |
| WebSocket 支持 | 使用 `Upgrade` 和 `Connection` 标头代理 `/ws/socket.io`。默认情况下，浏览器仅使用 WebSocket 传输，不回退到轮询；如果代理不支持升级，请设置 `ENABLE_WEBSOCKET_SUPPORT=false`，将服务器和客户端切换为长轮询 |
| 转发标头 | 传递原始 `Host` 标头，并转发 `X-Forwarded-For` 和 `X-Forwarded-Proto`。审计日志中的客户端 IP 来自 `X-Forwarded-For`；发送给身份提供方的 SSO 回调 URL（除非设置了重定向 URI）根据 `Host` 和 `X-Forwarded-Proto` 构建。除非 `FORWARDED_ALLOW_IPS` 指定了代理地址，否则 Open WebUI 会信任来自任何对端的 `X-Forwarded-*` 标头。系统不会读取 `X-Real-IP` |
| 安全 Cookie | 默认情况下，`token` 和 `owui-session` Cookie 以及 OAuth 会话 Cookie 在发送时不带 `Secure`。在前面启用 TLS 后，请设置 `WEBUI_AUTH_COOKIE_SECURE=true` 和 `WEBUI_SESSION_COOKIE_SECURE=true` |
| 延长超时时间 | 从 `/api/chat/completions` 流式接收的 API 客户端以及耗时较长的非流式请求（需要处理的上传、网页抓取、转录）可能持续数分钟；请将代理读取超时时间设置为至少 300 秒。Socket.IO 连接每 25 秒发送一次 ping，因此只要空闲超时时间高于约 45 秒，连接就能保持 |
| 上传大小 | 在设置“最大上传大小”（“管理员设置 > 文档”，或 `RAG_FILE_MAX_SIZE`）之前，应用没有上传上限，因此返回 413 的是代理的请求正文大小限制；请将其设置为不低于你在该处配置的值。同一限制也适用于聊天保存：保存编辑后的消息或评分会在一个请求中发送整个聊天，因此在长聊天中，过低的限制会导致这些更改丢失（[详情](/troubleshooting/connection-error#edits-and-ratings-lost-after-reload-in-long-chats)） |
| 健康检查 | 将负载均衡器指向 `/health`（存活检查）或 `/ready`（就绪检查：启动已完成，数据库和 Redis 可访问） |
| 多个实例 | Socket.IO 状态保存在进程内。跨实例进行负载均衡，或将 `UVICORN_WORKERS` 设置为大于 1，都需要设置 `WEBSOCKET_MANAGER=redis` 和 `REDIS_URL`、使用共享数据库，并在每个实例上设置相同的 `WEBUI_SECRET_KEY` |
