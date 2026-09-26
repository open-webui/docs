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
| `WEBUI_URL` | Set this to your public HTTPS URL. The redirect back to Open WebUI after SSO sign-in falls back to the request's own URL when it is empty, but links in notifications and webhooks do not, and they lose their host. It is persisted config: the value present at first startup is stored, and from then on the stored value (Admin Settings > General) wins over the env var unless `ENABLE_PERSISTENT_CONFIG=false`. It does not set the SSO callback URL sent to the identity provider, which is built from the request unless `OPENID_REDIRECT_URI` or a provider's `*_REDIRECT_URI` is set |
| `CORS_ALLOW_ORIGIN` | Defaults to `*`, so leaving it unset never breaks WebSocket. If you set it, it must include your exact public origin (scheme, host, port), or Socket.IO connections (and any cross-origin browser requests) fail |
| Proxy buffering **off** | Keeps streamed responses flowing for API clients. The web UI streams chat tokens over `/ws/socket.io`, so buffering does not affect it while WebSocket works |
| WebSocket support | Proxy `/ws/socket.io` with `Upgrade` and `Connection` headers. By default the browser uses the WebSocket transport only, with no polling fallback; behind a proxy that cannot upgrade, set `ENABLE_WEBSOCKET_SUPPORT=false` to switch server and client to long-polling |
| Forwarded headers | Pass the original `Host` header and forward `X-Forwarded-For` and `X-Forwarded-Proto`. Audit-log client IPs come from `X-Forwarded-For`; the SSO callback URL sent to the identity provider (unless a redirect URI is set) is built from `Host` and `X-Forwarded-Proto`. The Docker image's start script trusts the `X-Forwarded-*` headers from any peer unless `FORWARDED_ALLOW_IPS` names the proxy's address; `open-webui serve` always trusts every peer. `X-Real-IP` is not read |
| Secure cookies | The `token` and `owui-session` cookies, and the OAuth session cookies, are sent without `Secure` by default. Once TLS is in front, set `WEBUI_AUTH_COOKIE_SECURE=true` and `WEBUI_SESSION_COOKIE_SECURE=true` |
| Extended timeouts | API clients streaming from `/api/chat/completions` and long non-streaming requests (uploads with processing, web fetch, transcription) can take minutes; set proxy read timeouts to at least 300s. The Socket.IO connection pings every 25s, so it survives any idle timeout above about 45s |
| Upload size | The app has no upload cap until Max Upload Size is set (Admin Settings > Documents, or `RAG_FILE_MAX_SIZE`), so the proxy's body-size limit is what returns 413; set it at or above the value you configure there |
| Health checks | Point load balancers at `/health` (liveness) or `/ready` (readiness: startup finished, database and Redis reachable) |
| Several instances | Socket.IO state lives in-process. Balancing across instances, or running `UVICORN_WORKERS` above 1, needs `WEBSOCKET_MANAGER=redis` with `REDIS_URL`, a shared database, and the same `WEBUI_SECRET_KEY` on every instance |
