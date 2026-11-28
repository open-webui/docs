---
sidebar_position: 2
title: "使用 ngrok 配置 HTTPS"
---

# 使用 ngrok 配置 HTTPS

**为本地 Open WebUI 即时提供公共 HTTPS。零配置，无需开放端口。**

ngrok 会创建一条从公共 URL 到本地机器的安全隧道。这是为开发、演示或测试需要安全上下文的功能（例如语音通话）启用 HTTPS 的最快方式。

:::tip 何时使用 ngrok
ngrok 非常适合**开发和测试**。对于生产部署，请使用 [Nginx](/reference/https/nginx) 或 [Caddy](/reference/https/caddy) 等反向代理，或者使用 [Cloudflare Tunnel](/reference/https/cloudflare-tunnel) 实现零信任访问。
:::

---

## 前提条件 {#prerequisites}

| 要求 | 说明 |
| :--- | :--- |
| **Open WebUI** | 在本地端口 `8080` 上运行（默认） |
| **ngrok 账户** | 可在 [ngrok.com](https://ngrok.com) 免费注册，提供稳定的 authtoken |

---

## 1. 安装 ngrok {#1-install-ngrok}

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="mac" label="macOS" default>

```bash
brew install ngrok
```

  </TabItem>
  <TabItem value="linux" label="Linux">

```bash
curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok-v3-stable-linux-amd64.tgz \
  | sudo tar xz -C /usr/local/bin
```

  </TabItem>
  <TabItem value="windows" label="Windows">

```powershell
choco install ngrok
```

也可以直接从 [ngrok.com/download](https://ngrok.com/download) 下载。

  </TabItem>
</Tabs>

## 2. 身份验证 {#2-authenticate}

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

在 [dashboard.ngrok.com/get-started/your-authtoken](https://dashboard.ngrok.com/get-started/your-authtoken) 查找你的 authtoken。

## 3. 启动隧道 {#3-start-the-tunnel}

```bash
ngrok http 8080
```

ngrok 会输出如下公共 URL：

```
Forwarding  https://a1b2-203-0-113-42.ngrok-free.app → http://localhost:8080
```

在浏览器中打开该 `https://` URL 即可完成。

---

## 配置 Open WebUI {#configure-open-webui}

设置 `WEBUI_URL`，确保 OAuth 回调和内部链接能够正确解析：

```bash
docker run -d \
  -p 8080:8080 \
  -e WEBUI_URL=https://a1b2-203-0-113-42.ngrok-free.app \
  -v open-webui:/app/backend/data \
  --name open-webui \
  ghcr.io/open-webui/open-webui:main
```

:::warning
ngrok 免费套餐的 URL 会在每次重启隧道时变化。请相应更新 `WEBUI_URL`，或者使用 [ngrok 自定义域名](https://ngrok.com/docs/guides/how-to-set-up-a-custom-domain/)（付费）获得稳定的 URL。
:::

---

## 自定义域名（可选） {#custom-domain-optional}

使用付费 ngrok 套餐，可以申领一个固定子域名，让 URL 不再变化：

```bash
ngrok http 8080 --url=your-name.ngrok-free.app
```

这样你就获得了一个永久 URL，只需在 `WEBUI_URL` 中设置一次，之后便无需再处理。

---

## 快速参考 {#quick-reference}

| 操作 | 命令 / 值 |
| :--- | :--- |
| 启动隧道 | `ngrok http 8080` |
| 自定义域名 | `ngrok http 8080 --url=your-name.ngrok-free.app` |
| 控制面板 | [dashboard.ngrok.com](https://dashboard.ngrok.com) |
| 检查流量 | `http://localhost:4040`（ngrok 本地检查器） |
| 设置 CORS 来源 | `CORS_ALLOW_ORIGIN=https://your-name.ngrok-free.app` |

---

## 限制 {#limitations}

| 注意事项 | 说明 |
| :--- | :--- |
| **免费套餐的 URL 会轮换** | 除非使用自定义域名，否则 URL 会在每次重启时变化 |
| **中间警告页** | 免费套餐会在首次访问时显示 ngrok 提示页 |
| **不适用于生产环境** | ngrok 会增加延迟，并且是单点故障；请改用反向代理或 Cloudflare Tunnel |
| **速率限制** | 免费套餐有连接速率限制；付费套餐可移除这些限制 |
