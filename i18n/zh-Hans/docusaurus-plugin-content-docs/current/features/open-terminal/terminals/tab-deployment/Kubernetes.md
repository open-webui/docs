## 先决条件 {#prerequisites}

- 一个正在运行的 Kubernetes 集群
- 已安装 [Helm](https://helm.sh/docs/intro/install/) v3
- 已配置 `kubectl` 以访问你的集群
- [Open WebUI 企业版许可证](/enterprise)（生产环境使用时必需）

## 使用 Helm 部署 {#deploy-with-helm}

Open WebUI Helm Chart 将 Terminals 作为可选子 Chart 包含在内。在你的 values 文件中添加 `terminals` 部分：

```yaml
# values.yaml
terminals:
  enabled: true
  apiKey: ""  # 留空时自动生成

  crd:
    install: false  # 从 Terminals 仓库安装 CRD，见下文

  operator:
    image:
      repository: ghcr.io/open-webui/terminals-operator
      tag: latest

  orchestrator:
    image:
      repository: ghcr.io/open-webui/terminals
      tag: latest
    backend: kubernetes-operator
    terminalImage: "ghcr.io/open-webui/open-terminal:latest"
    idleTimeoutMinutes: 30
```

然后安装或升级：

```bash
helm upgrade --install open-webui open-webui/open-webui \
  -f values.yaml \
  --namespace open-webui --create-namespace
```

:::tip 自动配置的连接
当 `terminals.enabled` 为 `true` 时，Chart 会设置 `TERMINAL_SERVER_CONNECTIONS`，使其指向集群内的编排器。在**设置 > 集成**（管理员区域）中打开该连接并保存一次，以便 Open WebUI 将其识别为编排器。请在连接的**访问权限（Access）**设置中为创建终端的人员授予**写入（Write）**权限，请参阅[创建机器](/features/open-terminal/terminals/orchestration/creating-terminals)。
:::

Terminal CRD 必须定义 `spec.templateId`。Helm Chart 附带的 CRD 要求提供 `spec.userId`，因此请根据你的 Terminals 版本，从 [Terminals 仓库](https://github.com/open-webui/terminals/blob/main/manifests/terminal-crd.yaml)安装 CRD，并设置 `terminals.crd.install: false`。

### 验证 {#verify}

```bash
# 检查所有 Pod 是否正在运行
kubectl get pods -n open-webui -l app.kubernetes.io/part-of=open-terminal

# 检查 CRD 是否已安装
kubectl get crd terminals.openwebui.com
```

---

## 部署内容 {#what-gets-deployed}

当 `terminals.enabled: true` 时，Chart 会创建：

| 资源 | 用途 |
| :--- | :--- |
| **CRD**（`terminals.openwebui.com`） | 定义 `Terminal` 自定义资源 |
| **Operator Deployment** | 监视 Terminal CR 并预配 Pod、Service、PVC 和 Secret 的 Kopf 控制器 |
| **Orchestrator Deployment + Service** | 接收来自 Open WebUI 的请求并代理到实例 Pod 的 FastAPI 服务 |
| **Secret** | 共享 API 密钥（未提供时自动生成） |

对于**每个实例**，Operator 都会创建一个 Pod、Service、Secret（API 密钥），并可选择创建用于持久化存储的 PVC。

---

## 生命周期 {#lifecycle}

需要实例时，编排器会创建一个 `Terminal` CR。Operator 会预配一个 Pod 及其 Service、Secret 和可选的 PVC。Pod 通过就绪检查后，编排器会将流量代理到该 Pod。

当实例的空闲时间超过 `idleTimeoutMinutes` 时，Operator 会删除 Pod，但保留 PVC 和 Secret。下一次请求到来时，会创建一个新的 Pod 并重新挂载同一 PVC，因此**用户数据会在空闲周期之间保留**。

```bash
# 列出所有终端
kubectl get terminals -n open-webui

# 检查特定终端
kubectl describe terminal <name> -n open-webui

# 删除终端（其 Pod、Service 和 Secret 会被移除）
kubectl delete terminal <name> -n open-webui
```

删除终端会移除其 Pod、Service 和 Secret。包含其文件的 PVC 会一直保留，直到你使用 `kubectl delete pvc` 单独删除它。

---

## 监控 {#monitoring}

```bash
# Operator 日志
kubectl logs -n open-webui deployment/<release>-terminals-operator --tail=50

# 编排器日志
kubectl logs -n open-webui deployment/<release>-terminals-orchestrator --tail=50
```

---

<details>
<summary>Terminal CRD 参考</summary>

<h3 id="spec-fields">Spec 字段</h3>

| 字段 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `templateId` | string | *（必需）* | 此实例所属终端的 ID |
| `contextId` | string | `default` | 这是终端的哪个实例：`default`、`user:<id>`、`chat:<id>` 或 `model:<id>` |
| `image` | string | `ghcr.io/open-webui/open-terminal:latest` | 容器镜像 |
| `imagePullPolicy` | string | *（Kubernetes 默认值）* | `Always`、`IfNotPresent` 或 `Never` |
| `resources.requests.cpu` | string | *（未设置）* | CPU 请求量。编排器仅设置限制 |
| `resources.requests.memory` | string | *（未设置）* | 内存请求量。编排器仅设置限制 |
| `resources.limits.cpu` | string | *（未设置）* | CPU 限制。终端设有 CPU 限制时，由编排器设置 |
| `resources.limits.memory` | string | *（未设置）* | 内存限制。终端设有内存限制时，由编排器设置 |
| `idleTimeoutMinutes` | integer | `30` | Pod 停止前的空闲超时时间，`0` 表示禁用。编排器始终根据终端或 `TERMINALS_IDLE_TIMEOUT_MINUTES` 设置此值，因此该默认值仅适用于手写的资源 |
| `packages` | array | `[]` | 要预装的 Apt 软件包 |
| `pipPackages` | array | `[]` | 要预装的 Pip 软件包 |
| `env` | object | `{}` | 传递给容器的环境变量 |
| `restricted` | boolean | `false` | 受限的 Kubernetes 和 OpenShift Pod 默认值 |
| `podSecurityContext`、`containerSecurityContext` | object | *（未设置）* | 复制到 Pod 和容器的安全上下文 |
| `podTemplate` | object | *（未设置）* | 合并到生成的 Pod 中的 Pod 元数据和 spec 覆盖项 |
| `persistence.enabled` | boolean | `true` | 启用持久化存储 |
| `persistence.size` | string | `1Gi` | PVC 大小 |
| `persistence.storageClass` | string | *（集群默认值）* | 存储类 |

<h3 id="status-fields">状态字段</h3>

| 字段 | 描述 |
| :--- | :--- |
| `phase` | `Pending`、`Provisioning`、`Running`、`Idle` 或 `Error` |
| `podName` | 终端 Pod 的名称 |
| `serviceUrl` | 终端的集群内 URL |
| `apiKeySecret` | 保存终端 API 密钥的 Secret |
| `lastActivityAt` | 上一次代理请求的时间戳 |
| `message` | 人类可读的状态消息 |

</details>

<details>
<summary>完整 Helm 配置值参考</summary>

| 键 | 默认值 | 描述 |
| :--- | :--- | :--- |
| `terminals.enabled` | `false` | 启用 Terminals 子 Chart |
| `terminals.apiKey` | （空） | 共享 API 密钥（为空时自动生成） |
| `terminals.existingSecret` | （空） | 已有 Secret 的名称（键：`api-key`） |
| `terminals.crd.install` | `true` | 安装 Terminal CRD |
| `terminals.operator.image.repository` | `ghcr.io/open-webui/terminals-operator` | Operator 镜像 |
| `terminals.operator.image.tag` | `latest` | Operator 镜像标签 |
| `terminals.operator.replicaCount` | `1` | Operator 副本数 |
| `terminals.orchestrator.image.repository` | `ghcr.io/open-webui/terminals` | 编排器镜像 |
| `terminals.orchestrator.image.tag` | `latest` | 编排器镜像标签 |
| `terminals.orchestrator.backend` | `kubernetes-operator` | 后端类型 |
| `terminals.orchestrator.terminalImage` | `ghcr.io/open-webui/open-terminal:latest` | 用户 Pod 的默认镜像 |
| `terminals.orchestrator.idleTimeoutMinutes` | `30` | 空闲超时时间（分钟） |
| `terminals.orchestrator.terminalImagePullPolicy` | `IfNotPresent` | 实例镜像的拉取策略 |
| `terminals.orchestrator.replicaCount` | `1` | 编排器副本数 |
| `terminals.operator.extraEnvVars`、`terminals.orchestrator.extraEnvVars` | `[]` | 额外的环境变量，采用列表或映射形式 |
| `terminals.networkPolicy.enabled` | `false` | 为 Operator、编排器和实例 Pod 创建 NetworkPolicies |
| `terminals.orchestrator.service.type` | `ClusterIP` | 编排器 Service 类型 |
| `terminals.orchestrator.service.port` | `8080` | 编排器 Service 端口 |

</details>

<details>
<summary>RBAC 要求（仅手动安装）</summary>

如果不使用 Helm Chart，Operator 的 ServiceAccount 需要一个具有以下权限的 ClusterRole：

| 资源 | 动词 |
| :--- | :--- |
| `terminals.openwebui.com` | get, list, watch, create, update, patch, delete |
| `pods`、`services`、`persistentvolumeclaims`、`secrets` | get, list, watch, create, update, patch, delete |
| `events` | create |
| `configmaps`、`leases` | get, list, watch, create, update, patch |

</details>
