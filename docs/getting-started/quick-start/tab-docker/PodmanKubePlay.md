# Podman Kube Play Setup

Podman supports Kubernetes like-syntax for deploying resources such as pods, volumes without having the overhead of a full Kubernetes cluster. [More about Kube Play](https://docs.podman.io/en/latest/markdown/podman-kube-play.1.html).

If you don't have Podman installed, check out [Podman's official website](https://podman.io/docs/installation).

## Example `play.yaml`

Here is an example of a Podman Kube Play file to deploy:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: open-webui
spec:
  containers:
    - name: container
      image: ghcr.io/open-webui/open-webui:main
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

## Starting

To start your pod, run the following command:

```bash
podman kube play ./play.yaml
```

## Using GPU Support

For Nvidia GPU support, you need to replace the container image with `ghcr.io/open-webui/open-webui:cuda` and need to specify the device (GPU) required in the pod resources limits as followed:

```yaml
      [...]
      resources:
        limits:
          nvidia.com/gpu=all: 1
      [...]
```

:::important

To successfully have the open-webui container access the GPU(s),
you will need to have the Container Device Interface (CDI) for the GPU you wish to access installed in your Podman Machine. You can check [Podman GPU container access](https://podman-desktop.io/docs/podman/gpu).

:::
