---
sidebar_position: 100
title: "🚀 Getting Started"
---

# Getting Started with Open WebUI

**From zero to your first AI conversation in under five minutes.**

Open WebUI runs anywhere (Docker, Kubernetes, pip, bare metal) and connects to Ollama, OpenAI-compatible, and Open Responses providers out of the box. Pick an install method, connect a provider, and start chatting.

---

## ⏱️ Quick Start

**Install Open WebUI, connect a model, and start chatting.**

Everything you need for a working setup. Choose Docker for the fastest path, Python for lightweight installs, or Kubernetes for production orchestration. Each guide includes connecting your first model provider.

| | |
| :--- | :--- |
| 🐳 **Docker** | One-command deploy, the officially recommended path |
| 📦 **Python (pip / uv)** | Lightweight install for low-resource or manual setups |
| ☸️ **Kubernetes (Helm)** | Production-ready orchestration with scaling |
| 🖥️ **Desktop app** | Native app (experimental), no Docker required |
| 🔌 **Connect a provider** | Ollama, OpenAI, Anthropic, llama.cpp, vLLM, and more |
| ⚙️ **Understanding settings** | Learn how Admin Settings and User Settings work together |

[**Start installing →**](/getting-started/quick-start)

---

## Essentials for Open WebUI

**Installed and chatting — now what?**

Five short sections that cover the things every new user eventually wishes they'd known on day one: what plugins are and how to install them, why long chats eventually error out (and how to fix it with a filter), the "invisible" Task Model that powers titles/autocomplete, getting started with RAG over your own documents, and turning on Native tool calling.

| | |
| :--- | :--- |
| 🧩 **Plugins** | Tools, Pipes, Filters, Actions — the extensibility story |
| 🧠 **Context management** | Why long chats hit a wall and how to handle it |
| 🤖 **Task models** | Keep titles, tags, and autocomplete off your main model |
| 📚 **Basic RAG** | Chatting with your own documents |
| 🔧 **Tool calling** | Native mode + first Tools to install |

[**Read the essentials →**](/getting-started/essentials)

---

## 🤖 Connect an Agent

**Go beyond simple model providers. Connect an autonomous AI agent.**

AI agents like Hermes Agent and OpenClaw bring their own tools (terminal, file ops, web search, memory) and use Open WebUI as a rich chat frontend. The agent decides when to use tools, executes them, and streams results back to you.

| | |
| :--- | :--- |
| 🧠 **Hermes Agent** | Nous Research's agent with terminal, file ops, web search, and skills |
| 🐾 **OpenClaw** | Self-hosted agent framework with shell access, web browsing, and channel bots |

[**Connect an agent →**](/getting-started/quick-start/connect-an-agent)

---

## Sharing Open WebUI

**Bring AI to your entire organization with a single deployment.**

Open WebUI isn't just a local interface for AI. It is designed to be a centralized AI operating system for teams. Deploy it once to leverage streamlined onboarding, collaborative intelligence, resource pooling, and centralized security.

| | |
| :--- | :--- |
| **LAN & Tunnels** | Tailscale, Cloudflare Tunnels, and local IP access |
| **Reverse Proxies** | Secure your instance with Nginx, Caddy, or HAProxy |
| **Team Onboarding** | Admin approval flows and Enterprise SSO integrations |
| **Shared Context** | Channels, shared chats, and common knowledge bases |

[**Learn how to share Open WebUI →**](/getting-started/sharing)

---

## 🛠️ Advanced Topics

**Scale, observe, and customize your deployment.**

Go beyond the basics. Configure environment variables, connect external databases, add cloud storage, enable OpenTelemetry, or scale horizontally with Redis and multiple workers.

| | |
| :--- | :--- |
| ⚖️ **Scaling** | Multi-worker, multi-node, Redis-backed sessions |
| 📊 **Logging & observability** | OpenTelemetry traces, metrics, and structured logs |
| 🧪 **Development setup** | Run from source for local development and testing |

[**Explore advanced topics →**](/getting-started/advanced-topics)

---

## 🔄 Updating

**Stay current with the latest features and security patches.**

Update manually with a single Docker or pip command, or automate with Watchtower, WUD, or Diun. Includes backup/restore procedures and version pinning for production.

| | |
| :--- | :--- |
| 🔄 **Manual update** | Docker pull + recreate, or pip upgrade |
| 🤖 **Automated updates** | Watchtower, WUD, or Diun |
| 📌 **Version pinning** | Lock to a specific release for stability |
| 💾 **Backup & restore** | One-command volume backup and recovery |

[**Update guide →**](/getting-started/updating)
