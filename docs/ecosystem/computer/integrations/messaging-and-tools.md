---
title: Messaging bots and external tools
sidebar_position: 6
---

# Messaging bots and external tools

Messaging bots are useful when the fastest way to ask your machine a question is the chat app already on your phone. MCP and OpenAPI tools are useful when the agent needs a declared bridge to another service. They have different trust boundaries, so configure and review them separately.

| Need | Read this |
| --- | --- |
| Message a private Computer workspace through Telegram, Discord, Slack, WhatsApp, or Signal | [Messaging bots](./messaging-bots) |
| Run a trusted local or remote MCP server | [MCP tool servers](./mcp-tool-servers) |
| Call a defined external HTTP API | [OpenAPI tool servers](./openapi-tool-servers) |

## Use this when

Use this when you are choosing the correct integration surface. Do not start with this overview when you need the actual configuration steps; use the specific guide above.

## Before you start

- Enter at least one exact platform user ID in **Allowed senders** before starting the bot. An empty list accepts every sender who can reach the bot.
- Use only a private bot account or channel you control. Sender allowlisting is not channel allowlisting, so do not add the bot to groups, shared workspaces, or public channels.
- For tools, obtain the command or endpoint, authentication material, and a clear description of its operations.

## Do it

1. Pick the specific guide above.
2. Complete its read-only verification before enabling a write-capable bot or tool.

Not a fit: do not connect a public community channel, an untrusted group, or a third-party tool server whose data handling and permissions you cannot explain. Use a normal support bot or a constrained service API for that job instead.

## Verify it worked

The selected guide's read-only test completes and its result appears in the intended Computer chat/tool row.

## If it did not

Stop the integration, correct the named command/endpoint/credential, then rerun the read-only test. If the desired boundary cannot be expressed, do not enable the integration.

## Trust boundary

Bots use full approval/high trust: an inbound message can start agent work with host tools. MCP and OpenAPI tools run with the credentials and external permissions you provide; their inputs/results can leave the host. Give each integration the least powerful credential available, and disable it when not needed.
