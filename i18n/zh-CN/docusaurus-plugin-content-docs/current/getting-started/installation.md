# 安装（备用）

### 使用 Kustomize 安装 Ollama 和 Open WebUI

对于仅启用 CPU 的 Pod

```bash
kubectl apply -f ./kubernetes/manifest/base
```

对于使用 GPU 的 Pod

```bash
kubectl apply -k ./kubernetes/manifest
```

### 使用 Helm 安装 Ollama 和 Open WebUI

首先打包 Helm 文件

```bash
helm package ./kubernetes/helm/
```

对于仅 CPU 的 Pod

```bash
helm install open-webui ./open-webui-*.tgz
```

对于启用 GPU 的 Pod

```bash
helm install open-webui ./open-webui-*.tgz --set ollama.resources.limits.nvidia.com/gpu="1"
```

查看 `kubernetes/helm/values.yaml` 文件以了解可用于自定义的参数

