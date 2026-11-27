---
sidebar_position: 3
title: "Docling 文档提取"
---

:::warning

本教程由社区贡献，不受 Open WebUI 团队支持。它仅用于演示如何针对你的具体用例自定义 Open WebUI。想要贡献内容？请查看贡献教程。

:::

## Docling 文档提取 {#docling-document-extraction}

本文档提供将 Docling 与 Open WebUI 集成的分步指南。Docling 是一个文档处理库，可将多种文件格式（包括 PDF、Word 文档、电子表格、HTML 和图像）转换为 JSON 或 Markdown 等结构化数据。Docling 内置布局检测、表格解析和语言感知处理支持，通过统一且可扩展的界面，简化面向搜索、摘要和检索增强生成等 AI 应用的文档准备工作。

## 前提条件 {#prerequisites}

- Open WebUI 实例
- 系统已安装 Docker
- 已为 Open WebUI 设置 Docker 网络

## 集成步骤 {#integration-steps}

### 第 1 步：运行 Docling-Serve 容器 {#step-1-run-docling-serve-container}

**基本 CPU 部署：**

```bash
docker run -p 5001:5001 \
  -e DOCLING_SERVE_ENABLE_UI=true \
  quay.io/docling-project/docling-serve
```

**GPU 部署（NVIDIA CUDA）：**

```bash
docker run --gpus all -p 5001:5001 \
  -e DOCLING_SERVE_ENABLE_UI=true \
  quay.io/docling-project/docling-serve-cu128
```

**推荐的生产环境 Docker Compose 部署：**

```yaml
services:
  docling-serve:
    image: quay.io/docling-project/docling-serve-cu128:latest
    container_name: docling-serve
    ports:
      - "5001:5001"
    environment:
      # 启用 Web UI 以进行测试
      - DOCLING_SERVE_ENABLE_UI=true
      # 关键：使用外部 LLM API 生成图片描述时必需
      - DOCLING_SERVE_ENABLE_REMOTE_SERVICES=true
      # 本地引擎工作进程数量
      - DOCLING_SERVE_ENG_LOC_NUM_WORKERS=2
      # CPU 线程配置
      - OMP_NUM_THREADS=4
      - MKL_NUM_THREADS=4
      # 重要：保持为 1，以避免“Task Not Found”错误
      - UVICORN_WORKERS=1
    restart: unless-stopped
    # 使用 NVIDIA GPU 支持时：
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
```

:::danger 重要：UVICORN_WORKERS 设置

将 `UVICORN_WORKERS` 设为大于 1 并与默认的 `LocalOrchestrator` 一起使用时，会遇到 **“Task Not Found (404)”**错误。这是因为每个工作进程都维护自己的内存任务存储，一个工作进程创建的任务无法被另一个工作进程访问。

**始终使用 `UVICORN_WORKERS=1`**，除非你配置了 Redis 之类的共享状态机制。

:::

### 第 2 步：配置 Open WebUI {#step-2-configure-open-webui}

1. 登录你的 Open WebUI 实例
2. 进入**设置（Settings）** → **文档（Documents）**（管理员区域）
3. 将**内容提取引擎（Content Extraction Engine）**设为 **Docling**
4. 将 **Docling 服务器 URL（Docling Server URL）**设为 `http://host.docker.internal:5001`（Docker）或 `http://localhost:5001`（原生安装）。默认值为 `http://docling:5001`。
5. 可选：设置 **API 密钥（API Key）**（`DOCLING_API_KEY`），该密钥会作为 `X-Api-Key` 请求头发送到 docling-serve
6. 保存更改

### 第 3 步：配置图片描述（可选） {#step-3-configure-picture-description-optional}

要在文档中启用由 AI 驱动的图像描述，请在**文档（Documents）**标签页的 Docling 设置下，将图片描述选项添加到**参数（Parameters）**JSON 字段中。有两种可用模式：

- **local**：视觉模型在 Docling 容器内部运行，通过 `picture_description_local` 配置
- **API**：Docling 调用外部服务（例如 Ollama 或 OpenAI 兼容终结点），通过 `picture_description_api` 配置

:::danger API 模式的必需设置

使用 `API` 模式（调用 Ollama 等外部服务）时，**必须**在 docling-serve 上设置以下环境变量：

```bash
DOCLING_SERVE_ENABLE_REMOTE_SERVICES=true
```

如果不设置，Docling 会拒绝向外部服务发送请求，并返回 `OperationNotAllowed` 错误。

:::

#### JSON 配置示例 {#json-configuration-examples}

请确保你的配置是**有效的 JSON**！

:::warning 嵌套对象必须写成 JSON 字符串

Open WebUI 会将 Docling 参数值按你输入的原样作为 multipart 表单字段转发给 docling-serve，不会重新编码。Docling 从 JSON **字符串**中解析其嵌套选项（`picture_description_local`、`picture_description_api`、`picture_description_custom_config`），因此内联写入的对象无法正确传输，上传会在 docling-serve 端失败，并出现 `Invalid JSON for field ...` 错误。请按照下方示例，将这些值写成转义后的 JSON 字符串。普通值、布尔值和列表无需转义。

:::

**本地模型配置：**

```json
{
  "do_picture_description": true,
  "picture_description_local": "{\"repo_id\": \"HuggingFaceTB/SmolVLM-256M-Instruct\", \"generation_config\": {\"max_new_tokens\": 200, \"do_sample\": false}, \"prompt\": \"Describe this image in a few sentences.\"}"
}
```

**API 配置（Ollama）：**

```json
{
  "do_picture_description": true,
  "picture_description_api": "{\"url\": \"http://host.docker.internal:11434/v1/chat/completions\", \"params\": {\"model\": \"llava:7b\"}, \"timeout\": 60, \"prompt\": \"Describe this image in great detail.\"}"
}
```

## Docling-Serve 环境变量参考 {#docling-serve-environment-variables-reference}

| 变量 | 默认值 | 说明 |
|----------|---------|-------------|
| `DOCLING_SERVE_ENABLE_UI` | `false` | 在 `/ui` 终结点启用 Web UI |
| `DOCLING_SERVE_ENABLE_REMOTE_SERVICES` | `false` | 基于 API 的图片描述**必需** |
| `DOCLING_SERVE_ENG_LOC_NUM_WORKERS` | `1` | 本地引擎工作进程数量 |
| `DOCLING_SERVE_ARTIFACTS_PATH` | `/app/data` | 存储模型工件的路径 |
| `UVICORN_WORKERS` | `1` | Uvicorn 工作进程数量（**保持为 1！**） |
| `OMP_NUM_THREADS` | `4` | 用于 CPU 处理的 OpenMP 线程数 |
| `MKL_NUM_THREADS` | `4` | Intel MKL 线程数 |

## Docling 参数参考（Open WebUI） {#docling-parameters-reference-open-webui}

通过**设置（Settings）** > **文档（Documents）**（管理员区域）中的 `DOCLING_PARAMS` JSON 或环境变量进行配置。

| 参数 | 类型 | 说明 | 允许的值 |
|-----------|------|-------------|----------------|
| `pdf_backend` | `string` | PDF 解析引擎 | `dlparse_v1`、`dlparse_v2`、`dlparse_v4`、`pypdfium2` |
| `table_mode` | `string` | 表格提取质量 | `fast`、`accurate` |
| `ocr_engine` | `string` | OCR 库 | `tesseract`、`easyocr`、`ocrmac`、`rapidocr` |
| `do_ocr` | `bool` | 启用 OCR | `true`、`false` |
| `force_ocr` | `bool` | 对数字 PDF 强制执行 OCR | `true`、`false` |
| `pipeline` | `string` | 处理复杂度 | `standard`、`fast` |
| `ocr_lang` | `list[string]` | OCR 语言 | 请参阅下方说明 |

:::tip 语言代码
- **Tesseract**：3 字母 ISO 639-2 代码（例如 `eng`、`deu`、`fra`）
- **EasyOCR**：2 字母 ISO 639-1 代码（例如 `en`、`de`、`fr`）
:::

**配置示例：**

```json
{
  "do_ocr": true,
  "pdf_backend": "dlparse_v4",
  "table_mode": "accurate",
  "ocr_engine": "tesseract",
  "ocr_lang": ["eng"]
}
```

## 验证集成 {#verifying-the-integration}

1. 通过 `http://127.0.0.1:5001/ui` 访问 Docling UI
2. 上传测试文档，验证其返回 Markdown 输出
3. 在 Open WebUI 中，将文件上传到知识库并确认处理完成

## 故障排除 {#troubleshooting}

### 出现“Task result not found. Please wait for a completion status.” {#task-result-not-found-please-wait-for-a-completion-status}

**原因**：多个 Uvicorn 工作进程使用内存任务存储。

**解决方案**：在 docling-serve 配置中设置 `UVICORN_WORKERS=1`。

### 出现“Connections to remote services is only allowed when set explicitly” {#connections-to-remote-services-is-only-allowed-when-set-explicitly}

**原因**：图片描述 API 模式需要明确选择启用。

**解决方案**：将 `DOCLING_SERVE_ENABLE_REMOTE_SERVICES=true` 添加到 docling-serve 环境中。

### `/v1alpha/convert/file` 返回 404 Not Found {#404-not-found-on-v1alphaconvertfile}

**原因**：使用的 docling-serve 版本或 Open WebUI 版本过旧。

**解决方案**：
- 将 Open WebUI 更新到最新版本
- 将 docling-serve 更新到 v1.0 或更高版本

### docling-serve 日志中出现“Invalid JSON for field ...” {#invalid-json-for-field--in-the-docling-serve-logs}

**原因**：某个 Docling 嵌套参数被写成了内联对象。Open WebUI 会将 Docling 参数作为表单字段原样传递，因此 Docling 接收到的是对象的键，而不是对象本身。

**解决方案**：将 `picture_description_api` 等嵌套值写成转义后的 JSON 字符串。请参阅 [JSON 配置示例](#json-configuration-examples)。

### OCR 不工作或语言检测不正确 {#ocr-not-working-or-incorrect-language-detection}

**原因**：`ocr_lang` 的格式与所选 OCR 引擎不匹配。

**解决方案**：
- Tesseract 使用 3 字母代码：`["eng", "deu"]`
- EasyOCR 使用 2 字母代码：`["en", "de"]`

### 引用指向错误页面 {#citations-point-to-the-wrong-page}

**原因**：Docling 只在其 Markdown 输出中标记页面变化，因此空白页不会留下分页符。根据这些分页符计算的页码，会使空白页之后的每条引用都显示偏小的页码。Open WebUI 会从 Docling 随 Markdown 一起返回的 JSON 输出中获取页码。

**解决方案**：在**设置（Settings）** > **文档（Documents）**（管理员区域）中运行**重建知识与记忆向量索引（Reindex Knowledge and Memory Vectors）**，该操作会重新提取每个知识库文件；对于不在知识库中的受影响文件，请重新上传。页码在 Docling 提取文件时确定。

### 出现“Error calling Docling”且没有具体详细信息 {#error-calling-docling-with-no-specific-details}

**诊断步骤：**
1. 检查 docling-serve 日志：`docker logs docling-serve`
2. 通过 `http://localhost:5001/ui` 处的 UI 直接测试 Docling
3. 验证 Open WebUI 与 docling-serve 容器之间的网络连接

## 总结 {#conclusion}

将 Docling 与 Open WebUI 集成可以显著增强文档处理能力。请记住以下要点：

- **始终设置 `UVICORN_WORKERS=1`**，以避免任务路由问题
- 使用基于 API 的图片描述时，**启用 `DOCLING_SERVE_ENABLE_REMOTE_SERVICES=true`**
- **验证所有配置字段中的 JSON 语法**
