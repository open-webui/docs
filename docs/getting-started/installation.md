# Alternative Installation

### Installing Both Ollama and Open WebUI Using Kustomize

For cpu-only pod

```bash
kubectl apply -k ./kubernetes/manifest/base
```

For gpu-enabled pod

```bash
kubectl apply -k ./kubernetes/manifest/gpu
```

### Installing Both Ollama and Open WebUI Using Helm

:::info

    The helm install method has been migrated to the new github repo, 
    and the latest installation method is referred to. [https://github.com/open-webui/helm-charts](https://github.com/open-webui/helm-charts)

:::

Confirm that'Helm 'has been deployed on your execution environment. 
For more installation instructions, please refer to [https://helm.sh/docs/intro/install/](https://helm.sh/docs/intro/install/)

```bash
helm repo add open-webui https://helm.openwebui.com/
helm repo update

kubectl create namespace open-webui
helm upgrade --install open-webui open-webui/open-webui --namespace open-webui
```

Check the [kubernetes/helm/values.yaml](https://github.com/open-webui/helm-charts/tree/main/charts/open-webui) file to know more values are available for customization
