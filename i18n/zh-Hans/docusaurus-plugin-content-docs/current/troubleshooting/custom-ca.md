---
sidebar_position: 90
title: "自定义 CA 信任库"
---

:::warning

本教程由社区贡献，不受 Open WebUI 团队支持。它仅演示如何针对你的具体使用场景自定义 Open WebUI。想要贡献内容？请查看贡献教程。

:::

如果运行 Open WebUI 时遇到 `[SSL: CERTIFICATE_VERIFY_FAILED]` 错误，最可能的原因是你所在的网络会拦截 HTTPS 流量（例如企业网络）。

要解决此问题，需要将新证书添加到 Open WebUI 的信任库中。

**对于预构建的 Docker 镜像**：

1. 通过向 `docker run` 传递命令行选项 `--volume=/etc/ssl/certs/ca-certificates.crt:/etc/ssl/certs/ca-certificates.crt:ro`，将证书库从宿主机挂载到容器中
2. 设置 `SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt`，强制 Python 使用系统信任库（请参阅 https://docs.docker.com/reference/cli/docker/container/run/#env）

以下来自 [@KizzyCode](https://github.com/open-webui/open-webui/issues/1398#issuecomment-2258463210) 的 `compose.yaml` 示例：

```yaml
services:
  openwebui:
    image: ghcr.io/open-webui/open-webui:main
    volumes:
      - /var/containers/openwebui:/app/backend/data:rw
      - /etc/ssl/certs/ca-certificates.crt:/etc/ssl/certs/ca-certificates.crt:ro # 挂载宿主机的完整证书包，而不是单个证书，否则容器中将失去所有公共根证书
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    environment:
      - WEBUI_NAME=compusrv
      - ENABLE_SIGNUP=False
      - ENABLE_COMMUNITY_SHARING=False
      - WEBUI_SESSION_COOKIE_SAME_SITE=strict
      - WEBUI_SESSION_COOKIE_SECURE=True
      - ENABLE_OLLAMA_API=False
      - SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt
```

`ro` 标志以只读方式挂载 CA 信任库，防止意外更改宿主机的 CA 信任库。
**对于本地开发**：

也可以通过修改 `Dockerfile`，在构建过程中添加证书。例如，当你想更改 UI 时，这会很有用。
由于构建分为[多个阶段](https://docs.docker.com/build/building/multi-stage/)，必须将证书同时添加到以下两个阶段：

1. 前端（`build` 阶段）：

```dockerfile
COPY package.json package-lock.json <YourRootCert>.crt ./
ENV NODE_EXTRA_CA_CERTS=/app/<YourRootCert>.crt
RUN npm ci --force
```

2. 后端（`base` 阶段）：

```dockerfile
COPY <CorporateSSL.crt> /usr/local/share/ca-certificates/
RUN update-ca-certificates
ENV PIP_CERT=/etc/ssl/certs/ca-certificates.crt
ENV SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt \
    REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt
```
