---
sidebar_position: 1
title: "HTTPS using Cloudflare Tunnel"
---

# HTTPS using Cloudflare Tunnel

**Expose Open WebUI to the internet securely. No open ports, no certificates, no reverse proxy.**

Cloudflare Tunnel (`cloudflared`) creates an outbound-only connection from your machine to Cloudflare's edge network. Traffic flows through Cloudflare's infrastructure with automatic TLS, DDoS protection, and access controls, all without exposing a single port on your server.

:::tip When to use Cloudflare Tunnel
This is the recommended approach when you want **production-grade public access** without managing TLS certificates or firewall rules. It works on any network, including behind NAT or restrictive firewalls.
:::

---

## Prerequisites

| Requirement | Details |
| :--- | :--- |
| **Open WebUI** | Running locally on port `8080` (default) |
| **Cloudflare account** | Free at [cloudflare.com](https://dash.cloudflare.com/sign-up) |
| **Domain on Cloudflare** | Your domain's DNS must be managed by Cloudflare |

---

## Option A: Dashboard setup (no CLI)

The simplest path. Everything configured through the Cloudflare dashboard.

### 1. Create the tunnel

1. Go to [**Zero Trust → Networks → Tunnels**](https://one.dash.cloudflare.com/networks/tunnels)
2. Click **Create a tunnel** → select **Cloudflared**
3. Name it (e.g., `open-webui`)
4. Follow the install instructions to run the connector on your machine

### 2. Add a public hostname

In the tunnel config, add a **Public Hostname**:

| Field | Value |
| :--- | :--- |
| **Subdomain** | `chat` (or whatever you prefer) |
| **Domain** | Select your Cloudflare domain |
| **Service type** | `HTTP` |
| **URL** | `localhost:8080` |

Save. Cloudflare creates the DNS record automatically.

### 3. Access Open WebUI

Open `https://chat.your-domain.com`. HTTPS is handled entirely by Cloudflare.

---

## Option B: CLI setup

For automation, infrastructure-as-code, or headless servers.

### 1. Install cloudflared

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

### 2. Authenticate

```bash
cloudflared tunnel login
```

This opens a browser to authorize `cloudflared` with your Cloudflare account.

### 3. Create the tunnel

```bash
cloudflared tunnel create open-webui
```

Note the **Tunnel ID** in the output. You'll need it for the config.

### 4. Configure

Create `~/.cloudflared/config.yml`:

```yaml
tunnel: YOUR_TUNNEL_ID
credentials-file: /home/YOUR_USER/.cloudflared/YOUR_TUNNEL_ID.json

ingress:
  - hostname: chat.your-domain.com
    service: http://localhost:8080
  - service: http_status:404
```

### 5. Create DNS record

```bash
cloudflared tunnel route dns open-webui chat.your-domain.com
```

### 6. Start the tunnel

```bash
cloudflared tunnel run open-webui
```

Open `https://chat.your-domain.com`.

---

## Run as a system service

To keep the tunnel running after reboot:

```bash
sudo cloudflared service install
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
```

This uses the config at `~/.cloudflared/config.yml` automatically.

---

## Configure Open WebUI

Set `WEBUI_URL` so OAuth callbacks and internal links resolve correctly:

```bash
docker run -d \
  -p 8080:8080 \
  -e WEBUI_URL=https://chat.your-domain.com \
  -v open-webui:/app/backend/data \
  --name open-webui \
  ghcr.io/open-webui/open-webui:main
```

---

## Docker Compose with cloudflared

Run both Open WebUI and the tunnel connector in a single stack:

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

Get your tunnel token from the [Cloudflare dashboard](https://one.dash.cloudflare.com/networks/tunnels) → select your tunnel → **Configure** → copy the token from the install command.

:::tip
No `ports` needed on the `open-webui` service. `cloudflared` connects to it via Docker's internal network. To use this, change the service URL in your tunnel config to `http://open-webui:8080`.
:::

---

## Add access controls (optional)

Cloudflare Zero Trust lets you gate access behind authentication without touching Open WebUI:

1. Go to [**Zero Trust → Access → Applications**](https://one.dash.cloudflare.com/access/apps)
2. **Add an application** → Self-hosted
3. Set the domain to `chat.your-domain.com`
4. Create an **Access Policy** (e.g., allow only `@your-company.com` emails)

Users see a Cloudflare login page before reaching Open WebUI.

---

## Quick reference

| What | Command / Value |
| :--- | :--- |
| Create tunnel | `cloudflared tunnel create open-webui` |
| Start tunnel | `cloudflared tunnel run open-webui` |
| Add DNS | `cloudflared tunnel route dns open-webui chat.your-domain.com` |
| Install as service | `sudo cloudflared service install` |
| Dashboard | [one.dash.cloudflare.com/networks/tunnels](https://one.dash.cloudflare.com/networks/tunnels) |
| Set CORS origin | `CORS_ALLOW_ORIGIN=https://chat.your-domain.com` |
