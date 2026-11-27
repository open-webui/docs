---
slug: /deployment/google-cloud-run
sidebar_position: 4
title: "Google Cloud Run"
description: "在 Google Cloud Run 上部署 Open WebUI，并使用 Cloud SQL、Redis、Cloud Storage 和独立的迁移任务。"
---

# 在 Google Cloud Run 上部署 Open WebUI

Cloud Run 是本指南采用的 Google Cloud 托管容器方案。请使用共享外部状态和独立的迁移任务。对于 GKE，请参阅 [Kubernetes 部署](./kubernetes)；有关通用架构，请参阅现有的[容器服务指南](/enterprise/deployment/container-service)。

:::info 检查工作负载是否适合
Cloud Run 支持 WebSocket，但连接仍受其请求超时限制，最长为 60 分钟。客户端必须重新连接，并且跨实例时仍需要 Redis。采用此平台前，请测试长对话和后台工作。请参阅 [Cloud Run WebSocket](https://docs.cloud.google.com/run/docs/triggering/websockets)。
:::

## 1. 准备 Google Cloud 服务 {#1-prepare-the-google-cloud-services}

| 组件 | 创建服务前的准备工作 |
| :--- | :--- |
| 镜像 | 将 `ghcr.io/open-webui/open-webui:v0.13.0` 镜像到 Artifact Registry，并保留其不可变摘要。使用标准镜像：slim 镜像不包含 Cloud Storage 客户端。 |
| 数据库 | Cloud SQL for PostgreSQL、应用数据库/角色，以及由管理员启用的 `vector` 扩展。本指南使用私有 IP 数据库连接。 |
| Redis | 兼容的 Memorystore 或其他 Redis 端点。身份验证、TLS 和集群设置应与所选服务匹配。 |
| 文件 | 私有 Cloud Storage 存储桶。 |
| 身份与密钥 | 专用服务账号，以及用于存放应用凭据的 Secret Manager 密钥。 |
| VPC 访问 | 直接 VPC 出口或 Serverless VPC Access 连接器，用于访问私有数据库、Redis 和提取服务。 |
| 模型与提取 | 可访问的聊天/嵌入 API，以及应用可调用的 Tika 端点。 |
| 浏览器访问 | 已批准的 HTTPS 主机名，以及浏览器身份验证/访问路径。 |

为所有后端服务配置防火墙规则、私有 DNS 和出口。如果所有流量都通过 VPC 路由，请为模型 API 和其他外部端点提供适当的 NAT 或私有访问。迁移任务也采用相同的网络配置。请参阅[直接 VPC 出口](https://docs.cloud.google.com/run/docs/configuring/vpc-direct-vpc)。

## 2. 配置服务身份与环境 {#2-configure-the-service-identity-and-environment}

向服务账号授予访问指定 Secret Manager 密钥的权限，以及对存储桶执行所需的对象读取、写入、列出和删除操作的权限。通过 Application Default Credentials 使用关联的服务身份访问 Cloud Storage；不要将下载的服务账号密钥嵌入镜像。

创建并映射以下密钥环境变量。固定密钥版本，使部署使用已知的凭据集；向运行时身份授予访问每个所引用密钥的权限。请参阅 [Cloud Run 密钥配置](https://docs.cloud.google.com/run/docs/configuring/services/secrets)。

| 环境变量 | 密钥值 |
| :--- | :--- |
| `WEBUI_SECRET_KEY` | 稳定的随机签名密钥，在每个实例上保持一致。使用 `openssl rand -hex 32` 生成一次。 |
| `DATABASE_URL` | PostgreSQL 连接 URL，包含服务提供方要求的 TLS 参数。除非设置 `PGVECTOR_DB_URL`，否则 PGVector 也使用此变量。 |
| `REDIS_URL` | Redis 连接 URL，包含已配置的身份验证和 TLS 信息。除非设置 `WEBSOCKET_REDIS_URL`，否则 WebSocket 也使用此变量。 |
| `OPENAI_API_KEY` | 聊天服务提供方 API 密钥。 |
| `RAG_OPENAI_API_KEY` | 嵌入服务提供方 API 密钥。未设置时默认为 `OPENAI_API_KEY`。 |
| `WEBUI_ADMIN_EMAIL` 和 `WEBUI_ADMIN_PASSWORD` | 空数据库的初始管理员凭据。请将密码保存在密钥存储中。 |
| `LICENSE_KEY` | 可选的已签发 Enterprise 许可证密钥。 |

配置以下非密钥值，并替换示例端点和存储桶：

```ini
WEBUI_URL=https://ai.example.com
UVICORN_WORKERS=1
ENABLE_DB_MIGRATIONS=false
ENABLE_OLLAMA_API=false
WEBSOCKET_MANAGER=redis
VECTOR_DB=pgvector
PGVECTOR_CREATE_EXTENSION=false
OPENAI_API_BASE_URL=https://models.example.com/v1
RAG_EMBEDDING_ENGINE=openai
RAG_EMBEDDING_MODEL=REPLACE_WITH_EMBEDDING_MODEL_ID
RAG_OPENAI_API_BASE_URL=https://embeddings.example.com/v1
CONTENT_EXTRACTION_ENGINE=tika
TIKA_SERVER_URL=http://REPLACE_WITH_PRIVATE_TIKA_ENDPOINT:9998
STORAGE_PROVIDER=gcs
GCS_BUCKET_NAME=REPLACE_WITH_BUCKET
```

Cloud Run 会设置 `PORT`；请将容器端口配置为 `8080`。Open WebUI 的标准容器入口点会监听该端口和 `0.0.0.0`。

容器本地文件是临时的，并且可能占用实例内存。不要使用 SQLite、本地 ChromaDB 或 Cloud Storage FUSE 挂载来替代共享数据库/向量后端。上传文件时，请使用应用的 Cloud Storage 提供方。

## 3. 使用 Cloud Run 任务初始化数据库 {#3-initialize-the-database-with-a-cloud-run-job}

创建名为 `openwebui-migrate` 的任务，使用固定镜像、服务账号、密钥引用和 VPC 配置。将任务数设为 `1`，并行数设为 `1`，重试次数设为 `0`，并根据预期迁移时长设置合适的任务超时；可以先从 1800 秒开始。

使用与服务相同的固定应用镜像。设置 `ENABLE_DB_MIGRATIONS=true`，并按如下方式覆盖容器命令：

| 字段 | 值 |
| :--- | :--- |
| 可执行文件/入口点 | `python` |
| 参数，作为两个独立值 | `-c` 和 `import open_webui.config` |

当该标志为 true 时，导入此模块会运行架构迁移，并在迁移失败时以错误退出。这是一个内部入口点，不是稳定的迁移 CLI，因此更改版本时，请对照[迁移代码](https://github.com/open-webui/open-webui/blob/v0.13.0/backend/open_webui/config.py)重新检查。它会初始化架构；随后，正常的应用启动会初始化运行时设置和管理员账号。

迁移容器需要相同的数据库连接、签名密钥、网络访问和镜像拉取权限。使用该数据库的所有应用实例停止时，每次只运行一个任务执行，并禁用自动重试。仅在任务成功退出且日志中没有迁移错误后继续。

运行一次任务执行并等待成功。任务必须退出；不要让它一直运行镜像的常规 Web 服务器命令。请参阅[创建 Cloud Run 任务](https://docs.cloud.google.com/run/docs/create-jobs)。

```bash
gcloud run jobs execute openwebui-migrate --region REGION --wait
```

**预期结果：**一个已完成的任务，执行成功并包含迁移日志。将服务最大实例数设为一并不能替代此任务：[Cloud Run 实例限制可能会暂时被超出](https://docs.cloud.google.com/run/docs/configuring/max-instances)。

## 4. 创建 Cloud Run 服务 {#4-create-the-cloud-run-service}

在 Cloud Run 控制台中，使用相同的镜像、身份、VPC 访问和设置部署 `openwebui`。保留镜像的常规入口点和 `ENABLE_DB_MIGRATIONS=false`。

| 服务设置 | 起始值 |
| :--- | :--- |
| 容器端口 | `8080` |
| CPU/内存 | 1 vCPU/4 GiB；请测量并调优。 |
| 计费/CPU | 基于实例的计费，在请求之外也提供 CPU。 |
| 实例 | 验证通过前，最小值为 `1`，最大值为 `1`。 |
| 并发数 | 从 `20` 开始，并使用真实的聊天/摄取流量进行调优。 |
| 请求超时 | `3600` 秒；客户端仍需要重新连接。 |
| 会话亲和性 | 可选；仅在使用 `ENABLE_WEBSOCKET_SUPPORT=false` 时需要。请参阅[会话亲和性](/troubleshooting/multi-replica#session-affinity-sticky-sessions)。 |
| 启动探针 | HTTP `/ready`，端口 `8080`，周期 10 秒，超时 5 秒，失败阈值 `24`。 |
| 存活探针 | HTTP `/health`，端口 `8080`，采用合适的间隔和失败阈值。 |

让启动过程保持在 Cloud Run [支持的探针预算](https://docs.cloud.google.com/run/docs/configuring/healthchecks)内。卸载嵌入处理和使用独立迁移任务可减少启动工作。探针成功并不能验证模型服务提供方或存储桶权限。

基于实例的计费和最小实例数支持活动请求之外的工作，但实例仍可能被终止。它们不会使进程内后台任务具备持久性。请参阅 [Cloud Run 计费设置](https://docs.cloud.google.com/run/docs/configuring/billing-settings)。

明确选择浏览器访问方式。Cloud Run IAM 身份验证需要 Google 身份令牌；Open WebUI 登录无法满足这一外层要求。使用贵组织面向浏览器的身份网关，或者仅在应用身份验证和网络暴露符合策略时，有意识地配置公开调用。切勿仅为绕过 Cloud Run 访问错误而禁用 Open WebUI 身份验证。

检查服务和日志：

```bash
gcloud run services describe openwebui --region REGION \
  --format='value(status.url,status.latestReadyRevisionName)'
gcloud run services logs read openwebui --region REGION --limit=50
```

打开已批准的 HTTPS 主机名，使用初始管理员凭据登录。验证后，在为共享数据库连接做好容量预算并测试跨实例 WebSocket 重连的同时，提高最大实例数。

## 添加用户前进行验证 {#verify-before-adding-users}

- 使用初始管理员账号登录，并确认开放注册已禁用（通过 `WEBUI_ADMIN_EMAIL` 和 `WEBUI_ADMIN_PASSWORD` 创建管理员会将其关闭）。在开放更广泛的访问前，配置你的[身份提供方](/features/authentication-access/auth/sso)。
- 选择一个模型并以流式方式生成响应。重新打开已保存的对话。
- 上传一份包含独特事实的小文档。确认索引完成，并且针对该事实提问能够检索到来源。
- 替换一个应用实例，确认同一账号、对话和上传的文件仍然可用。
- 使用多个实例时，通过真实入口测试重复请求和 WebSocket 重连，检查是否出现登录循环和状态不一致。

初始管理员环境变量只会在数据库没有用户时创建账号；之后更改这些变量不会重置密码。设置完成后，在应用中轮换初始密码。许多应用设置会在首次启动后持久保存；在预期环境变量变更会替换已保存设置之前，请查阅[配置持久化](/reference/env-configuration#important-note-on-configvar-environment-variables)。

对于企业部署，请独立于服务健康状况验证许可证状态。有关应用设置和许可证网络要求，请参阅[许可与品牌定制](./kubernetes#enterprise-licensing-and-branding)；通过此平台的密钥机制注入密钥，而不是使用 Kubernetes Secrets。

## 更新与恢复 {#updates-and-recovery}

在不兼容的架构版本之间拆分流量并不安全。向某个修订版本发送零流量或将最小实例数设为零，并不能证明旧容器已停止。

对于会更改架构的版本，请使用维护窗口，并遵循以下保守流程：

1. 导出服务配置和 IAM 策略，记录域名/访问配置，并暂停部署自动化。阻止新请求并排空活动连接。
2. 删除 **Cloud Run 应用服务**，使旧修订版本无法被调用，并在迁移前确认旧应用数据库连接已排空。保留数据库、存储桶、密钥和迁移任务。为重新创建的服务保留稳定的自定义主机名。
3. 协调执行数据库/存储备份，并保留签名密钥。
4. 将迁移任务更新为新镜像，运行一次任务执行直至成功完成。
5. 使用新镜像重新创建服务，禁用迁移，并采用已保存的网络、密钥、扩缩容、IAM 和入口设置。仅在验证服务后恢复域名路由。

例如，在删除服务**之前**导出服务和 IAM 配置：

```bash
gcloud run services describe openwebui --region REGION \
  --format=export > openwebui-service.yaml
gcloud run services get-iam-policy openwebui --region REGION \
  --format=yaml > openwebui-iam.yaml
```

导出不能替代数据库备份，并且 IAM/域名设置必须单独恢复。此流程会导致停机和服务重新创建；如果这种运维模式不合适，请考虑使用 GKE，或能够明确控制应用进程停止的 VM/容器平台。

迁移后，不要路由到不兼容的旧镜像。需要时恢复兼容的数据库/存储状态；请参阅[备份与恢复](/getting-started/updating#backup--restore)。

## 故障排除与移除 {#troubleshooting-and-removal}

| 症状 | 检查项 |
| :--- | :--- |
| 服务在登录页之前返回 403 | Cloud Run IAM/入口策略和浏览器的访问路径。 |
| 启动失败 | 端口、启动预算、数据库私有 IP 路由/TLS、密钥权限和日志。 |
| Redis 无法连接 | VPC 出口、防火墙/DNS、身份验证/TLS 和 Redis 集群模式。 |
| 文件消失或上传失败 | `STORAGE_PROVIDER=gcs`、存储桶名称、服务账号权限和外部向量存储。 |
| WebSocket 在长会话后断开连接 | 请求超时和客户端重连。 |
| 后台工作暂停或消失 | CPU 分配、最小实例数和进程终止；对于必须在实例终止后继续保留的工作，使用持久的任务基础设施。 |

删除 Cloud Run 服务或任务不会删除单独预配的 Cloud SQL、Redis、Cloud Storage 或 Secret Manager 资源。仅根据备份和保留策略移除这些资源。
