---
title: Gateway API (OpenAI-compatible)
sidebar_position: 5
---

# Gateway API (OpenAI-compatible)

The gateway exposes each of your workspaces as an OpenAI-compatible model, so any OpenAI-style client can run agent tasks in a real workspace.

| Endpoint | Behavior |
| --- | --- |
| `GET /v1/models` | Lists the key owner's workspaces as models. |
| `POST /v1/chat/completions` | Runs an agent task in the selected workspace. Streams SSE by default. |

```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Authorization: Bearer sk-cptr-..." \
  -H "Content-Type: application/json" \
  -d '{"model": "cptr/my-project", "messages": [{"role": "user", "content": "Summarize the README"}]}'
```

Connecting Open WebUI? Follow the walkthrough at [Use Computer from Open WebUI](/ecosystem/computer/automate/open-webui); this page is the endpoint reference.

## API keys

Create keys in **Settings → Admin → Gateway**. The `sk-cptr-...` value is shown once and stored hashed, so copy it immediately. Key management itself (creating, revoking) requires a browser session; you can't manage keys with a bearer key.

## Workspaces as models

Each workspace owned by the key's user appears as `cptr/<folder-name>`; duplicate folder names get a `-2` suffix. Which underlying model executes the task, in priority order:

1. The model set in **Settings → Admin → Gateway**
2. A `<workspace>/.cptr/model` override file
3. The default chat model
4. The first model of the first enabled connection

## Conversation continuity

Stateless requests create a new Computer chat each time. To continue a conversation, send `X-Chat-Id` (any client) or the Open WebUI header set:

```json
{
  "X-OpenWebUI-Chat-Id": "{{CHAT_ID}}",
  "X-OpenWebUI-Message-Id": "{{MESSAGE_ID}}",
  "X-OpenWebUI-User-Message-Id": "{{USER_MESSAGE_ID}}",
  "X-OpenWebUI-User-Message-Parent-Id": "{{USER_MESSAGE_PARENT_ID}}",
  "X-OpenWebUI-Task": "{{TASK}}"
}
```

`{{USER_MESSAGE_ID}}`, `{{USER_MESSAGE_PARENT_ID}}`, and `{{TASK}}` require Open WebUI 0.10.0 or newer. Without them, basic chat works, but edit/regeneration branches and utility-task filtering don't.

Requests that Open WebUI marks as title, tag, or follow-up generation (via `X-OpenWebUI-Task`) are answered by the plain LLM without starting an agent task in the workspace.

## Limits

:::warning Gateway tasks run with full tool approval
There is no per-action approval in the OpenAI-compatible API: the agent edits files, runs commands, and calls tools without asking. Treat a gateway key like an SSH credential and only hand it to clients you trust.
:::

- `temperature`, `top_p`, and `max_tokens` are accepted but ignored; the workspace's configured model and settings apply.
- `usage` token counts in responses are always 0.
- Streams idle for 300 seconds are closed.
