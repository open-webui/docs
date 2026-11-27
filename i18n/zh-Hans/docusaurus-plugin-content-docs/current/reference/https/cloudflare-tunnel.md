---
sidebar_position: 1
title: "使用 Cloudflare Tunnel 配置 HTTPS"
---

# 使用 Cloudflare Tunnel 配置 HTTPS

**将 Open WebUI 安全地公开到互联网。无需开放端口、管理证书或配置反向代理。**

Cloudflare Tunnel（`cloudflared`）会从你的机器到 Cloudflare 边缘网络建立一条仅出站的连接。流量通过 Cloudflare 的基础设施传输，自动获得 TLS、DDoS 防护和访问控制，而服务器无需暴露任何端口。

:::tip 何时使用 Cloudflare Tunnel
当你希望获得**生产级公共访问能力**，又不想管理 TLS 证书或防火墙规则时，这是推荐方案。它适用于任何网络，包括位于 NAT 或限制性防火墙之后的网络。
:::

---

## 前提条件 {#prerequisites}

| 要求 | 说明 |
| :--- | :--- |
| **Open WebUI** | 在本地端口 `8080` 上运行（默认） |
| **Cloudflare 账户** | 可在 [cloudflare.com](https://dash.cloudflare.com/sign-up) 免费注册 |
| **托管在 Cloudflare 上的域名** | 你的域名 DNS 必须由 Cloudflare 管理 |

---

## 方案 A：通过控制面板设置（无需 CLI） {#option-a-dashboard-setup-no-cli}

最简单的路径，所有配置均通过 Cloudflare 控制面板完成。

### 1. 创建隧道 {#1-create-the-tunnel}

1. 前往 [**Zero Trust → Networks → Connectors（零信任 → 网络 → 连接器）**](https://dash.cloudflare.com/?to=/:account/one/networks/connectors)
2. 点击 **Create a tunnel（创建隧道）** → 选择 **Cloudflared**
3. 为其命名（例如 `open-webui`）
4. 按照安装说明在你的机器上运行连接器

### 2. 添加公共主机名 {#2-add-a-public-hostname}

在隧道配置中添加一个 **Public Hostname（公共主机名）**：

| 字段 | 值 |
| :--- | :--- |
| **Subdomain（子域名）** | `chat`（或你喜欢的任何名称） |
| **Domain（域名）** | 选择你的 Cloudflare 域名 |
| **Service type（服务类型）** | `HTTP` |
| **URL** | `localhost:8080` |

保存后，Cloudflare 会自动创建 DNS 记录。

### 3. 访问 Open WebUI {#3-access-open-webui}

打开 `https://chat.your-domain.com`。HTTPS 完全由 Cloudflare 处理。

---

## 方案 B：通过 CLI 设置 {#option-b-cli-setup}

适用于自动化、基础设施即代码或无头服务器。

### 1. 安装 cloudflared {#1-install-cloudflared}

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="mac" label="macOS" default>

```bash
brew install cloudflared
```

  </TabItem>
  <TabItem value="linux" label="Linux">

```bash
curl -sSL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 \
  -o /usr/local/bin/cloudflared && chmod +x /usr/local/bin/cloudflared
```

  </TabItem>
  <TabItem value="windows" label="Windows">

```powershell
winget install Cloudflare.cloudflared
```

  </TabItem>
</Tabs>

### 2. 身份验证 {#2-authenticate}

```bash
cloudflared tunnel login
```

这会打开浏览器，授权 `cloudflared` 使用你的 Cloudflare 账户。

### 3. 创建隧道 {#3-create-the-tunnel}

```bash
cloudflared tunnel create open-webui
```

记下输出中的 **Tunnel ID（隧道 ID）**，配置时需要用到它。

### 4. 配置 {#4-configure}

创建 `~/.cloudflared/config.yml`：

```yaml
tunnel: YOUR_TUNNEL_ID
credentials-file: /home/YOUR_USER/.cloudflared/YOUR_TUNNEL_ID.json

ingress:
  - hostname: chat.your-domain.com
    service: http://localhost:8080
  - service: http_status:404
```

### 5. 创建 DNS 记录 {#5-create-dns-record}

```bash
cloudflared tunnel route dns open-webui chat.your-domain.com
```

### 6. 启动隧道 {#6-start-the-tunnel}

```bash
cloudflared tunnel run open-webui
```

打开 `https://chat.your-domain.com`。

---

## 作为系统服务运行 {#run-as-a-system-service}

若要在重启后保持隧道运行：

```bash
sudo cloudflared service install
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
```

这会自动使用 `~/.cloudflared/config.yml` 中的配置。

---

## 配置 Open WebUI {#configure-open-webui}

设置 `WEBUI_URL`，确保 OAuth 回调和内部链接能够正确解析：

```bash
docker run -d \
  -p 8080:8080 \
  -e WEBUI_URL=https://chat.your-domain.com \
  -v open-webui:/app/backend/data \
  --name open-webui \
  ghcr.io/open-webui/open-webui:main
```

---

## 将 Docker Compose 与 cloudflared 结合使用 {#docker-compose-with-cloudflared}

在同一个堆栈中运行 Open WebUI 和隧道连接器：

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    container_name: open-webui
    volumes:
      - open-webui:/app/backend/data
    environment:
      - WEBUI_URL=https://chat.your-domain.com
    restart: unless-stopped

  cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: cloudflared
    command: tunnel --no-autoupdate run --token YOUR_TUNNEL_TOKEN
    restart: unless-stopped

volumes:
  open-webui:
```

从 [Cloudflare 控制面板](https://dash.cloudflare.com/)获取隧道令牌 → 前往 [**Networking → Tunnels（网络 → 隧道）**] → 选择你的隧道 → 选择 **Add a replica（添加副本）** → 复制安装命令。令牌以 `eyJ...` 开头。

:::tip
`open-webui` 服务无需配置 `ports`。`cloudflared` 会通过 Docker 内部网络连接它。要使用此方式，请将隧道配置中的服务 URL 改为 `http://open-webui:8080`。
:::

---

## 添加访问控制（可选） {#add-access-controls-optional}

Cloudflare Zero Trust 允许你通过身份验证限制访问，而无需改动 Open WebUI：

1. 前往 [**Zero Trust → Access controls → Applications（零信任 → 访问控制 → 应用程序）**](https://dash.cloudflare.com/?to=/:account/one/access-controls/apps)
2. **Create new application（创建新应用程序）** → Self-hosted and private（自托管和私有）
3. 将公共主机名设置为 `chat.your-domain.com`
4. 创建一个 **Access Policy（访问策略）**（例如，仅允许 `@your-company.com` 邮箱）

用户在到达 Open WebUI 之前会先看到 Cloudflare 登录页面。

---

## 快速参考 {#quick-reference}

| 操作 | 命令 / 值 |
| :--- | :--- |
| 创建隧道 | `cloudflared tunnel create open-webui` |
| 启动隧道 | `cloudflared tunnel run open-webui` |
| 添加 DNS | `cloudflared tunnel route dns open-webui chat.your-domain.com` |
| 安装为服务 | `sudo cloudflared service install` |
| 控制面板 | [https://dash.cloudflare.com/?to=/:account/one/networks/connectors](https://dash.cloudflare.com/?to=/:account/one/networks/connectors) |
| 设置 CORS 来源 | `CORS_ALLOW_ORIGIN=https://chat.your-domain.com` |
