---
sidebar_position: 5
title: "创建文档和文件"
---

# 创建文档和文件

读取文件只是其中一半。Open Terminal 还可以**写入**文件：Word 文档、PDF、幻灯片、图表或脚本。AI 使用镜像中已有的普通 Python 库构建文件，将其保存到你的工作区，还可以直接把它放进聊天，并附上**下载按钮**。

这无需任何设置。不需要插件或导出服务，也不需要从代码块中复制并粘贴内容。

## 可以生成哪些内容 {#what-it-can-produce}

| 类型 | 格式 |
| :--- | :--- |
| **文档** | Word (.docx)、PDF、Markdown、纯文本、HTML |
| **电子表格** | Excel (.xlsx)、CSV |
| **演示文稿** | PowerPoint (.pptx) |
| **图形** | SVG、PNG 图表、调整大小和转换格式后的图片 |
| **代码** | Python、Shell 脚本、配置文件，以及任何其他基于文本的内容 |

默认镜像提供了 `python-docx`、`python-pptx`、`fpdf`、`openpyxl`、`Pillow` 和 `matplotlib`，涵盖上述所有类型。缺少的组件可以当场安装。

---

## “把这个放进 Word 文档” {#put-this-in-a-word-document}

> **你：** 将站点读数整理成一页 Word 文档，包含摘要和各站点总计的表格，然后展示给我。

AI 会读取数据，构建包含标题、摘要段落和实际表格的 `.docx`，并在聊天中显示。

![AI 生成 Word 文档并在聊天中显示](/images/open-terminal-create-docx.png)

---

## “给我制作一份 PDF” {#make-me-a-pdf}

> **你：** 用相同的读数制作一页 PDF，包含标题和各站点总计。

![AI 生成 PDF 并在聊天中显示](/images/open-terminal-create-pdf.png)

长文档会打开到你指定的页面。请参阅[在聊天消息中显示文件](../file-browser.md#files-shown-in-the-chat-message)。

---

## “把它做成幻灯片” {#turn-it-into-a-deck}

> **你：** 制作一份三页的幻灯片来介绍这些读数：一页标题页、一页各站点总计，以及一页需要关注的站点。

生成的幻灯片带有幻灯片导航栏和页面控件，因此你无需离开对话即可逐页浏览。

![AI 生成 PowerPoint 幻灯片并在聊天中显示](/images/open-terminal-create-pptx.png)

---

## “把它绘制成 SVG” {#draw-it-as-an-svg}

> **你：** 将各站点的输出绘制成纯 SVG 文件中的条形图，不使用外部资源。

矢量输出以文本形式写入，因此 AI 之后可以像编辑其他文件一样编辑它。你可以要求更换颜色或添加标签，它会重写图形元素，而不是重新生成一张图片。

![AI 生成 SVG 图表并在聊天中显示](/images/open-terminal-create-svg.png)

---

## “为此给我写一个脚本” {#write-me-a-script-for-it}

> **你：** 写一个脚本，根据原始 CSV 重新生成调查报告，这样我下个季度可以再次运行。

代码会以工作区文件的形式返回，而不是需要你从聊天中复制出来的代码块，因此可以直接运行和编辑。

![AI 将 Python 脚本写入工作区](/images/open-terminal-create-python.png)

---

## “把它整理到 Wiki 中” {#write-it-up-for-the-wiki}

> **你：** 将调查发现整理成用于 Wiki 的 Markdown。

Markdown 会在预览中渲染，因此你可以在粘贴到其他位置之前阅读完成后的页面。

![AI 将调查发现整理成 Markdown](/images/open-terminal-create-markdown.png)

---

## 取出文件 {#getting-the-file-out}

聊天中显示的每个文件，其卡片右上角都有一个**下载按钮**，紧邻在文件浏览器中打开该文件的控件。

![聊天中文件上的下载按钮](/images/open-terminal-inline-download-button.png)

文件也保存在你的工作区中，因此[文件浏览器](../file-browser.md)同样包含它，与 AI 创建的其他所有内容放在一起。让它直接显示在聊天中，可以省去你亲自查找的步骤。

:::tip 指定所需的格式
直接用自然语言说“作为 Word 文档”“作为 PDF”“作为幻灯片”“作为 SVG”即可。如果不作说明，AI 通常会选择 Markdown，它适合阅读，但不太适合转发给他人。
:::

---

## 相关内容 {#related}

- [分析文档和数据](./file-analysis.md)
- [文件浏览器](../file-browser.md)
