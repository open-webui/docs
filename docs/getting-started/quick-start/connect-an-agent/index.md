---
sidebar_position: 0
title: "Connect an Agent"
---

# 🤖 Connect an Agent

**Use Open WebUI as the chat frontend for autonomous AI agents.**

AI agents go beyond simple model providers. They can execute terminal commands, read and write files, search the web, manage memory, and chain complex workflows. Because many agent frameworks expose an **OpenAI-compatible API**, Open WebUI can serve as a polished, full-featured chat interface for them with minimal setup.

---

## How Is This Different from a Provider?

When you [connect a provider](/getting-started/quick-start/connect-a-provider/starting-with-openai-compatible), you're connecting to a **model**. It receives your message and returns a response. That's it.

When you connect an **agent**, you're connecting to an autonomous system that can:

- 🖥️ **Run terminal commands** on your machine
- 📁 **Read and write files** in your workspace
- 🔍 **Search the web** for real-time information
- 🧠 **Maintain memory** across conversations
- 🧩 **Use skills and plugins** to extend its capabilities
- 🔗 **Chain multiple tool calls** to solve complex tasks

The agent decides when and how to use these tools based on your message, and Open WebUI displays the results in a familiar chat interface.

---

## Available Agents

| Agent | Description | Guide |
|-------|-------------|-------|
| **Hermes Agent** | Autonomous agent by Nous Research with terminal, file ops, web search, memory, and extensible skills | [Set up Hermes Agent →](./hermes-agent) |
| **OpenClaw** | Open-source self-hosted agent framework with shell access, file operations, web browsing, and messaging channel integrations | [Set up OpenClaw →](./openclaw) |

---

## How It Works

Regardless of which agent you connect, the architecture is the same:

```
┌──────────────┐         ┌──────────────────┐         ┌──────────────┐
│              │  HTTP    │                  │  Tools  │              │
│  Open WebUI  │────────▶│   Agent Gateway  │────────▶│  Terminal,   │
│  (frontend)  │◀────────│   (API server)   │◀────────│  Files, Web  │
│              │  Stream  │                  │  Results│              │
└──────────────┘         └──────────────────┘         └──────────────┘
```

1. **You type a message** in Open WebUI
2. Open WebUI sends it to the agent's API server (just like it would to OpenAI)
3. The agent **decides which tools to use**, executes them, and reasons about the results
4. The final response **streams back** to Open WebUI with optional progress indicators
5. You see the response in the familiar chat interface, with full conversation history, user accounts, and all Open WebUI features

:::tip
Because agents speak the standard OpenAI Chat Completions protocol, adding one is as simple as adding the URL and API key in **Admin Settings → Connections → OpenAI**. No plugins, no pipes, no middleware required.
:::
