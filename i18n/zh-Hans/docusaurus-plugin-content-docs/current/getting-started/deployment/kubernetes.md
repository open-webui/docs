---
slug: /deployment/kubernetes
sidebar_position: 1
title: "Kubernetes 部署"
description: "使用 Helm 在 Kubernetes 上部署 Open WebUI，从单个持久化实例到使用共享服务的生产环境部署。"
---

# Kubernetes 部署

使用官方 Open WebUI Helm chart 在你的 Kubernetes 集群上部署。本指南集中介绍设置、安装、验证和更新。

有关使用企业许可证的部署，请参阅[企业版 Helm 部署指南](/enterprise/deployment/kubernetes-helm)。

Open WebUI 连接现有模型服务器或 API。示例不会安装 Ollama、Pipelines 或 Terminals，也不要求 Open WebUI Pod 使用 GPU。

## 选择部署方式 {#choose-your-deployment}

| 路径 | 包含内容 | 适用场景 |
| :--- | :--- | :--- |
| [单副本](#single-replica) | 一个应用 Pod，其数据库和文件使用持久卷。 | 你希望使用适合 SQLite 的存储进行简单安装。 |
| [生产环境](#production) | 一个或多个应用 Pod，使用共享 PostgreSQL、Redis 和对象存储。 | 你需要共享服务、多个副本，或者所用存储不适合 SQLite。 |

两种路径都支持 Enterprise 许可证。用户数量本身不能决定副本数量；请根据并发聊天、文档处理和模型延迟确定容量。

**按顺序执行步骤 1–5。**在步骤 3 中选择一种部署路径。许可、品牌定制、扩缩容和维护将在后面介绍。

## 1. 检查集群 {#1-check-your-cluster}

你需要一个正在运行的 Kubernetes 集群、Helm 3，以及已为该集群配置好的 `kubectl`。你还需要创建命名空间、工作负载、Service 和 Secret 的权限，并能访问 chart 仓库、容器镜像仓库和你的模型端点。

```bash
kubectl config current-context
kubectl get nodes
kubectl create namespace openwebui
helm repo add open-webui https://open-webui.github.io/helm-charts
helm repo update
```

**预期结果：**节点已就绪，并且 `openwebui` 命名空间存在。如果该命名空间已存在，请重复使用。

本指南固定使用 **chart 18.0.0** 和**应用 v0.13.0**。chart 版本与应用版本相互独立。更改版本前，请查阅[已发布的 chart](https://github.com/open-webui/helm-charts/tree/open-webui-18.0.0/charts/open-webui) 和[镜像参考](/getting-started/quick-start#image-variants)。

## 2. 配置应用 {#2-configure-the-application}

### 存储签名密钥和模型 API 密钥 {#store-the-signing-key-and-model-api-key}

生成一次签名密钥，然后将其保存在密钥管理器中，供以后重启和恢复使用：

```bash
openssl rand -hex 32
```

在 Git 之外的私有目录中创建 `secrets.env`。输入真实凭据前，将其权限设为 `600`。替换两个占位符；使用不带外层引号的单行值。

```ini title="secrets.env"
WEBUI_SECRET_KEY=REPLACE_WITH_GENERATED_KEY
OPENAI_API_KEY=REPLACE_WITH_MODEL_API_KEY
```

```bash
kubectl -n openwebui create secret generic openwebui-secrets \
  --from-env-file=secrets.env
```

**预期结果：**Secret `openwebui-secrets` 已创建。Kubernetes Secret 需要适当的 RBAC 和静态加密。你的密钥 Operator 也可以创建同名的 Secret 和键。

### 保存共享 Helm 值 {#save-the-shared-helm-values}

将以下内容保存为 `values-common.yaml`。将 `https://models.example.com/v1` 替换为你的 OpenAI 兼容 API 基础 URL。你的 Pod 必须能够访问该 URL，并且其模型列表必须包含聊天模型。

<details>
<summary>显示 values-common.yaml</summary>

```yaml title="values-common.yaml"
fullnameOverride: openwebui
workload:
  kind: Deployment
strategy:
  type: Recreate
image:
  repository: ghcr.io/open-webui/open-webui
  tag: v0.13.0
ollama:
  enabled: false
pipelines:
  enabled: false
terminals:
  enabled: false
tika:
  enabled: false
service:
  type: ClusterIP
  port: 80
openaiBaseApiUrl: https://models.example.com/v1
openaiApiKeyExistingSecret: openwebui-secrets
openaiApiKeyExistingSecretKey: OPENAI_API_KEY
resources:
  requests:
    cpu: 500m
    memory: 1Gi
  limits:
    cpu: '2'
    memory: 4Gi
startupProbe:
  httpGet:
    path: /health
    port: http
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 60
readinessProbe:
  httpGet:
    path: /ready
    port: http
  periodSeconds: 10
  timeoutSeconds: 5
livenessProbe:
  httpGet:
    path: /health
    port: http
  periodSeconds: 30
  timeoutSeconds: 5
  failureThreshold: 3
extraEnvVars:
  WEBUI_SECRET_KEY:
    valueFrom:
      secretKeyRef:
        name: openwebui-secrets
        key: WEBUI_SECRET_KEY
  UVICORN_WORKERS: '1'
```

</details>

这些值为应用提供可预测的资源名称，通过 Secret 引用其凭据，并配置健康探针。启动完成且数据库和 Redis（配置时）能够响应后，`/ready` 会返回响应。在滚动更新期间，`Recreate` 会先停止旧应用 Pod，再启动替代 Pod。资源请求和限制是起始值；请根据观测到的用量进行调优。

chart 支持此处使用的 map 形式 `extraEnvVars`，以便跨文件合并设置。由于 chart 默认值是列表，Helm 3 可能会报告合并警告；安装前，请确认渲染清单中的环境变量和 Secret 引用。

## 3. 选择存储配置 {#3-choose-a-storage-configuration}

将以下配置中的**一个**与 `values-common.yaml` 保存在同一目录。

### 单副本 {#single-replica}

检查可用的存储类：

```bash
kubectl get storageclass
```

选择具有可靠文件锁和低延迟文件系统访问、适合 SQLite 的存储，例如本地存储或块设备后端存储。不要将 SQLite 放在 NFS、SMB 或其他共享网络文件系统上。如果你的存储不适合，请使用带 PostgreSQL 的生产环境配置。请参阅[数据库存储指导](/getting-started/advanced-topics/scaling#step-1-switch-to-postgresql)。

将以下内容保存为 `values-single.yaml`，并替换 `your-storage-class`：

```yaml title="values-single.yaml"
replicaCount: 1
websocket:
  enabled: true
  manager: ''
  redis:
    enabled: false
persistence:
  enabled: true
  provider: local
  storageClass: your-storage-class
  accessModes:
  - ReadWriteOnce
  size: 10Gi
  annotations:
    helm.sh/resource-policy: keep
ingress:
  enabled: false
extraEnvVars:
  ENABLE_DB_MIGRATIONS: 'true'
```

PVC 将 SQLite、本地向量数据、上传文件和模型缓存存储在 `/app/backend/data`。副本数和工作进程数都保持为一。keep 注解会在 Helm 卸载期间保留此 PVC。

本地嵌入模型可能会在首次启动时下载。请允许必要的模型下载访问，或提前准备这些资源。此路径中的 Redis 是可选项；在生产环境使用前，请查阅[令牌撤销](/getting-started/advanced-topics/hardening#token-revocation)。

### 生产环境 {#production}

安装前预配以下服务。下面的 chart 配置会连接这些服务，但不会创建它们。

| 服务 | 准备内容 |
| :--- | :--- |
| PostgreSQL + PGVector | 具有架构迁移权限的应用数据库和角色。让数据库管理员在该数据库中启用 `vector` 扩展。 |
| Redis | 共享端点，包含已配置的身份验证和 TLS。 |
| S3 兼容存储 | 现有存储桶，以及执行所需读取、写入、列出和删除操作的凭据。 |
| 嵌入 API | OpenAI 兼容的嵌入端点、其 API 密钥和受支持的嵌入模型 ID。 |
| 内容提取 | 可访问的 Apache Tika 服务。 |
| HTTPS 访问 | 已安装的入口控制器、DNS 主机名，以及其 TLS 证书和密钥。 |

PGVector 替代默认的 ChromaDB，后者的本地 SQLite 存储无法由多个副本共享。请参阅[外部向量数据库](/getting-started/advanced-topics/scaling#step-4-switch-to-an-external-vector-database)。

从应用网络验证数据库登录和 vector 扩展、Redis 访问、存储桶上传/下载/删除、模型响应、嵌入请求和 Tika 访问。根据需要为这些服务配置网络策略和私有 CA 信任。

:::warning 现有安装
这些值面向全新的数据库和存储桶。设置 PostgreSQL URL 不会迁移现有的 SQLite 用户、聊天或设置。在已有数据的安装上更改后端之前，请规划数据迁移、文件传输以及向量迁移或重新索引。
:::

创建私有的 `backends.env`，采用与 `secrets.env` 相同的保护措施，并替换占位符。对数据库和 Redis 凭据中的特殊字符进行 URL 编码。使用数据库服务提供方要求的 [TLS 参数](/reference/env-configuration#database_url)。

```ini title="backends.env"
DATABASE_URL=postgresql://REPLACE_USER:REPLACE_PASSWORD@postgres.example.com:5432/openwebui
REDIS_URL=rediss://default:REPLACE_PASSWORD@redis.example.com:6379/0
RAG_OPENAI_API_KEY=REPLACE_WITH_EMBEDDING_API_KEY
S3_ACCESS_KEY_ID=REPLACE_WITH_STORAGE_ACCESS_KEY
S3_SECRET_ACCESS_KEY=REPLACE_WITH_STORAGE_SECRET_KEY
```

```bash
kubectl -n openwebui create secret generic openwebui-backends \
  --from-env-file=backends.env
kubectl -n openwebui create secret tls openwebui-tls \
  --cert=/path/to/tls.crt --key=/path/to/tls.key
```

将以下内容保存为 `values-production.yaml`。替换主机名、入口类、存储桶、区域和嵌入模型。让 `WEBUI_URL` 与入口主机名保持一致；即使入口处于禁用状态，首次启动时也必须正确设置该值。

<details>
<summary>显示 values-production.yaml</summary>

```yaml title="values-production.yaml"
replicaCount: 3
websocket:
  enabled: true
  manager: redis
  redis:
    enabled: false
  existingSecret: openwebui-backends
  existingSecretKey: REDIS_URL
databaseUrl: ''
persistence:
  enabled: false
  provider: s3
  s3:
    bucket: openwebui
    region: us-east-1
    endpointUrl: https://s3.example.com
    accessKeyExistingSecret: openwebui-backends
    accessKeyExistingAccessKey: S3_ACCESS_KEY_ID
    secretKeyExistingSecret: openwebui-backends
    secretKeyExistingSecretKey: S3_SECRET_ACCESS_KEY
ingress:
  enabled: true
  class: your-ingress-class
  host: ai.example.com
  tls: true
  existingSecret: openwebui-tls
extraEnvVars:
  WEBUI_URL: https://ai.example.com
  DATABASE_URL:
    valueFrom:
      secretKeyRef:
        name: openwebui-backends
        key: DATABASE_URL
  VECTOR_DB: pgvector
  PGVECTOR_CREATE_EXTENSION: 'false'
  RAG_EMBEDDING_ENGINE: openai
  RAG_EMBEDDING_MODEL: REPLACE_WITH_EMBEDDING_MODEL_ID
  RAG_OPENAI_API_BASE_URL: https://embeddings.example.com/v1
  RAG_OPENAI_API_KEY:
    valueFrom:
      secretKeyRef:
        name: openwebui-backends
        key: RAG_OPENAI_API_KEY
  CONTENT_EXTRACTION_ENGINE: tika
  TIKA_SERVER_URL: http://tika.example.com:9998
  ENABLE_DB_MIGRATIONS: 'false'
```

</details>

chart 根据同一个 Secret 设置应用和 WebSocket 的 Redis URL。PostgreSQL 保存应用记录和向量（除非设置 [`PGVECTOR_DB_URL`](/reference/env-configuration#pgvector_db_url)，否则 PGVector 使用 `DATABASE_URL`）；存储桶保存上传的文件。在此配置中，`/app/backend/data` 是临时目录，因此这些共享后端之外的本地缓存和特定功能文件无法在 Pod 替换后保留。

对于单个生产环境副本，请在此文件中设置 `replicaCount: 1`。额外的副本需要足够的数据库连接容量和共享服务；需要容忍节点故障时，请将它们放置在不同节点上。请参阅[扩缩容指导](/getting-started/advanced-topics/scaling)。

slim 镜像支持此配置使用的每项服务，因此你可以通过它设置 `image.tag: v0.13.0-slim`，获得不包含本地机器学习技术栈、体积更小的镜像。请参阅 [slim 镜像未包含的内容](/getting-started/quick-start#what-slim-leaves-out)。

## 4. 使用 Helm 安装 {#4-install-with-helm}

选择你保存的配置：

```bash
# 选择其中一个：
OPENWEBUI_PROFILE=values-single.yaml
# OPENWEBUI_PROFILE=values-production.yaml
```

两种路径都严格从**一个启用迁移的工作进程**开始，并禁用入口。检查渲染后的清单，然后安装：

```bash
helm template openwebui open-webui/open-webui \
  --version 18.0.0 --namespace openwebui \
  -f values-common.yaml -f "$OPENWEBUI_PROFILE" \
  --set replicaCount=1 --set ingress.enabled=false \
  --set-string extraEnvVars.ENABLE_DB_MIGRATIONS=true > rendered.yaml

helm install openwebui open-webui/open-webui \
  --version 18.0.0 --namespace openwebui \
  -f values-common.yaml -f "$OPENWEBUI_PROFILE" \
  --set replicaCount=1 --set ingress.enabled=false \
  --set-string extraEnvVars.ENABLE_DB_MIGRATIONS=true \
  --wait --timeout 15m

kubectl -n openwebui rollout status deployment/openwebui --timeout=10m
kubectl -n openwebui get pods,pvc,services
```

**预期结果：**一个已就绪的应用 Pod。单副本路径还会有一个已绑定的 `openwebui` PVC。拉取镜像和首次下载模型可能需要几分钟。

如果 Helm 超时，请检查 `helm status openwebui -n openwebui`、Pod 事件和日志。如果 release 已存在，请使用相同的引导参数通过 `helm upgrade` 重试。初始化成功前，不要增加副本。

## 5. 打开并验证 Open WebUI {#5-open-and-verify-open-webui}

让此命令保持运行：

```bash
kubectl -n openwebui port-forward service/openwebui 3000:80
```

打开 [http://localhost:3000](http://localhost:3000)，创建第一个管理员账号，选择模型并发送消息。如果缺少模型，请检查**设置（Settings）→ 连接（Connections）**（管理员区域）。

暴露服务前，请禁用开放注册或配置你的[身份提供方](/features/authentication-access/auth/sso)。查阅[加固指南](/getting-started/advanced-topics/hardening)。

### 完成生产环境安装 {#finish-the-production-installation}

对于生产环境路径，在第一个副本成功初始化后应用已保存的配置：

```bash
helm upgrade openwebui open-webui/open-webui \
  --version 18.0.0 --namespace openwebui \
  -f values-common.yaml -f values-production.yaml \
  --wait --timeout 15m
kubectl -n openwebui rollout status deployment/openwebui --timeout=10m
kubectl -n openwebui get pods,ingress
```

这会在所有副本上禁用迁移，应用所需的副本数，并启用入口。预计会发生短暂重启。将 DNS 指向你的入口控制器，然后打开你的 HTTPS 主机名。

配置控制器以支持 WebSocket、无缓冲的流式响应、合适的请求/空闲超时，以及所需的上传大小。Socket.IO 在 `/ws/socket.io/` 下提供服务，因此基于路径的入口必须转发该前缀和升级标头。请参阅[连接故障排除](/troubleshooting/connection-error)。

在设置**最大上传大小（Max Upload Size）**（`RAG_FILE_MAX_SIZE`）或知识库文件限制之前，Open WebUI 本身没有上传大小限制，并且其自身返回的 `413` 会携带消息 `Oops! The file you're trying to upload is too large.`。知识库上传过程中出现的任何其他 `413` 都来自入口控制器或它前面的其他代理，例如服务网格或 CDN。按照[关键配置说明](/reference/https#key-configuration-notes)中的说明提高其请求正文大小限制。对于 NGINX Ingress Controller，可设置 [`nginx.ingress.kubernetes.io/proxy-body-size`](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#custom-max-body-size) 注解，或者在其 ConfigMap 中为所有 Ingress 规则设置 `proxy-body-size`。

启用 WebSocket 时，会话亲和性是可选的；使用 [`ENABLE_WEBSOCKET_SUPPORT=false`](/reference/env-configuration#enable_websocket_support) 时则是必需的；请参阅[会话亲和性](/troubleshooting/multi-replica#session-affinity-sticky-sessions)。亲和性不能替代 Redis。对于 NGINX Ingress Controller，请将以下注解添加到 Ingress 资源：

```yaml
metadata:
  annotations:
    nginx.ingress.kubernetes.io/affinity: 'cookie'
    nginx.ingress.kubernetes.io/session-cookie-name: 'open-webui-session'
    nginx.ingress.kubernetes.io/session-cookie-expires: '172800'
    nginx.ingress.kubernetes.io/session-cookie-max-age: '172800'
```

### 验证部署 {#verify-the-deployment}

- **聊天：**登录，以流式方式生成模型响应，然后重新打开已保存的对话。
- **持久化：**运行 `kubectl -n openwebui rollout restart deployment/openwebui`，等待滚动更新完成，必要时重启端口转发，并确认对话仍然存在。
- **生产环境文档：**上传一份包含独特事实的小文档。确认索引完成，并且针对该事实提问能够检索到正确来源。检查上传的对象是否存在于存储桶中。
- **多个副本：**将两个不同 Pod 分别转发到不同的本地端口，登录每个实例，并验证两者都能访问相同的已保存对话和上传文件。还要通过入口进行测试。在被替换的 Pod 上进行的流式传输可能需要重试。

已就绪的 Pod 已连接其数据库和 Redis；模型 API、存储和许可需要执行上述检查。许多应用设置会在首次启动后持久保存，因此之后的环境变量变更可能不会覆盖它们。请参阅[配置持久化](/reference/env-configuration#important-note-on-configvar-environment-variables)。

## Enterprise 许可与品牌定制 {#enterprise-licensing-and-branding}

<details>
<summary>添加企业许可证</summary>

创建一个私有且权限受限的 `license.env`，其中包含 `LICENSE_KEY=YOUR_ISSUED_KEY`，然后创建其 Secret：

```bash
kubectl -n openwebui create secret generic openwebui-license \
  --from-env-file=license.env
```

在 `values-common.yaml` 的 `extraEnvVars` 下添加此条目，与现有条目并列：

```yaml
  LICENSE_KEY:
    valueFrom:
      secretKeyRef:
        name: openwebui-license
        key: LICENSE_KEY
```

在安装前创建 Secret，或使用下面的更新流程应用更改。Secret 环境变量的更改需要替换 Pod。在应用的管理员界面中确认预期的企业版状态和许可用户上限；仅就绪并不能验证激活状态。

</details>

<details>
<summary>使用自己的品牌镜像或托管品牌定制</summary>

对于内部维护的品牌定制，请构建已获许可的分支，并将其镜像推送到你的镜像仓库。更改 `values-common.yaml` 中的现有镜像设置，并添加拉取 Secret 引用：

```yaml
image:
  repository: registry.example.com/platform/openwebui
  tag: v0.13.0-branding.1
imagePullSecrets:
  - name: openwebui-registry
```

通过经批准的镜像仓库凭据工作流在同一命名空间中创建该 Secret，例如：

```bash
kubectl -n openwebui create secret generic openwebui-registry \
  --type=kubernetes.io/dockerconfigjson \
  --from-file=.dockerconfigjson=/path/to/private/docker-config.json
```

使用不可变镜像标签，并通过更新流程部署。在运行中的 Pod 内所做的更改会在替换时丢失。

托管品牌定制通过许可证配置交付。[许可证实现](https://github.com/open-webui/open-webui/blob/v0.13.0/backend/open_webui/utils/auth.py)会尝试在启动时通过 `api.openwebui.com` 和 `licenses.api.openwebui.com` 使用 HTTPS 检索。请为该工作流允许 DNS 解析和出站 HTTPS。自定义品牌镜像本身不会免除许可证网络要求。对于离线部署，请从企业联系人处获取受支持的离线许可证预配说明；仅设置 `OFFLINE_MODE` 不会预配许可证。

</details>

## 更新与恢复 {#updates-and-recovery}

请使用维护窗口。`Recreate` 可防止普通 Deployment 滚动更新期间新旧 Pod 重叠，但无法在多个新副本之间串行执行迁移。

1. 记录已部署的镜像、chart 和值，保留签名密钥并准备备份。停止传入流量，并暂停任何可能重启应用 Pod 的自动扩缩器或 GitOps 协调。
2. 停止共享数据库的**所有**应用实例，并等待它们终止：

```bash
kubectl -n openwebui scale deployment/openwebui --replicas=0
kubectl -n openwebui wait --for=delete pod \
  -l app.kubernetes.io/instance=openwebui,app.kubernetes.io/name=open-webui \
  --timeout=10m
```

3. 对单副本路径的 PVC，或生产环境的 PostgreSQL 和对象存储，执行最终备份。
4. 更新 `values-common.yaml` 中的镜像标签，并查阅目标版本的发行说明。如果使用新 shell，请再次将 `OPENWEBUI_PROFILE` 设为已保存的配置。启动一个启用迁移的工作进程，并保持入口禁用：

```bash
helm upgrade openwebui open-webui/open-webui \
  --version 18.0.0 --namespace openwebui \
  -f values-common.yaml -f "$OPENWEBUI_PROFILE" \
  --set replicaCount=1 --set ingress.enabled=false \
  --set-string extraEnvVars.ENABLE_DB_MIGRATIONS=true \
  --wait --timeout 15m
kubectl -n openwebui logs deployment/openwebui -c open-webui --tail=100
```

5. 使用端口转发验证启动和现有数据。对于生产环境，运行**完成生产环境安装**命令，以恢复正常副本、入口和禁用迁移的状态。单副本配置会在其唯一工作进程上保持迁移启用。恢复正常流量和控制器之前，请重复验证检查。

更改 chart 版本时，还要查阅其发行说明并更新命令中的 `--version`。如果初始化失败，请保持其他副本停止并进行排查。Helm 回滚（包括 `--atomic`）无法撤销数据库迁移。恢复到不兼容的旧版应用时，需要恢复兼容的数据库和存储状态。请参阅[备份与恢复](/getting-started/updating#backup--restore)。

## 可选的自动扩缩容 {#optional-autoscaling}

<details>
<summary>生产环境部署正常工作后添加 HPA 和 PodDisruptionBudget</summary>

Chart 18.0.0 不会通过专用值创建这些资源。将这些独立资源保存为 `scaling.yaml`。HPA 需要正常工作的 metrics API 和 CPU 请求；首先确认 `kubectl top pods -n openwebui` 可以运行。

```yaml title="scaling.yaml"
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: openwebui
  namespace: openwebui
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: openwebui
  minReplicas: 2
  maxReplicas: 4
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: openwebui
  namespace: openwebui
spec:
  minAvailable: 1
  selector:
    matchLabels:
      app.kubernetes.io/instance: openwebui
      app.kubernetes.io/name: open-webui
```

使用 `kubectl -n openwebui apply -f scaling.yaml` 应用。这些阈值是示例，不是用户容量保证。请为最大副本数做好数据库连接容量预算，并防止 GitOps 与 HPA 对 `spec.replicas` 的更改相互冲突。每个工作进程都有一个同步数据库引擎和一个异步数据库引擎，每个引擎都可以打开 `DATABASE_POOL_SIZE` + `DATABASE_POOL_MAX_OVERFLOW` 个连接（未设置 `DATABASE_POOL_SIZE` 时，SQLAlchemy 为 5 + 10）。使用 `VECTOR_DB=pgvector` 时，即使 PGVector 使用 `DATABASE_URL`，它也会打开自己的 `PGVECTOR_POOL_SIZE` + `PGVECTOR_POOL_MAX_OVERFLOW` 连接池（未设置时同样为 5 + 10）。Helm 升级也可能重置副本数。

更新前，使用 `kubectl -n openwebui delete hpa openwebui` 删除此 HPA，并暂停任何会重新创建它的控制器。仅在验证恢复后的部署后重新应用。PDB 限制节点排空等自愿驱逐；它不能阻止 Deployment 缩容或上述维护中断。

</details>

## 故障排除 {#troubleshooting}

```bash
kubectl -n openwebui get pods,pvc,services,ingress
kubectl -n openwebui get events --sort-by=.metadata.creationTimestamp
kubectl -n openwebui describe deployment openwebui
kubectl -n openwebui logs deployment/openwebui -c open-webui --tail=100
```

| 症状 | 检查项 |
| :--- | :--- |
| Pod 或 PVC 处于 Pending 状态 | 可用资源、StorageClass、访问模式和调度器事件。生产环境 S3 配置不会创建应用 PVC。 |
| ImagePullBackOff 或 init 容器失败 | 镜像标签、镜像仓库访问、拉取 Secret，以及 `copy-app-data` 的日志。 |
| 缺少 Secret 或键 | 同一命名空间中准确的 Secret 和键名称。避免在诊断信息中打印凭据。 |
| 数据库初始化失败 | 数据库登录/TLS、架构权限、vector 扩展，以及恰好一个启用迁移的工作进程。 |
| 上传或检索失败 | 存储桶权限、Tika 访问、嵌入模型/凭据和向量数据库连接。 |
| 登录循环或设置不一致 | 共享签名密钥、数据库、Redis、公共 URL 和持久化配置。 |
| 流式传输中断 | Redis 连接、入口缓冲、WebSocket 处理和请求/空闲超时。 |
| 许可证缺失 | 已签发的许可证、Secret 引用、Pod 替换和许可证端点访问。 |
| OOMKilled 或启动超时 | 应用日志、内存使用量、模型下载和数据库延迟。 |

更多诊断信息请参阅[多副本故障排除](/troubleshooting/multi-replica)。

## 卸载而不误删数据 {#uninstall-without-accidentally-deleting-data}

如果安装了 `scaling.yaml`，请先删除这些可选资源。然后卸载 release：

```bash
helm uninstall openwebui --namespace openwebui
```

单副本配置的 **keep 注解**会保留其 PVC。使用 `kubectl -n openwebui get pvc openwebui` 验证；不要假定所有 chart 配置都会保留 PVC。要重复使用它，请设置 `persistence.existingClaim: openwebui` 并重复使用签名密钥。

外部生产数据库和对象存储不会被 release 删除。单独创建的 Secret 也会保留。请根据恢复策略保留备份和凭据。

:::danger 有意删除数据
删除命名空间会删除其中的 Secret 和 PVC。仅在不再需要数据且已具备所需备份时，才删除保留的 `openwebui` PVC；其回收策略也可能删除底层存储。
:::
