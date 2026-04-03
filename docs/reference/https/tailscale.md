---
sidebar_position: 3
title: "HTTPS using Tailscale"
---

# HTTPS using Tailscale

**Access Open WebUI securely from anywhere on your private network. No ports, no certificates, no public exposure.**

Tailscale creates an encrypted mesh VPN (a "tailnet") between your devices. Every device gets a stable hostname like `my-server.tail1234.ts.net`, and Tailscale can provision trusted HTTPS certificates for it automatically. Your Open WebUI instance stays completely private, accessible only to devices on your tailnet.

:::tip When to use Tailscale
Tailscale is ideal when you want **private, authenticated access** across devices without exposing Open WebUI to the public internet. Perfect for personal setups, small teams, or accessing a home server from your phone or laptop on the go.
:::

:::info Looking for the full guide?
This page covers **HTTPS setup** specifically. For the complete Tailscale integration story, including SSO authentication, Docker Compose sidecar setup, and more, see the [**Tailscale Integration Tutorial**](/tutorials/integrations/tailscale).
:::

---

## Prerequisites

| Requirement | Details |
| :--- | :--- |
| **Open WebUI** | Running locally on port `8080` (default) |
| **Tailscale account** | Free for personal use at [tailscale.com](https://tailscale.com) |
| **Tailscale installed** | On both the server running Open WebUI and any client devices |

---

## 1. Install Tailscale

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="mac" label="macOS" default>

Download from the [Mac App Store](https://apps.apple.com/app/tailscale/id1475387142) or:

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

Download from [tailscale.com/download](https://tailscale.com/download/windows).

  </TabItem>
</Tabs>

## 2. Connect the server

On the machine running Open WebUI:

```bash
sudo tailscale up
```

Your machine gets a tailnet hostname like `my-server.tail1234.ts.net`. Find it with:

```bash
tailscale status
```

## 3. Access Open WebUI

From any device on the same tailnet, open:

```
http://my-server.tail1234.ts.net:8080
```

This connection is already encrypted end-to-end by WireGuard. For browser features that require HTTPS (like Voice Calls), continue to the next step.

---

## Enable HTTPS with Tailscale certificates

Tailscale can provision trusted Let's Encrypt certificates for your tailnet hostname.

### 1. Enable HTTPS in the admin console

Go to [**Tailscale Admin → DNS**](https://login.tailscale.com/admin/dns) and enable **HTTPS Certificates**.

### 2. Generate a certificate

```bash
sudo tailscale cert my-server.tail1234.ts.net
```

This creates two files in the current directory:
- `my-server.tail1234.ts.net.crt` (certificate)
- `my-server.tail1234.ts.net.key` (private key)

### 3. Serve Open WebUI over HTTPS

Use `tailscale serve` to proxy HTTPS traffic directly to Open WebUI without any reverse proxy:

```bash
sudo tailscale serve https / http://localhost:8080
```

Now access Open WebUI at:

```
https://my-server.tail1234.ts.net
```

No port number needed. Tailscale handles TLS termination and proxies to your local Open WebUI.

---

## Configure Open WebUI

Set `WEBUI_URL` so OAuth callbacks and internal links resolve correctly:

```bash
docker run -d \
  -p 8080:8080 \
  -e WEBUI_URL=https://my-server.tail1234.ts.net \
  -v open-webui:/app/backend/data \
  --name open-webui \
  ghcr.io/open-webui/open-webui:main
```

---

## Tailscale Funnel (optional public access)

If you want to share Open WebUI publicly (without requiring Tailscale on the client), Tailscale Funnel exposes your `tailscale serve` endpoint to the internet:

```bash
sudo tailscale funnel https / http://localhost:8080
```

Your Open WebUI is now publicly accessible at `https://my-server.tail1234.ts.net` with a valid TLS certificate. Funnel routes traffic through Tailscale's infrastructure, similar to Cloudflare Tunnel.

:::warning
Funnel makes your Open WebUI accessible to anyone on the internet. Make sure you have authentication configured in Open WebUI before enabling it.
:::

---

## Quick reference

| What | Command / Value |
| :--- | :--- |
| Connect to tailnet | `sudo tailscale up` |
| Check hostname | `tailscale status` |
| Serve over HTTPS | `sudo tailscale serve https / http://localhost:8080` |
| Public access (Funnel) | `sudo tailscale funnel https / http://localhost:8080` |
| Generate cert manually | `sudo tailscale cert my-server.tail1234.ts.net` |
| Admin console | [login.tailscale.com/admin](https://login.tailscale.com/admin) |
| Set CORS origin | `CORS_ALLOW_ORIGIN=https://my-server.tail1234.ts.net` |
