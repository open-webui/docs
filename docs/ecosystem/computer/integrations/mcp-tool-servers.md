---
title: MCP tool servers
sidebar_position: 8
---

# MCP tool servers

MCP gives an agent named tools from another service. Use it when the service has a clear, narrow capability you trust the agent to call. Choose the transport carefully: a local stdio server runs a command on the Computer host; a remote server receives requests over the network.

## Use this when

You want a trusted agent to use an MCP server for a declared task, such as reading a private service or performing one controlled action.

## Before you start

- Install the MCP extra for local MCP support: `pip install 'cptr[mcp]'`.
- For stdio, review the exact command, arguments, environment, and host account it will run under.
- For remote MCP, review the endpoint, its data handling, and its least-privileged credential.

## Do it

1. In **Settings → Admin → Tool Servers**, add the stdio or remote MCP server and its authentication.
2. Run verification and inspect the discovered tool names before enabling it in a chat.
3. Make one read-only tool call, then consider whether write-capable tools are justified.

## Verify it worked

Verification lists the expected tools, and a read-only call returns the expected result in the chat tool row.

## If it did not

Disable the server. For stdio, correct the command, arguments, environment, working directory, or local dependency. For remote MCP, correct the endpoint/authentication and rotate the credential if it may have reached an untrusted endpoint.

## Trust boundary

Stdio MCP starts a local process under the Computer service account. Remote MCP sends arguments and receives results through the remote service. Both can expose workspace context or cause external effects; do not enable a server whose behavior you cannot explain.
