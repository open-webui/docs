---
sidebar_position: 2
title: "HTTPS using ngrok"
---

# HTTPS using ngrok

**Instant public HTTPS for your local Open WebUI. Zero config, zero open ports.**

ngrok creates a secure tunnel from a public URL to your local machine. It's the fastest way to get HTTPS working for development, demos, or testing features that require a secure context (like Voice Calls).

:::tip When to use ngrok
ngrok is ideal for **development and testing**. For production deployments, use a reverse proxy like [Nginx](/reference/https/nginx) or [Caddy](/reference/https/caddy), or a [Cloudflare Tunnel](/reference/https/cloudflare-tunnel) for zero-trust access.
:::

---

## Prerequisites

| Requirement | Details |
| :--- | :--- |
| **Open WebUI** | Running locally on port `8080` (default) |
| **ngrok account** | Free at [ngrok.com](https://ngrok.com), provides a stable authtoken |

---

## 1. Install ngrok

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

Or download directly from [ngrok.com/download](https://ngrok.com/download).

  </TabItem>
</Tabs>

## 2. Authenticate

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

Find your authtoken at [dashboard.ngrok.com/get-started/your-authtoken](https://dashboard.ngrok.com/get-started/your-authtoken).

## 3. Start the tunnel

```bash
ngrok http 8080
```

ngrok outputs a public URL like:

```
Forwarding  https://a1b2-203-0-113-42.ngrok-free.app → http://localhost:8080
```

Open that `https://` URL in your browser. You're done.

---

## Configure Open WebUI

Set `WEBUI_URL` so OAuth callbacks and internal links resolve correctly:

```bash
docker run -d \
  -p 8080:8080 \
  -e WEBUI_URL=https://a1b2-203-0-113-42.ngrok-free.app \
  -v open-webui:/app/backend/data \
  --name open-webui \
  ghcr.io/open-webui/open-webui:main
```

:::warning
ngrok free-tier URLs change every time you restart the tunnel. Update `WEBUI_URL` accordingly, or use a [ngrok custom domain](https://ngrok.com/docs/guides/how-to-set-up-a-custom-domain/) (paid) for a stable URL.
:::

---

## Custom domain (optional)

With a paid ngrok plan, claim a fixed subdomain so your URL never changes:

```bash
ngrok http 8080 --url=your-name.ngrok-free.app
```

This gives you a permanent URL you can set once in `WEBUI_URL` and forget.

---

## Quick reference

| What | Command / Value |
| :--- | :--- |
| Start tunnel | `ngrok http 8080` |
| Custom domain | `ngrok http 8080 --url=your-name.ngrok-free.app` |
| Dashboard | [dashboard.ngrok.com](https://dashboard.ngrok.com) |
| Inspect traffic | `http://localhost:4040` (ngrok's local inspector) |
| Set CORS origin | `CORS_ALLOW_ORIGIN=https://your-name.ngrok-free.app` |

---

## Limitations

| Concern | Detail |
| :--- | :--- |
| **Free-tier URLs rotate** | URL changes on every restart unless you use a custom domain |
| **Interstitial warning** | Free-tier shows an ngrok splash page on first visit |
| **Not for production** | ngrok adds latency and is a single point of failure; use a reverse proxy or Cloudflare Tunnel instead |
| **Rate limits** | Free tier has connection rate limits; paid plans remove them |
