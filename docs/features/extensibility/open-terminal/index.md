---
sidebar_position: 3
title: "Open Terminal"
---

# ⚡ Open Terminal

## Overview

[Open Terminal](https://github.com/open-webui/open-terminal) gives your AI a real shell. Instead of running code in a sandboxed browser snippet, the model gets a full operating system where it can install software, run code in any language, manage files, and execute multi-step workflows, all from your chat.

When connected to Open WebUI, every terminal capability is **automatically available** to the model with no manual setup per chat. You also get a **built-in file browser** right in the conversation, so you can see, edit, and manage everything the AI creates.

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

Run Open Terminal in an isolated container with a full toolkit pre-installed: Python, Node.js, git, build tools, data science libraries, and more. Great for giving AI agents a safe playground without touching your host system.

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
| **Compression** | zip, unzip, tar, gzip, bzip2, xz, zstd, p7zip |
| **System** | procps, htop, lsof, strace, sysstat, sudo, tmux, screen |
| **Python libraries** | numpy, pandas, scipy, scikit-learn, matplotlib, seaborn, plotly, jupyter, ipython, requests, beautifulsoup4, lxml, sqlalchemy, pyyaml, rich, and more |

You can customize the image by forking the repo and editing the [Dockerfile](https://github.com/open-webui/open-terminal/blob/main/Dockerfile).

</details>

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

### Configuration

| CLI Option | Default | Environment Variable | Description |
| :--- | :--- | :--- | :--- |
| `--host` | `0.0.0.0` | | Bind address |
| `--port` | `8000` | | Bind port |
| `--cwd` | Current directory | | Working directory for the server process |
| `--api-key` | Auto-generated | `OPEN_TERMINAL_API_KEY` | Bearer API key for authentication |

When no API key is provided, Open Terminal generates a random key and prints it to the console on startup.

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

## Security

- **Always use Docker in production.** Bare metal exposes your host to any command the model generates.
- **Set an API key.** Without one, anyone who can reach the port has full shell access.
- **Use resource limits.** Apply `--memory` and `--cpus` flags in Docker to prevent runaway processes.
- **Network isolation.** Place the terminal container on an internal Docker network that only Open WebUI can reach.
- **Use named volumes.** Files inside the container are lost when removed. The default `docker run` command mounts a volume at `/home/user` for persistence.

## Further Reading

- [Open Terminal GitHub Repository](https://github.com/open-webui/open-terminal): source code, issue tracker, and full API documentation
- [Interactive API Docs](http://localhost:8000/docs): Swagger UI available when your instance is running
- [Python Code Execution](/features/chat-conversations/chat-features/code-execution/python): Pyodide and Jupyter backends
- [Terminals](https://github.com/open-webui/terminals): multi-tenant, provisions isolated Open Terminal containers per user
