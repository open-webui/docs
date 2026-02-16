---
sidebar_position: 3.5
title: Tool Selection Guide
---

# Choosing the Right Tool/Function Type

Confused about which "tool" or "function" capability to use?
This guide will help you decide.

## Quick Decision Tree

```
Do you need to add new AI capabilities (web search, image gen, etc.)?
├── YES → Use Native Features (built-in)
│   └── Enable in Admin Settings, toggle per-chat
│
└── NO → Continue...

Do you need custom Python code to run on the server?
├── YES → Continue...
│   ├── Is this a simple input/output transformation?
│   │   ├── YES → Use Functions (Filters/Pipes)
│   │   └── NO → Use Workspace Tools
│   │
│   └── Need to offload heavy processing?
│       ├── YES → Use Pipelines (separate container)
│       └── NO → Use Workspace Tools
│
└── NO → Continue...

Do you need to connect external services via API?
├── YES → Use OpenAPI Servers or MCP
│   ├── Standard REST API? → OpenAPI Server
│   └── MCP-compatible service? → MCP (via HTTP or MCPO proxy)
│
└── NO → You probably don't need tools!
```

## Detailed Comparison

| Type | Location | Runtime | Best For | Security |
|------|----------|---------|----------|----------|
| **Native Features** | Admin Settings | Built-in | Core platform capabilities | Built-in |
| **Workspace Tools** | Workspace > Tools | Open WebUI backend | Custom Python utilities | Review code first! |
| **Functions** | Workspace > Functions | Open WebUI backend | Input/output filtering | Review code first! |
| **Pipelines** | External container | Separate process | Heavy processing, isolation | Network-isolated |
| **MCP** | External server | Standalone | External tool integration | HTTP/mTLS |
| **OpenAPI** | External server | Standalone | REST API integration | HTTP/mTLS |

## Common Scenarios

### "I want the AI to search the web"

→ **Native Web Search** (Admin > Settings > Web Search)
No code required.
Toggle in chat UI.

### "I need a custom weather lookup API"

→ **Workspace Tool**
Write Python to call weather API.
Simple, integrated.

### "I want to filter out PII before sending to AI"

→ **Function (Filter)**
Transform messages before they reach the model.
Lightweight processing.

### "I need to run heavy ML models for document classification"

→ **Pipeline**
Runs in separate container.
Doesn't slow down main Open WebUI.

### "I want to connect to my company's internal API"

→ **OpenAPI Server**
Provide OpenAPI spec.
Automatic tool generation.

### "I have a Claude Desktop MCP server I want to use"

→ **MCP via MCPO**
Use MCPO proxy to bridge stdio MCP to HTTP.
Connect in Settings > Connections.
