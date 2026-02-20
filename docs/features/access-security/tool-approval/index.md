---
sidebar_position: 50
title: "Tool Approval (Human-in-the-Loop)"
---

## Overview

Open WebUI includes a **Tool Approval** system that gives users real-time control over which tools AI agents can execute during a chat. When enabled, every tool call pauses and presents an approval modal — the user can choose to **Allow Once**, **Always Approve**, or **Decline** the action before it runs.

Approvals are **granular**: you can approve at the level of an individual function (e.g. `read_file`) or an entire parent tool (e.g. `mcp:desktop_commander`). This is especially useful for tools like MCP servers that expose many child functions with varying risk levels.

:::info
Requires **Open WebUI v0.9.0+** (or whichever release includes this feature).
:::

## Enabling Tool Approval

Tool Approval is controlled by the `ENABLE_TOOL_APPROVAL` environment variable and is **enabled by default**.

### Option 1: Admin Panel

1. Log in as an administrator.
2. Navigate to **Admin Settings → General**.
3. Toggle **Enable Tool Approval** on or off.

### Option 2: Environment Variable

Set `ENABLE_TOOL_APPROVAL` in your environment:

```bash
ENABLE_TOOL_APPROVAL=true   # enabled (default)
ENABLE_TOOL_APPROVAL=false  # disabled — all tools run without prompts
```

:::note
This is a `PersistentConfig` variable. After the first launch, changes should be made via the Admin Panel. See [Environment Variable Configuration](/reference/env-configuration) for details.
:::

## How It Works

When a model attempts to call a tool during a chat:

1. The backend checks whether the tool is **auto-approved** (via Always Approved or YOLO Mode).
2. If not, the tool call is paused and a **Tool Approval Modal** appears in the user's browser.
3. The user reviews the tool name, parent tool, and parameters, then chooses an action.
4. The backend executes or skips the tool based on the user's decision.

### Approval Actions

| Action | Behavior |
|--------|----------|
| **Allow Once** | Approves only this specific invocation. Future calls to the same tool will prompt again. |
| **Always Approve (function)** | Approves the specific function (e.g. `web_search`) for the remainder of this chat session. |
| **Always Approve (tool)** | Approves all functions under the parent tool (e.g. all functions within `mcp:desktop_commander`) for this chat session. |
| **Decline** | Rejects the tool call. The model receives a denial response. |

:::warning
"Always Approve" permissions are **per-chat and in-memory only**. They reset when the server restarts or when the user revokes them. They do not persist across browser sessions or server restarts.
:::

### Unrecognized Tool Calls

If a tool call arrives with an unknown parent tool ID, the approval modal displays an **amber warning banner** indicating the call may be invalid and could fail. This can happen when the LLM generates a tool call name that doesn't match any registered tool.

## YOLO Mode

For users who want to skip approval prompts entirely, **YOLO Mode** auto-approves tool calls without showing the modal. It can be configured at two levels:

- **YOLO All Tools** — auto-approves every tool call in the current chat.
- **Per-tool YOLO** — auto-approves only calls to a specific parent tool.

### Enabling YOLO Mode

1. Open a chat.
2. Click the **Integrations** button (component icon below the chat input).
3. Select **YOLO Mode**.
4. Toggle **YOLO All Tools** for blanket approval, or toggle individual tools.

:::danger
YOLO Mode bypasses all approval prompts. Use it only in trusted environments or with tools you have thoroughly reviewed. It is scoped to the current chat and resets on server restart.
:::

## Managing Always-Approved Tools

You can view and revoke always-approved permissions at any time during a chat:

1. Click the **Integrations** button below the chat input.
2. Select **Always Allowed**.
3. A tree view shows parent tools as group headers with their approved child functions listed below.
4. Click the **✕** button next to a function to revoke it, or next to a parent tool to revoke all its functions.
5. Use **Revoke All** to clear every always-approved permission for the current chat.

## Architecture Notes

- All approval state is managed by the `ToolApprovalManager` singleton on the backend, stored in Python dictionaries (in-memory).
- Communication between the frontend and backend uses **Socket.IO** for real-time approval requests and responses.
- If multiple browser tabs are open for the same chat, a **BroadcastChannel** coordinates which tab shows the approval modal to prevent duplicates.
- YOLO Mode checks take priority over Always Approved checks, which take priority over prompting the user.
