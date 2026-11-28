---
sidebar_position: 3
title: "部署选项"
---

# 可扩展的企业部署选项

Open WebUI 的**无状态、容器优先架构**意味着，无论将其部署为 VM 上的 Python 进程、托管服务中的容器，还是 Kubernetes 集群中的 Pod，运行的都是行为完全相同的应用。不同部署模式的区别在于如何**编排、扩缩容和运维**应用，而不在于应用本身的行为。

:::tip 模型推理独立部署
LLM 模型的服务方式与 Open WebUI 的部署方式相互独立。任何部署模式都可以使用**托管 API**（OpenAI、Anthropic、Azure OpenAI、Google Gemini）或**自托管推理**（Ollama、vLLM）。有关连接模型的详细信息，请参阅[集成](/enterprise/integration)。
:::

:::info 主权 AI 规划
对于主权 AI 部署，请先定义四个边界，再选择运行时模式：部署边界、模型边界、身份边界和数据边界。[主权 AI 平台](/enterprise/sovereign-ai)指南将这些决策与相应的 Open WebUI 控制项对应起来。
:::

---

## 共享基础设施要求 {#shared-infrastructure-requirements}

无论选择哪种部署模式，每个扩展后的 Open WebUI 部署都需要同一组后端服务。在扩展到单个实例以上**之前**，请完成这些配置。

| 组件 | 必需原因 | 选项 |
| :--- | :--- | :--- |
| **PostgreSQL** | 多实例部署需要正式的数据库。SQLite 不支持多个进程并发写入。 | 自管理、Amazon RDS、Azure Database for PostgreSQL、Google Cloud SQL |
| **Redis** | 跨实例的 WebSocket 协调、令牌撤销和共享缓存（配置通过 PostgreSQL 共享）。 | 自管理、Amazon ElastiCache、Azure Cache for Redis、Google Memorystore |
| **向量数据库** | 默认的 ChromaDB 使用本地 SQLite 后端，无法安全地进行多进程访问。 | PGVector（与 PostgreSQL 共用）、Milvus、Qdrant，或 HTTP 服务器模式的 ChromaDB |
| **共享存储** | 上传的文件必须能从每个实例访问。 | 共享文件系统（NFS、EFS、CephFS）或对象存储（`S3`、`GCS`、`Azure Blob`） |
| **内容提取** | 默认提取器在 Open WebUI 进程内解析文档，占用该进程的 CPU 和内存。 | 将 Apache Tika 或 Docling 作为独立服务运行 |
| **嵌入引擎** | 默认的 SentenceTransformers 模型在启动时加载到每个工作进程中，并在其 CPU 上运行。 | OpenAI Embeddings API，或运行嵌入模型的 Ollama |

### 关键配置 {#critical-configuration}

以下环境变量**必须**在每个实例上保持一致：

```bash
# 共享机密：在所有实例上必须完全相同
WEBUI_SECRET_KEY=your-secret-key-here

# 数据库
DATABASE_URL=postgresql://user:password@db-host:5432/openwebui

# 向量数据库（除非设置了 PGVECTOR_DB_URL，否则 PGVector 使用 DATABASE_URL）
VECTOR_DB=pgvector

# Redis
REDIS_URL=redis://redis-host:6379/0
WEBSOCKET_MANAGER=redis

# 内容提取
CONTENT_EXTRACTION_ENGINE=tika
TIKA_SERVER_URL=http://tika:9998

# 嵌入
RAG_EMBEDDING_ENGINE=openai

# 存储：选择一种
# 选项 A：共享文件系统（将同一个卷挂载到所有实例，无需环境变量）
# 选项 B：对象存储（所有必需变量请参阅 /reference/env-configuration#cloud-storage）
# STORAGE_PROVIDER=s3

# 工作进程：由编排器负责扩缩容
UVICORN_WORKERS=1

# 迁移：只应有一个实例运行迁移
ENABLE_DB_MIGRATIONS=false
```

:::warning 数据库迁移
在**除一个实例外的所有实例**上设置 `ENABLE_DB_MIGRATIONS=false`。更新期间，先缩减到单个实例，等待迁移完成，然后再恢复扩缩容。并发迁移可能损坏数据库。

无论平台提供何种滚动部署机制，对于会更改数据库架构的版本，均不支持跨版本滚动更新：每个实例都必须同时切换到新版本，并且绝不能让新旧实例同时使用同一数据库处理流量。开始之前请备份数据库。请参阅[更新与迁移](/troubleshooting/multi-replica#updates-and-migrations)。
:::

有关完整的分步扩缩容操作演示，请参阅[扩展 Open WebUI](/getting-started/advanced-topics/scaling)。有关完整的环境变量参考，请参阅[环境变量配置](/reference/env-configuration)。

---

## 选择部署模式 {#choose-your-deployment-pattern}

Open WebUI 支持三种生产部署模式。每份指南都涵盖相应模式的架构、扩缩容策略和关键注意事项。

### [自动扩缩容 VM 上的 Python / Pip](/enterprise/deployment/python-pip) {#python--pip-on-auto-scaling-vms}

在云自动扩缩组（AWS ASG、Azure VMSS、GCP MIG）中的虚拟机上，将 `open-webui serve` 部署为由 systemd 管理的进程。最适合已经建立基于 VM 的基础设施并具备扎实 Linux 管理能力的团队，或法规要求直接进行操作系统级控制的场景。

### [容器服务](/enterprise/deployment/container-service) {#container-service}

在 AWS ECS/Fargate、Azure Container Apps 或 Google Cloud Run 等托管平台上运行官方 Open WebUI 容器镜像。最适合希望获得容器优势（不可变镜像、版本化部署、无需管理操作系统），又不想面对 Kubernetes 复杂性的团队。

### [使用 Helm 的 Kubernetes](/enterprise/deployment/kubernetes-helm) {#kubernetes-with-helm}

使用官方 Open WebUI Helm Chart 在任何 Kubernetes 发行版（EKS、AKS、GKE、OpenShift、Rancher、自管理）上部署。最适合需要声明式基础设施即代码、高级自动扩缩容和 GitOps 工作流程的大规模关键任务部署。

---

## 部署方式对比 {#deployment-comparison}

| | **Python / Pip（VM）** | **容器服务** | **Kubernetes（Helm）** |
| :--- | :--- | :--- | :--- |
| **运维复杂度** | 中等（操作系统补丁、Python 管理） | 低（平台管理容器） | 较高（需要 K8s 专业知识） |
| **自动扩缩容** | 带健康检查的云 ASG/VMSS | 平台原生，配置极少 | HPA，支持精细控制 |
| **容器隔离** | 无（进程直接在操作系统上运行） | 完整的容器隔离 | 完整的容器 + 命名空间隔离 |
| **更新** | 手动（缩容、更新、扩容） | 停止所有任务，运行一个迁移任务，然后重启 | 使用 Helm 编写脚本；回滚不会撤销迁移 |
| **基础设施即代码** | 用于 VM 的 Terraform/Pulumi + 配置管理 | 任务/服务定义（CloudFormation、Bicep、Terraform） | Helm Chart + GitOps（Argo CD、Flux） |
| **最适用场景** | 以 VM 为中心运维的团队、受监管约束的场景 | 希望获得容器优势但不想面对 K8s 复杂性的团队 | 大规模关键任务部署 |
| **团队最低技能要求** | Linux 管理、Python | 容器基础、云平台 | Kubernetes、Helm、云原生模式 |

---

## 可观测性 {#observability}

无论采用哪种部署模式，生产部署都应包含监控和可观测性。

### 健康检查 {#health-checks}

- **`/health`**：存活检查。进程运行期间返回 HTTP 200。
- **`/ready`**：就绪检查。在启动完成且数据库和 Redis（如已配置）响应 ping 之前返回 503。用于就绪探针和负载均衡器健康检查。
- **`/api/models`**：列出调用方可用的模型。即使某个模型后端无法访问，它仍会返回 200，因此不能证明后端健康。需要经过身份验证的用户令牌；只有管理员启用 API 密钥后，API 密钥才可用（`ENABLE_API_KEYS`，默认关闭）。

### OpenTelemetry {#opentelemetry}

Open WebUI 支持使用 **OpenTelemetry** 进行分布式跟踪和收集 HTTP 指标。通过以下配置启用：

```bash
ENABLE_OTEL=true
ENABLE_OTEL_TRACES=true
ENABLE_OTEL_METRICS=true
OTEL_EXPORTER_OTLP_ENDPOINT=http://your-collector:4317
OTEL_EXPORTER_OTLP_INSECURE=true
OTEL_SERVICE_NAME=open-webui
```

这会为 FastAPI、SQLAlchemy、Redis 和 HTTP 客户端自动添加检测，让你能够查看请求延迟、数据库查询性能和跨服务跟踪。仅设置 `ENABLE_OTEL` 不会导出任何内容；每种信号都有独立开关（日志使用 `ENABLE_OTEL_LOGS`）。导出器默认使用基于 gRPC 的 OTLP，因此端点使用 4317 端口。当收集器的 gRPC 端口未启用 TLS 时，请设置 `OTEL_EXPORTER_OTLP_INSECURE=true`；Open WebUI 会显式传递此标志，仅使用 `http://` 端点并不会禁用 TLS。如需改用 HTTP 收集器，请设置 `OTEL_OTLP_SPAN_EXPORTER=http` 并提供完整的信号 URL，例如 `http://your-collector:4318/v1/traces`（同时将 `OTEL_METRICS_EXPORTER_OTLP_ENDPOINT` 和 `OTEL_LOGS_EXPORTER_OTLP_ENDPOINT` 分别设置为以 `/v1/metrics` 和 `/v1/logs` 结尾），因为 Open WebUI 会原样将端点传递给导出器。

### 结构化日志 {#structured-logging}

启用 JSON 格式日志，以便与日志聚合平台（Datadog、Loki、CloudWatch、Splunk）集成：

```bash
LOG_FORMAT=json
GLOBAL_LOG_LEVEL=INFO
```

有关完整的监控设置详情，请参阅[监控](/reference/monitoring)和 [OpenTelemetry](/reference/monitoring/otel)。

---

## 后续步骤 {#next-steps}

- **[架构与高可用性](/enterprise/architecture)**：深入了解 Open WebUI 的无状态设计和高可用能力。
- **[安全](/enterprise/security)**：合规框架、SSO/LDAP 集成、RBAC 和审计日志。
- **[集成](/enterprise/integration)**：连接 AI 模型、管道以及扩展功能。
- **[扩展 Open WebUI](/getting-started/advanced-topics/scaling)**：完整的分步技术扩缩容指南。
- **[多副本故障排除](/troubleshooting/multi-replica)**：扩展部署中常见问题的解决方法。

---

**需要协助规划企业部署？** 我们的团队与全球各地的组织合作，设计并实施生产级 Open WebUI 环境。

[**联系企业销售团队 →**](https://openwebui.com/contact/sales)
