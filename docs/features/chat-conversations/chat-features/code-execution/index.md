---
sidebar_position: 1
title: "Code Execution"
---

Open WebUI offers powerful code execution capabilities directly within your chat interface, enabling you to transform ideas into actionable results without leaving the platform.

## Key Features

- **Code Interpreter Capability**: Enable models to autonomously write and execute Python code as part of their responses. Works with both Default Mode (XML-based) and Native Mode (tool calling via `execute_code`).

- **Python Code Execution**: Run Python scripts directly in your browser using Pyodide, or on a server using Jupyter. Supports popular libraries like pandas and matplotlib with no setup required.

- **MermaidJS Rendering**: Create and visualize flowcharts, diagrams, and other visual representations with MermaidJS syntax that automatically renders in your chat.

- **Interactive Artifacts**: Generate and interact with rich content like HTML websites, SVG graphics, and JavaScript visualizations directly within your conversations.

- **Open Terminal**: Connect a remote shell execution API as a tool for full OS-level access — run any command, install packages, and manage files inside an isolated Docker container.

These execution capabilities bridge the gap between conversation and implementation, allowing you to explore ideas, analyze data, and create visual content seamlessly while chatting with AI models.

## Choosing a Code Execution Backend

Open WebUI supports multiple code execution backends, each suited to different use cases. The right choice depends on what you need — lightweight browser-based execution, a full Python environment, or unrestricted shell access.

### Pyodide (Default)

Pyodide runs Python in the browser via WebAssembly. It is sandboxed and safe for multi-user environments, but comes with constraints:

- **No persistent storage** — the filesystem resets between executions.
- **Limited library support** — only a subset of Python packages are available. Libraries that rely on C extensions or system calls may not work.
- **No shell access** — cannot run shell commands, install packages, or interact with the OS.

:::tip
Pyodide works well for **text analysis, hash computation, chart generation**, and other self-contained tasks. Chart libraries like matplotlib produce base64-encoded images that Open WebUI automatically captures, uploads as files, and injects direct image links into the output — so models can display charts directly in chat without any extra setup.
:::

### Jupyter

Jupyter provides a full Python environment and can handle virtually any task — file creation, package installation, and complex library usage. However, it has significant drawbacks in shared deployments:

- **Shared environment** — all users share the same Python runtime and filesystem.
- **Not sandboxed by default** — without careful configuration, users can access system resources or read other users' data.
- **Not designed for multi-tenant use** — Jupyter was built for single-user workflows.

:::warning
If you are running a multi-user or organizational deployment, **Jupyter is not recommended** as the code execution backend. Open WebUI's Jupyter integration connects to a single shared instance with no per-user isolation. Jupyter is best suited for **single-user, development, or trusted-user setups** only.
:::

### Open Terminal

[Open Terminal](https://github.com/open-webui/open-terminal) is a lightweight API for running shell commands remotely inside a Docker container. It provides full OS-level access — any language, any tool, any shell command — with container-level isolation.

- **Full shell access** — models can install packages, run scripts in any language, use system tools like ffmpeg, git, curl, etc.
- **Container isolation** — runs in its own Docker container, separate from Open WebUI and other services.
- **Rich pre-installed toolset** — the Docker image comes with Python 3.12, data science libraries, build tools, networking utilities, and more.

### Comparison

| Consideration | Pyodide | Jupyter | Open Terminal |
| :--- | :--- | :--- | :--- |
| **Runs in** | Browser (WebAssembly) | Server (Python kernel) | Server (Docker container) |
| **Library support** | Limited subset | Full Python ecosystem | Full OS — any language, any tool |
| **Shell access** | ❌ None | ⚠️ Limited | ✅ Full shell |
| **File persistence** | ❌ Resets each execution | ✅ Shared filesystem | ✅ Container filesystem (until removal) |
| **Isolation** | ✅ Browser sandbox | ❌ Shared environment | ✅ Container-level (when using Docker) |
| **Multi-user safety** | ✅ Per-user by design | ⚠️ Not isolated | ⚠️ Single instance (per-user containers planned) |
| **File generation** | ❌ Very limited | ✅ Full support | ✅ Full support with upload/download |
| **Setup** | None (built-in) | Admin configures globally | Each user adds as a Tool Server |
| **Recommended for orgs** | ✅ Safe default | ❌ Not without isolation | ✅ Per-user by design |
| **Enterprise scalability** | ✅ Client-side, no server load | ❌ Single shared instance | ⚠️ Manual per-user instances |
