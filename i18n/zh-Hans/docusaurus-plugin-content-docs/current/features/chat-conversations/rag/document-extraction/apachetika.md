---
sidebar_position: 2
title: "Apache Tika 提取"
---

:::warning

本教程由社区贡献，不受 Open WebUI 团队支持。它仅用于演示如何针对你的具体用例自定义 Open WebUI。想要贡献内容？请查看贡献教程。

:::

## Apache Tika 提取 {#apache-tika-extraction}

本文档提供将 Apache Tika 与 Open WebUI 集成的分步指南。Apache Tika 是一个内容分析工具包，可用于检测一千多种不同的文件类型，并从中提取元数据和文本内容。所有这些文件类型都能通过同一个接口解析，因此 Tika 适用于搜索引擎索引、内容分析、翻译等多种用途。

## 前提条件 {#prerequisites}

- Open WebUI 实例
- 系统已安装 Docker
- 已为 Open WebUI 设置 Docker 网络

# 集成步骤

### 第 1 步：为 Apache Tika 创建 Docker Compose 文件或运行 Docker 命令 {#step-1-create-a-docker-compose-file-or-run-the-docker-command-for-apache-tika}

运行 Apache Tika 有两种方式：

**方式 1：使用 Docker Compose**

在 Open WebUI 实例所在目录中创建一个名为 `docker-compose.yml` 的新文件。将以下配置添加到该文件：

```yml
services:
  tika:
    image: apache/tika:latest-full
    container_name: tika
    ports:
      - "9998:9998"
    restart: unless-stopped
```

使用以下命令运行 Docker Compose 文件：

```bash
docker compose up -d
```

**方式 2：使用 Docker Run 命令**

或者，可以使用以下 Docker 命令运行 Apache Tika：

```bash
docker run -d --name tika \
  -p 9998:9998 \
  --restart unless-stopped \
  apache/tika:latest-full
```

请注意，如果选择使用 Docker run 命令，并且希望容器与 Open WebUI 实例在同一网络中运行，则需要指定 `--network` 标志。

### 第 2 步：配置 Open WebUI 使用 Apache Tika {#step-2-configure-open-webui-to-use-apache-tika}

要在 Open WebUI 中使用 Apache Tika 作为上下文提取引擎，请按照以下步骤操作：

- 登录你的 Open WebUI 实例。
- 进入管理员面板（`Admin Panel`）设置菜单。
- 点击设置（`Settings`）。
- 点击文档（`Documents`）标签页。
- 将**内容提取引擎（Content Extraction Engine）**设为 **Tika**。
- 将 **Tika 服务器 URL（Tika Server URL）**设为 `http://tika:9998`。
- 将 **Tika 服务器版本（Tika Server Version）**设为与你运行的服务器匹配，即 **Tika 3.x** 或 **Tika 4.x**。两个主要版本提供不同的终结点，因此即使服务器本身运行正常，版本不匹配也会导致提取失败。默认值为 **Tika 3.x**，也可以通过 [`TIKA_SERVER_VERSION`](/reference/env-configuration#tika_server_version) 进行相同设置。**Tika 4.x**还会提取为 Markdown 而非纯文本，因此标题、列表和表格能以完整结构传递给模型。
- 保存更改。

## 在 Docker 中验证 Apache Tika {#verifying-apache-tika-in-docker}

要验证 Apache Tika 在 Docker 环境中是否正常工作，可以按照以下步骤操作：

### 1. 启动 Apache Tika Docker 容器 {#1-start-the-apache-tika-docker-container}

首先，确保 Apache Tika Docker 容器正在运行。可以使用以下命令启动它：

```bash
docker run -p 9998:9998 apache/tika
```

此命令会启动 Apache Tika 容器，并将容器的 9998 端口映射到本地计算机的 9998 端口。

### 2. 验证服务器正在运行 {#2-verify-the-server-is-running}

可以发送 GET 请求来验证 Apache Tika 服务器是否正在运行：

```bash
curl -X GET http://localhost:9998/tika
```

此命令应返回以下响应：

```txt
This is Tika Server. Please PUT
```

### 3. 验证集成 {#3-verify-the-integration}

将一份包含可选中文本的小型 PDF 上传到知识库。打开文件的**已索引文本（Indexed text）**标签页，查找你能从 PDF 中认出的句子。即使选择了 Tika，Open WebUI 仍会在本地读取纯文本文件，因此请使用 PDF 来实际检验 Tika 提取路径。

如果可选中文本能够提取出来，但扫描 PDF 缺少文本，请检查 Tika 服务器日志及其 OCR 设置。PDF 预览显示原始文件。使用**已索引文本（Indexed text）**可查看提取返回的内容。

## 故障排除 {#troubleshooting}

- 确保 Apache Tika 服务正在运行，并且 Open WebUI 实例可以访问该服务。
- 检查 Docker 日志中是否有与 Apache Tika 服务相关的错误或问题。
- 验证 Open WebUI 中的 **Tika 服务器 URL（Tika Server URL）**是否配置正确。

### 上传期间连接被拒绝 {#connection-refused-during-upload}

Open WebUI 从后端将文档发送到 Tika。如果从 Docker 主机执行的测试成功，但上传失败并显示 `Connection refused`，请从 Open WebUI 容器内检查该 URL。

- 在共享 Compose 网络中，使用 Tika 服务名称和容器端口，例如 `http://tika:9998`。
- 在 Docker Desktop 上，如果 Tika 端口已发布到主机，请使用 `http://host.docker.internal:9998`，并将 `9998` 替换为已发布的主机端口。请参阅 [Docker Desktop 网络](https://docs.docker.com/desktop/features/networking/#i-want-to-connect-from-a-container-to-a-service-on-the-host)。

将 **Tika 服务器 URL（Tika Server URL）**设为容器能够访问的地址，然后向知识库上传一份 PDF 以验证提取。

## 集成优势 {#benefits-of-integration}

将 Apache Tika 与 Open WebUI 集成可带来多项优势，包括：

- **改进元数据提取**：Apache Tika 的高级元数据提取能力可以帮助你从文件中提取准确且相关的数据。
- **支持多种文件格式**：Apache Tika 支持多种文件格式，是需要处理不同类型文件的组织的理想选择。
- **增强内容分析**：Apache Tika 的高级内容分析能力可以帮助你从文件中提取有价值的见解。

## 总结 {#conclusion}

将 Apache Tika 与 Open WebUI 集成的过程简单直接，可以提升 Open WebUI 实例的元数据提取能力。按照本文档中的步骤，即可轻松将 Apache Tika 设置为 Open WebUI 的上下文提取引擎。
