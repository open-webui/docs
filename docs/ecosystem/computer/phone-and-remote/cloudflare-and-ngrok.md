---
title: "Cloudflare Tunnel and ngrok"
sidebar_position: 3
---

# Cloudflare Tunnel and ngrok

Both give you a public URL that forwards to `localhost:8000`: no port forwarding, and the default `cptr run` binding works as-is. Public means anyone who finds the URL reaches your login page, and Computer's password is then the only thing between the internet and your shell. So use the provider's own auth layer as a second gate. Both providers pass WebSockets through, which Computer's terminals and streaming need.

## Cloudflare Tunnel

Quick trial (temporary random URL, no account config needed):

```bash
cloudflared tunnel --url http://localhost:8000
```

`cloudflared` prints a `https://....trycloudflare.com` URL; open it on your phone.

For real use, create a **named tunnel** on your own domain and put a **Cloudflare Access** policy in front of the hostname, so Cloudflare authenticates you (email OTP, Google, GitHub, ...) before any request reaches Computer. Follow Cloudflare's docs:

- [Create a tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
- [Add an Access application](https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/)

## ngrok

```bash
ngrok http 8000
```

ngrok prints a public `https://` URL. Add ngrok's own auth so the URL isn't open to everyone. Basic auth:

```bash
ngrok http 8000 --basic-auth "you:a-long-password"
```

or OAuth (Google, GitHub, and others) via `--oauth`. See [ngrok's docs](https://ngrok.com/docs) for the current flags and dashboard-managed edges.

## Which one?

- **Cloudflare Tunnel** if you have a domain on Cloudflare and want a permanent URL with a real access policy.
- **ngrok** if you want a URL in one command right now.
- If you don't need a public URL at all, [Tailscale](./tailscale) is the better default: private by construction, no second auth layer to configure.

:::warning
Don't run either of these bare. Without Cloudflare Access or ngrok auth in front, you've published an SSH-equivalent login page to the internet. See the [security model](./security).
:::
