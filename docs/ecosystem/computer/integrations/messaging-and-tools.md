---
title: Message a workspace and add external tools
sidebar_position: 3
---

# Message a workspace and add external tools

Messaging bots are useful when the fastest way to ask your machine a question is the chat app already on your phone. MCP and OpenAPI tools are useful when the agent needs a narrow, declared bridge to another service. Neither should be treated as a casual public chatbot integration.

## Use this when

Jules wants to ask from Telegram, Discord, Slack, WhatsApp, or Signal whether a build passed in a known workspace. Priya wants an agent to call a trusted MCP or OpenAPI service with an explicit credential and tool list.

## Before you start

- Enter at least one exact platform user ID in **Allowed senders** before starting the bot. An empty list accepts every sender who can reach the bot.
- Use a private bot account or channel that you control; do not add the bot to groups, shared workspaces, or public channels. Sender allowlisting is not channel allowlisting.
- Assign the bot a deliberate workspace and model; do not default it to a sensitive host directory. Bots are not workspace-pinned: `/workspace` can switch the bot to any workspace owned by that Computer user.
- For MCP/OpenAPI, obtain the server URL/command, authentication material, and a clear description of the operations it exposes.

## Do it

1. In **Settings → Admin → Bots**, create the adapter configuration, verify its token, select workspace/model, and start it.
2. From an allowed account, send a read-only test such as “Which branch is checked out?” Use `/new` for a fresh conversation where the adapter supports it. Do not use `/workspace` as part of a safe single-workspace deployment.
3. In **Settings → Admin → Tool Servers**, add a stdio/remote MCP or OpenAPI server, set its authentication/custom headers, and run verification before enabling it in a chat.
4. Ask the agent to use one non-destructive external operation and inspect the tool row/result.

Not a fit: do not connect a public community channel, an untrusted group, or a third-party tool server whose data handling and permissions you cannot explain. Use a normal support bot or a constrained service API for that job instead.

## Verify it worked

The bot’s status is running and its allowed test message appears as a Computer chat associated with the selected workspace. Before trusting it, send a harmless message from an unlisted account and confirm no Computer chat is created. A verified tool server lists its available tools, and the test tool call returns the expected non-destructive result.

## If it did not

Stop the bot and recheck its token/webhook configuration, exact Allowed senders IDs, private channel/account boundary, and workspace/model selection. If you need a bot that cannot switch among the owner's workspaces, use a dedicated Computer account or instance containing only the intended workspace. For a tool server, use its verification error to fix the command/URL/auth header; do not bypass verification by granting broader host access.

## Trust boundary

Bots use full approval/high trust: an inbound message can start agent work with host tools in its configured workspace. An empty Allowed senders list accepts every sender, and an allowed sender can switch the bot among the owner’s workspaces with `/workspace`. Use a private account or channel, require exact sender IDs, and prefer a dedicated Computer account or instance when the bot must be confined. MCP/OpenAPI tools run with the credentials and external permissions you provide, and their inputs/results can leave the host. Give each integration the least powerful credential available, and disable it when not needed.

## Choose the external-tool transport

### Stdio MCP

Computer starts a local command on the host under the Computer service account and talks to it through standard input/output. Use this only for commands you would trust that host account to run.

**Verify it worked:** verification lists tools, then a harmless read-only tool call succeeds. **If it did not:** disable the server, check command, arguments, environment, working directory, and the `cptr[mcp]` dependency. Remove it and rotate any credential passed in its environment if you cannot explain the failure.

### Remote MCP

Computer connects to a remote Streamable HTTP MCP endpoint. Prompt arguments and tool results can leave the host for that service.

**Verify it worked:** verification discovers the expected named tools, then a read-only call succeeds. **If it did not:** disable the server, check endpoint and authentication, then revoke or rotate the remote credential before retrying.

### OpenAPI

Computer reads an API description and calls the external service with the headers or bearer credential you configure. A tool can mutate that external system even when it does not touch local files.

**Verify it worked:** verification lists the expected operations; first use a read-only endpoint. **If it did not:** disable the server, correct the specification URL or authentication, and revoke the credential if it may have reached an untrusted endpoint. Do not enable write-capable operations until the read-only verification is understood.
