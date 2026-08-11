---
sidebar_position: 1.5
title: "Terminal Contexts"
---

# Terminal Contexts

An orchestrator connection can be scoped per context. For chats and for automations separately, an administrator decides two things:

- whether the terminal can be used there at all
- whether everything shares one workspace, or every saved chat (or every automation) gets a workspace of its own

Connections to a plain Open Terminal server have no contexts. They stay available everywhere and always resolve to the same workspace.

:::info Requires Terminals 0.2.0 or newer
The orchestrator resolves the context into a workspace. An older orchestrator ignores the context Open WebUI sends and keeps serving one shared workspace per user and policy, so **Per chat** and **Per automation** quietly behave like **Shared** until it is upgraded. Open WebUI still applies its own half of the setting either way, so **Off** still hides the terminal and **Per chat** still waits for a saved chat.
:::

## Configure

1. Open **Admin Panel > Settings > Integrations** and scroll to the **Open Terminal** section.
2. Add or edit a connection, then use **Verify Connection** next to the URL so Open WebUI detects the server type. The **Orchestrator** section only appears once the connection is detected as an orchestrator, or when it already carries a **Policy ID**.
3. Expand **Orchestrator** and set **Terminal Contexts**.

| Row | Options |
| :--- | :--- |
| **Chat** | **Shared**, **Per chat**, **Off** |
| **Automation** | **Shared**, **Per automation**, **Off** |

Both rows default to **Shared**, which is the behavior every earlier release had.

## What Each Mode Does

| Mode | Effect | Stored in `config.contexts` |
| :--- | :--- | :--- |
| **Shared** | Every chat (or every automation) of the same user reuses the same workspace for that policy | key absent, or `{}` |
| **Per chat** | Each saved chat gets its own workspace, with its own files and its own processes | `{"chat": {"context_id": "chat_id"}}` |
| **Per automation** | Each automation gets its own workspace, reused across that automation's runs | `{"automation": {"context_id": "automation_id"}}` |
| **Off** | The terminal is not offered in that context, and requests for it are refused | `{"chat": false}` or `{"automation": false}` |

Saving with both rows on **Shared** stores no `contexts` block at all, so an existing connection keeps working untouched.

Open WebUI sends the resolved context to the orchestrator as an `X-Terminal-Context-Id` header, holding `chat:<chat-id>` or `automation:<automation-id>`. **Shared** sends no header, which the orchestrator reads as its `default` context. The same value is sent for the model's terminal tools, for the file browser and for the interactive terminal WebSocket, so all three land in the same workspace.

The two rows are independent. A terminal can be **Per chat** in chats and **Off** in automations, or **Off** in chats and **Shared** in automations.

**Off** is enforced on the server, so a terminal closed to a context cannot be reached from it whatever the client does. The chat terminal picker hides such a terminal, so users do not run into it there. The **Automation** row has no equivalent: an [automation](/features/chat-conversations/chat-features/automations) runs with the terminal configured on its model, and the model editor's terminal list shows every terminal regardless of context. A model pointed at a terminal that is closed to automations still works in chat, and its automation runs fail with an error saying the terminal is not available for automations.

## Per Chat Needs a Saved Chat

A per chat workspace is keyed on the chat's ID, so the chat has to exist first. Open WebUI creates the chat record when the first message is sent.

- In a new conversation that has not been sent yet, the terminal panel and file browser for that terminal are not available. They appear once the chat is saved.
- In a [temporary chat](/features/chat-conversations/chat-features/url-params#8-temporary-chat-sessions), a per chat terminal is not listed in the terminal picker at all. A temporary chat is never saved, so there is nothing to key the workspace on.
- A request that still reaches the backend without a saved chat is refused rather than silently falling back to the shared workspace. The proxy answers `409`, the terminal WebSocket closes with code `4003` and the model's terminal tools fail with an error naming the terminal.

## Capacity

Each context is a separate workspace: a separate container on Docker, a separate pod on Kubernetes and separate persisted files. **Per chat** therefore multiplies the number of workspaces a single user can have running, one per chat they touch, each counting against the policy's CPU, memory and storage.

Plan for that before switching a busy connection to **Per chat**:

- Set `idle_timeout_minutes` on the policy so abandoned chat workspaces are reaped. See [Policies](/features/open-terminal/terminals/orchestration/policies).
- Keep an eye on `TERMINALS_MAX_CPU`, `TERMINALS_MAX_MEMORY` and `TERMINALS_MAX_STORAGE`, which cap each workspace and not the total.

## Pre-Configuring It

The same setting can be shipped in [`TERMINAL_SERVER_CONNECTIONS`](/reference/env-configuration#terminal_server_connections) under the connection's `config.contexts`, which is useful for deployments that configure everything at startup.

## What This Does Not Do

Contexts are not a user isolation mechanism. Separating users is what the orchestrator already does through per-user workspaces, and contexts subdivide one user's workspaces further. See [Multi-User Setup](/features/open-terminal/advanced/multi-user) for the isolation tiers.

Contexts also do not apply to a plain Open Terminal server, to connections added through personal **Settings > Integrations** or to any connection Open WebUI has not detected as an orchestrator.
