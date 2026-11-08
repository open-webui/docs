---
sidebar_position: 6
title: "HTTPS & Reverse Proxies"
---

# HTTPS & Reverse Proxies

**Secure your Open WebUI deployment with TLS encryption, reverse proxies, or managed tunnels.**

HTTPS encrypts all traffic between users and Open WebUI, protecting chat history, credentials, and uploaded files. It is also **required** for browser features like Voice Calls, which need a secure context to access the microphone.

:::warning Voice Calls require HTTPS
Modern browsers block microphone access on non-HTTPS origins. **Voice Calls will not work** over plain `http://` unless you are on `localhost`.
:::

---

## Choose your approach

| Method | Best for | TLS management |
| :--- | :--- | :--- |
| [**Cloudflare Tunnel**](/reference/https/cloudflare-tunnel) | Production without open ports | Automatic (Cloudflare edge) |
| [**ngrok**](/reference/https/ngrok) | Development and testing | Automatic (ngrok edge) |
| [**Tailscale**](/reference/https/tailscale) | Private access across devices | Automatic (tailscale serve) |
| [**Nginx**](/reference/https/nginx) | Self-hosted production with full control | Manual or Let's Encrypt |
| [**Caddy**](/reference/https/caddy) | Self-hosted production, minimal config | Automatic (Let's Encrypt) |
| [**HAProxy**](/reference/https/haproxy) | High-availability / load balancing | Manual or Let's Encrypt |
| **Cloud load balancers** | AWS ALB, GCP LB, Azure App Gateway | Managed by cloud provider |

---

## Quick recommendations

- **Just want HTTPS fast?** Use [Cloudflare Tunnel](/reference/https/cloudflare-tunnel) (production) or [ngrok](/reference/https/ngrok) (development). No certificates to manage, no ports to open.
- **Running a reverse proxy already?** Add [Caddy](/reference/https/caddy) for automatic certs or [Nginx](/reference/https/nginx) for maximum control.
- **Need load balancing?** Use [HAProxy](/reference/https/haproxy) or your cloud provider's load balancer.

---

## Key configuration notes

Regardless of which approach you choose, keep these in mind:

| Setting | Why it matters |
| :--- | :--- |
| `WEBUI_URL` | Set this to your public HTTPS URL so OAuth callbacks and internal links resolve correctly |
| `CORS_ALLOW_ORIGIN` | Must match your public URL, or WebSocket connections will fail silently |
| Proxy buffering **off** | Required for SSE streaming. Buffering breaks markdown rendering in chat responses |
| WebSocket support | Ensure your proxy passes `Upgrade` and `Connection` headers for real-time features |
| Extended timeouts | LLM responses can take minutes. Set proxy read timeouts to at least 300s |
