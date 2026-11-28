---
sidebar_position: 19
title: "外部"
---

:::warning

本教程由社区贡献，不受 Open WebUI 团队支持，仅用于演示如何针对你的特定用例自定义 Open WebUI。想要参与贡献？请查看贡献教程。

:::

:::tip

有关 Web Search 相关的所有环境变量（包括并发设置、结果数量等）的完整列表，请参阅[环境配置文档](/reference/env-configuration#web-search)。

:::

:::tip 故障排除

网页搜索遇到问题？请查看[网页搜索故障排除指南](/troubleshooting/web-search)，了解代理配置、连接超时和内容为空等常见问题的解决方法。

:::

## 外部网页搜索 API {#external-web-search-api}

此选项允许你将 Open WebUI 连接到自己托管的网页搜索 API 端点。适用于以下情况：

- 集成 Open WebUI 原生不支持的搜索引擎。
- 实现自定义搜索逻辑、过滤或结果处理。
- 使用私有或内部搜索索引。

### Open WebUI 设置 {#open-webui-setup}

1. 进入 Open WebUI 的 `Admin Panel`。
2. 打开 `Settings` 选项卡，然后选择 `Web Search`。
3. 将 `Web Search` 切换到开启状态。
4. 在下拉菜单中将 `Web Search Engine` 设置为 `external`。
5. 使用自定义搜索 API 端点的完整 URL 填写**外部网页搜索 URL**（`EXTERNAL_WEB_SEARCH_URL`），例如 `http://localhost:8000/search` 或 `https://my-search-api.example.com/api/search`。
6. 使用自定义搜索端点要求的身份验证密钥填写**外部网页搜索 API 密钥**（`EXTERNAL_WEB_SEARCH_API_KEY`）。如果端点不需要身份验证，请留空（对于公开端点，不建议这样做）。
7. 点击 `Save`。

![Open WebUI 管理员面板中的外部搜索配置](/images/tutorial_external_search.png)

### API 规范 {#api-specification}

Open WebUI 将通过以下方式与你的**外部网页搜索 URL**交互：

- **方法：**`POST`
- **标头：**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_EXTERNAL_SEARCH_API_KEY>`
  - `User-Agent: Open WebUI (https://github.com/open-webui/open-webui) RAG Bot`
  - 用户身份标头（`X-OpenWebUI-User-Name`、`X-OpenWebUI-User-Id`、`X-OpenWebUI-User-Email`、`X-OpenWebUI-User-Role`，或设置了 `FORWARD_USER_INFO_HEADER_JWT_SECRET` 时的签名 JWT），以及存在聊天 ID 时的 `X-OpenWebUI-Chat-Id`
- **请求正文（JSON）：**

    ```json
    {
      "query": "The user's search query string",
      "count": 5 // 请求返回的最大搜索结果数
    }
    ```

  - `query`（字符串）：用户输入的搜索词。
  - `count`（整数）：Open WebUI 期望的建议最大结果数。必要时，你的 API 可以返回更少的结果。

- **预期响应正文（JSON）：**
    你的 API 端点*必须*返回一个由搜索结果对象组成的 JSON 数组。每个对象应具有以下结构：

    ```json
    [
      {
        "link": "URL of the search result",
        "title": "Title of the search result page",
        "snippet": "A brief description or snippet from the search result page"
      },
      {
        "link": "...",
        "title": "...",
        "snippet": "..."
      }
      // 可能还有更多结果，最多为请求的数量
    ]
    ```

  - `link`（字符串）：搜索结果的直接 URL。
  - `title`（字符串）：网页标题。
  - `snippet`（字符串）：页面内容中与查询相关的描述性文本摘要。

    如果发生错误或找不到结果，端点最好返回一个空的 JSON 数组 `[]`。

### 示例实现（Python/FastAPI） {#example-implementation-pythonfastapi}

下面是一个使用 Python、FastAPI 和 `duckduckgo-search` 库实现自托管搜索 API 的简单示例。

```python
import uvicorn
from fastapi import FastAPI, Header, Body, HTTPException
from pydantic import BaseModel
from duckduckgo_search import DDGS

EXPECTED_BEARER_TOKEN = "your_secret_token_here"

app = FastAPI()

class SearchRequest(BaseModel):
    query: str
    count: int

class SearchResult(BaseModel):
    link: str
    title: str | None
    snippet: str | None

@app.post("/search")
async def external_search(
    search_request: SearchRequest = Body(...),
    authorization: str | None = Header(None),
):
    expected_auth_header = f"Bearer {EXPECTED_BEARER_TOKEN}"
    if authorization != expected_auth_header:
        raise HTTPException(status_code=401, detail="Unauthorized")

    query, count = search_request.query, search_request.count

    results = []
    try:
        with DDGS() as ddgs:
            search_results = ddgs.text(
                query, safesearch="moderate", max_results=count, backend="lite"
            )

        results = [
            SearchResult(
                link=result["href"],
                title=result.get("title"),
                snippet=result.get("body"),
            )
            for result in search_results
        ]

    except Exception as e:
        print(f"Error during DuckDuckGo search: {e}")

    return results

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8888)
```
