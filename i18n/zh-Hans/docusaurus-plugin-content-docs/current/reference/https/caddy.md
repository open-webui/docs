---
sidebar_position: 202
title: "使用 Caddy 配置 HTTPS"
---


## 使用 Caddy 配置 HTTPS {#https-using-caddy}

确保用户与 Open WebUI 之间的通信安全至关重要。HTTPS（超文本传输安全协议）会加密传输的数据，防止窃听和篡改。通过将 Caddy 配置为反向代理，你可以无缝地为 Open WebUI 部署添加 HTTPS，增强安全性与可信度。

本指南简要介绍如何设置一台 Ubuntu 服务器，使用 Caddy 作为 Open WebUI 的反向代理，并通过自动证书管理启用 HTTPS。

我们将按照以下几个步骤完成全部设置：

- [使用 Caddy 配置 HTTPS](#https-using-caddy)
- [Docker](#docker)
  - [安装 Docker](#installing-docker)
- [OpenWebUI](#openwebui)
  - [安装 OpenWebUI](#installing-openwebui)
- [Caddy](#caddy)
  - [安装 Caddy](#installing-caddy)
  - [配置 Caddy](#configure-caddy)
- [测试 HTTPS](#testing-https)
- [更新 Open WebUI](#updating-open-webui)
  - [停止 Open WebUI](#stopping-open-webui)
  - [拉取最新镜像](#pulling-the-latest-image)
  - [启动 Open WebUI](#starting-open-webui)

## Docker {#docker}

按照指南设置 Docker 的 apt 仓库：[Docker](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository)

`docker-compose-plugin` 是提供 `docker compose` 命令的软件包。

### 安装 Docker {#installing-docker}

以下是我在 Ubuntu 上安装 Docker 所使用的命令：

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

## OpenWebUI {#openwebui}

接下来，为 Open WebUI 项目创建一个目录：

```bash
mkdir -p ~/open-webui
cd ~/open-webui
```

### 安装 OpenWebUI {#installing-openwebui}

在 `~/open-webui` 目录中创建一个 `docker-compose.yml` 文件。我保留了一段注释掉的配置，用于设置 Qdrant 的一些环境变量；对于其他可能需要设置的[环境变量](/reference/env-configuration)，你也可以参照这段配置。

```yaml
services:
    open-webui:
        image: ghcr.io/open-webui/open-webui:main
        container_name: open-webui
        ports:
            - "8080:8080"
        volumes:
            - ./data:/app/backend/data
        # environment:
        #     - "QDRANT_API_KEY=API_KEY_HERE"
        #     - "QDRANT_URI=https://example.com"
        restart: unless-stopped
```

## Caddy {#caddy}

Caddy 是一个功能强大的 Web 服务器，可以自动为你管理 TLS 证书，因此非常适合用于通过 HTTPS 提供 Open WebUI。

### 安装 Caddy {#installing-caddy}

按照[在 Ubuntu 上设置 Caddy 的指南](https://caddyserver.com/docs/install#debian-ubuntu-raspbian)操作。

### 配置 Caddy {#configure-caddy}

你需要修改 `CaddyFile`，使其使用你的域名。

为此，请编辑文件 `/etc/caddy/Caddyfile`。

```bash
sudo nano /etc/caddy/Caddyfile
```

然后，配置应包含以下内容：

```caddyfile
your-domain.com {
  reverse_proxy localhost:8080
}
```

请务必将 `your-domain.com` 替换为你的实际域名。

## 测试 HTTPS {#testing-https}

假设你已经设置好 DNS 记录，使其指向服务器的 IP 地址，现在可以在 `~/open-webui` 目录中运行 `docker compose up`，测试是否能通过 HTTPS 访问 Open WebUI。

```bash
cd ~/open-webui
docker compose up -d
```

现在，你应该能够通过 `https://your-domain.com` 访问 Open WebUI。

## 可选：通过反向代理设置安全标头 {#optional-security-headers-via-reverse-proxy}

Open WebUI 支持通过环境变量直接在应用层设置安全标头
（推荐方式，请参阅[安全标头](/getting-started/advanced-topics/hardening#security-headers)）。
如果单个 Caddy 实例后面管理着多个应用，或者你的部署不允许
直接访问环境变量，则可以改为在代理层设置这些标头。

**只能选择一个层级。** 在两处设置同一标头会产生重复指令：
浏览器会合并重复的 `Content-Security-Policy` 标头（取交集），这可能会
意外收紧或破坏你的策略；而重复的 `Strict-Transport-Security` 或
`X-Frame-Options` 标头会导致不明确且因浏览器而异的行为。如果你已经通过环境变量设置了
`HSTS`、`XFRAME_OPTIONS`、`XCONTENT_TYPE`、`REFERRER_POLICY`、`PERMISSIONS_POLICY` 或
`CONTENT_SECURITY_POLICY` 中的任何一项，请跳过本节。

在现有站点块内添加以下 `header` 块：

```caddyfile
your.domain.example {
	header {
		Strict-Transport-Security "max-age=31536000; includeSubDomains"
		X-Frame-Options "DENY"
		X-Content-Type-Options "nosniff"
		Referrer-Policy "strict-origin-when-cross-origin"
		Permissions-Policy "camera=(), microphone=(), geolocation=()"
		-Server
	}

	reverse_proxy localhost:8080
}
```

**HSTS 具有粘性且难以撤销。** 带 `includeSubDomains` 的 `max-age=31536000`（1 年）会指示每个访问过此域名的浏览器，在整整一年内拒绝通过普通 HTTP 访问该域名**及其所有子域名**。服务器端无法快速撤销此设置（你必须提供 `max-age=0`，并等待每个客户端再次访问）。仅当所有现有及未来的子域名都提供有效的 HTTPS 时，才保留 `includeSubDomains`。如果不确定，请先使用较短的值，例如 `max-age=300`，确认 HTTPS 在所有位置均能正常工作后再增大。**不要**添加 `preload`，除非你了解它近乎永久有效，并且需要单独提交到浏览器预加载列表。

`-Server` 指令会移除 Caddy 默认添加的 `Server` 响应标头。
Caddy 会自动处理 WebSocket 升级和 SSE 连接。Open WebUI 的流式响应
无需任何额外配置。

上面的 `Permissions-Policy` 示例是常见敏感功能的拒绝列表，并非详尽
清单。如果你的部署使用语音输入或摄像头采集，请将相关指令设置为 `(self)`，
而不是将其移除。

**Content-Security-Policy。** CSP 与具体部署高度相关（自定义插件、嵌入式 iframe、
外部模型服务提供方、Artifacts/代码渲染、语音输入），因此本节有意
**不**提供现成的代理层 CSP。请通过 `CONTENT_SECURITY_POLICY` 环境
变量设置 CSP，并在强制执行之前，使用 `CONTENT_SECURITY_POLICY_REPORT_ONLY` 推导可用的策略。
请参阅[安全标头](/getting-started/advanced-topics/hardening#security-headers)。

重新加载 Caddy 后，验证标头是否已应用：

```bash
curl -sI https://your.domain.example | grep -E "Strict-Transport|X-Frame|X-Content|Referrer|Permissions"
```

## 更新 Open WebUI {#updating-open-webui}

这里简要说明如何在不丢失数据的情况下更新 Open WebUI。由于我们使用卷来存储数据，因此只需拉取最新镜像并重启容器即可。

### 停止 Open WebUI {#stopping-open-webui}

首先，我们需要停止并删除现有容器：

```bash
docker rm -f open-webui
```

### 拉取最新镜像 {#pulling-the-latest-image}

然后，你可以再次启动容器：

```bash
docker pull ghcr.io/open-webui/open-webui:main
```

### 启动 Open WebUI {#starting-open-webui}

现在，你可以再次启动 Open WebUI 容器：

```bash
docker compose up -d
```
