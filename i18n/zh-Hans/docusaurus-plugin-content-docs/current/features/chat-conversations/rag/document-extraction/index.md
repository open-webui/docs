---
sidebar_position: 1
title: "文档提取"
---

## Open WebUI 中的文档提取 {#document-extraction-in-open-webui}

Open WebUI 提供强大的文档提取能力，可在 RAG（检索增强生成）工作流中处理和分析各类文档。文档提取可将非结构化文档内容转换为语言模型能够有效使用的结构化数据，是这一过程的关键环节。

## 什么是文档提取？ {#what-is-document-extraction}

文档提取是指从各种文件格式中自动识别并提取文本和数据的过程，包括：

- PDF（文本型和扫描型）
- 包含文本的图像
- 手写文档
- 以及更多格式

借助适当的文档提取，Open WebUI 可以帮助你：

- 将基于图像的文档转换为可搜索文本
- 保留文档结构和布局信息
- 以结构化格式提取数据，以便进一步处理
- 支持多语言内容识别

### 临时聊天中的文档附件 {#document-attachments-in-temporary-chats}

在**临时聊天（Temporary Chat）**中附加本地文档时，浏览器会提取其文本，而不会将原文件作为 Open WebUI 文件上传。发送消息时，提取的文本会作为聊天请求的一部分发送到 Open WebUI 后端。

浏览器在此步骤中使用内置解析器。PDF 提取会读取文本层而不执行 OCR，并用空格连接文本项，因此扫描页面可能无法生成任何文本，表格布局也可能丢失。DOCX 提取会返回纯文本。如果需要使用服务器配置的提取引擎，请使用标准聊天。

:::info 将图像和视频发送到提取引擎

上传的图像或视频会按原样存储，供视觉模型查看，而不会经过提取引擎处理。默认情况下，[`external` 引擎](/features/chat-conversations/rag/document-extraction/external)会接收媒体文件。

通过 [`CONTENT_EXTRACTION_SUPPORTED_MEDIA_MIME_TYPES`](/reference/env-configuration#content_extraction_supported_media_mime_types)，或**设置（Settings）** > **文档（Documents）**（管理员区域）中的**支持的媒体 MIME 类型（Supported Media MIME Types）**，可以自行选择处理方式：列出提取引擎可读取的 MIME 类型，例如为 OCR 引擎填写 `image/*`，这样无论运行哪种引擎，匹配的上传文件都会被提取。在管理员面板中将该字段保存为空，或将变量设为空字符串，都会存储一个空列表，从而关闭所有引擎（包括外部引擎）的媒体提取。

:::

## PDF 加载器模式 {#pdf-loader-mode}

使用默认**内容提取引擎（Content Extraction Engine）**时，**设置（Settings）** > **文档（Documents）**（管理员区域）中的 **PDF 加载器模式（PDF Loader Mode）**或 [`PDF_LOADER_MODE`](/reference/env-configuration#pdf_loader_mode) 决定 PDF 页面在分块前如何转换为文本。其他引擎会忽略此设置。

| | **页面（Page，默认）** | **单文档（Single）** |
| --- | --- | --- |
| 文本 | 每页生成一个文档 | 将所有页面合并为一个文档 |
| 分块 | 绝不跨越分页边界 | 可以跨越分页边界 |
| 引用 | 显示 `(page N)`，并在 PDF 中打开对应页面 | 不显示页码 |

当句子或表格经常延续到下一页，并且引用中可以不包含页码时，请选择**单文档（Single）**。该模式在文件提取时生效。知识库中已有的文件只有在同一设置页面执行**重建知识与记忆向量索引（Reindex Knowledge and Memory Vectors）**后才会改变，该操作会重新提取这些文件。

## ODT、MSG 和 PowerPoint 的依赖项 {#dependencies-for-odt-msg-and-powerpoint}

当默认**内容提取引擎（Content Extraction Engine）**在非精简安装中运行时，这些格式使用以下解析器。

| 格式 | 提取依赖项 |
| --- | --- |
| OpenDocument Text（`.odt`） | 需要 `unstructured`、`pypandoc` 和 Pandoc 可执行文件。解析器会先将文件转换为 DOCX，再提取其文本。 |
| Outlook 邮件（`.msg`） | 需要 `unstructured` 和 `python-oxmsg` 来处理 Outlook MSG 内容。Open WebUI 会跳过邮件附件。 |
| PowerPoint（`.ppt`、`.pptx`） | 可以导入 `unstructured` 时使用它。如果导入失败，Open WebUI 会尝试使用可读取 `.pptx` 文件的 `python-pptx`。旧版二进制 `.ppt` 文件需要支持该格式的提取器。 |

PowerPoint 回退发生在加载器选择阶段。如果 `unstructured` 导入成功，但之后解析失败，该错误不会触发回退。

**允许的文件扩展名（Allowed File Extensions）**控制接受哪些上传文件进行处理。对于 RAG 索引，所选提取器还必须能够读取该文件。预览支持则取决于文件查看器。

## 没有专用加载器的文件 {#files-without-a-dedicated-loader}

使用默认**内容提取引擎（Content Extraction Engine）**时，如果文件扩展名没有专用加载器，系统会将其作为纯文本读取。源代码和配置文件（例如 `.py`、`.js`、`.ts`、`.go`、`.sql`、`.json`、`.yaml` 或 `.toml`）可通过这种方式用于 RAG。没有加载器的二进制格式（例如 `.ods` 或 `.odp`）也会以同样方式读取，但会生成无法阅读的文本而不是报错，因此检索会返回其中的噪声。在精简镜像中，此类文件会改为报错：`This file type requires an external document extractor in slim. Configure one that supports it.`

如果只接受已知能良好提取的格式，请在**设置（Settings）** > **文档（Documents）**（管理员区域）的**允许的文件扩展名（Allowed File Extensions）**中列出这些格式，不带前导点；也可以在 [`RAG_ALLOWED_FILE_EXTENSIONS`](/reference/env-configuration#rag_allowed_file_extensions) 中配置。此后，使用任何其他扩展名的上传都会失败，并显示 `File type <extension> is not allowed`。

## 可用的提取方法 {#available-extraction-methods}

Open WebUI 支持多种文档提取引擎，以适应不同的需求和文档类型。每种提取方法都有各自的优势，适用于不同场景。

请查阅每种可用提取方法的文档，了解如何在 Open WebUI 实例中设置并有效使用它。以下四个引擎目前还没有独立页面：Datalab Marker、MinerU、Azure Document Intelligence 和 PaddleOCR-VL。它们的设置列在[环境变量参考](/reference/env-configuration#rag-content-extraction-engine)中。
