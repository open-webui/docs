# Podman Kube Play 配置 {#podman-kube-play-setup}

Podman 支持类似 Kubernetes 的语法，用于部署 Pod、卷等资源，无需承担完整 Kubernetes 集群的开销。[详细了解 Kube Play](https://docs.podman.io/en/latest/markdown/podman-kube-play.1.html)。

如果尚未安装 Podman，请查看 [Podman 官方网站](https://podman.io/docs/installation)。

## `play.yaml` 示例 {#example-playyaml}

以下是用于部署的 Podman Kube Play 文件示例：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: open-webui
spec:
  containers:
    - name: container
      image: ghcr.io/open-webui/open-webui:main
      env:
        - name: WEBUI_SECRET_KEY
          value: your-secret-key
      ports:
        - name: http
          containerPort: 8080
          hostPort: 3000
      volumeMounts:
        - mountPath: /app/backend/data
          name: data
  volumes:
    - name: data
      persistentVolumeClaim:
        claimName:  open-webui-pvc
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: open-webui-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
```

## 启动 {#starting}

运行以下命令启动 Pod：

```bash
podman kube play ./play.yaml
```

## 使用 GPU 支持 {#using-gpu-support}

`:cuda` 镜像会将 Open WebUI 自身的本地模型（嵌入、重排序和 Whisper 语音转文本）转移到 GPU 上运行；Ollama 的模型不受影响。要支持 NVIDIA GPU，需要将容器镜像替换为 `ghcr.io/open-webui/open-webui:cuda`，并按如下方式在 Pod 资源限制中指定所需设备（GPU）：

```yaml
      [...]
      resources:
        limits:
          nvidia.com/gpu=all: 1
      [...]
```

:::important

要让 open-webui 容器成功访问 GPU，
需要在 Podman Machine 中为希望访问的 GPU 安装容器设备接口（CDI）。你可以查看 [Podman GPU 容器访问](https://podman-desktop.io/docs/podman/gpu)。

:::
