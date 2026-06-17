---
title: "Computer (cptr)"
sidebar_position: 1
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# 🖥️ Computer (cptr)

<ThemedImage
  alt="Computer (cptr): the cptr workspace running on a desktop screen and a phone, the same session across devices, with optional AI"
  sources={{
    light: useBaseUrl('/images/banners/computer-light.svg'),
    dark: useBaseUrl('/images/banners/computer-dark.svg'),
  }}
  style={{ width: '100%', margin: '0.25rem 0 1.75rem' }}
/>

**Your computer, in a browser tab. From anywhere.**

`cptr` (short for "computer") runs on a machine you own and serves the whole thing to a browser: files, a code editor, a terminal and git, all in one tab. Open it from your phone on the train, your laptop at a cafe, or a tablet on the couch. Push a hotfix, check a deploy, stage and commit, or drop into the terminal and work the old way. Close the tab and come back tomorrow on any device; sessions survive disconnects and everything is where you left it.

AI is built in but optional. Bring your own key and it becomes an agent that can read, search, edit and run things in your project. Leave the key out and cptr is still a full computer, just without the assistant.

[**View on GitHub →**](https://github.com/open-webui/computer) · [**Read the Manifesto →**](https://github.com/open-webui/computer/blob/main/MANIFESTO.md)

:::info New, and moving fast
cptr is a young project (currently v0.5.x) and a **separate product** from Open WebUI, not a plugin or an integration. Expect rapid changes. The [GitHub repo](https://github.com/open-webui/computer) is the source of truth for the latest.
:::

## cptr vs Open Terminal

These two look related because both involve a terminal and an AI, but they sit on opposite sides of the same idea. The short version: **[Open Terminal](/features/open-terminal) gives the Open WebUI chat AI a computer to work on; cptr gives _you_ your computer, with AI as an optional helper.**

| | [Open Terminal](/features/open-terminal) | Computer (cptr) |
| :--- | :--- | :--- |
| **What it is** | A shell-execution backend you connect to Open WebUI as a tool | A standalone app: your machine (files, editor, terminal, git) in a browser |
| **Who drives** | The AI runs commands for you during a chat | You operate the machine; the AI assists when asked |
| **Center of gravity** | Chat first. The terminal is a tool the model calls | Computer first. Chat is one panel beside files, editor and git |
| **Runs as** | A component connected to an Open WebUI instance | Its own app (`pip install cptr`), not connected to Open WebUI |
| **Interface** | The Open WebUI chat UI | A mobile-first workspace: file browser, editor, terminal, git |
| **AI** | Required (it exists for the chat model to use) | Optional (bring your own key; works without it) |
| **License** | MIT | Open Use License (source-available) |

If you want the model to build software for you inside a chat, that is Open Terminal. If you want to _be_ at your computer from your phone, with the model as an extra pair of hands, that is cptr.

## What you can do

cptr is a full workspace with an optional AI agent on top:

- **The computer you operate.** A browser-based terminal, file browser, code editor and git across multiple project workspaces, with global search, live port previews and voice memos.
- **An optional AI agent.** With your own key it reads, edits and runs code, browses the web, uses external MCP/OpenAPI tool servers and spins up sub-agents, following skills you define. Every change waits for your approval.
- **Automation and reach.** Scheduled automations, messaging bots (Telegram, Discord, Slack, WhatsApp, Signal) and an OpenAI-compatible gateway that lets Open WebUI drive a workspace as a model.

See the [**full feature list**](/features/computer/features), and [**Connect to Open WebUI**](/features/computer/open-webui) to use a cptr workspace as a model from your own Open WebUI instance.

## Install and run

cptr is a Python package (Python 3.10 or newer):

```bash
pip install cptr
```

Start the server and it opens in your browser:

```bash
cptr run
```

By default `cptr run` listens on `127.0.0.1`, so it is reachable only from the machine it runs on. To open it to other devices on your network, bind to all interfaces:

```bash
cptr run --host 0.0.0.0
```

`cptr run` prints a one-time setup URL with a token, for example `http://localhost:8000/?token=...`. Other flags: `--port` (default `8000`), `--headless` (do not auto-open a browser) and `--reload` (for development).

State lives in `~/.cptr` by default; set `CPTR_DATA_DIR` to change it. After first-time setup you log in with a username and password, and sessions use JWTs.

For operations, cptr can write structured logs and an audit trail. Set `CPTR_AUDIT_LOG_LEVEL` to log every mutating API request (POST, PUT, PATCH, DELETE) to a JSON file with passwords and API keys redacted, and `CPTR_LOG_UPSTREAM_REQUESTS=true` to log outgoing AI API calls (provider, model, endpoint) to a separate file for debugging and cost tracking.

### Docker

```bash
docker run --rm -it \
  -p 8000:8000 \
  -v cptr-data:/data \
  -v "$PWD:/workspace" \
  -w /workspace \
  ghcr.io/open-webui/computer:latest
```

State is stored in `/data`. Mount the project you want to work on into the container with `-v "$PWD:/workspace"` so cptr can reach it. A `:dev` image tracks the `main` branch.

## Security model

:::danger Treat a shared cptr like an open SSH port
Once a user is authenticated, cptr gives them **full access to the host filesystem and shell**, the same as an SSH session. There is **no path sandboxing and no per-user isolation**. The AI's file read and edit tools are confined to the active workspace, but shell access (the terminal, and the AI's run-command tool) is not.
:::

cptr is designed as "your computer, served to you", so that level of access is the point, not a flaw. It is safe **only** when both of these hold:

- you are the only user, and
- you control the network it is exposed on.

It is **not** safe if untrusted users share the instance, it is reachable from the public internet, or a reverse proxy in front of it forwards spoofable authentication headers. By default cptr binds to localhost only, so reaching it from another machine is an explicit opt-in (`cptr run --host 0.0.0.0`, or publishing the Docker port). When you do open it up, put it behind a VPN or a tunnel rather than a public port, the same way you would treat SSH.

## License

cptr is released under the **Open Use License**: the source is available, but it is not MIT or otherwise open source, and all rights are reserved. [Enterprise licenses are available](mailto:sales@openwebui.com). See the [LICENSE](https://github.com/open-webui/computer/blob/main/LICENSE) file for the exact terms.
