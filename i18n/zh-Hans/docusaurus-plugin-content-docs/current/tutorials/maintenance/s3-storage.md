---
sidebar_position: 40
title: "S3 存储"
---

# 切换到 S3 存储

:::warning

本教程为社区贡献，不受 Open WebUI 团队支持。它仅用于演示如何针对你的特定用例自定义 Open WebUI。想要贡献内容？请查看贡献教程。

:::

本指南介绍如何将 Open WebUI 配置中默认的 `local` 存储切换为 Amazon S3。

## 前提条件 {#prerequisites}

要学习本教程，你必须具备以下条件：

- 一个有效的 AWS 账户
- AWS 访问密钥和秘密密钥，或默认 AWS 凭证链能够找到的其他凭证（例如 IAM 角色）
- 在 AWS 中创建 S3 存储桶并上传对象所需的 IAM 权限
- 系统上已安装 Docker

## Amazon S3 是什么 {#what-is-amazon-s3}

以下文字直接引自 AWS 官网：

“Amazon S3 是一种对象存储服务，可提供行业领先的可扩展性、数据可用性、安全性和性能。你可以为各种用例存储和保护任意数量的数据，例如数据湖、网站、云原生应用程序、备份、归档、机器学习和分析。Amazon S3 的设计持久性为 99.999999999%（11 个 9），为全球数百万客户存储数据。”

要了解有关 S3 的更多信息，请访问：[Amazon S3 官方页面](https://aws.amazon.com/s3/)

# 设置方法

## 1. S3 环境变量 {#1-s3-environment-variables}

要配置此选项，请收集以下环境变量（只有 `S3_BUCKET_NAME` 是严格必需的；请参阅第 2 步）：

| **Open-WebUI 环境变量** | **示例值** |
|-------------------------------------|---------------------------------------------|
| `S3_ACCESS_KEY_ID` | ABC123 |
| `S3_SECRET_ACCESS_KEY` | SuperSecret |
| `S3_ENDPOINT_URL` | https://s3.us-east-1.amazonaws.com |
| `S3_REGION_NAME` | us-east-1 |
| `S3_BUCKET_NAME` | my-awesome-bucket-name |

- S3_ACCESS_KEY_ID：这是 AWS 账户访问密钥的标识符。创建访问密钥时，你可以从 AWS 管理控制台或 AWS CLI 获取它。
- S3_SECRET_ACCESS_KEY：这是 AWS 访问密钥对中的秘密部分。在 AWS 中创建访问密钥时会提供此值，应妥善安全地存储。
- S3_ENDPOINT_URL：此 URL 指向你的 S3 服务端点，通常可以在 AWS 服务文档或账户设置中找到。
- S3_REGION_NAME：这是 S3 存储桶所在的 AWS 区域，例如 "us-east-1"。你可以在 AWS 管理控制台的 S3 存储桶详细信息中找到它。
- S3_BUCKET_NAME：这是 S3 存储桶的唯一名称，即你在 AWS 中创建存储桶时指定的名称。

有关可用 S3 端点 URL 的完整列表，请参阅：[Amazon S3 常规端点](https://docs.aws.amazon.com/general/latest/gr/s3.html)

在 [Open-WebUI 云存储配置](/reference/env-configuration#cloud-storage)文档中查看所有 `Cloud Storage` 配置选项。

## 2. 运行 Open-WebUI {#2-run-open-webui}

在启动 Open-WebUI 实例之前，还需要设置最后一个名为 `STORAGE_PROVIDER` 的环境变量。此变量告诉 Open-WebUI 你要使用哪个提供方。默认情况下，`STORAGE_PROVIDER` 为 `local`；空值或未知值会阻止启动，并报告“Unsupported storage provider”（不支持的存储提供方）。使用 `s3` 时，每次上传都会先写入 `/app/backend/data/uploads`，然后复制到存储桶；每次读取都会将对象下载回该目录，因此仍需要本地数据卷。

| **存储提供方** | **类型** | **描述** | **默认值** |
|----------------------|----------|-------------------------------------------------------------------------------------------------|-------------|
| `local` | str | 文件保留在 `/app/backend/data/uploads` 下 | 是 |
| `s3` | str | 使用 S3 客户端库以及 Amazon S3 存储部分提到的相关环境变量 | 否 |
| `gcs` | str | 使用 GCS 客户端库以及 Google Cloud Storage 部分提到的相关环境变量 | 否 |
| `azure` | str | 使用 Azure Blob Storage 客户端以及 `AZURE_STORAGE_ENDPOINT` 和 `AZURE_STORAGE_CONTAINER_NAME`，另外还需要 `AZURE_STORAGE_KEY`；如果未提供该密钥，则使用默认 Azure 凭证 | 否 |

要使用 Amazon S3，需要将 `STORAGE_PROVIDER` 设置为 `s3`（小写；该值必须完全匹配），并设置第 1 步中收集的环境变量。只有 `S3_BUCKET_NAME` 是严格必需的，通常还需要 `S3_REGION_NAME`：如果未设置 `S3_ACCESS_KEY_ID` 和 `S3_SECRET_ACCESS_KEY`，则使用默认 AWS 凭证链（例如 IAM 角色）；`S3_ENDPOINT_URL` 仅在使用 S3 兼容服务时需要。还可以使用 `S3_KEY_PREFIX`、`S3_ADDRESSING_STYLE`（MinIO 风格端点使用 `path`）、`S3_USE_ACCELERATE_ENDPOINT` 和 `S3_ENABLE_TAGGING`。

这里还将 `ENV` 设置为 "dev"，这样我们就可以查看 Open-WebUI Swagger 文档，进一步测试并确认 S3 存储设置是否按预期工作。

```sh
docker run -d \
  -p 3000:8080 \
  -v open-webui:/app/backend/data \
  -e STORAGE_PROVIDER="s3" \
  -e S3_ACCESS_KEY_ID="ABC123" \
  -e S3_SECRET_ACCESS_KEY="SuperSecret" \
  -e S3_ENDPOINT_URL="https://s3.us-east-1.amazonaws.com" \
  -e S3_REGION_NAME="us-east-1" \
  -e S3_BUCKET_NAME="my-awesome-bucket-name" \
  -e ENV="dev" \
  --name open-webui \
  ghcr.io/open-webui/open-webui:main
```

## 3. 测试设置 {#3-test-the-set-up}

现在 Open-WebUI 已经运行，接下来上传一个简单的 `Hello, World` 文本文件来测试设置。

![在 Open-WebUI 中上传文件](/images/tutorials/amazon-s3/amazon-s3-upload-file.png)

并确认收到所选 LLM 的响应。

![在 Open-WebUI 中获取响应](/images/tutorials/amazon-s3/amazon-s3-oui-response.png)

很好！看起来 Open-WebUI 中的一切都按预期工作。现在验证文本文件确实已上传并存储在指定的 S3 存储桶中。通过 AWS 管理控制台，可以看到 S3 存储桶中现在有一个文件。除了你上传文件的文件名（`hello.txt`）之外，还可以看到对象名称添加了唯一 ID 前缀（`<file-id>_hello.txt`；如果设置了 `S3_KEY_PREFIX`，则位于该前缀下）。Open-WebUI 就是通过这种方式跟踪所有上传的文件。

![在 Open-WebUI 中获取响应](/images/tutorials/amazon-s3/amazon-s3-object-in-bucket.png)

使用 Open-WebUI 的 Swagger 文档，可以通过 `/api/v1/files/{id}` 端点并传入唯一 ID（4405fabb-603e-4919-972b-2b39d6ad7f5b）来获取与此文件相关的所有信息。

![按 ID 检查文件](/images/tutorials/amazon-s3/amazon-s3-get-file-by-id.png)
