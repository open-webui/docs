---
sidebar_position: 3
title: "使用 Helm 部署到 Kubernetes"
---

# 使用 Helm 部署到 Kubernetes

使用官方 Open WebUI Helm Chart 在任何 Kubernetes 发行版（EKS、AKS、GKE、OpenShift、Rancher、自管理）上部署。

:::info 前提条件
继续操作前，请确保已配置[共享基础设施要求](/enterprise/deployment#shared-infrastructure-requirements)：PostgreSQL、Redis、向量数据库、共享存储和内容提取。
:::

## 何时选择此模式 {#when-to-choose-this-pattern}

- 你的组织运行 Kubernetes，并具备平台工程专业知识
- 你需要声明式基础设施即代码和 GitOps 工作流程
- 你需要自动扩缩容（HPA）、声明式更新和 Pod 中断预算
- 你要在关键任务环境中为数百至数千名用户部署

## 架构 {#architecture}

```mermaid
flowchart LR
    subgraph K8s["Kubernetes 集群"]

        subgraph mgmt["集群管理"]
            Ingress["Ingress 控制器"]
            HPA["HPA"]
        end

        subgraph genai["GenAI 命名空间"]
            subgraph Deploy["Open WebUI Deployment"]
                P1["Pod 1"]
                P2["Pod 2"]
                P3["Pod N"]
            end
        end

        subgraph data["数据命名空间"]
            PG["PostgreSQL + PGVector"]
            Redis["Redis"]
            Storage["共享存储"]
            Tika["Tika"]
        end

    end

    Ingress --> Deploy
    HPA -.- Deploy
    Deploy --> data
```

## Helm Chart 设置 {#helm-chart-setup}

```bash
# 添加仓库
helm repo add open-webui https://open-webui.github.io/helm-charts
helm repo update

# 使用自定义值安装
helm install openwebui open-webui/open-webui -f values.yaml
```

你的 `values.yaml` 应覆盖默认值，使其指向你的共享基础设施。该 Chart 为许多常用设置提供了专用值：在可用的情况下，请使用这些值，而不是直接使用环境变量：

```yaml
# values.yaml 覆盖示例（完整架构请参阅 Chart 文档）
replicaCount: 3

# -- 数据库：使用外部 PostgreSQL 实例
databaseUrl: "postgresql://user:password@db-host:5432/openwebui"

# -- WebSocket 与 Redis：Chart 可在集群内自动部署 Redis，
#    也可通过 websocket.url 指向外部 Redis 实例
websocket:
  enabled: true
  manager: redis
  # url: "redis://my-external-redis:6379/0"  # 取消注释以使用外部 Redis
  redis:
    enabled: true  # 如果使用外部 Redis，则设置为 false

# -- Tika：Chart 可在集群内自动部署 Tika
tika:
  enabled: true

# -- 默认部署 Ollama 和 Pipelines；禁用未使用的组件
ollama:
  enabled: false
pipelines:
  enabled: false

# -- 存储：多副本部署使用对象存储，而不是本地 PVC
persistence:
  provider: s3  # 或 "gcs" / "azure"
  s3:
    bucket: "my-openwebui-bucket"
    region: "us-east-1"
    accessKeyExistingSecret: "openwebui-s3-creds"
    accessKeyExistingAccessKey: "access-key"
    secretKeyExistingSecret: "openwebui-s3-creds"
    secretKeyExistingSecretKey: "secret-key"
  # -- 或者，使用共享文件系统（RWX PVC）代替对象存储：
  # provider: local
  # accessModes:
  #   - ReadWriteMany
  # storageClass: "efs-sc"

# -- Ingress：通过 Ingress 控制器公开服务时进行配置
ingress:
  enabled: true
  class: "nginx"
  host: "ai.example.com"
  tls: true
  existingSecret: "openwebui-tls"

# -- 没有专用 Chart 值的其余设置
extraEnvVars:
  - name: WEBUI_SECRET_KEY
    valueFrom:
      secretKeyRef:
        name: openwebui-secrets
        key: secret-key
  - name: VECTOR_DB
    value: "pgvector"  # 除非设置了 PGVECTOR_DB_URL，否则使用 DATABASE_URL
  - name: UVICORN_WORKERS
    value: "1"
  - name: ENABLE_DB_MIGRATIONS
    value: "false"
  - name: RAG_EMBEDDING_ENGINE
    value: "openai"
```

## 扩缩容策略 {#scaling-strategy}

- **Horizontal Pod Autoscaler（HPA）**：根据 CPU 或内存利用率进行扩缩容。每个 Pod 保持 `UVICORN_WORKERS=1`，由 Kubernetes 管理副本数量。
- **资源请求与限制**：设置适当的 CPU 和内存请求，确保调度器正确放置 Pod，并确保 HPA 获得准确的指标。
- **Pod 中断预算**：配置 PDB，确保在主动中断（节点腾空、集群升级）期间仍有最少数量的 Pod 可用。

## 更新流程 {#update-procedure}

:::danger 关键更新流程
绝不能让多个副本同时运行迁移，也绝不能让新旧版本共同使用同一个数据库提供服务。停止所有副本，在新版本上启动一个启用了 `ENABLE_DB_MIGRATIONS=true` 的副本，等待其就绪，然后关闭迁移并恢复扩缩容。Helm 回滚不会撤销迁移。包含命令的完整流程请参阅[更新与恢复](/deployment/kubernetes#updates-and-recovery)。
:::

## 关键注意事项 {#key-considerations}

| 注意事项 | 说明 |
| :--- | :--- |
| **存储** | 上传的文件使用 **ReadWriteMany（RWX）** 共享文件系统（EFS、CephFS、NFS）或对象存储（S3、GCS、Azure Blob）。ReadWriteOnce 卷无法与多个 Pod 配合使用。 |
| **机密** | 将凭据存储在 Kubernetes Secrets 中，并通过 `secretKeyRef` 引用。与外部机密操作器（External Secrets、Sealed Secrets）集成，以支持 GitOps 工作流程。 |
| **数据库** | 生产环境使用托管 PostgreSQL 服务（RDS、Cloud SQL、Azure DB）。集群内 PostgreSQL 操作器（CloudNativePG、Zalando）也是可行方案，但会增加运维负担。 |
| **Redis** | 对于大多数部署，配置为 `timeout 1800` 和 `maxclients 10000` 的单个 Redis 实例已经足够。只有在 Redis 本身必须具备高可用性时，才需要 Redis Sentinel 或 Cluster。 |
| **网络** | 将所有服务保持在同一可用区。目标数据库延迟低于 2 毫秒。审计网络策略，确保 Pod 能够访问 PostgreSQL、Redis 和存储后端。 |

有关完整的 Helm 设置指南，请参阅 [Kubernetes 部署](/deployment/kubernetes)。有关多副本问题的故障排除，请参阅[多副本故障排除](/troubleshooting/multi-replica)。

---

**需要协助规划企业部署？** 我们的团队与全球各地的组织合作，设计并实施生产级 Open WebUI 环境。

[**联系企业销售团队 →**](https://openwebui.com/contact/sales)
