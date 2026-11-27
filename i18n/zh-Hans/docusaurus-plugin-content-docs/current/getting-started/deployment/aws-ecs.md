---
slug: /deployment/aws-ecs
sidebar_position: 2
title: "AWS ECS / Fargate"
description: "在 AWS ECS 上使用 Fargate、共享数据服务、Secrets Manager 和 Application Load Balancer 部署 Open WebUI。"
---

# 在 AWS ECS / Fargate 上运行 Open WebUI

将 Open WebUI 作为 Fargate 上的 ECS 服务运行。本文假设你已管理一个 AWS 账户和 VPC；文中介绍如何使用 ECS 控制台完成应用程序设置和部署流程，并提供用于验证的 CLI 命令。

有关架构概述，请参阅现有的[容器服务指南](/enterprise/deployment/container-service)。对于 EKS 或其他 Kubernetes 集群，请使用 [Kubernetes 部署](./kubernetes)。

## 1. 准备 AWS 服务 {#1-prepare-the-aws-services}

| 组件 | 创建服务前的准备工作 |
| :--- | :--- |
| 容器镜像 | 将 `ghcr.io/open-webui/open-webui:v0.13.0-slim` 镜像复制到 ECR，并使用其不可变摘要。Slim 支持本文涉及的所有服务，且不包含本地机器学习技术栈；请参阅 [slim](/getting-started/quick-start#what-slim-leaves-out)。使镜像架构与 Fargate 任务匹配。 |
| ECS 和网络 | 一个 ECS 集群、私有子网和安全组。允许拉取镜像、检索密钥、发送日志，以及连接模型 API 和后端服务。为这些路径使用 NAT 或适当的 VPC 端点。 |
| 数据库 | RDS PostgreSQL 或 Aurora PostgreSQL、一个应用程序数据库和角色，以及由数据库管理员启用的 `vector` 扩展。 |
| Redis | 一个 ElastiCache Redis 兼容端点或其他 Redis 服务。使 Open WebUI 的 Redis 模式和 TLS 设置与实际服务匹配。 |
| 文件 | 一个用于应用程序上传内容的 S3 存储桶。 |
| 模型和内容提取 | 可访问的聊天与嵌入 API，以及一个私有 Tika 服务。模型推理独立于 ECS 应用程序任务。 |
| HTTPS | 一个 Application Load Balancer、HTTPS 侦听器和证书、DNS 主机名，以及一个将流量转发到端口 `8080` 的 **IP 类型**目标组。 |

使用任务安全组，仅允许来自负载均衡器的 `8080` 入站流量。根据组织的访问要求选择内部或面向互联网的负载均衡。Fargate 的 `awsvpc` 网络要求使用 IP 目标；请参阅[将 ECS 与 Application Load Balancer 结合使用](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/alb.html)。

为任务的应用程序访问和 ECS 执行分别创建 IAM 角色。**执行角色**需要拉取镜像、写入 CloudWatch Logs 和检索密钥的权限，包括在需要时进行 KMS 解密的权限。**任务角色**需要所需的 S3 存储桶/对象权限。S3 访问使用任务角色凭据，不要在任务定义中嵌入 AWS 访问密钥。有关执行端权限，请参阅 [ECS 任务执行角色](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html)。

## 2. 创建应用程序任务定义 {#2-create-the-application-task-definition}

在 ECS 控制台中，创建名为 `openwebui` 的 Linux Fargate 任务定义：

| 设置 | 初始值 |
| :--- | :--- |
| 网络模式 | `awsvpc` |
| 任务资源 | 1 vCPU 和 4 GiB 内存；测量工作负载后再调整。 |
| 容器名称 | `openwebui` |
| 镜像 | 你固定使用的 ECR 镜像摘要。 |
| 容器端口 | `8080/TCP` |
| 持久文件系统 | 无；使用外部数据库和 S3。 |
| 日志 | `awslogs`，使用现有的 CloudWatch 日志组和流前缀。 |
| 应用程序命令 | 保留镜像的正常入口点和命令。 |

设置以下非机密环境值，并替换示例端点和存储桶：

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
STORAGE_PROVIDER=s3
S3_BUCKET_NAME=REPLACE_WITH_BUCKET
S3_REGION_NAME=REPLACE_WITH_AWS_REGION
```

在 Secrets Manager 中创建凭据，并将它们映射到容器的**密钥（Secrets）**设置：

| 环境变量 | 密钥值 |
| :--- | :--- |
| `WEBUI_SECRET_KEY` | 稳定的随机签名密钥，在每个实例上保持一致。使用 `openssl rand -hex 32` 生成一次。 |
| `DATABASE_URL` | PostgreSQL 连接 URL，包含服务提供方要求的 TLS 参数。除非设置 `PGVECTOR_DB_URL`，否则 PGVector 也使用该 URL。 |
| `REDIS_URL` | Redis 连接 URL，包含已配置的身份验证和 TLS 信息。除非设置 `WEBSOCKET_REDIS_URL`，否则 WebSocket 也使用该 URL。 |
| `OPENAI_API_KEY` | 聊天服务提供方的 API 密钥。 |
| `RAG_OPENAI_API_KEY` | 嵌入服务提供方的 API 密钥。未设置时默认为 `OPENAI_API_KEY`。 |
| `WEBUI_ADMIN_EMAIL` 和 `WEBUI_ADMIN_PASSWORD` | 空数据库的初始管理员凭据。将密码保存在密钥存储中。 |
| `LICENSE_KEY` | 可选的已签发 Enterprise 许可证密钥。 |

环境变量名称和密钥 ARN 是两个独立字段。例如，以下是任务定义中容器配置的一个片段：

```json
{
  "secrets": [
    {
      "name": "DATABASE_URL",
      "valueFrom": "arn:aws:secretsmanager:REGION:ACCOUNT_ID:secret:openwebui-database-SUFFIX"
    }
  ]
}
```

对每个机密变量重复此操作；两个变量可以引用同一个密钥。通过环境变量注入的密钥会在任务启动时读取，因此轮换密钥需要替换任务。请参阅 [ECS 密钥注入](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data-tutorial.html)。

不要将 SQLite 或本地向量数据存储在任务的临时磁盘上。将已有数据的安装切换到 PostgreSQL 或 S3 不会迁移其现有数据。

## 3. 使用单个独立任务初始化数据库 {#3-initialize-the-database-with-one-standalone-task}

从应用程序定义复制并创建第二个任务定义系列 `openwebui-migrate`。如果配置了 HTTP 健康检查，请将其移除，因为此任务会退出，而不会提供 HTTP 服务。

使用与服务相同的固定应用程序镜像。设置 `ENABLE_DB_MIGRATIONS=true`，并按如下方式覆盖容器命令：

| 字段 | 值 |
| :--- | :--- |
| 可执行文件 / 入口点 | `python` |
| 参数（两个独立值） | `-c` 和 `import open_webui.config` |

当该标志为 true 时，导入此模块会运行架构迁移，并在迁移失败时以错误状态退出。它是内部入口点，不是稳定的迁移 CLI，因此更改版本时应对照[迁移代码](https://github.com/open-webui/open-webui/blob/v0.13.0/backend/open_webui/config.py)重新检查。它会初始化架构；随后正常的应用程序启动会初始化运行时设置和管理员账户。

迁移容器需要相同的数据库连接、签名密钥、网络访问和镜像拉取权限。使用此数据库的所有应用程序实例均已停止时，一次只运行一个任务，并禁用自动重试。仅在任务成功退出且日志中没有迁移错误时才继续。

使用**运行新任务（Run new task）**，选择 Fargate，将任务计数设置为 `1`，使用应用程序的子网和安全组，但不使用负载均衡器。独立任务不由 ECS 服务维护；请参阅[独立任务](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/standalone-tasks.html)。

**预期结果：**任务进入 `STOPPED` 状态，`openwebui` 容器的退出代码为 `0`，且日志显示迁移成功。仅出现 `STOPPED` 并不表示成功。

## 4. 创建 ECS 服务 {#4-create-the-ecs-service}

使用**应用程序**任务定义创建 ECS 服务，保持 `ENABLE_DB_MIGRATIONS=false` 和正常命令。初始预期任务计数设为 `1`，并将 ALB 目标组连接到 `openwebui` 容器的 `8080` 端口。

将目标组的健康检查路径设置为 `/ready`，它会在启动完成且数据库和 Redis 均有响应后作出应答。服务健康检查宽限期可先设为 300 秒，再根据测得的启动时间进行调整。`/health` 用作独立的进程存活检查。模型 API 和 S3 权限需要按照[添加用户前验证](#verify-before-adding-users)中的检查进行验证。

根据流式工作负载设置 ALB 空闲超时。目标组粘性是可选的；仅在 `ENABLE_WEBSOCKET_SUPPORT=false` 时才需要。请参阅[会话亲和性](/troubleshooting/multi-replica#session-affinity-sticky-sessions)。通过 ALB 验证 WebSocket 和流式响应。Socket.IO 服务位于 `/ws/socket.io/` 下。

使用 AWS CLI 等待并检查服务事件，同时替换相应标识符：

```bash
aws ecs wait services-stable --cluster CLUSTER --services openwebui
aws ecs describe-services --cluster CLUSTER --services openwebui \
  --query 'services[0].{running:runningCount,desired:desiredCount,events:events[0:5]}'
```

打开 `WEBUI_URL` 中配置的 HTTPS 主机名。初始管理员凭据会在启动期间创建第一个账户。验证通过后，增加预期任务计数，并可选择配置 Service Auto Scaling。按最大任务计数规划 PostgreSQL 和 Redis 连接数。每个工作进程都有一个同步数据库引擎和一个异步数据库引擎，每个引擎都可打开 `DATABASE_POOL_SIZE` + `DATABASE_POOL_MAX_OVERFLOW` 个连接（未设置 `DATABASE_POOL_SIZE` 时使用 SQLAlchemy 的 5 + 10）。使用 `VECTOR_DB=pgvector` 时，PGVector 会打开自己的连接池，大小为 `PGVECTOR_POOL_SIZE` + `PGVECTOR_POOL_MAX_OVERFLOW`（未设置时同样为 5 + 10），即使它使用 `DATABASE_URL` 也是如此。

## 添加用户前验证 {#verify-before-adding-users}

- 使用初始管理员账户登录，并验证开放注册已禁用（通过 `WEBUI_ADMIN_EMAIL` 和 `WEBUI_ADMIN_PASSWORD` 创建管理员会将其关闭）。在开放更广泛的访问前，配置你的[身份提供方](/features/authentication-access/auth/sso)。
- 选择一个模型并流式生成响应。重新打开已保存的会话。
- 上传一个包含独特事实的小文档。确认索引完成，并且有关该事实的问题能检索到来源。
- 替换一个应用程序实例，确认同一账户、会话和上传的文件仍可使用。
- 使用多个实例时，通过实际入口测试重复请求和 WebSocket 重新连接，检查是否出现登录循环和状态不一致。

初始管理员环境变量仅在数据库没有用户时创建账户；之后更改这些变量不会重置其密码。完成设置后，在应用程序中轮换初始密码。许多应用程序设置会在首次启动后持久保存；在预期环境变量更改会替换已保存的设置之前，请查看[配置持久性](/reference/env-configuration#important-note-on-configvar-environment-variables)。

对于企业部署，请独立于服务健康状态验证许可证状态。有关应用程序设置和许可证网络要求，请参阅[许可与品牌](./kubernetes#enterprise-licensing-and-branding)；通过此平台的密钥机制注入密钥，而不是使用 Kubernetes Secrets。

## 更新与恢复 {#updates-and-recovery}

对于会更改架构的更新，请使用维护时段：

1. 保存已部署的任务定义和服务配置。阻止新流量，暂停服务自动扩缩容和部署自动化，将预期计数设置为零，并验证所有旧应用程序任务均已停止。同时停止共享该数据库的所有独立任务。
2. 对数据库和 S3 进行协调一致的备份，并保留签名密钥。
3. 使用新镜像注册新的迁移任务修订版。运行一个独立迁移任务，要求退出代码为 `0` 后才能继续。
4. 使用同一镜像注册禁用迁移的应用程序任务修订版。在预期计数保持为零时更新服务，然后恢复预期计数并验证服务，再恢复流量和自动扩缩容。

ECS 回滚会改变镜像，但不会改变数据库架构。不要在架构变更后自动回滚到不兼容的旧应用程序；如有需要，请恢复兼容的数据库/存储备份。请参阅[备份与恢复](/getting-started/updating#backup--restore)。

## 故障排除与移除 {#troubleshooting-and-removal}

| 症状 | 检查项 |
| :--- | :--- |
| 任务无法启动或拉取镜像 | 执行角色、ECR 权限、子网出口/VPC 端点、架构和 Secrets Manager 访问权限。 |
| ALB 报告目标不健康 | IP 目标类型、容器端口、任务安全组、`/ready`、启动日志，以及数据库和 Redis 连接。 |
| 聊天正常但上传失败 | 任务角色的 S3 权限、存储桶名称/区域，以及内容提取/嵌入端点。 |
| 跨任务出现登录循环 | 共享签名密钥、共用数据库和 Redis URL。 |
| 流式连接断开 | ALB 空闲超时、客户端重新连接和 Redis 模式。 |

删除 ECS 服务不会删除单独预置的 RDS、S3 或 Secrets Manager 资源。请根据保留策略有目的地移除资源；在移除持久服务之前，保留可恢复的备份。
