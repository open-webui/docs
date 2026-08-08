---
sidebar_position: 45
title: "Server-Side Tool Calling (API)"
---

# Server-Side Tool Calling over the API

**Send a prompt to Open WebUI, have Open WebUI run the tools, and get the finished answer back.**

This page covers the exact requests you need when you want the *server* to do the agentic work: the model decides to call a tool, Open WebUI executes it with your user's credentials and permissions, feeds the result back to the model, and repeats until the model is done. Your script never sees a `tool_calls` object it has to execute itself.

That includes:

- **[Built-in tools](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode)**: web search, knowledge and file browsing, code interpreter, notes, channels, memory, calendar, automations, sub-agents, image generation.
- **[Workspace tools](/features/extensibility/plugin/tools)**: your own Python tools.
- **[MCP servers](/features/extensibility/mcp)** and OpenAPI tool servers configured in Open WebUI.
- **[Open Terminal](/features/open-terminal)**: the terminal server the model or your user has access to.

---

## Before you start

| You need | Where |
| :--- | :--- |
| An API key | [API Keys](/features/authentication-access/api-keys). An admin has to enable the global **API Keys** toggle first, and non-admins also need the **API Keys** feature permission. |
| The permissions the tools require | The key acts as *you*. Web search, code interpreter, image generation, notes, channels, memory and file upload are each gated by a [user permission](/features/authentication-access/rbac/permissions) as well as by the global admin toggle. If your user cannot do it in the browser, the key cannot do it either. |
| A model with **Native** function calling | [Tool Calling Modes](/features/extensibility/plugin/tools#tool-calling-modes-default-vs-native). Native is the default and the only mode that supports built-in tools and multi-round loops. |
| A model whose capabilities are not switched off | Built-in tools respect the per-model **Builtin Tools** categories and capabilities. See [Disabling Builtin Tools (Per-Model)](/features/extensibility/plugin/tools#disabling-builtin-tools-per-model). |

:::tip Reverse proxy already using `Authorization`?
Send the key in `x-api-key` instead, or rename the header with [`CUSTOM_API_KEY_HEADER`](/reference/env-configuration#custom_api_key_header). See [API Keys](/features/authentication-access/api-keys#behind-a-reverse-proxy-that-consumes-authorization).
:::

---

## The one rule that decides your whole integration

`POST /api/chat/completions` behaves in three different ways depending on which fields you send. Pick the row you want *before* you write any code.

| What you send | Who runs the tools | Where the answer comes back | Built-in tools |
| :--- | :--- | :--- | :--- |
| `chat_id` + `id` + `stream: true` (+ `session_id`) | **Open WebUI**, full multi-round native loop | The **chat record** (and the socket). The HTTP body is empty. | ✅ with `session_id` |
| `params.function_calling: "legacy"` + `tool_ids` | **Open WebUI**, one round, before the model answers | The **HTTP response body**, normal OpenAI shape | ❌ |
| Neither of the above | **Nobody**. Raw `tool_calls` are handed back to you | The HTTP response body | ❌ |

The reason is structural, not a setting: the native tool-execution loop lives in the same code path that streams events into a chat, so it only runs when the request identifies a chat (`chat_id`) and an assistant message (`id`), and it only runs for `stream: true`. That path writes the result into the chat instead of the HTTP response.

So there are two practical integrations, described below:

- **[Path A](#path-a-full-agentic-loop)**, the full agentic loop. More calls, everything works.
- **[Path B](#path-b-one-request-answer-in-the-body)**, one request in, one completion out. Simpler, but one round of tools and no built-in tools.

---

## Discover what you can call

Run these once and cache the IDs.

```bash
# Models
curl -s -H "Authorization: Bearer $OWUI_KEY" $OWUI_URL/api/models | jq '.data[].id'

# Workspace tools you have access to (use .id as a tool_ids entry)
curl -s -H "Authorization: Bearer $OWUI_KEY" $OWUI_URL/api/v1/tools/ | jq '.[] | {id, name}'

# Terminal servers you have access to (use .id as terminal_id)
curl -s -H "Authorization: Bearer $OWUI_KEY" $OWUI_URL/api/v1/terminals/ | jq '.[] | {id, name, contexts}'
```

MCP servers are addressed as tool IDs of the form `server:mcp:<server-id>`. See [Using Open WebUI tools, including MCP, from the API](/reference/api-endpoints#using-open-webui-tools-including-mcp-from-the-api).

:::warning The model's default terminal is a UI default, not a server default
When you pick a model in the browser, the frontend reads `meta.terminalId` off the model and puts it in the request for you. The backend does **not** do that. An API caller must send `terminal_id` explicitly, otherwise the model gets no terminal tools even if the model is configured with one.

You can read a model's configured terminal with `GET /api/v1/models/model?id=<model-id>` and use `meta.terminalId`, or just pick one from `/api/v1/terminals/`, which already lists only the terminals your user is allowed to use.
:::

### Terminal contexts

Terminals backed by the orchestrator (a connection with `server_type: orchestrator`, or any connection carrying a `policy_id`) can be scoped per context by an administrator. That scoping is returned in the `contexts` field of `/api/v1/terminals/`, and it decides whether your request can use the terminal at all:

| `contexts.chat` | Meaning for an API caller |
| :--- | :--- |
| absent, or `{}` | Shared terminal. Usable from any request, including one with no chat. |
| `{"context_id": "chat_id"}` | Scoped per chat. The request **must** carry a saved `chat_id`, and each chat gets its own runtime context upstream. |
| `false` | Not available in chats at all. Requesting it fails. |

An automation-initiated request is scoped the same way through `contexts.automation`, keyed on `automation_id` instead.

Connections that are not orchestrator-backed have no `contexts` entry and are always usable, which is the behaviour every earlier release had.

Practically: read `contexts.chat` before choosing a terminal. If it is `false`, pick another. If it is `{"context_id": "chat_id"}`, you have to use [Path A](#path-a-full-agentic-loop) with a real saved chat, because [Path B](#path-b-one-request-answer-in-the-body) never creates one.

---

## Path A: full agentic loop

Four calls. This is what the web UI does, minus the browser.

### A1. Create the chat

The completion has to attach to a chat and an assistant message that already exist. Create both up front:

```bash
USER_MSG_ID=$(uuidgen)
ASSISTANT_MSG_ID=$(uuidgen)
TS=$(date +%s)

CHAT_ID=$(curl -s -X POST $OWUI_URL/api/v1/chats/new \
  -H "Authorization: Bearer $OWUI_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"chat\": {
        \"title\": \"API run\",
        \"models\": [\"gpt-4o\"],
        \"history\": {
          \"currentId\": \"$ASSISTANT_MSG_ID\",
          \"messages\": {
            \"$USER_MSG_ID\": {\"id\": \"$USER_MSG_ID\", \"role\": \"user\", \"content\": \"Search the web for the latest Open WebUI release and summarise it.\", \"timestamp\": $TS, \"models\": [\"gpt-4o\"], \"childrenIds\": [\"$ASSISTANT_MSG_ID\"]},
            \"$ASSISTANT_MSG_ID\": {\"id\": \"$ASSISTANT_MSG_ID\", \"role\": \"assistant\", \"content\": \"\", \"parentId\": \"$USER_MSG_ID\", \"childrenIds\": [], \"model\": \"gpt-4o\", \"modelName\": \"gpt-4o\", \"modelIdx\": 0, \"done\": false, \"timestamp\": $((TS + 1))}
          }
        }
      }}" | jq -r '.id')
```

The exact message-tree fields (`childrenIds`, `currentId`, `parentId`) matter if you also want the chat to render correctly in the browser. [Backend-Controlled API Flow](/reference/api-flow) documents that structure in full.

### A2. Fire the completion

```bash
curl -s -X POST $OWUI_URL/api/chat/completions \
  -H "Authorization: Bearer $OWUI_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"gpt-4o\",
    \"messages\": [{\"role\": \"user\", \"content\": \"Search the web for the latest Open WebUI release and summarise it.\"}],
    \"stream\": true,
    \"chat_id\": \"$CHAT_ID\",
    \"id\": \"$ASSISTANT_MSG_ID\",
    \"session_id\": \"api-$(uuidgen)\",
    \"features\": {\"web_search\": true, \"code_interpreter\": true, \"image_generation\": false, \"memory\": true},
    \"tool_ids\": [\"my_workspace_tool\", \"server:mcp:my_mcp_server\"],
    \"terminal_id\": \"open-terminal\",
    \"background_tasks\": {\"title_generation\": false, \"tags_generation\": false, \"follow_up_generation\": false}
  }"
```

Response:

```json
{"status": true, "task_ids": ["..."], "chat_id": "..."}
```

That is not the answer. It means the work was accepted and is running server-side.

Field by field:

| Field | Why it is there |
| :--- | :--- |
| `stream: true` | Required. The native tool loop only exists on the streaming path. |
| `chat_id` + `id` | Required. Without both, no tools are executed server-side at all. |
| `session_id` | **The built-in tools switch.** Any non-empty string works. Without it, built-in tools are not offered to the model. It also makes the request asynchronous (you get `task_ids` instead of blocking). |
| `features` | Turns on the four togglable built-in groups: `web_search`, `code_interpreter`, `image_generation`, `memory`. The other built-ins (knowledge, files, notes, channels, calendar, automations, chats, time, tasks, sub-agents) need no flag and are offered whenever their global setting, your permission and the model's category allow it. |
| `tool_ids` | Workspace tools and MCP servers. Optional. |
| `terminal_id` | Open Terminal server. Optional, and independent of `session_id`. A chat-scoped orchestrator terminal additionally requires that `chat_id` be a saved chat, which Path A already satisfies. |
| `background_tasks` | Turn title, tag and follow-up generation off unless you want the extra model calls. |

:::danger Do not send your own `tools` array
If the request body contains a `tools` key, Open WebUI skips all server-side tool resolution and forwards your definitions to the model verbatim. Sending `"tools": []` is the documented way to opt out of built-in injection entirely.
:::

### A3. Wait for it to finish

```bash
while [ "$(curl -s -H "Authorization: Bearer $OWUI_KEY" \
  "$OWUI_URL/api/tasks/chat/$CHAT_ID" | jq '.task_ids | length')" != "0" ]; do
  sleep 2
done
```

### A4. Read the answer

```bash
curl -s -H "Authorization: Bearer $OWUI_KEY" "$OWUI_URL/api/v1/chats/$CHAT_ID" \
  | jq -r ".chat.history.messages[\"$ASSISTANT_MSG_ID\"].content"
```

`content` is the plain text. The same message also carries `output` (the structured item list: reasoning blocks, tool calls, code interpreter runs), `usage` and `sources`, if you want more than the prose.

### A5. If you did not want the chat saved

Path A needs a real chat to write into, so the honest answer for "API request and response only" is to delete it when you are done:

```bash
curl -s -X DELETE -H "Authorization: Bearer $OWUI_KEY" "$OWUI_URL/api/v1/chats/$CHAT_ID"
```

:::info The `temporary:` alternative
A `chat_id` of `temporary:<uuid>` also runs the full loop and persists nothing at all. But then there is nowhere to read the result from over HTTP: the output only goes out over the socket. Use it only if your client is a real socket.io client. For plain HTTP, create and delete.
:::

### Blocking variant (no `session_id`)

Drop `session_id` and the request stops being asynchronous: the HTTP call blocks until the whole tool loop is finished, then returns `null`. You still read the answer from the chat, but you skip the polling in A3. The trade is that **built-in tools are not available** in this mode. Use it when `tool_ids`, `terminal_id` and MCP are all you need.

---

## Path B: one request, answer in the body

If you want a single HTTP request that returns a normal OpenAI completion with tool results already baked in, switch that request to legacy function calling:

```bash
curl -s -X POST $OWUI_URL/api/chat/completions \
  -H "Authorization: Bearer $OWUI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "What does the my_workspace_tool say about order 4711?"}],
    "stream": false,
    "params": {"function_calling": "legacy"},
    "tool_ids": ["my_workspace_tool", "server:mcp:my_mcp_server"],
    "terminal_id": "open-terminal"
  }'
```

What happens: Open WebUI asks the task model which tools to call, executes them server-side with your permissions, injects the results into the prompt as context, then runs the real completion. Nothing is persisted, nothing needs a chat, and the response is the ordinary object your HTTP client expects, plus a top-level `sources` array holding each tool result.

Set `"stream": true` for the same thing as SSE. The tool round happens before the first token, so the stream starts once the tools are done. The `sources` payload arrives as the first `data:` frame, ahead of the model deltas.

Limits, in exchange for the simplicity:

- **One round of tool calls.** The model cannot look at a result and decide to call something else.
- **No built-in tools.** No web search, no code interpreter, no knowledge browsing, no terminal-driven agentic work.
- **No chat-scoped terminals.** A request in this mode carries no `chat_id`, so an orchestrator terminal configured with `contexts.chat.context_id = "chat_id"` cannot be used. Shared terminals work normally.
- Legacy mode is **deprecated** and depends on a task model that reliably emits JSON. See [Tool Calling Modes](/features/extensibility/plugin/tools#tool-calling-modes-default-vs-native).

---

## What you actually get back, by mode

| Request | HTTP response |
| :--- | :--- |
| Path A with `session_id` | `{"status": true, "task_ids": [...], "chat_id": "..."}`, immediately |
| Path A without `session_id` | `null`, after the full loop finishes |
| Path B, `stream: false` | Normal chat completion object, plus `sources` |
| Path B, `stream: true` | SSE: a `sources` frame, then standard OpenAI deltas, then `[DONE]` |
| Native mode without `chat_id`/`id` | Standard OpenAI response containing **unexecuted** `tool_calls` |

---

## Reusable script

Drop-in Python. Set the four constants at the top and call `run()`.

```python
"""Run a prompt through Open WebUI with server-side tool calling."""

import json
import time
import uuid

import requests

OWUI_URL = "http://localhost:3000"
OWUI_KEY = "sk-..."
MODEL = "gpt-4o"
DELETE_CHAT_WHEN_DONE = True  # False keeps the conversation in the user's chat list


def _headers():
    return {"Authorization": f"Bearer {OWUI_KEY}", "Content-Type": "application/json"}


def run(
    prompt,
    tool_ids=None,
    terminal_id=None,
    features=None,
    system=None,
    builtin_tools=True,
    timeout=600,
):
    """Returns the finished assistant message as a dict (content, output, usage, sources)."""
    user_msg_id, assistant_msg_id = str(uuid.uuid4()), str(uuid.uuid4())
    now = int(time.time())

    chat = requests.post(
        f"{OWUI_URL}/api/v1/chats/new",
        headers=_headers(),
        json={
            "chat": {
                "title": "API run",
                "models": [MODEL],
                "history": {
                    "currentId": assistant_msg_id,
                    "messages": {
                        user_msg_id: {
                            "id": user_msg_id,
                            "role": "user",
                            "content": prompt,
                            "timestamp": now,
                            "models": [MODEL],
                            "childrenIds": [assistant_msg_id],
                        },
                        assistant_msg_id: {
                            "id": assistant_msg_id,
                            "role": "assistant",
                            "content": "",
                            "parentId": user_msg_id,
                            "childrenIds": [],
                            "model": MODEL,
                            "modelName": MODEL,
                            "modelIdx": 0,
                            "done": False,
                            "timestamp": now + 1,
                        },
                    },
                },
            }
        },
    )
    chat.raise_for_status()
    chat_id = chat.json()["id"]

    messages = ([{"role": "system", "content": system}] if system else []) + [
        {"role": "user", "content": prompt}
    ]

    body = {
        "model": MODEL,
        "messages": messages,
        "stream": True,  # required, the native tool loop is streaming-only
        "chat_id": chat_id,
        "id": assistant_msg_id,
        "background_tasks": {
            "title_generation": False,
            "tags_generation": False,
            "follow_up_generation": False,
        },
        "features": features
        or {
            "web_search": True,
            "code_interpreter": True,
            "image_generation": False,
            "memory": False,
        },
    }
    if builtin_tools:
        body["session_id"] = f"api-{uuid.uuid4()}"  # unlocks the built-in tools
    if tool_ids:
        body["tool_ids"] = tool_ids
    if terminal_id:
        body["terminal_id"] = terminal_id

    started = requests.post(
        f"{OWUI_URL}/api/chat/completions", headers=_headers(), json=body, timeout=timeout
    )
    started.raise_for_status()

    deadline = time.time() + timeout
    while time.time() < deadline:
        tasks = requests.get(
            f"{OWUI_URL}/api/tasks/chat/{chat_id}", headers=_headers()
        ).json()
        if not tasks.get("task_ids"):
            break
        time.sleep(2)
    else:
        raise TimeoutError(f"chat {chat_id} did not finish within {timeout}s")

    final = requests.get(f"{OWUI_URL}/api/v1/chats/{chat_id}", headers=_headers())
    final.raise_for_status()
    message = final.json()["chat"]["history"]["messages"][assistant_msg_id]

    if DELETE_CHAT_WHEN_DONE:
        requests.delete(f"{OWUI_URL}/api/v1/chats/{chat_id}", headers=_headers())

    return message


def run_single_request(prompt, tool_ids=None, terminal_id=None, stream=False):
    """Path B: one call, completion in the body. One tool round, no built-in tools."""
    body = {
        "model": MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "stream": stream,
        "params": {"function_calling": "legacy"},
    }
    if tool_ids:
        body["tool_ids"] = tool_ids
    if terminal_id:
        body["terminal_id"] = terminal_id

    if not stream:
        response = requests.post(
            f"{OWUI_URL}/api/chat/completions", headers=_headers(), json=body
        )
        response.raise_for_status()
        return response.json()

    with requests.post(
        f"{OWUI_URL}/api/chat/completions", headers=_headers(), json=body, stream=True
    ) as response:
        response.raise_for_status()
        for line in response.iter_lines(decode_unicode=True):
            if line and line.startswith("data: "):
                payload = line[6:]
                if payload == "[DONE]":
                    return
                yield json.loads(payload)


if __name__ == "__main__":
    result = run(
        "Search the web for the newest Open WebUI release, then write a three-bullet summary.",
        terminal_id=None,
        tool_ids=None,
    )
    print(result["content"])
```

To adapt it:

- **Different tools**: pass `tool_ids=["my_tool", "server:mcp:my_server"]`.
- **Terminal work**: pass `terminal_id="<id from /api/v1/terminals/>"`.
- **Keep the conversation**: set `DELETE_CHAT_WHEN_DONE = False`. It then shows up in the user's chat list exactly like a browser conversation.
- **Multi-turn**: reuse the `chat_id`, add a new user message plus assistant placeholder to the tree, and send the full `messages` history. See [Backend-Controlled API Flow](/reference/api-flow#send-additional-messages-to-an-existing-chat).
- **No built-in tools wanted**: `builtin_tools=False` makes the request blocking and skips the polling loop.

---

## Gotchas

| Symptom | Cause | Fix |
| :--- | :--- | :--- |
| Response contains `tool_calls` your script has to run | Native mode without `chat_id` + `id` | Use Path A, or switch that request to legacy mode |
| No tools were called at all, and `stream` was `false` | The native loop is streaming-only | Send `stream: true` |
| `stream: true` was sent but nothing streamed | The workspace model's **Stream Chat Response** parameter overrides the request | Clear it on the model, or accept the model's setting |
| Web search, code interpreter, memory or image generation never offered | Missing `session_id`, missing `features` flag, missing user permission, disabled globally, or the model's **Builtin Tools** category is off | All five must line up. Check them in that order |
| `execute_code` returns "WebSocket connection required" | The code interpreter engine is `pyodide`, which runs in the browser | Switch the engine to **Jupyter** in **Settings > Admin > Tools > Code Interpreter**, or drop `code_interpreter` from `features` |
| File tools (`view_file`, `grep_chat_files`, ...) missing | They need `files` in the request body, the model's **File Upload** capability on, and **File Context** off | See [Prompt Caching and Context Optimization](/features/chat-conversations/prompt-caching) |
| `503 Terminal unavailable` | The terminal server is unreachable, disabled, or your user has no access grant | Confirm the ID appears in `GET /api/v1/terminals/` for that key |
| `503`, terminal not available for chat | The terminal's `contexts.chat` is `false`, so an administrator has taken it out of chats | Pick a terminal whose `contexts.chat` is not `false` |
| `503`, terminal requires a saved chat context | The terminal is scoped with `contexts.chat.context_id = "chat_id"` and the request had no saved `chat_id` | Use Path A with a saved chat, or pick a shared terminal |
| MCP tool connection fails | An OAuth-protected MCP server the API key's user has not authorised | Complete the OAuth flow once in the browser as that user |
| The chat is created but stays empty in the UI | Broken message tree | `currentId` is camelCase, and every message needs `parentId` and `childrenIds`. See [Backend-Controlled API Flow](/reference/api-flow) |

---

## See also

- [API Endpoints](/reference/api-endpoints): the full endpoint list, Anthropic Messages API, RAG and file uploads.
- [Backend-Controlled API Flow](/reference/api-flow): the chat and message-tree structures used in Path A.
- [Tools](/features/extensibility/plugin/tools): built-in tool reference, native vs legacy, per-model gating.
- [Model Context Protocol (MCP)](/features/extensibility/mcp): adding MCP servers.
- [Open Terminal](/features/open-terminal): setting up the terminal server.
- [API Keys](/features/authentication-access/api-keys) and [Permissions](/features/authentication-access/rbac/permissions).
