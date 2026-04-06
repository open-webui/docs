## Prerequisites

- A running Kubernetes cluster (v1.24+)
- [Helm](https://helm.sh/docs/intro/install/) v3 installed
- `kubectl` configured to access your cluster
- [Open WebUI Enterprise License](https://openwebui.com/enterprise) (required for production use)

## Deploy with Helm

The Open WebUI Helm chart includes Terminals as an optional subchart. Add a `terminals` section to your values file:

```yaml
# values.yaml
terminals:
  enabled: true
  apiKey: ""  # Auto-generated if left empty

  crd:
    install: true

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

Then install or upgrade:

```bash
helm upgrade --install open-webui open-webui/open-webui \
  -f values.yaml \
  --namespace open-webui --create-namespace
```

:::tip Auto-configured connection
When `terminals.enabled` is `true`, the chart automatically sets `TERMINAL_SERVER_CONNECTIONS` to point at the in-cluster orchestrator. No manual connection setup is needed.
:::

### Verify

```bash
# Check that all pods are running
kubectl get pods -n open-webui -l app.kubernetes.io/part-of=open-terminal

# Check that the CRD is installed
kubectl get crd terminals.openwebui.com
```

---

## What gets deployed

When `terminals.enabled: true`, the chart creates:

| Resource | Purpose |
| :--- | :--- |
| **CRD** (`terminals.openwebui.com`) | Defines the `Terminal` custom resource |
| **Operator Deployment** | Kopf controller that watches Terminal CRs and provisions Pods, Services, PVCs, Secrets |
| **Orchestrator Deployment + Service** | FastAPI service that receives requests from Open WebUI and proxies to user Pods |
| **Secret** | Shared API key (auto-generated if not provided) |

For **each user terminal**, the operator creates a Pod, Service, Secret (API key), and optionally a PVC for persistent storage.

---

## Lifecycle

When a user activates a terminal, the orchestrator creates a `Terminal` CR. The operator provisions a Pod with a Service, Secret, and optional PVC. Once the Pod passes readiness checks, the orchestrator proxies traffic to it.

When a terminal has been idle longer than `idleTimeoutMinutes`, the operator deletes the Pod but keeps the PVC and Secret. On the next request, a fresh Pod is created with the same PVC reattached, so **user data persists** across idle cycles.

```bash
# List all terminals
kubectl get terminals -n open-webui

# Inspect a specific terminal
kubectl describe terminal <name> -n open-webui

# Delete a terminal (child resources are garbage-collected automatically)
kubectl delete terminal <name> -n open-webui
```

---

## Monitoring

```bash
# Operator logs
kubectl logs -n open-webui deployment/<release>-terminals-operator --tail=50

# Orchestrator logs
kubectl logs -n open-webui deployment/<release>-terminals-orchestrator --tail=50
```

---

<details>
<summary>Terminal CRD reference</summary>

### Spec fields

| Field | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `userId` | string | *(required)* | Open WebUI user ID |
| `image` | string | `ghcr.io/open-webui/open-terminal:latest` | Container image |
| `resources.requests.cpu` | string | `100m` | CPU request |
| `resources.requests.memory` | string | `256Mi` | Memory request |
| `resources.limits.cpu` | string | `1` | CPU limit |
| `resources.limits.memory` | string | `1Gi` | Memory limit |
| `idleTimeoutMinutes` | integer | `30` | Idle timeout before Pod is stopped |
| `packages` | array | `[]` | Apt packages to pre-install |
| `pipPackages` | array | `[]` | Pip packages to pre-install |
| `persistence.enabled` | boolean | `true` | Enable persistent storage |
| `persistence.size` | string | `1Gi` | PVC size |
| `persistence.storageClass` | string | *(cluster default)* | Storage class |

### Status fields

| Field | Description |
| :--- | :--- |
| `phase` | `Pending`, `Provisioning`, `Running`, `Idle`, or `Error` |
| `podName` | Name of the terminal Pod |
| `serviceUrl` | In-cluster URL for the terminal |
| `apiKeySecret` | Secret holding the terminal's API key |
| `lastActivityAt` | Timestamp of last proxied request |

</details>

<details>
<summary>Full Helm values reference</summary>

| Key | Default | Description |
| :--- | :--- | :--- |
| `terminals.enabled` | `false` | Enable the Terminals subchart |
| `terminals.apiKey` | (empty) | Shared API key (auto-generated if empty) |
| `terminals.existingSecret` | (empty) | Pre-existing Secret name (key: `api-key`) |
| `terminals.crd.install` | `true` | Install the Terminal CRD |
| `terminals.operator.image.repository` | `ghcr.io/open-webui/terminals-operator` | Operator image |
| `terminals.operator.image.tag` | `latest` | Operator image tag |
| `terminals.operator.replicaCount` | `1` | Operator replicas |
| `terminals.orchestrator.image.repository` | `ghcr.io/open-webui/terminals` | Orchestrator image |
| `terminals.orchestrator.image.tag` | `latest` | Orchestrator image tag |
| `terminals.orchestrator.backend` | `kubernetes-operator` | Backend type |
| `terminals.orchestrator.terminalImage` | `ghcr.io/open-webui/open-terminal:latest` | Default image for user Pods |
| `terminals.orchestrator.idleTimeoutMinutes` | `30` | Idle timeout (minutes) |
| `terminals.orchestrator.service.type` | `ClusterIP` | Orchestrator Service type |
| `terminals.orchestrator.service.port` | `8080` | Orchestrator Service port |

</details>

<details>
<summary>RBAC requirements (manual install only)</summary>

If not using the Helm chart, the operator's ServiceAccount needs a ClusterRole with:

| Resource | Verbs |
| :--- | :--- |
| `terminals.openwebui.com` | get, list, watch, create, update, patch, delete |
| `pods`, `services`, `persistentvolumeclaims`, `secrets` | get, list, watch, create, update, patch, delete |
| `events` | create |
| `configmaps`, `leases` | get, list, watch, create, update, patch |

</details>
