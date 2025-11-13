---
sidebar_position: 202
title: "HTTPS using Caddy"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

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

Create a `docker-compose.yml` file in the `~/open-webui` directory. I've left in a commented section for setting some environment varibles for Qdrant, but you can follow that for any other [environment variables](https://docs.openwebui.com/getting-started/env-configuration) you might need to set.

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
