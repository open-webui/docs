---
title: "Tailscale (recommended)"
sidebar_position: 2
---

# Tailscale (recommended)

Tailscale puts your phone and your computer on a private network of their own. Nothing is exposed to the public internet, there's no port forwarding, and it works from any network your phone is on.

Install Tailscale on both devices and sign in to the same account ([Tailscale's setup guide](https://tailscale.com/kb/1017/install)). Then pick one of two setups.

## Option A: plain tailnet access

Every device on your tailnet gets a stable private IP (and a MagicDNS name). Run `cptr` so it's reachable on that address:

```bash
cptr run --host 0.0.0.0
```

On your phone, open `http://<tailscale-ip-or-name>:8000`.

The catch: the default `cptr run` binds to `127.0.0.1`, which the tailnet can't reach. You have to bind to the Tailscale interface or `0.0.0.0`, which also makes it reachable on your LAN. If you're not sure what that means for your network, use Option B instead.

## Option B: Tailscale Serve (HTTPS, cptr stays on localhost)

Tailscale Serve proxies HTTPS from your tailnet to a local port, so `cptr` keeps its default localhost binding and you get a proper `https://` URL (which the [PWA install](./phone-app) and browser features like clipboard access are happier with).

With `cptr run` already running:

```bash
tailscale serve --bg localhost:8000
```

Get your URL:

```bash
tailscale serve status
```

Open that URL on your phone and sign in. To remove the proxy later:

```bash
tailscale serve reset
```

Tailscale may prompt an admin to enable HTTPS certificates for your tailnet the first time.

## Verify it works away from home

Turn off Wi-Fi on your phone so it's on cellular, then open the URL again. If your workspace and running terminal sessions load, you're done; that's exactly what it will look like from the train.

If it doesn't load: check `http://127.0.0.1:8000/api/health` on the computer, confirm both devices show up in the Tailscale admin console, and rerun `tailscale serve status`.

:::warning Don't reach for Funnel
`tailscale funnel` publishes the URL to the whole internet, not just your devices. Only do that if you understand you're going public. Then treat it like the [Cloudflare Tunnel / ngrok setups](./cloudflare-and-ngrok): put the provider's own authentication in front, don't rely on Computer's login alone.
:::
