---
sidebar_position: 45
title: "服务器端工具调用（API）"
---

# 通过 API 进行服务器端工具调用

**向 Open WebUI 发送提示词，让 Open WebUI 运行工具，然后获得最终答案。**

本页介绍你希望由*服务器*完成智能体工作时所需的确切请求：模型决定调用工具，Open WebUI 使用你的用户凭据和权限执行工具，将结果反馈给模型，并重复这一过程，直到模型完成。你的脚本不会看到需要自行执行的 `tool_calls` 对象。

这包括：

- **[内置工具](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode)**：网页搜索、知识和文件浏览、代码解释器、笔记、频道、记忆、日历、自动化、子智能体、图像生成。
- **[工作区工具](/features/extensibility/plugin/tools)**：你自己的 Python 工具。
- Open WebUI 中配置的 **[MCP 服务器](/features/extensibility/mcp)**和 OpenAPI 工具服务器。
- **[Open Terminal](/features/open-terminal)**：模型或你的用户有权访问的机器。

---

## 开始之前 {#before-you-start}

| 你需要 | 位置 |
| :--- | :--- |
| 一个 API 密钥 | [API 密钥](/features/authentication-access/api-keys)。管理员必须先启用全局 **API Keys** 开关，非管理员还需要 **API Keys** 功能权限。 |
| 工具所需的权限 | 密钥以*你本人*的身份执行操作。网页搜索、代码解释器、图像生成、笔记、频道、记忆和文件上传都分别受[用户权限](/features/authentication-access/rbac/permissions)和全局管理员开关控制。如果你的用户无法在浏览器中执行某项操作，密钥同样无法执行。 |
| 支持**原生**函数调用的模型 | [工具调用模式](/features/extensibility/plugin/tools#tool-calling-modes-default-vs-native)。原生模式是默认模式，也是唯一支持内置工具和多轮循环的模式。 |
| 未关闭相关能力的模型 | 内置工具遵循每个模型的 **Builtin Tools** 类别和能力。请参阅[禁用内置工具（按模型）](/features/extensibility/plugin/tools#disabling-builtin-tools-per-model)。 |

:::tip 反向代理已经在使用 `Authorization`？
改为在 `x-api-key` 中发送密钥，或使用 [`CUSTOM_API_KEY_HEADER`](/reference/env-configuration#custom_api_key_header) 重命名标头。请参阅 [API 密钥](/features/authentication-access/api-keys#behind-a-reverse-proxy-that-consumes-authorization)。
:::

---

## 决定整个集成方式的一条规则 {#the-one-rule-that-decides-your-whole-integration}

`POST /api/chat/completions` 会根据你发送的字段以三种不同方式运行。在编写任何代码*之前*，先选择你所需的一行。

| 你发送的内容 | 谁运行工具 | 答案返回的位置 | 内置工具 |
| :--- | :--- | :--- | :--- |
| `chat_id` + `id` + `stream: true`（+ `session_id`） | **Open WebUI**，完整的多轮原生循环 | **聊天记录**（以及套接字）。HTTP 正文为空。 | 有 `session_id` 时支持 |
| `params.function_calling: "legacy"` + `tool_ids` | **Open WebUI**，在模型回答之前进行一轮 | **HTTP 响应正文**，标准 OpenAI 结构 | 不支持 |
| 以上两者都不发送 | **无人执行**。原始 `tool_calls` 会交还给你 | HTTP 响应正文 | 不支持 |

原生工具执行循环位于将事件流式写入聊天的代码路径中，因此只有当请求标识了聊天（`chat_id`）和助手消息（`id`），并且仅当 `stream: true` 时才会运行。该路径会将结果写入聊天，而不是 HTTP 响应。

因此，实际有两种集成方式，如下所述：

- **[路径 A](#path-a-full-agentic-loop)**：完整的智能体循环。调用次数更多，但所有功能都可用。
- **[路径 B](#path-b-one-request-answer-in-the-body)**：一次请求输入，一次补全输出。更简单，但只有一轮工具调用，且没有内置工具。

---

## 发现可以调用的内容 {#discover-what-you-can-call}

运行一次以下命令并缓存 ID。

```bash
# 模型
curl -s -H "Authorization: Bearer $OWUI_KEY" $OWUI_URL/api/models | jq '.data[].id'

# 你有权访问的工作区工具（将 .id 用作 tool_ids 条目）
curl -s -H "Authorization: Bearer $OWUI_KEY" $OWUI_URL/api/v1/tools/ | jq '.[] | {id, name}'

# 你有权访问的机器（将 .id 用作 machine_id）
curl -s -H "Authorization: Bearer $OWUI_KEY" $OWUI_URL/api/v1/machines/ | jq '.[] | {id, name, template_id, scope}'
```

MCP 服务器使用 `server:mcp:<server-id>` 形式的工具 ID 进行寻址。请参阅[通过 API 使用 Open WebUI 工具（包括 MCP）](/reference/api-endpoints#using-open-webui-tools-including-mcp-from-the-api)。

:::warning 模型的默认机器仅在浏览器中生效
在浏览器中选择模型时，前端会从模型中读取 `meta.machineId`，并将其放入请求中。API 调用需要自行发送 `machine_id`。如果没有该字段，即使模型配置了默认机器，模型也不会获得任何机器工具。

你可以使用 `GET /api/v1/models/model?id=<model-id>` 读取模型配置的机器并使用 `meta.machineId`，也可以直接从 `/api/v1/machines/` 中选择一个；该接口已经只列出你的用户有权使用的机器。
:::

:::warning 模型的工具、默认功能和知识同样属于 UI 默认设置
Web 界面还会将模型的 **Tools**（`meta.toolIds`）复制到 `tool_ids`，将其 **Default Features** 复制到 `features`。后端不会执行这两项操作，因此请自行发送。模型的 **Knowledge** 只能通过内置工具进行搜索，而内置工具需要 `session_id`；也可以在 legacy 模式下搜索。两者都没有的请求完全不会使用模型的知识。完整列表请参阅[聊天补全](/reference/api-endpoints#chat-completions)。
:::

### 机器范围 {#machine-scope}

Terminals 服务器上的机器带有一个 `scope`：`null`、`user`、`chat` 或 `model`。它决定了你的请求必须携带什么才能使用该机器：

| `scope` | 请求需要的内容 |
| :--- | :--- |
| `null` 或 `user` | 无额外内容 |
| `chat` | 已保存的 `chat_id`。每个聊天都有自己的实例 |
| `model` | 你有权访问的模型 |

在选择机器之前读取 `scope`。对于 `chat` 机器，你必须使用具有真实已保存聊天的[路径 A](#path-a-full-agentic-loop)，因为[路径 B](#path-b-one-request-answer-in-the-body) 永远不会创建聊天。[创建机器](/features/open-terminal/terminals/orchestration/creating-terminals#machine-scope)介绍了每种范围的作用。

---

## 路径 A：完整的智能体循环 {#path-a-full-agentic-loop}

四次调用。除了没有浏览器之外，这就是 Web 界面的工作方式。

### A1. 创建聊天 {#a1-create-the-chat}

补全端点可以自行创建聊天（发送 `"parent_id": null`，不发送 `chat_id`，发送一个 `user_message` 对象和一个 `session_id`；响应会携带新的 `chat_id`），并为你传递的 `id` 插入助手占位消息。如下所示，预先创建两者也仍然有效，只要 A2 还将同一条用户消息作为 `user_message` 发送；如果没有它，占位消息保存时将没有父级：

```bash
USER_MSG_ID=$(uuidgen)
ASSISTANT_MSG_ID=$(uuidgen)
TS=$(date +%s)

CHAT_ID=$(curl -s -X POST $OWUI_URL/api/v1/chats/new \
  -H "Authorization: Bearer $OWUI_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"chat\": {
        \"title\": \"API run\",
        \"models\": [\"gpt-5.6-sol\"],
        \"history\": {
          \"currentId\": \"$ASSISTANT_MSG_ID\",
          \"messages\": {
            \"$USER_MSG_ID\": {\"id\": \"$USER_MSG_ID\", \"role\": \"user\", \"content\": \"Search the web for the latest Open WebUI release and summarise it.\", \"timestamp\": $TS, \"models\": [\"gpt-5.6-sol\"], \"childrenIds\": [\"$ASSISTANT_MSG_ID\"]},
            \"$ASSISTANT_MSG_ID\": {\"id\": \"$ASSISTANT_MSG_ID\", \"role\": \"assistant\", \"content\": \"\", \"parentId\": \"$USER_MSG_ID\", \"childrenIds\": [], \"model\": \"gpt-5.6-sol\", \"modelName\": \"gpt-5.6-sol\", \"modelIdx\": 0, \"done\": false, \"timestamp\": $((TS + 1))}
          }
        }
      }}" | jq -r '.id')
```

如果你还希望聊天在浏览器中正确渲染，确切的消息树字段（`childrenIds`、`currentId`、`parentId`）就很重要。[后端控制的 API 流程](/reference/api-flow)完整记录了该结构。

### A2. 发起补全 {#a2-fire-the-completion}

```bash
curl -s -X POST $OWUI_URL/api/chat/completions \
  -H "Authorization: Bearer $OWUI_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"gpt-5.6-sol\",
    \"messages\": [{\"role\": \"user\", \"content\": \"Search the web for the latest Open WebUI release and summarise it.\"}],
    \"stream\": true,
    \"chat_id\": \"$CHAT_ID\",
    \"id\": \"$ASSISTANT_MSG_ID\",
    \"user_message\": {\"id\": \"$USER_MSG_ID\", \"role\": \"user\", \"content\": \"Search the web for the latest Open WebUI release and summarise it.\", \"parentId\": null, \"childrenIds\": [\"$ASSISTANT_MSG_ID\"], \"timestamp\": $TS, \"models\": [\"gpt-5.6-sol\"]},
    \"session_id\": \"api-$(uuidgen)\",
    \"features\": {\"web_search\": true, \"code_interpreter\": true, \"image_generation\": false, \"memory\": true},
    \"tool_ids\": [\"my_workspace_tool\", \"server:mcp:my_mcp_server\"],
    \"machine_id\": \"open-terminal\",
    \"background_tasks\": {\"title_generation\": false, \"tags_generation\": false, \"follow_up_generation\": false}
  }"
```

响应：

```json
{"status": true, "task_ids": ["..."], "chat_id": "..."}
```

此响应确认工作已被接受，并正在服务器端运行。

逐字段说明：

| 字段 | 存在的原因 |
| :--- | :--- |
| `stream: true` | 必需。原生工具循环仅存在于流式路径中。 |
| `chat_id` + `id` | 必需。缺少其中任何一个，都不会在服务器端执行工具。 |
| `user_message` | 本次运行所回答的用户消息，与 A1 中存储的一样。后端根据其 `id` 设置助手消息的 `parentId`；如果没有它，助手消息保存时将没有父级。 |
| `session_id` | **内置工具开关。** 任何非空字符串都有效。没有它，就不会向模型提供内置工具。它还会使请求异步执行（你会得到 `task_ids`，而不是阻塞等待）。 |
| `features` | 启用四组可切换的内置功能：`web_search`、`code_interpreter`、`image_generation`、`memory`。其他内置功能（知识、文件、笔记、频道、日历、自动化、聊天、时间、任务、子智能体）无需标志，只要其全局设置、你的权限和模型类别允许，就会提供。 |
| `tool_ids` | 工作区工具和 MCP 服务器。可选。 |
| `machine_id` | 机器的 ID。可选，且独立于 `session_id`。`scope` 为 `chat` 的机器还要求 `chat_id` 是已保存的聊天，路径 A 已满足此条件。 |
| `background_tasks` | 除非需要额外的模型调用，否则关闭标题、标签和后续问题生成。 |

:::danger 不要发送你自己的 `tools` 数组
如果请求正文包含 `tools` 键，Open WebUI 会跳过所有服务器端工具解析，并将你的定义原样转发给模型。发送 `"tools": []` 是文档中规定的完全禁用内置注入的方法。

在模型上设置的 `tools` 自定义参数（模型编辑器中的**添加自定义参数**）工作方式不同。Open WebUI 仍会解析自己的工具，并将模型的自定义工具与其一起发送。
:::

### A3. 等待完成 {#a3-wait-for-it-to-finish}

```bash
while [ "$(curl -s -H "Authorization: Bearer $OWUI_KEY" \
  "$OWUI_URL/api/tasks/chat/$CHAT_ID" | jq '.task_ids | length')" != "0" ]; do
  sleep 2
done
```

### A4. 读取答案 {#a4-read-the-answer}

```bash
curl -s -H "Authorization: Bearer $OWUI_KEY" "$OWUI_URL/api/v1/chats/$CHAT_ID" \
  | jq -r ".chat.history.messages[\"$ASSISTANT_MSG_ID\"].content"
```

`content` 是纯文本。如果你需要的不只是正文，同一条消息还携带 `output`（结构化项目列表：推理块、工具调用、代码解释器运行）、`usage` 和 `sources`。

### A5. 如果你不希望保存聊天 {#a5-if-you-did-not-want-the-chat-saved}

路径 A 会写入真实聊天。对于“仅 API 请求和响应”的场景，请在完成后删除聊天：

```bash
curl -s -X DELETE -H "Authorization: Bearer $OWUI_KEY" "$OWUI_URL/api/v1/chats/$CHAT_ID"
```

:::info `temporary:` 替代方案
`temporary:<session_id>` 形式的 `chat_id` 也会运行完整循环，并且完全不持久化任何内容。`<session_id>` 是你自己已登录客户端的 socket.io 会话 ID，同时也会作为 `session_id` 发送；任何其他 `temporary:` ID 都会被拒绝并返回 `404`。输出仅通过该套接字发出，因此这需要一个真正的 socket.io 客户端。对于普通 HTTP，请创建聊天后再删除。
:::

### 阻塞变体（无 `session_id`） {#blocking-variant-no-session_id}

去掉 `session_id` 后，请求不再是异步的：HTTP 调用会阻塞，直到整个工具循环完成，然后返回 `null`。你仍然从聊天中读取答案，但可以跳过 A3 中的轮询。代价是此模式下**内置工具不可用**。当你只需要 `tool_ids`、`machine_id` 和 MCP 时，请使用此模式。

---

## 路径 B：一次请求，答案在正文中 {#path-b-one-request-answer-in-the-body}

如果你希望通过单个 HTTP 请求返回标准的 OpenAI 补全，并且工具结果已经应用，请将该请求切换为 legacy 函数调用：

```bash
curl -s -X POST $OWUI_URL/api/chat/completions \
  -H "Authorization: Bearer $OWUI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.6-sol",
    "messages": [{"role": "user", "content": "What does the my_workspace_tool say about order 4711?"}],
    "stream": false,
    "params": {"function_calling": "legacy"},
    "tool_ids": ["my_workspace_tool", "server:mcp:my_mcp_server"],
    "machine_id": "open-terminal"
  }'
```

具体过程：Open WebUI 会询问任务模型要调用哪些工具，使用你的权限在服务器端执行它们，将结果作为上下文注入提示词，然后运行真正的补全。不会持久化任何内容，也不需要聊天；响应就是你的 HTTP 客户端所期望的普通对象，外加一个保存各项工具结果的顶层 `sources` 数组。

设置 `"stream": true` 可以以 SSE 形式获得相同结果。工具调用发生在第一个令牌之前，因此流会在工具完成后开始。`sources` 负载作为第一个 `data:` 帧到达，先于模型增量。

作为简易性的代价，存在以下限制：

- **一轮工具调用。** 模型无法查看结果后决定调用其他工具。
- **没有内置工具。** 没有网页搜索、代码解释器、知识浏览，也没有在机器上进行的智能体工作。
- **没有聊天范围的机器。** 此模式下的请求不携带 `chat_id`，因此无法使用 `scope` 设置为 `chat` 的机器。其他机器正常工作。
- Legacy 模式**不受支持**，并且依赖能够可靠生成 JSON 的任务模型。请参阅[工具调用模式](/features/extensibility/plugin/tools#tool-calling-modes-default-vs-native)。

---

## 各模式实际返回的内容 {#what-you-actually-get-back-by-mode}

| 请求 | HTTP 响应 |
| :--- | :--- |
| 带 `session_id` 的路径 A | `{"status": true, "task_ids": [...], "chat_id": "..."}`，立即返回 |
| 不带 `session_id` 的路径 A | 完整循环结束后返回 `null` |
| 路径 B，`stream: false` | 标准聊天补全对象，外加 `sources` |
| 路径 B，`stream: true` | SSE：一个 `sources` 帧，然后是标准 OpenAI 增量，最后是 `[DONE]` |
| 不带 `chat_id`/`id` 的原生模式 | 包含**未执行** `tool_calls` 的标准 OpenAI 响应 |

---

## 可复用脚本 {#reusable-script}

可直接使用的 Python 脚本。设置顶部的四个常量并调用 `run()`。

```python
"""通过服务器端工具调用在 Open WebUI 中运行提示词。"""

import json
import time
import uuid

import requests

OWUI_URL = "http://localhost:3000"
OWUI_KEY = "sk-..."
MODEL = "gpt-5.6-sol"
DELETE_CHAT_WHEN_DONE = True  # False 会将对话保留在用户的聊天列表中


def _headers():
    return {"Authorization": f"Bearer {OWUI_KEY}", "Content-Type": "application/json"}


def run(
    prompt,
    tool_ids=None,
    machine_id=None,
    features=None,
    system=None,
    builtin_tools=True,
    timeout=600,
):
    """以字典形式返回最终助手消息（content、output、usage、sources）。"""
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
        "stream": True,  # 必需，原生工具循环仅支持流式传输
        "chat_id": chat_id,
        "id": assistant_msg_id,
        "user_message": {
            "id": user_msg_id,
            "role": "user",
            "content": prompt,
            "parentId": None,
            "childrenIds": [assistant_msg_id],
            "timestamp": now,
            "models": [MODEL],
        },
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
        body["session_id"] = f"api-{uuid.uuid4()}"  # 解锁内置工具
    if tool_ids:
        body["tool_ids"] = tool_ids
    if machine_id:
        body["machine_id"] = machine_id

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


def run_single_request(prompt, tool_ids=None, machine_id=None, stream=False):
    """路径 B：一次调用，补全在正文中。一轮工具调用，无内置工具。"""
    body = {
        "model": MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "stream": stream,
        "params": {"function_calling": "legacy"},
    }
    if tool_ids:
        body["tool_ids"] = tool_ids
    if machine_id:
        body["machine_id"] = machine_id

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
        machine_id=None,
        tool_ids=None,
    )
    print(result["content"])
```

要进行调整：

- **不同的工具**：传递 `tool_ids=["my_tool", "server:mcp:my_server"]`。
- **机器工作**：传递 `machine_id="<id from /api/v1/machines/>"`。
- **保留对话**：设置 `DELETE_CHAT_WHEN_DONE = False`。此后，它会像浏览器对话一样显示在用户的聊天列表中。
- **多轮对话**：复用 `chat_id`，在树中添加新的用户消息和助手占位消息，并发送完整的 `messages` 历史记录。请参阅[后端控制的 API 流程](/reference/api-flow#send-additional-messages-to-an-existing-chat)。
- **不需要内置工具**：`builtin_tools=False` 会使请求阻塞，并跳过轮询循环。

---

## 常见问题 {#gotchas}

| 症状 | 原因 | 解决方法 |
| :--- | :--- | :--- |
| 响应包含脚本必须运行的 `tool_calls` | 原生模式没有 `chat_id` + `id` | 使用路径 A，或将该请求切换到 legacy 模式 |
| 根本没有调用工具，且 `stream` 为 `false` | 原生循环仅支持流式传输 | 发送 `stream: true` |
| 已发送 `stream: true`，但没有任何流式输出 | 工作区模型的 **Stream Chat Response** 参数会覆盖请求 | 清除模型上的该参数，或接受模型的设置 |
| 从未提供网页搜索、代码解释器、记忆或图像生成 | 缺少 `session_id`、缺少 `features` 标志、缺少用户权限、全局禁用，或模型的 **Builtin Tools** 类别已关闭 | 五项条件必须全部满足。按此顺序检查 |
| `execute_code` 返回 "WebSocket connection required" | 代码解释器引擎为 `pyodide`，它在浏览器中运行 | 在 **Settings > Code Execution**（管理员部分的 **Legacy** 下）中将引擎切换为 **Jupyter**，或从 `features` 中去掉 `code_interpreter` |
| 文件工具（`view_file`、`grep_chat_files` 等）缺失 | 它们需要请求正文中有 `files`、有 `session_id`、模型的 **File Upload** 能力已开启，并且 **Preload files** 已关闭。除非模型将其保存为关闭，否则 API 请求会将 Preload files 视为开启 | 请参阅[提示词缓存与上下文优化](/features/chat-conversations/prompt-caching) |
| `Machine unavailable: ...` | 机器无法访问、已禁用，或你的用户没有访问授权。路径 B 返回 HTTP `503`，路径 A 在助手消息中显示错误 | 确认该 ID 出现在此密钥的 `GET /api/v1/machines/` 结果中 |
| `Machine unavailable: 409: This machine requires a saved chat` | 机器的 `scope` 为 `chat`，而请求没有已保存的 `chat_id`。其返回方式与上一行相同 | 使用具有已保存聊天的路径 A，或选择另一台机器 |
| MCP 工具连接失败 | MCP 服务器受 OAuth 保护，而 API 密钥的用户尚未授权 | 在浏览器中以该用户身份完成一次 OAuth 流程 |
| 聊天已创建，但在 UI 中保持为空 | 消息树损坏 | `currentId` 使用 camelCase，并且每条消息都需要 `parentId` 和 `childrenIds`。请参阅[后端控制的 API 流程](/reference/api-flow) |

---

## 另请参阅 {#see-also}

- [API 端点](/reference/api-endpoints)：完整端点列表、Anthropic Messages API、RAG 和文件上传。
- [后端控制的 API 流程](/reference/api-flow)：路径 A 使用的聊天和消息树结构。
- [工具](/features/extensibility/plugin/tools)：内置工具参考、原生与 legacy 对比、按模型控制。
- [Model Context Protocol（MCP）](/features/extensibility/mcp)：添加 MCP 服务器。
- [Open Terminal](/features/open-terminal)：在机器上设置 Open Terminal。
- [API 密钥](/features/authentication-access/api-keys)和[权限](/features/authentication-access/rbac/permissions)。
