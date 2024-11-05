
# Helm Setup for Kubernetes

Helm helps you manage Kubernetes applications.

## Prerequisites

- Kubernetes cluster is set up.
- Helm is installed.

## Steps

1. **Add Open WebUI Helm Repository:**

   ```bash
   helm repo add open-webui https://open-webui.github.io/helm-charts
   helm repo update
   ```

2. **Install Open WebUI Chart:**

   ```bash
   helm install openwebui open-webui/open-webui
   ```

3. **Verify Installation:**

   ```bash
   kubectl get pods
   ```

## Access the WebUI

Set up port forwarding or load balancing to access Open WebUI from outside the cluster.
