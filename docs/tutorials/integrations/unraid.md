---
sidebar_position: 34
title: "Unraid Deployment (Beginner-Safe)"
---

# Open WebUI on Unraid (Beginner-Safe)

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the [contributing tutorial](/tutorials/tips/contributing-tutorial).

:::

This guide is for first-time Unraid users who want a stable Docker deployment with persistent data and safe upgrades.

## What You Will Do

- Create the Open WebUI container in Unraid.
- Configure persistent storage for `/app/backend/data`.
- Connect Open WebUI to Ollama.
- Update Open WebUI without losing data.
- Troubleshoot reverse-proxy and persistence issues.

## Before You Start

- Docker is enabled in Unraid.
- You have a persistent appdata path, for example: `/mnt/user/appdata/open-webui`.
- Optional: Ollama is running either on:
  - the Unraid host, or
  - another reachable machine.

:::important
Persist `/app/backend/data` to a host path. If you skip this, chats/settings can disappear after container recreation.
:::

## 1. Create the Container in Unraid

In **Docker > Add Container**, use:

| Field | Value |
| --- | --- |
| Name | `open-webui` |
| Repository | `ghcr.io/open-webui/open-webui:main` |
| Network Type | `bridge` |
| Restart Policy | `always` |
| Container Port | `8080` |
| Host Port | `3000` (or another free port) |

Add a path mapping:

| Config Type | Container Path | Host Path |
| --- | --- | --- |
| Path | `/app/backend/data` | `/mnt/user/appdata/open-webui` |

## 2. Configure Ollama Connectivity

Choose one setup.

### Ollama on the Unraid Host

- Extra parameters:
  - `--add-host=host.docker.internal:host-gateway`
- Environment variable:
  - `OLLAMA_BASE_URL=http://host.docker.internal:11434`

### Ollama on Another Machine

- Environment variable:
  - `OLLAMA_BASE_URL=http://<ollama-lan-ip>:11434`

### Ollama in Another Container

- Put both containers on the same custom Docker network.
- Set:
  - `OLLAMA_BASE_URL=http://<ollama-container-name>:11434`

## 3. First Launch Validation

1. Start the container.
2. Open `http://<unraid-ip>:3000`.
3. Complete initial admin setup.
4. Open **Settings > Admin Settings > Connections** and verify the Ollama endpoint.
5. Confirm models appear in the model selector.

## 4. Persistent Volume Notes

- Open WebUI state is stored in `/app/backend/data`.
- Set a fixed `WEBUI_SECRET_KEY` in your Unraid template and keep it the same across recreates to avoid unnecessary session invalidation.
- Keep host mapping consistent across updates/recreates.
- Use a directory mapping, not a file mapping.
- If persistence fails, check folder permissions for `/mnt/user/appdata/open-webui`.

## 5. Upgrade Steps (Safe Workflow)

1. Back up `/mnt/user/appdata/open-webui`.
2. Ensure your template keeps the same `WEBUI_SECRET_KEY`.
3. Update/pull your Open WebUI image tag.
4. Recreate using the same template and the same `/app/backend/data` mapping.
5. Verify chats/settings are intact.
6. If needed, roll back to the previous image and restore backup.

For broader update options, see [Updating Open WebUI](/getting-started/updating).

## Troubleshooting

### Cannot Reach Ollama

Symptoms:
- `Connection error` in Open WebUI
- models do not load

Checks:
- Confirm `OLLAMA_BASE_URL` is reachable from inside the Open WebUI container.
- If using host Ollama, confirm `--add-host=host.docker.internal:host-gateway` is present.
- If `host.docker.internal` fails, use your Unraid host LAN IP.

### `host.docker.internal` Does Not Resolve

- Add `--add-host=host.docker.internal:host-gateway`.
- Restart container after saving template changes.
- Fallback: `OLLAMA_BASE_URL=http://<unraid-lan-ip>:11434`.

### Reverse Proxy Subpath Problems (`/openwebui`)

Symptoms:
- login/static assets return `404`
- WebSocket disconnects or stuck loading states

Checks:
- Ensure proxy forwards WebSocket upgrade headers.
- Ensure subpath routing is consistent (strip or rewrite prefix before forwarding).
- Set `WEBUI_URL` without trailing slash, for example:
  - `WEBUI_URL=https://example.com/openwebui`
- If subpath remains unstable, prefer a subdomain:
  - `WEBUI_URL=https://ai.example.com`

For broader reverse-proxy debugging, see [Connection Errors](/troubleshooting/connection-error).

### Data Missing After Update/Redo

- Verify mapping is exactly `/app/backend/data` to your persistent host folder.
- Confirm no typo created a second empty folder.
- Confirm Unraid permissions allow read/write.
