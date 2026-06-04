---
sidebar_position: 52
title: "Traefik Reverse Proxy"
---

# 🔗 Using Traefik as a Reverse Proxy

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

## What is Traefik?

[Traefik](https://traefik.io/) is a modern HTTP reverse proxy and load balancer that integrates with Docker, Kubernetes, and other infrastructure components. It automatically discovers services and configures routing, TLS certificates, and middleware — making it an excellent choice for exposing Open WebUI securely behind a production-grade reverse proxy.

## When do you need it?

Running Open WebUI behind Traefik is recommended for production deployments where you need:
- **HTTPS with automatic Let's Encrypt certificates** — Traefik handles ACME certificate provisioning and renewal
- **Subdomain-based routing** — serve Open WebUI under `chat.yourdomain.com` instead of a port
- **Middleware stack** — combine authentication, rate limiting, CORS, and security headers
- **Docker-native service discovery** — Traefik auto-detects Open WebUI when running alongside it in Docker
- **Multi-service architecture** — run Open WebUI alongside Ollama, an embedding model, and monitoring behind the same proxy

## Prerequisites

- Docker and Docker Compose installed
- A domain name pointing to your server (e.g., `chat.yourdomain.com`)
- Ports 80 and 443 accessible from the internet
- Traefik v3 (latest stable)

## Setting up Traefik with Open WebUI

### Step 1: Create a Docker Compose File

Create a new file named `docker-compose.yml` with the following configuration:

```yml
services:
  traefik:
    image: traefik:v3.3
    container_name: traefik
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik.yml:/traefik.yml:ro
      - ./acme.json:/acme.json
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.dashboard.rule=Host(`traefik.yourdomain.com`)"
      - "traefik.http.routers.dashboard.service=api@internal"
      - "traefik.http.routers.dashboard.middlewares=auth"
      - "traefik.http.middlewares.auth.basicauth.users=${TRAEFIK_USER}:${TRAEFIK_PASSWORD_HASH}"

  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    container_name: open-webui
    restart: unless-stopped
    volumes:
      - open-webui-data:/app/backend/data
    env_file:
      - stack.env
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.owui.rule=Host(`chat.yourdomain.com`)"
      - "traefik.http.routers.owui.entrypoints=websecure"
      - "traefik.http.routers.owui.tls=true"
      - "traefik.http.routers.owui.tls.certresolver=letsencrypt"
      - "traefik.http.services.owui.loadbalancer.server.port=8080"

volumes:
  open-webui-data:
```

### Step 2: Create the Traefik Static Configuration

Create a file named `traefik.yml`:

```yml
global:
  sendAnonymousUsage: false

api:
  dashboard: true

entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
          permanent: true
  websecure:
    address: ":443"

certificatesResolvers:
  letsencrypt:
    acme:
      email: your-email@example.com
      storage: acme.json
      httpChallenge:
        entryPoint: web

providers:
  docker:
    exposedByDefault: false
```

### Step 3: Create the `acme.json` File

```bash
touch acme.json
chmod 600 acme.json
```

Traefik will store Let's Encrypt certificates here automatically.

### Step 4: Create a `stack.env` File

Create a file named `stack.env` with the Open WebUI configuration:

```env
# Required: set a strong JWT secret
JWT_SECRET=your-strong-jwt-secret-here

# Optional: set up Ollama backend if standalone
# OLLAMA_BASE_URL=http://ollama:11434

# Enable web search
# WEBUI_SECRET_KEY=your-webui-secret
```

### Step 5: Generate the Traefik Dashboard Password

```bash
htpasswd -nb admin your-strong-password
```

Copy the output (e.g., `admin:$2y$05$...`) into your shell environment:

```bash
export TRAEFIK_USER=admin
export TRAEFIK_PASSWORD_HASH='$2y$05$...'
```

### Step 6: Start the Stack

```bash
docker compose up -d
```

### Step 7: Verify

1. Open `https://chat.yourdomain.com` — Open WebUI loads with a valid TLS certificate
2. Open `https://traefik.yourdomain.com` — Traefik dashboard (authenticated)
3. Check certificate auto-renewal with:

```bash
docker compose logs traefik | grep -i "acme\|certificate"
```

## Advanced Configuration

### Add Rate Limiting

Add labels to the `open-webui` service:

```yml
labels:
  - "traefik.http.middlewares.owui-ratelimit.ratelimit.average=100"
  - "traefik.http.middlewares.owui-ratelimit.ratelimit.burst=50"
  - "traefik.http.routers.owui.middlewares=owui-ratelimit"
```

### Configure CORS for API Access

If you access the Open WebUI API from web apps:

```yml
labels:
  - "traefik.http.middlewares.owui-cors.headers.accesscontrolallowmethods=GET,POST,OPTIONS"
  - "traefik.http.middlewares.owui-cors.headers.accesscontrolalloworiginlist=https://app.yourdomain.com"
  - "traefik.http.middlewares.owui-cors.headers.accesscontrolmaxage=100"
  - "traefik.http.middlewares.owui-cors.headers.addvaryheader=true"
```

### Run with Ollama Alongside

Add an Ollama container to the compose file:

```yml
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    restart: unless-stopped
    volumes:
      - ollama-data:/root/.ollama
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]

volumes:
  ollama-data:
```

Then set `OLLAMA_BASE_URL=http://ollama:11434` in `stack.env`.

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| 404 on `chat.yourdomain.com` | Router rule mismatch | Verify `Host()` matches your domain exactly |
| Certificate not issued | Port 80 unreachable | Ensure `:80` is open and the HTTP challenge entrypoint is `web` |
| Traefik dashboard 401 | Wrong bcrypt hash | Regenerate with `htpasswd -nb` and ensure `$` signs are escaped |
| Open WebUI shows "Connection refused" | Container not healthy | Check `docker compose ps` and `docker compose logs open-webui` |
| WebSocket disconnects | Missing proxy headers | Add `traefik.http.middlewares.owui-headers.customrequestheaders.Upgrade=websocket` |

## Removing the Stack

```bash
docker compose down
docker volume rm open-webui-data  # warning: removes chat history
rm acme.json traefik.yml stack.env docker-compose.yml
```

## References

- [Traefik Documentation](https://doc.traefik.io/traefik/)
- [Open WebUI Docker Deployment](/getting-started/advanced-topics/scaling)
- [Let's Encrypt with Traefik](https://doc.traefik.io/traefik/https/acme/)
