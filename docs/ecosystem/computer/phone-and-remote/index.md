---
title: "Use it from your phone"
sidebar_position: 1
---

# Use it from your phone

Open WebUI Computer serves your whole machine to any browser. Your phone is a browser. Pick the route that matches where you are:

| Your situation | Do this |
|---|---|
| Phone is on the same Wi-Fi as the computer | Run `cptr run --host 0.0.0.0`, then open `http://<computer-ip>:8000` on the phone |
| Away from home | [Tailscale](./tailscale) (recommended), or [Cloudflare Tunnel / ngrok](./cloudflare-and-ngrok) for a public URL |
| You already run a domain and a reverse proxy | [Reverse proxy and SSO](./reverse-proxy) |

One thing to know before you pick: a signed-in user has full access to your files and shell, so choose a route where only you can reach the login page (details in the [security model](./security)).

## Same Wi-Fi

`cptr run` binds to `127.0.0.1` by default, which only the computer itself can reach. Bind to all interfaces instead:

```bash
cptr run --host 0.0.0.0
```

Find your computer's LAN IP (macOS: **System Settings → Wi-Fi → Details**; or `ipconfig getifaddr en0`; Linux: `ip addr`), then open `http://<computer-ip>:8000` on your phone and sign in.

## Away from home

You need a path from the internet back to your machine. Three good options:

- **[Tailscale](./tailscale)**: recommended. A private network between your own devices; nothing is public, and `cptr` can stay on localhost.
- **[Cloudflare Tunnel](./cloudflare-and-ngrok)**: a permanent public URL through Cloudflare's edge, best paired with Cloudflare Access.
- **[ngrok](./cloudflare-and-ngrok)**: a public URL in one command, best paired with ngrok's built-in auth.

## Already have a domain?

If you run nginx, Caddy, or Traefik on a box you control, put `cptr` behind it like any other web app, including single sign-on via trusted-header auth. See [Reverse proxy and SSO](./reverse-proxy).

## Then make it stick

Two follow-ups everyone wants next:

- [Install the app (PWA)](./phone-app): home-screen icon, share sheet into a workspace, shortcuts.
- [Keep it running](./keep-it-running): start at boot, survive reboots, stop your machine from sleeping.
