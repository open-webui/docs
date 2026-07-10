---
title: Private remote access with Tailscale
sidebar_position: 4
---

# Private remote access with Tailscale

## Use this when

Use this when you need the real branch and terminal from a phone outside the home network, without opening a public router port. Tailscale Serve is the supported private-access route in this guide.

## Before you start

- Complete the [local trial](/ecosystem/computer/getting-started/local-trial) and [first workspace](/ecosystem/computer/getting-started/first-workspace) on the host first.
- Keep Open WebUI Computer on its default localhost binding (`127.0.0.1`).
- Enrol only devices you control in a private Tailscale network. Tailscale Serve may prompt an administrator to enable HTTPS certificates for that network.
- Do not use Tailscale Funnel or another public tunnel. Public-tunnel deployment is unsupported for Open WebUI Computer.

## Do it

1. Install and sign in to Tailscale on the host and remote device, following [Tailscale's setup instructions](https://tailscale.com/docs).
2. On the host, with Computer already running on localhost, publish a private Tailscale Serve reverse proxy:

   ```bash
   tailscale serve --bg localhost:8000
   ```

3. Ask Tailscale for the configured private URL:

   ```bash
   tailscale serve status
   ```

4. Open that URL from the enrolled phone or laptop and sign in to Computer.

If you deliberately bind Computer to a non-loopback address instead, it can become reachable on other host interfaces too. That is an advanced network/firewall design, not the default remote-access recipe.

## Verify it worked

Turn off Wi-Fi on the remote phone so it uses a different network. Open the URL reported by `tailscale serve status`, sign in, and confirm the same workspace and existing terminal session appear. The local `cptr run` process should still listen only on `127.0.0.1`.

## If it did not

If Serve cannot reach Computer, first verify `http://127.0.0.1:8000/api/health` on the host. Then rerun `tailscale serve status` and confirm both devices are enrolled and allowed by the tailnet policy. Do not solve a private-access failure by opening a router port or a public tunnel. To remove the proxy, run `tailscale serve reset`.

## Trust boundary

Tailscale Serve limits reachability to enrolled devices and tailnet policy, but it does not reduce what a signed-in Computer user can do. Public tunnel deployment, including Tailscale Funnel, is unsupported. Do not expose this service to the public internet. See [the Tailscale Serve documentation](https://tailscale.com/docs/reference/tailscale-cli/serve) for current command behavior.
