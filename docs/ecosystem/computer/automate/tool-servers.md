---
title: MCP and OpenAPI tool servers
sidebar_position: 6
---

# MCP and OpenAPI tool servers

Give the agent tools beyond the built-ins by connecting external tool servers in **Settings → Admin → Tool Servers**. Three server types are supported:

| Type | What you configure | How it runs |
| --- | --- | --- |
| **OpenAPI** | Spec URL + path (default `openapi.json`) | Computer calls the HTTP API; every operation with an `operationId` becomes a tool |
| **MCP (remote)** | Server URL | Streamable-HTTP transport to a remote MCP server |
| **MCP (stdio)** | Command, args, env, cwd | Computer starts the process locally, keeps it alive, and respawns it if it dies |

MCP support needs the optional dependency group (the Docker image already includes it):

```bash
pip install 'cptr[mcp]'
```

## Add a server

1. In **Settings → Admin → Tool Servers**, add a server and pick its type.
2. Give it an **id**: lowercase letters, digits, and underscores only (`[a-z0-9_]`). Tools appear to the model as `<server_id>_<tool_name>`, so keep it short and recognizable.
3. Fill in the type-specific fields: spec URL and path for OpenAPI, URL for remote MCP, or command/args/env/cwd for stdio MCP.
4. Add auth if the server needs it: a bearer key and/or custom headers. For stdio servers, pass credentials through the process env instead.
5. Click **Verify**: it connects and lists the discovered tools so you can check what you're enabling before saving.

Once saved, the tools are available to the agent alongside the built-in file, terminal, and web tools.

:::info
A stdio MCP server is a real process running on the Computer host under the same account as Computer itself, and remote servers receive whatever arguments the agent sends. Only connect servers you trust with your workspace context.
:::
