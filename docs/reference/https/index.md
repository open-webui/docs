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
| [**Cloudflare Tunnel**](./cloudflare-tunnel) | Production without open ports | Automatic (Cloudflare edge) |
| [**ngrok**](./ngrok) | Development and testing | Automatic (ngrok edge) |
| [**Tailscale**](./tailscale) | Private access across devices | Automatic (tailscale serve) |
| [**Nginx**](./nginx) | Self-hosted production with full control | Manual or Let's Encrypt |
| [**Caddy**](./caddy) | Self-hosted production, minimal config | Automatic (Let's Encrypt) |
| [**HAProxy**](./haproxy) | High-availability / load balancing | Manual or Let's Encrypt |
| **Cloud load balancers** | AWS ALB, GCP LB, Azure App Gateway | Managed by cloud provider |

---

## Quick recommendations

- **Just want HTTPS fast?** Use [Cloudflare Tunnel](./cloudflare-tunnel) (production) or [ngrok](./ngrok) (development). No certificates to manage, no ports to open.
- **Running a reverse proxy already?** Add [Caddy](./caddy) for automatic certs or [Nginx](./nginx) for maximum control.
- **Need load balancing?** Use [HAProxy](./haproxy) or your cloud provider's load balancer.

---

## Key configuration notes

Regardless of which approach you choose, keep these in mind:

| Setting | Why it matters |
| :--- | :--- |
| `WEBUI_URL` | Set this to your public HTTPS URL so OAuth callbacks and internal links resolve correctly. It is persisted config: once saved in Admin Settings > General, the stored value wins over the env var. When it is empty, OAuth falls back to the request's own URL, which is right only if the proxy forwards `Host` and `X-Forwarded-Proto` |
| `CORS_ALLOW_ORIGIN` | Defaults to `*`, so leaving it unset never breaks WebSocket. If you set it, it must include your exact public origin (scheme, host, port), or browser and WebSocket requests fail |
| Proxy buffering **off** | Keeps SSE streaming for API clients and the Socket.IO polling fallback. The web UI streams chat tokens over `/ws/socket.io`, so buffering does not affect it while WebSocket works |
| WebSocket support | Proxy `/ws/socket.io` with `Upgrade` and `Connection` headers. By default the browser uses the WebSocket transport only, with no polling fallback; behind a proxy that cannot upgrade, set `ENABLE_WEBSOCKET_SUPPORT=false` to switch server and client to long-polling |
| Forwarded headers | Forward `X-Forwarded-For` and `X-Forwarded-Proto`. Audit-log client IPs, the sign-in rate limiter and OAuth redirects (when `WEBUI_URL` is empty) come from them, and Uvicorn trusts them from any peer unless `FORWARDED_ALLOW_IPS` names the proxy's address. `X-Real-IP` is not read |
| Secure cookies | The `token` and `owui-session` cookies are sent without `Secure` by default. Once TLS is in front, set `WEBUI_AUTH_COOKIE_SECURE=true` and `WEBUI_SESSION_COOKIE_SECURE=true` |
| Extended timeouts | API clients streaming from `/api/chat/completions` and long non-streaming requests (uploads with processing, web fetch, transcription) can take minutes; set proxy read timeouts to at least 300s. The Socket.IO connection pings every 25s, so it survives any idle timeout above about 45s |
| Upload size | The app has no upload cap until Max Upload Size is set in Admin Settings > Documents, so the proxy's body-size limit is what returns 413; set it at or above the value you configure there |
| Health checks | Point load balancers at `/health` (liveness) or `/ready` (readiness: startup finished, database and Redis reachable) |
| Several instances | Socket.IO state lives in-process. Balancing across instances, or running `UVICORN_WORKERS` above 1, needs `WEBSOCKET_MANAGER=redis` with `REDIS_URL` and a shared database |
