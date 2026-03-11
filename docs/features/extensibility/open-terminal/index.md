---
sidebar_position: 3
title: "Open Terminal"
---

# ⚡ Open Terminal

## Overview

[Open Terminal](https://github.com/open-webui/open-terminal) gives your AI a real computer. Instead of running code in a sandboxed browser snippet, the model gets a full operating system where it can install software, run code in any language, manage files, and execute multi-step workflows, all from your chat.

When connected to Open WebUI, every terminal capability is **automatically available** to the model with no manual setup per chat. You also get a **built-in file browser** right in the conversation, so you can see, edit, and manage everything the AI creates.

:::note Single-instance design
Open Terminal is a **single-instance** tool — one container (or process) serving one or a handful of users. It includes a [multi-user mode](#multi-user-mode) for small teams, but all users share the same container's CPU, memory, and disk. For deployments with many concurrent users or compute-intensive workloads, use **[Terminals](https://github.com/open-webui/terminals)** instead, which provisions a separate isolated container per user with automatic lifecycle management. Terminals requires an [enterprise license](/enterprise).
:::

## What Can You Do With It?

### A developer working on a project

> *"Clone this repo, install the dependencies, and run the test suite"*

The AI runs real `git`, `npm`, and `pytest` commands in the terminal. You watch the output, browse the cloned files in the file browser, and fix a failing test by editing the file inline, all without leaving the chat.

On **bare metal**, the AI works directly on your actual project directory. On **Docker**, it gets its own isolated copy.

### A data analyst processing files

> *"Here's a CSV of sales data. Clean the headers, remove duplicates, and make a chart of revenue by quarter"*

Drop the file onto the file browser (drag-and-drop upload), and the AI picks it up. It installs pandas, cleans the data, generates a matplotlib chart, and saves the output. You preview the chart in the file browser, then download the cleaned CSV and the PNG to your local machine.

### A student or researcher exploring a new tool

> *"Install ffmpeg and convert this video to a GIF, keeping only the first 10 seconds"*

The AI runs `apt-get install ffmpeg` (in Docker, it has `sudo`), then runs the conversion. You upload the video through the file browser, and download the resulting GIF. The AI has access to the full OS, so any tool you can install on Linux, it can use.

### A team lead setting up shared environments

An admin configures one or more Open Terminal instances and makes them available to the whole team (or specific groups) through Open WebUI. Users pick a terminal from a dropdown and start working. They never see API keys or server URLs. All requests go through the Open WebUI backend, so the terminal only needs to be reachable from the server, not from every user's machine.

## Getting Started

### Docker (Recommended)

Run Open Terminal in an isolated container with a full toolkit pre-installed: Python, git, build tools, data science libraries, and more. Great for giving AI agents a safe playground without touching your host system.

```bash
docker run -d --name open-terminal --restart unless-stopped -p 8000:8000 -v open-terminal:/home/user -e OPEN_TERMINAL_API_KEY=your-secret-key ghcr.io/open-webui/open-terminal
```

You're up and running at `http://localhost:8000`.

The `-v open-terminal:/home/user` flag creates a **named volume** so files survive container restarts. The container runs as a non-root user with passwordless `sudo` available when needed.

:::tip
If you don't set an API key, one is generated automatically. Grab it with `docker logs open-terminal`.
:::

<details>
<summary><b>Pre-installed tools and libraries</b></summary>

| Category | Included |
| :--- | :--- |
| **Core utilities** | coreutils, findutils, grep, sed, gawk, diffutils, patch, less, file, tree, bc |
| **Networking** | curl, wget, net-tools, iputils-ping, dnsutils, netcat, socat, openssh-client, rsync |
| **Editors** | vim, nano |
| **Version control** | git |
| **Build tools** | build-essential, cmake, make |
| **Languages** | Python 3.12, Perl, Ruby, Lua 5.4 |
| **Data processing** | jq, xmlstarlet, sqlite3 |
| **Media & documents** | ffmpeg, pandoc, imagemagick, texlive-latex-base |
| **Compression** | zip, unzip, tar, gzip, bzip2, xz, zstd, p7zip |
| **System** | procps, htop, lsof, strace, sysstat, sudo, tmux, screen |
| **Container tools** | Docker CLI, Docker Compose, Docker Buildx |
| **Python libraries** | numpy, pandas, scipy, scikit-learn, matplotlib, seaborn, plotly, jupyter, ipython, requests, beautifulsoup4, lxml, sqlalchemy, pyyaml, rich, openpyxl, weasyprint, python-docx, python-pptx, pypdf, csvkit, and more |

You can customize the image by forking the repo and editing the [Dockerfile](https://github.com/open-webui/open-terminal/blob/main/Dockerfile).

</details>

#### Customizing the Docker Environment

The easiest way to add extra packages is with environment variables — no fork needed:

```bash
docker run -d --name open-terminal -p 8000:8000 \
  -e OPEN_TERMINAL_PACKAGES="cowsay figlet" \
  -e OPEN_TERMINAL_PIP_PACKAGES="httpx polars" \
  ghcr.io/open-webui/open-terminal
```

| Variable | Description |
| :--- | :--- |
| `OPEN_TERMINAL_PACKAGES` | Space-separated list of **apt** packages to install at startup |
| `OPEN_TERMINAL_PIP_PACKAGES` | Space-separated list of **pip** packages to install at startup |

:::note
Packages are installed each time the container starts, so startup will take longer with large package lists. For heavy customization, build a custom image instead.
:::

#### Docker Access

The container image includes the Docker CLI, Compose, and Buildx. To let agents build images, run containers, and manage Docker resources, mount the host's Docker socket:

```bash
docker run -d --name open-terminal -p 8000:8000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v open-terminal:/home/user \
  ghcr.io/open-webui/open-terminal
```

The entrypoint automatically fixes socket group permissions so `docker` commands work without `sudo`.

:::warning
Mounting the Docker socket gives the container full access to the host's Docker daemon. Only do this in trusted environments.
:::

### Bare Metal

Want your AI to work directly on **your machine**, with **your files**, **your tools**, and **your environment**? Bare metal mode is for you. No container boundary. The AI gets the same access you do.

```bash
# One-liner with uvx (no install needed)
uvx open-terminal run --host 0.0.0.0 --port 8000 --api-key your-secret-key

# Or install with pip
pip install open-terminal
open-terminal run --host 0.0.0.0 --port 8000 --api-key your-secret-key
```

This is the most powerful way to use Open Terminal. Point it at your project directory with `--cwd` and let the AI help you run tests, refactor code, manage dependencies, search through files, and write scripts. Everything happens on your real machine with your real tools.

:::info Windows Support
Open Terminal works on Windows too. As of v0.8.0, commands and interactive terminals run under a real pseudo-terminal via [pywinpty](https://github.com/andfoy/pywinpty), which is automatically installed on Windows. You get colored output, interactive programs, and TUI apps — just like on Linux/macOS.
:::

:::warning
Bare metal means the AI can run any command with your user's permissions. This is powerful but comes with real risk. Don't run this in a shared or production environment. If you want sandboxed execution, use Docker instead.
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
When both services run in the same Docker Compose stack, use the **service name** as the hostname. For the admin-configured Open Terminal URL in Open WebUI, use `http://open-terminal:8000`, not `localhost:8000`.
:::

### Multi-User Mode

For **small team** deployments where a handful of users connect through Open WebUI, Open Terminal can isolate each user inside a single container — no extra services or per-user containers needed. This is designed for roughly a dozen users or fewer.

```bash
docker run -d --name open-terminal -p 8000:8000 \
  -e OPEN_TERMINAL_MULTI_USER=true \
  -e OPEN_TERMINAL_API_KEY=your-secret-key \
  ghcr.io/open-webui/open-terminal
```

When enabled, each `X-User-Id` header (sent automatically by Open WebUI for admin-configured connections) is mapped to a dedicated Linux user account with its own home directory. Files, commands, terminal sessions, and port visibility are all isolated via standard Unix permissions.

**How it works:**

- Each distinct user ID is mapped to a sanitized Linux username (first 8 alphanumeric characters, optionally prefixed by `OPEN_TERMINAL_USER_PREFIX`)
- A Linux user account and home directory are provisioned on first request
- Commands run under `sudo -u <username>`, so each user gets their own process space
- Home directories are `chmod 2770` — users cannot read or write other users' files
- Port detection is filtered by UID, so users only see their own services

:::warning Not designed for large-scale deployments
Multi-user mode runs all users inside **one container** sharing the same CPU, memory, disk, kernel, and network stack. This means:

- **Resource contention** — multiple users running compute-intensive tasks (data processing, model training, compilation) will compete for the same resources and degrade each other's performance.
- **No horizontal scaling** — you cannot add more containers to handle more users; it's a single instance.
- **Shared network namespace** — port visibility is filtered by UID, but users can technically reach each other's services.
- **Not suitable for untrusted users** — isolation is via Unix permissions, not container boundaries.

For deployments beyond a small trusted team, use **[Terminals](https://github.com/open-webui/terminals)** instead, which provisions a **separate container per user** with dedicated resources, automatic idle cleanup, and support for Docker and Kubernetes backends. Terminals requires an [enterprise license](/enterprise).
:::

### Configuration

| CLI Option | Default | Environment Variable | Description |
| :--- | :--- | :--- | :--- |
| `--host` | `0.0.0.0` | | Bind address |
| `--port` | `8000` | | Bind port |
| `--cwd` | Current directory | | Working directory for the server process |
| `--api-key` | Auto-generated | `OPEN_TERMINAL_API_KEY` | Bearer API key for authentication |
| `--config` | (see below) | | Path to a custom TOML config file |
| | `~/.local/state/open-terminal/logs` | `OPEN_TERMINAL_LOG_DIR` | Directory for process log files |
| | `16` | `OPEN_TERMINAL_MAX_SESSIONS` | Maximum concurrent interactive terminal sessions |
| | `true` | `OPEN_TERMINAL_ENABLE_TERMINAL` | Enable or disable the interactive terminal feature |
| | `true` | `OPEN_TERMINAL_ENABLE_NOTEBOOKS` | Enable or disable the notebook execution endpoints |
| | | `OPEN_TERMINAL_API_KEY_FILE` | Load the API key from a file instead of an env var (for Docker secrets) |
| | `xterm-256color` | `OPEN_TERMINAL_TERM` | TERM environment variable set in terminal sessions (controls color support) |
| | Unset | `OPEN_TERMINAL_EXECUTE_TIMEOUT` | Default wait time (seconds) for command execution when the caller omits the `wait` parameter. Helps smaller models get output inline. |
| | Unset | `OPEN_TERMINAL_EXECUTE_DESCRIPTION` | Custom text appended to the execute endpoint's OpenAPI description, letting you tell AI models about installed tools, capabilities, or conventions. |
| | `false` | `OPEN_TERMINAL_MULTI_USER` | Enable [multi-user mode](#multi-user-mode). Each `X-User-Id` gets a dedicated Linux user with an isolated home directory. Requires Linux and Docker. |
| | (empty) | `OPEN_TERMINAL_USER_PREFIX` | Prefix prepended to generated Linux usernames in multi-user mode. Useful for avoiding collisions with existing system users. |
| | `auto` | `OPEN_TERMINAL_UVICORN_LOOP` | Uvicorn event loop policy. Set to `asyncio` to avoid uvloop segfaults on Python 3.12 in some environments. |
| | (empty) | `OPEN_TERMINAL_INFO` | When set, enables a `GET /info` endpoint that returns this string. Use it to describe the environment to AI models (e.g. installed tools, available databases, conventions). |

When no API key is provided, Open Terminal generates a random key and prints it to the console on startup.

<details>
<summary><b>TOML configuration file</b></summary>

Instead of passing everything via CLI flags or environment variables, you can use a TOML config file. Open Terminal checks two locations:

1. **System config** — `/etc/open-terminal/config.toml`
2. **User config** — `~/.config/open-terminal/config.toml`

User values override system values. CLI flags and env vars always win. Use `--config /path/to/config.toml` to point to a custom file.

```toml title="config.toml"
host = "0.0.0.0"
port = 8000
api_key = "your-secret-key"
log_dir = "/var/log/open-terminal"
max_terminal_sessions = 16
enable_terminal = true
enable_notebooks = true
term = "xterm-256color"
execute_timeout = 5
execute_description = "This terminal has ffmpeg and ImageMagick pre-installed."
multi_user = false
user_prefix = ""
uvicorn_loop = "auto"
info = ""
```

Using a config file keeps the API key out of `ps` / `htop` output.

</details>

<details>
<summary><b>Docker secrets</b></summary>

You can load the API key from a file using `OPEN_TERMINAL_API_KEY_FILE`, following the convention used by the official PostgreSQL Docker image:

```yaml title="docker-compose.yml"
services:
  open-terminal:
    image: ghcr.io/open-webui/open-terminal
    environment:
      - OPEN_TERMINAL_API_KEY_FILE=/run/secrets/terminal_api_key
    secrets:
      - terminal_api_key

secrets:
  terminal_api_key:
    file: ./terminal_api_key.txt
```

`OPEN_TERMINAL_API_KEY` and `OPEN_TERMINAL_API_KEY_FILE` are mutually exclusive — setting both is an error.

</details>

## Connecting to Open WebUI

There are two ways to connect Open Terminal to Open WebUI. Make sure to add it under the **Open Terminal** section in integrations settings. This is a dedicated integration, not a generic tool server.

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

<details>
<summary><b>Authentication types and access control</b></summary>

| Type | Description |
| :--- | :--- |
| **Bearer** | Sends the configured API key as a `Bearer` token to the terminal server. Default and recommended. |
| **Session** | Forwards the user's Open WebUI session credentials. Useful when the terminal validates against the same auth backend. |
| **OAuth** | Forwards the user's OAuth access token. Requires OAuth to be configured in Open WebUI. |
| **None** | No authentication header. Only for terminals on a trusted internal network. |

By default, all users can access admin-configured terminals. To restrict access, add **access grants** to limit to specific [user groups](/features/access-security/rbac/groups).

</details>

### User-Configured (Direct)

Individual users can add their own terminals under **Settings → Integrations → Open Terminal**. This is ideal for a personal terminal running on your local machine, such as bare metal mode pointed at your project directory.

1. Go to **Settings → Integrations**
2. Scroll to the **Open Terminal** section
3. Click **+** to add a new connection
4. Enter the **URL** and **API key**

:::note
User-configured terminals connect **directly from the browser**. The terminal must be reachable from your machine, and the API key is stored in the browser. For production deployments, prefer the admin-configured approach.
:::

### Networking Tips

Admin-configured and user-configured connections work differently at the network level. **The same URL can work for one but fail for the other.**

| Connection Type | Request Origin | What `localhost` Means |
| :--- | :--- | :--- |
| **Admin (System)** | Open WebUI **backend server** | The machine/container running Open WebUI |
| **User (Direct)** | User's **browser** | The machine running the browser |

**Common issues:**

| Symptom | Likely Cause | Fix |
| :--- | :--- | :--- |
| **502 Bad Gateway** | Backend can't reach the terminal URL | Use a URL the backend can resolve: container name, internal IP, or `host.docker.internal` |
| **User connection works, admin doesn't** | URL resolves from browser but not from backend container | Use different URLs: public URL for user connections, internal URL for admin |
| **Connection timeout** | Firewall or network isolation | Ensure both containers are on the same Docker network |

:::tip Quick Test
To verify the backend can reach your terminal, exec into the Open WebUI container and test:

```bash
curl -s http://open-terminal:8000/health
```

If this returns `{"status": "ok"}`, the backend can reach it.
:::

## The File Browser

When a terminal is selected, the chat controls panel gains a **Files** tab. This isn't just a file list. It's a full file manager connected to the terminal's filesystem.

- **Browse and preview.** Navigate directories, view text files, images, PDFs, CSV/TSV tables (rendered as formatted tables), and Markdown with a source/preview toggle. Great for inspecting what the AI created without leaving the chat.
- **Edit inline.** Click the edit icon on any text file to modify it directly. Useful for quick fixes to a config, a script, or a file the AI generated.
- **Upload (drag-and-drop).** Drop files onto the directory listing to send them to the terminal. This is how you give the AI data to work with: a dataset, an image to process, a document to analyze.
- **Download.** Pull any file from the terminal to your local machine. After the AI generates a chart, a cleaned dataset, a compiled binary, or a report, just download it.
- **Create and delete.** Create new files and folders, or delete ones you no longer need.
- **Attach to chat.** Share a file from the terminal filesystem with the AI as a chat attachment, so it can reference the contents directly.

The file browser remembers your last-visited directory and automatically reloads when you switch terminals.

## Interactive Terminal

Open Terminal can also provide a full interactive terminal session via WebSocket — a real shell running in the container that you can type into directly from Open WebUI. This is the same kind of terminal you'd get from SSH, but accessed through the browser.

This feature is **enabled by default** and is used by the native Open WebUI integration. When a terminal is connected, Open WebUI can open an interactive shell session without any extra setup.

You can control this feature with:

- **`OPEN_TERMINAL_ENABLE_TERMINAL=false`** — disables the interactive terminal entirely. Useful if you only want command execution and file operations.
- **`OPEN_TERMINAL_MAX_SESSIONS=16`** — limits the number of concurrent terminal sessions (default: 16). Prevents resource exhaustion from too many open terminals.

## Port Detection and Proxy

Open Terminal can discover TCP ports that servers (started via the terminal or `/execute`) are listening on and proxy HTTP traffic to them.

- **`GET /ports`** — returns a list of TCP ports listening on localhost, scoped to descendant processes of Open Terminal. Cross-platform: parses `/proc/net/tcp` on Linux, `lsof` on macOS, and `netstat` on Windows. No extra dependencies.
- **`/proxy/{port}/{path}`** — reverse-proxies HTTP requests to `localhost:{port}`. Supports all HTTP methods, forwards headers and body, and returns 502 on connection failure.

This is useful when the AI starts a development server (e.g. a Flask app, a Node.js server, or a static file server) inside the terminal and you want to interact with it from Open WebUI or your browser.

## Notebook Execution

Open Terminal includes built-in Jupyter notebook execution via REST endpoints, powered by `nbclient`. Each session gets its own kernel, and you can execute cells one at a time with full rich output support (images, HTML, LaTeX).

- **`POST /notebooks`** — create a new notebook session (starts a kernel)
- **`POST /notebooks/{id}/execute`** — execute a cell in the session
- **`GET /notebooks/{id}`** — get session status
- **`DELETE /notebooks/{id}`** — stop the kernel and clean up

Notebook execution is **enabled by default**. Disable it with `OPEN_TERMINAL_ENABLE_NOTEBOOKS=false` (or `enable_notebooks = false` in config.toml).

`nbclient` and `ipykernel` are core dependencies and included in the Docker image. For bare metal installs, they are included by default with `pip install open-terminal`.

## Security

- **Always use Docker in production.** Bare metal exposes your host to any command the model generates.
- **Set an API key.** Without one, anyone who can reach the port has full access. Consider using a [config file](#configuration) or Docker secrets to keep the key out of process listings.
- **Use resource limits.** Apply `--memory` and `--cpus` flags in Docker to prevent runaway processes.
- **Session limits.** The default limit of 16 concurrent terminal sessions prevents resource exhaustion. Adjust with `OPEN_TERMINAL_MAX_SESSIONS`.
- **Network isolation.** Place the terminal container on an internal Docker network that only Open WebUI can reach.
- **Use named volumes.** Files inside the container are lost when removed. The default `docker run` command mounts a volume at `/home/user` for persistence.
- **Disable the interactive terminal** if you don't need it, with `OPEN_TERMINAL_ENABLE_TERMINAL=false`.
- **Docker socket access.** Only mount the Docker socket (`/var/run/docker.sock`) in trusted environments. It gives the container full control over the host's Docker daemon.
- **Multi-user mode is not a security sandbox.** It provides process-level isolation via Unix permissions, but users share the same kernel, network, and package set. Do not use it for untrusted users — use [per-container isolation](https://github.com/open-webui/terminals) instead (requires an [enterprise license](/enterprise)).

## Further Reading

- [Open Terminal GitHub Repository](https://github.com/open-webui/open-terminal): source code, issue tracker, and full API documentation
- [Interactive API Docs](http://localhost:8000/docs): Swagger UI available when your instance is running
- [Code Execution Backends](/features/chat-conversations/chat-features/code-execution): comparison of all code execution options (Pyodide, Jupyter, Open Terminal, Terminals)
- [Python Code Execution](/features/chat-conversations/chat-features/code-execution/python): Pyodide and Jupyter backends
- [Terminals](https://github.com/open-webui/terminals): multi-tenant orchestrator that provisions isolated Open Terminal containers per user — designed for large-scale deployments (requires an [enterprise license](/enterprise))
