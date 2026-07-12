---
title: Docker
sidebar_position: 2
---

# Docker

Run Open WebUI Computer from the official image:

```bash
docker run --rm -it \
  -p 8000:8000 \
  -v cptr-data:/data \
  -v "$PWD:/workspace" \
  -w /workspace \
  ghcr.io/open-webui/computer:latest
```

Then open the URL printed in the logs, usually `http://localhost:8000/?token=...`. The token works once, while no user exists, and creates your admin account.

- `-v cptr-data:/data`: app state (database, config, uploads) in a named volume. Keep this mount or you lose your account and settings on every restart.
- `-v "$PWD:/workspace"`: mounts your current project into the container so Open WebUI Computer can work on it.

## docker-compose.yaml

For a host that should keep running:

```yaml
services:
  cptr:
    image: ghcr.io/open-webui/computer:latest
    container_name: cptr
    ports:
      - "8000:8000"
    volumes:
      - cptr-data:/data
      - ~/projects:/projects
      # Mount as many directories as you like; each mounted
      # path can be added as a workspace in the UI:
      # - ~/notes:/notes
      # - /srv/sites:/sites
    restart: unless-stopped

volumes:
  cptr-data:
```

```bash
docker compose up -d
docker compose logs cptr
```

The first-run setup URL with its token is in the logs (`docker logs cptr` works too). Inside the app, add `/projects` (or any other mounted path) as a workspace.

## How the image works

The container runs `cptr run --host 0.0.0.0 --headless` and sets `CPTR_DATA_DIR=/data`, so it listens on all container interfaces, never tries to open a browser, and keeps everything stateful (SQLite database, `config.toml`, uploads, logs) under `/data`. The image includes all optional feature groups, so no extras are needed.

The `:dev` tag tracks the `main` branch if you want the latest changes; pin `:latest` or a release tag for stability.

:::info Bind-mounting `/data`
If you bind-mount a host directory to `/data` instead of using a named volume, that directory must be writable by the container user: SQLite has to create and update `/data/app.db`, and host directory permissions override the image's built-in `/data` ownership. A named volume avoids the problem entirely.
:::

## Upgrading

Pull the new image and recreate the container with the same `/data` volume:

```bash
docker compose pull
docker compose up -d
```

Or for plain `docker run`: stop the container, `docker pull ghcr.io/open-webui/computer:latest`, then start it again with the same `-v cptr-data:/data` flag. Database migrations run automatically at startup; no manual step is needed. Back up the volume first for major upgrades: see [data and backups](/ecosystem/computer/operate/data-and-backups).
