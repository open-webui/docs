
# Helm Setup for Kubernetes

This is the fastest way to try Open WebUI on a cluster. For a persistent or production installation (pinned versions, secrets, PostgreSQL, Redis, object storage, ingress and safe updates), follow the [Kubernetes Deployment](/deployment/kubernetes) guide.

## Prerequisites

- A running Kubernetes cluster, with `kubectl` configured for it.
- Helm 3.

## Helm Steps

1. **Add Open WebUI Helm Repository:**

   ```bash
   helm repo add open-webui https://open-webui.github.io/helm-charts
   helm repo update
   ```

2. **Install Open WebUI Chart:**

   ```bash
   helm install openwebui open-webui/open-webui
   ```

   With its default values the chart also deploys Ollama, Pipelines and a Redis instance, and stores Open WebUI's data on a 2 GiB PVC. Add `--set ollama.enabled=false --set pipelines.enabled=false` if you connect to models elsewhere.

3. **Verify Installation:**

   ```bash
   kubectl get pods
   ```

Before running more than one replica or worker, read [Scaling Open WebUI](/getting-started/advanced-topics/scaling). Updates across replicas follow [Updates and Recovery](/deployment/kubernetes#updates-and-recovery).

## Access the WebUI

Forward the service to your machine and open [http://localhost:3000](http://localhost:3000):

```bash
kubectl port-forward service/openwebui-open-webui 3000:80
```

To expose it through an ingress controller, see [Finish the Production Installation](/deployment/kubernetes#finish-the-production-installation).

## Uninstall

1.  **Uninstall the Helm Release:**
    ```bash
    helm uninstall openwebui
    ```
    With the default values this also deletes Open WebUI's PVC and the data on it. To keep the data across an uninstall, follow [Uninstall Without Accidentally Deleting Data](/deployment/kubernetes#uninstall-without-accidentally-deleting-data).

2.  **Remove Remaining Persistent Volume Claims (WARNING: Deletes all data):**
    To make sure no volume of this release is left:
    ```bash
    kubectl delete pvc -l app.kubernetes.io/instance=openwebui
    ```
