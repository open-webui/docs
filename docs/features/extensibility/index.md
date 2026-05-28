---
sidebar_position: 0
title: "Extensibility"
---

# 🔌 Extensibility

**Make Open WebUI do anything with Python, HTTP, or community plugins you install in one click.**

Open WebUI ships with powerful defaults, but your workflows aren't default. Extensibility is how you close the gap: give models real-time data, enforce compliance rules, add new AI providers, or connect to any external service. Write a few lines of Python, point at an OpenAPI endpoint, or browse the community library. The platform adapts to you, not the other way around.

There are three layers, and most teams end up using at least two:

- **In-process Python** (Tools & Functions) runs inside Open WebUI itself with zero infrastructure and instant iteration.
- **External HTTP** (OpenAPI & MCP servers) connects to services running anywhere, from a sidecar container to a third-party SaaS.
- **Pipeline workers** (Pipelines) offload heavy or sensitive processing to a separate container, keeping your main instance fast and clean.

---

## Which Extension Do I Need?

The names don't always map obviously to what they do. Start from what you're trying to accomplish:

| I want to... | Use | Why this one |
|---|---|---|
| Let the model **call an API or perform an action** (and keep a secret/API key the user and model can never read) | **[Tool](plugin/tools)** | The key lives inside the tool, server-side. The model only sees the *result*, never the credential. |
| **Add a new model or provider** to the model selector | **[Pipe Function](plugin/functions/pipe)** | A Pipe appears as a selectable "model" and handles the request however you like. |
| **Modify messages** going in or out (redact PII, inject system text, log, translate) | **[Filter Function](plugin/functions/filter)** | Filters run on every message via `inlet`/`outlet`/`stream` without touching model config. |
| Add a **button on a message** that runs custom code | **[Action Function](plugin/functions/action)** | Actions are user-triggered, per-message operations. |
| Teach the model **how to approach a task** (methodology, steps, house style) | **[Skill](/features/workspace/skills)** | Skills are instructions, not code. The model reads them; they don't execute anything. |
| Give the model **documents to retrieve from** | **[Knowledge](/features/workspace/knowledge)** | RAG over your files, attached to a model or referenced with `#`. |
| Save a **reusable prompt** behind a slash command | **[Prompt](/features/workspace/prompts)** | Templated text with typed variables; expands when you type `/name`. |
| Connect an **existing external service** that already speaks HTTP | **[OpenAPI / MCP server](mcp)** | Point Open WebUI at the spec; endpoints become callable tools. No glue code. |

:::tip "Pipe" vs "Pipeline" — not the same thing
This is the single most common naming mix-up. A **Pipe** is a type of **Function** (in-process Python, adds a provider to the model list). A **Pipeline** is a **separate external worker container**. They share a prefix and nothing else. If you want to add a model provider, you almost always want a **Pipe Function**, not a Pipeline.
:::

---

## Why Extensibility?

### Give models real-world abilities

Out of the box, an LLM can only work with what's in its training data and your conversation. Tools let it reach out: check the weather, query a database, call an API, run a calculation. The model decides when to use a tool based on the conversation. You just make the capability available.

### Connect any external service

Have an internal API? A third-party SaaS with an OpenAPI spec? An MCP server already running in your stack? Point Open WebUI at the spec and it discovers endpoints automatically, exposing them as tools the model can call. No glue code, no wrappers.

### Control every message

Functions let you intercept and transform messages before they reach the model (input filters) or before they reach the user (output filters). Help redact PII, enforce formatting rules, log to an observability platform, inject system instructions dynamically, all without touching model configuration.

### Offload heavy processing

When a plugin needs GPU access, large dependencies, or isolated execution, run it as a Pipeline on a separate machine. Open WebUI talks to it over a standard API. Your main instance stays lean.

### Import from the community

Browse hundreds of community-built Tools and Functions from the Open WebUI Community site. Find what you need, click **Import**, and it's live. No `pip install`, no restart.

---

## Key Features

| | |
| :--- | :--- |
| 🐍 **Tools** | Python scripts that give models new abilities: web search, API calls, code execution |
| ⚙️ **Functions** | Platform extensions that add model providers (Pipes), message processing (Filters), or UI actions (Actions) |
| 🔗 **MCP support** | Native Streamable HTTP for Model Context Protocol servers |
| 🌐 **OpenAPI servers** | Auto-discover and expose tools from any OpenAPI-compatible endpoint |
| 🔧 **Pipelines** | Modular plugin framework running on a separate worker for heavy or sensitive processing |
| 📝 **Skills** | Markdown instruction sets that teach models how to approach specific tasks |
| ⚡ **Prompts** | Slash-command templates with typed input variables and versioning |
| 🏪 **Community library** | One-click import of community-built Tools and Functions |

---

## Architecture at a Glance

Understanding which layer to use saves time:

| Layer | Runs where | Best for | Trade-off |
|-------|-----------|----------|-----------|
| **Tools & Functions** | Inside Open WebUI process | Real-time data, filters, UI actions, new providers | Shares resources with the main server |
| **OpenAPI / MCP** | Any HTTP endpoint | Connecting existing services, third-party APIs | Requires a running external server |
| **Pipelines** | Separate Docker container | GPU workloads, heavy dependencies, sandboxed execution | Additional infrastructure to manage |

Most users start with **Tools & Functions**. They require no extra setup, have a built-in code editor, and cover the majority of use cases.

---

## Use Cases

### Real-time data enrichment

A sales team builds a Tool that queries their CRM API. When a rep asks *"What's the latest on the Acme deal?"*, the model calls the tool, retrieves the pipeline stage, last activity, and deal value, and synthesizes a briefing with live data, not stale training knowledge.

### Enterprise compliance filters

A healthcare organization deploys a Filter Function that scans outbound messages for PHI patterns (SSN, MRN, dates of birth). Matches are redacted before the response reaches the user, and the original is logged to their SIEM. No model configuration changes required. The filter runs transparently on every conversation. *(This is an illustrative example. Regex-based filtering may not catch all sensitive data patterns. Organizations with compliance requirements should validate filter coverage independently.)*

### Multi-provider model routing

An engineering team uses Pipe Functions to add Anthropic, Google Vertex AI, and a self-hosted vLLM instance alongside their existing Ollama models. Users see all providers in a single model selector with no separate logins and no API key juggling.

### Heavy-compute pipelines

A research group runs a Retrieval-Augmented Generation pipeline that re-ranks with a cross-encoder model requiring GPU. They deploy it as a Pipeline on a dedicated GPU node. Open WebUI routes relevant queries to the pipeline automatically while keeping the main instance on commodity hardware.

---

## Limitations

### Security

Tools, Functions, and Pipelines execute **arbitrary Python code** on your server. Only install extensions from trusted sources, review code before importing, and restrict Workspace access to administrators. See the [Security Policy](/security) for details.

### Resource sharing

In-process Tools and Functions share CPU and memory with Open WebUI. Computationally expensive plugins should be moved to Pipelines or external services.

### MCP transport

Native MCP support is **Streamable HTTP only**. For stdio or SSE-based MCP servers, use [mcpo](https://github.com/open-webui/mcpo) as a translation proxy.

---

## Dive Deeper

| Topic | What you'll learn |
|-------|-------------------|
| [**Tools & Functions**](plugin) | Writing Python Tools, Functions (Pipes, Filters, Actions), and the development API |
| [**MCP**](mcp) | Connecting Model Context Protocol servers, OAuth setup, troubleshooting |
| [**Pipelines**](pipelines) | Deploying the pipeline worker, building custom pipelines, directory structure |
