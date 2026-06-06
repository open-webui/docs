---
title: "Computer (cptr)"
sidebar_position: 1
---

# 🖥️ Computer (cptr)

**Your computer, in a browser tab. From anywhere.**

`cptr` (short for "computer") runs on a machine you own and serves the whole thing to a browser: files, a code editor, a terminal and git, all in one tab. Open it from your phone on the train, your laptop at a cafe, or a tablet on the couch. Push a hotfix, check a deploy, stage and commit, or drop into the terminal and work the old way. Close the tab and come back tomorrow on any device; sessions survive disconnects and everything is where you left it.

AI is built in but optional. Bring your own key and it becomes an agent that can read, search, edit and run things in your project. Leave the key out and cptr is still a full computer, just without the assistant.

[**View on GitHub →**](https://github.com/open-webui/computer) · [**Read the Manifesto →**](https://github.com/open-webui/computer/blob/main/MANIFESTO.md)

:::info New, and moving fast
cptr is a young project (currently v0.1.x) and a **separate product** from Open WebUI, not a plugin or an integration. Expect rapid changes. The [GitHub repo](https://github.com/open-webui/computer) is the source of truth for the latest.
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

## What you get

- **Terminal.** A real PTY-backed shell in the browser (macOS, Linux and Windows). Anything you would do over SSH.
- **File browser and editor.** Navigate, view, edit and manage files, with icons by type. Markdown previews inline.
- **Git, without the command line.** See status, stage and commit from a git panel, or drop into the terminal if you prefer.
- **Workspaces.** Manage several project directories from one instance and switch between them without losing your place.
- **Quick open and shortcuts.** `Cmd+K` to jump to files and commands, plus a customisable keybinding system.
- **Port preview.** A built-in reverse proxy detects ports your processes open, so you can preview a running app in another tab.
- **Optional AI agent.** A chat panel with multi-provider support (Anthropic, OpenAI, Ollama and OpenAI-compatible endpoints). With a key it can read, search and edit files, run shell commands, search the web and read URLs. Mention files with `@`, queue follow-up messages, and review or edit the AI's changes before they apply.

Chats are stored as files too, so your AI conversations are searchable, editable and commit-able alongside your code.

## Install and run

cptr is a Python package:

```bash
pip install cptr
```

Start the server and it opens in your browser:

```bash
cptr run
```

To reach it from other devices on your network, bind to all interfaces:

```bash
cptr run --host 0.0.0.0
```

`cptr run` prints a one-time setup URL with a token, for example `http://localhost:8000/?token=...`. Other flags: `--port` (default `8000`), `--headless` (do not auto-open a browser) and `--reload` (for development).

State lives in `~/.cptr` by default; set `CPTR_DATA_DIR` to change it. After first-time setup you log in with a username and password, and sessions use JWTs.

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

It is **not** safe if untrusted users share the instance, it is reachable from the public internet, or a reverse proxy in front of it forwards spoofable authentication headers. If you want to reach cptr from outside your machine, put it behind a VPN or a tunnel rather than opening a public port, the same way you would treat SSH.

## License

cptr is released under the **Open Use License**: the source is available, but it is not MIT or otherwise open source, and all rights are reserved. [Enterprise licenses are available](mailto:sales@openwebui.com). See the [LICENSE](https://github.com/open-webui/computer/blob/main/LICENSE) file for the exact terms.
