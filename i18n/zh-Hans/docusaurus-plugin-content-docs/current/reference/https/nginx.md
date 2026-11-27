---
sidebar_position: 200
title: "使用 Nginx 配置 HTTPS"
---


# 使用 Nginx 配置 HTTPS

确保用户与 Open WebUI 之间的通信安全至关重要。HTTPS（超文本传输安全协议）会加密传输的数据，防止窃听和篡改。通过将 Nginx 配置为反向代理，你可以无缝地为 Open WebUI 部署添加 HTTPS，增强安全性与可信度。

本指南提供三种设置 HTTPS 的方法：

- **自签名证书**：非常适合开发和内部使用，使用 Docker。
- **Let's Encrypt**：非常适合需要受信任 SSL 证书的生产环境，使用 Docker。
- **Windows + 自签名**：适用于 Windows 上开发和内部使用的简化说明，无需 Docker。

:::tip 将 CORS_ALLOW_ORIGIN 设置为你的公共来源

`CORS_ALLOW_ORIGIN` 默认为 `*`，因此不设置它绝不会导致 WebSocket 连接失效。作为安全加固，请将其设置为你的确切公共来源（例如 `https://chat.example.com`）。会导致 Socket.IO 连接（以及任何跨源浏览器请求）失败的，是遗漏该来源的值，例如在你通过 `https://` 提供服务时仅包含 `http://` 条目。

### HTTP/2 和 WebSocket {#http2-and-websockets}

如果你在 Nginx 服务器上启用 **HTTP/2**，请确保代理配置在连接 Open WebUI 后端时仍使用 **HTTP/1.1**。这一点至关重要，因为大多数 WebUI 功能（例如流式传输和实时更新）都依赖 WebSocket；在许多代理环境中，通过 HTTP/1.1 `Upgrade` 处理 WebSocket，比通过较新的 RFC 8441（H2 上的 WebSocket）更稳定。

在你的 Nginx location 块中，始终包含：
```nginx
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
```

:::

:::warning 为 SSE 流式传输禁用代理缓冲

Web 界面通过 `/ws/socket.io` 上的 Socket.IO 连接流式传输聊天令牌，而不是通过 HTTP 响应，因此 WebSocket 正常工作时，缓冲不会导致浏览器中的聊天内容错乱。但它确实会阻碍 API 客户端从 `/api/chat/completions`、`/openai/*` 和 `/ollama/v1/*`（SSE）以及 `/ollama/api/*`（NDJSON）读取流式响应，因此请保持缓冲关闭。

**你必须在 Nginx location 块中包含以下指令：**

```nginx
# 关键：为 SSE 流式传输禁用缓冲
proxy_buffering off;
proxy_cache off;
```

**如果忘记此设置，会出现以下症状：** API 客户端会成批收到流式响应，或者仅在最后收到。

**额外好处：** 禁用缓冲还会使流式响应**显著加快**，因为内容会直接流向客户端，而不会出现 Nginx 的缓冲延迟。

:::

选择最适合你部署需求的方法。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import NginxProxyManager from '../tab-nginx/NginxProxyManager.md';
import SelfSigned from '../tab-nginx/SelfSigned.md';
import LetsEncrypt from '../tab-nginx/LetsEncrypt.md';
import Windows from '../tab-nginx/Windows.md';

<!-- markdownlint-disable-next-line MD033 -->
<Tabs>
  <TabItem value="NginxProxyManager" label="Nginx Proxy Manager">
    <NginxProxyManager />
  </TabItem>
  <TabItem value="letsencrypt" label="Let's Encrypt">
    <LetsEncrypt />
  </TabItem>
  <TabItem value="selfsigned" label="Self-Signed">
    <SelfSigned />
  </TabItem>
  <TabItem value="windows" label="Windows">
    <Windows />
  </TabItem>
</Tabs>


## 完整且经过优化的 NGINX 配置 {#complete-optimized-nginx-configuration}

本节提供一套可用于生产环境的 NGINX 配置，针对 Open WebUI 流式传输、WebSocket 连接和高并发部署进行了优化。

### Upstream 配置 {#upstream-configuration}

定义一个带 keepalive 连接的 upstream，以减少建立连接的开销：

```nginx
upstream openwebui {
    server 127.0.0.1:3000;
    keepalive 128;              # 持久连接
    keepalive_timeout 1800s;    # 30 分钟
    keepalive_requests 10000;
}
```

### 超时配置 {#timeout-configuration}

长时间运行的 LLM 补全需要延长超时时间：

```nginx
location /api/ {
    proxy_connect_timeout 1800;   # 30 分钟
    proxy_send_timeout 1800;
    proxy_read_timeout 1800;
}

# 服务器每 25 秒发送一次 ping，因此任何高于 45 秒的空闲超时都能保持套接字存活
location ~ ^/(ws/|socket\.io/) {
    proxy_connect_timeout 86400;  # 24 小时
    proxy_send_timeout 86400;
    proxy_read_timeout 86400;
}
```

### 标头和正文大小限制 {#header-and-body-size-limits}

防止大型请求或 OAuth 令牌导致错误：

```nginx
# 在 http {} 或 server {} 块中
client_max_body_size 100M;           # 文件上传和长聊天保存
proxy_buffer_size 128k;              # 大型标头（OAuth 令牌）
proxy_buffers 4 256k;
proxy_busy_buffers_size 256k;
large_client_header_buffers 4 32k;
```

`client_max_body_size` 限制每个请求，而不仅仅是上传。保存编辑后的消息、评分或**另存为副本**，都会通过一个 `POST` 将整个聊天发送到 `/api/v1/chats/{id}`，因此该请求会随聊天内容增长。nginx 的默认值为 `1m`，对于更大的请求会返回 `413 (Request Entity Too Large)`（[`client_max_body_size`](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)）。请将其设置得足够高，既能容纳最长的聊天，也能容纳最大的上传。请参阅[长聊天在重新加载后丢失编辑和评分](/troubleshooting/connection-error#edits-and-ratings-lost-after-reload-in-long-chats)。

### 常见流式传输错误 {#common-streaming-mistakes}

| 设置 | 对流式传输的影响 |
|---------|---------------------|
| `gzip on` 与 `application/json` 一起使用 | 为压缩进行缓冲 |
| `proxy_buffering on` | 缓冲整个响应 |
| `proxy_request_buffering on` | 应将其关闭 |
| `tcp_nodelay on` | **最关键：** 禁用 Nagle 算法以立即发送数据包（防止 200 毫秒延迟） |
| `chunked_transfer_encoding on` | 可能破坏 SSE |
| 在 `/api/` 上启用 `proxy_cache` | 增加开销 |
| `X-Accel-Buffering "yes"` | 为增加安全性，此标头应设置为 "no" |
| `HTTP/2` | 如果遇到流式传输问题、延迟，或前端在最后一个数据块到达之前就结束流式传输，改用 HTTP 1.1 而不是 HTTP/2 也可能有帮助 |

### 完整示例配置 {#full-example-configuration}

```nginx
upstream openwebui {
    server 127.0.0.1:3000;
    keepalive 128;
    keepalive_timeout 1800s;
    keepalive_requests 10000;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL 配置...

    # 压缩 - 排除流式内容类型
    gzip on;
    gzip_types text/plain text/css application/javascript image/svg+xml;
    # 不要包含：application/json、text/event-stream

    # API 端点以及 /openai 和 /ollama 代理 - 针对流式传输优化
    location ~ ^/(api|openai|ollama)/ {
        proxy_pass http://openwebui;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 关键：为流式传输禁用所有缓冲
        gzip off;
        proxy_buffering off;
        proxy_request_buffering off;
        proxy_cache off;
        tcp_nodelay on;
        add_header X-Accel-Buffering "no" always;
        add_header Cache-Control "no-store" always;

        # 为 LLM 补全延长超时时间
        proxy_connect_timeout 1800;
        proxy_send_timeout 1800;
        proxy_read_timeout 1800;
    }

    # WebSocket 端点
    location ~ ^/(ws/|socket\.io/) {
        proxy_pass http://openwebui;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        gzip off;
        proxy_buffering off;
        proxy_cache off;

        # 服务器每 25 秒发送一次 ping，因此任何高于 45 秒的空闲超时都能保持套接字存活
        proxy_connect_timeout 86400;
        proxy_send_timeout 86400;
        proxy_read_timeout 86400;
    }

    # 静态资产 - 可以缓冲和缓存
    location /static/ {
        proxy_pass http://openwebui;
        proxy_buffering on;
        proxy_cache_valid 200 7d;
        add_header Cache-Control "public, max-age=604800, immutable";
    }

    # 默认 location
    location / {
        proxy_pass http://openwebui;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 缓存配置 {#caching-configuration}

适当的缓存可以降低后端负载并加快页面加载速度，从而显著提高 Open WebUI 的性能。本节为希望实现服务器端和客户端缓存的高级用户提供指导。

### 缓存区 {#cache-zones}

在 nginx 的 `http` 块中定义缓存区，以存储缓存的响应：

```nginx
# 页面和资产的通用缓存
proxy_cache_path /var/cache/nginx/openwebui levels=1:2
    keys_zone=OPENWEBUI_CACHE:10m max_size=1g inactive=60m use_temp_path=off;

# 图片专用缓存（个人资料图片、模型头像）
proxy_cache_path /var/cache/nginx/openwebui_images levels=1:2
    keys_zone=OPENWEBUI_IMAGES:10m max_size=2g inactive=7d use_temp_path=off;
```

:::note 创建缓存目录

你必须先创建这些目录并设置正确的所有权，nginx 才能使用它们：

```bash
sudo mkdir -p /var/cache/nginx/openwebui /var/cache/nginx/openwebui_images
sudo chown -R www-data:www-data /var/cache/nginx
```

将 `www-data` 替换为你的 nginx 用户（使用 `ps aux | grep nginx` 检查）。常见的其他用户：`nginx`、`nobody`。

:::

### 应缓存的内容 {#what-to-cache}

| 内容类型 | 缓存时长 | 说明 |
|--------------|----------------|-------|
| 静态资产（CSS、JS、字体） | 7-30 天 | 对带版本的资产使用 `immutable` |
| 个人资料/模型图片 | 1 天 | 平衡新鲜度与性能 |
| 静态文件（/static/） | 7 天 | 网站图标、默认头像 |
| HTML 页面 | 5 分钟 | 短时缓存并重新验证 |
| 上传的文件内容 | 1 天 | 用户上传、生成的图片 |

### 绝不应缓存的内容 {#what-to-never-cache}

:::danger 关键：绝不缓存身份验证

为防止安全问题和登录失效，以下路径**绝不能**缓存：

- `/api/v1/auths/`：身份验证端点
- `/oauth/`：OAuth/SSO 回调
- `/api/`（一般）：动态 API 响应
- `/ws/`：WebSocket 连接

对于身份验证端点，始终包含以下指令：

```nginx
proxy_no_cache 1;
proxy_cache_bypass 1;
add_header Cache-Control "no-store, no-cache, must-revalidate";
```

:::

### 示例：图片缓存 {#example-image-caching}

个人资料图片和模型头像能从缓存中显著受益：

```nginx
# 用户和模型个人资料图片
location ~ ^/api/v1/(users/[^/]+/profile/image|models/model/profile/image)$ {
    proxy_pass http://your_backend;

    proxy_cache OPENWEBUI_IMAGES;
    proxy_cache_valid 200 302 1d;
    proxy_cache_valid 404 1m;
    proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
    proxy_cache_lock on;
    proxy_cache_key "$request_uri$is_args$args";

    # 即使没有后端缓存标头，也强制缓存
    proxy_ignore_headers Cache-Control Expires Set-Cookie;
    proxy_hide_header Set-Cookie;

    # 客户端缓存
    add_header Cache-Control "public, max-age=86400, stale-while-revalidate=604800" always;
    add_header X-Cache-Status $upstream_cache_status always;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### 示例：静态资产缓存 {#example-static-asset-caching}

```nginx
location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|otf|eot)$ {
    proxy_pass http://your_backend;

    proxy_cache OPENWEBUI_CACHE;
    proxy_cache_valid 200 302 60m;
    proxy_cache_valid 404 1m;
    proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
    proxy_cache_lock on;

    add_header Cache-Control "public, max-age=2592000";  # 30 天
    add_header X-Cache-Status $upstream_cache_status;

    etag on;
    if_modified_since exact;
}
```

### 缓存调试 {#cache-debugging}

添加 `X-Cache-Status` 标头以验证缓存是否正常工作：

```nginx
add_header X-Cache-Status $upstream_cache_status always;
```

在浏览器开发者工具中检查该标头：
- `HIT`：由缓存提供
- `MISS`：从后端获取，现已缓存
- `EXPIRED`：缓存已过期，已刷新
- `BYPASS`：有意跳过缓存

### 权衡 {#trade-offs}

:::warning 缓存失效

当图片被积极缓存时，用户更改个人资料图片后可能无法立即看到更新。请考虑：

- 如果用户经常更新图片，使用**较短的缓存时间**（例如 1 小时）
- 在稳定的部署中，使用**较长的缓存时间**（例如 1 天）以获得更好的性能
- 可以使用以下命令手动清除缓存：`rm -rf /var/cache/nginx/openwebui_images/*`

:::

---

## 后续步骤 {#next-steps}


设置 HTTPS 后，通过以下地址安全访问 Open WebUI：

- [https://localhost](https://localhost)

如果你使用域名，请确保 DNS 记录配置正确。对于生产环境，建议使用 Let's Encrypt 获取受信任的 SSL 证书。

---
