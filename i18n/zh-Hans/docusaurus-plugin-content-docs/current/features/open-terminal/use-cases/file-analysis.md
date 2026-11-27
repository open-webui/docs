---
sidebar_position: 2
title: "分析文档和数据"
description: "使用 Open Terminal 读取文档、分析电子表格、从文件中提取信息，并在 Open WebUI 中返回结果。"
---

# 分析你的文档和数据

有一堆电子表格、PDF、Word 文档或电子邮件需要理解吗？将它们放入文件浏览器，让 AI 为你读取。Open Terminal 可以打开并理解所有这些格式，无需特殊设置。

## 它可以读取哪些文件类型？ {#what-file-types-can-it-read}

| 类型 | 格式 |
| :--- | :--- |
| **电子表格** | Excel (.xlsx、.xls)、OpenDocument (.ods)、CSV |
| **文档** | Word (.docx)、OpenDocument (.odt)、富文本 (.rtf)、PDF |
| **演示文稿** | PowerPoint (.pptx)、OpenDocument (.odp) |
| **其他** | 电子邮件 (.eml)、电子书 (.epub)、纯文本、HTML、Markdown、JSON、XML |

Open Terminal 在其执行环境中读取和处理文件。返回给 AI 的内容会发送到为当前对话配置的模型端点。如果相关内容必须留在你的基础设施内，请使用本地模型和本地处理服务。请参阅[聊天数据隐私与加密](/security/chat-data-privacy-and-encryption)。

---

## “总结这份报告” {#summarize-this-report}

> **你：** *（将 PDF 拖放到文件浏览器中）* <br/>
> 你能阅读这份季度报告并告诉我关键要点吗？

AI 会打开 PDF 并通读内容，为你提供简明摘要，提取收入数字、关键决策、显著变化等重要信息。

![AI 读取并分析文件内容](/images/open-terminal-ai-csv-analysis.png)

---

## “处理所有这些发票” {#go-through-all-those-invoices}

> **你：** /invoices 文件夹中大约有 30 张发票。你能全部读取，并制作一份包含供应商名称、日期和金额的电子表格吗？

AI 会打开文件夹中的每个文件（即使其中混合了 PDF 和 Word 文档）、提取信息，并创建一份整洁、可下载的电子表格。

![AI 列出文件并提供结构化分析](/images/open-terminal-ai-file-listing.png)

---

## “这些邮件对截止日期是怎么说的？” {#what-do-these-emails-say-about-the-deadline}

> **你：** *（上传多个 .eml 文件）* <br/>
> 阅读这些邮件，找出所有提及截止日期或到期日期的内容。

AI 会读取邮件文件（包括发件人、日期、主题和正文），并提取相关信息。

![AI 读取文件并提取特定信息](/images/open-terminal-ai-file-listing.png)

---

## “分析这些数据并制作图表” {#analyze-this-data-and-make-a-chart}

> **你：** *（将 sales_data.xlsx 放入文件浏览器）* <br/>
> 按地区细分销售额，并制作一个饼图。

AI 会读取电子表格、处理数据、创建图表，并将其保存为可预览和下载的图片。

![AI 分析销售数据并按产品汇总](/images/open-terminal-ai-csv-analysis.png)

---

## “搜索所有这些文档” {#search-across-all-these-documents}

> **你：** 搜索 /contracts 文件夹中的所有内容，查找任何提及“终止条款”或“取消”的地方。

AI 会搜索每个文件（PDF、Word 文档、电子表格等所有文件），并准确告诉你找到匹配内容的位置。

![AI 跨文件搜索特定内容](/images/open-terminal-ai-file-listing.png)

:::tip 无需建立索引
与传统的搜索或 RAG 系统不同，AI 会在你每次提问时实时读取文件。这意味着它看到的是磁盘上的当前版本：无需重新索引，没有同步延迟，也无需管理数据库。
:::

---

## 处理大文件 {#working-with-large-files}

如果文档很长，AI 会有选择地分段读取，而不是一次性全部读取。你也可以要求它专注于特定部分：

> “只阅读这份报告的执行摘要部分”

> “向我显示这份电子表格的第 500 至 600 行”

## 更多可尝试的操作 {#more-things-to-try}

- **[从聊天运行代码 →](./code-execution.md)**：AI 编写、运行和调试代码
- **[构建并预览网站 →](./web-development.md)**：创建网页并反复改进
- **[探索文件浏览器 →](../file-browser.md)**：上传、预览、下载和编辑文件
