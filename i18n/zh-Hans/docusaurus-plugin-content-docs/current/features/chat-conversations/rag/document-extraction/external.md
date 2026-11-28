---
sidebar_position: 5
title: "外部文档提取"
---

# 外部文档提取

内置引擎（Tika、Docling、Mistral OCR 等）可以覆盖大多数场景，但有时它们都不适合：你可能有专有的 OCR 工具、已经在付费使用的云端提取 API；提取工作负载可能很重，你宁愿在独立的 GPU 或高内存机器上运行，而不是在 Open WebUI 服务器上运行；也可能有合规要求，必须在文本到达 Open WebUI 或模型之前对 PII 进行脱敏。对于这些情况，**外部（external）**引擎会将文档提取完全交由你自行编写和运行的 HTTP 服务处理。

由于该服务由你控制，你也可以控制其内部行为。它可以实现以下能力，后文会进一步说明：

- **按文件类型路由。** 只需配置一个 URL，由你的服务在内部决定使用哪个解析器或模型处理 `.xlsx`、`.pdf` 及其他文件。
- **将大型文档拆分为多个可检索片段。** 按工作表、页面或幻灯片分别返回一个分块，而不是返回一个巨大的文本块。
- **应用针对每位用户的逻辑。** Open WebUI 会在每个请求中转发发起请求的用户身份，因此你的服务可以执行访问规则，或路由到特定客户使用的后端。
- **转发包含实时值的自定义请求头。** 可以配置在每个提取请求中发送发起请求的用户邮箱或文件名等请求头，用于你的服务中的路由、日志记录或访问控制。请参阅下方的[请求头](#the-contract)。
- **处理图像和视频。** 默认情况下，外部引擎是唯一会接收图像和视频上传以进行提取的引擎。设置**支持的媒体 MIME 类型（Supported Media MIME Types）**后，媒体会改为发送给与该列表匹配的引擎。

## 配置 {#configuration}

在**设置（Settings）** > **文档（Documents）**（管理员区域）中，将**内容提取引擎（Content Extraction Engine）**设为 **External**，然后填写：

- **文档加载器 URL（Document Loader URL）**：你的服务的基础 URL。Open WebUI 会在其后追加 `/process`。
- **API 密钥（API Key）**：作为 bearer 令牌发送。此项必填。如果引擎已设为 External 但未保存密钥，Open WebUI 会在没有提示的情况下回退到内置加载器，始终不会调用你的服务，管理员面板也不会发出警告。
- **请求头（Headers）**（可选）：随每个请求发送的附加请求头 JSON 对象，请参阅下方的[模板替换](#the-contract)。如果它不是有效的 JSON 对象，**保存（Save）**会显示 `Headers must be a valid JSON object`，并且不会保存任何内容，即使选择的是其他引擎也是如此。切回 **External** 即可修正或清空该字段。

这些设置也有对应的环境变量：[`CONTENT_EXTRACTION_ENGINE=external`](/reference/env-configuration#content_extraction_engine)、[`EXTERNAL_DOCUMENT_LOADER_URL`](/reference/env-configuration#external_document_loader_url)、[`EXTERNAL_DOCUMENT_LOADER_API_KEY`](/reference/env-configuration#external_document_loader_api_key)、[`EXTERNAL_DOCUMENT_LOADER_HEADERS`](/reference/env-configuration#external_document_loader_headers)。

## 接口约定 {#the-contract}

对于每个文件，Open WebUI 都会发送：

```
PUT {EXTERNAL_DOCUMENT_LOADER_URL}/process
```

- **请求体**：未经修改的原始文件字节。
- **`Content-Type`**：检测到的文件 MIME 类型。
- **`Authorization`**：`Bearer {EXTERNAL_DOCUMENT_LOADER_API_KEY}`（如果配置了 API 密钥）。
- **`X-Filename`**：存储的文件名，即 `<file id>_<original name>`，经过 URL 编码。如需单独接收原始文件名，请在自定义请求头中使用 `{{FILE_NAME}}` 占位符。
- 在**请求头（Headers）** / [`EXTERNAL_DOCUMENT_LOADER_HEADERS`](/reference/env-configuration#external_document_loader_headers) 中设置的任何请求头。这是一个支持占位符模板替换的自定义请求头 JSON 对象：`{{FILE_ID}}`、`{{FILE_NAME}}`、`{{FILE_CONTENT_TYPE}}`、`{{USER_ID}}`、`{{USER_NAME}}`、`{{USER_EMAIL}}`、`{{USER_ROLE}}`、`{{USER_GROUPS}}`、`{{USER_GROUP_IDS}}`。字段下方的**请求头变量（Header variables）**提示只列出三个文件占位符，但用户占位符同样会被填充。`{{USER_GROUPS}}` 和 `{{USER_GROUP_IDS}}` 分别是以逗号分隔的用户组名称和 ID 列表。
- 自动转发的用户身份：如果设置了 [`FORWARD_USER_INFO_HEADER_JWT_SECRET`](/reference/env-configuration#forward_user_info_header_jwt_secret)，则在 `X-OpenWebUI-User-Jwt` 中发送签名 JWT；否则发送明文的 `X-OpenWebUI-User-Name`、`X-OpenWebUI-User-Id`、`X-OpenWebUI-User-Email` 和 `X-OpenWebUI-User-Role` 请求头。

你的服务应返回 `2xx` 状态码和 JSON 响应体，可以是单个对象，也可以是对象列表：

```json
{
  "page_content": "extracted text for this document",
  "metadata": { "any": "extra fields you want stored alongside the chunk" }
}
```

返回列表时，每个条目都会生成一个 Document，并可被独立检索。通过这种方式，可以将单次上传拆分为多个可检索片段，例如每个工作表、页面或幻灯片对应一个条目，而不是一个巨大的文本块。非 2xx 响应或无内容响应都会导致提取失败，并向用户显示错误。

## 最小示例 {#minimal-example}

下面是一个实现上述接口约定的精简 FastAPI 服务，它返回占位内容，而非实际提取结果：

```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import uvicorn

app = FastAPI()


@app.put("/process")
async def process(request: Request):
    filename = request.headers.get("x-filename", "")
    content_type = request.headers.get("content-type", "")
    file_bytes = await request.body()

    # TODO：替换为实际提取逻辑
    extracted_text = f"Placeholder text for {filename} ({len(file_bytes)} bytes)"

    return JSONResponse({
        "page_content": extracted_text,
        "metadata": {"source": filename, "content_type": content_type},
    })


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
```

先运行 `pip install fastapi uvicorn`，再运行该服务，然后将**文档加载器 URL（Document Loader URL）**设为 Open WebUI 实例能够访问该服务的地址。例如，本地设置可使用 `http://localhost:5000`，共享 Docker 网络可使用 `http://your-service:5000`。

## 参考 {#reference}

- [`CONTENT_EXTRACTION_ENGINE`](/reference/env-configuration#content_extraction_engine)
- [`EXTERNAL_DOCUMENT_LOADER_URL`](/reference/env-configuration#external_document_loader_url)
- [`EXTERNAL_DOCUMENT_LOADER_API_KEY`](/reference/env-configuration#external_document_loader_api_key)
- [`EXTERNAL_DOCUMENT_LOADER_HEADERS`](/reference/env-configuration#external_document_loader_headers)
