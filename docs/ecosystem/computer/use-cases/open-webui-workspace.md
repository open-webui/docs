---
title: "Use Open WebUI with a real workspace"
sidebar_position: 11
---

# Use Open WebUI with a real workspace

Use this when Open WebUI is where you choose models and organize AI conversations, but the actual work must happen in one machine’s repository, files, terminal, or authenticated local tools. The combined workflow avoids pretending that a generic chat already has your local environment; Open WebUI Computer supplies that real workspace behind the request.

## Use this when

You want Open WebUI as the AI front door and Open WebUI Computer as the place the agent performs work. Use Open WebUI alone for knowledge and chat that do not need a particular machine. Use Computer alone when you mainly need files, terminal, or git without an external AI front door.

## Before you start

- Complete the [local trial](/ecosystem/computer/getting-started/local-trial) and [first workspace](/ecosystem/computer/getting-started/first-workspace), then run both services where Open WebUI can reach Computer’s gateway over a private, trusted network.
- Create the target workspace and configure its default agent or model in Computer.
- Gateway requests use **full tool approval**. Computer does not pause for an interactive confirmation before each tool action, so connect only a trusted Open WebUI user and a workspace you are willing to let that request act in. Read the [detailed gateway guide](/ecosystem/computer/integrations/open-webui-gateway) before creating a key.
- Create a gateway key and follow the detailed guide for the exact connection and continuity headers.

## Do it

1. Add the Computer gateway as an OpenAI API connection in Open WebUI using the documented `/v1` base URL and gateway credential.
2. Add the documented continuity headers, save the connection, and select the workspace model shown as `cptr/your-workspace`.
3. Ask a small read-only question about a known file in that workspace.
4. Open Computer and inspect the workspace chat and activity produced by the request before trying a task that edits files or runs commands.

## Verify it worked

The workspace appears in Open WebUI’s model picker, its answer refers to real workspace state, and the corresponding activity is visible in the selected Computer workspace. A follow-up continues the intended Computer conversation when the documented headers are configured.

## If it did not

- Call `GET /v1/models` with the same credential to separate a connection/authentication problem from model selection.
- Recheck the base URL, gateway key, user access, and workspace availability.
- If normal messages work but continuity does not, recopy the headers from the gateway setup page rather than creating an ad hoc integration.

## Trust boundary

The gateway credential authorizes shell-capable agent work in the owning user’s Computer workspaces. It does not synchronize users, chats, knowledge bases, or configuration between the products, and it is not an isolation boundary.
