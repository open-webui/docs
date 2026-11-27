
# 在 Kubernetes 上使用 Helm 配置 {#helm-setup-for-kubernetes}

这是在集群上体验 Open WebUI 最快的方式。对于需要持久化或用于生产环境的安装（固定版本、机密管理、PostgreSQL、Redis、对象存储、Ingress 和安全更新），请遵循 [Kubernetes 部署](/deployment/kubernetes)指南。

## 前提条件 {#prerequisites}

- 一个正在运行的 Kubernetes 集群，并已为其配置 `kubectl`。
- Helm 3。

## Helm 步骤 {#helm-steps}

1. **添加 Open WebUI Helm 仓库：**

   ```bash
   helm repo add open-webui https://open-webui.github.io/helm-charts
   helm repo update
   ```

2. **安装 Open WebUI Chart：**

   ```bash
   helm install openwebui open-webui/open-webui
   ```

   使用默认值时，Chart 还会部署 Ollama、Pipelines 和一个 Redis 实例，并将 Open WebUI 的数据存储在 2 GiB 的 PVC 上。如果连接其他位置的模型，请添加 `--set ollama.enabled=false --set pipelines.enabled=false`。

3. **验证安装：**

   ```bash
   kubectl get pods
   ```

在运行多个副本或工作进程之前，请阅读[扩缩容 Open WebUI](/getting-started/advanced-topics/scaling)。跨副本更新请遵循[更新与恢复](/deployment/kubernetes#updates-and-recovery)。

## 访问 WebUI {#access-the-webui}

将服务转发到你的计算机，然后打开 [http://localhost:3000](http://localhost:3000)：

```bash
kubectl port-forward service/openwebui-open-webui 3000:80
```

如需通过 Ingress 控制器暴露服务，请参阅[完成生产环境安装](/deployment/kubernetes#finish-the-production-installation)。

## 卸载 {#uninstall}

1.  **卸载 Helm Release：**
    ```bash
    helm uninstall openwebui
    ```
    使用默认值时，这还会删除 Open WebUI 的 PVC 及其中的数据。如需在卸载后保留数据，请遵循[卸载时避免意外删除数据](/deployment/kubernetes#uninstall-without-accidentally-deleting-data)。

2.  **删除剩余的持久卷声明（警告：删除所有数据）：**
    要确保此 Release 不留下任何卷：
    ```bash
    kubectl delete pvc -l app.kubernetes.io/instance=openwebui
    ```
