---
sidebar_position: 202
title: "HTTPS using Caddy"
---


## HTTPS Using Caddy

Ensuring secure communication between your users and the Open WebUI is paramount. HTTPS (HyperText Transfer Protocol Secure) encrypts the data transmitted, protecting it from eavesdroppers and tampering. By configuring Caddy as a reverse proxy, you can seamlessly add HTTPS to your Open WebUI deployment, enhancing both security and trustworthiness.

This guide is simple walkthrough to set up a Ubuntu server with Caddy as a reverse proxy for Open WebUI, enabling HTTPS with automatic certificate management.

There's a few steps we'll follow to get everything set up:

- [HTTPS Using Caddy](#https-using-caddy)
- [Docker](#docker)
  - [Installing Docker](#installing-docker)
- [OpenWebUI](#openwebui)
  - [Installing OpenWebUI](#installing-openwebui)
- [Caddy](#caddy)
  - [Installing Caddy](#installing-caddy)
  - [Configure Caddy](#configure-caddy)
- [Testing HTTPS](#testing-https)
- [Updating Open WebUI](#updating-open-webui)
  - [Stopping Open WebUI](#stopping-open-webui)
  - [Pulling the latest image](#pulling-the-latest-image)
  - [Starting Open WebUI](#starting-open-webui)

## Docker

Follow the guide to set up Docker's apt repository [Docker](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository)

I've included `docker-compose` as it's needed to run `docker compose`.

### Installing Docker

Here's the command I've used to install Docker on Ubuntu:

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker-compose
```

## OpenWebUI

I'd go ahead and create a directory for the Open WebUI project:

```bash
mkdir -p ~/open-webui
cd ~/open-webui
```

### Installing OpenWebUI

Create a `docker-compose.yml` file in the `~/open-webui` directory. I've left in a commented section for setting some environment varibles for Qdrant, but you can follow that for any other [environment variables](https://docs.openwebui.com/reference/env-configuration) you might need to set.

```yaml
services:
    open-webui:
        image: ghcr.io/open-webui/open-webui:main
        container_name: open-webui
        ports:
            - "8080:8080"
        volumes:
            - ./data:/app/backend/data
        # environment:
        #     - "QDRANT_API_KEY=API_KEY_HERE"
        #     - "QDRANT_URI=https://example.com"
        restart: unless-stopped
```

## Caddy

Caddy is a powerful web server that automatically manages TLS certificates for you, making it an excellent choice for serving Open WebUI over HTTPS.

### Installing Caddy

Follow the [guide to set up Caddy's on Ubuntu](https://caddyserver.com/docs/install#debian-ubuntu-raspbian).

### Configure Caddy

You're going to need to change the `CaddyFile` to use your domain.

To do that, edit the file `/etc/caddy/Caddyfile`.

```bash
sudo nano /etc/caddy/Caddyfile
```

Then the configuration should have the following:

```caddyfile
your-domain.com {
  reverse_proxy localhost:8080
}
```

Make sure to replace `your-domain.com` with your actual domain name.

## Testing HTTPS

Now assuming you've already set up your DNS records to point to your server's IP address, you should be able to test if Open WebUI is accessible via HTTPS by running `docker compose up` in the `~/open-webui` directory.

```bash
cd ~/open-webui
docker compose up -d
```

You should now be able to access Open WebUI at `https://your-domain.com`.

## Optional: Security Headers via Reverse Proxy

Open WebUI supports setting security headers directly at the application layer via environment variables
(recommended path, see [Security Headers](/getting-started/advanced-topics/hardening#security-headers)).
If you manage multiple applications behind a single Caddy instance, or if your deployment does not allow
direct environment variable access, you can set these headers at the proxy layer instead.

**Choose one layer only.** Setting the same header in both places produces duplicate directives:
duplicate `Content-Security-Policy` headers are combined by browsers (intersection), which can
unexpectedly tighten or break your policy, while duplicate `Strict-Transport-Security` or
`X-Frame-Options` headers lead to ambiguous, browser-dependent behavior. If you already set any of
`HSTS`, `XFRAME_OPTIONS`, `XCONTENT_TYPE`, `REFERRER_POLICY`, `PERMISSIONS_POLICY`, or
`CONTENT_SECURITY_POLICY` via environment variables, skip this section.

Add the following `header` block inside your existing site block:

```caddyfile
your.domain.example {
	header {
		Strict-Transport-Security "max-age=31536000; includeSubDomains"
		X-Frame-Options "DENY"
		X-Content-Type-Options "nosniff"
		Referrer-Policy "strict-origin-when-cross-origin"
		Permissions-Policy "camera=(), microphone=(), geolocation=()"
		-Server
	}

	reverse_proxy localhost:8080
}
```

**HSTS is sticky and hard to undo.** `max-age=31536000` (1 year) with `includeSubDomains` instructs every browser that has visited this domain to refuse plain HTTP for the domain **and all its subdomains** for a full year. This cannot be reverted server-side quickly (you must serve `max-age=0` and wait for each client to revisit). Only keep `includeSubDomains` if every current and future subdomain serves valid HTTPS. If unsure, start with a short value such as `max-age=300` and increase it after confirming HTTPS works everywhere. Do **not** add `preload` unless you understand it is near-permanent and requires separate submission to the browser preload list.

The `-Server` directive removes the `Server` response header that Caddy adds by default.
Caddy handles WebSocket upgrades and SSE connections automatically. No additional configuration
is required for Open WebUI's streaming responses.

The `Permissions-Policy` example above is a deny-list of common sensitive features, not an exhaustive
list. If your deployment uses voice input or webcam capture, set the relevant directive to `(self)`
instead of removing it.

**Content-Security-Policy.** CSP is highly deployment-specific (custom plugins, embedded iframes,
external model providers, Artifacts/code rendering, voice input), so this section intentionally does
**not** ship a ready-made proxy-layer CSP. Set CSP via the `CONTENT_SECURITY_POLICY` environment
variable and use `CONTENT_SECURITY_POLICY_REPORT_ONLY` to derive a working policy before enforcing it.
See [Security Headers](/getting-started/advanced-topics/hardening#security-headers).

Verify headers are applied after reloading Caddy:

```bash
curl -sI https://your.domain.example | grep -E "Strict-Transport|X-Frame|X-Content|Referrer|Permissions"
```

## Updating Open WebUI

I wanted to include a quick note on how to update Open WebUI without losing your data. Since we're using a volume to store the data, you can simply pull the latest image and restart the container.

### Stopping Open WebUI

First we need to stop and remove the existing container:

```bash
docker rm -f open-webui
```

### Pulling the latest image

Then you can start the container again:

```bash
docker pull ghcr.io/open-webui/open-webui:main
```

### Starting Open WebUI

Now you can start the Open WebUI container again:

```bash
docker compose up -d
```
