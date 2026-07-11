---
title: FAQ
sidebar_position: 12
---

# FAQ

## Basics

### Do I need an AI provider or API key?

No. Files, editor, terminal, and git work with zero AI configuration. Add a model whenever you want chat; an API key, Ollama, or a coding-agent subscription all work: [connect a model](/ecosystem/computer/ai/connect-a-model).

### What do I need to run it?

Python 3.10+ on macOS, Linux, or Windows (`pip install cptr`), or Docker (`ghcr.io/open-webui/computer:latest`). See the [quickstart](/ecosystem/computer/quickstart).

### How is this different from Open WebUI or Open Terminal?

Open WebUI is a chat interface for models; Open Terminal shares a terminal; Computer serves your whole machine to any browser: files, editor, terminal, git, AI, agents. Full comparison: [which tool do I need?](/ecosystem/computer/choose)

### What's the license? Does it cost anything?

Computer is source-available under the Open Use License and free to self-host; commercial and enterprise licenses are available at openwebui.com.

### How do I update?

`pip install --upgrade cptr` (or pull the new Docker image and reuse the same `/data` volume). Database migrations run automatically on startup; no manual step. Details: [updating](/ecosystem/computer/install/updating).

### How do I uninstall?

`pip uninstall cptr`. If you want everything gone, also delete `~/.cptr` (accounts, settings, uploads) and the `.cptr/` folder inside each workspace (chats, artifacts). Your project files are untouched either way.

## Phone and remote

### How do I reach it away from home?

Tailscale is the recommended path: your computer gets a stable private address that works from anywhere. Cloudflare Tunnel and ngrok work too, with their own auth layer in front. Start here: [phone and remote access](/ecosystem/computer/phone-and-remote/).

### Does work keep running when I close the tab?

Yes. Chats, agent tasks, terminals, and scheduled runs all live on the server, not in your browser. Close the tab on the train, reopen from your desk, and everything is where you left it. Only stopping or restarting the server itself ends running terminals and in-flight background sub-agents.

### Does my computer have to stay on?

Yes. Computer serves *your* machine, so a sleeping or powered-off host serves nothing. Stop it from sleeping and start it on boot: [keep it running](/ecosystem/computer/phone-and-remote/keep-it-running).

### Is there a mobile app?

It's a PWA: open it in your phone browser and add it to your home screen for a full-screen, app-like experience. See [use it from your phone](/ecosystem/computer/phone-and-remote/phone-app).

### Is it safe to put on the internet?

Treat it like SSH: anyone who signs in gets full filesystem and shell access to the host. Don't expose the raw port publicly. Use Tailscale or a tunnel with its own access control in front, and read the [security model](/ecosystem/computer/phone-and-remote/security).

## AI and agents

### Can I use my Claude Code or Codex subscription?

Yes. Install and log in to the agent CLI on the machine running Computer, add it in **Settings → Admin → Agents**, and it appears as a chat model. No API key needed, and sessions resume across devices. Setup: [coding agents](/ecosystem/computer/ai/coding-agents).

### Does it work with Ollama?

Yes. Add a connection with provider **OpenAI**, base URL `http://localhost:11434/v1`, and any non-empty API key; your local models are auto-discovered. See [connect a model](/ecosystem/computer/ai/connect-a-model).

### Can I approve what the agent does from my phone?

Yes. Approval prompts appear inline in the chat, and the same **ask**/**auto**/**full** modes and plan mode work from any device. See [approvals and plan mode](/ecosystem/computer/ai/approvals-and-plan-mode).

### Can I message my computer from Telegram or WhatsApp?

Yes. Telegram, Discord, Slack, WhatsApp, and Signal bots all run the full agent in a workspace you choose, and the conversations show up in your sidebar. Setup per platform: [messaging bots](/ecosystem/computer/automate/messaging-bots).

### Can it run tasks on a schedule?

Yes. The **Scheduled** page runs any prompt on a recurring schedule (daily, weekly, hourly), with run history and an optional webhook trigger for CI or cron. See [scheduled tasks](/ecosystem/computer/automate/scheduled-tasks).

### Is there an API?

Yes: an OpenAI-compatible gateway at `/v1`. Each workspace appears as a model (`cptr/<name>`), authenticated with `sk-cptr-...` keys, so any OpenAI client can drive the full agent. Reference: [gateway API](/ecosystem/computer/reference/gateway-api).

### Can I use a workspace from Open WebUI?

Yes. Add the gateway as an OpenAI connection in Open WebUI and your workspaces appear in its model picker. See [use a workspace from Open WebUI](/ecosystem/computer/automate/open-webui).

## Data and privacy

### Where is my data, and what leaves my machine?

Everything is local: accounts, settings, and uploads in `~/.cptr`, chats inside each workspace's `.cptr/` folder. Nothing leaves your machine except the requests you send to providers you configure yourself (model APIs, search providers, bot platforms). Details: [data and backups](/ecosystem/computer/operate/data-and-backups).

### How do I back up?

Copy the data directory (at minimum `app.db`, `config.toml`, and `uploads/`) plus your workspaces; chats travel with them in `.cptr/`. Recipes: [data and backups](/ecosystem/computer/operate/data-and-backups).

## Limits

### Can multiple people use it?

Accounts and admin roles exist, but there is no isolation between users: every signed-in user gets full filesystem and shell access to the host. It's one trust domain, so share it only with people you'd give SSH access to.

### Is HTTPS built in?

No. `cptr run` serves plain HTTP with no TLS flags. Get HTTPS from Tailscale, a tunnel, or a reverse proxy in front: [reverse proxy](/ecosystem/computer/phone-and-remote/reverse-proxy).
