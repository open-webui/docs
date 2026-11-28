---
sidebar_position: 50
title: "Tailscale"
---

# Tailscale 集成

**从任何设备私密、加密地访问 Open WebUI。无需开放端口，无需管理证书。**

[Tailscale](https://tailscale.com) 在你的设备之间创建基于 WireGuard 的网状 VPN（即“tailnet”）。每台设备都会获得一个稳定的主机名，例如 `my-server.tail1234.ts.net`，并且 Tailscale 可以自动预置受信任的 HTTPS 证书。你的 Open WebUI 实例保持完全私密，只有 tailnet 中的设备可以访问。

:::tip 何时使用 Tailscale
当你希望跨设备获得**私密的、经过身份验证的访问**，又不想将 Open WebUI 暴露到公共互联网时，Tailscale 是理想选择。它非常适合个人部署、小型团队，或在外出时通过手机或笔记本电脑访问家庭服务器。
:::

---

## 前提条件 {#prerequisites}

| 要求 | 详情 |
| :--- | :--- |
| **Open WebUI** | 在本地端口 `8080`（默认）上运行 |
| **Tailscale 账户** | 个人使用可在 [tailscale.com](https://tailscale.com) 免费注册 |
| **已安装 Tailscale** | 在运行 Open WebUI 的服务器和所有客户端设备上安装 |

---

## 快速开始 {#quick-start}

### 1. 安装 Tailscale {#1-install-tailscale}

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

### 2. 连接服务器 {#2-connect-the-server}

在运行 Open WebUI 的机器上：

```bash
sudo tailscale up
```

你的机器会获得一个 tailnet 主机名，例如 `my-server.tail1234.ts.net`。使用以下命令查找：

```bash
tailscale status
```

### 3. 访问 Open WebUI {#3-access-open-webui}

在同一 tailnet 中的任何设备上，打开：

```
http://my-server.tail1234.ts.net:8080
```

此连接已由 WireGuard 进行端到端加密。对于需要 HTTPS 的浏览器功能（例如语音通话），请继续阅读下一节。

---

## 通过 Tailscale 使用 HTTPS {#https-with-tailscale}

Tailscale 可以为你的 tailnet 主机名预置受信任的 Let's Encrypt 证书，无需反向代理。

有关完整的 HTTPS 分步设置（证书生成、`tailscale serve`、配置 `WEBUI_URL`），请参阅专门的参考指南：

[**使用 Tailscale 配置 HTTPS**](/reference/https/tailscale)

简要步骤：

```bash
# 将 HTTPS 流量直接代理到 Open WebUI
sudo tailscale serve https / http://localhost:8080
```

现在，你的实例可通过 `https://my-server.tail1234.ts.net` 访问，并具有有效的 TLS 证书。

---

## 通过 Tailscale 进行身份验证（SSO） {#authentication-via-tailscale-sso}

[Tailscale Serve](https://tailscale.com/kb/1242/tailscale-serve) 可以充当身份验证反向代理。当请求通过 `tailscale serve` 时，Tailscale 会自动设置 `Tailscale-User-Login` 标头，其值为经过身份验证的用户电子邮件地址。Open WebUI 可以信任此标头，将其作为单点登录机制。tailnet 中的用户会自动登录，无需单独的 Open WebUI 密码。

### 工作原理 {#how-it-works}

1. Tailscale sidecar 容器与 Open WebUI 一起运行
2. Tailscale Serve 将 HTTPS 流量代理到 Open WebUI，并注入身份标头
3. Open WebUI 读取 `Tailscale-User-Login` 和 `Tailscale-User-Name` 以识别用户
4. 用户首次访问时会自动注册并登录

### Docker Compose 设置 {#docker-compose-setup}

创建一个 `tailscale/serve.json` 文件，将 Tailscale Serve 配置为代理到 Open WebUI：

```json title="tailscale/serve.json"
{
    "TCP": {
        "443": {
            "HTTPS": true
        }
    },
    "Web": {
        "${TS_CERT_DOMAIN}:443": {
            "Handlers": {
                "/": {
                    "Proxy": "http://open-webui:8080"
                }
            }
        }
    }
}
```

然后设置包含 Tailscale sidecar 的 Docker Compose 文件：

```yaml title="docker-compose.yaml"
---
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    volumes:
      - open-webui:/app/backend/data
    environment:
      - WEBUI_AUTH_TRUSTED_EMAIL_HEADER=Tailscale-User-Login
      - WEBUI_AUTH_TRUSTED_NAME_HEADER=Tailscale-User-Name
    restart: unless-stopped
  tailscale:
    image: tailscale/tailscale:latest
    environment:
      - TS_AUTH_ONCE=true
      - TS_AUTHKEY=${TS_AUTHKEY}
      - TS_EXTRA_ARGS=--advertise-tags=tag:open-webui
      - TS_SERVE_CONFIG=/config/serve.json
      - TS_STATE_DIR=/var/lib/tailscale
      - TS_HOSTNAME=open-webui
    volumes:
      - tailscale:/var/lib/tailscale
      - ./tailscale:/config
      - /dev/net/tun:/dev/net/tun
    cap_add:
      - net_admin
      - sys_module
    restart: unless-stopped

volumes:
  open-webui: {}
  tailscale: {}
```

你需要在 Tailscale 管理控制台中创建一个具有 **device write** 权限的 [OAuth 客户端](https://tailscale.com/kb/1215/oauth-clients)，并将密钥作为 `TS_AUTHKEY` 传入。

你的实例将可通过 `https://open-webui.TAILNET_NAME.ts.net` 访问。

:::warning 使用 ACL 限制直接访问
如果 Tailscale 与 Open WebUI 在同一网络上下文中运行，用户可能绕过 Serve 代理直接访问 Open WebUI，从而跳过受信任标头身份验证。请使用 [Tailscale ACL](https://tailscale.com/kb/1018/acls) 将访问限制为仅允许 443 端口。
:::

有关受信任标头身份验证的更多详细信息，请参阅 [SSO 文档](/features/authentication-access/auth/sso#tailscale-serve)。

---

## Tailscale Funnel（可选的公共访问） {#tailscale-funnel-optional-public-access}

如果希望在客户端无需安装 Tailscale 的情况下公开共享 Open WebUI，[Tailscale Funnel](https://tailscale.com/kb/1223/funnel) 可以将你的 `tailscale serve` 端点暴露到互联网：

```bash
sudo tailscale funnel https / http://localhost:8080
```

现在，你的 Open WebUI 可通过 `https://my-server.tail1234.ts.net` 公开访问，并具有有效的 TLS 证书。与 Cloudflare Tunnel 类似，Funnel 会通过 Tailscale 的基础设施路由流量。

:::warning
Funnel 会使**互联网上的任何人**都能访问你的 Open WebUI。启用前，请确保已在 Open WebUI 中配置身份验证。
:::

---

## 快速参考 {#quick-reference}

| 操作 | 命令/值 |
| :--- | :--- |
| 连接到 tailnet | `sudo tailscale up` |
| 检查主机名 | `tailscale status` |
| 通过 HTTPS 提供服务 | `sudo tailscale serve https / http://localhost:8080` |
| 公共访问（Funnel） | `sudo tailscale funnel https / http://localhost:8080` |
| 手动生成证书 | `sudo tailscale cert my-server.tail1234.ts.net` |
| 管理控制台 | [login.tailscale.com/admin](https://login.tailscale.com/admin) |
| 设置 CORS 来源 | `CORS_ALLOW_ORIGIN=https://my-server.tail1234.ts.net` |
| 受信任的电子邮件标头 | `WEBUI_AUTH_TRUSTED_EMAIL_HEADER=Tailscale-User-Login` |
| 受信任的名称标头 | `WEBUI_AUTH_TRUSTED_NAME_HEADER=Tailscale-User-Name` |

---

## 相关页面 {#related-pages}

- [使用 Tailscale 配置 HTTPS](/reference/https/tailscale) - 专门的 HTTPS/TLS 参考
- [SSO（受信任标头）](/features/authentication-access/auth/sso#tailscale-serve) - 通用受信任标头配置
- [共享 Open WebUI](/getting-started/sharing) - 所有共享方式概述
