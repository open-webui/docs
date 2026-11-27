---
sidebar_position: 4
title: "Mistral OCR"
---

:::warning

本教程由社区贡献，不受 Open WebUI 团队支持。它仅用于演示如何针对你的具体用例自定义 Open WebUI。想要贡献内容？请查看贡献教程。

:::

## Mistral OCR {#mistral-ocr}

本文档提供将 Mistral OCR 与 Open WebUI 集成的分步指南。Mistral OCR 是一种光学字符识别库，可将各种基于图像的文件格式（包括扫描 PDF、图像和手写文档）中的文本提取为 JSON 或纯文本等结构化数据。凭借对多语言文本识别、布局分析和手写内容解读的高级支持，Mistral OCR 通过稳健且可自定义的界面，简化了面向搜索、摘要和数据提取等 AI 应用的文档数字化与处理过程。

## 前提条件 {#prerequisites}

- Open WebUI 实例
- Mistral AI 账户

# 集成步骤

### 第 1 步：注册或登录 Mistral AI 控制台 {#step-1-sign-up-or-login-to-mistral-ai-console}

- 前往 `https://console.mistral.ai`
- 按照页面说明完成流程
- 成功授权后，你将进入控制台主页（Console Home）

### 第 2 步：生成 API 密钥 {#step-2-generate-an-api-key}

- 前往 `API Keys` 或 `https://console.mistral.ai/api-keys`
- 创建新密钥，并务必复制保存

### 第 3 步：配置 Open WebUI 使用 Mistral OCR {#step-3-configure-open-webui-to-use-mistral-ocr}

- 登录你的 Open WebUI 实例。
- 进入管理员面板（`Admin Panel`）设置菜单。
- 点击设置（`Settings`）。
- 点击文档（`Documents`）标签页。
- 将**内容提取引擎（Content Extraction Engine）**设为 **Mistral OCR**。
- 将密钥粘贴到 **API 密钥（API Key）**中。
- 除非通过代理或区域终结点路由请求，否则保持 **API 基础 URL（API Base URL）**（`MISTRAL_OCR_API_BASE_URL`，默认 `https://api.mistral.ai/v1`）不变
- 保存管理员面板。

### 可选：以 Base64 发送 PDF {#optional-send-pdfs-as-base64}

默认情况下，Open WebUI 会先将 PDF 上传到 Mistral 的文件存储，再对其运行 OCR。开启**设置（Settings）** → **文档（Documents）**（管理员区域）中的**使用 Base64（Use Base64）**（或设置 [`MISTRAL_OCR_USE_BASE64=true`](/reference/env-configuration#mistral_ocr_use_base64)），则会在单个请求中将 PDF 作为 **base64 数据 URL 内联发送**，跳过单独的上传步骤。这适用于代理或物理隔离环境，也有助于解决上传步骤失败的问题；代价是单个请求的体积更大。

### 可选：选择 OCR 模型 {#optional-choose-the-ocr-model}

**设置（Settings）** → **文档（Documents）**（管理员区域）中的**参数（Parameters）**字段（或 [`MISTRAL_OCR_PARAMS`](/reference/env-configuration#mistral_ocr_params)）接受一个 JSON 对象，该对象会合并到每个 OCR 请求中。例如，`{"model": "mistral-ocr-2512"}` 可替换默认的 `mistral-ocr-latest` 模型。

### 发送的内容与失败时的行为 {#what-is-sent-and-what-happens-on-failure}

Open WebUI 只将 `.pdf` 上传文件发送到 Mistral OCR。包括图像在内的所有其他文件类型都通过内置加载器处理。OCR 调用失败不会导致上传失败：文件仍会使用一个内容为 `Error during processing: ...` 的分块建立索引。因此，当文档看似已处理却检索不到有用内容时，请检查文件的提取内容。

## 验证 Mistral OCR {#verifying-mistral-ocr}

如需通过脚本验证 Mistral OCR 是否正常工作，请参阅 `https://docs.mistral.ai/capabilities/document_ai/basic_ocr/`。

### 总结 {#conclusion}

将 Mistral OCR 与 Open WebUI 集成，是增强文档处理和内容提取能力的一种简单有效的方式。按照本指南中的步骤，即可将 Mistral OCR 设置为默认提取引擎，并利用其高级文本识别功能。配置完成后，Mistral OCR 可提供强大的多语言文档解析能力，支持多种格式，从而增强 Open WebUI 中由 AI 驱动的文档分析能力。
