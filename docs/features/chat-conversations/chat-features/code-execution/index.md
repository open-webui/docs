---
sidebar_position: 1
title: "Code Execution"
---

Open WebUI offers powerful code execution capabilities directly within your chat interface, enabling you to transform ideas into actionable results without leaving the platform.

## Key Features

- **Code Interpreter Capability**: Enable models to autonomously write and execute Python code as part of their responses. Runs via the `execute_code` tool in Native (Agentic) Mode — the only supported tool-calling mode. An older XML-based integration exists for legacy Default Mode but is unsupported; new deployments should use Native Mode.

- **Python Code Execution**: Run Python scripts directly in your browser using Pyodide, or on a server using Jupyter. Supports popular libraries like pandas and matplotlib with no setup required.

- **MermaidJS Rendering**: Create and visualize flowcharts, diagrams, and other visual representations with MermaidJS syntax that automatically renders in your chat.

- **Interactive Artifacts**: Generate and interact with rich content like HTML websites, SVG graphics, and JavaScript visualizations directly within your conversations.

- **Open Terminal**: Connect a remote shell execution API as a tool for full OS-level access — run any command, install packages, and manage files inside an isolated Docker container.

These execution capabilities bridge the gap between conversation and implementation, allowing you to explore ideas, analyze data, and create visual content seamlessly while chatting with AI models.

## Choosing a Code Execution Backend

Open WebUI supports multiple code execution backends, each suited to different use cases. The right choice depends on what you need — lightweight browser-based execution, a full Python environment, or unrestricted shell access.

### Pyodide (Default)

Pyodide runs Python in the browser via WebAssembly. It is sandboxed and safe for multi-user environments, but comes with some constraints:

- **Persistent file storage** — the virtual filesystem at `/mnt/uploads/` is backed by IndexedDB (IDBFS). Files persist across code executions within the same session and survive page reloads.
- **Built-in file browser** — when Code Interpreter is enabled, a file browser panel appears in the chat controls sidebar. You can browse, preview, upload, download, and delete files in the Pyodide filesystem — no terminal needed.
- **User file access** — files attached to messages are automatically placed in `/mnt/uploads/` before code execution, so the model (and your code) can read them directly.
- **Limited library support** — only a subset of Python packages are available. Libraries that rely on C extensions or system calls may not work.
- **No shell access** — cannot run shell commands, install packages, or interact with the OS.

:::tip
Pyodide works well for **text analysis, hash computation, chart generation, file processing**, and other self-contained tasks. Chart libraries like matplotlib produce base64-encoded images that Open WebUI automatically captures, uploads as files, and injects direct image links into the output — so models can display charts directly in chat without any extra setup.
:::

:::warning Best for basic analysis only
Pyodide runs Python via WebAssembly inside the browser. The AI **cannot install additional libraries** beyond the small fixed set listed below — any code that imports an unsupported package will fail. Execution is also **significantly slower** than native Python, and large datasets or CPU-intensive tasks may hit browser memory limits. Pyodide is best suited for **basic file analysis, simple calculations, text processing, and chart generation**. For anything more demanding, use **Open Terminal** instead, which provides full native performance and unrestricted package access inside a Docker container.

Available libraries: micropip, requests, beautifulsoup4, numpy, pandas, matplotlib, seaborn, scikit-learn, scipy, regex, sympy, tiktoken, pytz, and the Python standard library. **Nothing else can be installed at runtime.**
:::

:::note Mutually exclusive with Open Terminal
The Code Interpreter toggle and the Open Terminal toggle cannot be active at the same time. Activating one will deactivate the other — they serve similar purposes but use different execution backends.
:::

### Jupyter (Legacy)

:::caution Legacy Engine
Jupyter is now considered a **legacy** code execution engine. The Pyodide engine is recommended for most use cases, and Open Terminal is recommended when you need full server-side execution. Jupyter support may be deprecated in a future release.
:::

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
- **Built-in file browser** — browse, preview, create, delete, upload, and download files directly from the chat controls panel.
- **Built-in multi-user mode** — a single container can serve multiple users with per-user Linux account isolation (good for small teams, not for large-scale deployments).

For full documentation, see the [Open Terminal integration guide](/features/open-terminal).

### Terminals (Multi-Tenant Orchestrator)

[Terminals](https://github.com/open-webui/terminals) is a multi-tenant orchestrator that provisions and manages **isolated Open Terminal containers per user**. Where Open Terminal is a single instance, Terminals is the scaling layer on top that handles the full lifecycle: provisioning, routing, idle cleanup, and teardown. It requires an [enterprise license](/enterprise).

- **One container per user** — each user gets their own isolated Open Terminal container with its own filesystem, processes, and resources. No shared kernel or process space between users.
- **Automatic lifecycle management** — containers are provisioned on first request, stopped after configurable idle timeout, and cleaned up automatically.
- **Multiple backends** — Docker (one container per user), Kubernetes (Pod + PVC + Service per user), Kubernetes Operator (CRD-based), local (subprocess for dev), or static (proxy to a single instance).
- **Transparent routing** — all Open Terminal API endpoints are available under `/terminals/`. Terminals routes requests to the correct user's container based on the `X-User-Id` header.
- **Enterprise-ready** — supports PostgreSQL for tenant state, JWT authentication against Open WebUI, audit logging, SIEM webhook integration, and encrypted API key storage.
- **Admin dashboard** — built-in frontend for managing tenants and monitoring instances.

:::warning Alpha Software
Terminals is under active development and not yet ready for production use. APIs, configuration, and features may change without notice.
:::

:::note License
Terminals is licensed under the [Open WebUI Enterprise License](/enterprise), not MIT.
:::

### Comparison

| Consideration | Pyodide | Jupyter (Legacy) | Open Terminal | Terminals |
| :--- | :--- | :--- | :--- | :--- |
| **Runs in** | Browser (WebAssembly) | Server (Python kernel) | Server (Docker container) | Server (orchestrated containers) |
| **Library support** | Limited subset | Full Python ecosystem | Full OS — any language, any tool | Full OS — any language, any tool |
| **Shell access** | ❌ None | ⚠️ Limited | ✅ Full shell | ✅ Full shell |
| **File persistence** | ✅ IDBFS (persists across executions & reloads) | ✅ Shared filesystem | ✅ Container filesystem (until removal) | ✅ Persistent volumes per user |
| **File browser** | ✅ Built-in sidebar panel | ❌ None | ✅ Built-in sidebar panel | ✅ Built-in sidebar panel |
| **User file access** | ✅ Attached files placed in `/mnt/uploads/` | ❌ Manual | ✅ Attached files available | ✅ Attached files available |
| **Isolation** | ✅ Browser sandbox | ❌ Shared environment | ✅ Container-level (when using Docker) | ✅ Full container-per-user isolation |
| **Multi-user safety** | ✅ Per-user by design | ⚠️ Not isolated | ℹ️ Built-in multi-user mode (small teams) | ✅ Container-per-user with lifecycle management |
| **File generation** | ✅ Write to `/mnt/uploads/`, download via file browser | ✅ Full support | ✅ Full support with upload/download | ✅ Full support with upload/download |
| **Setup** | None (built-in) | Admin configures globally | Native integration via Settings → Integrations | Separate service + Docker socket or K8s cluster |
| **Recommended for orgs** | ✅ Safe default | ❌ Not without isolation | ℹ️ Best for small teams | ✅ Designed for multi-tenant orgs |
| **Enterprise scalability** | ✅ Client-side, no server load | ❌ Single shared instance | ℹ️ Single container, shared resources | ✅ Horizontally scalable (Docker or Kubernetes) |
| **Idle management** | N/A | N/A | N/A (always running) | ✅ Auto-stop after configurable timeout |
| **License** | MIT | MIT | MIT | [Enterprise](/enterprise) |
