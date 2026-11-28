---
sidebar_position: 4
title: "自动化任务"
---

# 自动化任务

Open Terminal 不只用于代码。AI 可以管理文件、整理文件夹、批量处理数据、执行备份，并自动完成重复性工作，一切都可通过对话完成。

---

## “重命名并整理这些文件” {#rename-and-organize-these-files}

> **你：** 我的 /photos 文件夹中有 200 张照片，文件名类似 IMG_4521.jpg。重命名这些文件，在文件名中加入日期，并按月份将它们分类到不同文件夹。

AI 会读取文件日期、重命名所有文件，并创建按月份划分的文件夹：

![AI 创建文件并以日期前缀重命名文件](/images/open-terminal-ai-file-rename.png)

---

## “查找并删除重复文件” {#find-and-remove-duplicates}

> **你：** 我的文档文件夹中有重复文件吗？

AI 会检查文件大小和内容以找出完全相同的重复文件，然后询问你要如何处理：

![AI 分析文件并显示磁盘使用详情](/images/open-terminal-ai-disk-usage.png)

---

## “备份这个文件夹” {#back-up-this-folder}

> **你：** 创建 /projects 文件夹的 zip 备份，并在文件名中包含今天的日期。

![AI 执行系统自动化命令](/images/open-terminal-ai-file-rename.png)

---

## “转换这些文件” {#convert-these-files}

> **你：** 将此文件夹中的所有 .png 截图转换为 .jpg，并将尺寸缩小一半。

AI 使用图像工具（Docker 中已预装）进行批量转换和调整大小：

![AI 根据产品照片制作缩略图拼版并内联显示](/images/open-terminal-ai-batch-convert.png)

---

## “检查系统状况” {#check-on-the-system}

> **你：** 还剩多少磁盘空间？有没有应该清理的大文件？

![AI 检查磁盘使用情况并分析存储空间](/images/open-terminal-ai-disk-usage.png)

---

## “对文件夹中的每个文件执行此操作” {#do-this-to-every-file-in-the-folder}

> **你：** 对于 /data 中的每个 CSV 文件，添加一行“Name, Date, Amount”作为表头并保存。

AI 会编写脚本、处理每个文件并报告结果：

![AI 读取并分析 CSV 数据](/images/open-terminal-ai-csv-analysis.png)

---

## 预装工具 {#pre-installed-tools}

Docker 镜像随附常用工具，可直接使用：

| 你要执行的操作 | 可用工具 |
| :--- | :--- |
| 从互联网下载文件 | curl、wget |
| 处理 JSON 数据 | jq |
| 压缩/解压缩文件 | zip、tar、gzip、7z |
| 处理图像 | ffmpeg、ImageMagick（如果已安装） |
| 操作数据库 | sqlite3 |
| 在服务器之间传输文件 | rsync、scp |

如果某个工具未安装，AI 可以即时安装（`sudo apt install ...`）。

## 更多可尝试的操作 {#more-things-to-try}

- **[从聊天运行代码 →](./code-execution.md)**：AI 编写、运行和调试代码
- **[分析文档和数据 →](./file-analysis.md)**：电子表格、PDF、Word 文档、电子邮件
- **[构建并预览网站 →](./web-development.md)**：创建网页并反复改进
