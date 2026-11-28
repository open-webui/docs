---
sidebar_position: 3
title: "使用 Tailscale 配置 HTTPS"
---

# 使用 Tailscale 配置 HTTPS

**从私有网络中的任何位置安全访问 Open WebUI。无需开放端口、管理证书或公开暴露服务。**

Tailscale 会在你的设备之间创建加密的网状 VPN（称为“tailnet”）。每台设备都会获得一个稳定的主机名，例如 `my-server.tail1234.ts.net`，并且 Tailscale 可以自动为其配置受信任的 HTTPS 证书。你的 Open WebUI 实例保持完全私有，只有 tailnet 中的设备才能访问。

:::tip 何时使用 Tailscale
当你希望跨设备获得**经过身份验证的私有访问**，又不想将 Open WebUI 暴露到公共互联网时，Tailscale 是理想选择。它非常适合个人部署、小型团队，或在外出时通过手机或笔记本电脑访问家庭服务器。
:::

:::info 查找完整指南？
本页专门介绍 **HTTPS 设置**。有关完整的 Tailscale 集成方案，包括 SSO 身份验证、Docker Compose sidecar 设置等内容，请参阅 [**Tailscale 集成教程**](/tutorials/auth-sso/tailscale)。
:::

---

## 前提条件 {#prerequisites}

| 要求 | 说明 |
| :--- | :--- |
| **Open WebUI** | 在本地端口 `8080` 上运行（默认） |
| **Tailscale 账户** | 个人用户可在 [tailscale.com](https://tailscale.com) 免费使用 |
| **已安装 Tailscale** | 运行 Open WebUI 的服务器和所有客户端设备均需安装 |

---

## 1. 安装 Tailscale {#1-install-tailscale}

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="mac" label="macOS" default>

从 [Mac App Store](https://apps.apple.com/app/tailscale/id1475387142) 下载，或运行：

```bash
brew install tailscale
```

  </TabItem>
  <TabItem value="linux" label="Linux">

```bash
curl -fsSL https://tailscale.com/install.sh | sh
```

  </TabItem>
  <TabItem value="windows" label="Windows">

从 [tailscale.com/download](https://tailscale.com/download/windows) 下载。

  </TabItem>
</Tabs>

## 2. 连接服务器 {#2-connect-the-server}

在运行 Open WebUI 的机器上：

```bash
sudo tailscale up
```

你的机器会获得一个类似 `my-server.tail1234.ts.net` 的 tailnet 主机名。使用以下命令查找：

```bash
tailscale status
```

## 3. 访问 Open WebUI {#3-access-open-webui}

在同一 tailnet 中的任何设备上打开：

```
http://my-server.tail1234.ts.net:8080
```

此连接已经由 WireGuard 进行端到端加密。对于需要 HTTPS 的浏览器功能（例如语音通话），请继续下一步。

---

## 使用 Tailscale 证书启用 HTTPS {#enable-https-with-tailscale-certificates}

Tailscale 可以为你的 tailnet 主机名配置受信任的 Let's Encrypt 证书。

### 1. 在管理控制台中启用 HTTPS {#1-enable-https-in-the-admin-console}

前往 [**Tailscale Admin → DNS**](https://login.tailscale.com/admin/dns)，启用 **HTTPS Certificates（HTTPS 证书）**。

### 2. 生成证书 {#2-generate-a-certificate}

```bash
sudo tailscale cert my-server.tail1234.ts.net
```

这会在当前目录中创建两个文件：
- `my-server.tail1234.ts.net.crt`（证书）
- `my-server.tail1234.ts.net.key`（私钥）

### 3. 通过 HTTPS 提供 Open WebUI {#3-serve-open-webui-over-https}

使用 `tailscale serve` 将 HTTPS 流量直接代理到 Open WebUI，无需任何反向代理：

```bash
sudo tailscale serve https / http://localhost:8080
```

现在通过以下地址访问 Open WebUI：

```
https://my-server.tail1234.ts.net
```

无需端口号。Tailscale 会处理 TLS 终止，并代理到本地 Open WebUI。

---

## 配置 Open WebUI {#configure-open-webui}

设置 `WEBUI_URL`，确保 OAuth 回调和内部链接能够正确解析：

```bash
docker run -d \
  -p 8080:8080 \
  -e WEBUI_URL=https://my-server.tail1234.ts.net \
  -v open-webui:/app/backend/data \
  --name open-webui \
  ghcr.io/open-webui/open-webui:main
```

---

## Tailscale Funnel（可选公共访问） {#tailscale-funnel-optional-public-access}

如果你希望公开分享 Open WebUI（不要求客户端安装 Tailscale），Tailscale Funnel 可以将你的 `tailscale serve` 端点暴露到互联网：

```bash
sudo tailscale funnel https / http://localhost:8080
```

现在，任何人都可以通过 `https://my-server.tail1234.ts.net` 和有效的 TLS 证书公开访问你的 Open WebUI。与 Cloudflare Tunnel 类似，Funnel 会通过 Tailscale 的基础设施路由流量。

:::warning
Funnel 会让互联网上的任何人都能访问你的 Open WebUI。启用之前，请确保已在 Open WebUI 中配置身份验证。
:::

---

## 快速参考 {#quick-reference}

| 操作 | 命令 / 值 |
| :--- | :--- |
| 连接到 tailnet | `sudo tailscale up` |
| 检查主机名 | `tailscale status` |
| 通过 HTTPS 提供服务 | `sudo tailscale serve https / http://localhost:8080` |
| 公共访问（Funnel） | `sudo tailscale funnel https / http://localhost:8080` |
| 手动生成证书 | `sudo tailscale cert my-server.tail1234.ts.net` |
| 管理控制台 | [login.tailscale.com/admin](https://login.tailscale.com/admin) |
| 设置 CORS 来源 | `CORS_ALLOW_ORIGIN=https://my-server.tail1234.ts.net` |
