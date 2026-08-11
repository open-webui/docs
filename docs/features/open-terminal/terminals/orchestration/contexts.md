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
Separate workspaces per chat and per automation are provided by the orchestrator. An older orchestrator keeps serving one shared workspace, so **Per chat** and **Per automation** quietly behave like **Shared** until it is upgraded. **Off** and the saved-chat requirement are applied by Open WebUI either way.
:::

## Configure

1. Open **Settings > Admin > Integrations** and scroll to the **Open Terminal** section.
2. Add or edit a connection, then use **Verify Connection** next to the URL so Open WebUI detects the server type. The **Orchestrator** section only appears once the connection is detected as an orchestrator, or when it already carries a **Policy ID**.
3. Expand **Orchestrator** and set **Terminal Contexts**.

| Row | Options |
| :--- | :--- |
| **Chat** | **Shared**, **Per chat**, **Off** |
| **Automation** | **Shared**, **Per automation**, **Off** |

Both rows default to **Shared**, which is the behavior every earlier release had. Leaving them there changes nothing on an existing connection.

## What Each Mode Does

| Mode | Effect |
| :--- | :--- |
| **Shared** | Every chat (or every automation) of the same user works in the same workspace |
| **Per chat** | Each saved chat gets its own workspace, with its own files |
| **Per automation** | Each automation gets its own workspace, reused across that automation's runs |
| **Off** | The terminal is not offered in that context, and requests for it are refused |

The two rows are independent. A terminal can be **Per chat** in chats and **Off** in automations, or **Off** in chats and **Shared** in automations.

Whichever mode you pick applies to the whole terminal: the model's tools, the file browser and the terminal panel all work in the same place.

A terminal that is **Off** for chats is not listed in the chat terminal picker, so users do not run into it. The **Automation** row has no equivalent, because an [automation](/features/chat-conversations/chat-features/automations) runs with the terminal configured on its model and the model editor lists every terminal. A model pointed at a terminal that is closed to automations still works in chat, and its automation runs fail with an error saying the terminal is not available for automations.

## Per Chat Needs a Saved Chat

A per chat workspace belongs to a specific conversation, so the conversation has to exist first. It does once the first message has been sent and the chat appears in the sidebar.

- In a new conversation that has not been sent yet, the terminal panel and file browser for that terminal are not available. They appear once the chat is saved.
- In a [temporary chat](/features/chat-conversations/chat-features/url-params#8-temporary-chat-sessions), a per chat terminal is not listed in the terminal picker at all. A temporary chat is never saved, so there is nothing for the workspace to belong to.
- Nothing quietly falls back to the shared workspace. Before the chat is saved the terminal is refused, and a model told to use it reports an error naming the terminal.

## Capacity

**Per chat** multiplies the number of workspaces a single user can have running, one per chat they work in, each counting against the policy's resource limits. Before switching a busy connection to **Per chat**, set `idle_timeout_minutes` on the policy so workspaces for abandoned chats are cleaned up. See [Policies](/features/open-terminal/terminals/orchestration/policies).

## Pre-Configuring It

The same setting can be shipped in [`TERMINAL_SERVER_CONNECTIONS`](/reference/env-configuration#terminal_server_connections) under the connection's `config.contexts`, which is useful for deployments that configure everything at startup.

## What This Does Not Do

Contexts are not a way to separate users from each other. That is what the orchestrator already does by giving each user their own workspace; contexts subdivide one user's own workspaces further. See [Multi-User Setup](/features/open-terminal/advanced/multi-user) for the isolation tiers.

Contexts also do not apply to a plain Open Terminal server, to connections added through personal **Settings > Integrations** or to any connection Open WebUI has not detected as an orchestrator.
