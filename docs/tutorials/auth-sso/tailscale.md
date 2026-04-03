---
sidebar_position: 50
title: "Tailscale"
---

# Tailscale Integration

**Private, encrypted access to Open WebUI from any device. No ports to open, no certificates to manage.**

[Tailscale](https://tailscale.com) creates a WireGuard-based mesh VPN (a "tailnet") between your devices. Every device gets a stable hostname like `my-server.tail1234.ts.net`, and Tailscale can provision trusted HTTPS certificates automatically. Your Open WebUI instance stays completely private, accessible only to devices on your tailnet.

:::tip When to use Tailscale
Tailscale is ideal when you want **private, authenticated access** across devices without exposing Open WebUI to the public internet. Perfect for personal setups, small teams, or accessing a home server from your phone or laptop on the go.
:::

---

## Prerequisites

| Requirement | Details |
| :--- | :--- |
| **Open WebUI** | Running locally on port `8080` (default) |
| **Tailscale account** | Free for personal use at [tailscale.com](https://tailscale.com) |
| **Tailscale installed** | On both the server running Open WebUI and any client devices |

---

## Quick Start

### 1. Install Tailscale

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

### 2. Connect the server

On the machine running Open WebUI:

```bash
sudo tailscale up
```

Your machine gets a tailnet hostname like `my-server.tail1234.ts.net`. Find it with:

```bash
tailscale status
```

### 3. Access Open WebUI

From any device on the same tailnet, open:

```
http://my-server.tail1234.ts.net:8080
```

This connection is already encrypted end-to-end by WireGuard. For browser features that require HTTPS (like Voice Calls), continue to the next section.

---

## HTTPS with Tailscale

Tailscale can provision trusted Let's Encrypt certificates for your tailnet hostname, no reverse proxy required.

For the full step-by-step HTTPS setup (certificate generation, `tailscale serve`, configuring `WEBUI_URL`), see the dedicated reference guide:

👉 [**HTTPS using Tailscale**](/reference/https/tailscale)

The short version:

```bash
# Proxy HTTPS traffic directly to Open WebUI
sudo tailscale serve https / http://localhost:8080
```

Your instance is now available at `https://my-server.tail1234.ts.net` with a valid TLS certificate.

---

## Authentication via Tailscale (SSO)

[Tailscale Serve](https://tailscale.com/kb/1242/tailscale-serve) can act as an authenticating reverse proxy. When a request passes through `tailscale serve`, Tailscale automatically sets the `Tailscale-User-Login` header with the email address of the authenticated user. Open WebUI can trust this header as a single sign-on mechanism. Users on your tailnet are automatically logged in without needing a separate Open WebUI password.

### How it works

1. A Tailscale sidecar container runs alongside Open WebUI
2. Tailscale Serve proxies HTTPS traffic to Open WebUI and injects identity headers
3. Open WebUI reads `Tailscale-User-Login` and `Tailscale-User-Name` to identify the user
4. Users are auto-registered and logged in on first visit

### Docker Compose Setup

Create a `tailscale/serve.json` file that configures Tailscale Serve to proxy to Open WebUI:

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

Then set up the Docker Compose file with a Tailscale sidecar:

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

You will need to create an [OAuth client](https://tailscale.com/kb/1215/oauth-clients) with **device write** permission in the Tailscale admin console and pass the key as `TS_AUTHKEY`.

Your instance will be reachable at `https://open-webui.TAILNET_NAME.ts.net`.

:::warning Restrict direct access with ACLs
If you run Tailscale in the same network context as Open WebUI, users could bypass the Serve proxy and reach Open WebUI directly, skipping the trusted header authentication. Use [Tailscale ACLs](https://tailscale.com/kb/1018/acls) to restrict access to only port 443.
:::

For more details on trusted header authentication, see the [SSO documentation](/features/authentication-access/auth/sso#tailscale-serve).

---

## Tailscale Funnel (Optional Public Access)

If you want to share Open WebUI publicly without requiring Tailscale on the client, [Tailscale Funnel](https://tailscale.com/kb/1223/funnel) exposes your `tailscale serve` endpoint to the internet:

```bash
sudo tailscale funnel https / http://localhost:8080
```

Your Open WebUI is now publicly accessible at `https://my-server.tail1234.ts.net` with a valid TLS certificate. Funnel routes traffic through Tailscale's infrastructure, similar to Cloudflare Tunnel.

:::warning
Funnel makes your Open WebUI accessible to **anyone on the internet**. Make sure you have authentication configured in Open WebUI before enabling it.
:::

---

## Quick Reference

| What | Command / Value |
| :--- | :--- |
| Connect to tailnet | `sudo tailscale up` |
| Check hostname | `tailscale status` |
| Serve over HTTPS | `sudo tailscale serve https / http://localhost:8080` |
| Public access (Funnel) | `sudo tailscale funnel https / http://localhost:8080` |
| Generate cert manually | `sudo tailscale cert my-server.tail1234.ts.net` |
| Admin console | [login.tailscale.com/admin](https://login.tailscale.com/admin) |
| Set CORS origin | `CORS_ALLOW_ORIGIN=https://my-server.tail1234.ts.net` |
| Trusted email header | `WEBUI_AUTH_TRUSTED_EMAIL_HEADER=Tailscale-User-Login` |
| Trusted name header | `WEBUI_AUTH_TRUSTED_NAME_HEADER=Tailscale-User-Name` |

---

## Related Pages

- [HTTPS using Tailscale](/reference/https/tailscale) - focused HTTPS/TLS reference
- [SSO (Trusted Header)](/features/authentication-access/auth/sso#tailscale-serve) - generic trusted header configuration
- [Sharing Open WebUI](/getting-started/sharing) - overview of all sharing approaches
