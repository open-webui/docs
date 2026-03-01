---
sidebar_position: 3
title: "Open Terminal"
---

# ⚡ Open Terminal

## Overview

[Open Terminal](https://github.com/open-webui/open-terminal) gives your AI a real shell. Instead of running code in a sandboxed browser snippet, the model gets a full operating system where it can install software, run code in any language, manage files, and execute multi-step workflows — all from your chat.

When connected to Open WebUI, you also get a **built-in file browser** right in the chat interface — browse directories, preview files, edit code, upload and download, all without leaving the conversation.

:::warning
Open Terminal provides **unrestricted shell access** to the environment it runs in. In production deployments, always run it inside a Docker container with appropriate resource limits. Never expose it on bare metal in a shared or untrusted environment.
:::

## Why Open Terminal?

Open WebUI already supports browser-based Python execution via [Pyodide](/features/chat-conversations/chat-features/code-execution/python) and Jupyter — but those environments are limited. Open Terminal removes those limits:

- **Full OS access** — install any package, run any language (Python, Node.js, Rust, Go, C++, etc.), use system tools like `ffmpeg`, `git`, `pandoc`, `curl`, and more.
- **Real file system** — the AI can read, write, edit, and search files on disk. It can work on actual projects, not throwaway snippets.
- **Built-in file browser** — browse, preview, edit, create, delete, upload, and download files right from the chat UI. Supports inline preview of images, PDFs, CSV/TSV tables, and Markdown.
- **Persistent storage** — with a Docker volume, files survive container restarts. Your AI's work doesn't disappear.
- **Background processes** — start long-running tasks (builds, training runs, servers) and check back on them later.
- **Two deployment modes**:
  - **Docker (sandboxed)** — isolated container with a full toolkit pre-installed. Safe playground for AI agents.
  - **Bare metal** — runs directly on your machine with access to your real files, tools, and environment. Perfect for local development and personal automation.

## Getting Started

### Docker (Recommended)

```bash
docker run -d --name open-terminal --restart unless-stopped -p 8000:8000 -v open-terminal:/home/user -e OPEN_TERMINAL_API_KEY=your-secret-key ghcr.io/open-webui/open-terminal
```

That's it — you're up and running at `http://localhost:8000`.

The `-v open-terminal:/home/user` flag creates a **named volume** so files in the user's home directory survive container restarts. The container runs as a **non-root user** with passwordless `sudo` available when needed.

:::tip
If you don't set an API key, one is generated automatically. Grab it with `docker logs open-terminal`.
:::

The Docker image comes pre-installed with a broad toolkit:

| Category | Included |
| :--- | :--- |
| **Core utilities** | coreutils, findutils, grep, sed, gawk, diffutils, patch, less, file, tree, bc |
| **Networking** | curl, wget, net-tools, iputils-ping, dnsutils, netcat, socat, openssh-client, rsync |
| **Editors** | vim, nano |
| **Version control** | git |
| **Build tools** | build-essential, cmake, make |
| **Languages** | Python 3.12, Perl, Ruby, Lua 5.4 |
| **Data processing** | jq, xmlstarlet, sqlite3 |
| **Compression** | zip, unzip, tar, gzip, bzip2, xz, zstd, p7zip |
| **System** | procps, htop, lsof, strace, sysstat, sudo, tmux, screen |
| **Python libraries** | numpy, pandas, scipy, scikit-learn, matplotlib, seaborn, plotly, jupyter, ipython, requests, beautifulsoup4, lxml, sqlalchemy, pyyaml, rich, and more |

You can customize the image by forking the repo and editing the [Dockerfile](https://github.com/open-webui/open-terminal/blob/main/Dockerfile).

### Bare Metal

No Docker? No problem. Open Terminal is a standard Python package:

```bash
# One-liner with uvx (no install needed)
uvx open-terminal run --host 0.0.0.0 --port 8000 --api-key your-secret-key

# Or install with pip
pip install open-terminal
open-terminal run --host 0.0.0.0 --port 8000 --api-key your-secret-key
```

On bare metal, commands run directly on your machine with your user's permissions — so the AI has access to your real files, your real tools, and your real environment. This is great for local development and personal automation, but **don't do this in a shared or production environment**.

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
    volumes:
      - open-terminal:/home/user
    environment:
      - OPEN_TERMINAL_API_KEY=your-secret-key
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: "2.0"

volumes:
  open-webui:
  open-terminal:
```

:::tip
When both services run in the same Docker Compose stack, use the **service name** as the hostname. For the admin-configured Open Terminal URL in Open WebUI, use `http://open-terminal:8000` — not `localhost:8000`.
:::

### Configuration

| CLI Option | Default | Environment Variable | Description |
| :--- | :--- | :--- | :--- |
| `--host` | `0.0.0.0` | — | Bind address |
| `--port` | `8000` | — | Bind port |
| `--cwd` | Current directory | — | Working directory for the server process |
| `--api-key` | Auto-generated | `OPEN_TERMINAL_API_KEY` | Bearer API key for authentication |

When no API key is provided, Open Terminal generates a random key and prints it to the console on startup.

## Connecting to Open WebUI

There are two ways to connect Open Terminal to Open WebUI. Make sure to add it under the **Open Terminal** section in integrations settings — this is a dedicated integration, not a generic tool server.

### Admin-Configured (Recommended)

Administrators can set up Open Terminal connections that are available to all users (or specific groups). All requests are **proxied through the Open WebUI backend**, which means the terminal's API key never reaches the browser and access control is enforced server-side.

1. Go to **Admin Settings → Integrations**
2. Scroll to the **Open Terminal** section
3. Click **+** to add a new connection
4. Enter the **URL** (e.g. `http://open-terminal:8000`) and **API key**
5. Choose an **authentication type** (Bearer is recommended for most setups)
6. Optionally restrict access to specific groups via **access grants**

Each connection has an enable/disable toggle. You can add multiple terminal connections and control them independently.

:::info
Terminal connections can also be pre-configured via the [`TERMINAL_SERVER_CONNECTIONS`](/reference/env-configuration#terminal_server_connections) environment variable.
:::

#### Authentication Types

| Type | Description |
| :--- | :--- |
| **Bearer** | Sends the configured API key as a `Bearer` token to the terminal server. Default and recommended. |
| **Session** | Forwards the user's Open WebUI session credentials. Useful when the terminal validates against the same auth backend. |
| **OAuth** | Forwards the user's OAuth access token. Requires OAuth to be configured in Open WebUI. |
| **None** | No authentication header. Only for terminals on a trusted internal network. |

#### Access Control

By default, all users can access admin-configured terminals. To restrict access, add **access grants** to limit to specific [user groups](/features/access-security/rbac/groups).

### User-Configured (Direct)

Individual users can add their own terminals under **Settings → Integrations → Open Terminal**. This is useful for personal terminals running on the user's local machine.

1. Go to **Settings → Integrations**
2. Scroll to the **Open Terminal** section
3. Click **+** to add a new connection
4. Enter the **URL** and **API key**

:::note
User-configured terminals connect **directly from the browser**. The terminal must be reachable from the user's machine, and the API key is stored in the browser. For production deployments, prefer the admin-configured approach.
:::

### Networking Tips

Admin-configured and user-configured connections work differently at the network level — **the same URL can work for one but fail for the other.**

| Connection Type | Request Origin | What `localhost` Means |
| :--- | :--- | :--- |
| **Admin (System)** | Open WebUI **backend server** | The machine/container running Open WebUI |
| **User (Direct)** | User's **browser** | The machine running the browser |

**Common issues:**

| Symptom | Likely Cause | Fix |
| :--- | :--- | :--- |
| **502 Bad Gateway** | Backend can't reach the terminal URL | Use a URL the backend can resolve — container name, internal IP, or `host.docker.internal` |
| **User connection works, admin doesn't** | URL resolves from browser but not from backend container | Use different URLs: public URL for user connections, internal URL for admin |
| **Connection timeout** | Firewall or network isolation | Ensure both containers are on the same Docker network |

:::tip Quick Test
To verify the backend can reach your terminal, exec into the Open WebUI container and test:

```bash
curl -s http://open-terminal:8000/health
```

If this returns `{"status": "ok"}`, the backend can reach it.
:::

## What You Get

Once a terminal is connected, the chat interface gains several features:

### Terminal Selector

A **terminal dropdown** appears in the message input area. Admin-configured terminals appear under **System**, user-configured ones under **Direct**. Click to select a terminal — click again to deselect. Only one terminal can be active at a time.

Selecting a terminal automatically activates its tools for the current chat and opens the file browser.

### Always-On Tools

When a terminal is selected, all Open Terminal capabilities are **automatically available** to the model — no need to manually pick tools. The AI can:

- Run shell commands in any language
- Install packages and software
- Read, write, and edit files
- Search file contents and filenames
- Start and monitor background processes
- Send input to interactive commands (REPLs, prompts)

### File Browser

The chat controls panel gains a **Files** tab when a terminal is active:

- **Browse** directories on the remote filesystem
- **Preview** text files, images, PDFs, CSV/TSV (as formatted tables), and Markdown — with a source/preview toggle
- **Edit** text files inline with save/cancel
- **Create** files and folders
- **Delete** files and folders
- **Download** files to your local machine
- **Upload** files by dragging and dropping onto the directory listing
- **Attach** files to the current chat

The file browser remembers your last-visited directory and automatically reloads when you switch terminals.

## Security

- **Always use Docker in production.** Bare metal exposes your host to any command the model generates.
- **Set an API key.** Without one, anyone who can reach the port has full shell access.
- **Use resource limits.** Apply `--memory` and `--cpus` flags in Docker to prevent runaway processes.
- **Network isolation.** Place the terminal container on an internal Docker network that only Open WebUI can reach.
- **Use named volumes.** Files inside the container are lost when removed — the default `docker run` command mounts a volume at `/home/user` for persistence.

## Further Reading

- [Open Terminal GitHub Repository](https://github.com/open-webui/open-terminal) — source code, issue tracker, and full API documentation
- [Interactive API Docs](http://localhost:8000/docs) — Swagger UI available when your instance is running
- [Python Code Execution](/features/chat-conversations/chat-features/code-execution/python) — Pyodide and Jupyter backends
- [Terminals](https://github.com/open-webui/terminals) — multi-tenant: provisions isolated Open Terminal containers per user
