---
sidebar_position: 150
title: "📖 Reference"
---

# Reference

**The technical details behind every knob, endpoint, and configuration option.**

Open WebUI is highly configurable. This section is the canonical source of truth for environment variables, API endpoints, network architecture, reverse proxy setups, and production monitoring. Whether you're tuning a single setting or architecting a multi-node deployment, start here.

---

## ⚙️ Environment Variable Configuration

**Every flag, path, and secret Open WebUI reads at startup, in one place.**

Over 200 environment variables control authentication, model routing, storage, logging, and more. Understand `PersistentConfig` behavior, troubleshoot ignored settings, and find the exact variable you need.

| | |
| :--- | :--- |
| 🔐 **Authentication & signup** | `ENABLE_SIGNUP`, `ENABLE_LOGIN_FORM`, `WEBUI_ADMIN_EMAIL`, OIDC/LDAP/SCIM |
| 🤖 **Model connections** | Ollama, OpenAI, direct pipeline URLs, timeouts, load balancing |
| 💾 **Storage & databases** | SQLite, PostgreSQL, S3/GCS/Azure Blob, Redis |
| 📊 **Logging & audit** | `GLOBAL_LOG_LEVEL`, JSON logging, audit log levels and paths |
| 🧠 **RAG & retrieval** | Chunk size, overlap, embedding engines, reranking, vector DB selection |

[**Browse all environment variables →**](/reference/env-configuration)

---

## 🔌 API Endpoints

**OpenAI-compatible and Anthropic-compatible APIs, plus RAG, file management, and Ollama proxy routes.**

Open WebUI exposes a full REST API authenticated via Bearer tokens or JWTs. Use the same endpoints the web UI uses to build automations, chatbots, and custom integrations.

| | |
| :--- | :--- |
| 💬 **Chat completions** | `POST /api/chat/completions`, OpenAI-compatible |
| 🔮 **Anthropic messages** | `POST /api/v1/messages`, works with the Anthropic SDK and Claude Code |
| 🦙 **Ollama proxy** | `/ollama/api/*`, passthrough to native Ollama endpoints |
| 📄 **File & knowledge** | Upload files, build knowledge collections, query via RAG |
| 🔧 **Filters & outlets** | Inlet, stream, and outlet hooks for every request |

[**Explore the API →**](/reference/api-endpoints)

---

## 🌐 Network Diagrams

**See exactly how Open WebUI, Ollama, and Docker talk to each other.**

Visual C4 diagrams for every common deployment topology: host networking, Docker Compose stacks, separate networks, and Linux vs. macOS/Windows differences. Use these to debug connectivity issues or plan your architecture.

| | |
| :--- | :--- |
| 🖥️ **macOS / Windows** | Host Ollama, Compose stack, separate networks, host-network pitfalls |
| 🐧 **Linux** | Same topologies with Linux-specific networking behavior |

[**View network diagrams →**](/reference/network-diagrams)

---

## 🔒 HTTPS Configuration

**Terminate TLS in front of Open WebUI with Nginx, Caddy, or HAProxy.**

Step-by-step reverse proxy configurations for securing your deployment with HTTPS. Each guide includes certificate handling, WebSocket support, and production-hardened settings.

| | |
| :--- | :--- |
| 🟢 **Nginx** | Full config with SSL termination, WebSocket proxying, and headers |
| ⚡ **Caddy** | Automatic HTTPS with minimal configuration |
| 🔄 **HAProxy** | Enterprise-grade load balancing with TLS offloading |
| ☁️ **Cloudflare Tunnel** | Expose Open WebUI securely without opening ports |
| 🧪 **ngrok** | Instant HTTPS tunnels for development and testing |

[**Set up HTTPS →**](/reference/https)

---

## 📊 Monitoring

**Observe your deployment with OpenTelemetry, Prometheus, Grafana, and Langfuse.**

Production monitoring guides covering traces, metrics, structured logs, and LLM-specific observability. Integrate with your existing observability stack or set up a new one from scratch.

| | |
| :--- | :--- |
| 📡 **OpenTelemetry** | Traces, metrics, and logs piped to any OTLP-compatible backend |
| 📈 **Dashboards** | Prometheus + Grafana for real-time system and model metrics |
| 🔍 **LLM tracing** | Langfuse integration for prompt-level observability |

[**Set up monitoring →**](/reference/monitoring)
