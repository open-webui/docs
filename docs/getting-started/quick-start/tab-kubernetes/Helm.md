
# Helm Setup for Kubernetes

Helm helps you manage Kubernetes applications.

## Prerequisites

- Kubernetes cluster is set up.
- Helm is installed.

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

3. **Verify Installation:**

   ```bash
   kubectl get pods
   ```

:::warning

If you intend to scale Open WebUI using multiple nodes/pods/workers in a clustered environment, you need to setup a NoSQL key-value database.
There are some [environment variables](https://docs.openwebui.com/getting-started/env-configuration/) that need to be set to the same value for all service-instances, otherwise consistency problems, faulty sessions and other issues will occur!

:::

## Access the WebUI

Set up port forwarding or load balancing to access Open WebUI from outside the cluster.
