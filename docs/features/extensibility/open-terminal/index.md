---
sidebar_position: 5
title: "Open Terminal"
---

# ⚡ Open Terminal

:::info

This page is up-to-date with Open Terminal release version [v0.2.3](https://github.com/open-webui/open-terminal).

:::

## Overview

[Open Terminal](https://github.com/open-webui/open-terminal) is a lightweight API for running shell commands remotely — with background process management, file operations, and secure access. When connected to Open WebUI as a [Tool](/features/extensibility/plugin/tools), it gives models full shell access, a complete file system toolkit, and the ability to execute arbitrary commands in an isolated environment.

Unlike Pyodide (browser-based, limited libraries) or Jupyter (shared environment, no per-user isolation), Open Terminal runs in its own Docker container with full OS-level capabilities. This makes it ideal for tasks that require:

- Installing and running any software package or language
- Working with system tools like ffmpeg, pandoc, git, etc.
- Reading, writing, and editing files directly
- Running multi-step build, analysis, or data processing pipelines
- Interacting with REPLs and interactive commands via stdin

:::warning
Open Terminal provides **unrestricted shell access** to the environment it runs in. In production deployments, always run it inside a Docker container with appropriate resource limits. Never run it on bare metal in a shared or untrusted environment.
:::

## Getting Started

### Docker (Recommended)

```bash
docker run -d --name open-terminal --restart unless-stopped -p 8000:8000 -v open-terminal:/home/user -e OPEN_TERMINAL_API_KEY=your-secret-key ghcr.io/open-webui/open-terminal
```

The `-v open-terminal:/home/user` flag creates a **named volume** so files in the user's home directory survive container restarts. If no API key is provided, one is auto-generated and printed on startup (`docker logs open-terminal`).

The container runs as a **non-root user** (`user`) with passwordless `sudo` available when elevated privileges are needed. The working directory is `/home/user`.

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

### MCP Server Mode

Open Terminal can also run as an [MCP (Model Context Protocol)](/features/extensibility/plugin/tools/openapi-servers/mcp) server, exposing all its endpoints as MCP tools. This requires an additional dependency:

```bash
pip install open-terminal[mcp]
```

Then start the MCP server:

```bash
# stdio transport (default — for local MCP clients)
open-terminal mcp

# streamable-http transport (for remote/networked MCP clients)
open-terminal mcp --transport streamable-http --host 0.0.0.0 --port 8000
```

| Option | Default | Description |
| :--- | :--- | :--- |
| `--transport` | `stdio` | Transport mode: `stdio` or `streamable-http` |
| `--host` | `0.0.0.0` | Bind address (streamable-http only) |
| `--port` | `8000` | Bind port (streamable-http only) |

Under the hood, this uses [FastMCP](https://github.com/jlowin/fastmcp) to automatically convert every FastAPI endpoint into an MCP tool — no manual tool definitions needed.

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

## Configuration

| CLI Option | Default | Environment Variable | Description |
| :--- | :--- | :--- | :--- |
| `--host` | `0.0.0.0` | — | Bind address |
| `--port` | `8000` | — | Bind port |
| `--api-key` | Auto-generated | `OPEN_TERMINAL_API_KEY` | Bearer API key for authentication |
| — | `~/.open-terminal/logs` | `OPEN_TERMINAL_LOG_DIR` | Directory for process JSONL log files |

When no API key is provided, Open Terminal generates a random key using a cryptographically secure token and prints it to the console on startup.

Process output is persisted to **JSONL log files** under `OPEN_TERMINAL_LOG_DIR/processes/`. These files provide a full audit trail that survives process cleanup and server restarts.

## Connecting to Open WebUI

Open Terminal is a FastAPI application and automatically exposes an OpenAPI specification at `/openapi.json`. This means it works out of the box as an [OpenAPI Tool Server](/features/extensibility/plugin/tools/openapi-servers/open-webui) — no manual tool creation required.

- **As a User Tool Server**: Add it in **Settings → Tools** to connect directly from your browser. Ideal for personal or local instances.
- **As a Global Tool Server**: Add it in **Admin Settings → Tools** to make it available to all users across the deployment.

For step-by-step instructions with screenshots, see the [OpenAPI Tool Server Integration Guide](/features/extensibility/plugin/tools/openapi-servers/open-webui).

## API Reference

All endpoints except `/health` and temporary download/upload links require Bearer token authentication.

Interactive API documentation (Swagger UI) is available at `http://localhost:8000/docs` when the server is running.

### Command Execution

#### Execute a Command

**`POST /execute`**

Runs a shell command as a **background process** and returns a process ID. All output is persisted to a JSONL log file. Supports pipes, chaining (`&&`, `||`, `;`), and redirections.

:::tip
The `/execute` endpoint description in the OpenAPI spec automatically includes live system metadata — OS, hostname, current user, default shell, Python version, and working directory. When Open WebUI discovers this tool via the OpenAPI spec, models see this context in the tool description and can adapt their commands accordingly.
:::

**Request body:**

| Field | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `command` | string | (required) | Shell command to execute |
| `cwd` | string | Server's working directory | Working directory for the command |
| `env` | object | `null` | Extra environment variables merged into the subprocess environment |

**Query parameters:**

| Parameter | Default | Description |
| :--- | :--- | :--- |
| `stream` | `false` | If `true`, stream output as JSONL instead of waiting for completion |
| `tail` | (all) | Return only the last N output entries. Useful to limit response size for AI agents. |
| `wait` | number | `null` | Seconds to wait for the command to finish before returning (0–300). If the command completes in time, output is included inline. `null` to return immediately. |
| `tail` | integer | `null` | Return only the last N output entries. Useful to keep responses bounded. |

**Example — fire and forget:**

```bash
curl -X POST http://localhost:8000/execute \
  -H "Authorization: Bearer <api-key>" \
  -H "Content-Type: application/json" \
  -d '{"command": "echo hello"}'
```

```json
{
  "id": "a1b2c3d4e5f6",
  "command": "echo hello",
  "status": "running",
  "exit_code": null,
  "output": [],
  "truncated": false,
  "next_offset": 0,
  "log_path": "/home/user/.open-terminal/logs/processes/a1b2c3d4e5f6.jsonl"
}
```

**Example — wait for completion:**

```bash
curl -X POST "http://localhost:8000/execute?wait=5" \
  -H "Authorization: Bearer <api-key>" \
  -H "Content-Type: application/json" \
  -d '{"command": "echo hello"}'
```

```json
{
  "id": "a1b2c3d4e5f6",
  "command": "echo hello",
  "status": "done",
  "exit_code": 0,
  "output": [
    {"type": "stdout", "data": "hello\n"}
  ],
  "truncated": false,
  "next_offset": 1,
  "log_path": "/home/user/.open-terminal/logs/processes/a1b2c3d4e5f6.jsonl"
}
```

:::info File-Backed Process Output
All background process output (stdout/stderr) is persisted to JSONL log files under `~/.open-terminal/logs/processes/`. This means output is never lost, even if the server restarts. The response includes `next_offset` for stateless incremental polling — pass it as the `offset` query parameter on subsequent status requests to get only new output. The `log_path` field shows the path to the raw JSONL log file.
:::

### Search File Contents

**`GET /files/search`**

Search for a text pattern across files in a directory. Returns structured matches with file paths, line numbers, and matching lines. Skips binary files automatically.

**Query parameters:**

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `query` | string | (required) | Text or regex pattern to search for |
| `path` | string | `.` | Directory or file to search in |
| `regex` | boolean | `false` | Treat query as a regex pattern |
| `case_insensitive` | boolean | `false` | Perform case-insensitive matching |
| `include` | string[] | (all files) | Glob patterns to filter files (e.g. `*.py`). Files must match at least one pattern. |
| `match_per_line` | boolean | `true` | If true, return each matching line with line numbers. If false, return only matching filenames. |
| `max_results` | integer | `50` | Maximum number of matches to return (1–500) |

```bash
curl "http://localhost:8000/files/search?query=TODO&include=*.py&case_insensitive=true" \

#### Get Command Status

**`GET /execute/{process_id}/status`**

Returns process status, exit code, and output since the last poll. Use `offset` and `next_offset` for stateless incremental reads — multiple clients can independently track the same process without data loss.

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `wait` | number | `null` | Seconds to wait for the process to finish before returning. Returns early if the process exits. |
| `offset` | integer | `0` | Number of output entries to skip. Use `next_offset` from the previous response to get only new output. |
| `tail` | integer | `null` | Return only the last N output entries. |

```bash
curl "http://localhost:8000/execute/a1b2c3d4e5f6/status?offset=0&wait=10" \
  -H "Authorization: Bearer <api-key>"
```

```json
{
  "id": "a1b2c3d4e5f6",
  "command": "echo hello",
  "status": "done",
  "exit_code": 0,
  "output": [
    {"type": "stdout", "data": "hello\n"}
  ],
  "truncated": false,
  "next_offset": 1,
  "log_path": "/home/user/.open-terminal/logs/processes/a1b2c3d4e5f6.jsonl"
}
```

#### List Processes

**`GET /execute`**

Returns a list of all tracked background processes, including running, done, and killed.

```bash
curl http://localhost:8000/execute \
  -H "Authorization: Bearer <api-key>"
```

```json
[
  {
    "id": "a1b2c3d4e5f6",
    "command": "python train.py",
    "status": "running",
    "exit_code": null,
    "log_path": "/home/user/.open-terminal/logs/processes/a1b2c3d4e5f6.jsonl"
  }
]
```

Finished processes are automatically cleaned up after 5 minutes. Their JSONL log files are retained on disk for audit purposes.

#### Send Input

**`POST /execute/{process_id}/input`**

Sends text to a running process's stdin. Useful for interacting with REPLs, interactive commands, or any process waiting for input.

**Request body:**

| Field | Type | Description |
| :--- | :--- | :--- |
| `input` | string | Text to send to stdin. Include newline characters as needed. |

```bash
curl -X POST http://localhost:8000/execute/a1b2c3d4e5f6/input \
  -H "Authorization: Bearer <api-key>" \
  -H "Content-Type: application/json" \
  -d '{"input": "print(42)\n"}'
```

#### Kill a Process

**`DELETE /execute/{process_id}`**

Terminates a running process. Sends `SIGTERM` by default for graceful shutdown.

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `force` | boolean | `false` | Send `SIGKILL` instead of `SIGTERM`. |

```bash
curl -X DELETE "http://localhost:8000/execute/a1b2c3d4e5f6?force=true" \
  -H "Authorization: Bearer <api-key>"
```

### File Operations

#### List Directory Contents

**`GET /files/list`**

Returns a structured listing of files and directories at the given path, including name, type, size, and modification time.

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `directory` | string | `.` | Directory path to list. |

```bash
curl "http://localhost:8000/files/list?directory=/home/user" \
  -H "Authorization: Bearer <api-key>"
```

```json
{
  "dir": "/home/user",
  "entries": [
    {"name": "data.csv", "type": "file", "size": 1024, "modified": 1707955200.0},
    {"name": "scripts", "type": "directory", "size": 4096, "modified": 1707955200.0}
  ]
}
```

#### Read a File

**`GET /files/read`**

Returns the contents of a file. Text files return a content string; binary files return base64-encoded content. Optionally specify a line range for large text files.

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `path` | string | (required) | Path to the file to read. |
| `start_line` | integer | `null` | First line to return (1-indexed, inclusive). |
| `end_line` | integer | `null` | Last line to return (1-indexed, inclusive). |

```bash
curl "http://localhost:8000/files/read?path=/home/user/script.py&start_line=1&end_line=10" \
  -H "Authorization: Bearer <api-key>"
```

```json
{
  "path": "/home/user/script.py",
  "total_lines": 50,
  "content": "#!/usr/bin/env python3\nimport sys\n..."
}
```

#### Write a File

**`POST /files/write`**

Writes text content to a file. Creates parent directories automatically. Overwrites if the file already exists.

**Request body:**

| Field | Type | Description |
| :--- | :--- | :--- |
| `path` | string | Absolute or relative path. Parent directories are created automatically. |
| `content` | string | Text content to write. |

```bash
curl -X POST http://localhost:8000/files/write \
  -H "Authorization: Bearer <api-key>" \
  -H "Content-Type: application/json" \
  -d '{"path": "/home/user/hello.py", "content": "print(\"hello\")\n"}'
```

#### Replace Content in a File

**`POST /files/replace`**

Find and replace exact strings in a file. Supports multiple replacements in one call with optional line range narrowing for precision.

**Request body:**

| Field | Type | Description |
| :--- | :--- | :--- |
| `path` | string | Path to the file to modify. |
| `replacements` | array | List of find-and-replace operations (applied sequentially). |

Each replacement chunk:

| Field | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `target` | string | (required) | Exact string to find. Must match precisely, including whitespace. |
| `replacement` | string | (required) | Content to replace the target with. |
| `start_line` | integer | `null` | Narrow the search to lines at or after this (1-indexed). |
| `end_line` | integer | `null` | Narrow the search to lines at or before this (1-indexed). |
| `allow_multiple` | boolean | `false` | If true, replaces all occurrences. If false, errors when multiple matches are found. |

```bash
curl -X POST http://localhost:8000/files/replace \
  -H "Authorization: Bearer <api-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "/home/user/config.yaml",
    "replacements": [
      {"target": "debug: false", "replacement": "debug: true"}
    ]
  }'
```

#### Search File Contents

**`GET /files/search`**

Search for a text pattern across files in a directory. Returns structured matches with file paths, line numbers, and matching lines. Skips binary files.

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `query` | string | (required) | Text or regex pattern to search for. |
| `path` | string | `.` | Directory or file to search in. |
| `regex` | boolean | `false` | Treat query as a regex pattern. |
| `case_insensitive` | boolean | `false` | Perform case-insensitive matching. |
| `include` | string[] | `null` | Glob patterns to filter files (e.g. `*.py`). Files must match at least one pattern. |
| `match_per_line` | boolean | `true` | If true, return each matching line. If false, return only filenames. |
| `max_results` | integer | `50` | Maximum number of matches to return (1–500). |

```bash
curl "http://localhost:8000/files/search?query=TODO&path=/home/user/project&include=*.py" \
  -H "Authorization: Bearer <api-key>"
```

```json
{
  "query": "TODO",
  "path": "/root",
  "matches": [
    {"file": "/root/app.py", "line": 42, "content": "# TODO: refactor this"},
    {"file": "/root/utils.py", "line": 7, "content": "# TODO: add tests"}
  ],
  "truncated": false
}
```

### File Transfer

#### Upload a File

**`POST /files/upload`**

Save a file to the container filesystem. Provide either a `url` to fetch remotely, or send the file directly via multipart form data.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `directory` | string | Destination directory for the file. |
| `url` | string | (Optional) URL to download the file from. If omitted, expects a multipart file upload. |

**From URL:**
```bash
curl -X POST "http://localhost:8000/files/upload?directory=/home/user&url=https://example.com/data.csv" \
  -H "Authorization: Bearer <api-key>"
```

**Direct upload:**
```bash
curl -X POST "http://localhost:8000/files/upload?directory=/home/user" \
  -H "Authorization: Bearer <api-key>" \
  -F "file=@local_file.csv"
```

**Via temporary upload link (no auth needed to upload):**
```bash
# 1. Generate an upload link
curl -X POST "http://localhost:8000/files/upload/link?directory=/home/user" \
  -H "Authorization: Bearer <api-key>"
# → {"url": "http://localhost:8000/files/upload/a1b2c3d4..."}

# 2. Upload to the link (no auth required)
curl -X POST "http://localhost:8000/files/upload/a1b2c3d4..." \
  -F "file=@local_file.csv"
```

Opening a temporary upload link in a browser shows a simple file picker form — useful for manual uploads without curl.

The filename is automatically derived from the uploaded file or the URL.

#### Download a File

**`GET /files/download/link`**

Returns a temporary download URL for a file. The link expires after 5 minutes and requires no authentication to use.

```bash
curl "http://localhost:8000/files/download/link?path=/home/user/output.csv" \
  -H "Authorization: Bearer <api-key>"
```

```json
{"url": "http://localhost:8000/files/download/a1b2c3d4..."}
```

### Process Status (Background)

**`GET /processes/{process_id}/status`**

Poll the output of a running or finished background process. Uses offset-based pagination so agents can retrieve only new output since the last poll.

**Query parameters:**

| Parameter | Default | Description |
| :--- | :--- | :--- |
| `wait` | `0` | Seconds to wait for the process to finish before returning. |
| `offset` | `0` | Number of output entries to skip. Use `next_offset` from the previous response. |
| `tail` | (all) | Return only the last N output entries. Useful to limit response size. |

```bash
curl "http://localhost:8000/processes/a1b2c3d4/status?offset=0&tail=20" \
  -H "Authorization: Bearer <api-key>"
```

```json
{
  "id": "a1b2c3d4",
  "command": "make build",
  "status": "running",
  "exit_code": null,
  "output": [{"type": "stdout", "data": "Building...\n"}],
  "truncated": false,
  "next_offset": 1,
  "log_path": "/root/.open-terminal/logs/processes/a1b2c3d4.jsonl"
}
```

### Health Check

**`GET /health`**

Returns service status. No authentication required.

```json
{"status": "ok"}
```

## Security Considerations

- **Always use Docker** in production. Running Open Terminal on bare metal exposes the host system to any command the model generates.
- **Non-root by default**. The container runs as a non-root user (`user`) with passwordless `sudo` available when elevated privileges are needed. This adds a layer of safety while preserving full capability.
- **Set an API key**. Without one, anyone who can reach the port has full shell access. If you don't provide one, the auto-generated key is printed once at startup — save it.
- **Use resource limits**. Apply `--memory` and `--cpus` flags in Docker to prevent runaway processes from consuming host resources.
- **Network isolation**. Place the Open Terminal container on an internal Docker network that only Open WebUI can reach, rather than exposing it to the public internet.
- **Use named volumes for persistence**. Files inside the container are lost when the container is removed. The default `docker run` command mounts a named volume at `/home/user` for persistence.
- **Log files**. Process output is persisted as JSONL files under the configured log directory. Review these files periodically and apply retention policies as needed.

## Further Reading

- [Open Terminal GitHub Repository](https://github.com/open-webui/open-terminal)
- [Interactive API Documentation](http://localhost:8000/docs) (available when running locally)
- [Python Code Execution](/features/chat-conversations/chat-features/code-execution/python) — Pyodide and Jupyter backends
- [Jupyter Integration Tutorial](/tutorials/integrations/dev-tools/jupyter) — Setting up Jupyter as a code execution backend
- [Skills](/features/ai-knowledge/skills) — Using skills with code execution
