---
sidebar_position: 1
title: "🔧 Alternative Installation"
---

### Installing Both Ollama and Open WebUI Using Kustomize

For a CPU-only Pod:

```bash
kubectl apply -k ./kubernetes/manifest/base
```

For a GPU-enabled Pod:

```bash
kubectl apply -k ./kubernetes/manifest/gpu
```

### Installing Both Ollama and Open WebUI Using Helm

:::info

    The Helm installation method has been migrated to the new GitHub repository. Please refer to
    the latest installation instructions at [https://github.com/open-webui/helm-charts](https://github.com/open-webui/helm-charts).

:::

Confirm that Helm has been deployed on your execution environment. 
For installation instructions, visit [https://helm.sh/docs/intro/install/](https://helm.sh/docs/intro/install/).

```bash
helm repo add open-webui https://helm.openwebui.com/
helm repo update

kubectl create namespace open-webui
helm upgrade --install open-webui open-webui/open-webui --namespace open-webui
```

For additional customization options, refer to the [kubernetes/helm/values.yaml](https://github.com/open-webui/helm-charts/tree/main/charts/open-webui) file.
