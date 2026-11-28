---
sidebar_position: 1
title: "代码执行"
---

# 代码执行

Open Terminal 让 AI 能够实时编写、执行和调试代码。它可以处理完整流程：编写脚本、运行脚本、读取错误，并不断迭代，直到结果正确。

---

## 数据可视化 {#data-visualization}

> **你：** 创建一个图表，展示人口最多的 10 个国家。

AI 会编写并执行 Python 脚本，然后保存输出。结果可在文件浏览器中查看。

![AI 创建并运行 Python 脚本及其输出](/images/open-terminal-ai-code-execution.png)

---

## 下载和处理文件 {#downloading-and-processing-files}

> **你：** 下载此网页中的图片，并按大小排序。

AI 会安装所需的软件包、编写脚本、下载文件并进行整理：

![AI 安装库并运行脚本](/images/open-terminal-ai-install-run.png)

:::tip 自动安装依赖
在 Docker 模式下，AI 可以根据需要安装软件包。如果任务需要尚未预装的库，它会先自动安装，再继续执行。
:::

---

## 自动纠正错误 {#self-correcting-errors}

代码运行失败时，AI 会读取错误输出并进行调整：

> **你：** 抓取此新闻网站上的所有文章标题。

AI 会编写爬虫；遇到意外的页面布局时，它会读取 `AttributeError` 回溯信息、调整 CSS 选择器，然后重新运行并成功完成任务。

![AI 检测错误、修复脚本并成功运行](/images/open-terminal-ai-debug-fix.png)

---

## 多步骤项目脚手架搭建 {#multi-step-project-scaffolding}

> **你：** 创建一个带有 Web 界面和数据库的待办事项应用。

AI 会：
1. 创建项目文件（HTML、CSS、JavaScript、Python 后端）
2. 安装依赖
3. 设置数据库
4. 启动服务器
5. 在浏览器标签页（Browser）中验证结果

![AI 列出文件并描述项目结构](/images/open-terminal-ai-file-listing.png)

---

## 系统查询 {#system-queries}

> **你：** 检查什么占用的磁盘空间最多。

![AI 分析磁盘使用情况并找出大文件](/images/open-terminal-ai-disk-usage.png)

---

## 可用语言 {#available-languages}

| 语言 | 状态 |
| :--- | :--- |
| Python | 已预装 |
| JavaScript (Node.js) | 已预装 |
| Bash | 始终可用 |
| Ruby | 已预装 |
| C / C++ | 已预装编译器 |

其他语言（Rust、Go、Java 等）可以按需即时安装。

## 相关内容 {#related}

- **[软件开发 →](./software-development.md)**：代码仓库、测试、调试、重构
- **[文档与数据分析 →](./file-analysis.md)**：电子表格、PDF、Word 文档
- **[Web 开发 →](./web-development.md)**：构建和预览网站
- **[系统自动化 →](./system-automation.md)**：文件管理、备份、批量操作
