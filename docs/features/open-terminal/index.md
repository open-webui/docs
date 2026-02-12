---
sidebar_position: 5
title: "Open Terminal"
---

# ⚡ Open Terminal

:::info

This page is up-to-date with Open Terminal release version [v0.1.10](https://github.com/open-webui/open-terminal).

:::

## Overview

[Open Terminal](https://github.com/open-webui/open-terminal) is a lightweight API for running shell commands remotely — with real-time streaming and secure access. When connected to Open WebUI as a [Tool](/features/plugin/tools), it gives models full shell access, file management, and the ability to execute arbitrary commands in an isolated environment.

Unlike Pyodide (browser-based, limited libraries) or Jupyter (shared environment, no per-user isolation), Open Terminal runs in its own Docker container with full OS-level capabilities. This makes it ideal for tasks that require:

- Installing and running any software package or language
- Working with system tools like ffmpeg, pandoc, git, etc.
- Running multi-step build, analysis, or data processing pipelines
- Managing files with upload and download support

:::warning
Open Terminal provides **unrestricted shell access** to the environment it runs in. In production deployments, always run it inside a Docker container with appropriate resource limits. Never run it on bare metal in a shared or untrusted environment.
:::

## Getting Started

### Docker (Recommended)

```bash
docker run -d --name open-terminal --restart unless-stopped -p 8000:8000 -e OPEN_TERMINAL_API_KEY=your-secret-key ghcr.io/open-webui/open-terminal
```

If no API key is provided, one is auto-generated and printed on startup (`docker logs open-terminal`).

The Docker image is based on Python 3.12 and comes pre-installed with a rich set of tools:

| Category | Included |
| :--- | :--- |
| **Core utilities** | coreutils, findutils, grep, sed, gawk, diffutils, patch, less, file, tree, bc |
| **Networking** | curl, wget, net-tools, iputils-ping, dnsutils, netcat, socat, telnet, openssh-client, rsync |
| **Editors** | vim, nano |
| **Version control** | git |
| **Build tools** | build-essential, cmake, make |
| **Languages** | Python 3.12, Perl, Ruby, Lua 5.4 |
| **Data processing** | jq, xmlstarlet, sqlite3 |
| **Compression** | zip, unzip, tar, gzip, bzip2, xz, zstd, p7zip |
| **System** | procps, htop, lsof, strace, sysstat, sudo, tmux, screen |
| **Python libraries** | numpy, pandas, scipy, scikit-learn, matplotlib, seaborn, plotly, jupyter, ipython, requests, beautifulsoup4, lxml, sqlalchemy, psycopg2, pyyaml, toml, jsonlines, tqdm, rich |

### Build from Source

```bash
docker build -t open-terminal .
docker run -p 8000:8000 open-terminal
```

### pip Install (Bare Metal)

```bash
pip install open-terminal
open-terminal run --host 0.0.0.0 --port 8000 --api-key your-secret-key
```

:::warning
Running bare metal gives the model shell access to your actual machine. Only use this for local development or testing.
:::

### Docker Compose (with Open WebUI)

```yaml title="docker-compose.yml"
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:latest
    container_name: open-webui
    ports:
      - "3000:8080"
    volumes:
      - open-webui:/app/backend/data

  open-terminal:
    image: ghcr.io/open-webui/open-terminal
    container_name: open-terminal
    ports:
      - "8000:8000"
    environment:
      - OPEN_TERMINAL_API_KEY=your-secret-key
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: "2.0"

volumes:
  open-webui:
```

## Configuration

| CLI Option | Default | Environment Variable | Description |
| :--- | :--- | :--- | :--- |
| `--host` | `0.0.0.0` | — | Bind address |
| `--port` | `8000` | — | Bind port |
| `--api-key` | Auto-generated | `OPEN_TERMINAL_API_KEY` | Bearer API key for authentication |

When no API key is provided, Open Terminal generates a random key using a cryptographically secure token and prints it to the console on startup.

## Connecting to Open WebUI

Open Terminal is a FastAPI application and automatically exposes an OpenAPI specification at `/openapi.json`. This means it works out of the box as an [OpenAPI Tool Server](/features/plugin/tools/openapi-servers/open-webui) — no manual tool creation required.

- **As a User Tool Server**: Add it in **Settings → Tools** to connect directly from your browser. Ideal for personal or local instances.
- **As a Global Tool Server**: Add it in **Admin Settings → Tools** to make it available to all users across the deployment.

For step-by-step instructions with screenshots, see the [OpenAPI Tool Server Integration Guide](/features/plugin/tools/openapi-servers/open-webui).

## API Reference

All endpoints except `/health` and temporary download/upload links require Bearer token authentication.

Interactive API documentation (Swagger UI) is available at `http://localhost:8000/docs` when the server is running.

### Execute a Command

**`POST /execute`**

Runs a shell command and returns the result. Supports pipes, chaining (`&&`, `||`, `;`), and redirections.

:::tip
The `/execute` endpoint description in the OpenAPI spec automatically includes live system metadata — OS, hostname, current user, default shell, Python version, and working directory. When Open WebUI discovers this tool via the OpenAPI spec, models see this context in the tool description and can adapt their commands accordingly.
:::

**Request body:**

| Field | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `command` | string | (required) | Shell command to execute |
| `timeout` | number | `30` | Max execution time in seconds. Process is killed if exceeded. Set to `null` to disable. |

**Query parameter:**

| Parameter | Default | Description |
| :--- | :--- | :--- |
| `stream` | `false` | If `true`, stream output as JSONL instead of waiting for completion |

**Synchronous response:**

```bash
curl -X POST http://localhost:8000/execute \
  -H "Authorization: Bearer <api-key>" \
  -H "Content-Type: application/json" \
  -d '{"command": "echo hello"}'
```

```json
{"exit_code": 0, "stdout": "hello\n", "stderr": ""}
```

Exit code `-1` indicates the command was killed due to timeout.

**Streaming response:**

```bash
curl -X POST "http://localhost:8000/execute?stream=true" \
  -H "Authorization: Bearer <api-key>" \
  -H "Content-Type: application/json" \
  -d '{"command": "for i in 1 2 3; do echo $i; sleep 1; done"}'
```

Streams as JSONL (`application/x-ndjson`):

```jsonl
{"type": "stdout", "data": "1\n"}
{"type": "stdout", "data": "2\n"}
{"type": "stdout", "data": "3\n"}
{"type": "exit", "data": 0}
```

### Upload a File

**`POST /files/upload`**

Save a file to the container filesystem. Provide either a `url` to fetch remotely, or send the file directly via multipart form data.

**From URL:**
```bash
curl -X POST "http://localhost:8000/files/upload?url=https://example.com/data.csv&dir=/tmp" \
  -H "Authorization: Bearer <api-key>"
```

**Direct upload:**
```bash
curl -X POST "http://localhost:8000/files/upload?dir=/tmp" \
  -H "Authorization: Bearer <api-key>" \
  -F "file=@local_file.csv"
```

**Via temporary upload link (no auth needed to upload):**
```bash
# 1. Generate an upload link
curl -X POST "http://localhost:8000/files/upload/link?dir=/tmp" \
  -H "Authorization: Bearer <api-key>"
# → {"url": "http://localhost:8000/files/upload/a1b2c3d4..."}

# 2. Upload to the link (no auth required)
curl -X POST "http://localhost:8000/files/upload/a1b2c3d4..." \
  -F "file=@local_file.csv"
```

Opening a temporary upload link in a browser shows a simple file picker form — useful for manual uploads without curl.

The filename is automatically derived from the uploaded file or the URL.

### Download a File

**`GET /files/download/link`**

Returns a temporary download URL for a file. The link expires after 5 minutes and requires no authentication to use.

```bash
curl "http://localhost:8000/files/download/link?path=/tmp/output.csv" \
  -H "Authorization: Bearer <api-key>"
```

```json
{"url": "http://localhost:8000/files/download/a1b2c3d4..."}
```

### Health Check

**`GET /health`**

Returns service status. No authentication required.

```json
{"status": "ok"}
```

## Security Considerations

- **Always use Docker** in production. Running Open Terminal on bare metal exposes the host system to any command the model generates.
- **Set an API key**. Without one, anyone who can reach the port has full shell access. If you don't provide one, the auto-generated key is printed once at startup — save it.
- **Use resource limits**. Apply `--memory` and `--cpus` flags in Docker to prevent runaway processes from consuming host resources.
- **Network isolation**. Place the Open Terminal container on an internal Docker network that only Open WebUI can reach, rather than exposing it to the public internet.
- **Container is ephemeral**. Files inside the container are lost when the container is removed. Mount a volume if you need persistence.

## Further Reading

- [Open Terminal GitHub Repository](https://github.com/open-webui/open-terminal)
- [Interactive API Documentation](http://localhost:8000/docs) (available when running locally)
- [Python Code Execution](/features/chat-features/code-execution/python) — Pyodide and Jupyter backends
- [Jupyter Integration Tutorial](/tutorials/integrations/jupyter) — Setting up Jupyter as a code execution backend
- [Skills](/features/workspace/skills) — Using skills with code execution
