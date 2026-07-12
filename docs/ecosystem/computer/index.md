---
title: "Open WebUI Computer"
sidebar_position: 1
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Open WebUI Computer

<ThemedImage
  alt="Open WebUI Computer showing a real workspace from a desktop and phone"
  sources={{
    light: useBaseUrl('/images/banners/computer-light.svg'),
    dark: useBaseUrl('/images/banners/computer-dark.svg'),
  }}
  style={{ width: '100%', margin: '0.25rem 0 1.75rem' }}
/>

**Your computer, from anywhere.**

Open WebUI Computer (`cptr`) runs on your machine and serves the whole thing to any browser: files, editor, terminal, git, AI chat, and coding agents. Open it from your phone, a tablet, or another computer. Everything is exactly where you left it, because it *is* your machine, not a copy of it.

```bash
pip install cptr
cptr run
```

That's the install. It prints a one-time setup link, you create your account, open a folder, and you're looking at your real files in the browser. [Quickstart →](/ecosystem/computer/quickstart) · [View on GitHub →](https://github.com/open-webui/computer)

Wondering what category this thing even is (remote desktop? IDE? AI assistant?): [What is Computer?](/ecosystem/computer/what-is-computer) gives you the mental model in two minutes.

## What do you want to do?

| I want to… | Go to |
| --- | --- |
| See it working in two minutes | [Quickstart](/ecosystem/computer/quickstart) |
| See what people actually do with it | [Use cases](/ecosystem/computer/use-cases/) |
| Use it from my phone, away from home | [Phone & remote access](/ecosystem/computer/phone-and-remote/) |
| Keep terminals and agents running after I close the tab, or when the machine reboots | [Keep it running](/ecosystem/computer/phone-and-remote/keep-it-running) |
| Use the Claude Code / Codex / Cursor subscription I already pay for | [Coding agents](/ecosystem/computer/ai/coding-agents) |
| Connect OpenAI, Anthropic, Ollama, or any compatible API | [Connect a model](/ecosystem/computer/ai/connect-a-model) |
| Message my computer from Telegram, Discord, Slack, WhatsApp, or Signal | [Messaging bots](/ecosystem/computer/automate/messaging-bots) |
| Run AI tasks on a schedule ("run the tests every morning") | [Scheduled tasks](/ecosystem/computer/automate/scheduled-tasks) |
| Use a Computer workspace as a model inside Open WebUI | [Open WebUI integration](/ecosystem/computer/automate/open-webui) |
| Run it in Docker | [Docker](/ecosystem/computer/install/docker) |
| Know where my data lives and how to back it up | [Data and backups](/ecosystem/computer/operate/data-and-backups) |
| Look up a flag, env var, or the gateway API | [Reference](/ecosystem/computer/reference/) |
| Fix something | [Troubleshooting](/ecosystem/computer/troubleshooting) · [FAQ](/ecosystem/computer/faq) |

## What it is

A workstation in a browser tab. Real files with a full editor. A shell that keeps running when you close the tab and is still there when you reconnect from another device. Git (status, diffs, staging, commits, branches) without touching the command line unless you want to. Workspaces for each project, with their chats, layout, and history kept together.

AI is optional and pluggable: bring an API key, point it at local models via Ollama, or plug in a coding agent you already subscribe to. The agent works in your real project: it reads files, edits, runs commands, and browses the web, with approval controls you set per chat. No AI configured? Everything else still works.

## Where it fits

Open WebUI is the AI interface and workflow platform. Open Terminal gives an Open WebUI chat a clean execution environment. Computer serves the machine your work already lives on, and it can also [act as a model provider for Open WebUI](/ecosystem/computer/automate/open-webui). Not sure which you need? [Compare them](/ecosystem/computer/choose).

## Private by design

Computer runs on hardware you control and talks to nothing unless you configure it to. One thing to internalize before you expose it anywhere: a signed-in user has the same power as someone at the keyboard within the boundary you chose, meaning full filesystem and shell access on a bare install, or exactly the folders you mounted if you [run it in Docker](/ecosystem/computer/install/docker). Treat access like SSH, keep it on a private network path like [Tailscale](/ecosystem/computer/phone-and-remote/tailscale), and read the [security model](/ecosystem/computer/phone-and-remote/security) before sharing it with anyone.
